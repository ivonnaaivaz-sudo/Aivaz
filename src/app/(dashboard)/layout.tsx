import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[280px] flex-1 min-w-0 flex flex-col relative shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-200/50">
        <div className="flex-1 p-8 pb-12 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}