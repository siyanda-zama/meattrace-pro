import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
  WifiOff,
  Clock,
  CloudOff,
  Loader2,
} from "lucide-react";

interface QueuedRecord {
  id: string;
  type: string;
  sessionId: string;
  timestamp: string;
}

const MobileSync = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("just now");
  const [queue, setQueue] = useState<QueuedRecord[]>([]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleManualSync = useCallback(() => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setQueue([]);
      setLastSyncTime("just now");
      setIsSyncing(false);
    }, 1800);
  }, [isSyncing]);

  const allSynced = queue.length === 0 && !isSyncing;

  return (
    <div className="space-y-5">
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl flex items-center gap-3"
            style={{
              background: "rgba(207,67,67,0.15)",
              border: "1px solid rgba(207,67,67,0.25)",
            }}
          >
            <WifiOff
              className="w-5 h-5 shrink-0"
              style={{ color: "hsl(0, 72%, 51%)" }}
            />
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "hsl(0, 72%, 51%)" }}
              >
                Offline Mode Active
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Records will sync when connection is restored
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status header */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm font-medium"
          style={{ color: "hsl(42, 64%, 45%)" }}
        >
          Sync Status
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: allSynced
                ? "hsl(142, 72%, 37%)"
                : "hsl(42, 64%, 45%)",
            }}
          />
          <span
            className="text-[10px]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {allSynced ? "Synced" : `${queue.length} pending`}
          </span>
        </div>
      </div>

      {/* Sync Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-xl text-center space-y-3"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {isSyncing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCw
                className="w-12 h-12 mx-auto"
                style={{ color: "hsl(42, 64%, 45%)" }}
              />
            </motion.div>
            <p className="text-sm font-medium text-white">Syncing...</p>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Uploading records to server
            </p>
          </>
        ) : allSynced ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <CheckCircle2
                className="w-12 h-12 mx-auto"
                style={{ color: "hsl(142, 72%, 37%)" }}
              />
            </motion.div>
            <p className="text-sm font-medium text-white">
              All records synced
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Last sync: {lastSyncTime}
            </p>
          </>
        ) : (
          <>
            <CloudOff
              className="w-12 h-12 mx-auto"
              style={{ color: "hsl(42, 64%, 45%)" }}
            />
            <p className="text-sm font-medium text-white">
              {queue.length} records pending
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Last sync: {lastSyncTime}
            </p>
          </>
        )}
      </motion.div>

      {/* Queue Display */}
      <AnimatePresence>
        {queue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p
              className="text-[11px] uppercase tracking-[0.09em]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Queued Records
            </p>
            {queue.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Clock
                  className="w-4 h-4 shrink-0"
                  style={{ color: "hsl(42, 64%, 45%)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white">
                    {record.type}
                  </p>
                  <p
                    className="text-[10px] font-mono"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {record.sessionId} &middot; {record.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Sync Button */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleManualSync}
        disabled={isSyncing}
        className="w-full h-[52px] rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{
          background: "rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {isSyncing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {isSyncing ? "Syncing..." : "Manual Sync"}
      </motion.button>

      {/* Sync Info */}
      <div
        className="p-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          className="text-[10px] text-center"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Auto-sync runs every 30 seconds when online.{" "}
          {!isOnline && "Currently offline \u2014 records will queue locally."}
        </p>
      </div>
    </div>
  );
};

export default MobileSync;
