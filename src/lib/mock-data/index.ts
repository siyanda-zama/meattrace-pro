// ── Users ──
export type UserRole = "SUPER_ADMIN" | "MANAGER" | "OPERATOR" | "AUDITOR";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export const USERS: User[] = [
  { id: "u1", email: "admin@meattracepro.com", name: "Sipho Ndlovu", role: "SUPER_ADMIN" },
  { id: "u2", email: "manager@meattracepro.com", name: "Thandi Mkhize", role: "MANAGER" },
  { id: "u3", email: "operator@meattracepro.com", name: "Bongani Zulu", role: "OPERATOR" },
  { id: "u4", email: "auditor@meattracepro.com", name: "Fatima Patel", role: "AUDITOR" },
  { id: "u5", email: "operator2@meattracepro.com", name: "Lindiwe Dlamini", role: "OPERATOR" },
];

export const CREDENTIALS: Record<string, { password: string; userId: string }> = {
  "admin@meattracepro.com": { password: "Admin@123", userId: "u1" },
  "manager@meattracepro.com": { password: "Manager@123", userId: "u2" },
  "operator@meattracepro.com": { password: "Operator@123", userId: "u3" },
  "auditor@meattracepro.com": { password: "Auditor@123", userId: "u4" },
};

// ── Suppliers ──
export interface Supplier {
  id: string;
  name: string;
  cipc: string;
  province: string;
  gps: { lat: number; lng: number };
  certificationStatus: "active" | "expired" | "pending";
  totalSessions: number;
  avgDressingPct: number;
  blacklisted: boolean;
}

export const SUPPLIERS: Supplier[] = [
  { id: "s1", name: "Nkosi Cattle Farm", cipc: "2015/123456/07", province: "KwaZulu-Natal", gps: { lat: -29.8587, lng: 31.0218 }, certificationStatus: "active", totalSessions: 24, avgDressingPct: 52.3, blacklisted: false },
  { id: "s2", name: "Mokoena Livestock", cipc: "2018/654321/07", province: "Mpumalanga", gps: { lat: -25.4753, lng: 30.9694 }, certificationStatus: "active", totalSessions: 18, avgDressingPct: 50.1, blacklisted: false },
  { id: "s3", name: "Van der Merwe Angus", cipc: "2012/987654/07", province: "Limpopo", gps: { lat: -23.8962, lng: 29.4486 }, certificationStatus: "active", totalSessions: 31, avgDressingPct: 54.7, blacklisted: false },
  { id: "s4", name: "Dlamini & Sons", cipc: "2020/111222/07", province: "KwaZulu-Natal", gps: { lat: -28.7282, lng: 29.7938 }, certificationStatus: "pending", totalSessions: 8, avgDressingPct: 48.2, blacklisted: false },
  { id: "s5", name: "Mabena Ranch", cipc: "2016/333444/07", province: "Mpumalanga", gps: { lat: -25.7479, lng: 28.2293 }, certificationStatus: "expired", totalSessions: 12, avgDressingPct: 46.5, blacklisted: false },
  { id: "s6", name: "Pretorius Boerdery", cipc: "2014/555666/07", province: "Limpopo", gps: { lat: -24.1756, lng: 29.0099 }, certificationStatus: "active", totalSessions: 22, avgDressingPct: 53.1, blacklisted: false },
  { id: "s7", name: "Khumalo Holdings", cipc: "2019/777888/07", province: "KwaZulu-Natal", gps: { lat: -29.6006, lng: 30.3794 }, certificationStatus: "active", totalSessions: 15, avgDressingPct: 51.8, blacklisted: false },
  { id: "s8", name: "Restricted Zone Farms", cipc: "2021/999000/07", province: "Limpopo", gps: { lat: -22.3285, lng: 30.0474 }, certificationStatus: "expired", totalSessions: 3, avgDressingPct: 44.1, blacklisted: true },
];

// ── Sessions ──
export type SessionStatus = "completed" | "in-progress" | "flagged" | "paused";

export interface SlaughterSession {
  id: string;
  date: string;
  operatorId: string;
  supplierId: string;
  animalCount: number;
  status: SessionStatus;
  species: string;
  totalLiveWeight: number;
  totalCDM: number;
  dressingPct: number;
  haccpScore: number;
  step: number; // 1-5 timeline
}

export const SESSIONS: SlaughterSession[] = [
  { id: "SS-2024-001", date: "2024-03-12", operatorId: "u3", supplierId: "s1", animalCount: 24, status: "completed", species: "Cattle", totalLiveWeight: 10560, totalCDM: 5545, dressingPct: 52.5, haccpScore: 98, step: 5 },
  { id: "SS-2024-002", date: "2024-03-11", operatorId: "u3", supplierId: "s3", animalCount: 18, status: "completed", species: "Cattle", totalLiveWeight: 8100, totalCDM: 4374, dressingPct: 54.0, haccpScore: 100, step: 5 },
  { id: "SS-2024-003", date: "2024-03-11", operatorId: "u5", supplierId: "s2", animalCount: 12, status: "completed", species: "Cattle", totalLiveWeight: 5040, totalCDM: 2520, dressingPct: 50.0, haccpScore: 95, step: 5 },
  { id: "SS-2024-004", date: "2024-03-10", operatorId: "u3", supplierId: "s7", animalCount: 20, status: "flagged", species: "Cattle", totalLiveWeight: 8800, totalCDM: 4048, dressingPct: 46.0, haccpScore: 78, step: 5 },
  { id: "SS-2024-005", date: "2024-03-10", operatorId: "u5", supplierId: "s4", animalCount: 8, status: "completed", species: "Cattle", totalLiveWeight: 3360, totalCDM: 1680, dressingPct: 50.0, haccpScore: 92, step: 5 },
  { id: "SS-2024-006", date: "2024-03-09", operatorId: "u3", supplierId: "s6", animalCount: 22, status: "completed", species: "Cattle", totalLiveWeight: 9680, totalCDM: 5227, dressingPct: 54.0, haccpScore: 100, step: 5 },
  { id: "SS-2024-007", date: "2024-03-08", operatorId: "u5", supplierId: "s5", animalCount: 10, status: "flagged", species: "Cattle", totalLiveWeight: 4200, totalCDM: 1890, dressingPct: 45.0, haccpScore: 72, step: 5 },
  { id: "SS-2024-008", date: "2024-03-07", operatorId: "u3", supplierId: "s1", animalCount: 26, status: "completed", species: "Cattle", totalLiveWeight: 11440, totalCDM: 6020, dressingPct: 52.6, haccpScore: 96, step: 5 },
  { id: "SS-2024-009", date: "2024-03-06", operatorId: "u5", supplierId: "s3", animalCount: 16, status: "completed", species: "Cattle", totalLiveWeight: 7040, totalCDM: 3802, dressingPct: 54.0, haccpScore: 100, step: 5 },
  { id: "SS-2024-010", date: "2024-03-12", operatorId: "u3", supplierId: "s2", animalCount: 14, status: "in-progress", species: "Cattle", totalLiveWeight: 6160, totalCDM: 3080, dressingPct: 50.0, haccpScore: 85, step: 3 },
  { id: "SS-2024-011", date: "2024-03-12", operatorId: "u5", supplierId: "s7", animalCount: 6, status: "paused", species: "Cattle", totalLiveWeight: 2640, totalCDM: 0, dressingPct: 0, haccpScore: 0, step: 2 },
  { id: "SS-2024-012", date: "2024-03-05", operatorId: "u3", supplierId: "s8", animalCount: 5, status: "flagged", species: "Cattle", totalLiveWeight: 2100, totalCDM: 924, dressingPct: 44.0, haccpScore: 65, step: 5 },
];

// ── Sensors ──
export interface Sensor {
  id: string;
  name: string;
  location: string;
  type: "chiller" | "sterilizer" | "ambient" | "blast_freezer";
  minThreshold: number;
  maxThreshold: number;
  currentTemp: number;
}

export const SENSORS: Sensor[] = [
  { id: "sen1", name: "Chiller A", location: "Cold Room 1", type: "chiller", minThreshold: 0, maxThreshold: 4, currentTemp: 2.4 },
  { id: "sen2", name: "Chiller B", location: "Cold Room 2", type: "chiller", minThreshold: 0, maxThreshold: 4, currentTemp: 3.1 },
  { id: "sen3", name: "Knife Sterilizer 1", location: "Processing Floor", type: "sterilizer", minThreshold: 82, maxThreshold: 95, currentTemp: 83.5 },
  { id: "sen4", name: "Knife Sterilizer 2", location: "Processing Floor", type: "sterilizer", minThreshold: 82, maxThreshold: 95, currentTemp: 84.2 },
  { id: "sen5", name: "Blast Freezer", location: "Freezer Bay", type: "blast_freezer", minThreshold: -25, maxThreshold: -18, currentTemp: -21.3 },
];

// ── HACCP CCPs ──
export interface CCPRecord {
  id: string;
  sessionId: string;
  ccpName: string;
  requiredValue: string;
  recordedValue: string;
  status: "pass" | "fail" | "pending";
  timestamp: string;
  correctiveAction?: string;
}

export const CCP_RECORDS: CCPRecord[] = [
  { id: "ccp1", sessionId: "SS-2024-010", ccpName: "Knife Sterilizer Temp", requiredValue: "≥82°C", recordedValue: "83.5°C", status: "pass", timestamp: "2024-03-12T06:30:00" },
  { id: "ccp2", sessionId: "SS-2024-010", ccpName: "Chiller Temperature", requiredValue: "0-4°C", recordedValue: "2.4°C", status: "pass", timestamp: "2024-03-12T06:35:00" },
  { id: "ccp3", sessionId: "SS-2024-010", ccpName: "Carcass pH Level", requiredValue: "pH ≤ 6.0", recordedValue: "", status: "pending", timestamp: "" },
  { id: "ccp4", sessionId: "SS-2024-004", ccpName: "Knife Sterilizer Temp", requiredValue: "≥82°C", recordedValue: "79.2°C", status: "fail", timestamp: "2024-03-10T07:10:00", correctiveAction: "Re-calibrated sterilizer, re-tested at 83.1°C" },
  { id: "ccp5", sessionId: "SS-2024-007", ccpName: "Chiller Temperature", requiredValue: "0-4°C", recordedValue: "6.8°C", status: "fail", timestamp: "2024-03-08T14:20:00", correctiveAction: "Compressor reset, temp returned to 3.2°C within 45min" },
  { id: "ccp6", sessionId: "SS-2024-012", ccpName: "Carcass pH Level", requiredValue: "pH ≤ 6.0", recordedValue: "6.4", status: "fail", timestamp: "2024-03-05T16:00:00", correctiveAction: "Batch flagged for accelerated processing" },
];

// ── Yield chart data ──
export const YIELD_TREND_7D = [
  { date: "Mar 6", dressingPct: 54.0, benchmark: 52 },
  { date: "Mar 7", dressingPct: 52.6, benchmark: 52 },
  { date: "Mar 8", dressingPct: 45.0, benchmark: 52 },
  { date: "Mar 9", dressingPct: 54.0, benchmark: 52 },
  { date: "Mar 10", dressingPct: 48.0, benchmark: 52 },
  { date: "Mar 11", dressingPct: 52.0, benchmark: 52 },
  { date: "Mar 12", dressingPct: 50.0, benchmark: 52 },
];

// ── Alerts ──
export interface Alert {
  id: string;
  type: "temp_deviation" | "missing_ccp" | "low_yield" | "scale_sync" | "zone_warning";
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const ALERTS: Alert[] = [
  { id: "a1", type: "temp_deviation", severity: "critical", message: "Chiller B temperature rising: 5.2°C (threshold: 4°C)", timestamp: "2024-03-12T09:45:00", resolved: false },
  { id: "a2", type: "missing_ccp", severity: "warning", message: "Session SS-2024-010: Carcass pH not yet recorded", timestamp: "2024-03-12T09:30:00", resolved: false },
  { id: "a3", type: "low_yield", severity: "warning", message: "Session SS-2024-004: Dressing % below benchmark (46%)", timestamp: "2024-03-10T16:00:00", resolved: false },
  { id: "a4", type: "scale_sync", severity: "info", message: "Scale BLE connection lost — reconnect required", timestamp: "2024-03-12T08:15:00", resolved: true },
  { id: "a5", type: "zone_warning", severity: "critical", message: "Supplier S8 flagged: FMD restricted zone", timestamp: "2024-03-05T07:00:00", resolved: false },
];

// Helper
export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}
export function getSupplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find(s => s.id === id);
}
