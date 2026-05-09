export default function StatCard({ label, value, trend }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {trend}
        </span>
      </div>
    </div>
  );
}
