import { Input } from "@/components/ui/input";

const ITEMS = [
  { label: "Hides", unit: "count / kg" },
  { label: "Heads", unit: "count" },
  { label: "Red Offal", unit: "kg" },
  { label: "Rough Offal", unit: "kg" },
];

const MobileByProducts = () => (
  <div className="space-y-5">
    {/* Status header */}
    <div className="flex items-center justify-between">
      <span className="font-mono text-sm font-medium" style={{ color: 'hsl(42, 64%, 45%)' }}>By-Products</span>
      <span className="badge-live">Recording</span>
    </div>

    <div className="space-y-3">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className="p-4 rounded-xl space-y-2"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{item.label}</span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.unit}</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Count"
              className="h-12 font-mono border-0"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 'var(--mt-radius-md)' }}
            />
            <Input
              type="number"
              placeholder="Weight"
              className="h-12 font-mono border-0"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 'var(--mt-radius-md)' }}
            />
          </div>
        </div>
      ))}
    </div>
    <button
      className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white"
      style={{ background: 'hsl(42, 64%, 45%)' }}
    >
      Confirm & Submit
    </button>
  </div>
);

export default MobileByProducts;
