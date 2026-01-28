-- App Configuration Table for Admin UI Editor
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS app_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  menu_items JSONB NOT NULL DEFAULT '[]',
  theme_colors JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read config (needed to load menu/colors)
CREATE POLICY "Anyone can read app config"
  ON app_config FOR SELECT
  USING (true);

-- Policy: Only admins can update config
CREATE POLICY "Admins can update app config"
  ON app_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Only admins can insert config
CREATE POLICY "Admins can insert app config"
  ON app_config FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default config row
INSERT INTO app_config (id, menu_items, theme_colors, updated_by)
VALUES (
  'main',
  '[]',
  '{"primary": "#0ea5e9", "secondary": "#64748b", "success": "#22c55e", "danger": "#ef4444", "warning": "#eab308"}',
  'system'
) ON CONFLICT (id) DO NOTHING;
