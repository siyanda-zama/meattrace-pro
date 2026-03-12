-- Create Admin Profile
-- Replace the UUID below with your actual admin user UUID from Authentication > Users

-- First, find your admin user UUID:
-- Go to Authentication > Users > admin@meattracepro.com > Copy the UUID

-- Then replace 'YOUR_ADMIN_UUID_HERE' below with that UUID and run this:

INSERT INTO profiles (id, email, name, role) VALUES
('2097f648-aed4-4aef-b874-9b25c5c93876', 'admin@meattracepro.com', 'Sipho Ndlovu', 'SUPER_ADMIN');

-- If you get a "duplicate key" error, the profile already exists!
-- If you get a foreign key error, double-check the UUID matches the auth user exactly.
