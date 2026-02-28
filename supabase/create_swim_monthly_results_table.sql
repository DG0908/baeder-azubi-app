-- Speichert Monatsabschluesse fuer Swim Team-Battle und "Schwimmer des Monats".

CREATE TABLE IF NOT EXISTS public.swim_monthly_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month_key TEXT NOT NULL UNIQUE, -- Format: YYYY-MM
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  winner_team TEXT NOT NULL DEFAULT 'tie',
  azubis_points INTEGER NOT NULL DEFAULT 0,
  trainer_points INTEGER NOT NULL DEFAULT 0,
  azubis_distance INTEGER NOT NULL DEFAULT 0,
  trainer_distance INTEGER NOT NULL DEFAULT 0,
  swimmer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  swimmer_name TEXT,
  swimmer_role TEXT,
  swimmer_distance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.swim_monthly_results
  ADD COLUMN IF NOT EXISTS month_key TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS month INTEGER,
  ADD COLUMN IF NOT EXISTS winner_team TEXT DEFAULT 'tie',
  ADD COLUMN IF NOT EXISTS azubis_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trainer_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS azubis_distance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trainer_distance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS swimmer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS swimmer_name TEXT,
  ADD COLUMN IF NOT EXISTS swimmer_role TEXT,
  ADD COLUMN IF NOT EXISTS swimmer_distance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.swim_monthly_results
SET winner_team = 'tie'
WHERE winner_team IS NULL;

UPDATE public.swim_monthly_results
SET year = EXTRACT(YEAR FROM COALESCE(created_at, NOW()))::INTEGER
WHERE year IS NULL;

UPDATE public.swim_monthly_results
SET month = EXTRACT(MONTH FROM COALESCE(created_at, NOW()))::INTEGER
WHERE month IS NULL;

UPDATE public.swim_monthly_results
SET month_key = CONCAT(year, '-', LPAD(month::TEXT, 2, '0'))
WHERE month_key IS NULL;

ALTER TABLE public.swim_monthly_results
  ALTER COLUMN month_key SET NOT NULL,
  ALTER COLUMN year SET NOT NULL,
  ALTER COLUMN month SET NOT NULL,
  ALTER COLUMN winner_team SET NOT NULL,
  ALTER COLUMN winner_team SET DEFAULT 'tie',
  ALTER COLUMN azubis_points SET NOT NULL,
  ALTER COLUMN azubis_points SET DEFAULT 0,
  ALTER COLUMN trainer_points SET NOT NULL,
  ALTER COLUMN trainer_points SET DEFAULT 0,
  ALTER COLUMN azubis_distance SET NOT NULL,
  ALTER COLUMN azubis_distance SET DEFAULT 0,
  ALTER COLUMN trainer_distance SET NOT NULL,
  ALTER COLUMN trainer_distance SET DEFAULT 0,
  ALTER COLUMN swimmer_distance SET NOT NULL,
  ALTER COLUMN swimmer_distance SET DEFAULT 0,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_monthly_results_winner_team_check'
      AND conrelid = 'public.swim_monthly_results'::regclass
  ) THEN
    ALTER TABLE public.swim_monthly_results
      ADD CONSTRAINT swim_monthly_results_winner_team_check
      CHECK (winner_team IN ('azubis', 'trainer', 'tie'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_monthly_results_month_check'
      AND conrelid = 'public.swim_monthly_results'::regclass
  ) THEN
    ALTER TABLE public.swim_monthly_results
      ADD CONSTRAINT swim_monthly_results_month_check
      CHECK (month BETWEEN 1 AND 12);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_swim_monthly_results_month_key
  ON public.swim_monthly_results(month_key);

CREATE INDEX IF NOT EXISTS idx_swim_monthly_results_year
  ON public.swim_monthly_results(year);

CREATE INDEX IF NOT EXISTS idx_swim_monthly_results_swimmer_user
  ON public.swim_monthly_results(swimmer_user_id);

ALTER TABLE public.swim_monthly_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Swim monthly results readable" ON public.swim_monthly_results;
CREATE POLICY "Swim monthly results readable"
  ON public.swim_monthly_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Swim monthly results insert for authenticated" ON public.swim_monthly_results;
CREATE POLICY "Swim monthly results insert for authenticated"
  ON public.swim_monthly_results FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Swim monthly results update for authenticated" ON public.swim_monthly_results;
CREATE POLICY "Swim monthly results update for authenticated"
  ON public.swim_monthly_results FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
