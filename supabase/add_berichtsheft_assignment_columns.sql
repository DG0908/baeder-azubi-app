-- =====================================================
-- MIGRATION: Berichtsheft-Zuweisung und Signatur-Queue
-- =====================================================
-- Fuehre dieses Skript im Supabase Dashboard -> SQL Editor aus
--
-- Dieses Skript sucht die Berichtsheft-Tabelle automatisch.
-- Falls keine passende Tabelle gefunden wird, wird eine klare Fehlermeldung geworfen.

DO $$
DECLARE
  target_table text;
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

  SELECT t.table_name
  INTO target_table
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND (
      t.table_name = 'berichtsheft'
      OR t.table_name = 'berichtshefte'
      OR t.table_name = 'berichtsheft_entries'
      OR t.table_name ILIKE '%berichts%heft%'
      OR t.table_name ILIKE '%bericht%heft%'
    )
  ORDER BY CASE
    WHEN t.table_name = 'berichtsheft' THEN 0
    WHEN t.table_name = 'berichtshefte' THEN 1
    WHEN t.table_name = 'berichtsheft_entries' THEN 2
    ELSE 3
  END,
  t.table_name
  LIMIT 1;

  IF target_table IS NULL THEN
    RAISE EXCEPTION
      'Keine Berichtsheft-Tabelle in Schema public gefunden. Bitte zuerst bestehende Tabellen pruefen (z.B. per information_schema).';
  END IF;

  RAISE NOTICE 'Verwende Tabelle public.%', target_table;

  -- 1) Zuweisungsfelder am Berichtsheft
  EXECUTE format(
    'ALTER TABLE public.%I
      ADD COLUMN IF NOT EXISTS assigned_trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS assigned_trainer_name TEXT,
      ADD COLUMN IF NOT EXISTS assigned_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;',
    target_table
  );

  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS %I ON public.%I (assigned_trainer_id);',
    'idx_' || target_table || '_assigned_trainer_id',
    target_table
  );

  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS %I ON public.%I (week_start DESC);',
    'idx_' || target_table || '_week_start',
    target_table
  );

  -- 2) Zusatz-Policy: Admin/Ausbilder duerfen alle Berichtshefte zur Freigabe sehen
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = target_table
      AND policyname = 'Admin oder Ausbilder kann Berichtshefte lesen'
  ) THEN
    EXECUTE format(
      'CREATE POLICY "Admin oder Ausbilder kann Berichtshefte lesen"
         ON public.%I
         FOR SELECT
         USING (
           EXISTS (
             SELECT 1
             FROM public.profiles p
             WHERE p.id = auth.uid()
               AND (p.role IN (''admin'', ''trainer'') OR COALESCE(p.can_sign_reports, false) = true)
           )
         );',
      target_table
    );
  END IF;

  -- 3) Zusatz-Policy: Admin/Ausbilder duerfen Berichtshefte zuweisen/signieren
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = target_table
      AND policyname = 'Admin oder Ausbilder kann Berichtshefte aktualisieren'
  ) THEN
    EXECUTE format(
      'CREATE POLICY "Admin oder Ausbilder kann Berichtshefte aktualisieren"
         ON public.%I
         FOR UPDATE
         USING (
           EXISTS (
             SELECT 1
             FROM public.profiles p
             WHERE p.id = auth.uid()
               AND (p.role IN (''admin'', ''trainer'') OR COALESCE(p.can_sign_reports, false) = true)
           )
         )
         WITH CHECK (
           EXISTS (
             SELECT 1
             FROM public.profiles p
             WHERE p.id = auth.uid()
               AND (p.role IN (''admin'', ''trainer'') OR COALESCE(p.can_sign_reports, false) = true)
           )
         );',
      target_table
    );
  END IF;
END $$;

-- =====================================================
-- FERTIG
-- =====================================================
