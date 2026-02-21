-- =====================================================
-- MIGRATION: Berichtsheft-Tabelle (Basis + RLS + Signatur-Workflow)
-- =====================================================
-- Fuehre dieses Skript im Supabase Dashboard -> SQL Editor aus
-- Danach kannst du optional weiterhin add_berichtsheft_assignment_columns.sql laufen lassen
-- (dort ist alles mit IF NOT EXISTS abgesichert).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Vorbedingung: Signatur-Berechtigungsspalte anlegen, falls sie fehlt
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS can_sign_reports BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 1) Tabelle erstellen (falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS public.berichtsheft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  ausbildungsjahr INTEGER NOT NULL DEFAULT 1,
  nachweis_nr INTEGER NOT NULL DEFAULT 1,
  entries JSONB NOT NULL DEFAULT '{}'::jsonb,
  bemerkung_azubi TEXT DEFAULT '',
  bemerkung_ausbilder TEXT DEFAULT '',
  signatur_azubi TEXT DEFAULT '',
  signatur_ausbilder TEXT DEFAULT '',
  datum_azubi DATE,
  datum_ausbilder DATE,
  total_hours NUMERIC(6,2) DEFAULT 0,
  assigned_trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_trainer_name TEXT,
  assigned_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT berichtsheft_ausbildungsjahr_check CHECK (ausbildungsjahr BETWEEN 1 AND 3)
);

-- 2) Fehlende Spalten bei bestehenden Installationen nachziehen
ALTER TABLE public.berichtsheft
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS user_name TEXT,
  ADD COLUMN IF NOT EXISTS week_start DATE,
  ADD COLUMN IF NOT EXISTS week_end DATE,
  ADD COLUMN IF NOT EXISTS ausbildungsjahr INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS nachweis_nr INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS entries JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS bemerkung_azubi TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS bemerkung_ausbilder TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS signatur_azubi TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS signatur_ausbilder TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS datum_azubi DATE,
  ADD COLUMN IF NOT EXISTS datum_ausbilder DATE,
  ADD COLUMN IF NOT EXISTS total_hours NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assigned_trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_trainer_name TEXT,
  ADD COLUMN IF NOT EXISTS assigned_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3) Defaults/Not-Null soweit moeglich setzen
ALTER TABLE public.berichtsheft
  ALTER COLUMN user_name SET DEFAULT '',
  ALTER COLUMN entries SET DEFAULT '{}'::jsonb,
  ALTER COLUMN bemerkung_azubi SET DEFAULT '',
  ALTER COLUMN bemerkung_ausbilder SET DEFAULT '',
  ALTER COLUMN signatur_azubi SET DEFAULT '',
  ALTER COLUMN signatur_ausbilder SET DEFAULT '',
  ALTER COLUMN total_hours SET DEFAULT 0,
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

UPDATE public.berichtsheft
SET user_id = auth.uid()
WHERE user_id IS NULL
  AND auth.uid() IS NOT NULL;

UPDATE public.berichtsheft SET user_name = '' WHERE user_name IS NULL;
UPDATE public.berichtsheft SET entries = '{}'::jsonb WHERE entries IS NULL;
UPDATE public.berichtsheft SET week_start = CURRENT_DATE WHERE week_start IS NULL;
UPDATE public.berichtsheft SET week_end = CURRENT_DATE WHERE week_end IS NULL;
UPDATE public.berichtsheft SET ausbildungsjahr = 1 WHERE ausbildungsjahr IS NULL;
UPDATE public.berichtsheft SET nachweis_nr = 1 WHERE nachweis_nr IS NULL;
UPDATE public.berichtsheft SET total_hours = 0 WHERE total_hours IS NULL;
UPDATE public.berichtsheft SET created_at = NOW() WHERE created_at IS NULL;
UPDATE public.berichtsheft SET updated_at = NOW() WHERE updated_at IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'berichtsheft'
      AND column_name = 'user_name'
      AND is_nullable = 'YES'
  ) THEN
    BEGIN
      ALTER TABLE public.berichtsheft ALTER COLUMN user_name SET NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'user_name konnte nicht auf NOT NULL gesetzt werden (bestehende Daten pruefen).';
    END;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'berichtsheft'
      AND column_name = 'week_start'
      AND is_nullable = 'YES'
  ) THEN
    BEGIN
      ALTER TABLE public.berichtsheft ALTER COLUMN week_start SET NOT NULL;
      ALTER TABLE public.berichtsheft ALTER COLUMN week_end SET NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'week_start/week_end konnten nicht auf NOT NULL gesetzt werden (bestehende Daten pruefen).';
    END;
  END IF;
END $$;

-- 4) Trigger fuer user_id / updated_at
CREATE OR REPLACE FUNCTION public.set_berichtsheft_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  IF NEW.updated_at IS NULL THEN
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.touch_berichtsheft_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_berichtsheft_defaults ON public.berichtsheft;
CREATE TRIGGER trg_berichtsheft_defaults
BEFORE INSERT ON public.berichtsheft
FOR EACH ROW
EXECUTE FUNCTION public.set_berichtsheft_defaults();

DROP TRIGGER IF EXISTS trg_berichtsheft_updated_at ON public.berichtsheft;
CREATE TRIGGER trg_berichtsheft_updated_at
BEFORE UPDATE ON public.berichtsheft
FOR EACH ROW
EXECUTE FUNCTION public.touch_berichtsheft_updated_at();

-- 5) Indexe
CREATE INDEX IF NOT EXISTS idx_berichtsheft_user_name
  ON public.berichtsheft (user_name);

CREATE INDEX IF NOT EXISTS idx_berichtsheft_user_id
  ON public.berichtsheft (user_id);

CREATE INDEX IF NOT EXISTS idx_berichtsheft_week_start
  ON public.berichtsheft (week_start DESC);

CREATE INDEX IF NOT EXISTS idx_berichtsheft_assigned_trainer_id
  ON public.berichtsheft (assigned_trainer_id);

-- 6) RLS aktivieren
ALTER TABLE public.berichtsheft ENABLE ROW LEVEL SECURITY;

-- 7) RLS Policies (idempotent neu setzen)
DROP POLICY IF EXISTS "Berichtsheft lesen (eigene oder berechtigt)" ON public.berichtsheft;
DROP POLICY IF EXISTS "Berichtsheft einfuegen (eigene oder berechtigt)" ON public.berichtsheft;
DROP POLICY IF EXISTS "Berichtsheft updaten (eigene oder berechtigt)" ON public.berichtsheft;
DROP POLICY IF EXISTS "Berichtsheft loeschen (eigene oder berechtigt)" ON public.berichtsheft;

CREATE POLICY "Berichtsheft lesen (eigene oder berechtigt)"
  ON public.berichtsheft FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles own_profile
      WHERE own_profile.id = auth.uid()
        AND own_profile.name = user_name
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles manager
      WHERE manager.id = auth.uid()
        AND (manager.role IN ('admin', 'trainer') OR COALESCE(manager.can_sign_reports, false) = true)
    )
  );

CREATE POLICY "Berichtsheft einfuegen (eigene oder berechtigt)"
  ON public.berichtsheft FOR INSERT
  WITH CHECK (
    (
      COALESCE(user_id, auth.uid()) = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.profiles own_profile
        WHERE own_profile.id = auth.uid()
          AND own_profile.name = user_name
      )
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles manager
      WHERE manager.id = auth.uid()
        AND (manager.role IN ('admin', 'trainer') OR COALESCE(manager.can_sign_reports, false) = true)
    )
  );

CREATE POLICY "Berichtsheft updaten (eigene oder berechtigt)"
  ON public.berichtsheft FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles own_profile
      WHERE own_profile.id = auth.uid()
        AND own_profile.name = user_name
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles manager
      WHERE manager.id = auth.uid()
        AND (manager.role IN ('admin', 'trainer') OR COALESCE(manager.can_sign_reports, false) = true)
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles own_profile
      WHERE own_profile.id = auth.uid()
        AND own_profile.name = user_name
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles manager
      WHERE manager.id = auth.uid()
        AND (manager.role IN ('admin', 'trainer') OR COALESCE(manager.can_sign_reports, false) = true)
    )
  );

CREATE POLICY "Berichtsheft loeschen (eigene oder berechtigt)"
  ON public.berichtsheft FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles manager
      WHERE manager.id = auth.uid()
        AND (manager.role IN ('admin', 'trainer') OR COALESCE(manager.can_sign_reports, false) = true)
    )
  );

-- =====================================================
-- FERTIG
-- =====================================================
