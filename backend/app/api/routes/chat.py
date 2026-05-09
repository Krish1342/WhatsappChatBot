from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.message import Message, SenderType
from app.models.ticket import Ticket, TicketPriority, TicketStatus
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.orchestration.graph import build_support_graph

router = APIRouter()
_graph = build_support_graph()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest, db: AsyncSession = Depends(get_db)
) -> ChatResponse:
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query is required")

    conversation_id = request.conversation_id
    if conversation_id:
        result = await db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()
    else:
        conversation = None

    if not conversation:
        conversation = Conversation(channel=request.channel)
        db.add(conversation)
        await db.flush()
        conversation_id = conversation.id

    db.add(
        Message(
            conversation_id=conversation_id,
            sender_type=SenderType.user,
            content=request.query,
        )
    )

    graph_result = _graph.invoke(
        {
            "query": request.query,
            "user_id": request.user_id,
            "channel": request.channel,
        }
    )

    response_text = (
        graph_result.get("final_response") or graph_result.get("response") or ""
    )
    should_escalate = bool(graph_result.get("should_escalate"))
    ticket_summary = graph_result.get("ticket_summary")

    ticket_id = None
    if should_escalate:
        ticket = Ticket(
            conversation_id=conversation_id,
            status=TicketStatus.open,
            priority=TicketPriority.high,
            subject=graph_result.get("classification"),
            summary=ticket_summary or request.query,
        )
        db.add(ticket)
        await db.flush()
        ticket_id = ticket.id
        response_text = _ensure_ticket_id(response_text, ticket_id)

    db.add(
        Message(
            conversation_id=conversation_id,
            sender_type=SenderType.ai,
            content=response_text,
        )
    )

    await db.commit()

    return ChatResponse(
        conversation_id=conversation_id,
        response=response_text,
        should_escalate=should_escalate,
        ticket_id=ticket_id,
        ticket_summary=ticket_summary,
    )


def _ensure_ticket_id(response_text: str, ticket_id: str) -> str:
    if ticket_id in response_text:
        return response_text
    return f"{response_text}\n\nTicket ID: {ticket_id}".strip()
