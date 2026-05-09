const barSeries = [42, 58, 36, 72, 64, 88, 52];

export default function BarChart({ title, subtitle }) {
  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {subtitle}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{title}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          +14%
        </span>
      </div>
      <div className="mt-6 flex items-end gap-3">
        {barSeries.map((value, index) => (
          <div
            key={`bar-${index}`}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className="w-full rounded-2xl bg-slate-900/80"
              style={{ height: `${value}%` }}
            />
            <span className="text-[10px] text-slate-400">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
