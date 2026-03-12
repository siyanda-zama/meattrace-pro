import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { SESSIONS, YIELD_TREND_7D, getSupplierById } from "@/lib/mock-data";
import { useCsvExport } from "@/hooks/use-csv-export";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Cell,
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

const barData = SESSIONS.filter((s) => s.dressingPct > 0).map((s) => ({
  session: s.id.replace("SS-2024-", ""),
  dressingPct: s.dressingPct,
}));

function getBarColor(pct: number) {
  if (pct >= 52) return "hsl(142, 72%, 37%)";
  if (pct >= 48) return "hsl(42, 64%, 45%)";
  return "hsl(0, 72%, 51%)";
}

const byProducts = [
  { label: "Hides", count: 24, weight: 312, pricePerUnit: 180, revenue: 4320 },
  { label: "Heads", count: 24, weight: 168, pricePerUnit: 45, revenue: 1080 },
  { label: "Red Offal", count: 24, weight: 216, pricePerUnit: 35, revenue: 840 },
  { label: "Rough Offal", count: 24, weight: 144, pricePerUnit: 15, revenue: 360 },
];

const totalRevenue = byProducts.reduce((sum, bp) => sum + bp.revenue, 0);

const formatZAR = (v: number) =>
  `R ${v.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
const BarTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(213,65%,15%)",
        border: "none",
        borderRadius: 8,
        color: "white",
        fontFamily: "JetBrains Mono",
        fontSize: 12,
        padding: "10px 14px",
      }}
    >
      <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Session {label}</p>
      <p>Dressing: {payload[0].value}%</p>
    </div>
  );
};

const LineTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(213,65%,15%)",
        border: "none",
        borderRadius: 8,
        color: "white",
        fontFamily: "JetBrains Mono",
        fontSize: 12,
        padding: "10px 14px",
      }}
    >
      <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{label}</p>
      <p>Dressing: {payload[0].value}%</p>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Benchmark: 52%</p>
    </div>
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const Yield = () => {
  const exportCsv = useCsvExport();

  const activeSessions = SESSIONS.filter((s) => s.dressingPct > 0);
  const avgDressing =
    activeSessions.reduce((a, s) => a + s.dressingPct, 0) / activeSessions.length;
  const underperforming = activeSessions.filter((s) => s.dressingPct < 48);

  const handleExportByProducts = () => {
    exportCsv(
      byProducts.map((bp) => ({
        Product: bp.label,
        Count: bp.count,
        "Weight (kg)": bp.weight,
        "Price/Unit (ZAR)": `R ${bp.pricePerUnit}`,
        "Revenue (ZAR)": `R ${bp.revenue}`,
      })),
      "by-products-report"
    );
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Yield" }]}
        title="Yield Analytics"
        subtitle="Dressing percentage performance and by-product tracking"
      />
      <div className="px-8 py-6 space-y-5">
        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            navy
            title="Avg Dressing %"
            value={`${avgDressing.toFixed(1)}%`}
            icon={TrendingUp}
            trend={{ value: 1.8, positive: true }}
          />
          <KPICard
            title="Sessions Tracked"
            value={activeSessions.length}
            icon={BarChart3}
          />
          <KPICard
            title="Underperforming"
            value={underperforming.length}
            icon={AlertTriangle}
            subtitle="< 48% dressing"
          />
          <KPICard
            title="By-Product Revenue"
            value={formatZAR(totalRevenue)}
            icon={DollarSign}
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Bar chart - Dressing % by Session */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h2 className="mt-heading text-base">Dressing % by Session</h2>
            </div>
            <div className="card-section-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="hsl(213,65%,15%,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="session"
                    tick={{
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      fill: "hsl(213,22%,63%)",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[40, 60]}
                    tick={{
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      fill: "hsl(213,22%,63%)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<BarTooltipContent />} />
                  <ReferenceLine
                    y={52}
                    stroke="hsl(42,64%,45%)"
                    strokeDasharray="5 5"
                    label={{
                      value: "52% benchmark",
                      position: "insideTopRight",
                      fill: "hsl(42,64%,45%)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <Bar dataKey="dressingPct" radius={[4, 4, 0, 0]} name="Dressing %">
                    {barData.map((entry, idx) => (
                      <Cell key={idx} fill={getBarColor(entry.dressingPct)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Line chart - 7-day trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h2 className="mt-heading text-base">Yield Trend (7 Day)</h2>
            </div>
            <div className="card-section-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={YIELD_TREND_7D}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="hsl(213,65%,15%,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      fill: "hsl(213,22%,63%)",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[40, 60]}
                    tick={{
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      fill: "hsl(213,22%,63%)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<LineTooltipContent />} />
                  <ReferenceLine
                    y={52}
                    stroke="hsl(42,64%,45%)"
                    strokeDasharray="5 5"
                    label={{
                      value: "52% benchmark",
                      position: "insideTopRight",
                      fill: "hsl(42,64%,45%)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dressingPct"
                    stroke="hsl(42,64%,45%)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "hsl(42,64%,45%)" }}
                    name="Dressing %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ── By-Product Tracker ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="card-section overflow-hidden"
        >
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">By-Product Tracker</h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              style={{ borderRadius: "var(--mt-radius-sm)" }}
              onClick={handleExportByProducts}
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
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
                {byProducts.map((bp) => (
                  <tr key={bp.label}>
                    <td
                      className="font-medium"
                      style={{ color: "hsl(var(--mt-text-primary))" }}
                    >
                      {bp.label}
                    </td>
                    <td className="text-right font-mono">{bp.count}</td>
                    <td className="text-right font-mono">{bp.weight}</td>
                    <td className="text-right font-mono">R {bp.pricePerUnit}</td>
                    <td className="text-right font-mono font-medium">
                      R {bp.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr
                  style={{
                    borderTop: "2px solid hsl(var(--mt-border))",
                    fontWeight: 600,
                  }}
                >
                  <td style={{ color: "hsl(var(--mt-text-primary))" }}>Total</td>
                  <td className="text-right font-mono">
                    {byProducts.reduce((s, bp) => s + bp.count, 0)}
                  </td>
                  <td className="text-right font-mono">
                    {byProducts.reduce((s, bp) => s + bp.weight, 0)}
                  </td>
                  <td className="text-right font-mono">{"\u2014"}</td>
                  <td className="text-right font-mono font-medium">
                    R {totalRevenue.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Underperforming Batches ── */}
        {underperforming.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h2 className="mt-heading text-base">Underperforming Batches</h2>
            </div>
            <div className="card-section-body">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {underperforming.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-lg"
                    style={{ background: "hsl(var(--mt-warn-bg))" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-medium">{s.id}</span>
                      <span className="badge-warn">Low Yield</span>
                    </div>
                    <p className="text-xs" style={{ color: "#92400E" }}>
                      {getSupplierById(s.supplierId)?.name}
                    </p>
                    <p
                      className="font-mono text-lg font-bold mt-1"
                      style={{ color: "#92400E" }}
                    >
                      {s.dressingPct}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Yield;
