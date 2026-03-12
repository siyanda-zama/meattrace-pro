import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { USERS, SENSORS } from "@/lib/mock-data";

const Settings = () => (
  <div>
    <PageHeader
      breadcrumbs={[{ label: "MeatTrace Pro" }, { label: "Settings" }]}
      title="System Configuration"
      subtitle="Manage facility profile, users, thresholds, and preferences"
    />
    <div className="px-8 py-6 space-y-5">
      {/* Site Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-section">
        <div className="card-section-header">
          <h2 className="mt-heading text-base">Site Profile</h2>
        </div>
        <div className="card-section-body grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="mt-label block">Facility Name</label>
            <Input defaultValue="KZN Processing Plant" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
          </div>
          <div className="space-y-1.5">
            <label className="mt-label block">Registration Number</label>
            <Input defaultValue="MTP-2024-KZN-001" className="h-10 font-mono" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="mt-label block">Address</label>
            <Input defaultValue="12 Industrial Road, Pinetown, KwaZulu-Natal, 3610" className="h-10" style={{ borderRadius: 'var(--mt-radius-sm)' }} />
          </div>
        </div>
      </motion.div>

      {/* Sensor Config */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-section overflow-hidden">
        <div className="card-section-header">
          <h2 className="mt-heading text-base">Sensor Configuration</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-table">
            <thead>
              <tr>
                <th className="text-left">Sensor</th>
                <th className="text-left">Location</th>
                <th className="text-left">Type</th>
                <th className="text-right">Min (°C)</th>
                <th className="text-right">Max (°C)</th>
              </tr>
            </thead>
            <tbody>
              {SENSORS.map(s => (
                <tr key={s.id}>
                  <td className="font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{s.name}</td>
                  <td className="text-xs">{s.location}</td>
                  <td className="text-xs capitalize">{s.type.replace("_", " ")}</td>
                  <td className="text-right font-mono text-xs">{s.minThreshold}</td>
                  <td className="text-right font-mono text-xs">{s.maxThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Management */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card-section overflow-hidden">
        <div className="card-section-header flex items-center justify-between">
          <h2 className="mt-heading text-base">User Management</h2>
          <Button size="sm" variant="outline" style={{ borderRadius: 'var(--mt-radius-sm)' }}>Invite User</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-table">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id}>
                  <td className="font-medium" style={{ color: 'hsl(var(--mt-text-primary))' }}>{u.name}</td>
                  <td className="font-mono text-xs">{u.email}</td>
                  <td><span className="badge-pending">{u.role.replace("_", " ")}</span></td>
                  <td><span className="badge-pass">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </div>
);

export default Settings;
