export default function DonutChart({ value, label }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - circumference * value;

  return (
    <div className="glass-panel flex items-center gap-6 rounded-3xl p-6">
      <svg viewBox="0 0 100 100" className="h-20 w-20">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#0f172a"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {Math.round(value * 100)}%
        </p>
      </div>
    </div>
  );
}
