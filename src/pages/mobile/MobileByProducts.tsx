import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ByProductItem {
  label: string;
  unit: string;
  count: string;
  weight: string;
}

const INITIAL_ITEMS: ByProductItem[] = [
  { label: "Hides", unit: "count / kg", count: "", weight: "" },
  { label: "Heads", unit: "count", count: "", weight: "" },
  { label: "Red Offal", unit: "kg", count: "", weight: "" },
  { label: "Rough Offal", unit: "kg", count: "", weight: "" },
];

const MobileByProducts = () => {
  const [items, setItems] = useState<ByProductItem[]>(INITIAL_ITEMS);
  const [submitted, setSubmitted] = useState(false);

  const updateItem = useCallback(
    (index: number, field: "count" | "weight", value: string) => {
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const totalCount = useMemo(
    () =>
      items.reduce((sum, item) => sum + (parseFloat(item.count) || 0), 0),
    [items]
  );

  const totalWeight = useMemo(
    () =>
      items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0),
    [items]
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Status header */}
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-sm font-medium"
                style={{ color: "hsl(42, 64%, 45%)" }}
              >
                By-Products
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "hsl(142, 72%, 37%)",
                }}
              >
                Recording
              </span>
            </div>

            {/* Item Cards */}
            <div className="space-y-3">
              {items.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {item.label}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {item.unit}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Count"
                      value={item.count}
                      onChange={(e) => updateItem(i, "count", e.target.value)}
                      className="h-12 font-mono border-0"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={item.weight}
                      onChange={(e) => updateItem(i, "weight", e.target.value)}
                      className="h-12 font-mono border-0"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        borderRadius: "0.75rem",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Running Total */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <p
                className="text-[11px] uppercase tracking-[0.09em] mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Running Total
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Total Count
                  </p>
                  <p className="font-mono text-lg font-medium text-white">
                    {totalCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Total Weight
                  </p>
                  <p className="font-mono text-lg font-medium text-white">
                    {totalWeight.toFixed(1)} kg
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: "hsl(42, 64%, 45%)" }}
            >
              <Package className="w-5 h-5" />
              Confirm & Submit
            </motion.button>
          </motion.div>
        ) : (
          /* Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-8 rounded-xl text-center space-y-4"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.15,
              }}
            >
              <CheckCircle2
                className="w-16 h-16 mx-auto"
                style={{ color: "hsl(142, 72%, 37%)" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg font-semibold text-white">
                By-Products Recorded
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {totalCount} items &middot; {totalWeight.toFixed(1)} kg total
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSubmitted(false);
                setItems(INITIAL_ITEMS);
              }}
              className="mt-4 min-h-[48px] h-12 px-6 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              Record Another Batch
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileByProducts;
