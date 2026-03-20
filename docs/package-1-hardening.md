# Paket 1 Status: Sofortmassnahmen

## Ziel

Akute Sicherheitsrisiken aus dem Legacy-Frontend stoppen, bis die Backend-Migration abgeschlossen ist.

## Umgesetzte technische Sperren

- `src/supabase.js`
  - Legacy-Schreibzugriffe aus dem Browser sind standardmaessig blockiert.
  - Betroffene Tabellen: Admin-, Profil-, Spiel-, Chat-, Frage-, Konfigurations- und Fortschrittsdaten.
  - Kritische RPCs fuer Registrierung/Profile werden im Browser ebenfalls blockiert.
- `src/context/AuthContext.jsx`
  - Registrierung aus dem Legacy-Frontend ist im Sicherheitsmodus deaktiviert.
- `src/components/auth/LoginScreen.jsx`
  - Registrierung wird als gesperrt dargestellt.
- `src/components/views/AdminView.jsx`
  - Betriebe, Einladungscodes, Zuordnungen und Ablehnungen werden im Sicherheitsmodus sichtbar blockiert.
- `src/App.jsx`
  - Clientseitige Datenaufbewahrungs- und Loeschlogik wurde deaktiviert.
  - Browserbasierte Admin-Freigaben, Rollenwechsel und Duell-Schreibvorgaenge werden im Sicherheitsmodus abgefangen.

## Betriebswirkung

- Die Legacy-Oberflaeche ist damit in kritischen Bereichen weitgehend read-only.
- Das ist beabsichtigt, bis die NestJS-API die produktiven Schreibvorgaenge uebernimmt.

## Offene manuelle Punkte

- Alle bereits verwendeten Secrets muessen ausserhalb des Repositories rotiert werden.
- Die noch offenen Frontend-Pfade muessen auf `/api` migriert werden.
- Vor Pilot oder Produktion ist ein Test der neuen API-Endpunkte erforderlich.
