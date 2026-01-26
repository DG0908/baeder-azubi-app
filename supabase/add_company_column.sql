-- =====================================================
-- BETRIEB MIGRATION
-- Fügt Betrieb-Feld zum Profil hinzu
-- =====================================================
-- ANLEITUNG:
-- 1. Gehe zu Supabase Dashboard → SQL Editor
-- 2. Führe dieses Skript aus
-- =====================================================

-- Betrieb-Spalte zur profiles Tabelle hinzufügen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;

-- =====================================================
-- FERTIG!
-- Benutzer können jetzt ihren Betrieb im Profil angeben
-- =====================================================
