-- =====================================================
-- FIX: Admins können User freischalten
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus
-- =====================================================

-- Alte Policy löschen
DROP POLICY IF EXISTS "User kann eigenes Profil aktualisieren" ON profiles;

-- Neue Policy: User kann eigenes Profil ODER Admin kann alle Profile aktualisieren
CREATE POLICY "User oder Admin kann Profil aktualisieren"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auch Trainer sollen User-Stats erstellen können (für Freischaltung)
DROP POLICY IF EXISTS "User kann eigene Stats einfügen" ON user_stats;

CREATE POLICY "User oder Admin kann Stats einfügen"
  ON user_stats FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'trainer')
    )
  );

-- =====================================================
-- FERTIG! Admins können jetzt User freischalten.
-- =====================================================
