import { useState } from "react";
import { motion } from "framer-motion";
import { Bluetooth, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MobileWeigh = () => {
  const [bleState, setBleState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [weight, setWeight] = useState(0);

  const connectScale = () => {
    setBleState("connecting");
    setTimeout(() => {
      setBleState("connected");
      setWeight(342.6);
      // Simulate fluctuation
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
      <div>
        <h1 className="text-lg font-bold">CDM Scale Entry</h1>
        <p className="text-sm text-muted-foreground">Weigh carcass and log CDM</p>
      </div>

      {/* BLE Connection */}
      <div className="bg-card rounded-lg p-4 shadow-card">
        {bleState === "disconnected" && (
          <Button onClick={connectScale} variant="outline" className="w-full h-12 gap-2">
            <Bluetooth className="w-4 h-4" /> Connect Scale
          </Button>
        )}
        {bleState === "connecting" && (
          <div className="flex items-center justify-center gap-2 h-12 text-accent">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Pairing...</span>
          </div>
        )}
        {bleState === "connected" && (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Scale Connected</span>
          </div>
        )}
      </div>

      {/* Weight Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-primary rounded-lg p-6 text-center shadow-card"
      >
        <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">CDM Weight</p>
        <p className="text-5xl font-bold font-mono text-primary-foreground mt-2">
          {weight > 0 ? weight.toFixed(1) : "—"}
        </p>
        <p className="text-sm text-primary-foreground/60 mt-1">kg</p>
      </motion.div>

      {/* Manual Entry */}
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Live Weight (kg)</label>
          <Input type="number" defaultValue={liveWeight} className="h-12 text-base font-mono" />
        </div>
        <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium">Dressing %</span>
          <span className="text-xl font-bold font-mono">{dressingPct}%</span>
        </div>
        <div className="bg-accent/10 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium">Payout Estimate</span>
          <span className="text-xl font-bold font-mono text-accent">R {weight > 0 ? (weight * 55).toFixed(0) : "—"}</span>
        </div>
      </div>

      <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold shadow-gold">
        Save Weight
      </Button>
    </div>
  );
};

export default MobileWeigh;
