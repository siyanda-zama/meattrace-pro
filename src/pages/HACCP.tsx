import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { CCP_RECORDS, SESSIONS } from "@/lib/mock-data";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap = { pass: CheckCircle2, fail: AlertTriangle, pending: Clock };
const badgeMap = { pass: "badge-pass", fail: "badge-fail", pending: "badge-pending" };
const borderColorMap: Record<string, string> = {
  pass: "hsl(142, 72%, 37%)",
  fail: "hsl(0, 72%, 51%)",
  pending: "hsl(32, 95%, 44%)",
};

/* ── Animated SVG compliance gauge ── */
function ComplianceGauge({ score }: { score: number }) {
  const [drawn, setDrawn] = useState(0);
  const radius = 70;
  const stroke = 10;
  const circumference = Math.PI * radius; // half-circle
  const center = radius + stroke;
  const size = (radius + stroke) * 2;

  useEffect(() => {
    const timeout = setTimeout(() => setDrawn(score), 120);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = circumference - (drawn / 100) * circumference;
  const gaugeColor =
    score >= 80
      ? "hsl(142, 72%, 37%)"
      : score >= 50
        ? "hsl(32, 95%, 44%)"
        : "hsl(0, 72%, 51%)";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={center + 8} viewBox={`0 0 ${size} ${center + 8}`}>
        {/* background arc */}
        <path
          d={`M ${stroke} ${center} A ${radius} ${radius} 0 0 1 ${size - stroke} ${center}`}
          fill="none"
          stroke="hsl(var(--mt-border))"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d={`M ${stroke} ${center} A ${radius} ${radius} 0 0 1 ${size - stroke} ${center}`}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: 28, fontWeight: 700, fill: "hsl(var(--mt-text-primary))" }}
        >
          {score}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          style={{ fontSize: 11, fill: "hsl(var(--mt-text-muted))" }}
        >
          / 100
        </text>
      </svg>
    </div>
  );
}

type SortCol = "sessionId" | "ccpName" | "requiredValue" | "recordedValue";

const HACCP = () => {
  const activeSession = SESSIONS.find((s) => s.status === "in-progress");
  const records = CCP_RECORDS;
  const passCount = records.filter((r) => r.status === "pass").length;
  const failCount = records.filter((r) => r.status === "fail").length;
  const pendingCount = records.filter((r) => r.status === "pending").length;
  const score =
    records.length > 0 ? Math.round((passCount / records.length) * 100) : 0;

  const [sortCol, setSortCol] = useState<SortCol>("sessionId");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const failedRecords = records
    .filter((r) => r.status === "fail")
    .sort((a, b) => {
      const aVal = a[sortCol] ?? "";
      const bVal = b[sortCol] ?? "";
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const ThSortable = ({ col, children }: { col: SortCol; children: React.ReactNode }) => (
    <th
      className="text-left cursor-pointer select-none"
      onClick={() => handleSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown className="w-3 h-3" style={{ opacity: sortCol === col ? 1 : 0.3 }} />
      </span>
    </th>
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "HACCP" }]}
        title="HACCP Compliance Engine"
        subtitle="Critical Control Point monitoring and logging"
        actions={
          <Button
            className="h-10 gap-2 text-white font-semibold"
            style={{
              background: "hsl(var(--mt-gold))",
              borderRadius: "var(--mt-radius-sm)",
            }}
          >
            <Plus className="w-4 h-4" /> Log New CCP
          </Button>
        }
      />
      <div className="px-8 py-6 space-y-5">
        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            navy
            title="Compliance Score"
            value={score}
            subtitle={`${passCount} of ${records.length} passed`}
            icon={ShieldCheck}
          />
          <KPICard
            title="Passed"
            value={passCount}
            icon={CheckCircle2}
            trend={{ value: 0, positive: true }}
          />
          <KPICard
            title="Failed"
            value={failCount}
            icon={AlertTriangle}
          />
          <KPICard
            title="Pending"
            value={pendingCount}
            icon={Clock}
          />
        </div>

        {/* ── Compliance Gauge ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="card-section"
        >
          <div className="card-section-header">
            <h2 className="mt-heading text-base">Compliance Gauge</h2>
          </div>
          <div className="card-section-body flex items-center justify-center py-4">
            <ComplianceGauge score={score} />
          </div>
        </motion.div>

        {/* ── CCP Cards - Kanban grid ── */}
        <div className="card-section">
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">Control Points</h2>
            <div className="flex items-center gap-2">
              {activeSession && (
                <span className="badge-live">Session {activeSession.id}</span>
              )}
            </div>
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
                      border: "1px solid hsl(var(--mt-border))",
                      borderLeft: `4px solid ${borderColorMap[ccp.status]}`,
                      background: "hsl(var(--mt-surface-0))",
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="w-4 h-4"
                          style={{ color: borderColorMap[ccp.status] }}
                        />
                        <span className="text-sm font-medium">{ccp.ccpName}</span>
                      </div>
                      <span className={badgeMap[ccp.status]}>{ccp.status}</span>
                    </div>
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "hsl(var(--mt-text-muted))" }}>Required</span>
                        <span className="font-mono">{ccp.requiredValue}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "hsl(var(--mt-text-muted))" }}>Recorded</span>
                        <span className="font-mono">{ccp.recordedValue || "\u2014"}</span>
                      </div>
                      {ccp.timestamp && (
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "hsl(var(--mt-text-muted))" }}>Logged</span>
                          <span className="font-mono text-[10px]">
                            {new Date(ccp.timestamp).toLocaleString("en-ZA", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    {ccp.correctiveAction && (
                      <div
                        className="mt-3 p-2 rounded text-xs"
                        style={{
                          background: "hsl(var(--mt-warn-bg))",
                          color: "#92400E",
                        }}
                      >
                        <strong>Corrective Action:</strong> {ccp.correctiveAction}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Deviation Log Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-section overflow-hidden"
        >
          <div className="card-section-header">
            <h2 className="mt-heading text-base">Deviation Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <ThSortable col="sessionId">Session</ThSortable>
                  <ThSortable col="ccpName">CCP</ThSortable>
                  <ThSortable col="requiredValue">Required</ThSortable>
                  <ThSortable col="recordedValue">Recorded</ThSortable>
                  <th className="text-left">Status</th>
                  <th className="text-left">Corrective Action</th>
                </tr>
              </thead>
              <tbody>
                {failedRecords.map((r) => (
                  <tr key={r.id} className="row-alert">
                    <td className="font-mono text-xs font-medium">{r.sessionId}</td>
                    <td className="text-xs">{r.ccpName}</td>
                    <td className="font-mono text-xs">{r.requiredValue}</td>
                    <td className="font-mono text-xs">{r.recordedValue}</td>
                    <td>
                      <span className="badge-fail">{r.status}</span>
                    </td>
                    <td
                      className="text-xs"
                      style={{ color: "hsl(var(--mt-text-secondary))" }}
                    >
                      {r.correctiveAction || "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HACCP;
