import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Upload, CheckCircle2, Loader2, Camera } from "lucide-react";

const Intake = () => {
  const [gpsState, setGpsState] = useState<"idle" | "loading" | "done">("idle");
  const [docState, setDocState] = useState<"idle" | "loading" | "done">("idle");

  const detectGPS = () => {
    setGpsState("loading");
    setTimeout(() => setGpsState("done"), 1500);
  };

  const uploadDoc = () => {
    setDocState("loading");
    setTimeout(() => setDocState("done"), 2000);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Intake" }]}
        title="Biosecurity & Intake"
        subtitle="Digital Birth Certificate and animal intake management"
      />
      <div className="px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Supplier Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-section">
            <div className="card-section-header">
              <h3 className="mt-heading text-base">Supplier Details</h3>
            </div>
            <div className="card-section-body space-y-4">
              <div className="space-y-1.5">
                <label className="mt-label block">Farmer ID</label>
                <Input placeholder="Enter farmer ID" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">CIPC Number <span style={{ color: 'hsl(var(--mt-gold))' }}>*</span></label>
                <Input placeholder="2015/123456/07" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">GPS Location</label>
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start gap-2"
                  style={{ borderRadius: 'var(--mt-radius-sm)' }}
                  onClick={detectGPS}
                  disabled={gpsState === "loading"}
                >
                  {gpsState === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Detecting...</>
                  ) : gpsState === "done" ? (
                    <><CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--mt-pass))' }} /> -29.8587, 31.0218 — <span className="badge-pass ml-2">CLEAR</span></>
                  ) : (
                    <><MapPin className="w-4 h-4" style={{ color: 'hsl(var(--mt-gold))' }} /> Detect Location</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Animal Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-section">
            <div className="card-section-header">
              <h3 className="mt-heading text-base">Animal Details</h3>
            </div>
            <div className="card-section-body space-y-4">
              <div className="space-y-1.5">
                <label className="mt-label block">Species</label>
                <Input placeholder="Cattle" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">Animal Count <span style={{ color: 'hsl(var(--mt-gold))' }}>*</span></label>
                <Input type="number" placeholder="0" className="h-10 font-mono" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">Ear Tag IDs (comma-separated)</label>
                <Input placeholder="KZN-001, KZN-002, KZN-003" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">Vaccination History</label>
                <Input placeholder="FMD, Brucellosis" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card-section">
            <div className="card-section-header">
              <h3 className="mt-heading text-base">Documents</h3>
            </div>
            <div className="card-section-body space-y-4">
              <div
                className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors"
                style={{ borderColor: 'hsl(var(--mt-border-mid))' }}
                onClick={uploadDoc}
              >
                {docState === "loading" ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(var(--mt-gold))' }} />
                    <span className="text-sm" style={{ color: 'hsl(var(--mt-text-muted))' }}>Processing document...</span>
                  </div>
                ) : docState === "done" ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8" style={{ color: 'hsl(var(--mt-pass))' }} />
                    <span className="text-sm font-medium" style={{ color: 'hsl(var(--mt-pass))' }}>Document Verified ✓</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8" style={{ color: 'hsl(var(--mt-text-muted))' }} />
                    <span className="text-sm" style={{ color: 'hsl(var(--mt-text-muted))' }}>Upload Section 8 permit</span>
                    <span className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>Click to browse files</span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full h-10 gap-2" style={{ borderRadius: 'var(--mt-radius-sm)' }}>
                <Camera className="w-4 h-4" /> Capture Ante-Mortem Photos
              </Button>
            </div>
          </motion.div>

          {/* FMD Zone Preview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="card-section">
            <div className="card-section-header">
              <h3 className="mt-heading text-base">FMD Zone Status</h3>
            </div>
            <div className="card-section-body">
              <div
                className="rounded-lg p-6 flex flex-col items-center justify-center"
                style={{ background: 'hsl(var(--mt-surface-1))', minHeight: 200 }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'hsl(var(--mt-pass-bg))' }}>
                  <MapPin className="w-8 h-8" style={{ color: 'hsl(var(--mt-pass))' }} />
                </div>
                <p className="mt-heading text-base">Zone Clear</p>
                <p className="mt-data-sm mt-1">KwaZulu-Natal — No restrictions</p>
                <p className="font-mono text-xs mt-2" style={{ color: 'hsl(var(--mt-text-muted))' }}>-29.8587, 31.0218</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="h-10 px-6 text-white font-semibold" style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}>
            Submit Intake Record
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Intake;
