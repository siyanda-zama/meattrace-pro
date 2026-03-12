import { useState } from "react";
import { motion } from "framer-motion";
import { Bluetooth, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const MobileWeigh = () => {
  const [bleState, setBleState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [weight, setWeight] = useState(0);

  const connectScale = () => {
    setBleState("connecting");
    setTimeout(() => {
      setBleState("connected");
      setWeight(342.6);
      const interval = setInterval(() => {
        setWeight((w) => +(w + (Math.random() - 0.5) * 0.8).toFixed(1));
      }, 2000);
      setTimeout(() => clearInterval(interval), 20000);
    }, 2000);
  };

  const liveWeight = 680;
  const dressingPct = liveWeight > 0 && weight > 0 ? ((weight / liveWeight) * 100).toFixed(1) : "—";

  return (
    <div className="space-y-5">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>CDM Scale</span>
        <div className="flex items-center gap-2">
          {bleState === "connected" ? (
            <span className="badge-pass">Connected</span>
          ) : (
            <span className="badge-pending">Disconnected</span>
          )}
        </div>
      </div>

      {/* BLE Connection */}
      <div
        className="p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
      >
        {bleState === "disconnected" && (
          <button
            onClick={connectScale}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <Bluetooth className="w-4 h-4" /> Connect Scale
          </button>
        )}
        {bleState === "connecting" && (
          <div className="flex items-center justify-center gap-2 h-12" style={{ color: 'hsl(42, 64%, 45%)' }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Pairing...</span>
          </div>
        )}
        {bleState === "connected" && (
          <div className="flex items-center gap-2" style={{ color: 'hsl(142, 72%, 37%)' }}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Scale Connected</span>
          </div>
        )}
      </div>

      {/* Weight Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 rounded-xl text-center"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
      >
        <p className="text-[11px] uppercase tracking-[0.09em]" style={{ color: 'rgba(255,255,255,0.4)' }}>CDM Weight</p>
        <p className="font-mono text-[56px] font-medium text-white leading-none mt-2">
          {weight > 0 ? weight.toFixed(1) : "—"}
        </p>
        <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>kg</p>
      </motion.div>

      {/* Data fields */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-[0.09em] block" style={{ color: 'rgba(255,255,255,0.4)' }}>Live Weight (kg)</label>
          <Input
            type="number"
            defaultValue={liveWeight}
            className="h-12 text-base font-mono border-0"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'white', borderRadius: 'var(--mt-radius-md)' }}
          />
        </div>
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <span className="text-sm font-medium text-white">Dressing %</span>
          <span className="font-mono text-xl font-medium text-white">{dressingPct}%</span>
        </div>
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <span className="text-sm font-medium text-white">Payout Estimate</span>
          <span className="font-mono text-xl font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>
            R {weight > 0 ? (weight * 55).toFixed(0) : "—"}
          </span>
        </div>
      </div>

      <button
        className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white"
        style={{ background: 'hsl(42, 64%, 45%)' }}
      >
        Save Weight
      </button>
    </div>
  );
};

export default MobileWeigh;
