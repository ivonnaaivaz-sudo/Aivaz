import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[280px] flex-1 min-w-0 flex flex-col relative">
        <div className="flex-1 p-8 pb-12 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}