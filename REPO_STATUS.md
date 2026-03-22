# Repo Status

Stand: 2026-03-22 (Update: Nacht)

## Zweck

Diese Datei ist die kurze Uebergabe fuer laufende Arbeit im Repository.

Sie soll nach groesseren Sessions aktualisiert werden und festhalten:

- woran wir gerade arbeiten
- was bereits erledigt wurde
- was als naechstes ansteht
- welche offenen Risiken oder Annahmen es gibt

## Aktueller Fokus

- NestJS-Backend ist live auf `https://api.smartbaden.de`
- Frontend-Migration von Supabase-Direktzugriff auf NestJS-API (Phase 0+)
- Build-stabiler Dual-Mode ueber `VITE_ENABLE_SECURE_BACKEND_API`

## Was bereits vorliegt

- Sicherheits- und Projektplanung in `docs/implementation-roadmap.md`
- konkreter Migrationsplan in `docs/supabase-to-nestjs-migration-plan.md`
- Security-Audit in `docs/security-audit.md`
- Betriebs- und Go-Live-Dokumente in `docs/operations-runbook.md` und `docs/production-go-live-checklist.md`
- vollstaendiges NestJS-Backend in `server/`
- CSP-Header in `index.html` (Content-Security-Policy)
- console.log-Guards fuer Production in `AuthContext.jsx` und `App.jsx`
- RLS-Policies auf VPS fuer `push_subscriptions` und `question_reports` eingerichtet
- RLS-Hardening fuer Game-Scores (games, game_answers, user_stats) auf VPS ausgefuehrt
- NestJS-Backend deployed auf VPS: `docker compose up -d postgres server`
- Prisma-Schema synchronisiert mit neuer PostgreSQL-DB (`azubi_app`)
- Traefik-Routing konfiguriert: `api.smartbaden.de` → NestJS (Port 3000)
- SSL-Zertifikat via Let's Encrypt aktiv
- DNS A-Record `api.smartbaden.de` → VPS-IP angelegt
- VAPID-Keys fuer Web-Push konfiguriert (VPS `.env` + Vercel Env-Vars)
- Push-Notifications funktionieren (Subscription, Versand, Empfang auf Android/PC)
- `WEB_PUSH_*` Env-Vars in `docker-compose.yml` an NestJS-Server durchgereicht
- CSP-Header um Vercel-Live-Widget erweitert

## Tatsaechlicher Code-Stand dieses Branches

- `server/` enthaelt bereits das neue NestJS-Backend mit Auth, RBAC und vielen Fachmodulen.
- Das Frontend ist aktuell noch nicht auf dem Zielzustand.
- `src/supabase.js` verwendet noch harte Fallback-Werte fuer Supabase.
- `src/context/AuthContext.jsx` nutzt aktuell noch Supabase Auth direkt.
- `src/App.jsx` und mehrere Views greifen weiterhin direkt auf Supabase zu.
- `src/lib/secureApi.js` und `src/lib/secureApiClient.js` liegen bereits als Grundlage fuer den sicheren API-Pfad vor.

## Naechster konkreter Schritt

Phase 0 aus `docs/supabase-to-nestjs-migration-plan.md`:

1. `src/supabase.js` auf sicheren Bootstrap ohne harte Fallback-Secrets umbauen (Dual-Mode TDZ-Fix)
2. `src/context/AuthContext.jsx` fuer Dual-Mode vorbereiten
3. Frontend schrittweise auf `secureApi.js` umstellen
4. Traefik-Restart-Script stabilisieren (IP-Zuweisung nach Container-Neustart)

## Offene Risiken

- Der aktuelle Frontend-Branch ist noch stark Supabase-abhaengig.
- Der fruehere Migrationscommit `df7bd38` ist nur Referenz, kein sicherer Blind-Merge.
- Traefik-Routing nutzt feste Container-IP (10.0.1.9) — aendert sich bei Container-Neustart.
  Ein Restart-Script (`scripts/update-traefik.sh`) auf dem VPS behebt das automatisch.
- Rate Limiting erst mit NestJS-Backend moeglich (Throttler-Modul vorhanden).
- SMTP noch nicht konfiguriert (leere Env-Vars) — Passwort-Reset-Mails etc. funktionieren noch nicht.
- Push-Subscriptions werden aktuell in der Supabase-DB gespeichert, nicht in der NestJS-DB.
- Push-Versand laeuft ueber den Legacy-Backend (`push.smartbaden.de`), nicht ueber NestJS.

## Arbeitsregel

Nach jeder groesseren Aenderung diese Datei kurz aktualisieren:

- Datum
- aktueller Fokus
- erledigt
- naechster Schritt
- offene Blocker
