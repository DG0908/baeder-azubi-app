-- =====================================================
-- MIGRATION: Berichtsheft-Unterschrift-Berechtigung
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus

-- 1. Berechtigung für Berichtsheft-Unterschriften
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS can_sign_reports BOOLEAN DEFAULT false;

-- =====================================================
-- FERTIG!
-- - Trainer/Ausbilder können jetzt individuell berechtigt werden
-- - Admins haben automatisch Zugriff (wird im Code geprüft)
-- =====================================================
