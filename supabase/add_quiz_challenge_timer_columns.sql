-- Quizduell: konfigurierbare Annahmefrist fuer Herausforderungen

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS challenge_timeout_minutes INTEGER DEFAULT 2880,
  ADD COLUMN IF NOT EXISTS challenge_expires_at TIMESTAMPTZ;

UPDATE public.games
SET challenge_timeout_minutes = COALESCE(challenge_timeout_minutes, 2880)
WHERE challenge_timeout_minutes IS NULL;

UPDATE public.games
SET challenge_expires_at = COALESCE(
  challenge_expires_at,
  COALESCE(created_at, updated_at, NOW())
    + make_interval(mins => GREATEST(15, LEAST(10080, challenge_timeout_minutes)))
)
WHERE status = 'waiting';

ALTER TABLE public.games
  ALTER COLUMN challenge_timeout_minutes SET NOT NULL,
  ALTER COLUMN challenge_timeout_minutes SET DEFAULT 2880;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'games_challenge_timeout_minutes_range'
      AND conrelid = 'public.games'::regclass
  ) THEN
    ALTER TABLE public.games
      ADD CONSTRAINT games_challenge_timeout_minutes_range
      CHECK (challenge_timeout_minutes BETWEEN 15 AND 10080);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_games_challenge_expires_at_waiting
  ON public.games (challenge_expires_at)
  WHERE status = 'waiting';
