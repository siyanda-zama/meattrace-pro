import { motion } from "framer-motion";
import {
  Activity, Beef, Weight, TrendingUp, AlertTriangle, DollarSign,
  Plus, Bell, FileDown, Clock,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { SESSIONS, ALERTS, YIELD_TREND_7D, getUserById, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const statusColor: Record<string, string> = {
  completed: "bg-success/10 text-success",
  "in-progress": "bg-accent/10 text-accent",
  flagged: "bg-destructive/10 text-destructive",
  paused: "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  const todaySessions = SESSIONS.filter((s) => s.date === "2024-03-12");
  const totalAnimals = todaySessions.reduce((a, s) => a + s.animalCount, 0);
  const totalCDM = todaySessions.reduce((a, s) => a + s.totalCDM, 0);
  const avgDressing = todaySessions.filter((s) => s.dressingPct > 0).reduce((a, s, _, arr) => a + s.dressingPct / arr.length, 0);
  const activeAlerts = ALERTS.filter((a) => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Centre</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-1.5" /> Export
          </Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
            <Plus className="w-4 h-4 mr-1.5" /> New Session
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Today's Sessions" value={todaySessions.length} icon={Activity} subtitle="2 active" />
        <KPICard title="Animals Processed" value={totalAnimals} icon={Beef} trend={{ value: 12, positive: true }} />
        <KPICard title="Total CDM (kg)" value={totalCDM.toLocaleString()} icon={Weight} />
        <KPICard title="Avg Dressing %" value={`${avgDressing.toFixed(1)}%`} icon={TrendingUp} trend={{ value: 1.2, positive: true }} />
        <KPICard title="Active Alerts" value={activeAlerts} icon={AlertTriangle} accent={activeAlerts > 2} />
        <KPICard title="Revenue Est." value="R 482,300" icon={DollarSign} accent />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Yield Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card rounded-lg p-5 shadow-card"
        >
          <h2 className="text-sm font-semibold mb-4">Yield Performance (7 Day)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={YIELD_TREND_7D}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 20% 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(215 15% 47%)" />
              <YAxis domain={[40, 60]} tick={{ fontSize: 11 }} stroke="hsl(215 15% 47%)" />
              <Tooltip
                contentStyle={{
                  background: "hsl(0 0% 100%)",
                  border: "1px solid hsl(216 20% 90%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <ReferenceLine y={52} stroke="hsl(42 64% 45%)" strokeDasharray="5 5" label={{ value: "Benchmark", fill: "hsl(42 64% 45%)", fontSize: 10 }} />
              <Line type="monotone" dataKey="dressingPct" stroke="hsl(216 65% 15%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(216 65% 15%)" }} name="Dressing %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alerts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Live Alerts</h2>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {ALERTS.filter((a) => !a.resolved).map((alert) => (
              <div key={alert.id} className="flex gap-3 p-3 rounded-md bg-secondary/50">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  alert.severity === "critical" ? "bg-destructive" : alert.severity === "warning" ? "bg-warning" : "bg-accent"
                }`} />
                <div>
                  <p className="text-xs leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-lg shadow-card overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Session ID</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Supplier</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Operator</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Animals</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Dressing %</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">HACCP</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {SESSIONS.slice(0, 8).map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{s.id}</td>
                  <td className="p-3 text-xs">{s.date}</td>
                  <td className="p-3 text-xs">{getSupplierById(s.supplierId)?.name}</td>
                  <td className="p-3 text-xs">{getUserById(s.operatorId)?.name}</td>
                  <td className="p-3 text-xs text-right font-mono">{s.animalCount}</td>
                  <td className="p-3 text-xs text-right font-mono">{s.dressingPct > 0 ? `${s.dressingPct}%` : "—"}</td>
                  <td className="p-3 text-xs text-right font-mono">{s.haccpScore > 0 ? `${s.haccpScore}%` : "—"}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className={`text-[10px] ${statusColor[s.status]}`}>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
