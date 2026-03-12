import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Bell } from "lucide-react";
import { ALERTS } from "@/lib/mock-data";

export function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "OPERATOR") return <Navigate to="/app" replace />;

  const unresolvedAlerts = ALERTS.filter((a) => !a.resolved).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header
            className="h-14 flex items-center justify-between px-4 md:px-8"
            style={{
              background: 'hsl(var(--mt-surface-0))',
              borderBottom: '1px solid hsl(var(--mt-border))',
            }}
          >
            <div className="flex items-center gap-3">
              <SidebarTrigger className="md:inline" />
              <span className="mt-data-sm hidden sm:inline">
                {new Date().toLocaleDateString("en-ZA", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="relative p-2 rounded-md transition-colors"
                style={{ color: 'hsl(var(--mt-text-muted))' }}
              >
                <Bell className="w-4 h-4" />
                {unresolvedAlerts > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'hsl(var(--mt-alert))' }}
                  >
                    {unresolvedAlerts}
                  </span>
                )}
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'hsl(var(--mt-gold))', color: 'hsl(var(--mt-navy))' }}
              >
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </header>

          {/* Content area - add bottom padding on mobile for bottom nav */}
          <main
            className="flex-1 overflow-auto pb-16 md:pb-0"
            style={{ background: 'hsl(var(--mt-surface-1))' }}
          >
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
