# Repo Status

Stand: 2026-03-22 (Update: Abend)

## Zweck

Diese Datei ist die kurze Uebergabe fuer laufende Arbeit im Repository.

Sie soll nach groesseren Sessions aktualisiert werden und festhalten:

- woran wir gerade arbeiten
- was bereits erledigt wurde
- was als naechstes ansteht
- welche offenen Risiken oder Annahmen es gibt

## Aktueller Fokus

- NestJS-Backend ist live auf `https://api.smartbaden.de`
- Frontend-Migration Phase 3: App.jsx schrittweise auf `secureApi.js` umstellen
- Neue Data-Service-Schicht (`src/lib/dataService.js`) abstrahiert Supabase/NestJS-Zugriff

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

- `server/` enthaelt das NestJS-Backend mit Auth, RBAC und vielen Fachmodulen.
- `src/context/AuthContext.jsx` hat Dual-Mode (Supabase + NestJS) — Login/Logout/Session
- `src/lib/dataService.js` (NEU) — abstrahiert alle Datenzugriffe hinter einheitlicher API
- `src/App.jsx` — Kern-Funktionen migriert auf Dual-Mode:
  - loadData, loadLightData (komplettes Daten-Laden)
  - loadNotifications, sendNotification, markNotificationAsRead, clearAllNotifications
  - getUserStatsFromSupabase, saveUserStatsToSupabase
  - approveUser, deleteUser, changeUserRole
  - saveTheoryExamAttempt, loadTheoryExamHistory, deletePracticalExamAttempt
  - saveAppConfig, autoForfeitGame
- `src/App.jsx` — NOCH NICHT migriert (~70 Supabase-Refs):
  - Quiz-Spiel-Funktionen (challengePlayer, acceptChallenge, saveGameToSupabase, etc.)
  - Berichtsheft-Funktionen (loadBerichtsheftEntries, saveBerichtsheft, etc.)
  - Kontrollkarten + Klausurnoten (loadSchoolAttendance, loadExamGrades, etc.)
  - Schwimm-Funktionen (loadSwimSessions, saveSwimSession, etc.)
  - Chat-Nachricht senden (sendMessage)
  - toggleSchoolCardPermission, toggleSignReportsPermission, toggleExamGradesPermission
- 5 extrahierte Views haben eigene Supabase-Imports: AdminView, CollectionView, FlashcardsView, ForumView, ProfileView
- `server/src/modules/users/` — DELETE-Endpoint fuer User-Soft-Delete (NEU)

## Naechster konkreter Schritt

Phase 3 fortsetzen — verbleibende Supabase-Aufrufe in App.jsx migrieren:

1. Quiz-Spiel-Funktionen (challengePlayer, acceptChallenge, saveGameToSupabase, finishGame)
2. Berichtsheft-Funktionen (laden, speichern, Signatur, Entwuerfe)
3. Kontrollkarten + Klausurnoten
4. Schwimm-Funktionen
5. Chat-Nachricht senden (sendMessage)
6. 5 extrahierte Views auf Dual-Mode umstellen

## Offene Risiken

- ~70 Supabase-Referenzen in App.jsx noch nicht hinter Dual-Mode-Guard.
- 5 extrahierte Views (AdminView, CollectionView, FlashcardsView, ForumView, ProfileView) nutzen Supabase direkt.
- Traefik-Routing nutzt feste Container-IP — Restart-Script (`scripts/update-traefik.sh`) behebt das.
- SMTP noch nicht konfiguriert — Passwort-Reset-Mails funktionieren noch nicht.
- Push-Subscriptions in Supabase-DB, Push-Versand ueber Legacy-Backend (`push.smartbaden.de`).
- Daten-Migration (Supabase → NestJS-DB) steht noch aus (Phase 2).

## Arbeitsregel

Nach jeder groesseren Aenderung diese Datei kurz aktualisieren:

- Datum
- aktueller Fokus
- erledigt
- naechster Schritt
- offene Blocker
