import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SUPPLIERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MapPin, AlertTriangle } from "lucide-react";

const Suppliers = () => (
  <div>
    <PageHeader
      breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Suppliers" }]}
      title="Supplier Management"
      subtitle="Registry, compliance tracking, and blacklist management"
      actions={
        <Button size="sm" className="text-white font-semibold" style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Supplier
        </Button>
      }
    />
    <div className="px-8 py-6 space-y-5">
      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--mt-text-muted))' }} />
          <Input placeholder="Search suppliers..." className="pl-9 h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
        </div>
      </div>

      {/* Supplier Table */}
      <div className="card-section overflow-hidden">
        <div className="card-section-header">
          <h2 className="mt-heading text-base">Supplier Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-table">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">CIPC</th>
                <th className="text-left">Province</th>
                <th className="text-left">GPS</th>
                <th className="text-right">Sessions</th>
                <th className="text-right">Avg Dressing %</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="font-medium flex items-center gap-2" style={{ color: 'hsl(var(--mt-text-primary))' }}>
                    {s.blacklisted && <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(var(--mt-alert))' }} />}
                    {s.name}
                  </td>
                  <td className="font-mono text-xs">{s.cipc}</td>
                  <td className="text-xs">{s.province}</td>
                  <td className="font-mono text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" style={{ color: 'hsl(var(--mt-text-muted))' }} />
                    {s.gps.lat.toFixed(4)}, {s.gps.lng.toFixed(4)}
                  </td>
                  <td className="text-right font-mono text-xs">{s.totalSessions}</td>
                  <td className="text-right font-mono text-xs">{s.avgDressingPct}%</td>
                  <td>
                    {s.blacklisted ? (
                      <span className="badge-alert">Blacklisted</span>
                    ) : (
                      <span className={
                        s.certificationStatus === "active" ? "badge-pass" :
                        s.certificationStatus === "pending" ? "badge-pending" : "badge-warn"
                      }>{s.certificationStatus}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="card-section">
        <div className="card-section-header">
          <h2 className="mt-heading text-base">Supplier Locations</h2>
        </div>
        <div className="card-section-body">
          <div
            className="rounded-lg flex items-center justify-center"
            style={{ background: 'hsl(var(--mt-surface-1))', minHeight: 250 }}
          >
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(var(--mt-text-muted))' }} />
              <p className="mt-subhead">Map View</p>
              <p className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>KwaZulu-Natal · Limpopo · Mpumalanga</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Suppliers;
