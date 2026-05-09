import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Landing", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
  { label: "Chat", href: "/chat" },
  { label: "Tickets", href: "/tickets" },
  { label: "Knowledge", href: "/knowledge" },
];

export default function SidebarNav() {
  return (
    <aside className="glass-panel hidden w-64 flex-col rounded-[28px] p-6 md:flex">
      <div className="mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          SP
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-500">SupportPilot</p>
        <p className="text-lg font-semibold text-slate-900">Ops Suite</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2 text-sm font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 rounded-2xl bg-slate-900 px-4 py-4 text-sm text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">Live</p>
        <p className="mt-2 text-lg font-semibold">3 queues active</p>
      </div>
    </aside>
  );
}
