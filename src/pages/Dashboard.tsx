import { motion } from "framer-motion";
import {
  Activity, Beef, Weight, TrendingUp, AlertTriangle, DollarSign,
  Plus, FileDown, Clock, ArrowRight,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SESSIONS, ALERTS, YIELD_TREND_7D, getUserById, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const stagger = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: (i: number) => ({ duration: 0.35, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }),
};

const statusBadge: Record<string, string> = {
  completed: "badge-complete",
  "in-progress": "badge-live",
  flagged: "badge-warn",
  paused: "badge-pending",
};

const Dashboard = () => {
  const todaySessions = SESSIONS.filter((s) => s.date === "2024-03-12");
  const totalAnimals = todaySessions.reduce((a, s) => a + s.animalCount, 0);
  const totalCDM = todaySessions.reduce((a, s) => a + s.totalCDM, 0);
  const avgDressing = todaySessions.filter((s) => s.dressingPct > 0).reduce((a, s, _, arr) => a + s.dressingPct / arr.length, 0);
  const activeAlerts = ALERTS.filter((a) => !a.resolved).length;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Dashboard" }]}
        title="Command Centre"
        subtitle="Real-time overview of operations"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              style={{ borderRadius: 'var(--mt-radius-sm)', borderColor: 'hsl(var(--mt-border))' }}
            >
              <FileDown className="w-4 h-4 mr-1.5" /> Export
            </Button>
            <Button
              size="sm"
              className="text-white font-semibold"
              style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}
            >
              <Plus className="w-4 h-4 mr-1.5" /> New Session
            </Button>
          </>
        }
      />

      <div className="px-8 py-6 space-y-5">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="Today's Sessions" value={todaySessions.length} icon={Activity} subtitle="2 active" />
          <KPICard title="Animals Processed" value={totalAnimals} icon={Beef} trend={{ value: 12, positive: true }} />
          <KPICard navy title="Total CDM" value={`${totalCDM.toLocaleString()} kg`} icon={Weight} trend={{ value: 8, positive: true }} />
          <KPICard title="Avg Dressing %" value={`${avgDressing.toFixed(1)}%`} icon={TrendingUp} trend={{ value: 1.2, positive: true }} />
          <KPICard title="Active Alerts" value={activeAlerts} icon={AlertTriangle} />
          <KPICard title="Revenue Est." value="R 482,300" icon={DollarSign} />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Yield Chart */}
          <motion.div
            initial={stagger.initial}
            animate={stagger.animate}
            transition={stagger.transition(2)}
            className="lg:col-span-2 card-section"
          >
            <div className="card-section-header flex items-center justify-between">
              <h2 className="mt-heading text-base">Yield Performance (7 Day)</h2>
              <button className="text-xs font-medium flex items-center gap-1" style={{ color: 'hsl(var(--mt-gold))' }}>
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="card-section-body">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={YIELD_TREND_7D}>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(213,65%,15%,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 60]} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(213,65%,15%)",
                      border: "none",
                      borderRadius: 8,
                      color: "white",
                      fontFamily: "JetBrains Mono",
                      fontSize: 12,
                      padding: "10px 14px",
                    }}
                    itemStyle={{ color: "white" }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                  />
                  <ReferenceLine y={52} stroke="hsl(42,64%,45%)" strokeDasharray="5 5" label={{ value: "Benchmark", fill: "hsl(42,64%,45%)", fontSize: 10 }} />
                  <Line type="monotone" dataKey="dressingPct" stroke="hsl(42,64%,45%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(42,64%,45%)" }} name="Dressing %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Alerts Feed */}
          <motion.div
            initial={stagger.initial}
            animate={stagger.animate}
            transition={stagger.transition(3)}
            className="card-section"
          >
            <div className="card-section-header flex items-center justify-between">
              <h2 className="mt-heading text-base">Live Alerts</h2>
              <span className="badge-alert">{activeAlerts} active</span>
            </div>
            <div className="card-section-body space-y-3">
              {ALERTS.filter((a) => !a.resolved).map((alert) => (
                <div
                  key={alert.id}
                  className="flex gap-3 p-3 rounded-lg"
                  style={{ background: 'hsl(var(--mt-surface-1))' }}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    alert.severity === "critical" ? "bg-destructive" : alert.severity === "warning" ? "bg-warning" : "bg-accent"
                  }`} />
                  <div>
                    <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--mt-text-secondary))' }}>{alert.message}</p>
                    <p className="mt-data-sm mt-1 flex items-center gap-1 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions Table */}
        <motion.div
          initial={stagger.initial}
          animate={stagger.animate}
          transition={stagger.transition(4)}
          className="card-section overflow-hidden"
        >
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">Recent Sessions</h2>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: 'hsl(var(--mt-gold))' }}>
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left">Session ID</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Supplier</th>
                  <th className="text-left">Operator</th>
                  <th className="text-right">Animals</th>
                  <th className="text-right">Dressing %</th>
                  <th className="text-right">HACCP</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {SESSIONS.slice(0, 8).map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                  >
                    <td className="font-mono text-xs font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{s.id}</td>
                    <td className="text-xs mt-data-sm">{s.date}</td>
                    <td className="text-xs">{getSupplierById(s.supplierId)?.name}</td>
                    <td className="text-xs">{getUserById(s.operatorId)?.name}</td>
                    <td className="text-right font-mono text-xs">{s.animalCount}</td>
                    <td className="text-right font-mono text-xs">{s.dressingPct > 0 ? `${s.dressingPct}%` : "—"}</td>
                    <td className="text-right font-mono text-xs">{s.haccpScore > 0 ? `${s.haccpScore}%` : "—"}</td>
                    <td><span className={statusBadge[s.status]}>{s.status.replace("-", " ")}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
