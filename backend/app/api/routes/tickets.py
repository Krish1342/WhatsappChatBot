from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.ticket import Ticket, TicketPriority, TicketStatus
from app.schemas.tickets import TicketSummary, TicketUpdate

router = APIRouter()


@router.get("/tickets", response_model=list[TicketSummary])
async def list_tickets(db: AsyncSession = Depends(get_db)) -> list[TicketSummary]:
    result = await db.execute(
        select(Ticket)
        .options(selectinload(Ticket.conversation))
        .order_by(Ticket.created_at.desc())
    )
    tickets = result.scalars().all()
    return [
        TicketSummary(
            id=ticket.id,
            subject=ticket.subject,
            summary=ticket.summary,
            channel=ticket.conversation.channel if ticket.conversation else None,
            status=ticket.status.value,
            priority=ticket.priority.value,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
        )
        for ticket in tickets
    ]


@router.patch("/tickets/{ticket_id}", response_model=TicketSummary)
async def update_ticket(
    ticket_id: str,
    payload: TicketUpdate,
    db: AsyncSession = Depends(get_db),
) -> TicketSummary:
    result = await db.execute(
        select(Ticket)
        .options(selectinload(Ticket.conversation))
        .where(Ticket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if payload.subject is not None:
        ticket.subject = payload.subject
    if payload.summary is not None:
        ticket.summary = payload.summary
    if payload.status is not None:
        ticket.status = TicketStatus(payload.status)
    if payload.priority is not None:
        ticket.priority = TicketPriority(payload.priority)

    await db.commit()
    await db.refresh(ticket)

    return TicketSummary(
        id=ticket.id,
        subject=ticket.subject,
        summary=ticket.summary,
        channel=ticket.conversation.channel if ticket.conversation else None,
        status=ticket.status.value,
        priority=ticket.priority.value,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
    )
