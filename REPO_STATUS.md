# Repo Status

Stand: 2026-03-20 (Update: Nacht)

## Zweck

Diese Datei ist die kurze Uebergabe fuer laufende Arbeit im Repository.

Sie soll nach groesseren Sessions aktualisiert werden und festhalten:

- woran wir gerade arbeiten
- was bereits erledigt wurde
- was als naechstes ansteht
- welche offenen Risiken oder Annahmen es gibt

## Aktueller Fokus

- sichere Migration von direktem Supabase-Frontendzugriff auf das NestJS-Backend in `server/`
- Build-stabiler Dual-Mode ueber `VITE_ENABLE_SECURE_BACKEND_API`
- Vorbereitung der spaeteren Datenmigration von Supabase nach PostgreSQL/Prisma

## Was bereits vorliegt

- Sicherheits- und Projektplanung in `docs/implementation-roadmap.md`
- konkreter Migrationsplan in `docs/supabase-to-nestjs-migration-plan.md`
- Security-Audit in `docs/security-audit.md`
- Betriebs- und Go-Live-Dokumente in `docs/operations-runbook.md` und `docs/production-go-live-checklist.md`
- vollstaendiges NestJS-Backend in `server/`
- CSP-Header in `index.html` (Content-Security-Policy)
- console.log-Guards fuer Production in `AuthContext.jsx` und `App.jsx`
- RLS-Policies auf VPS fuer `push_subscriptions` und `question_reports` eingerichtet

## Tatsaechlicher Code-Stand dieses Branches

- `server/` enthaelt bereits das neue NestJS-Backend mit Auth, RBAC und vielen Fachmodulen.
- Das Frontend ist aktuell noch nicht auf dem Zielzustand.
- `src/supabase.js` verwendet noch harte Fallback-Werte fuer Supabase.
- `src/context/AuthContext.jsx` nutzt aktuell noch Supabase Auth direkt.
- `src/App.jsx` und mehrere Views greifen weiterhin direkt auf Supabase zu.
- `src/lib/secureApi.js` und `src/lib/secureApiClient.js` liegen bereits als Grundlage fuer den sicheren API-Pfad vor.

## Naechster konkreter Schritt

Phase 0 aus `docs/supabase-to-nestjs-migration-plan.md`:

1. `src/supabase.js` auf sicheren Bootstrap ohne harte Fallback-Secrets umbauen
2. `src/context/AuthContext.jsx` fuer Dual-Mode vorbereiten
3. Build pruefen mit:
   - `VITE_ENABLE_SECURE_BACKEND_API=true`
   - `VITE_SUPABASE_URL=""`
   - `VITE_SUPABASE_ANON_KEY=""`

## Offene Risiken

- Der aktuelle Frontend-Branch ist noch stark Supabase-abhaengig.
- Der fruehere Migrationscommit `df7bd38` ist nur Referenz, kein sicherer Blind-Merge.
- Backend-Deployment, Testdatenbank, echte Migrationen und produktive Betriebsnachweise sind noch offen.
- RLS-Hardening fuer Game-Scores (games, game_answers, user_stats) auf VPS noch ausstehend.
- Rate Limiting erst mit NestJS-Backend moeglich (Throttler-Modul vorhanden).

## Arbeitsregel

Nach jeder groesseren Aenderung diese Datei kurz aktualisieren:

- Datum
- aktueller Fokus
- erledigt
- naechster Schritt
- offene Blocker
