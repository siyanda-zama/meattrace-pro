import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { label: "Hides", unit: "count / kg" },
  { label: "Heads", unit: "count" },
  { label: "Red Offal", unit: "kg" },
  { label: "Rough Offal", unit: "kg" },
];

const MobileByProducts = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-lg font-bold">By-Product Logger</h1>
      <p className="text-sm text-muted-foreground">Record by-products for current session</p>
    </div>
    <div className="space-y-3">
      {ITEMS.map((item) => (
        <div key={item.label} className="bg-card rounded-lg p-4 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-[10px] text-muted-foreground">{item.unit}</span>
          </div>
          <div className="flex gap-2">
            <Input type="number" placeholder="Count" className="h-12 font-mono" />
            <Input type="number" placeholder="Weight" className="h-12 font-mono" />
          </div>
        </div>
      ))}
    </div>
    <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold shadow-gold">
      Confirm & Submit
    </Button>
  </div>
);

export default MobileByProducts;
