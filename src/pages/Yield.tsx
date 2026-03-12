import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { SESSIONS, YIELD_TREND_7D, getSupplierById } from "@/lib/mock-data";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ReferenceLine,
} from "recharts";

const chartTooltip = {
  contentStyle: {
    background: "hsl(213,65%,15%)",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontFamily: "JetBrains Mono",
    fontSize: 12,
    padding: "10px 14px",
  },
  itemStyle: { color: "white" },
  labelStyle: { color: "rgba(255,255,255,0.6)" },
};

const barData = SESSIONS.filter(s => s.dressingPct > 0).map(s => ({
  session: s.id.replace("SS-2024-", ""),
  dressingPct: s.dressingPct,
}));

const scatterData = SESSIONS.filter(s => s.dressingPct > 0).map(s => ({
  liveWeight: s.totalLiveWeight / s.animalCount,
  dressingPct: s.dressingPct,
}));

const byProducts = [
  { label: "Hides", count: 24, weight: 312, pricePerUnit: 180, revenue: 4320 },
  { label: "Heads", count: 24, weight: 168, pricePerUnit: 45, revenue: 1080 },
  { label: "Red Offal", count: 24, weight: 216, pricePerUnit: 35, revenue: 840 },
  { label: "Rough Offal", count: 24, weight: 144, pricePerUnit: 15, revenue: 360 },
];

const Yield = () => {
  const avgDressing = SESSIONS.filter(s => s.dressingPct > 0).reduce((a, s, _, arr) => a + s.dressingPct / arr.length, 0);
  const underperforming = SESSIONS.filter(s => s.dressingPct > 0 && s.dressingPct < 48);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Yield" }]}
        title="Yield Analytics"
        subtitle="Dressing percentage performance and by-product tracking"
      />
      <div className="px-8 py-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard navy title="Avg Dressing %" value={`${avgDressing.toFixed(1)}%`} icon={TrendingUp} trend={{ value: 1.8, positive: true }} />
          <KPICard title="Sessions Tracked" value={SESSIONS.filter(s => s.dressingPct > 0).length} icon={BarChart3} />
          <KPICard title="Underperforming" value={underperforming.length} icon={AlertTriangle} subtitle="< 48% dressing" />
          <KPICard title="By-Product Revenue" value="R 6,600" icon={DollarSign} />
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Bar chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-section">
            <div className="card-section-header">
              <h2 className="mt-heading text-base">Dressing % by Session</h2>
            </div>
            <div className="card-section-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(213,65%,15%,0.08)" vertical={false} />
                  <XAxis dataKey="session" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 60]} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltip} />
                  <ReferenceLine y={52} stroke="hsl(42,64%,45%)" strokeDasharray="5 5" />
                  <Bar dataKey="dressingPct" fill="hsl(213,65%,15%)" radius={[4, 4, 0, 0]} name="Dressing %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Line chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card-section">
            <div className="card-section-header">
              <h2 className="mt-heading text-base">Yield Trend (7 Day)</h2>
            </div>
            <div className="card-section-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={YIELD_TREND_7D}>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(213,65%,15%,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 60]} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltip} />
                  <ReferenceLine y={52} stroke="hsl(42,64%,45%)" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="dressingPct" stroke="hsl(42,64%,45%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(42,64%,45%)" }} name="Dressing %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* By-Products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="card-section overflow-hidden">
          <div className="card-section-header">
            <h2 className="mt-heading text-base">By-Product Tracker</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left">Product</th>
                  <th className="text-right">Count</th>
                  <th className="text-right">Weight (kg)</th>
                  <th className="text-right">Price/Unit (ZAR)</th>
                  <th className="text-right">Revenue (ZAR)</th>
                </tr>
              </thead>
              <tbody>
                {byProducts.map(bp => (
                  <tr key={bp.label}>
                    <td className="font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{bp.label}</td>
                    <td className="text-right font-mono">{bp.count}</td>
                    <td className="text-right font-mono">{bp.weight}</td>
                    <td className="text-right font-mono">R {bp.pricePerUnit}</td>
                    <td className="text-right font-mono font-medium">R {bp.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Underperforming alerts */}
        {underperforming.length > 0 && (
          <div className="card-section">
            <div className="card-section-header">
              <h2 className="mt-heading text-base">Underperforming Batches</h2>
            </div>
            <div className="card-section-body space-y-2">
              {underperforming.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'hsl(var(--mt-warn-bg))' }}>
                  <div>
                    <span className="font-mono text-sm font-medium">{s.id}</span>
                    <span className="text-xs ml-3" style={{ color: '#92400E' }}>{getSupplierById(s.supplierId)?.name}</span>
                  </div>
                  <span className="font-mono text-sm font-medium" style={{ color: '#92400E' }}>{s.dressingPct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Yield;
