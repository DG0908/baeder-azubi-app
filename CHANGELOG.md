# Changelog

Alle wesentlichen Änderungen an diesem Projekt sind hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

Versionen für Frontend (`package.json`) und Backend (`server/package.json`) werden
gemeinsam geführt. Der Tag kennzeichnet die Frontend-Version, der Abschnitt "Backend"
hält die Backend-Version fest, wenn sie sich geändert hat.

## [Unreleased]

### Added (Marktreife-Phase 3 + 4, April 2026)

- **Design-System-Grundlagen (P3.1):** Tailwind-Tokens `brand` (Teal), `accent` (Cyan),
  semantische Aliase `success`/`warning`/`danger`, `Inter`-Font, Token-Border-Radii.
- **Shared-UI-Primitives (P3.2):** `<Button>`, `<Card>`, `<Skeleton>`, `<Dialog>` in
  `src/components/ui/primitives/` auf Basis von Radix-UI.
- **Swagger/OpenAPI (P3.3):** UI unter `/api/docs`, nur in Entwicklung oder via
  `ENABLE_SWAGGER=true`.
- **Cursor-basierte Pagination (P3.4):** Chat-Messages und Forum-Posts.
  Rückwärtskompatibel — ohne `cursor`-Param liefert der Endpoint das gewohnte Array.
- **Passwort-Pwned-Check (P3.5):** zxcvbn-Stärke-Indikator + HaveIBeenPwned
  k-anonymity-Check bei Registrierung, Passwort-Änderung und Passwort-Reset.
- **a11y-Audit (P3.6):** axe-core in Vitest (Login, Quiz-Lobby) und Playwright-
  E2E-Smoke. Label/ID- und aria-label-Fixes in LoginScreen und QuizView.
- **OpenGraph + Twitter Cards (P4.3):** Vollständige Social-Preview-Meta in
  `index.html`.
- **Alt-Text-Audit (P4.4):** Alle `<img>` geprüft, Signatur-Bilder im
  Berichtsheft-PDF-Template ergänzt.
- **CONTRIBUTING.md + CHANGELOG.md (P4.2):** Setup, Commit-Konvention, Qualitäts-Gates.
- **Badge-Persistence (P4.8):** Neues `UserBadge`-Prisma-Model, Endpoints
  `GET /api/badges/me` und `POST /api/badges/grant`, Frontend-dataService an
  NestJS angeschlossen. Badges bleiben damit auch beim Device- oder Browser-Wechsel
  erhalten (seit dem 03.04.2026-Rollout gingen sie beim Logout verloren). DSGVO-
  Export liefert Badges jetzt unter `data.badges` mit echtem `earnedAt`, der
  `badgeExportStatus`-Workaround ist entfernt; `meta.exportVersion` → `3`.
- **Duel-Rundenerzeugung server-autoritativ (P4.5):** Neuer dedizierter Endpoint
  `POST /api/duels/:id/rounds` mit `{ categoryId }` generiert Fragen rein serverseitig
  (Whitelist `ALLOWED_DUEL_CATEGORY_IDS`, Chooser-Prüfung, `MAX_DUEL_CATEGORY_ROUNDS`,
  kein doppelter Kategorie-Wechsel). DTO-Härtung: `CategoryRoundDto` akzeptiert nur
  noch Metadata (`categoryId`, `categoryName`, `chooser`); `questions`, `player1Answers`,
  `player2Answers` sind aus `PATCH /state` entfernt. `PATCH /state` weist neue Runden
  jetzt hart zurück — Rundenstarts müssen über den neuen Endpoint laufen.
  Frontend (`useDuelGame.selectCategory`) ruft den neuen Endpoint; lokale
  `pickBattleQuestions`-Auswahl und `shuffleAnswers` sind im Duell-Pfad entfernt.

### Security

- **SSRF-Validator gehärtet (P4.6):** `@IsNoInternalIp` blockt zusätzlich `0.0.0.0/8`,
  CGNAT `100.64/10`, Hex-/Oktal-/Dezimal-IPv4-Obfuskation (`0x7f000001`, `2130706433`,
  `0177.0.0.1`), IPv6 `::` / `::ffff:…` / `fd00::/8` / `fe80::/10`, `.local`/`.internal`
  Suffixe, GCP/Azure-Metadata-Kurznamen. Push-Subscription-DTOs jetzt ebenfalls
  abgedeckt (defense in depth).

### Changed

- Backend-Test-Suite: 505 Tests, alle grün.
- Frontend-Test-Suite: 71 Vitest-Tests (inkl. 4 a11y + 11 Primitives), alle grün.

## [1.0.0] — 2026-04-03

### Added

- **Supabase → NestJS-Migration abgeschlossen.** Eigener Backend-Stack
  (NestJS + Prisma + PostgreSQL) ersetzt die direkten Browser→Supabase-Zugriffe.
- Produktiv-Deployment auf VPS Hostinger (Frankfurt) via Coolify.
- Audit-Log für sicherheitsrelevante Admin-Aktionen.
- Approval-basierte Registrierung, RBAC, HttpOnly-Refresh-Cookie.
- Chat-Sanitisierung server-seitig.
- Duel-Scoring vollständig server-autoritativ (Scoring, nicht Rundenerzeugung — siehe
  P4.5-Backlog).
- Server-seitige Duel-Expiry-Scheduler.
- PWA-Features: Service-Worker, Push-Benachrichtigungen, Offline-fähige Quiz-Modi.

### Removed

- Supabase- und Vercel-Abhängigkeiten.
- Legacy-Express-`/api/push`-Route.

### Security

- **Security Sprint 2:** persistenter Lockout, 2FA für Admins (TOTP),
  Duel-Fallback-Server-Logik, Smoke-Tests.
- CSP via Nginx enforced.
- Legacy Browser→DB-Writes standardmäßig blockiert
  (nur via `VITE_ENABLE_UNSAFE_LEGACY_DB_WRITES=true` explizit opt-in).

---

## Historische Meilensteine (vor Changelog)

Diese Liste dient nur der Orientierung — pre-1.0 wurde kein formales Changelog
geführt.

- **Phase 1 (Q4 2025):** Prototyp mit React + Supabase, interne Nutzung (~12 User).
- **Phase 2 (Q1 2026):** Security Sprint 1 (Invite-only, RBAC, Audit-Log),
  App.jsx-Refactoring (→ 443 Zeilen).
- **Phase 3 (Q1 2026):** Migration auf eigenen Backend-Stack, Release 1.0.0.

Für die laufende Marktreife-Roadmap siehe
[docs/marktreife-roadmap.md](docs/marktreife-roadmap.md).
