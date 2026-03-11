-- =====================================================
-- MIGRATION: Berichtsheft-Status fuer Entwuerfe/Einreichung
-- =====================================================
-- Fuehre dieses Skript im Supabase SQL Editor aus.

ALTER TABLE public.berichtsheft
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted';

UPDATE public.berichtsheft
SET status = 'submitted'
WHERE status IS NULL
   OR btrim(status) = ''
   OR lower(status) NOT IN ('draft', 'submitted');

ALTER TABLE public.berichtsheft
  ALTER COLUMN status SET DEFAULT 'submitted';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'berichtsheft_status_check'
      AND conrelid = 'public.berichtsheft'::regclass
  ) THEN
    ALTER TABLE public.berichtsheft
      ADD CONSTRAINT berichtsheft_status_check
      CHECK (status IN ('draft', 'submitted'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_berichtsheft_status
  ON public.berichtsheft (status);

CREATE INDEX IF NOT EXISTS idx_berichtsheft_user_week_status
  ON public.berichtsheft (user_name, week_start, status);

-- Safety: alte doppelte Drafts pro user/week aufraeumen, dann Unique-Index setzen.
WITH ranked_drafts AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY user_name, week_start
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
    ) AS rn
  FROM public.berichtsheft
  WHERE status = 'draft'
)
DELETE FROM public.berichtsheft b
USING ranked_drafts d
WHERE b.id = d.id
  AND d.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_berichtsheft_unique_draft_per_user_week
  ON public.berichtsheft (user_name, week_start)
  WHERE status = 'draft';
