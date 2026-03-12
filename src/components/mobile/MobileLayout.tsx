import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Home, ClipboardList, ShieldCheck, Weight, Package, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { motion } from "framer-motion";

const NAV = [
  { path: "/app", icon: Home, label: "Home" },
  { path: "/app/intake", icon: ClipboardList, label: "Intake" },
  { path: "/app/haccp", icon: ShieldCheck, label: "HACCP" },
  { path: "/app/weigh", icon: Weight, label: "Weigh" },
  { path: "/app/byproducts", icon: Package, label: "By-Prod" },
  { path: "/app/sync", icon: RefreshCw, label: "Sync" },
];

function HexagonLogoSmall() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z" fill="hsl(42, 64%, 45%)" />
      <path d="M12 12L16 8L20 12V20L16 24L12 20V12Z" fill="hsl(213, 65%, 15%)" />
      <path d="M14 14L16 12L18 14V18L16 20L14 18V14Z" fill="hsl(42, 64%, 45%)" />
    </svg>
  );
}

export function MobileLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div
      className="min-h-screen flex flex-col max-w-lg mx-auto"
      style={{ background: 'hsl(213, 65%, 15%)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <HexagonLogoSmall />
          <span className="text-sm font-semibold text-white">MeatTrace</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(142, 72%, 37%)' }} />
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Online</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-2 h-16"
        style={{
          background: 'hsl(216, 68%, 10%)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex justify-around h-full items-center">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center py-2 px-3 transition-colors"
              >
                <item.icon
                  className="w-5 h-5"
                  style={{ color: active ? 'hsl(42, 64%, 45%)' : 'rgba(255,255,255,0.4)' }}
                />
                <span
                  className="text-[10px] mt-0.5 font-medium"
                  style={{ color: active ? 'hsl(42, 64%, 45%)' : 'rgba(255,255,255,0.4)' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
