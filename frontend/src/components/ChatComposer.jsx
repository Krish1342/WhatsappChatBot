export default function ChatComposer({ value, onChange, onSend, disabled }) {
  return (
    <div className="glass-panel mt-6 flex items-center gap-3 rounded-3xl px-4 py-3">
      <span className="rounded-2xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
        WhatsApp
      </span>
      <input
        className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
        placeholder="Type a reply..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !disabled) {
            onSend();
          }
        }}
        disabled={disabled}
      />
      <button
        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={onSend}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
