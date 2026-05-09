import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import ChatComposer from "../components/ChatComposer.jsx";
import ChatMessage from "../components/ChatMessage.jsx";
import api from "../services/api.js";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! Share the issue and I will start investigating.",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [status, setStatus] = useState("Idle");

  const tags = useMemo(() => {
    if (status === "Escalated") {
      return ["Escalation started", "Needs human", "Sentiment: negative"];
    }
    if (status === "Thinking") {
      return ["Drafting reply", "Confidence pending", "RAG lookup"];
    }
    return ["High confidence", "Billing", "Sentiment: neutral", "Auto-escalation off"];
  }, [status]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    setStatus("Thinking");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    try {
      const response = await api.post("/api/chat", {
        query: trimmed,
        conversation_id: conversationId,
        channel: "web",
      });
      const payload = response.data;
      setConversationId(payload.conversation_id);
      setMessages((prev) => [...prev, { role: "assistant", content: payload.response }]);
      setStatus(payload.should_escalate ? "Escalated" : "Resolved");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I hit an error. Please try again." },
      ]);
      setStatus("Error");
    }
  };

  return (
    <AppShell title="Live Conversation" subtitle="Omnichannel inbox">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="glass-panel flex flex-col gap-6 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active thread</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Rhea Patel</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              WhatsApp
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </div>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={status === "Thinking"}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI summary</p>
            <p className="mt-4 text-sm text-slate-600">
              {status === "Escalated"
                ? "Escalation requested. Ticket created for the human team."
                : "Active conversation with AI guidance."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Suggested actions</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
              <button className="rounded-2xl bg-slate-900 px-4 py-3 text-left text-white">
                Issue refund request
              </button>
              <button className="rounded-2xl bg-white/80 px-4 py-3 text-left">
                Escalate to billing team
              </button>
              <button className="rounded-2xl bg-white/80 px-4 py-3 text-left">
                Send apology credit
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
