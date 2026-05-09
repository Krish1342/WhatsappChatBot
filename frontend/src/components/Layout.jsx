import { Link } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Chat", href: "/chat" },
  { label: "Tickets", href: "/tickets" },
  { label: "Knowledge", href: "/knowledge" },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-aurora text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/30 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              SP
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                SupportPilot AI
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Customer Support OS
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="transition hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="glass-panel hidden items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 md:flex">
            Phase 6 UI
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
