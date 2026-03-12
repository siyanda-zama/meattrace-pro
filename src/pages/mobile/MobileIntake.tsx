import { motion } from "framer-motion";
import { MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MobileIntake = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-lg font-bold">New Intake</h1>
      <p className="text-sm text-muted-foreground">Step 1 of 4 — Supplier & Origin</p>
      <div className="mt-3 h-1.5 rounded-full bg-secondary">
        <div className="h-full w-1/4 rounded-full bg-accent transition-all" />
      </div>
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">CIPC Number</label>
        <Input placeholder="2015/123456/07" className="h-12 text-base" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">GPS Location</label>
        <Button variant="outline" className="w-full h-12 justify-start gap-2">
          <MapPin className="w-4 h-4 text-accent" /> Detect Location
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Species</label>
        <Input placeholder="Cattle" className="h-12 text-base" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Animal Count</label>
        <Input type="number" placeholder="0" className="h-12 text-base font-mono" />
      </div>
      <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold shadow-gold">
        <FileText className="w-4 h-4 mr-2" /> Next: Animal Details
      </Button>
    </motion.div>
  </div>
);

export default MobileIntake;
