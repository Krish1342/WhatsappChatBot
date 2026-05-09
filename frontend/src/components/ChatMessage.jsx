export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-3xl px-5 py-4 text-sm shadow-sm ${
          isUser
            ? "bg-slate-900 text-white"
            : "glass-panel text-slate-700"
        }`}
      >
        <p
          className={`text-xs uppercase tracking-[0.2em] ${
            isUser ? "text-white/60" : "text-slate-500"
          }`}
        >
          {isUser ? "Customer" : "SupportPilot"}
        </p>
        <p className="mt-2 leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
