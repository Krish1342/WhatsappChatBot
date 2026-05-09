from __future__ import annotations

from typing import TypedDict


class SupportState(TypedDict, total=False):
    query: str
    user_id: str | None
    channel: str
    profile_name: str | None
    classification: str
    context: str
    retrieved_chunks: list[dict]
    response: str
    confidence: float
    sentiment: str
    sentiment_score: float
    should_escalate: bool
    ticket_id: str | None
    ticket_summary: str
    final_response: str
