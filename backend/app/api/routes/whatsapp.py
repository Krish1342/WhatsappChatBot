from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from twilio.twiml.messaging_response import MessagingResponse

from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.message import Message, SenderType
from app.models.ticket import Ticket, TicketPriority, TicketStatus
from app.services.orchestration.graph import build_support_graph
from app.services.whatsapp.validator import validate_twilio_request

router = APIRouter()
public_router = APIRouter()
_graph = build_support_graph()


async def _handle_whatsapp_webhook(
    request: Request,
    body: str,
    from_number: str,
    profile_name: str | None,
    db: AsyncSession,
) -> Response:
    if not body.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    form = await request.form()
    validate_twilio_request(request, dict(form))

    conversation = Conversation(channel="whatsapp")
    db.add(conversation)
    await db.flush()

    db.add(
        Message(
            conversation_id=conversation.id,
            sender_type=SenderType.user,
            content=body,
        )
    )

    result = _graph.invoke(
        {
            "query": body,
            "user_id": from_number,
            "channel": "whatsapp",
            "profile_name": profile_name,
        }
    )
    response_text = result.get("final_response") or result.get("response") or "Thanks for reaching out."
    should_escalate = bool(result.get("should_escalate"))
    ticket_summary = result.get("ticket_summary")

    db.add(
        Message(
            conversation_id=conversation.id,
            sender_type=SenderType.ai,
            content=response_text,
        )
    )

    if should_escalate:
        ticket = Ticket(
            conversation_id=conversation.id,
            status=TicketStatus.open,
            priority=TicketPriority.high,
            subject=result.get("classification"),
            summary=ticket_summary or body,
        )
        db.add(ticket)
        await db.flush()
        response_text = _ensure_ticket_id(response_text, ticket.id)

    await db.commit()

    twiml = MessagingResponse()
    twiml.message(response_text)
    return Response(content=str(twiml), media_type="application/xml")


def _ensure_ticket_id(response_text: str, ticket_id: str) -> str:
    if ticket_id in response_text:
        return response_text
    return f"{response_text}\n\nTicket ID: {ticket_id}".strip()


@router.post("/webhooks/whatsapp")
async def whatsapp_webhook(
    request: Request,
    body: str = Form(..., alias="Body"),
    from_number: str = Form(..., alias="From"),
    profile_name: str | None = Form(None, alias="ProfileName"),
    db: AsyncSession = Depends(get_db),
) -> Response:
    return await _handle_whatsapp_webhook(request, body, from_number, profile_name, db)


@public_router.post("/")
async def whatsapp_webhook_root(
    request: Request,
    body: str = Form(..., alias="Body"),
    from_number: str = Form(..., alias="From"),
    profile_name: str | None = Form(None, alias="ProfileName"),
    db: AsyncSession = Depends(get_db),
) -> Response:
    return await _handle_whatsapp_webhook(request, body, from_number, profile_name, db)
