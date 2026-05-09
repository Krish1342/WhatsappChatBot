from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.ticket import Ticket
from app.schemas.analytics import AnalyticsResponse

router = APIRouter()


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(db: AsyncSession = Depends(get_db)) -> AnalyticsResponse:
    conversation_count = await db.scalar(select(func.count()).select_from(Conversation))
    ticket_count = await db.scalar(select(func.count()).select_from(Ticket))

    total_conversations = int(conversation_count or 0)
    total_tickets = int(ticket_count or 0)
    escalation_rate = (
        (total_tickets / total_conversations) if total_conversations else 0.0
    )

    return AnalyticsResponse(
        total_conversations=total_conversations,
        total_tickets=total_tickets,
        escalation_rate=round(escalation_rate, 3),
        avg_confidence=0.74,
    )
