import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SESSIONS, getUserById, getSupplierById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Filter, ChevronUp, ChevronDown, FileDown, X,
} from "lucide-react";
import { useCsvExport } from "@/hooks/use-csv-export";

/* ── Constants ── */
const statusBadge: Record<string, string> = {
  completed: "badge-complete",
  "in-progress": "badge-live",
  flagged: "badge-warn",
  paused: "badge-pending",
};

const steps = ["Intake", "Processing", "HACCP", "Yield", "Complete"];
const stepPercent = [20, 40, 60, 80, 100];

const ITEMS_PER_PAGE = 6;

type SortField = "id" | "date" | "animalCount" | "dressingPct" | "haccpScore";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "in-progress" | "completed" | "flagged";

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Flagged", value: "flagged" },
];

/* ── Column sort header ── */
function SortHeader({
  label,
  field,
  current,
  dir,
  onSort,
}: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
      style={{ color: active ? "hsl(var(--mt-gold))" : "hsl(var(--mt-text-muted))" }}
      onClick={() => onSort(field)}
    >
      {label}
      {active ? (
        dir === "asc" ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )
      ) : (
        <ChevronUp className="w-3.5 h-3.5 opacity-30" />
      )}
    </button>
  );
}

/* ── Main component ── */
const Sessions = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const exportCsv = useCsvExport();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  /* ── Filter + search + sort ── */
  const filtered = useMemo(() => {
    let result = [...SESSIONS];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => {
        const supplier = getSupplierById(s.supplierId)?.name ?? "";
        const operator = getUserById(s.operatorId)?.name ?? "";
        return (
          s.id.toLowerCase().includes(q) ||
          supplier.toLowerCase().includes(q) ||
          operator.toLowerCase().includes(q)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "id": cmp = a.id.localeCompare(b.id); break;
        case "date": cmp = a.date.localeCompare(b.date); break;
        case "animalCount": cmp = a.animalCount - b.animalCount; break;
        case "dressingPct": cmp = a.dressingPct - b.dressingPct; break;
        case "haccpScore": cmp = a.haccpScore - b.haccpScore; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, statusFilter, sortField, sortDir]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* ── CSV export ── */
  const handleExport = () => {
    const rows = filtered.map(s => ({
      ID: s.id,
      Date: s.date,
      Status: s.status,
      Supplier: getSupplierById(s.supplierId)?.name ?? "",
      Operator: getUserById(s.operatorId)?.name ?? "",
      Animals: s.animalCount,
      "Live Weight (kg)": s.totalLiveWeight,
      "CDM (kg)": s.totalCDM,
      "Dressing %": s.dressingPct,
      "HACCP Score": s.haccpScore,
    }));
    exportCsv(rows, "meattrace-sessions");
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Sessions" }]}
        title="Slaughter Sessions"
        subtitle="Manage and track all processing sessions"
        actions={
          <Button
            size="sm"
            className="text-white font-semibold"
            style={{
              background: "hsl(var(--mt-gold))",
              borderRadius: "var(--mt-radius-sm)",
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Start Session
          </Button>
        }
      />

      <div className="px-8 py-6 space-y-5">
        {/* ── Search + Filters + Export ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "hsl(var(--mt-text-muted))" }}
            />
            <Input
              placeholder="Search by ID, supplier, operator..."
              className="pl-9 h-10"
              style={{ borderRadius: "var(--mt-radius-sm)" }}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => { setSearch(""); setPage(1); }}
              >
                <X className="w-4 h-4" style={{ color: "hsl(var(--mt-text-muted))" }} />
              </button>
            )}
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5">
            {statusFilters.map(f => (
              <Button
                key={f.value}
                variant={statusFilter === f.value ? "default" : "outline"}
                size="sm"
                style={{
                  borderRadius: "var(--mt-radius-sm)",
                  ...(statusFilter === f.value
                    ? { background: "hsl(var(--mt-navy))", color: "white" }
                    : {}),
                }}
                onClick={() => { setStatusFilter(f.value); setPage(1); }}
              >
                <Filter className="w-3.5 h-3.5 mr-1" />
                {f.label}
              </Button>
            ))}
          </div>

          {/* CSV export */}
          <Button
            variant="outline"
            size="sm"
            style={{ borderRadius: "var(--mt-radius-sm)" }}
            onClick={handleExport}
          >
            <FileDown className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        </div>

        {/* ── Sort headers ── */}
        <div className="flex gap-6 px-1">
          <SortHeader label="ID" field="id" current={sortField} dir={sortDir} onSort={handleSort} />
          <SortHeader label="Date" field="date" current={sortField} dir={sortDir} onSort={handleSort} />
          <SortHeader label="Animals" field="animalCount" current={sortField} dir={sortDir} onSort={handleSort} />
          <SortHeader label="Dressing %" field="dressingPct" current={sortField} dir={sortDir} onSort={handleSort} />
          <SortHeader label="HACCP" field="haccpScore" current={sortField} dir={sortDir} onSort={handleSort} />
        </div>

        {/* ── Sessions list ── */}
        {paginated.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-section p-12 text-center"
          >
            <Search className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(var(--mt-text-muted))" }} />
            <p className="text-sm font-medium" style={{ color: "hsl(var(--mt-navy))" }}>
              No sessions found
            </p>
            <p className="text-xs mt-1" style={{ color: "hsl(var(--mt-text-muted))" }}>
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {paginated.map((s, i) => {
              const supplier = getSupplierById(s.supplierId);
              const operator = getUserById(s.operatorId);
              const haccpFail = s.haccpScore > 0 && s.haccpScore < 80;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card-section p-5"
                  style={
                    haccpFail
                      ? { borderLeft: "3px solid hsl(0, 72%, 51%)" }
                      : undefined
                  }
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-sm font-medium"
                          style={{ color: "hsl(var(--mt-navy))" }}
                        >
                          {s.id}
                        </span>
                        <span className={statusBadge[s.status]}>
                          {s.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="mt-data-sm mt-1">
                        {s.date} &middot; {supplier?.name ?? "—"} &middot; {operator?.name ?? "—"}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="font-mono text-sm font-medium">
                        {s.animalCount} animals
                      </p>
                      {s.dressingPct > 0 && (
                        <p className="mt-data-sm">{s.dressingPct}% dressing</p>
                      )}
                      <p
                        className="font-mono text-xs font-medium"
                        style={{
                          color: haccpFail
                            ? "hsl(var(--mt-alert))"
                            : s.haccpScore === 0
                              ? "hsl(var(--mt-text-muted))"
                              : "hsl(var(--mt-pass))",
                        }}
                      >
                        HACCP: {s.haccpScore > 0 ? `${s.haccpScore}%` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Timeline stepper */}
                  <div className="flex items-center gap-1">
                    {steps.map((step, idx) => {
                      const completed = idx < s.step;
                      const current = idx === s.step;
                      const pct = completed
                        ? stepPercent[idx]
                        : current
                          ? Math.round(stepPercent[idx] * 0.5)
                          : 0;

                      return (
                        <div key={step} className="flex-1">
                          <div className="flex items-center">
                            <div
                              className="w-full h-1.5 rounded-full"
                              style={{
                                background: completed
                                  ? "hsl(var(--mt-pass))"
                                  : current
                                    ? "hsl(var(--mt-gold))"
                                    : "hsl(var(--mt-surface-2))",
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <p
                              className="text-[10px]"
                              style={{ color: "hsl(var(--mt-text-muted))" }}
                            >
                              {step}
                            </p>
                            <p
                              className="text-[10px] font-mono"
                              style={{
                                color: completed
                                  ? "hsl(var(--mt-pass))"
                                  : "hsl(var(--mt-text-muted))",
                              }}
                            >
                              {pct}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs" style={{ color: "hsl(var(--mt-text-muted))" }}>
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} sessions
            </p>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                style={{ borderRadius: "var(--mt-radius-sm)" }}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  style={{
                    borderRadius: "var(--mt-radius-sm)",
                    minWidth: 36,
                    ...(p === page
                      ? { background: "hsl(var(--mt-navy))", color: "white" }
                      : {}),
                  }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                style={{ borderRadius: "var(--mt-radius-sm)" }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
