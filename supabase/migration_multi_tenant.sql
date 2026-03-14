-- ============================================================
-- MULTI-TENANT MIGRATION: Organizations + Invitation Codes
-- Bäder Azubi App — SmartBaden
-- ============================================================

-- STEP 1: Organizations table + organization_id on profiles
-- Run this ENTIRE block first
-- ============================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,  -- z.B. "oktopus" für URL/Code-Prefix
  contact_name TEXT,
  contact_email TEXT,
  address TEXT,
  phone TEXT,
  max_azubis INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,  -- interne Notizen (nur Systemadmin sieht das)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- organization_id auf profiles MUSS VOR den RLS Policies existieren
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Jeder eingeloggte User kann den Namen seiner eigenen Org sehen
CREATE POLICY "Users can view own organization"
  ON public.organizations FOR SELECT
  USING (
    id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_owner = true)
  );

-- Nur Systemadmin (is_owner) kann Orgs anlegen/bearbeiten
CREATE POLICY "Owner can manage organizations"
  ON public.organizations FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_owner = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_owner = true));


-- ============================================================
-- STEP 2: Invitation codes table
-- Run this block second
-- ============================================================

CREATE TABLE IF NOT EXISTS public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,  -- z.B. "OKTOPUS-2024" oder auto-generiert
  created_by UUID REFERENCES public.profiles(id),
  role TEXT DEFAULT 'azubi' CHECK (role IN ('azubi', 'trainer')),
  max_uses INTEGER DEFAULT 30,  -- 0 = unlimited
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,  -- optional: Code läuft ab
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- Jeder kann einen Code validieren (für Registrierung)
CREATE POLICY "Anyone can validate invitation codes"
  ON public.invitation_codes FOR SELECT
  USING (true);

-- Trainer können Codes für ihre eigene Org erstellen
CREATE POLICY "Trainers can create codes for own org"
  ON public.invitation_codes FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
  );

-- Trainer können used_count ihrer Codes updaten
CREATE POLICY "Update invitation codes"
  ON public.invitation_codes FOR UPDATE
  USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_owner = true)
  );

-- Owner und Trainer können Codes löschen
CREATE POLICY "Delete invitation codes"
  ON public.invitation_codes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_owner = true OR role IN ('admin', 'trainer')))
  );


-- ============================================================
-- STEP 3: Seed — Freizeitbad Oktopus + migrate existing users
-- Run this block third
-- ============================================================

-- Erstelle die erste Organisation
INSERT INTO public.organizations (name, slug, contact_name, notes)
VALUES ('Freizeitbad Oktopus', 'oktopus', 'Dennie', 'Eigener Betrieb — Pilotbetrieb')
ON CONFLICT (slug) DO NOTHING;

-- Weise alle bestehenden User dem Freizeitbad Oktopus zu
UPDATE public.profiles
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'oktopus')
WHERE organization_id IS NULL;


-- ============================================================
-- STEP 4: Function to validate and use invitation code during registration
-- Run this block fourth
-- ============================================================

CREATE OR REPLACE FUNCTION public.use_invitation_code(p_code TEXT)
RETURNS TABLE(org_id UUID, org_name TEXT, assigned_role TEXT) AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  SELECT * INTO v_invitation
  FROM public.invitation_codes
  WHERE code = UPPER(TRIM(p_code))
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses = 0 OR used_count < max_uses);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ungültiger oder abgelaufener Einladungscode';
  END IF;

  -- Zähler erhöhen
  UPDATE public.invitation_codes
  SET used_count = used_count + 1
  WHERE id = v_invitation.id;

  RETURN QUERY
  SELECT
    v_invitation.organization_id AS org_id,
    o.name AS org_name,
    v_invitation.role AS assigned_role
  FROM public.organizations o
  WHERE o.id = v_invitation.organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- STEP 5: Helper functions + RLS on profiles
-- Run this block fifth
-- ============================================================

-- Hilfsfunktionen (SECURITY DEFINER umgeht RLS-Selbstreferenz)
CREATE OR REPLACE FUNCTION public.get_my_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_owner FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policies mit Funktionen statt Subqueries
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
USING (
  id = auth.uid()
  OR public.is_owner()
  OR organization_id = public.get_my_org_id()
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
USING (
  id = auth.uid()
  OR public.is_owner()
  OR (
    organization_id = public.get_my_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'trainer'))
  )
);
