-- =====================================================
-- FIX: Registrierung & Profil-Erstellung reparieren
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus
-- =====================================================

-- SCHRITT 1: Trigger sicherstellen (erstellt Profil automatisch bei Registrierung)
-- =====================================================
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
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SCHRITT 2: RPC-Funktion für Profil-Erstellung (Fallback, umgeht RLS)
-- =====================================================
-- Diese Funktion kann auch OHNE aktive Session aufgerufen werden
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  user_role TEXT DEFAULT 'azubi',
  user_training_end DATE DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, training_end, approved)
  VALUES (user_id, user_name, user_email, user_role, user_training_end, false)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Anon-Rolle darf die Funktion aufrufen (für Registrierung ohne Session)
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;

-- SCHRITT 3: Bestehende Auth-User ohne Profil reparieren
-- =====================================================
INSERT INTO public.profiles (id, name, email, role, approved)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'Unbekannt'),
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'azubi'),
  false
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- SCHRITT 4: Optional - Email-Bestätigung deaktivieren
-- =====================================================
-- EMPFOHLEN: Gehe zu Supabase Dashboard:
-- → Authentication → Providers → Email
-- → Deaktiviere "Confirm email"
-- Das macht die Registrierung einfacher für Azubis.

-- =====================================================
-- FERTIG! Registrierung und Profil-Erstellung repariert.
-- =====================================================
