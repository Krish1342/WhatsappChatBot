import { useEffect, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import TicketTable from "../components/TicketTable.jsx";
import api from "../services/api.js";

const filters = ["All", "Escalated", "Open", "Pending", "Resolved"];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await api.get("/api/tickets");
        setTickets(response.data);
      } catch (error) {
        setTickets([]);
      }
    };
    loadTickets();
  }, []);

  const rows = tickets.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    channel: ticket.channel,
    priority: ticket.priority,
    status: ticket.status,
    updatedAt: ticket.updated_at
      ? new Date(ticket.updated_at).toLocaleString()
      : ticket.created_at
        ? new Date(ticket.created_at).toLocaleString()
        : "-",
  }));

  return (
    <AppShell title="Ticket Management" subtitle="Escalations and handoffs">
      <div className="flex flex-col gap-6">
        <div className="glass-panel flex flex-wrap gap-2 rounded-3xl p-4">
          {filters.map((filter) => (
            <button
              key={filter}
              className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              {filter}
            </button>
          ))}
        </div>
        <TicketTable rows={rows} />
      </div>
    </AppShell>
  );
}
