import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, FileText, Loader2, CheckCircle2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";

type GpsState = "idle" | "loading" | "done";

const MobileIntake = () => {
  const [gpsState, setGpsState] = useState<GpsState>("idle");
  const [cipc, setCipc] = useState("");
  const [species, setSpecies] = useState("Cattle");
  const [animalCount, setAnimalCount] = useState("");

  const detectLocation = useCallback(() => {
    if (gpsState !== "idle") return;
    setGpsState("loading");
    setTimeout(() => {
      setGpsState("done");
    }, 1500);
  }, [gpsState]);

  return (
    <div className="space-y-5">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm font-medium"
          style={{ color: "hsl(42, 64%, 45%)" }}
        >
          New Intake
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(184,150,46,0.15)",
            color: "hsl(42, 64%, 45%)",
          }}
        >
          Step 1/4
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "25%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ background: "hsl(42, 64%, 45%)" }}
        />
      </div>

      <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
        Supplier & Origin
      </p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* CIPC Number */}
        <div className="space-y-1.5">
          <label
            className="text-[11px] uppercase tracking-[0.09em] flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            CIPC Number
            <span style={{ color: "hsl(42, 64%, 45%)" }}>*</span>
          </label>
          <Input
            placeholder="2015/123456/07"
            value={cipc}
            onChange={(e) => setCipc(e.target.value)}
            className="h-12 text-base font-mono border-0"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "white",
              borderRadius: "0.75rem",
            }}
          />
        </div>

        {/* GPS Location */}
        <div className="space-y-1.5">
          <label
            className="text-[11px] uppercase tracking-[0.09em] flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            GPS Location
            <span style={{ color: "hsl(42, 64%, 45%)" }}>*</span>
          </label>

          <AnimatePresence mode="wait">
            {gpsState === "idle" && (
              <motion.button
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={detectLocation}
                className="w-full min-h-[48px] h-12 flex items-center justify-start gap-2 px-4 rounded-xl text-sm active:scale-[0.98] transition-transform"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <MapPin
                  className="w-4 h-4"
                  style={{ color: "hsl(42, 64%, 45%)" }}
                />
                Detect Location
              </motion.button>
            )}

            {gpsState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "hsl(42, 64%, 45%)",
                }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Detecting GPS...
              </motion.div>
            )}

            {gpsState === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 rounded-xl space-y-2"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Navigation
                    className="w-4 h-4"
                    style={{ color: "hsl(142, 72%, 37%)" }}
                  />
                  <span className="font-mono text-sm text-white">
                    -29.8587, 31.0218
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      color: "hsl(142, 72%, 37%)",
                    }}
                  >
                    CLEAR
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    FMD Zone Status
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Species */}
        <div className="space-y-1.5">
          <label
            className="text-[11px] uppercase tracking-[0.09em] flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Species
            <span style={{ color: "hsl(42, 64%, 45%)" }}>*</span>
          </label>
          <Input
            placeholder="Cattle"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="h-12 text-base border-0"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "white",
              borderRadius: "0.75rem",
            }}
          />
        </div>

        {/* Animal Count */}
        <div className="space-y-1.5">
          <label
            className="text-[11px] uppercase tracking-[0.09em] flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Animal Count
            <span style={{ color: "hsl(42, 64%, 45%)" }}>*</span>
          </label>
          <Input
            type="number"
            placeholder="0"
            value={animalCount}
            onChange={(e) => setAnimalCount(e.target.value)}
            className="h-12 text-base font-mono border-0"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "white",
              borderRadius: "0.75rem",
            }}
          />
        </div>

        {/* Next Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: "hsl(42, 64%, 45%)" }}
        >
          <FileText className="w-4 h-4" />
          Next: Animal Details
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MobileIntake;
