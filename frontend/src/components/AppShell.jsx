import SidebarNav from "./SidebarNav.jsx";
import TopBar from "./TopBar.jsx";

export default function AppShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-aurora text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 md:px-8">
        <SidebarNav />
        <div className="flex w-full flex-col gap-6">
          <TopBar title={title} subtitle={subtitle} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
