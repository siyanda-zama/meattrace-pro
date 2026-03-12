import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { CCP_RECORDS } from "@/lib/mock-data";

const iconMap = { pass: CheckCircle2, fail: AlertCircle, pending: Clock };
const colorMap = { pass: "text-success", fail: "text-destructive", pending: "text-warning" };

const MobileHACCP = () => {
  const records = CCP_RECORDS.filter((r) => r.sessionId === "SS-2024-010");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold">HACCP Logger</h1>
        <p className="text-sm text-muted-foreground">Session SS-2024-010</p>
      </div>
      <div className="space-y-3">
        {records.map((ccp, i) => {
          const Icon = iconMap[ccp.status];
          return (
            <motion.div
              key={ccp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-lg p-4 shadow-card flex items-center gap-4"
            >
              <Icon className={`w-6 h-6 shrink-0 ${colorMap[ccp.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{ccp.ccpName}</p>
                <p className="text-xs text-muted-foreground">Required: {ccp.requiredValue}</p>
                {ccp.recordedValue && (
                  <p className="text-xs font-mono mt-0.5">Recorded: {ccp.recordedValue}</p>
                )}
              </div>
              <span className={`text-xs font-medium capitalize ${colorMap[ccp.status]}`}>{ccp.status}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileHACCP;
