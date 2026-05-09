from pydantic import BaseModel


class AnalyticsResponse(BaseModel):
    total_conversations: int
    total_tickets: int
    escalation_rate: float
    avg_confidence: float
