import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Home, ClipboardList, ShieldCheck, Weight, Package, RefreshCw, Shield } from "lucide-react";
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

export function MobileLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-primary">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-accent-foreground" />
          </div>
          <span className="text-sm font-bold text-primary-foreground">MeatTrace</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-primary-foreground/70">Online</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card border-t border-border px-2 py-1 safe-bottom">
        <div className="flex justify-around">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  active ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="w-1 h-1 rounded-full bg-accent mt-0.5"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
