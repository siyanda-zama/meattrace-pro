import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SESSIONS, CCP_RECORDS, getUserById, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Search, ShieldCheck, FileText, Award } from "lucide-react";

const standards = [
  { name: "HACCP", score: 92, status: "Ready" },
  { name: "ISO 22000", score: 85, status: "In Progress" },
  { name: "FSSC 22000", score: 78, status: "Pending" },
];

const Auditor = () => (
  <div>
    <PageHeader
      breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Auditor" }]}
      title="Compliance Vault"
      subtitle="Read-only audit access to all session and compliance records"
      actions={
        <Button size="sm" variant="outline" style={{ borderRadius: 'var(--mt-radius-sm)' }}>
          <FileDown className="w-4 h-4 mr-1.5" /> Export to PDF
        </Button>
      }
    />
    <div className="px-8 py-6 space-y-5">
      {/* Certification readiness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {standards.map((std, i) => (
          <motion.div
            key={std.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-kpi"
          >
            <div className="pl-3 flex items-center justify-between">
              <div>
                <p className="mt-label">{std.name}</p>
                <p className="mt-data mt-1">{std.score}<span className="text-sm ml-0.5" style={{ color: 'hsl(var(--mt-text-muted))' }}>/ 100</span></p>
              </div>
              <span className={std.score >= 90 ? "badge-pass" : std.score >= 80 ? "badge-warn" : "badge-pending"}>
                {std.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--mt-text-muted))' }} />
          <Input placeholder="Search by session ID, CCP, date..." className="pl-9 h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
        </div>
      </div>

      {/* Session Records */}
      <div className="card-section overflow-hidden">
        <div className="card-section-header flex items-center justify-between">
          <h2 className="mt-heading text-base">Session Records</h2>
          <span className="mt-data-sm">{SESSIONS.length} sessions</span>
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
              {SESSIONS.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-xs font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{s.id}</td>
                  <td className="font-mono text-xs">{s.date}</td>
                  <td className="text-xs">{getSupplierById(s.supplierId)?.name}</td>
                  <td className="text-right font-mono text-xs">{s.animalCount}</td>
                  <td className="text-right font-mono text-xs">{s.dressingPct > 0 ? `${s.dressingPct}%` : "—"}</td>
                  <td className="text-right font-mono text-xs">{s.haccpScore > 0 ? `${s.haccpScore}%` : "—"}</td>
                  <td>
                    <span className={
                      s.status === "completed" ? "badge-complete" :
                      s.status === "flagged" ? "badge-warn" :
                      s.status === "in-progress" ? "badge-live" : "badge-pending"
                    }>{s.status.replace("-", " ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HACCP Deviation Log */}
      <div className="card-section overflow-hidden">
        <div className="card-section-header">
          <h2 className="mt-heading text-base">HACCP Deviations</h2>
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
                <tr key={r.id}>
                  <td className="font-mono text-xs font-medium">{r.sessionId}</td>
                  <td className="text-xs">{r.ccpName}</td>
                  <td className="font-mono text-xs">{r.requiredValue}</td>
                  <td className="font-mono text-xs">{r.recordedValue}</td>
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

export default Auditor;
