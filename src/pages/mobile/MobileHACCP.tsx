import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, Plus } from "lucide-react";
import { CCP_RECORDS, type CCPRecord } from "@/lib/mock-data";

const iconMap = { pass: CheckCircle2, fail: AlertCircle, pending: Clock };
const colorMap = {
  pass: "hsl(142, 72%, 37%)",
  fail: "hsl(0, 72%, 51%)",
  pending: "hsl(42, 64%, 45%)",
};

const MobileHACCP = () => {
  const sessionRecords = CCP_RECORDS.filter(
    (r) => r.sessionId === "SS-2024-010"
  );
  const [records, setRecords] = useState<CCPRecord[]>(sessionRecords);

  const handleTapPending = useCallback((id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id && r.status === "pending"
          ? {
              ...r,
              status: "pass" as const,
              recordedValue: r.ccpName.includes("pH") ? "5.6" : "83.5°C",
              timestamp: new Date().toISOString(),
            }
          : r
      )
    );
  }, []);

  const passCount = records.filter((r) => r.status === "pass").length;
  const totalCount = records.length;

  return (
    <div className="space-y-5">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm font-medium"
          style={{ color: "hsl(42, 64%, 45%)" }}
        >
          SS-2024-010
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(34,197,94,0.15)",
            color: "hsl(142, 72%, 37%)",
          }}
        >
          Live
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          HACCP Logger &mdash; {totalCount} Control Points
        </p>
        <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
          {passCount}/{totalCount} passed
        </p>
      </div>

      {/* CCP Cards */}
      <div className="space-y-3">
        {records.map((ccp, i) => {
          const Icon = iconMap[ccp.status];
          return (
            <motion.div
              key={ccp.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35, ease: "easeOut" }}
              onClick={() => handleTapPending(ccp.id)}
              className={`p-4 rounded-xl flex items-center gap-4 ${
                ccp.status === "pending"
                  ? "active:scale-[0.98] cursor-pointer"
                  : ""
              } transition-transform`}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <motion.div
                key={ccp.status}
                initial={ccp.status === "pass" ? { scale: 0 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              >
                <Icon
                  className="w-6 h-6 shrink-0"
                  style={{ color: colorMap[ccp.status] }}
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{ccp.ccpName}</p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Required: {ccp.requiredValue}
                </p>
                {ccp.recordedValue && (
                  <p className="font-mono text-xs mt-0.5 text-white">
                    Recorded: {ccp.recordedValue}
                  </p>
                )}
                {ccp.status === "pending" && (
                  <p
                    className="text-[10px] mt-1 italic"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Tap to record
                  </p>
                )}
                {ccp.correctiveAction && (
                  <p
                    className="text-[10px] mt-1"
                    style={{ color: "hsl(0, 72%, 51%)" }}
                  >
                    CA: {ccp.correctiveAction}
                  </p>
                )}
              </div>

              <span
                className="text-xs font-medium capitalize shrink-0"
                style={{ color: colorMap[ccp.status] }}
              >
                {ccp.status}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Log New CCP */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: records.length * 0.1 + 0.15 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
        style={{ background: "hsl(42, 64%, 45%)" }}
      >
        <Plus className="w-5 h-5" />
        Log New CCP
      </motion.button>
    </div>
  );
};

export default MobileHACCP;
