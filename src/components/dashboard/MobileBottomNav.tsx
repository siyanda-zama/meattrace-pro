import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  LayoutDashboard,
  ClipboardList,
  TruckIcon,
  ShieldCheck,
  Settings,
  FileBarChart,
  LogOut,
} from "lucide-react";

interface NavItem {
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Different nav items based on role
  const getNavItems = (): NavItem[] => {
    if (user?.role === "AUDITOR") {
      return [
        { to: "/auditor", icon: ShieldCheck, label: "Audit" },
        { to: "/sessions", icon: ClipboardList, label: "Sessions" },
        { to: "/reports", icon: FileBarChart, label: "Reports" },
        { to: "/settings", icon: Settings, label: "Settings" },
        { icon: LogOut, label: "Logout", onClick: handleLogout },
      ];
    }

    // Admin, Manager, Operator
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/sessions", icon: ClipboardList, label: "Sessions" },
      { to: "/suppliers", icon: TruckIcon, label: "Suppliers" },
      { to: "/haccp", icon: ShieldCheck, label: "HACCP" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "hsl(var(--mt-surface-0))",
        borderTop: "1px solid hsl(var(--mt-border))",
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.to ? location.pathname === item.to : false;

          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors"
                style={{
                  color: "hsl(var(--mt-text-muted))",
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to!}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors"
              style={{
                color: isActive
                  ? "hsl(var(--mt-gold))"
                  : "hsl(var(--mt-text-muted))",
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
