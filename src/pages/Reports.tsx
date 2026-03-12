import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, ClipboardList, ShieldCheck, BarChart3, Thermometer, Users, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const templates = [
  { title: "Session Summary", description: "Complete session record with intake data, HACCP check results, and yield calculations per batch", icon: ClipboardList, formats: ["PDF", "CSV", "Excel"] },
  { title: "HACCP Audit Report", description: "CCP monitoring results, deviation log, corrective actions taken, and compliance scoring", icon: ShieldCheck, formats: ["PDF", "Excel"] },
  { title: "Yield Analysis", description: "Dressing percentages, by-product revenue breakdowns, and benchmark comparisons", icon: BarChart3, formats: ["PDF", "CSV", "Excel"] },
  { title: "Cold Chain Log", description: "24-hour temperature sensor readings, deviation events, and equipment status", icon: Thermometer, formats: ["PDF", "CSV"] },
  { title: "Supplier Performance", description: "Compliance scores, session history, average dressing %, and certification status", icon: Users, formats: ["PDF", "CSV", "Excel"] },
];

const Reports = () => {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleExport = (title: string, format: string) => {
    const key = `${title}-${format}`;
    setGenerating(key);
    toast({ title: "Generating report...", description: `Preparing ${title} as ${format}` });
    setTimeout(() => {
      setGenerating(null);
      toast({ title: "Report ready", description: `${title} (${format}) is ready for download` });
    }, 2000);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Analytics" }, { label: "Reports" }]}
        title="Reports & Exports"
        subtitle="Generate audit-ready compliance and performance reports for certification bodies"
      />
      <div className="px-8 py-6 space-y-5">
        {/* Date range */}
        <div className="card-section p-5">
          <p className="mt-label mb-3">Report Period</p>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="space-y-1.5">
              <label className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>From</label>
              <Input type="date" defaultValue="2024-03-01" className="h-10 font-mono w-44" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>To</label>
              <Input type="date" defaultValue="2024-03-12" className="h-10 font-mono w-44" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tmpl, i) => (
            <motion.div key={tmpl.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-section p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-4 flex-1">
                <div className="p-2 rounded-lg shrink-0" style={{ background: 'hsl(var(--mt-surface-1))' }}>
                  <tmpl.icon className="w-5 h-5" style={{ color: 'hsl(var(--mt-gold))' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'hsl(var(--mt-text-primary))' }}>{tmpl.title}</h3>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'hsl(var(--mt-text-muted))' }}>{tmpl.description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {tmpl.formats.map(fmt => {
                  const key = `${tmpl.title}-${fmt}`;
                  const isGenerating = generating === key;
                  return (
                    <Button key={fmt} size="sm" variant="outline" onClick={() => handleExport(tmpl.title, fmt)} disabled={isGenerating} style={{ borderRadius: 'var(--mt-radius-sm)' }}>
                      {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <FileDown className="w-3 h-3 mr-1" />} {fmt}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
