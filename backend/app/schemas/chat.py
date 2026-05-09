from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str
    conversation_id: str | None = None
    user_id: str | None = None
    channel: str = "web"


class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    should_escalate: bool
    ticket_id: str | None = None
    ticket_summary: str | None = None
