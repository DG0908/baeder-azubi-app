-- Create resources table for shared links
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'website',
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read resources
CREATE POLICY "Anyone can read resources"
  ON resources FOR SELECT
  USING (true);

-- Policy: Only admins can insert resources
CREATE POLICY "Admins can insert resources"
  ON resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Only admins can delete resources
CREATE POLICY "Admins can delete resources"
  ON resources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);
