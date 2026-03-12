import { motion } from "framer-motion";
import { ClipboardList, ShieldCheck, Weight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SESSIONS } from "@/lib/mock-data";

const ACTIONS = [
  { icon: ClipboardList, label: "Start Intake", path: "/app/intake", color: "bg-accent text-accent-foreground" },
  { icon: ShieldCheck, label: "Log CCP", path: "/app/haccp", color: "bg-success text-success-foreground" },
  { icon: Weight, label: "Weigh Animal", path: "/app/weigh", color: "bg-primary text-primary-foreground" },
  { icon: Package, label: "By-Products", path: "/app/byproducts", color: "bg-warning text-warning-foreground" },
];

const MobileHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const activeSession = SESSIONS.find((s) => s.status === "in-progress");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold">Hey, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground">Floor operations dashboard</p>
      </div>

      {/* Active Session */}
      {activeSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-accent p-4 shadow-gold"
        >
          <p className="text-xs font-medium text-accent-foreground/70 uppercase tracking-wider">Active Session</p>
          <p className="text-lg font-bold text-accent-foreground font-mono mt-1">{activeSession.id}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-accent-foreground/80">
            <span>{activeSession.animalCount} animals</span>
            <span>Step {activeSession.step}/5</span>
          </div>
          {/* Progress */}
          <div className="mt-3 h-1.5 rounded-full bg-accent-foreground/20">
            <div
              className="h-full rounded-full bg-accent-foreground transition-all"
              style={{ width: `${(activeSession.step / 5) * 100}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(action.path)}
            className={`${action.color} rounded-lg p-5 text-left shadow-card active:scale-[0.98] transition-transform`}
          >
            <action.icon className="w-6 h-6 mb-3" />
            <span className="text-sm font-semibold">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Sync Status */}
      <div className="bg-card rounded-lg p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Pending Sync</p>
            <p className="text-lg font-bold font-mono">0 records</p>
          </div>
          <div className="text-xs text-muted-foreground">Last sync: just now</div>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
