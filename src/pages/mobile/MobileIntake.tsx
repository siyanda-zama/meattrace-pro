import { motion } from "framer-motion";
import { MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MobileIntake = () => (
  <div className="space-y-5">
    {/* Status header */}
    <div className="flex items-center justify-between">
      <span className="font-mono text-sm font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>New Intake</span>
      <span className="badge-pending">Step 1/4</span>
    </div>

    {/* Progress */}
    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
      <div className="h-full w-1/4 rounded-full" style={{ background: 'hsl(42, 64%, 45%)' }} />
    </div>

    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Supplier & Origin</p>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-[0.09em] block" style={{ color: 'rgba(255,255,255,0.4)' }}>CIPC Number</label>
        <Input
          placeholder="2015/123456/07"
          className="h-12 text-base font-mono border-0"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'white', borderRadius: 'var(--mt-radius-md)' }}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-[0.09em] block" style={{ color: 'rgba(255,255,255,0.4)' }}>GPS Location</label>
        <button
          className="w-full h-12 flex items-center justify-start gap-2 px-4 rounded-xl text-sm"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <MapPin className="w-4 h-4" style={{ color: 'hsl(42, 64%, 45%)' }} /> Detect Location
        </button>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-[0.09em] block" style={{ color: 'rgba(255,255,255,0.4)' }}>Species</label>
        <Input
          placeholder="Cattle"
          className="h-12 text-base border-0"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'white', borderRadius: 'var(--mt-radius-md)' }}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-[0.09em] block" style={{ color: 'rgba(255,255,255,0.4)' }}>Animal Count</label>
        <Input
          type="number"
          placeholder="0"
          className="h-12 text-base font-mono border-0"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'white', borderRadius: 'var(--mt-radius-md)' }}
        />
      </div>
      <button
        className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
        style={{ background: 'hsl(42, 64%, 45%)' }}
      >
        <FileText className="w-4 h-4" /> Next: Animal Details
      </button>
    </motion.div>
  </div>
);

export default MobileIntake;
