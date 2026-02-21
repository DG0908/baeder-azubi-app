-- =====================================================
-- QUICKFIX: Fehlende Spalte can_sign_reports in profiles
-- =====================================================
-- Fuehre dieses Skript zuerst im Supabase SQL Editor aus.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS can_sign_reports BOOLEAN DEFAULT false;
