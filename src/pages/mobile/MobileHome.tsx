import { motion } from "framer-motion";
import {
  ClipboardList,
  ShieldCheck,
  Weight,
  Package,
  RefreshCw,
  Plus,
} from "lucide-react";
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

  const firstName = user?.name?.split(" ")[0] ?? "Operator";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p
          className="text-xs uppercase tracking-[0.09em]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {greeting}
        </p>
        <p className="text-xl font-semibold text-white mt-0.5">{firstName}</p>
      </motion.div>

      {/* Active Session Card */}
      {activeSession ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="p-5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.09em]"
              style={{ color: "hsl(42, 64%, 45%)" }}
            >
              Active Session
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "hsl(142, 72%, 37%)",
                }}
              >
                Live
              </span>
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "hsl(142, 72%, 37%)" }}
              />
            </div>
          </div>

          <p className="font-mono text-2xl font-medium text-white mt-2">
            {activeSession.id}
          </p>

          <div
            className="flex items-center gap-4 mt-2 text-xs"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span>{activeSession.animalCount} animals</span>
            <span>&middot;</span>
            <span>{activeSession.species}</span>
            <span>&middot;</span>
            <span>
              Step {activeSession.step}/5
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="mt-3 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activeSession.step / 5) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              style={{ background: "hsl(42, 64%, 45%)" }}
            />
          </div>
        </motion.div>
      ) : (
        /* Empty state - no active session */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="p-6 rounded-xl text-center"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <ClipboardList
              className="w-6 h-6"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
          </div>
          <p className="text-sm font-medium text-white">No Active Session</p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Start a new session to begin processing
          </p>
          <button
            onClick={() => navigate("/app/intake")}
            className="mt-4 h-[52px] w-full rounded-xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: "hsl(42, 64%, 45%)" }}
          >
            <Plus className="w-5 h-5" />
            Start New Session
          </button>
        </motion.div>
      )}

      {/* Quick Actions 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
            onClick={() => navigate(action.path)}
            className="min-h-[48px] p-5 rounded-xl text-left active:scale-[0.97] transition-transform"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <action.icon
              className="w-6 h-6 mb-3"
              style={{ color: "hsl(42, 64%, 45%)" }}
            />
            <span className="text-sm font-semibold text-white block">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Sync Status */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="p-4 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Pending Sync
            </p>
            <p className="font-mono text-lg font-medium text-white">
              0 records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw
              className="w-4 h-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Last sync: just now
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileHome;
