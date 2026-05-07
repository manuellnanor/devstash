"use client";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-1">
      <aside className="w-64 border-r border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Main</h2>
        </div>
        {children}
      </main>
    </div>
  );
}
