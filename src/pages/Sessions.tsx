import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SESSIONS, getUserById, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

const statusBadge: Record<string, string> = {
  completed: "badge-complete",
  "in-progress": "badge-live",
  flagged: "badge-warn",
  paused: "badge-pending",
};

const steps = ["Intake", "Processing", "HACCP", "Yield", "Complete"];

const Sessions = () => (
  <div>
    <PageHeader
      breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Sessions" }]}
      title="Slaughter Sessions"
      subtitle="Manage and track all processing sessions"
      actions={
        <Button size="sm" className="text-white font-semibold" style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}>
          <Plus className="w-4 h-4 mr-1.5" /> Start Session
        </Button>
      }
    />
    <div className="px-8 py-6 space-y-5">
      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--mt-text-muted))' }} />
          <Input placeholder="Search sessions..." className="pl-9 h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
        </div>
        <Button variant="outline" size="sm" style={{ borderRadius: 'var(--mt-radius-sm)' }}>
          <Filter className="w-4 h-4 mr-1.5" /> Filters
        </Button>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {SESSIONS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card-section p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium" style={{ color: 'hsl(var(--mt-navy))' }}>{s.id}</span>
                  <span className={statusBadge[s.status]}>{s.status.replace("-", " ")}</span>
                </div>
                <p className="mt-data-sm mt-1">{s.date} · {getSupplierById(s.supplierId)?.name} · {getUserById(s.operatorId)?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium">{s.animalCount} animals</p>
                {s.dressingPct > 0 && <p className="mt-data-sm">{s.dressingPct}% dressing</p>}
              </div>
            </div>
            {/* Timeline stepper */}
            <div className="flex items-center gap-1">
              {steps.map((step, idx) => (
                <div key={step} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{
                        background: idx < s.step
                          ? 'hsl(var(--mt-pass))'
                          : idx === s.step
                            ? 'hsl(var(--mt-gold))'
                            : 'hsl(var(--mt-surface-2))',
                      }}
                    />
                  </div>
                  <p className="text-[10px] mt-1 text-center" style={{ color: 'hsl(var(--mt-text-muted))' }}>{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Sessions;
