import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSuppliers } from "@/hooks/use-suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MapPin, AlertTriangle, ChevronUp, ChevronDown, FileDown, Loader2 } from "lucide-react";
import { useCsvExport } from "@/hooks/use-csv-export";

const addressMap: Record<string, string> = {
  s1: "Plot 47, Nkandla Road, eMachunwini, KZN 3800",
  s2: "Farm 12, Barberton Valley, Mpumalanga 1300",
  s3: "Stand 88, Makhado West, Limpopo 0920",
  s4: "Lot 5, Ladysmith Industrial, KZN 3370",
  s5: "Unit 3, Witbank Agri Park, Mpumalanga 1035",
  s6: "Farm 210, Modimolle Road, Limpopo 0510",
  s7: "Block C, Pietermaritzburg Hub, KZN 3200",
  s8: "Plot 9, Musina Border Zone, Limpopo 0900",
};

const Suppliers = () => {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const exportCsv = useCsvExport();

  const { data: suppliers, isLoading, error } = useSuppliers();

  const sorted = useMemo(() => {
    if (!suppliers) return [];

    const filtered = suppliers.filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.province.toLowerCase().includes(search.toLowerCase()) ||
      s.cipc.includes(search)
    );

    return [...filtered].sort((a, b) => {
      const va = a[sortCol as keyof typeof a];
      const vb = b[sortCol as keyof typeof b];
      if (typeof va === "string") return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      return sortAsc ? Number(va) - Number(vb) : Number(vb) - Number(va);
    });
  }, [suppliers, search, sortCol, sortAsc]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: string }) => (
    sortCol === col ? (sortAsc ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />) : null
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Analytics" }, { label: "Suppliers" }]}
        title="Supplier Registry"
        subtitle="Compliance tracking, geolocation verification, and blacklist management"
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              style={{ borderRadius: 'var(--mt-radius-sm)' }}
              onClick={() => suppliers && exportCsv(suppliers.map(s => ({
                Name: s.name,
                CIPC: s.cipc,
                Province: s.province,
                GPS: `${s.gps_lat},${s.gps_lng}`,
                Sessions: s.total_sessions,
                AvgDressing: s.avg_dressing_pct,
                Status: s.certification_status
              })), "meattrace-suppliers")}
              disabled={!suppliers}
            >
              <FileDown className="w-4 h-4 mr-1.5" /> CSV
            </Button>
            <Button size="sm" className="text-white font-semibold" style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}>
              <Plus className="w-4 h-4 mr-1.5" /> Add Supplier
            </Button>
          </div>
        }
      />
      <div className="px-4 md:px-8 py-4 md:py-6 space-y-5">
        <div className="relative max-w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--mt-text-muted))' }} />
          <Input placeholder="Search by name, CIPC, or province..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
        </div>

        <div className="card-section overflow-hidden">
          <div className="card-section-header flex items-center justify-between">
            <h2 className="mt-heading text-base">Supplier Registry</h2>
            <span className="font-mono text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>
              {isLoading ? '...' : `${sorted.length} suppliers`}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-table">
              <thead>
                <tr>
                  <th className="text-left" onClick={() => handleSort("name")}>Name <SortIcon col="name" /></th>
                  <th className="text-left">CIPC</th>
                  <th className="text-left" onClick={() => handleSort("province")}>Province <SortIcon col="province" /></th>
                  <th className="text-left">Location</th>
                  <th className="text-right" onClick={() => handleSort("total_sessions")}>Sessions <SortIcon col="total_sessions" /></th>
                  <th className="text-right" onClick={() => handleSort("avg_dressing_pct")}>Avg Dressing % <SortIcon col="avg_dressing_pct" /></th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'hsl(var(--mt-gold))' }} />
                  </td></tr>
                ) : error ? (
                  <tr><td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="w-8 h-8 mb-2" style={{ color: 'hsl(var(--mt-alert))' }} />
                      <p className="text-sm font-medium">Failed to load suppliers</p>
                      <p className="text-xs mt-1" style={{ color: 'hsl(var(--mt-text-muted))' }}>{error.message}</p>
                    </div>
                  </td></tr>
                ) : sorted.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Search className="w-8 h-8 mb-2" style={{ color: 'hsl(var(--mt-text-muted))' }} />
                      <p className="text-sm font-medium">No suppliers found</p>
                      <p className="text-xs mt-1" style={{ color: 'hsl(var(--mt-text-muted))' }}>Try adjusting your search criteria</p>
                    </div>
                  </td></tr>
                ) : sorted.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <td className="font-medium flex items-center gap-2" style={{ color: 'hsl(var(--mt-text-primary))' }}>
                      {s.blacklisted && <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(var(--mt-alert))' }} />}
                      {s.name}
                    </td>
                    <td className="font-mono text-xs">{s.cipc}</td>
                    <td className="text-xs">{s.province}</td>
                    <td className="text-[10px]" style={{ color: 'hsl(var(--mt-text-muted))' }}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {s.address || `${s.gps_lat.toFixed(4)}, ${s.gps_lng.toFixed(4)}`}
                      </div>
                    </td>
                    <td className="text-right font-mono text-xs">{s.total_sessions}</td>
                    <td className="text-right font-mono text-xs">{s.avg_dressing_pct}%</td>
                    <td>
                      {s.blacklisted ? (
                        <span className="badge-alert">Blacklisted</span>
                      ) : (
                        <span className={s.certification_status === "active" ? "badge-pass" : s.certification_status === "pending" ? "badge-pending" : "badge-warn"}>{s.certification_status}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Map visualization */}
        <div className="card-section">
          <div className="card-section-header">
            <h2 className="mt-heading text-base">Supplier Locations</h2>
          </div>
          <div className="card-section-body">
            <div className="rounded-lg p-8" style={{ background: 'hsl(var(--mt-surface-1))', minHeight: 250 }}>
              <div className="grid grid-cols-3 gap-4">
                {["KwaZulu-Natal", "Limpopo", "Mpumalanga"].map(prov => {
                  const count = suppliers?.filter(s => s.province === prov && !s.blacklisted).length || 0;
                  const blacklisted = suppliers?.filter(s => s.province === prov && s.blacklisted).length || 0;
                  return (
                    <div key={prov} className="text-center p-4 rounded-lg" style={{ background: 'hsl(var(--mt-surface-0))', border: '1px solid hsl(var(--mt-border))' }}>
                      <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(var(--mt-gold))' }} />
                      <p className="text-sm font-semibold">{prov}</p>
                      <p className="font-mono text-lg font-medium mt-1">{count}</p>
                      <p className="text-[10px]" style={{ color: 'hsl(var(--mt-text-muted))' }}>active suppliers</p>
                      {blacklisted > 0 && <p className="text-[10px] mt-1" style={{ color: 'hsl(var(--mt-alert))' }}>{blacklisted} blacklisted</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
