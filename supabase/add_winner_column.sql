-- =====================================================
-- FIX: Winner-Spalte zur Games-Tabelle hinzufügen
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus
-- =====================================================

-- Winner-Spalte hinzufügen (falls nicht vorhanden)
ALTER TABLE games ADD COLUMN IF NOT EXISTS winner TEXT DEFAULT NULL;

-- Bestehende beendete Spiele: Winner aus Scores berechnen
UPDATE games
SET winner = CASE
  WHEN player1_score > player2_score THEN player1
  WHEN player2_score > player1_score THEN player2
  ELSE NULL
END
WHERE status = 'finished' AND winner IS NULL;

-- =====================================================
-- FERTIG! Winner wird jetzt korrekt gespeichert.
-- =====================================================
