import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SENSORS } from "@/lib/mock-data";
import { Thermometer, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function generateHistory(baseTemp: number, variance: number) {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    temp: +(baseTemp + (Math.random() - 0.5) * variance).toFixed(1),
  }));
}

const ColdChain = () => {
  const [sensors, setSensors] = useState(SENSORS.map(s => ({ ...s })));

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(s => {
        const drift = (Math.random() - 0.5) * 1.2;
        const newTemp = +(s.currentTemp + drift).toFixed(1);
        return { ...s, currentTemp: newTemp };
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Cold Chain" }]}
        title="Cold Chain Monitoring"
        subtitle="IoT temperature sensor dashboard — live readings"
      />
      <div className="px-8 py-6 space-y-5">
        {/* Sensor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor, i) => {
            const inRange = sensor.currentTemp >= sensor.minThreshold && sensor.currentTemp <= sensor.maxThreshold;
            const history = generateHistory(
              sensor.type === "chiller" ? 2.5 : sensor.type === "sterilizer" ? 83 : sensor.type === "blast_freezer" ? -21 : 20,
              sensor.type === "chiller" ? 2 : sensor.type === "sterilizer" ? 3 : sensor.type === "blast_freezer" ? 3 : 4
            );

            return (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-section"
              >
                <div className="card-section-header flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{sensor.name}</h3>
                    <p className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>{sensor.location}</p>
                  </div>
                  <span className={inRange ? "badge-pass" : "badge-alert"}>
                    {inRange ? "Normal" : "Breach"}
                  </span>
                </div>
                <div className="card-section-body">
                  <div className="flex items-end gap-2 mb-3">
                    <span className="font-mono text-3xl font-medium" style={{ color: inRange ? 'hsl(var(--mt-navy))' : 'hsl(var(--mt-alert))' }}>
                      {sensor.currentTemp}°C
                    </span>
                    <Thermometer className="w-5 h-5 mb-1" style={{ color: 'hsl(var(--mt-text-muted))' }} />
                  </div>
                  <div className="flex gap-4 text-xs mb-3" style={{ color: 'hsl(var(--mt-text-muted))' }}>
                    <span>Min: <span className="font-mono">{sensor.minThreshold}°C</span></span>
                    <span>Max: <span className="font-mono">{sensor.maxThreshold}°C</span></span>
                  </div>
                  {/* Sparkline */}
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={history}>
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke={inRange ? "hsl(42,64%,45%)" : "hsl(0,72%,51%)"}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Temperature history */}
        <div className="card-section">
          <div className="card-section-header">
            <h2 className="mt-heading text-base">Temperature History (24h)</h2>
          </div>
          <div className="card-section-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateHistory(2.5, 2)}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(213,65%,15%,0.08)" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'hsl(213,22%,63%)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(213,65%,15%)", border: "none", borderRadius: 8, color: "white", fontFamily: "JetBrains Mono", fontSize: 12, padding: "10px 14px" }}
                  itemStyle={{ color: "white" }}
                />
                <Line type="monotone" dataKey="temp" stroke="hsl(42,64%,45%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(42,64%,45%)" }} name="Temperature °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdChain;
