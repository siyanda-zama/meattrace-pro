-- Fix RLS Policies for Profiles Table
-- Run this in Supabase SQL Editor to fix the login issue

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;

-- Create new policies that allow profile reads during authentication
CREATE POLICY "Enable read access for authenticated users" ON profiles
  FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'MANAGER'))
  );
