-- Complete User Profile Setup
-- Run this ONCE in Supabase SQL Editor to create all user profiles
-- This will create profiles for all 4 demo users

-- IMPORTANT: First, go to Authentication > Users and copy the UUIDs for each user
-- Replace the UUIDs below with the actual UUIDs from your Supabase Auth users



-- Admin Profile
INSERT INTO profiles (id, email, name, role) VALUES
('2097f648-aed4-4aef-b874-9b25c5c93876', 'admin@meattracepro.com', 'Sipho Ndlovu', 'SUPER_ADMIN')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Manager Profile
INSERT INTO profiles (id, email, name, role) VALUES
('cee0c0d9-40bd-45ef-8702-82ac07b8e625', 'manager@meattracepro.com', 'Thandi Mkhize', 'MANAGER')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Operator Profile
INSERT INTO profiles (id, email, name, role) VALUES
('017e2cf2-24ee-4dc6-abe8-fcd7a1a4dd1c', 'operator@meattracepro.com', 'Bongani Zulu', 'OPERATOR')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Auditor Profile
INSERT INTO profiles (id, email, name, role) VALUES
('b128b556-4871-4189-bf15-3b2ec5e15572', 'auditor@meattracepro.com', 'Fatima Patel', 'AUDITOR')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Verify profiles were created
SELECT id, email, name, role FROM profiles ORDER BY role;
