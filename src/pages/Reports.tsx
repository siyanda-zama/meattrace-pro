import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, FileText, ClipboardList, ShieldCheck, BarChart3, Thermometer, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const templates = [
  { title: "Session Summary", description: "Complete session record with intake, HACCP, and yield data", icon: ClipboardList },
  { title: "HACCP Audit Report", description: "CCP monitoring results, deviations, and corrective actions", icon: ShieldCheck },
  { title: "Yield Analysis", description: "Dressing percentages, by-product revenue, and benchmarks", icon: BarChart3 },
  { title: "Cold Chain Log", description: "Temperature sensor readings and deviation events", icon: Thermometer },
  { title: "Supplier Performance", description: "Supplier compliance scores, session history, and quality metrics", icon: Users },
];

const Reports = () => {
  const handleExport = (format: string) => {
    toast({
      title: "Generating report...",
      description: `Your ${format} report is being prepared.`,
    });
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: `Download your ${format} report.`,
      });
    }, 2000);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Reports" }]}
        title="Reports & Exports"
        subtitle="Generate and download compliance and performance reports"
      />
      <div className="px-8 py-6 space-y-5">
        {/* Date range */}
        <div className="flex gap-3 items-end">
          <div className="space-y-1.5">
            <label className="mt-label block">From</label>
            <Input type="date" defaultValue="2024-03-01" className="h-10 font-mono" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
          </div>
          <div className="space-y-1.5">
            <label className="mt-label block">To</label>
            <Input type="date" defaultValue="2024-03-12" className="h-10 font-mono" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
          </div>
        </div>

        {/* Report Templates */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tmpl, i) => (
            <motion.div
              key={tmpl.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-section p-5"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ background: 'hsl(var(--mt-surface-1))' }}>
                  <tmpl.icon className="w-5 h-5" style={{ color: 'hsl(var(--mt-gold))' }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'hsl(var(--mt-navy))' }}>{tmpl.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'hsl(var(--mt-text-muted))' }}>{tmpl.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleExport("PDF")} style={{ borderRadius: 'var(--mt-radius-sm)' }}>
                  <FileDown className="w-3 h-3 mr-1" /> PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport("CSV")} style={{ borderRadius: 'var(--mt-radius-sm)' }}>
                  <FileDown className="w-3 h-3 mr-1" /> CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport("Excel")} style={{ borderRadius: 'var(--mt-radius-sm)' }}>
                  <FileDown className="w-3 h-3 mr-1" /> Excel
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
