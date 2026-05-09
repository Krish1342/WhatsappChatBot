from __future__ import annotations

import json
import logging
import uuid

from app.core.config import settings
from app.services.llm.groq_client import GroqClient
from app.services.orchestration.state import SupportState
from app.services.rag.retrieval import RetrievalService

logger = logging.getLogger(__name__)


def classify_query(state: SupportState) -> SupportState:
    query = state.get("query", "")
    prompt = (
        "Classify the customer support query into one of: billing, technical, account, "
        "shipping, complaint, general. Return JSON with {\"label\": \"...\"}.\n\n"
        f"Query: {query}"
    )
    response = GroqClient().generate(prompt).text
    label = _parse_json_field(response, "label") or _heuristic_classification(query)
    return {"classification": label}


def retrieve_context(state: SupportState) -> SupportState:
    query = state.get("query", "")
    retrieval = RetrievalService()
    results = retrieval.retrieve(query)
    context = "\n\n".join([item.text for item in results])
    return {"retrieved_chunks": [item.__dict__ for item in results], "context": context}


def generate_response(state: SupportState) -> SupportState:
    query = state.get("query", "")
    context = state.get("context", "")
    classification = state.get("classification", "general")
    prompt = (
        "You are SupportPilot AI. Write a concise, helpful response. "
        "Use the provided context if relevant, otherwise answer based on best practices. "
        f"Classification: {classification}\n"
        f"Context:\n{context}\n\n"
        f"Customer: {query}"
    )
    response = GroqClient().generate(prompt).text
    if not response:
        response = "Thanks for reaching out. I am gathering the details and will update you shortly."
    return {"response": response}


def evaluate_confidence(state: SupportState) -> SupportState:
    response = state.get("response", "")
    context = state.get("context", "")
    prompt = (
        "Score confidence from 0 to 1 for the response given the context. "
        "Return JSON with {\"confidence\": 0.0}.\n\n"
        f"Context:\n{context}\n\nResponse:\n{response}"
    )
    llm_text = GroqClient().generate(prompt).text
    confidence = _parse_json_float(llm_text, "confidence")
    if confidence is None:
        confidence = _heuristic_confidence(state)
    confidence = max(0.0, min(1.0, confidence))
    confidence = max(confidence, settings.confidence_floor)
    return {"confidence": confidence}


def analyze_sentiment(state: SupportState) -> SupportState:
    query = state.get("query", "")
    prompt = (
        "Analyze sentiment as positive, neutral, or negative. "
        "Return JSON with {\"label\": \"...\", \"score\": 0.0}.\n\n"
        f"Query: {query}"
    )
    llm_text = GroqClient().generate(prompt).text
    label = _parse_json_field(llm_text, "label")
    score = _parse_json_float(llm_text, "score")
    if label is None or score is None:
        label, score = _heuristic_sentiment(query)
    return {"sentiment": label, "sentiment_score": score}


def escalation_decision(state: SupportState) -> SupportState:
    confidence = state.get("confidence", 0.0)
    sentiment = state.get("sentiment", "neutral")
    sentiment_score = state.get("sentiment_score", 0.0)
    classification = state.get("classification", "general")

    low_confidence = confidence < settings.escalation_confidence_threshold
    negative_sentiment = sentiment == "negative" and sentiment_score <= settings.escalation_negative_threshold
    high_risk_class = classification in {"billing", "complaint"}

    auto_resolve = {
        item.strip() for item in settings.auto_resolve_classes.split(",") if item.strip()
    }
    prefers_auto_resolve = classification in auto_resolve and not negative_sentiment

    should_escalate = low_confidence or negative_sentiment or high_risk_class
    if prefers_auto_resolve and not high_risk_class:
        should_escalate = False
    return {"should_escalate": should_escalate}


def create_ticket(state: SupportState) -> SupportState:
    ticket_id = str(uuid.uuid4())
    return {"ticket_id": ticket_id}


def summarize_ticket(state: SupportState) -> SupportState:
    query = state.get("query", "")
    response = state.get("response", "")
    prompt = (
        "Summarize the issue in 2-3 sentences for a support ticket.\n\n"
        f"Customer query: {query}\n\nProposed response: {response}"
    )
    summary = GroqClient().generate(prompt).text
    if not summary:
        summary = query[:240]
    return {"ticket_summary": summary}


def final_response(state: SupportState) -> SupportState:
    response = state.get("response", "")
    if state.get("should_escalate"):
        response = (
            f"{response}\n\n"
            "I have escalated this to our support team for review. "
            "They will follow up shortly."
        )
    return {"final_response": response}


def _parse_json_field(text: str, field: str) -> str | None:
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return None
    value = payload.get(field)
    if isinstance(value, str):
        return value
    return None


def _parse_json_float(text: str, field: str) -> float | None:
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return None
    value = payload.get(field)
    if isinstance(value, (int, float)):
        return float(value)
    return None


def _heuristic_confidence(state: SupportState) -> float:
    chunks = state.get("retrieved_chunks", [])
    if not chunks:
        return 0.65
    scores = [chunk.get("score", 0.0) for chunk in chunks]
    normalized = [min(1.0, max(0.0, score)) for score in scores]
    return sum(normalized) / len(normalized)


def _heuristic_sentiment(text: str) -> tuple[str, float]:
    lowered = text.lower()
    negative_keywords = ["angry", "frustrated", "refund", "cancel", "complaint", "terrible"]
    positive_keywords = ["thanks", "great", "awesome", "love", "appreciate"]

    if any(word in lowered for word in negative_keywords):
        return "negative", -0.6
    if any(word in lowered for word in positive_keywords):
        return "positive", 0.6
    return "neutral", 0.0


def _heuristic_classification(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["refund", "charge", "invoice", "billing"]):
        return "billing"
    if any(word in lowered for word in ["login", "password", "error", "bug"]):
        return "technical"
    if any(word in lowered for word in ["cancel", "complaint", "angry"]):
        return "complaint"
    if any(word in lowered for word in ["shipping", "delivery", "tracking"]):
        return "shipping"
    if any(word in lowered for word in ["account", "profile", "subscription"]):
        return "account"
    return "general"
