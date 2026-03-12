import { motion } from "framer-motion";
import { ClipboardList, ShieldCheck, Weight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SESSIONS } from "@/lib/mock-data";

const ACTIONS = [
  { icon: ClipboardList, label: "Start Intake", path: "/app/intake" },
  { icon: ShieldCheck, label: "Log CCP", path: "/app/haccp" },
  { icon: Weight, label: "Weigh Animal", path: "/app/weigh" },
  { icon: Package, label: "By-Products", path: "/app/byproducts" },
];

const MobileHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const activeSession = SESSIONS.find((s) => s.status === "in-progress");

  return (
    <div className="space-y-5">
      {/* Session status header */}
      {activeSession && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>
            {activeSession.id}
          </span>
          <div className="flex items-center gap-2">
            <span className="badge-live">Live</span>
            <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(142, 72%, 37%)' }} />
          </div>
        </div>
      )}

      {/* Active Session Card */}
      {activeSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.09em]" style={{ color: 'hsl(42, 64%, 45%)' }}>
            Active Session
          </p>
          <p className="font-mono text-2xl font-medium text-white mt-1">{activeSession.id}</p>
          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span>{activeSession.animalCount} animals</span>
            <span>Step {activeSession.step}/5</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(activeSession.step / 5) * 100}%`, background: 'hsl(42, 64%, 45%)' }}
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
            className="p-5 rounded-xl text-left active:scale-[0.98] transition-transform"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <action.icon className="w-6 h-6 mb-3" style={{ color: 'hsl(42, 64%, 45%)' }} />
            <span className="text-sm font-semibold text-white">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Sync Status */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Pending Sync</p>
            <p className="font-mono text-lg font-medium text-white">0 records</p>
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Last sync: just now</div>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
