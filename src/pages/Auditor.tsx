import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SESSIONS, CCP_RECORDS, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Search, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCsvExport } from "@/hooks/use-csv-export";

const standards = [
  { name: "HACCP", score: 92, status: "Ready", desc: "Hazard Analysis & Critical Control Points" },
  { name: "ISO 22000", score: 85, status: "In Progress", desc: "Food Safety Management Systems" },
  { name: "FSSC 22000", score: 78, status: "Pending", desc: "Foundation for Food Safety Certification" },
];

const statusBadge: Record<string, string> = {
  completed: "badge-complete", "in-progress": "badge-live", flagged: "badge-warn", paused: "badge-pending",
};

const Auditor = () => {
  const [search, setSearch] = useState("");
  const exportCsv = useCsvExport();

  const filteredSessions = SESSIONS.filter(s =>
    !search || s.id.toLowerCase().includes(search.toLowerCase()) || s.date.includes(search)
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Compliance" }, { label: "Auditor Portal" }]}
        title="Compliance Vault"
        subtitle="Encrypted, read-only audit access to all session and compliance records"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" style={{ borderRadius: 'var(--mt-radius-sm)' }}
              onClick={() => exportCsv(SESSIONS.map(s => ({
                SessionID: s.id, Date: s.date, Supplier: getSupplierById(s.supplierId)?.name ?? "", Animals: s.animalCount, DressingPct: s.dressingPct, HACCPScore: s.haccpScore, Status: s.status
              })), "meattrace-audit-sessions")}>
              <FileDown className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
            <Button size="sm" variant="outline" style={{ borderRadius: 'var(--mt-radius-sm)' }}>
              <FileDown className="w-4 h-4 mr-1.5" /> Export PDF
            </Button>
          </div>
        }
      />
      <div className="px-8 py-6 space-y-5">
        {/* Encrypted access notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: 'hsl(var(--mt-surface-2))', color: 'hsl(var(--mt-text-secondary))' }}>
          <Lock className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--mt-gold))' }} />
          All records are AES-256 encrypted and tamper-proof. This portal provides read-only access for certification bodies.
        </div>

        {/* Certification readiness */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {standards.map((std, i) => (
            <motion.div key={std.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-section p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" style={{ color: 'hsl(var(--mt-gold))' }} />
                  <div>
                    <p className="text-sm font-semibold">{std.name}</p>
                    <p className="text-[10px]" style={{ color: 'hsl(var(--mt-text-muted))' }}>{std.desc}</p>
                  </div>
                </div>
                <span className={std.score >= 90 ? "badge-pass" : std.score >= 80 ? "badge-warn" : "badge-pending"}>{std.status}</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full mt-2" style={{ background: 'hsl(var(--mt-surface-2))' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${std.score}%` }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                  className="h-full rounded-full"
                  style={{ background: std.score >= 90 ? 'hsl(var(--mt-pass))' : std.score >= 80 ? 'hsl(var(--mt-gold))' : 'hsl(var(--mt-warn))' }}
                />
              </div>
              <p className="font-mono text-lg font-medium mt-2">{std.score}<span className="text-xs ml-0.5" style={{ color: 'hsl(var(--mt-text-muted))' }}>/ 100</span></p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--mt-text-muted))' }} />
          <Input placeholder="Search by session ID or date..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
        </div>

        {/* Session Records */}
        <div className="card-section overflow-hidden">
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">Session Records</h2>
            <span className="font-mono text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>{filteredSessions.length} sessions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left">Session ID</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Supplier</th>
                  <th className="text-right">Animals</th>
                  <th className="text-right">Dressing %</th>
                  <th className="text-right">HACCP Score</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((s) => (
                  <tr key={s.id} className={s.haccpScore > 0 && s.haccpScore < 80 ? "row-alert" : ""}>
                    <td className="font-mono text-xs font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{s.id}</td>
                    <td className="font-mono text-xs">{s.date}</td>
                    <td className="text-xs">{getSupplierById(s.supplierId)?.name}</td>
                    <td className="text-right font-mono text-xs">{s.animalCount}</td>
                    <td className="text-right font-mono text-xs">{s.dressingPct > 0 ? `${s.dressingPct}%` : "\u2014"}</td>
                    <td className="text-right font-mono text-xs">{s.haccpScore > 0 ? `${s.haccpScore}%` : "\u2014"}</td>
                    <td><span className={statusBadge[s.status]}>{s.status.replace("-", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HACCP Deviations */}
        <div className="card-section overflow-hidden">
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">HACCP Deviations</h2>
            <span className="badge-alert">{CCP_RECORDS.filter(r => r.status === "fail").length} deviations</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left">Session</th>
                  <th className="text-left">CCP</th>
                  <th className="text-left">Required</th>
                  <th className="text-left">Recorded</th>
                  <th className="text-left">Corrective Action</th>
                </tr>
              </thead>
              <tbody>
                {CCP_RECORDS.filter(r => r.status === "fail").map(r => (
                  <tr key={r.id} className="row-alert">
                    <td className="font-mono text-xs font-medium">{r.sessionId}</td>
                    <td className="text-xs">{r.ccpName}</td>
                    <td className="font-mono text-xs">{r.requiredValue}</td>
                    <td className="font-mono text-xs">{r.recordedValue}</td>
                    <td className="text-xs max-w-xs" style={{ color: 'hsl(var(--mt-text-secondary))' }}>{r.correctiveAction || "\u2014"}</td>
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

export default Auditor;
