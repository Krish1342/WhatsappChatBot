const chartData = [12, 26, 18, 32, 28, 45, 38, 52, 41, 58, 46, 62];

export default function ChartCard({ title, value, subtitle }) {
  const points = chartData
    .map((point, index) => `${index * 20},${80 - point}`)
    .join(" ");

  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {subtitle}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{title}</p>
        </div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="mt-6">
        <svg viewBox="0 0 220 90" className="h-24 w-full">
          <defs>
            <linearGradient id="spark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#spark)"
            strokeWidth="4"
            strokeLinecap="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}
