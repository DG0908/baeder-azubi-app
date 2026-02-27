-- =====================================================
-- SCHEDULE: Berichtsheft-Reminder (taeglich um 21:00 Uhr, Europe/Berlin)
-- =====================================================
-- Anleitung:
-- 1) Platzhalter unten ersetzen:
--    - REPLACE_WITH_BERICHTSHEFT_REMINDER_SECRET
-- 2) Im Supabase SQL Editor ausfuehren.
--
-- Warum stündlich?
-- Der Cron-Job laeuft jede volle Stunde in UTC.
-- Die Edge Function prueft intern die lokale Zeit in Europe/Berlin
-- und sendet nur um 21:00 Uhr (DST-sicher).
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
DECLARE
  project_ref text := 'ummqefvkrpzqdznvcnek';
  reminder_secret text := 'REPLACE_WITH_BERICHTSHEFT_REMINDER_SECRET';
  function_url text;
  command_text text;
  existing_job_id int;
BEGIN
  IF reminder_secret LIKE 'REPLACE_WITH_%' THEN
    RAISE EXCEPTION 'Bitte reminder_secret vor dem Ausfuehren ersetzen.';
  END IF;

  function_url := format('https://%s.supabase.co/functions/v1/send-berichtsheft-reminder', project_ref);

  SELECT jobid
    INTO existing_job_id
    FROM cron.job
   WHERE jobname = 'berichtsheft_reminder_hourly'
   LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;

  command_text := format(
    $cmd$
      SELECT net.http_post(
        url := %L,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-reminder-secret', %L
        ),
        body := '{"source":"pg_cron"}'::jsonb
      );
    $cmd$,
    function_url,
    reminder_secret
  );

  PERFORM cron.schedule(
    'berichtsheft_reminder_hourly',
    '0 * * * *',
    command_text
  );
END $$;
