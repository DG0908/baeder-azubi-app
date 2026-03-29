# Repo Status

Stand: 2026-03-29

## Zweck

Diese Datei ist die kurze Uebergabe fuer laufende Arbeit im Repository.

Sie soll nach groesseren Sessions aktualisiert werden und festhalten:

- woran wir gerade arbeiten
- was bereits erledigt wurde
- was als naechstes ansteht
- welche offenen Risiken oder Annahmen es gibt

## Aktueller Fokus

- NestJS-Backend ist live auf `https://api.smartbaden.de`
- letzte produktiv kritische Legacy-Fallbacks im Frontend entfernen
- `src/App.jsx` weiter von direkten Supabase-Pfaden auf `secureApi.js` und `dataService.js` ziehen
- rechtliche Texte, Datenschutz-Hinweise und Auth-Flows an den echten Systemstand angleichen

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

- `src/supabase.js` ist jetzt build-stabiler und erzeugt ohne Credentials keinen erzwungenen Client mehr.
- `src/context/AuthContext.jsx` hat Dual-Mode fuer Login, Logout und Session-Pruefung.
- `src/context/AuthContext.jsx` nutzt im Secure-Modus jetzt auch die Backend-Registrierung statt direktem Supabase-Sign-up.
- `src/lib/dataService.js` ist die neue Adapter-Schicht fuer Supabase oder NestJS.
- `src/components/auth/LoginScreen.jsx` validiert Einladungscodes im Secure-Modus nicht mehr direkt gegen Supabase und nutzt den korrekten `password_reset_token` fuer Backend-Reset-Links.
- `src/components/views/ProfileView.jsx` verlangt im Secure-Modus jetzt das aktuelle Passwort fuer Passwortwechsel.
- `src/components/legal/LegalContent.jsx` ist die gemeinsame Quelle fuer Impressum und Datenschutztexte; Login- und Profilpfade verwenden jetzt dieselbe Textbasis.
- `src/App.jsx` nutzt bereits Dual-Mode fuer mehrere Kernpfade:
  - Daten laden
  - Notifications
  - UserStats-Schreibpfade
  - AppConfig
  - Teile der Exam-Historie
  - Duel-Erstellung und Duel-State-Speicherung
  - Chat-Nachricht senden
  - Fragen einreichen/freigeben
  - Berechtigungs-Toggles
  - Berichtsheft-Remote-Drafts
  - Retention-Loeschpfad fuer Nutzer
- `src/lib/dataService.js` kapselt jetzt auch die letzten produktiven Schreibpfade aus `src/App.jsx`, sodass dort keine direkten `supabase.from(...).insert/update/delete/upsert`-Aufrufe mehr uebrig sind.
- `src/components/views/AdminView.jsx` nutzt im Secure-Modus fuer die Betriebszuweisung jetzt den richtigen Organization-Endpoint; die Code-Nutzungsanzeige ist wieder konsistent.
- Letzter Commit `0035c51` korrigiert das Duel-/Quiz-Mapping fuer die NestJS-API.
- `server/src/modules/auth/auth.service.ts` unterstuetzt bcrypt-Fallback fuer migrierte Supabase-Passwoerter und rehashed bei erfolgreichem Login auf Argon2.

## Noch nicht fertig migriert

- in `src/App.jsx` weiterhin viele direkte oder Supabase-nahe Pfade, vor allem:
  - Quiz-Spiel-Funktionen
  - einzelne Berichtsheft-Lese-/Fallback-Pfade
  - Kontrollkarten und Klausurnoten
  - Schwimm-Funktionen
- weiterhin eigene Supabase-Imports in:
  - `src/components/views/AdminView.jsx`
  - `src/components/views/CollectionView.jsx`
  - `src/components/views/FlashcardsView.jsx`
  - `src/components/views/ForumView.jsx`
  - `src/components/views/ProfileView.jsx` (Legacy-Fallback noch vorhanden)

## Naechster konkreter Schritt

Phase 3 fortsetzen:

1. Quiz-Spiel-Funktionen in `src/App.jsx` fertig migrieren
2. restliche Berichtsheft-Lese-/Review-Pfade migrieren
3. Kontrollkarten und Klausurnoten migrieren
4. Schwimm-Funktionen migrieren
5. Legacy-Imports in Einzelviews weiter abbauen
6. rechtliche Texte spaeter konfigurierbar pro Betreiber/Instanz machen

## Offene Risiken

- viele Supabase-Referenzen im Frontend noch nicht hinter sauberem Dual-Mode
- SMTP noch nicht produktiv konfiguriert, Passwort-Reset-Mailfluss daher noch fraglich
- Push-Subscriptions und Push-Auslieferung laut letzter Handoff noch teils am Legacy-Pfad
- Datenmigration Supabase -> NestJS-DB ist noch nicht praktisch abgeschlossen
- Restore-Drill, formale Loesch-/Auskunftsprozesse und externer Security-Nachweis sind weiter offen
- `server/scripts/reset-marcel-pw.js` ist ein temporaeres Hilfsskript mit festem Passwort und echter E-Mail-Adresse und sollte vor Produktion entfernt oder ersetzt werden

## Arbeitsregel

Nach jeder groesseren Aenderung diese Datei kurz aktualisieren:

- Datum
- aktueller Fokus
- erledigt
- naechster Schritt
- offene Blocker
