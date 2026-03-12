import { RefreshCw, CheckCircle2 } from "lucide-react";

const MobileSync = () => (
  <div className="space-y-5">
    {/* Status header */}
    <div className="flex items-center justify-between">
      <span className="font-mono text-sm font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>Sync Status</span>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(142, 72%, 37%)' }} />
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Synced</span>
      </div>
    </div>

    <div
      className="p-6 rounded-xl text-center space-y-3"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: 'hsl(142, 72%, 37%)' }} />
      <p className="text-sm font-medium text-white">All records synced</p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Last sync: just now</p>
    </div>

    <button
      className="w-full h-[52px] rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2"
      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <RefreshCw className="w-4 h-4" /> Manual Sync
    </button>
  </div>
);

export default MobileSync;
