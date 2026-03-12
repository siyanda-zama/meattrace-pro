import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, Beef, Weight, TrendingUp, AlertTriangle, DollarSign,
  Plus, FileDown, Clock, ArrowRight, ChevronUp, ChevronDown,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SESSIONS, ALERTS, YIELD_TREND_7D, getUserById, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const stagger = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: (i: number) => ({ duration: 0.35, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }),
};

const statusBadge: Record<string, string> = {
  completed: "badge-complete",
  "in-progress": "badge-live",
  flagged: "badge-warn",
  paused: "badge-pending",
};

const severityColors: Record<string, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  info: "bg-accent",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [sortCol, setSortCol] = useState<string>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const todaySessions = SESSIONS.filter((s) => s.date === "2024-03-12");
  const yesterdaySessions = SESSIONS.filter((s) => s.date === "2024-03-11");
  const totalAnimals = todaySessions.reduce((a, s) => a + s.animalCount, 0);
  const yesterdayAnimals = yesterdaySessions.reduce((a, s) => a + s.animalCount, 0);
  const totalCDM = todaySessions.reduce((a, s) => a + s.totalCDM, 0);
  const yesterdayCDM = yesterdaySessions.reduce((a, s) => a + s.totalCDM, 0);
  const avgDressing = todaySessions.filter((s) => s.dressingPct > 0).reduce((a, s, _, arr) => a + s.dressingPct / arr.length, 0);
  const yesterdayAvgDress = yesterdaySessions.filter((s) => s.dressingPct > 0).reduce((a, s, _, arr) => a + s.dressingPct / arr.length, 0);
  const activeAlerts = ALERTS.filter((a) => !a.resolved).length;
  const todayRevenue = totalCDM * 55;

  const animalDelta = yesterdayAnimals > 0 ? Math.round(((totalAnimals - yesterdayAnimals) / yesterdayAnimals) * 100) : 0;
  const cdmDelta = yesterdayCDM > 0 ? Math.round(((totalCDM - yesterdayCDM) / yesterdayCDM) * 100) : 0;
  const dressDelta = yesterdayAvgDress > 0 ? +((avgDressing - yesterdayAvgDress).toFixed(1)) : 0;

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const sorted = [...SESSIONS].slice(0, 8).sort((a, b) => {
    let va: any = a[sortCol as keyof typeof a];
    let vb: any = b[sortCol as keyof typeof b];
    if (typeof va === "string") return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortAsc ? va - vb : vb - va;
  });

  const SortIcon = ({ col }: { col: string }) => (
    sortCol === col ? (sortAsc ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />) : null
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Command Centre" }]}
        title="Command Centre"
        subtitle="Real-time overview of today's operations at KZN Processing Plant"
        actions={
          <>
            <Button variant="outline" size="sm" style={{ borderRadius: 'var(--mt-radius-sm)', borderColor: 'hsl(var(--mt-border))' }}>
              <FileDown className="w-4 h-4 mr-1.5" /> Export
            </Button>
            <Button
              size="sm"
              className="text-white font-semibold"
              style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}
              onClick={() => navigate("/sessions")}
            >
              <Plus className="w-4 h-4 mr-1.5" /> New Session
            </Button>
          </>
        }
      />

      <div className="px-8 py-6 space-y-5">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="Today's Sessions" value={todaySessions.length} icon={Activity} subtitle={`${todaySessions.filter(s => s.status === 'in-progress').length} active`} delta={todaySessions.length - yesterdaySessions.length} />
          <KPICard title="Animals Processed" value={totalAnimals} icon={Beef} trend={{ value: Math.abs(animalDelta), positive: animalDelta >= 0 }} />
          <KPICard navy title="Total CDM" value={`${totalCDM.toLocaleString()} kg`} icon={Weight} trend={{ value: Math.abs(cdmDelta), positive: cdmDelta >= 0 }} />
          <KPICard title="Avg Dressing %" value={`${avgDressing.toFixed(1)}%`} icon={TrendingUp} trend={{ value: Math.abs(dressDelta), positive: dressDelta >= 0 }} />
          <KPICard title="Active Alerts" value={activeAlerts} icon={AlertTriangle} subtitle={activeAlerts > 0 ? "Requires attention" : "All clear"} />
          <KPICard title="Revenue Est." value={`R ${todayRevenue.toLocaleString()}`} icon={DollarSign} />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Yield Chart */}
          <motion.div initial={stagger.initial} animate={stagger.animate} transition={stagger.transition(2)} className="lg:col-span-2 card-section">
            <div className="card-section-header flex items-center justify-between">
              <h2 className="mt-heading text-base">Yield Performance (7 Day)</h2>
              <button className="text-xs font-medium flex items-center gap-1" style={{ color: 'hsl(var(--mt-gold))' }} onClick={() => navigate("/yield")}>
                View analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="card-section-body">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={YIELD_TREND_7D}>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(213,65%,15%,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 60]} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "hsl(213,65%,15%)", border: "none", borderRadius: 8, color: "white", fontFamily: "JetBrains Mono", fontSize: 12, padding: "10px 14px" }}
                    itemStyle={{ color: "white" }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                    formatter={(value: number) => [`${value}%`, "Dressing"]}
                  />
                  <ReferenceLine y={52} stroke="hsl(42,64%,45%)" strokeDasharray="5 5" label={{ value: "52% Benchmark", fill: "hsl(42,64%,45%)", fontSize: 10 }} />
                  <Line type="monotone" dataKey="dressingPct" stroke="hsl(42,64%,45%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(42,64%,45%)" }} name="Dressing %" animationDuration={1200} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Alerts Feed */}
          <motion.div initial={stagger.initial} animate={stagger.animate} transition={stagger.transition(3)} className="card-section">
            <div className="card-section-header flex items-center justify-between">
              <h2 className="mt-heading text-base">Live Alerts</h2>
              <span className="badge-alert">{activeAlerts} active</span>
            </div>
            <div className="card-section-body space-y-3">
              {ALERTS.filter((a) => !a.resolved).length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: 'hsl(var(--mt-pass-bg))' }}>
                    <Activity className="w-6 h-6" style={{ color: 'hsl(var(--mt-pass))' }} />
                  </div>
                  <p className="text-sm font-medium">All Clear</p>
                  <p className="text-xs mt-1" style={{ color: 'hsl(var(--mt-text-muted))' }}>No active alerts to display</p>
                </div>
              ) : (
                ALERTS.filter((a) => !a.resolved).map((alert) => (
                  <div key={alert.id} className="flex gap-3 p-3 rounded-lg" style={{ background: 'hsl(var(--mt-surface-1))' }}>
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${severityColors[alert.severity]} ${alert.severity === "critical" ? "animate-pulse" : ""}`} />
                    <div>
                      <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--mt-text-secondary))' }}>{alert.message}</p>
                      <p className="mt-data-sm mt-1 flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions Table */}
        <motion.div initial={stagger.initial} animate={stagger.animate} transition={stagger.transition(4)} className="card-section overflow-hidden">
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">Recent Sessions</h2>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: 'hsl(var(--mt-gold))' }} onClick={() => navigate("/sessions")}>
              View all sessions <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left" onClick={() => handleSort("id")}>Session ID <SortIcon col="id" /></th>
                  <th className="text-left" onClick={() => handleSort("date")}>Date <SortIcon col="date" /></th>
                  <th className="text-left">Supplier</th>
                  <th className="text-left">Operator</th>
                  <th className="text-right" onClick={() => handleSort("animalCount")}>Animals <SortIcon col="animalCount" /></th>
                  <th className="text-right" onClick={() => handleSort("dressingPct")}>Dressing % <SortIcon col="dressingPct" /></th>
                  <th className="text-right" onClick={() => handleSort("haccpScore")}>HACCP <SortIcon col="haccpScore" /></th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    className={s.haccpScore > 0 && s.haccpScore < 80 ? "row-alert" : ""}
                  >
                    <td className="font-mono text-xs font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{s.id}</td>
                    <td className="font-mono text-xs" style={{ color: 'hsl(var(--mt-text-secondary))' }}>{s.date}</td>
                    <td className="text-xs">{getSupplierById(s.supplierId)?.name}</td>
                    <td className="text-xs">{getUserById(s.operatorId)?.name}</td>
                    <td className="text-right font-mono text-xs">{s.animalCount}</td>
                    <td className="text-right font-mono text-xs">{s.dressingPct > 0 ? `${s.dressingPct}%` : "\u2014"}</td>
                    <td className="text-right font-mono text-xs">{s.haccpScore > 0 ? `${s.haccpScore}%` : "\u2014"}</td>
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
