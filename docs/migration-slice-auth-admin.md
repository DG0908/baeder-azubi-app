# Migrationsschnitt 1: Auth, Admin, Einladungen

## Ziel

Der erste sichere Migrationsschnitt stellt nicht die ganze App um, sondern schafft den verbindlichen API-Pfad fuer:

- Registrierung
- Login/Session
- Benutzerliste und Freigaben
- Rollenwechsel
- Organisationszuordnung
- Einladungen
- Organisationsverwaltung

## Technischer Stand

- Backend-Endpunkte existieren unter `server/src/modules/auth`
- Backend-Endpunkte existieren unter `server/src/modules/users`
- Backend-Endpunkte existieren unter `server/src/modules/invitations`
- Organisationsendpunkte wurden unter `server/src/modules/organizations` ergänzt
- Frontend-API-Client liegt unter `src/lib/secureApiClient.js`
- Frontend-API-Funktionen liegen unter `src/lib/secureApi.js`

## Wichtigste Abhaengigkeit

Die Alt-App nutzt fuer viele Lesevorgaenge noch eine authentifizierte Supabase-Session. Deshalb darf der Runtime-Login nicht blind auf Backend-Auth umgestellt werden, solange diese Lesepfade noch nicht migriert sind.

## Aktivierungsstrategie

1. Sicheren API-Client und Backend-Endpunkte bereitstellen
2. Restliche Lesepfade identifizieren, die noch eine Supabase-Session voraussetzen
3. Diese Lesepfade auf `/api` migrieren
4. Erst danach Backend-Auth im Frontend aktiv schalten

## No-Go

- Kein produktiver Mischbetrieb mit halber Backend-Auth und halber impliziter Supabase-Autorisierung
- Keine Sonder-Bypass-Loesungen mit statischen API-Schluesseln fuer Admin-Aktionen
- Keine Rueckkehr zu Browser-Schreibzugriffen auf Profil-, Rollen- oder Einladungstabellen
