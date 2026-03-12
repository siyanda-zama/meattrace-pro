-- MeatTrace Pro Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS & AUTH
-- ============================================================
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'MANAGER', 'OPERATOR', 'AUDITOR');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'OPERATOR',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE TYPE certification_status AS ENUM ('active', 'expired', 'pending');

CREATE TABLE suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  cipc TEXT UNIQUE NOT NULL,
  province TEXT NOT NULL,
  gps_lat DECIMAL(10, 7) NOT NULL,
  gps_lng DECIMAL(10, 7) NOT NULL,
  address TEXT,
  certification_status certification_status DEFAULT 'pending',
  total_sessions INT DEFAULT 0,
  avg_dressing_pct DECIMAL(5, 2) DEFAULT 0,
  blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TYPE session_status AS ENUM ('completed', 'in-progress', 'flagged', 'paused');

CREATE TABLE sessions (
  id TEXT PRIMARY KEY, -- Format: SS-YYYY-NNN
  date DATE NOT NULL,
  operator_id UUID REFERENCES profiles(id) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  animal_count INT NOT NULL DEFAULT 0,
  status session_status DEFAULT 'in-progress',
  species TEXT DEFAULT 'Cattle',
  total_live_weight DECIMAL(10, 2) DEFAULT 0,
  total_cdm DECIMAL(10, 2) DEFAULT 0,
  dressing_pct DECIMAL(5, 2) DEFAULT 0,
  haccp_score INT DEFAULT 0,
  step INT DEFAULT 0 CHECK (step >= 0 AND step <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INTAKE RECORDS (Digital Birth Certificates)
-- ============================================================
CREATE TABLE intake_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  farmer_id TEXT,
  cipc_number TEXT NOT NULL,
  species TEXT DEFAULT 'Cattle',
  animal_count INT NOT NULL,
  ear_tag_ids TEXT,
  vaccination_history TEXT,
  gps_lat DECIMAL(10, 7),
  gps_lng DECIMAL(10, 7),
  fmd_zone_status TEXT CHECK (fmd_zone_status IN ('clear', 'restricted', 'monitoring')),
  section8_doc_url TEXT,
  ante_mortem_photos TEXT[], -- Array of image URLs
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HACCP CCPs
-- ============================================================
CREATE TYPE ccp_status AS ENUM ('pass', 'fail', 'pending');

CREATE TABLE ccp_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  ccp_name TEXT NOT NULL,
  required_value TEXT NOT NULL,
  recorded_value TEXT,
  status ccp_status DEFAULT 'pending',
  timestamp TIMESTAMPTZ,
  corrective_action TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SENSORS (Cold Chain IoT)
-- ============================================================
CREATE TYPE sensor_type AS ENUM ('chiller', 'sterilizer', 'ambient', 'blast_freezer');

CREATE TABLE sensors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  type sensor_type NOT NULL,
  min_threshold DECIMAL(6, 2) NOT NULL,
  max_threshold DECIMAL(6, 2) NOT NULL,
  current_temp DECIMAL(6, 2) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sensor readings history
CREATE TABLE sensor_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
  temperature DECIMAL(6, 2) NOT NULL,
  in_range BOOLEAN NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ALERTS
-- ============================================================
CREATE TYPE alert_type AS ENUM ('temp_deviation', 'missing_ccp', 'low_yield', 'scale_sync', 'zone_warning');
CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'info');

CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ
);

-- ============================================================
-- BY-PRODUCTS
-- ============================================================
CREATE TABLE by_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  product_label TEXT NOT NULL, -- 'Hides', 'Heads', 'Red Offal', 'Rough Offal'
  count INT NOT NULL,
  weight_kg DECIMAL(10, 2) NOT NULL,
  price_per_unit DECIMAL(10, 2),
  revenue DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS (Immutable Chain of Custody)
-- ============================================================
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES profiles(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_sessions_date ON sessions(date DESC);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_supplier ON sessions(supplier_id);
CREATE INDEX idx_ccp_records_session ON ccp_records(session_id);
CREATE INDEX idx_sensor_readings_sensor_time ON sensor_readings(sensor_id, timestamp DESC);
CREATE INDEX idx_alerts_resolved ON alerts(resolved, timestamp DESC);
CREATE INDEX idx_by_products_session ON by_products(session_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccp_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE by_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
);
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
);

-- Suppliers: All authenticated users can read, only admins can modify
CREATE POLICY "Anyone can view suppliers" ON suppliers FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can insert suppliers" ON suppliers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
);
CREATE POLICY "Admins can update suppliers" ON suppliers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
);

-- Sessions: All authenticated users can read, operators+ can create/update
CREATE POLICY "Anyone can view sessions" ON sessions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Operators can create sessions" ON sessions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER', 'OPERATOR'))
);
CREATE POLICY "Operators can update sessions" ON sessions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER', 'OPERATOR'))
);

-- Intake Records: Operators can create/read
CREATE POLICY "Anyone can view intake records" ON intake_records FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Operators can create intake records" ON intake_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER', 'OPERATOR'))
);

-- CCP Records: All can read, operators can create
CREATE POLICY "Anyone can view CCP records" ON ccp_records FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Operators can create CCP records" ON ccp_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER', 'OPERATOR'))
);

-- Sensors & Readings: All can read, admins can configure
CREATE POLICY "Anyone can view sensors" ON sensors FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can manage sensors" ON sensors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
);
CREATE POLICY "Anyone can view sensor readings" ON sensor_readings FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "System can insert sensor readings" ON sensor_readings FOR INSERT WITH CHECK (TRUE);

-- Alerts: All can read, admins can resolve
CREATE POLICY "Anyone can view alerts" ON alerts FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "System can create alerts" ON alerts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can resolve alerts" ON alerts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
);

-- By-Products: All can read, operators can create
CREATE POLICY "Anyone can view by-products" ON by_products FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Operators can create by-products" ON by_products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER', 'OPERATOR'))
);

-- Audit Logs: Read-only for admins/auditors
CREATE POLICY "Auditors can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'AUDITOR'))
);
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sensors_updated_at BEFORE UPDATE ON sensors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate dressing percentage
CREATE OR REPLACE FUNCTION calculate_dressing_pct()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_live_weight > 0 THEN
    NEW.dressing_pct := ROUND((NEW.total_cdm / NEW.total_live_weight * 100)::NUMERIC, 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_dressing_pct_trigger BEFORE INSERT OR UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION calculate_dressing_pct();

-- Create audit log entry on critical table changes
CREATE OR REPLACE FUNCTION log_audit_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_sessions AFTER INSERT OR UPDATE OR DELETE ON sessions FOR EACH ROW EXECUTE FUNCTION log_audit_entry();
CREATE TRIGGER audit_ccp_records AFTER INSERT OR UPDATE OR DELETE ON ccp_records FOR EACH ROW EXECUTE FUNCTION log_audit_entry();
CREATE TRIGGER audit_intake_records AFTER INSERT OR UPDATE OR DELETE ON intake_records FOR EACH ROW EXECUTE FUNCTION log_audit_entry();

-- ============================================================
-- STORAGE BUCKETS (for document uploads)
-- ============================================================
-- Run these separately in the Supabase Storage section:
--
-- 1. Create bucket: "documents"
-- 2. Create bucket: "photos"
--
-- Then set policies:
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', false);
--
-- CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id = 'documents' AND auth.role() = 'authenticated'
-- );
-- CREATE POLICY "Authenticated users can view documents" ON storage.objects FOR SELECT USING (
--   bucket_id = 'documents' AND auth.role() = 'authenticated'
-- );
