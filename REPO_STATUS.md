# Repo Status

Stand: 2026-03-30

## Zweck

Diese Datei ist die kurze Uebergabe fuer laufende Arbeit im Repository.

Sie soll nach groesseren Sessions aktualisiert werden und festhalten:

- woran wir gerade arbeiten
- was bereits erledigt wurde
- was als naechstes ansteht
- welche offenen Risiken oder Annahmen es gibt

## Aktueller Fokus

- NestJS-Backend ist live auf `https://api.smartbaden.de`
- Frontend-Adapter-Migration ist im Code abgeschlossen; Live-Deploy und Kernflow-Tests stehen an
- praktische Smoke-Tests fuer Auth, Profil, Admin, Duel-Ergebnis und Berichtsheft jetzt real fahren
- Datenschutz-/Go-Live-Doku auf den echten Systemstand ziehen, ohne bestehende Luecken zu beschoenigen
- offenen Datenexport-/Betroffenenrechte-Prozess fuer marktreifen Betrieb sauber schliessen

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
- `docs/privacy-rights-runbook.md` dokumentiert den aktuellen operativen Mindestprozess fuer Berichtigung, Loeschung und die noch offene Export-Luecke.

## Noch nicht fertig

- praktische Smoke-Tests fuer die kritischen Auth-/Kernflows fehlen noch
- Frontend-Deploy des aktuellen `main`-Stands auf dem Zielserver ist noch offen
- rechtliche und betriebliche Go-Live-Nachweise sind weiter offen
- automatisierte Tests fuer Auth, Approval, Chat-Scope und Duel-Abschluss fehlen weiterhin
- der Auskunfts-/Datenexport ist noch kein final freigegebener Secure-Backend-Prozess

## Naechster konkreter Schritt

1. aktuellen Frontend-Stand auf dem Zielserver deployen
2. kritische Flows praktisch testen:
   - Registrierung
   - Login
   - Passwort-Reset
   - Kontoloeschung
   - Admin-Loeschung
   - Duel-Ergebnis-Screen
   - Berichtsheft-Drafts
3. anschliessend Export-/Betroffenenrechte-Luecke schliessen:
   - Secure-Backend-Export oder schriftlich freigegebenes Operator-Verfahren
   - Aufbewahrungs-, Purge- und Backup-Regeln je Instanz
4. danach Go-Live-Block:
   - AVV / TOM / Incident-Runbook
   - Restore-Drill
   - formale Loesch-/Auskunftsprozesse
   - Preisblatt / Vertrag / SLA

## Offene Risiken

- kritische Kernflows sind build-gruen, aber noch nicht praktisch fuer diesen Adapter-Stand durchgetestet
- SMTP noch nicht produktiv konfiguriert, Passwort-Reset-Mailfluss daher weiter fraglich
- Push-Subscriptions und Push-Auslieferung muessen im echten Zielbetrieb weiter praktisch verifiziert werden
- Datenmigration Supabase -> NestJS-DB ist noch nicht praktisch abgeschlossen
- der Admin-Datenexport nutzt aktuell noch einen Legacy-Supabase-Lesepfad in `src/lib/dataService.js` und ist damit kein finaler Secure-Go-Live-Nachweis
- Restore-Drill, formale Loesch-/Auskunftsprozesse und externer Security-Nachweis sind weiter offen
- `server/scripts/reset-marcel-pw.js` ist ein temporaeres Hilfsskript mit festem Passwort und echter E-Mail-Adresse und sollte vor Produktion entfernt oder ersetzt werden

## Arbeitsregel

Nach jeder groesseren Aenderung diese Datei kurz aktualisieren:

- Datum
- aktueller Fokus
- erledigt
- naechster Schritt
- offene Blocker
