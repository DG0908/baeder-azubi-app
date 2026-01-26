-- =====================================================
-- AVATAR MIGRATION
-- Fügt Avatar-Unterstützung zu profiles und messages hinzu
-- =====================================================
-- ANLEITUNG:
-- 1. Gehe zu Supabase Dashboard → SQL Editor
-- 2. Führe dieses Skript aus
-- =====================================================

-- Avatar-Spalte zur profiles Tabelle hinzufügen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Avatar-Spalte zur messages Tabelle hinzufügen (falls vorhanden)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_avatar TEXT;
  END IF;
END $$;

-- Falls messages Tabelle noch nicht existiert, erstellen
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  user_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS für messages aktivieren (falls noch nicht aktiv)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy für messages (jeder kann lesen und schreiben)
DROP POLICY IF EXISTS "Messages sind für alle sichtbar" ON messages;
CREATE POLICY "Messages sind für alle sichtbar"
  ON messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Jeder kann Messages erstellen" ON messages;
CREATE POLICY "Jeder kann Messages erstellen"
  ON messages FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- FERTIG!
-- Die App unterstützt jetzt Avatare im Profil und Chat
-- =====================================================
