import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { CCP_RECORDS } from "@/lib/mock-data";

const iconMap = { pass: CheckCircle2, fail: AlertCircle, pending: Clock };
const colorMap = {
  pass: 'hsl(142, 72%, 37%)',
  fail: 'hsl(0, 72%, 51%)',
  pending: 'hsl(32, 95%, 44%)',
};

const MobileHACCP = () => {
  const records = CCP_RECORDS.filter((r) => r.sessionId === "SS-2024-010");
  return (
    <div className="space-y-5">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>SS-2024-010</span>
        <span className="badge-live">Live</span>
      </div>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>HACCP Logger — {records.length} Control Points</p>

      <div className="space-y-3">
        {records.map((ccp, i) => {
          const Icon = iconMap[ccp.status];
          return (
            <motion.div
              key={ccp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl flex items-center gap-4"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <Icon className="w-6 h-6 shrink-0" style={{ color: colorMap[ccp.status] }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{ccp.ccpName}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Required: {ccp.requiredValue}</p>
                {ccp.recordedValue && (
                  <p className="font-mono text-xs mt-0.5 text-white">{ccp.recordedValue}</p>
                )}
              </div>
              <span
                className="text-xs font-medium capitalize"
                style={{ color: colorMap[ccp.status] }}
              >
                {ccp.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileHACCP;
