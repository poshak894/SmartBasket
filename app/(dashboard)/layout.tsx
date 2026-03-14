import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50 lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <TopBar />
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
