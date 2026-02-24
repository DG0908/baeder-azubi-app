-- =====================================================
-- MIGRATION: Owner-Schutz fuer Rollen und App-Konfiguration
-- =====================================================
-- Fuehre dieses Skript im Supabase SQL Editor aus.
--
-- Ziele:
-- 1) Rollenwechsel nur durch Hauptadmin (Owner)
-- 2) app_config nur durch Hauptadmin aenderbar
-- 3) Genau ein Hauptadmin (is_owner=true) gleichzeitig
-- 4) Bootstrap-Fallback: Solange kein Owner gesetzt ist,
--    darf ein Admin die Initial-Konfiguration durchfuehren.
-- =====================================================

-- 1) Owner-Flag auf Profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_owner BOOLEAN NOT NULL DEFAULT false;

-- Maximal ein Owner gleichzeitig
CREATE UNIQUE INDEX IF NOT EXISTS profiles_single_owner_idx
  ON public.profiles (is_owner)
  WHERE is_owner = true;

-- Owner muss Admin sein
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_owner_must_be_admin'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_owner_must_be_admin
      CHECK (NOT is_owner OR role = 'admin');
  END IF;
END $$;

-- 2) Hilfsfunktion: Wer darf sensible App-Sicherheit aendern?
-- Owner => immer
-- Kein Owner vorhanden => Admin (Bootstrap)
CREATE OR REPLACE FUNCTION public.can_manage_app_security(actor_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE is_owner = true)
  INTO owner_exists;

  IF owner_exists THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = actor_id
        AND is_owner = true
    );
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = actor_id
      AND role = 'admin'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.can_manage_app_security(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_app_security(uuid) TO authenticated;

-- 3) Trigger: Rollen/Owner-Status schuetzen
CREATE OR REPLACE FUNCTION public.enforce_owner_role_controls()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_owner = true AND NEW.role <> 'admin' THEN
    RAISE EXCEPTION 'Hauptadmin muss die Rolle admin haben.';
  END IF;

  IF OLD.is_owner = true AND NEW.role <> 'admin' THEN
    RAISE EXCEPTION 'Hauptadmin kann nicht zu trainer/azubi herabgestuft werden.';
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role
     AND NOT public.can_manage_app_security(auth.uid()) THEN
    RAISE EXCEPTION 'Nur der Hauptadmin darf Rollen aendern.';
  END IF;

  IF NEW.is_owner IS DISTINCT FROM OLD.is_owner
     AND NOT public.can_manage_app_security(auth.uid()) THEN
    RAISE EXCEPTION 'Nur der Hauptadmin darf Hauptadmin-Status aendern.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_owner_role_controls ON public.profiles;
CREATE TRIGGER trg_enforce_owner_role_controls
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_owner_role_controls();

-- Owner-Profil darf nicht geloescht werden
CREATE OR REPLACE FUNCTION public.prevent_owner_profile_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_owner = true THEN
    RAISE EXCEPTION 'Das Hauptadmin-Konto darf nicht geloescht werden.';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_owner_profile_delete ON public.profiles;
CREATE TRIGGER trg_prevent_owner_profile_delete
BEFORE DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_owner_profile_delete();

-- 4) app_config Policies auf Owner umstellen
DO $$
BEGIN
  IF to_regclass('public.app_config') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can update app config" ON public.app_config';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can insert app config" ON public.app_config';
    EXECUTE 'DROP POLICY IF EXISTS "Owner can update app config" ON public.app_config';
    EXECUTE 'DROP POLICY IF EXISTS "Owner can insert app config" ON public.app_config';

    EXECUTE $policy$
      CREATE POLICY "Owner can update app config"
      ON public.app_config FOR UPDATE
      USING (public.can_manage_app_security(auth.uid()))
      WITH CHECK (public.can_manage_app_security(auth.uid()))
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "Owner can insert app config"
      ON public.app_config FOR INSERT
      WITH CHECK (public.can_manage_app_security(auth.uid()))
    $policy$;
  END IF;
END $$;

-- 5) Owner gezielt setzen (Transfer moeglich)
CREATE OR REPLACE FUNCTION public.set_owner_by_email(owner_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text;
  target_id uuid;
BEGIN
  normalized_email := lower(trim(owner_email));
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RAISE EXCEPTION 'Bitte eine gueltige E-Mail uebergeben.';
  END IF;

  IF NOT public.can_manage_app_security(auth.uid()) THEN
    RAISE EXCEPTION 'Keine Berechtigung zum Setzen des Hauptadmins.';
  END IF;

  SELECT id
  INTO target_id
  FROM public.profiles
  WHERE lower(email) = normalized_email
  LIMIT 1;

  IF target_id IS NULL THEN
    RAISE EXCEPTION 'Kein Profil mit dieser E-Mail gefunden: %', owner_email;
  END IF;

  UPDATE public.profiles
  SET is_owner = false
  WHERE is_owner = true;

  UPDATE public.profiles
  SET is_owner = true,
      role = 'admin',
      approved = true
  WHERE id = target_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_owner_by_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_owner_by_email(text) TO authenticated;

-- =====================================================
-- Danach EINMAL ausfuehren (E-Mail anpassen):
--   SELECT public.set_owner_by_email('deine.email@beispiel.de');
-- =====================================================
