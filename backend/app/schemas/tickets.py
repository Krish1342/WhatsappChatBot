from datetime import datetime

from pydantic import BaseModel


class TicketSummary(BaseModel):
    id: str
    subject: str | None
    summary: str | None
    channel: str | None = None
    status: str
    priority: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class TicketUpdate(BaseModel):
    subject: str | None = None
    summary: str | None = None
    status: str | None = None
    priority: str | None = None
