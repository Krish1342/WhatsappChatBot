import { useEffect, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import api from "../services/api.js";

const statusOptions = ["open", "pending", "resolved", "closed"];
const priorityOptions = ["low", "medium", "high", "urgent"];

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [saving, setSaving] = useState({});

  const loadTickets = async () => {
    try {
      const response = await api.get("/api/tickets");
      setTickets(response.data);
    } catch (error) {
      setTickets([]);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateTicket = async (ticketId, updates) => {
    setSaving((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await api.patch(`/api/tickets/${ticketId}`, updates);
      await loadTickets();
    } catch (error) {
      // ignore for demo
    } finally {
      setSaving((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleChange = (ticketId, field, value) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  return (
    <AppShell title="Admin Console" subtitle="Ticket control center">
      <div className="glass-panel overflow-hidden rounded-3xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/70 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-6 py-4">Ticket</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-white/60">
                <td className="px-6 py-4 font-semibold text-slate-900">{ticket.id}</td>
                <td className="px-6 py-4 text-slate-600">{ticket.channel || "-"}</td>
                <td className="px-6 py-4 text-slate-600">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
                    value={ticket.subject || ""}
                    onChange={(event) =>
                      handleChange(ticket.id, "subject", event.target.value)
                    }
                    placeholder="Add subject"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
                    value={ticket.priority}
                    onChange={(event) =>
                      handleChange(ticket.id, "priority", event.target.value)
                    }
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
                    value={ticket.status}
                    onChange={(event) =>
                      handleChange(ticket.id, "status", event.target.value)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {ticket.updated_at
                    ? new Date(ticket.updated_at).toLocaleString()
                    : ticket.created_at
                      ? new Date(ticket.created_at).toLocaleString()
                      : "-"}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                    onClick={() =>
                      updateTicket(ticket.id, {
                        subject: ticket.subject,
                        status: ticket.status,
                        priority: ticket.priority,
                      })
                    }
                    disabled={saving[ticket.id]}
                  >
                    {saving[ticket.id] ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
