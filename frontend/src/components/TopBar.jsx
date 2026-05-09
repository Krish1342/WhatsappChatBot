export default function TopBar({ title, subtitle }) {
  return (
    <header className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{subtitle}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-600">
          <span className="text-slate-400">Search</span>
          <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
            Cmd K
          </span>
        </div>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          New action
        </button>
      </div>
    </header>
  );
}
