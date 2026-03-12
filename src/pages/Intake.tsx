import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormAutosave } from "@/hooks/use-form-autosave";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import {
  MapPin,
  Upload,
  CheckCircle2,
  Loader2,
  Camera,
  AlertCircle,
  Shield,
} from "lucide-react";

interface FormData {
  farmerId: string;
  cipcNumber: string;
  species: string;
  animalCount: string;
  earTagIds: string;
  vaccinationHistory: string;
}

const INITIAL_FORM: FormData = {
  farmerId: "",
  cipcNumber: "",
  species: "Cattle",
  animalCount: "",
  earTagIds: "",
  vaccinationHistory: "",
};

const GPS_COORDS = { lat: -29.8587, lng: 31.0218 };
const GPS_ADDRESS = "Plot 47, Nkandla Road, eMachunwini, KwaZulu-Natal 3800";

const RequiredStar = () => (
  <span style={{ color: "hsl(var(--mt-gold))" }}>*</span>
);

const Intake = () => {
  const [gpsState, setGpsState] = useState<"idle" | "loading" | "done">("idle");
  const [docState, setDocState] = useState<"idle" | "loading" | "done">("idle");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [formDirty, setFormDirty] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState(false);

  // Auto-save every 30s
  const { restore, clear } = useFormAutosave("intake", formData);

  // Warn on unsaved changes
  useUnsavedChanges(formDirty);

  // Restore saved form on mount (one-time)
  useState(() => {
    const saved = restore() as FormData | null;
    if (saved) setFormData(saved);
  });

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setFormDirty(true);
    },
    []
  );

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof FormData) => {
    if (!touched[field]) return null;
    if (field === "cipcNumber" && !formData.cipcNumber.trim())
      return "CIPC Number is required";
    if (field === "animalCount" && !formData.animalCount.trim())
      return "Animal Count is required";
    return null;
  };

  const fieldBorderStyle = (field: keyof FormData) => {
    const error = getFieldError(field);
    return {
      borderRadius: "var(--mt-radius-sm)",
      ...(error ? { borderColor: "hsl(0, 72%, 51%)" } : {}),
    };
  };

  const detectGPS = () => {
    setGpsState("loading");
    setTimeout(() => setGpsState("done"), 1500);
  };

  const uploadDoc = () => {
    setDocState("loading");
    setTimeout(() => setDocState("done"), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadDoc();
  };

  const handleSubmit = () => {
    // Mark all required fields as touched
    setTouched({ cipcNumber: true, animalCount: true });
    if (!formData.cipcNumber.trim() || !formData.animalCount.trim()) return;
    clear();
    setFormDirty(false);
  };

  // Determine FMD zone status based on GPS
  const zoneStatus: "clear" | "restricted" | "monitoring" =
    gpsState === "done" ? "clear" : "clear";
  const zoneConfig = {
    clear: {
      color: "hsl(142, 72%, 37%)",
      bg: "hsl(var(--mt-pass-bg))",
      label: "Zone Clear",
      desc: "KwaZulu-Natal \u2014 No restrictions",
      badge: "badge-pass" as const,
    },
    restricted: {
      color: "hsl(0, 72%, 51%)",
      bg: "hsl(var(--mt-alert-bg, 0 72% 51% / 0.08))",
      label: "Restricted Zone",
      desc: "FMD restricted area \u2014 movement controls apply",
      badge: "badge-fail" as const,
    },
    monitoring: {
      color: "hsl(32, 95%, 44%)",
      bg: "hsl(var(--mt-warn-bg))",
      label: "Monitoring Zone",
      desc: "FMD monitoring zone \u2014 additional checks required",
      badge: "badge-warn" as const,
    },
  };
  const zone = zoneConfig[zoneStatus];

  const vacHistoryMax = 200;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Intake" }]}
        title="Biosecurity & Intake"
        subtitle="Digital Birth Certificate and animal intake management"
      />
      <div className="px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Supplier Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h3 className="mt-heading text-base">Supplier Details</h3>
            </div>
            <div className="card-section-body space-y-4">
              <div className="space-y-1.5">
                <label className="mt-label block">Farmer ID</label>
                <Input
                  placeholder="Enter farmer ID"
                  className="h-10"
                  style={{ borderRadius: "var(--mt-radius-sm)" }}
                  value={formData.farmerId}
                  onChange={(e) => updateField("farmerId", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">
                  CIPC Number <RequiredStar />
                </label>
                <Input
                  placeholder="2015/123456/07"
                  className="h-10"
                  style={fieldBorderStyle("cipcNumber")}
                  value={formData.cipcNumber}
                  onChange={(e) => updateField("cipcNumber", e.target.value)}
                  onBlur={() => handleBlur("cipcNumber")}
                />
                {getFieldError("cipcNumber") && (
                  <p className="text-xs flex items-center gap-1" style={{ color: "hsl(0, 72%, 51%)" }}>
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError("cipcNumber")}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">GPS Location</label>
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start gap-2"
                  style={{ borderRadius: "var(--mt-radius-sm)" }}
                  onClick={detectGPS}
                  disabled={gpsState === "loading"}
                >
                  {gpsState === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Detecting...
                    </>
                  ) : gpsState === "done" ? (
                    <>
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: "hsl(var(--mt-pass))" }}
                      />{" "}
                      <span className="font-mono text-xs">
                        {GPS_COORDS.lat}, {GPS_COORDS.lng}
                      </span>
                      <span className="badge-pass ml-2">CLEAR</span>
                    </>
                  ) : (
                    <>
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: "hsl(var(--mt-gold))" }}
                      />{" "}
                      Detect Location
                    </>
                  )}
                </Button>
                {gpsState === "done" && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "hsl(var(--mt-text-muted))" }}
                  >
                    {GPS_ADDRESS}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Animal Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h3 className="mt-heading text-base">Animal Details</h3>
            </div>
            <div className="card-section-body space-y-4">
              <div className="space-y-1.5">
                <label className="mt-label block">Species</label>
                <Input
                  placeholder="Cattle"
                  className="h-10"
                  style={{ borderRadius: "var(--mt-radius-sm)" }}
                  value={formData.species}
                  onChange={(e) => updateField("species", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">
                  Animal Count <RequiredStar />
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-10 font-mono"
                  style={fieldBorderStyle("animalCount")}
                  value={formData.animalCount}
                  onChange={(e) => updateField("animalCount", e.target.value)}
                  onBlur={() => handleBlur("animalCount")}
                />
                {getFieldError("animalCount") && (
                  <p className="text-xs flex items-center gap-1" style={{ color: "hsl(0, 72%, 51%)" }}>
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError("animalCount")}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">Ear Tag IDs (comma-separated)</label>
                <Input
                  placeholder="KZN-001, KZN-002, KZN-003"
                  className="h-10"
                  style={{ borderRadius: "var(--mt-radius-sm)" }}
                  value={formData.earTagIds}
                  onChange={(e) => updateField("earTagIds", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="mt-label block">Vaccination History</label>
                <div className="relative">
                  <textarea
                    placeholder="FMD, Brucellosis"
                    className="w-full min-h-[80px] p-2.5 text-sm border rounded-md resize-y"
                    style={{
                      borderRadius: "var(--mt-radius-sm)",
                      borderColor: "hsl(var(--mt-border))",
                      background: "hsl(var(--mt-surface-0))",
                    }}
                    maxLength={vacHistoryMax}
                    value={formData.vaccinationHistory}
                    onChange={(e) =>
                      updateField("vaccinationHistory", e.target.value)
                    }
                  />
                  <span
                    className="absolute bottom-2 right-3 text-[10px] font-mono"
                    style={{ color: "hsl(var(--mt-text-muted))" }}
                  >
                    {formData.vaccinationHistory.length}/{vacHistoryMax}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Documents ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h3 className="mt-heading text-base">Documents</h3>
            </div>
            <div className="card-section-body space-y-4">
              <div
                className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors"
                style={{
                  borderColor: dragOver
                    ? "hsl(var(--mt-gold))"
                    : "hsl(var(--mt-border-mid))",
                  background: dragOver
                    ? "hsl(var(--mt-gold) / 0.04)"
                    : "transparent",
                }}
                onClick={uploadDoc}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {docState === "loading" ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2
                      className="w-8 h-8 animate-spin"
                      style={{ color: "hsl(var(--mt-gold))" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "hsl(var(--mt-text-muted))" }}
                    >
                      Processing document...
                    </span>
                  </div>
                ) : docState === "done" ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2
                      className="w-8 h-8"
                      style={{ color: "hsl(var(--mt-pass))" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "hsl(var(--mt-pass))" }}
                    >
                      Document Verified
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload
                      className="w-8 h-8"
                      style={{ color: "hsl(var(--mt-text-muted))" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "hsl(var(--mt-text-muted))" }}
                    >
                      Upload Section 8 permit
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "hsl(var(--mt-text-muted))" }}
                    >
                      Drag & drop or click to browse
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full h-10 gap-2"
                style={{ borderRadius: "var(--mt-radius-sm)" }}
              >
                <Camera className="w-4 h-4" /> Capture Ante-Mortem Photos
              </Button>
            </div>
          </motion.div>

          {/* ── FMD Zone Status ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="card-section"
          >
            <div className="card-section-header">
              <h3 className="mt-heading text-base">FMD Zone Status</h3>
            </div>
            <div className="card-section-body">
              {gpsState === "done" ? (
                <div className="space-y-4">
                  {/* Simulated map card */}
                  <div
                    className="rounded-lg overflow-hidden relative"
                    style={{ height: 160 }}
                  >
                    {/* Map background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--mt-surface-1)) 0%, hsl(var(--mt-surface-2)) 100%)`,
                      }}
                    />
                    {/* Zone color overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: `${zone.color}`, opacity: 0.08 }}
                    />
                    {/* Grid lines */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      style={{ opacity: 0.1 }}
                    >
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line
                          key={`h${i}`}
                          x1="0"
                          y1={i * 20}
                          x2="100%"
                          y2={i * 20}
                          stroke={zone.color}
                          strokeWidth="0.5"
                        />
                      ))}
                      {Array.from({ length: 16 }).map((_, i) => (
                        <line
                          key={`v${i}`}
                          x1={i * 30}
                          y1="0"
                          x2={i * 30}
                          y2="100%"
                          stroke={zone.color}
                          strokeWidth="0.5"
                        />
                      ))}
                    </svg>
                    {/* Pin */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                        style={{ background: zone.color }}
                      >
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Coordinates label */}
                    <div className="absolute bottom-2 right-3">
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{
                          background: "hsl(var(--mt-surface-0) / 0.9)",
                          color: "hsl(var(--mt-text-muted))",
                        }}
                      >
                        {GPS_COORDS.lat}, {GPS_COORDS.lng}
                      </span>
                    </div>
                  </div>

                  {/* Zone info */}
                  <div
                    className="rounded-lg p-4 flex items-center gap-4"
                    style={{ background: zone.bg }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: zone.bg }}
                    >
                      <Shield className="w-6 h-6" style={{ color: zone.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="mt-heading text-sm">{zone.label}</p>
                        <span className={zone.badge}>{zoneStatus}</span>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "hsl(var(--mt-text-muted))" }}
                      >
                        {zone.desc}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "hsl(var(--mt-text-muted))" }}
                      >
                        {GPS_ADDRESS}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg p-6 flex flex-col items-center justify-center"
                  style={{
                    background: "hsl(var(--mt-surface-1))",
                    minHeight: 200,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                    style={{ background: "hsl(var(--mt-surface-2))" }}
                  >
                    <MapPin
                      className="w-8 h-8"
                      style={{ color: "hsl(var(--mt-text-muted))" }}
                    />
                  </div>
                  <p className="mt-heading text-base">Awaiting GPS</p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "hsl(var(--mt-text-muted))" }}
                  >
                    Detect location to check FMD zone status
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Submit ── */}
        <div className="mt-6 flex items-center justify-between">
          {formDirty && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs"
              style={{ color: "hsl(var(--mt-warn))" }}
            >
              Unsaved changes (auto-saving every 30s)
            </motion.p>
          )}
          <div className="ml-auto">
            <Button
              className="h-10 px-6 text-white font-semibold"
              style={{
                background: "hsl(var(--mt-gold))",
                borderRadius: "var(--mt-radius-sm)",
              }}
              onClick={handleSubmit}
            >
              Submit Intake Record
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intake;
