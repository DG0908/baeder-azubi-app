# Verbesserungs-Roadmap — Bäder-Azubi-App

> Gemeinsames Tracking für Claude, Codex und Qwen.  
> Abzeichnen mit: `[x]` + Kürzel + Datum — z.B. `[x] Claude 11.04.2026`  
> Ziel: App marktreif für alle FaBB-Azubis in Deutschland.

---

## 🔴 Priorität 1 — Sicherheit (kritisch)

| # | Maßnahme | Status | Erledigt von |
|---|---|---|---|
| 1 | CSRF-Schutz für `/api/auth/refresh` (X-Requested-With Header) | ✅ Erledigt | Claude · 11.04.2026 |
| 2 | `UpdateDuelStateDto` mit striktem Schema validieren | ✅ Erledigt | Claude · 11.04.2026 |
| 3 | RolesGuard Default-Deny Audit (Endpoints ohne `@Roles()` prüfen) | ✅ Erledigt | Claude · 11.04.2026 |
| 4 | Forum Rate-Limiting (Posts & Replies) | ✅ Erledigt | Claude · 11.04.2026 |

---

## 🟠 Priorität 2 — Frontend-Architektur

| # | Maßnahme | Status | Erledigt von |
|---|---|---|---|
| 5 | App.jsx aufteilen — Feature-Module mit eigenem Context | ⬜ Offen | — |
| 6 | React Query (`@tanstack/react-query`) einführen | ⬜ Offen | — |
| 7 | React Router nachrüsten (Deep-Linking, Back-Button, Bookmarks) | ⬜ Offen | — |
| 8 | Prop-Drilling eliminieren durch Context/Compound Components | ⬜ Offen | — |

---

## 🟡 Priorität 3 — Qualität & Wartbarkeit

| # | Maßnahme | Status | Erledigt von |
|---|---|---|---|
| 9  | API-Versionierung (`/api/v1/`) einführen | ⬜ Offen | — |
| 10 | Pagination überall — cursor-basiert | ⬜ Offen | — |
| 11 | Passwort-Komplexitätsprüfung (+ optional HaveIBeenPwned) | ⬜ Offen | — |
| 12 | Toter Code entfernen (`saveGameToSupabase`, `DEMO_ACCOUNTS`, Backup-Dateien) | ✅ Erledigt | Claude · 11.04.2026 |
| 13 | Exception Filter — keine internen Pfade in Fehlerantworten | ✅ Erledigt | Claude · 11.04.2026 |
| 14 | TypeScript für das gesamte Frontend | ⬜ Offen | — |

---

## 🟢 Priorität 4 — Nice-to-Have / Optional

| # | Maßnahme | Status | Erledigt von |
|---|---|---|---|
| 15 | Duel-Rundenerzeugung komplett server-autoritativ | ⬜ Offen | — |
| 16 | Badge-Historie prüfen & ggf. migrieren (Supabase-Rückstand?) | ⬜ Offen | — |
| 17 | Automatisierte Tests — Auth, Approval, Chat, Duels | ⬜ Offen | — |
| 18 | CI/CD Pipeline mit Approval Gates | ⬜ Offen | — |
| 19 | Restore-Drill dokumentieren und durchführen | ⬜ Offen | — |
| 20 | SSRF-Validierung bei Content-URLs (Internal-IP-Blockliste) | ⬜ Offen | — |

---

## 📊 Fortschritt

| Priorität | Erledigt | Gesamt |
|---|---|---|
| P1 — Kritisch | 4 / 4 | ✅ 100 % |
| P2 — Frontend | 0 / 4 | 🔴 0 % |
| P3 — Qualität | 3 / 6 | 🟨 50 % |
| P4 — Optional | 0 / 6 | 🔴 0 % |
| **Gesamt** | **7 / 20** | **35 %** |

---

## 📝 Changelog

### 11.04.2026 — Claude
- **#1** CSRF: `X-Requested-With` Header-Check auf `POST /api/auth/refresh` + Frontend-Gegenstück
- **#2** `UpdateDuelStateDto`: `GameStateDto` mit `@ValidateNested` — nur bekannte Top-Level-Keys erlaubt (`currentTurn`, `categoryRound`, `status`, `difficulty`, `categoryRounds`, `challengeTimeoutMinutes`), alle mit strengen Typen und Grenzen
- **#3** RolesGuard-Audit: `PUT /api/app-config` → `@Roles(ADMIN)`, `POST /api/notifications/push/test` → `@Roles(ADMIN, AUSBILDER)` auf Controller-Ebene hinzugefügt; alle anderen fehlenden `@Roles()` sind absichtlich (User-scoped-Zugriff auf eigene Daten)
- **#4** Forum: Rate-Limit 5 Posts / 15 Replies pro 10 Minuten pro User
- **#12** Toter Code: `DEMO_ACCOUNTS`-Import entfernt, `quizQuestions.js.backup` gelöscht, 3 Supabase-Fehlermeldungen bereinigt
- **#13** Exception Filter: `request.url` aus Fehlerantworten entfernt

---

*Kürzel: Claude = Claude Sonnet (Anthropic) · Codex = OpenAI Codex · Qwen = Qwen (Alibaba)*
