-- =====================================================
-- SUPABASE AUTH MIGRATION
-- Baeder Azubi App
-- =====================================================
-- ANLEITUNG:
-- 1. Gehe zu Supabase Dashboard → SQL Editor
-- 2. Führe dieses Skript aus
-- 3. Gehe zu Authentication → Providers → Email
--    - Stelle sicher, dass Email aktiviert ist
--    - Optional: "Confirm email" ausschalten für einfacheren Start
-- =====================================================

-- =====================================================
-- SCHRITT 1: ALTE TABELLEN LÖSCHEN (Clean Start)
-- =====================================================
DROP TABLE IF EXISTS swim_sessions CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- SCHRITT 2: NEUE TABELLEN ERSTELLEN
-- =====================================================

-- PROFILES (User-Zusatzdaten, verknüpft mit Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'azubi' CHECK (role IN ('admin', 'trainer', 'azubi')),
  training_end DATE,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_role_idx ON profiles(role);

-- SWIM_SESSIONS (Schwimm-Trainingseinheiten)
CREATE TABLE swim_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT,
  date DATE NOT NULL,
  distance INTEGER NOT NULL DEFAULT 0,
  time_minutes INTEGER DEFAULT 0,
  style TEXT DEFAULT 'kraul',
  notes TEXT,
  challenge_id TEXT,
  confirmed BOOLEAN DEFAULT false,
  confirmed_by TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX swim_sessions_user_id_idx ON swim_sessions(user_id);
CREATE INDEX swim_sessions_date_idx ON swim_sessions(date);

-- USER_BADGES (Verdiente Abzeichen)
CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX user_badges_user_id_idx ON user_badges(user_id);

-- USER_STATS (Quiz-Statistiken)
CREATE TABLE user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  category_stats JSONB DEFAULT '{}',
  opponents JSONB DEFAULT '{}'
);

-- =====================================================
-- SCHRITT 3: ROW LEVEL SECURITY AKTIVIEREN
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swim_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SCHRITT 4: RLS POLICIES FÜR PROFILES
-- =====================================================

-- Jeder kann alle Profile lesen (für Bestenliste, Gegner-Auswahl etc.)
CREATE POLICY "Profiles sind für alle sichtbar"
  ON profiles FOR SELECT
  USING (true);

-- User kann nur sein eigenes Profil aktualisieren
CREATE POLICY "User kann eigenes Profil aktualisieren"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Nur Admins können Profile löschen
CREATE POLICY "Admins können Profile löschen"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert wird vom Trigger gemacht, aber User kann auch selbst einfügen
CREATE POLICY "User kann eigenes Profil erstellen"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- SCHRITT 5: RLS POLICIES FÜR SWIM_SESSIONS
-- =====================================================

-- Alle können Sessions lesen (für Bestenliste)
CREATE POLICY "Swim Sessions sind für alle sichtbar"
  ON swim_sessions FOR SELECT
  USING (true);

-- User kann nur eigene Sessions einfügen
CREATE POLICY "User kann nur eigene Sessions einfügen"
  ON swim_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User kann eigene Sessions löschen, Trainer/Admin können alle löschen
CREATE POLICY "Sessions löschen"
  ON swim_sessions FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

-- Nur Trainer/Admin können Sessions aktualisieren (bestätigen)
CREATE POLICY "Trainer können Sessions bestätigen"
  ON swim_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

-- =====================================================
-- SCHRITT 6: RLS POLICIES FÜR USER_STATS
-- =====================================================

-- Alle können Stats lesen
CREATE POLICY "Stats sind für alle sichtbar"
  ON user_stats FOR SELECT
  USING (true);

-- User kann nur eigene Stats einfügen
CREATE POLICY "User kann eigene Stats einfügen"
  ON user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User kann nur eigene Stats aktualisieren
CREATE POLICY "User kann eigene Stats aktualisieren"
  ON user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- SCHRITT 7: RLS POLICIES FÜR USER_BADGES
-- =====================================================

-- Alle können Badges sehen
CREATE POLICY "Badges sind für alle sichtbar"
  ON user_badges FOR SELECT
  USING (true);

-- User kann eigene Badges einfügen
CREATE POLICY "User kann eigene Badges einfügen"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- SCHRITT 8: TRIGGER FÜR AUTOMATISCHES PROFIL
-- =====================================================

-- Funktion: Automatisch Profil erstellen bei Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, training_end, approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unbekannt'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'azubi'),
    (NEW.raw_user_meta_data->>'training_end')::DATE,
    false  -- Neue User müssen freigeschaltet werden
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger erstellen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SCHRITT 9: HILFSFUNKTIONEN
-- =====================================================

-- Prüfen ob User Trainer/Admin ist
CREATE OR REPLACE FUNCTION public.is_trainer_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('trainer', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User-Rolle abrufen
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FERTIG!
--
-- NÄCHSTE SCHRITTE:
-- 1. Gehe zu Authentication → Providers → Email
--    - Aktiviere Email Provider
--    - OPTIONAL: "Confirm email" ausschalten für einfacheren Start
-- 2. Erstelle einen ersten Admin-User:
--    a) Registriere dich in der App
--    b) Im Supabase Dashboard → Table Editor → profiles
--    c) Setze role='admin' und approved=true für deinen Account
-- 3. Teste Login und Registrierung
-- =====================================================
