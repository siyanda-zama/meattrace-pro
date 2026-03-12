import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SENSORS } from "@/lib/mock-data";
import { Thermometer, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ── CSS for pulsing breach border ── */
const pulseKeyframes = `
@keyframes pulse-border-red {
  0%, 100% { border-color: hsl(0, 72%, 51%); box-shadow: 0 0 0 0 hsla(0, 72%, 51%, 0.4); }
  50% { border-color: hsl(0, 72%, 51%); box-shadow: 0 0 0 6px hsla(0, 72%, 51%, 0); }
}
`;

function injectPulseStyle() {
  if (typeof document === "undefined") return;
  const id = "mt-pulse-style";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

/* ── Drift helpers per sensor type ── */
function driftTemp(type: string, current: number): number {
  switch (type) {
    case "chiller": {
      const drift = (Math.random() - 0.5) * 1.0; // ±0.5
      return Math.max(1.0, Math.min(5.0, +(current + drift).toFixed(1)));
    }
    case "sterilizer": {
      const drift = (Math.random() - 0.5) * 3.0; // ±1.5
      return Math.max(78, Math.min(90, +(current + drift).toFixed(1)));
    }
    case "blast_freezer": {
      const drift = (Math.random() - 0.5) * 2.0; // ±1
      return Math.max(-28, Math.min(-15, +(current + drift).toFixed(1)));
    }
    default: {
      const drift = (Math.random() - 0.5) * 2.0;
      return +(current + drift).toFixed(1);
    }
  }
}

function generateInitialHistory(baseTemp: number, variance: number, count: number) {
  return Array.from({ length: count }, () =>
    +(baseTemp + (Math.random() - 0.5) * variance).toFixed(1)
  );
}

function baseForType(type: string) {
  switch (type) {
    case "chiller": return { base: 2.5, variance: 1.0 };
    case "sterilizer": return { base: 83.5, variance: 3.0 };
    case "blast_freezer": return { base: -21, variance: 2.0 };
    default: return { base: 20, variance: 4.0 };
  }
}

/* ── 24h history generator ── */
function generate24hHistory() {
  return SENSORS.map(s => {
    const { base, variance } = baseForType(s.type);
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, "0")}:00`,
      temp: +(base + (Math.random() - 0.5) * variance).toFixed(1),
    }));
  });
}

/* ── Custom Recharts tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(213,65%,15%)",
        border: "none",
        borderRadius: 8,
        color: "white",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        padding: "10px 14px",
      }}
    >
      <p style={{ marginBottom: 4, opacity: 0.7 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i}>Temperature: {p.value}°C</p>
      ))}
    </div>
  );
}

/* ── Main component ── */
const ColdChain = () => {
  const [sensors, setSensors] = useState(() =>
    SENSORS.map(s => ({ ...s }))
  );
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [connected] = useState(true);

  // Store last 20 readings per sensor
  const historyRef = useRef<Record<string, number[]>>(() => {
    const map: Record<string, number[]> = {};
    SENSORS.forEach(s => {
      const { base, variance } = baseForType(s.type);
      map[s.id] = generateInitialHistory(base, variance, 20);
    });
    return map;
  });
  const [sparkData, setSparkData] = useState<Record<string, number[]>>(() => {
    const map: Record<string, number[]> = {};
    SENSORS.forEach(s => {
      const { base, variance } = baseForType(s.type);
      map[s.id] = generateInitialHistory(base, variance, 20);
    });
    return map;
  });

  // 24h history for bottom chart (generated once)
  const [history24h] = useState(() => generate24hHistory());

  // Inject pulse animation CSS
  useEffect(() => { injectPulseStyle(); }, []);

  // Update sensors every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(s => {
        const newTemp = driftTemp(s.type, s.currentTemp);
        // Update sparkline history
        const readings = [...(historyRef.current[s.id] || []), newTemp].slice(-20);
        historyRef.current[s.id] = readings;
        return { ...s, currentTemp: newTemp };
      }));
      setSparkData({ ...historyRef.current });
      setLastUpdated(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Cold Chain" }]}
        title="Cold Chain Monitoring"
        subtitle="IoT temperature sensor dashboard — live readings"
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: "hsl(var(--mt-text-muted))" }}>
              Last Updated: {formatTime(lastUpdated)}
            </span>
            {connected ? (
              <span className="badge-live flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="badge-alert flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" /> Disconnected
              </span>
            )}
          </div>
        }
      />
      <div className="px-8 py-6 space-y-5">
        {/* Sensor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor, i) => {
            const inRange =
              sensor.currentTemp >= sensor.minThreshold &&
              sensor.currentTemp <= sensor.maxThreshold;
            const readings = sparkData[sensor.id] || [];
            const sparkChartData = readings.map((v, idx) => ({ i: idx, temp: v }));

            return (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-section"
                style={
                  !inRange
                    ? {
                        border: "2px solid hsl(0, 72%, 51%)",
                        animation: "pulse-border-red 1.5s ease-in-out infinite",
                      }
                    : undefined
                }
              >
                <div className="card-section-header flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: "hsl(var(--mt-navy))" }}>
                      {sensor.name}
                    </h3>
                    <p className="text-xs" style={{ color: "hsl(var(--mt-text-muted))" }}>
                      {sensor.location}
                    </p>
                  </div>
                  <span className={inRange ? "badge-pass" : "badge-alert"}>
                    {inRange ? "Normal" : (
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Breach
                      </span>
                    )}
                  </span>
                </div>
                <div className="card-section-body">
                  <div className="flex items-end gap-2 mb-3">
                    <span
                      className="font-mono text-3xl font-medium"
                      style={{
                        color: inRange ? "hsl(var(--mt-navy))" : "hsl(var(--mt-alert))",
                        transition: "color 0.4s ease, transform 0.3s ease",
                      }}
                    >
                      {sensor.currentTemp}°C
                    </span>
                    <Thermometer
                      className="w-5 h-5 mb-1"
                      style={{ color: "hsl(var(--mt-text-muted))" }}
                    />
                  </div>
                  <div
                    className="flex gap-4 text-xs mb-3"
                    style={{ color: "hsl(var(--mt-text-muted))" }}
                  >
                    <span>
                      Min: <span className="font-mono">{sensor.minThreshold}°C</span>
                    </span>
                    <span>
                      Max: <span className="font-mono">{sensor.maxThreshold}°C</span>
                    </span>
                  </div>
                  {/* Sparkline */}
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={sparkChartData}>
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke={inRange ? "hsl(42,64%,45%)" : "hsl(0,72%,51%)"}
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 24h Temperature History */}
        <div className="card-section">
          <div className="card-section-header">
            <h2 className="mt-heading text-base">Temperature History (24h)</h2>
          </div>
          <div className="card-section-body">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={history24h[0]}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="hsl(213,65%,15%,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                    fill: "hsl(213,22%,63%)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                    fill: "hsl(213,22%,63%)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="hsl(42,64%,45%)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "hsl(42,64%,45%)" }}
                  name="Temperature °C"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdChain;
