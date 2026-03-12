import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  TruckIcon,
  ShieldCheck,
  Settings,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sessions", icon: ClipboardList, label: "Sessions" },
  { to: "/suppliers", icon: TruckIcon, label: "Suppliers" },
  { to: "/haccp", icon: ShieldCheck, label: "HACCP" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "hsl(var(--mt-surface-0))",
        borderTop: "1px solid hsl(var(--mt-border))",
        height: "64px",
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
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
