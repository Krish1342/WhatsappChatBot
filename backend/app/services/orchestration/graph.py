from __future__ import annotations

from langgraph.graph import END, StateGraph

from app.services.orchestration.nodes import (
    analyze_sentiment,
    classify_query,
    create_ticket,
    escalation_decision,
    evaluate_confidence,
    final_response,
    generate_response,
    retrieve_context,
    summarize_ticket,
)
from app.services.orchestration.state import SupportState


def build_support_graph():
    graph = StateGraph(SupportState)

    graph.add_node("classify_query", classify_query)
    graph.add_node("retrieve_context", retrieve_context)
    graph.add_node("generate_response", generate_response)
    graph.add_node("evaluate_confidence", evaluate_confidence)
    graph.add_node("analyze_sentiment", analyze_sentiment)
    graph.add_node("escalation_decision", escalation_decision)
    graph.add_node("create_ticket", create_ticket)
    graph.add_node("summarize_ticket", summarize_ticket)
    graph.add_node("final_response_node", final_response)

    graph.set_entry_point("classify_query")
    graph.add_edge("classify_query", "retrieve_context")
    graph.add_edge("retrieve_context", "generate_response")
    graph.add_edge("generate_response", "evaluate_confidence")
    graph.add_edge("evaluate_confidence", "analyze_sentiment")
    graph.add_edge("analyze_sentiment", "escalation_decision")

    graph.add_conditional_edges(
        "escalation_decision",
        lambda state: "escalate" if state.get("should_escalate") else "respond",
        {"escalate": "create_ticket", "respond": "final_response_node"},
    )

    graph.add_edge("create_ticket", "summarize_ticket")
    graph.add_edge("summarize_ticket", "final_response_node")
    graph.add_edge("final_response_node", END)

    return graph.compile()
