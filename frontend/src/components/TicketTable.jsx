export default function TicketTable({ rows }) {
  return (
    <div className="glass-panel overflow-hidden rounded-3xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/70 text-xs uppercase tracking-[0.2em] text-slate-500">
          <tr>
            <th className="px-6 py-4">Ticket</th>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4">Channel</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-white/60">
              <td className="px-6 py-4 font-semibold text-slate-900">{row.id}</td>
              <td className="px-6 py-4 text-slate-600">{row.subject || "(no subject)"}</td>
              <td className="px-6 py-4 text-slate-600">{row.channel || "-"}</td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {row.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">{row.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
