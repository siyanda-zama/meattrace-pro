import { RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileSync = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-lg font-bold">Sync Status</h1>
      <p className="text-sm text-muted-foreground">Manage offline data queue</p>
    </div>
    <div className="bg-card rounded-lg p-5 shadow-card text-center space-y-3">
      <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
      <p className="text-sm font-medium">All records synced</p>
      <p className="text-xs text-muted-foreground">Last sync: just now</p>
    </div>
    <Button variant="outline" className="w-full h-12 gap-2">
      <RefreshCw className="w-4 h-4" /> Manual Sync
    </Button>
  </div>
);

export default MobileSync;
