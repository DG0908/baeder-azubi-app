-- =====================================================
-- MIGRATION: Geburtsdatum für Handicap-Berechnung
-- =====================================================
-- Führe dieses Skript im Supabase Dashboard → SQL Editor aus

-- Spalte birth_date zur profiles Tabelle hinzufügen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Optional: Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS profiles_birth_date_idx ON profiles(birth_date);

-- Trigger-Funktion aktualisieren (für neue Registrierungen)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, training_end, approved, birth_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unbekannt'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'azubi'),
    (NEW.raw_user_meta_data->>'training_end')::DATE,
    false,
    (NEW.raw_user_meta_data->>'birth_date')::DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FERTIG! Das Geburtsdatum kann jetzt im Profil gespeichert werden.
-- =====================================================
