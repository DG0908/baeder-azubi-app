# Repo Status

Stand: 2026-03-31

## Zweck

Diese Datei ist die kurze Uebergabe fuer laufende Arbeit im Repository.

Sie soll nach groesseren Sessions aktualisiert werden und festhalten:

- woran wir gerade arbeiten
- was bereits erledigt wurde
- was als naechstes ansteht
- welche offenen Risiken oder Annahmen es gibt

## Aktueller Fokus

- NestJS-Backend ist live auf `https://api.smartbaden.de`
- Frontend-Adapter-Migration ist im Code abgeschlossen; praktischer Kernflow-Test ist jetzt der Engpass
- praktische Smoke-Tests fuer Auth, Profil, Admin, Duel-Ergebnis und Berichtsheft jetzt real fahren
- Quizduell-Ergebnisanzeige, Home-Duel-Statistik und Duel-Haertung gegen triviale Manipulationen praktisch gegen den Live-Stand pruefen
- Datenschutz-/Go-Live-Doku auf den echten Systemstand ziehen, ohne bestehende Luecken zu beschoenigen
- neuen Secure-Datenexport praktisch pruefen und danach die restlichen Betreiber-/Datenschutzprozesse schliessen

## Was bereits vorliegt

- Sicherheits- und Projektplanung in `docs/implementation-roadmap.md`
- konkreter Migrationsplan in `docs/supabase-to-nestjs-migration-plan.md`
- Security-Audit in `docs/security-audit.md`
- Betriebs- und Go-Live-Dokumente in `docs/operations-runbook.md` und `docs/production-go-live-checklist.md`
- vollstaendiges NestJS-Backend in `server/`
- CSP-Header in `index.html`
- Production-Guards fuer `console.log` in `AuthContext.jsx` und `App.jsx`
- RLS-Hardening auf dem alten Supabase-Pfad fuer sensible Tabellen
- NestJS-Backend auf dem VPS deployed
- PostgreSQL fuer NestJS eingerichtet
- Traefik-Routing und TLS fuer `api.smartbaden.de`
- Web-Push grundsaetzlich funktionsfaehig
- Migrationsskript `scripts/migrate-supabase-to-nestjs.sh`

## Tatsaechlicher Code-Stand dieses Branches

- `src/supabase.js` ist build-stabiler und erzeugt ohne Credentials keinen erzwungenen Client mehr.
- `src/lib/dataService.js` ist jetzt auch fuer Auth-, Session-, Register-, Login-, Logout- und Passwort-Reset-Flows die gemeinsame Dual-Mode-Schicht.
- `src/context/AuthContext.jsx` spricht fuer Session-Restore, Register, Login und Logout nur noch den Adapter und raeumt lokale Session-/Profilreste konsistenter auf.
- `src/components/auth/LoginScreen.jsx` spricht fuer Einladungscode-Vorschau und Passwort-Reset nur noch den Adapter und kennt keine direkten `supabase.auth`- oder `secureAuthApi`-Aufrufe mehr.
- `src/components/auth/LoginScreen.jsx` nutzt fuer Login, Registrierung und Passwort-Reset jetzt echte HTML-Formulare statt Tastatur-Workarounds; die Reset-Hinweise nennen keinen Supabase-Sender mehr.
- `src/components/auth/LoginScreen.jsx` setzt fuer Login-, Register- und Reset-Felder jetzt passende `name`-/`autocomplete`-Attribute, damit Browser-Autofill sauber arbeitet und keine Passwort-Warnungen wirft.
- `index.html` nutzt das aktuelle `mobile-web-app-capable`-Meta-Tag statt des veralteten Apple-Pendants.
- `index.html` erlaubt in der Produktions-CSP kein `vercel.live` mehr; damit ist das Vercel-Toolbar-Overlay nicht mehr Teil des regulären Live-CSP-Surfaces.
- `src/components/views/ProfileView.jsx` verlangt im Secure-Modus jetzt das aktuelle Passwort fuer Passwortwechsel.
- `src/components/legal/LegalContent.jsx` ist die gemeinsame Quelle fuer Impressum und Datenschutztexte; Login- und Profilpfade verwenden jetzt dieselbe Textbasis.
- `src/App.jsx` spricht fuer die produktiven Kernpfade nur noch ueber `dataService.js`, inklusive:
  - Staff-Direct-Chat
  - User-Badges
  - Berichtsheft-Profil und Berichtsheft-Drafts
  - Retention-Check und Datenexport
  - Duel-Erstellung/-State, Chat-Senden, Fragen einreichen/freigeben, Berechtigungs-Toggles
- ausserhalb von `src/lib/dataService.js`, `src/lib/secureApi.js` und `src/lib/pushNotifications.js` finde ich im Frontend aktuell keine direkten `supabase.from(...)`, `supabase.auth...` oder `secure*Api`-Zugriffe mehr.
- `src/components/views/AdminView.jsx` nutzt im Secure-Modus fuer die Betriebszuweisung jetzt den richtigen Organization-Endpoint; die Code-Nutzungsanzeige ist wieder konsistent.
- `server/src/modules/auth/auth.service.ts` unterstuetzt bcrypt-Fallback fuer migrierte Supabase-Passwoerter und rehashed bei erfolgreichem Login auf Argon2.
- `docs/manual-smoke-test-checklist.md` beschreibt jetzt den praktischen Testlauf fuer die kritischen Kernflows.
- `scripts/run-smoke-checks.mjs` und `npm run smoke:api` decken jetzt Frontend-Shell, API-Health, Login, `auth/me`, Refresh und `users/me/export` fuer konfigurierte Testkonten ab.
- `scripts/run-smoke-checks.mjs` deckt jetzt zusaetzlich read-only Kernpfade je Rolle ab: `users/me`, `notifications`, `duels`, `duels/leaderboard`, `user-stats/me`, `report-books/profile`; fuer Admins ausserdem `users` und `users/pending`.
- der Basis-Schnellcheck gegen `https://azubi.smartbaden.de/` und `https://api.smartbaden.de/api/health` lief am 31.03.2026 grün; die Rollenchecks sind nur noch von echten Testkonten abhaengig.
- `server/src/common/services/mailer.service.ts` schreibt ohne SMTP keine Passwort-Reset-Links mehr in Logs; stattdessen scheitert der Reset-Pfad jetzt explizit mit `ServiceUnavailable`.
- `server/src/modules/users/users.controller.ts` und `server/src/modules/users/users.service.ts` stellen jetzt einen Secure-Backend-Export fuer `me` und Admin-Exports bereit.
- `src/lib/secureApi.js`, `src/lib/dataService.js`, `src/App.jsx` und `src/components/views/AdminView.jsx` ziehen den Admin-Datenexport jetzt ueber den Secure-API-Pfad statt ueber den Legacy-Supabase-Read.
- `docs/privacy-rights-runbook.md` dokumentiert jetzt den operativen Mindestprozess fuer Berichtigung, Loeschung und den neuen Exportpfad inklusive verbleibender Restluecken.
- `server/src/modules/duels/duels.service.ts` leakt bei aktiven Duellen die richtige Antwort nicht mehr, normalisiert Duel-State serverseitig und blockiert mehrere triviale Cheat-/Manipulationspfade.
- `server/src/modules/duels/duels.service.ts` bewertet jetzt auch Keyword-/WhoAmI-Antworten serverseitig neu; `correct` und `points` aus dem Client zaehlen dafuer nicht mehr.
- `src/App.jsx` stabilisiert den Duel-Ergebnis-Screen ueber fertige Spielstaende und synchronisiert Siege/Remis/Niederlagen fuer Home-/Profil-Statistiken aus den tatsaechlich beendeten Duellen.
- `src/components/views/HomeView.jsx` zeigt auf der Startseite wieder eine konsistente Duel-Zusammenfassung mit `Siege`, `Remis` und `Niederl.`.

## Noch nicht fertig

- praktische Smoke-Tests fuer die kritischen Auth-/Kernflows fehlen noch
- die erweiterte API-Smoke-Hilfe braucht noch echte Testkonten per Env, bevor die Rollenchecks praktisch grün sein koennen
- rechtliche und betriebliche Go-Live-Nachweise sind weiter offen
- automatisierte Tests fuer Auth, Approval, Chat-Scope und Duel-Abschluss fehlen weiterhin
- der neue Secure-Datenexport ist noch nicht praktisch im Zielbetrieb getestet
- Quizduell ist trotz Hardening noch nicht vollstaendig server-autoritativ; Fragen-/Antwortfluss wird weiter teils clientseitig synchronisiert
- die Kategorien-/Fragenwahl eines neuen Duel-Rounds kommt weiter aus dem Client; damit bleibt dort noch ein Manipulationsrest, bis die Rundenerzeugung server-autoritativ ist

## Naechster konkreter Schritt

1. aktuellen Frontend-Stand auf dem Zielserver deployen
2. API-Schnellcheck mit echten Testkonten grün fahren
3. kritische Flows praktisch testen:
   - Registrierung
   - Login
   - Passwort-Reset
   - Kontoloeschung
   - Admin-Loeschung
   - Admin-Datenexport
   - Duel-Ergebnis-Screen
   - Berichtsheft-Drafts
4. anschliessend Betreiber-/Datenschutzblock schliessen:
   - Aufbewahrungs-, Purge- und Backup-Regeln je Instanz
   - Betreiberfreigabe fuer Auskunfts-/Loeschprozess
5. danach Go-Live-Block:
   - AVV / TOM / Incident-Runbook
   - Restore-Drill
   - formale Loesch-/Auskunftsprozesse
   - Preisblatt / Vertrag / SLA

## Offene Risiken

- kritische Kernflows sind build-gruen, aber noch nicht praktisch fuer diesen Adapter-Stand durchgetestet
- SMTP noch nicht produktiv konfiguriert, Passwort-Reset-Mailfluss daher weiter fraglich
- Push-Subscriptions und Push-Auslieferung muessen im echten Zielbetrieb weiter praktisch verifiziert werden
- Datenmigration Supabase -> NestJS-DB ist noch nicht praktisch abgeschlossen
- Badge-Historie haengt noch an der alten `user_badges`-Tabelle und ist im neuen Secure-Export aktuell bewusst leer
- Restore-Drill, formale Loesch-/Auskunftsprozesse und externer Security-Nachweis sind weiter offen
- Quizduell ist gegen triviale Client-Manipulationen deutlich gehaertet, aber noch nicht auf einem voll server-autoritativem Modell
- insbesondere neue Duel-Runden vertrauen noch auf clientgelieferte Fragen; das naechste P1-Thema bleibt daher serverseitige Rundenerzeugung statt reinem Client-Sync

## Arbeitsregel

Nach jeder groesseren Aenderung diese Datei kurz aktualisieren:

- Datum
- aktueller Fokus
- erledigt
- naechster Schritt
- offene Blocker
