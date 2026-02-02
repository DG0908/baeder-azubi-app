-- =====================================================
-- MIGRATION: Berichtsheft-Profil (JSONB)
-- Speichert Azubi-Profildaten für das Berichtsheft
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus
-- =====================================================

-- Berichtsheft-Profil als JSONB zur profiles Tabelle hinzufügen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS berichtsheft_profile JSONB DEFAULT NULL;

-- =====================================================
-- FERTIG!
-- Azubi-Profildaten werden jetzt in Supabase gespeichert.
-- Felder: vorname, nachname, ausbildungsbetrieb,
--         ausbildungsberuf, ausbilder, ausbildungsbeginn,
--         ausbildungsende
-- =====================================================
