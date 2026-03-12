import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bluetooth,
  Loader2,
  CheckCircle2,
  Search,
  Smartphone,
  RotateCcw,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type BleStep = "scanning" | "found" | "connecting" | "connected";

const STEPS: { key: BleStep; label: string; icon: typeof Bluetooth }[] = [
  { key: "scanning", label: "Scanning for scales...", icon: Search },
  { key: "found", label: "Found: MT-Scale-001", icon: Smartphone },
  { key: "connecting", label: "Connecting...", icon: Loader2 },
  { key: "connected", label: "Connected", icon: CheckCircle2 },
];

const stepIndex = (s: BleStep) =>
  STEPS.findIndex((st) => st.key === s);

const MobileWeigh = () => {
  const [bleStep, setBleStep] = useState<BleStep | null>(null);
  const [weight, setWeight] = useState(0);
  const [tare, setTare] = useState(0);
  const [captured, setCaptured] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [liveWeight, setLiveWeight] = useState("680");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startConnection = useCallback(() => {
    if (bleStep !== null) return;
    setBleStep("scanning");

    setTimeout(() => setBleStep("found"), 1200);
    setTimeout(() => setBleStep("connecting"), 2400);
    setTimeout(() => {
      setBleStep("connected");
      setWeight(342.6);
    }, 3800);
  }, [bleStep]);

  // Weight drift simulation
  useEffect(() => {
    if (bleStep === "connected" && !captured) {
      intervalRef.current = setInterval(() => {
        setWeight((w) => {
          const drift = (Math.random() - 0.5) * 0.6;
          return +(w + drift).toFixed(1);
        });
      }, 1200);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [bleStep, captured]);

  const handleTare = useCallback(() => {
    setTare(weight);
    setWeight(0);
  }, [weight]);

  const handleCapture = useCallback(() => {
    setCaptured(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  const displayWeight = weight - tare;
  const liveWeightNum = parseFloat(liveWeight) || 0;
  const dressingPct =
    liveWeightNum > 0 && displayWeight > 0
      ? ((displayWeight / liveWeightNum) * 100).toFixed(1)
      : "\u2014";
  const payoutEstimate =
    displayWeight > 0 ? (displayWeight * 55).toFixed(0) : "\u2014";

  const isConnected = bleStep === "connected";

  return (
    <div className="space-y-5">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm font-medium"
          style={{ color: "hsl(42, 64%, 45%)" }}
        >
          CDM Scale
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: isConnected
              ? "rgba(34,197,94,0.15)"
              : "rgba(255,255,255,0.1)",
            color: isConnected
              ? "hsl(142, 72%, 37%)"
              : "rgba(255,255,255,0.5)",
          }}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* BLE Connection Steps */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 rounded-xl space-y-4"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {bleStep === null ? (
            <button
              onClick={startConnection}
              className="w-full min-h-[48px] h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <Bluetooth
                className="w-4 h-4"
                style={{ color: "hsl(42, 64%, 45%)" }}
              />
              Connect Scale
            </button>
          ) : (
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const currentIdx = bleStep ? stepIndex(bleStep) : -1;
                const isActive = i === currentIdx;
                const isDone = i < currentIdx;
                const isPending = i > currentIdx;

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{
                      opacity: isPending ? 0.3 : 1,
                      x: 0,
                    }}
                    transition={{ delay: i * 0.08, duration: 0.25 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isDone
                          ? "rgba(34,197,94,0.15)"
                          : isActive
                          ? "rgba(184,150,46,0.15)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2
                          className="w-4 h-4"
                          style={{ color: "hsl(142, 72%, 37%)" }}
                        />
                      ) : isActive && step.key === "scanning" ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                          <Bluetooth
                            className="w-4 h-4"
                            style={{ color: "hsl(42, 64%, 45%)" }}
                          />
                        </motion.div>
                      ) : isActive && step.key === "connecting" ? (
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          style={{ color: "hsl(42, 64%, 45%)" }}
                        />
                      ) : (
                        <step.icon
                          className="w-4 h-4"
                          style={{
                            color: isActive
                              ? "hsl(42, 64%, 45%)"
                              : "rgba(255,255,255,0.3)",
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="text-sm"
                      style={{
                        color: isDone
                          ? "hsl(142, 72%, 37%)"
                          : isActive
                          ? "white"
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {step.label}
                    </span>
                    {isActive && step.key !== "found" && (
                      <motion.div
                        className="ml-auto w-4 h-1 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "hsl(42, 64%, 45%)" }}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.2 }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Weight Display (visible once connected) */}
      {isConnected && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-xl text-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.09em]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              CDM Weight
            </p>
            <motion.p
              key={displayWeight}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[56px] font-medium text-white leading-none mt-2"
            >
              {displayWeight > 0 ? displayWeight.toFixed(1) : "0.0"}
            </motion.p>
            <p
              className="text-base mt-1"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              kg
            </p>

            {captured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "hsl(142, 72%, 37%)",
                }}
              >
                <CheckCircle2 className="w-3 h-3" />
                Captured
              </motion.div>
            )}
          </motion.div>

          {/* Tare + Capture buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleTare}
              disabled={captured}
              className="min-h-[48px] h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Tare
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCapture}
              disabled={captured}
              className="min-h-[48px] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
              style={{
                background: captured
                  ? "hsl(142, 72%, 37%)"
                  : "hsl(42, 64%, 45%)",
                color: "white",
              }}
            >
              <Save className="w-4 h-4" />
              {captured ? "Captured" : "Capture"}
            </motion.button>
          </div>

          {/* Data fields */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label
                className="text-[11px] uppercase tracking-[0.09em] block"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Live Weight (kg)
              </label>
              <Input
                type="number"
                value={liveWeight}
                onChange={(e) => setLiveWeight(e.target.value)}
                className="h-12 text-base font-mono border-0"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "white",
                  borderRadius: "0.75rem",
                }}
              />
            </div>

            <div
              className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span className="text-sm font-medium text-white">
                Dressing %
              </span>
              <span className="font-mono text-xl font-medium text-white">
                {dressingPct}%
              </span>
            </div>

            <div
              className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span className="text-sm font-medium text-white">
                Payout Estimate
              </span>
              <span
                className="font-mono text-xl font-medium"
                style={{ color: "hsl(42, 64%, 45%)" }}
              >
                R {payoutEstimate}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Success toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 left-4 right-4 p-4 rounded-xl flex items-center gap-3 z-50"
            style={{
              background: "hsl(142, 72%, 37%)",
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                Weight captured
              </p>
              <p className="text-xs text-white/70">
                {displayWeight.toFixed(1)} kg added to session
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileWeigh;
