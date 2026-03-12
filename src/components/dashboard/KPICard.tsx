import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  accent?: boolean;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, accent }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-5 shadow-card transition-shadow hover:shadow-card-hover ${
        accent ? "bg-accent text-accent-foreground" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-xs font-medium uppercase tracking-wider ${accent ? "text-accent-foreground/70" : "text-muted-foreground"}`}>
            {title}
          </p>
          <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
          {subtitle && <p className={`text-xs ${accent ? "text-accent-foreground/60" : "text-muted-foreground"}`}>{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% vs yesterday
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${accent ? "bg-accent-foreground/10" : "bg-secondary"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
