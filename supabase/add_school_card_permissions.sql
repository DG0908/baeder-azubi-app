-- =====================================================
-- MIGRATION: Kontrollkarten-Berechtigungen
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus

-- 1. Berechtigung für Trainer: Kontrollkarten einsehen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS can_view_school_cards BOOLEAN DEFAULT false;

-- 2. user_id Spalte zur school_attendance hinzufügen (falls nicht vorhanden)
ALTER TABLE school_attendance ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS school_attendance_user_id_idx ON school_attendance(user_id);

-- 4. Bestehende Einträge migrieren (user_id aus profiles basierend auf user_name setzen)
UPDATE school_attendance sa
SET user_id = p.id
FROM profiles p
WHERE sa.user_name = p.name AND sa.user_id IS NULL;

-- 5. Admins haben automatisch Zugriff (kein extra Flag nötig, wird im Code geprüft)

-- =====================================================
-- FERTIG!
-- - Trainer können jetzt individuell berechtigt werden
-- - Kontrollkarten werden jetzt per user_id zugeordnet
-- - Bestehende Einträge wurden migriert
-- =====================================================
