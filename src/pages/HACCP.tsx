import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CCP_RECORDS, SESSIONS } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, Clock, ShieldCheck } from "lucide-react";

const iconMap = { pass: CheckCircle2, fail: AlertTriangle, pending: Clock };
const badgeMap = { pass: "badge-pass", fail: "badge-fail", pending: "badge-pending" };

const HACCP = () => {
  const activeSession = SESSIONS.find(s => s.status === "in-progress");
  const records = CCP_RECORDS;
  const passCount = records.filter(r => r.status === "pass").length;
  const failCount = records.filter(r => r.status === "fail").length;
  const pendingCount = records.filter(r => r.status === "pending").length;
  const score = records.length > 0 ? Math.round((passCount / records.length) * 100) : 0;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "HACCP" }]}
        title="HACCP Compliance Engine"
        subtitle="Critical Control Point monitoring and logging"
      />
      <div className="px-8 py-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-navy">
            <div className="relative z-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.09em]" style={{ color: 'hsl(var(--mt-gold))' }}>Compliance Score</p>
              <p className="mt-data-lg text-white mt-1">{score}<span className="text-lg ml-1">/ 100</span></p>
            </div>
          </div>
          <div className="card-kpi">
            <div className="pl-3">
              <p className="mt-label">Passed</p>
              <p className="mt-data font-mono" style={{ color: '#166534' }}>{passCount}</p>
            </div>
          </div>
          <div className="card-kpi">
            <div className="pl-3">
              <p className="mt-label">Failed</p>
              <p className="mt-data font-mono" style={{ color: '#991B1B' }}>{failCount}</p>
            </div>
          </div>
          <div className="card-kpi">
            <div className="pl-3">
              <p className="mt-label">Pending</p>
              <p className="mt-data font-mono" style={{ color: '#92400E' }}>{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* CCP Cards - Kanban style */}
        <div className="card-section">
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">Control Points</h2>
            {activeSession && (
              <span className="badge-live">Session {activeSession.id}</span>
            )}
          </div>
          <div className="card-section-body">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((ccp, i) => {
                const Icon = iconMap[ccp.status];
                return (
                  <motion.div
                    key={ccp.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-lg"
                    style={{
                      border: '1px solid hsl(var(--mt-border))',
                      background: 'hsl(var(--mt-surface-0))',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{
                          color: ccp.status === "pass" ? 'hsl(var(--mt-pass))' : ccp.status === "fail" ? 'hsl(var(--mt-alert))' : 'hsl(var(--mt-warn))'
                        }} />
                        <span className="text-sm font-medium">{ccp.ccpName}</span>
                      </div>
                      <span className={badgeMap[ccp.status]}>{ccp.status}</span>
                    </div>
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'hsl(var(--mt-text-muted))' }}>Required</span>
                        <span className="font-mono">{ccp.requiredValue}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'hsl(var(--mt-text-muted))' }}>Recorded</span>
                        <span className="font-mono">{ccp.recordedValue || "—"}</span>
                      </div>
                      {ccp.timestamp && (
                        <div className="flex justify-between text-xs">
                          <span style={{ color: 'hsl(var(--mt-text-muted))' }}>Logged</span>
                          <span className="font-mono text-[10px]">
                            {new Date(ccp.timestamp).toLocaleString("en-ZA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      )}
                    </div>
                    {ccp.correctiveAction && (
                      <div className="mt-3 p-2 rounded text-xs" style={{ background: 'hsl(var(--mt-warn-bg))', color: '#92400E' }}>
                        <strong>Corrective Action:</strong> {ccp.correctiveAction}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deviation Log Table */}
        <div className="card-section overflow-hidden">
          <div className="card-section-header">
            <h2 className="mt-heading text-base">Deviation Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left">Session</th>
                  <th className="text-left">CCP</th>
                  <th className="text-left">Required</th>
                  <th className="text-left">Recorded</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Corrective Action</th>
                </tr>
              </thead>
              <tbody>
                {records.filter(r => r.status === "fail").map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs font-medium">{r.sessionId}</td>
                    <td className="text-xs">{r.ccpName}</td>
                    <td className="font-mono text-xs">{r.requiredValue}</td>
                    <td className="font-mono text-xs">{r.recordedValue}</td>
                    <td><span className="badge-fail">{r.status}</span></td>
                    <td className="text-xs" style={{ color: 'hsl(var(--mt-text-secondary))' }}>{r.correctiveAction || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HACCP;
