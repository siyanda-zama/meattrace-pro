import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  delta?: number;
  navy?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 15 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{display}</motion.span>;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, delta, navy }: KPICardProps) {
  const numValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const isNumeric = !isNaN(numValue) && typeof value === "number";
  const prefix = typeof value === "string" ? value.replace(/[0-9.,]+.*/, "") : "";
  const suffix = typeof value === "string" ? value.replace(/.*[0-9.,]+/, "") : "";

  if (navy) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="card-navy"
      >
        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.09em]" style={{ color: 'hsl(var(--mt-gold))' }}>
            {title}
          </p>
          <p className="mt-data-lg text-white mt-1">
            {isNumeric ? <AnimatedNumber value={numValue} /> : value}
          </p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
          {trend && (
            <p className="text-xs font-medium mt-1" style={{ color: trend.positive ? 'hsl(var(--mt-pass))' : 'hsl(var(--mt-alert))' }}>
              {trend.positive ? "\u2191" : "\u2193"} {Math.abs(trend.value)}% vs yesterday
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="card-kpi"
    >
      <div className="flex items-start justify-between pl-3">
        <div className="space-y-1">
          <p className="mt-label">{title}</p>
          <p className="mt-data-lg">
            {prefix}
            {isNumeric ? <AnimatedNumber value={numValue} /> : value}
            {suffix}
          </p>
          {subtitle && <p className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>{subtitle}</p>}
          {trend && (
            <p className="text-xs font-medium" style={{ color: trend.positive ? '#166534' : '#991B1B' }}>
              {trend.positive ? "\u2191" : "\u2193"} {Math.abs(trend.value)}% vs yesterday
            </p>
          )}
          {delta !== undefined && (
            <p className="text-xs font-medium font-mono" style={{ color: delta >= 0 ? '#166534' : '#991B1B' }}>
              {delta >= 0 ? "+" : ""}{delta} vs yesterday
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg" style={{ background: 'hsl(var(--mt-surface-2))' }}>
          <Icon className="w-5 h-5" style={{ color: 'hsl(var(--mt-text-muted))' }} />
        </div>
      </div>
    </motion.div>
  );
}
