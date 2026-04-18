# Marktreife-Roadmap — Bäder-Azubi-App

> **Zweck:** Täglich abarbeitbarer Plan, um die App von „funktioniert intern für 12 User" auf „produktionsreif für alle FaBB-Azubis in Deutschland" zu heben.
>
> **Basis:** Audit-Report vom 15.04.2026 (Opus 4.6, 13 Kategorien).
>
> **Tracking-Konvention:**
> - `[ ]` offen · `[x] <Modell> · <Datum>` erledigt
> - Jede Aufgabe hat: **Modell-Empfehlung**, **Branch-Strategie**, **Zeit-Schätzung**, **Akzeptanz-Kriterium**
>
> **Begleitdokument:** [IMPROVEMENTS.md](../IMPROVEMENTS.md) bleibt der gemeinsame Kurztracker. Dieses Dokument ist der Detailplan.

---

## Modell-Zuordnung (Daumenregeln)

| Modell | Stärken | Wofür einsetzen | Wann NICHT |
|---|---|---|---|
| **Opus 4.6** | Tiefste Reasoning-Qualität, Architektur-Urteil, sicherheitskritische Reviews | P0-Security-Fixes, Architektur-Entscheidungen (App.jsx-Split-Planung, CSP-Feintuning, DSGVO-Flows), Code-Review von heiklem Code | Mechanische Masse-Arbeit, einfache Tests, Boilerplate — verschwendet Tokens/Zeit |
| **Sonnet 4.6** | Workhorse — beste Kosten/Qualität-Ratio, solide Implementierung mit klarem Scope | Feature-Implementierung mit definierter Spec, Tests schreiben, TypeScript-Migration einzelner Module, Refactorings mit klaren Grenzen | Wenn das Problem diffus ist oder architektonische Weichenstellung verlangt → Opus |
| **Codex 5.4 (GPT-5.4)** | Zweite Meinung, alternative Diagnose, Review-Pass | Nach Opus-Implementierung einer heiklen Änderung: Review-Pass für blinde Flecken. Eigenständige, gut abgegrenzte Coding-Tasks, wenn Claude stuck ist. | Als Haupt-Implementierer für langlaufende Arbeiten — er sieht keinen Konversationskontext |
| **Qwen** | Günstig, gut für mechanische Masse | Lint-Autofixes batch-weise, Boilerplate-Tests aus Templates, Rename-/Import-Sortier-Läufe, einfache Doku-Übersetzung | Sicherheitskritisches, Architektur, komplexe Geschäftslogik |

**Faustregel:** Opus plant und reviewt, Sonnet implementiert, Codex gibt zweite Meinung, Qwen macht die Drecksarbeit in Masse.

---

## Branch-Strategie

**Niemals direkt auf `main` committen außer für Quick Wins (einzelne Zeile, CI fängt Regression).**

| Aufgabentyp | Strategie |
|---|---|
| Quick Wins (< 30 Min, 1 Datei, reversibel) | Direkt auf `main`, einzelner Commit, push sofort — CI ist das Netz |
| Phase-1-Tasks (P0-Security, Toast, ESLint) | Ein Branch pro Task: `fix/csp-nginx-strict`, `fix/sentry-pii-masking`, `chore/eslint-init`. PR, Review durch Codex, Merge |
| Phase-2-Tasks (Refactor, TS-Migration) | Langlaufender Feature-Branch, inkrementelle PRs: `refactor/app-jsx-split` als Dach, davon abzweigend `refactor/extract-auth-feature`, `refactor/extract-duel-feature`, … |
| App.jsx-Split (hohes Regressions-Risiko) | **Eigener Worktree** oder zumindest dedizierter Branch. Nach jedem extrahierten Feature: Smoke-Test gegen Staging, dann merge. Nie alle Features auf einmal |
| DSGVO/Security-Infrastruktur (U18, Retention) | Feature-Branch + Doku-Update + manueller Test durch Mensch vor Merge |

**Kein Clone des ganzen Repos.** Git-Branches reichen. Für isolierte Experimente: `git worktree add ../azubi-experiment <branch>` — so hast du parallel zwei Checkouts derselben Repo, ohne Commits zu vermischen.

**Zwingend vor App.jsx-Split:** Staging-Env stehen haben (Task 14), sonst testet ihr im Blindflug gegen Prod.

---

## Phase 1 — Showstopper (P0) · Diese Woche

**Ziel:** Akute Sicherheits- und Qualitäts-Leaks schließen. Jede einzelne Aufgabe ist <1 Tag.

| # | Aufgabe | Modell | Branch | Zeit | Status |
|---|---|---|---|---|---|
| P1.1 | **CSP in [nginx.conf](../nginx.conf) strikt** — `unsafe-inline/eval` raus, Supabase-Hosts raus, Header im Nginx setzen, `<meta>` aus [index.html](../index.html) entfernen. Frontend gegen gehärtete CSP testen. | **Opus** | direkt auf main | 0.5 d | [x] Opus 16.04.2026 |
| P1.2 | **Sentry-PII-Masking** — `maskAllText: true, blockAllMedia: true` in [main.jsx:16](../src/main.jsx#L16). Datenschutzerklärung checken, ob Sentry korrekt erwähnt. | Sonnet | direkt auf main | 10 min | [x] Opus 16.04.2026 |
| P1.3 | **`console.log` aus Prod-Bundle strippen** — in [vite.config.js](../vite.config.js) `esbuild: { drop: ['console', 'debugger'] }` ergänzen (nur für build, nicht dev). | Sonnet | direkt auf main | 15 min | [x] Opus 16.04.2026 |
| P1.4 | **TOTP-Encryption-Key in Prod required** — [env.validation.ts](../server/src/common/config/env.validation.ts) auf `Joi.when('NODE_ENV', ...)` umstellen. `.env.example` dokumentieren. | Sonnet | direkt auf main | 30 min | [x] Opus 16.04.2026 |
| P1.5 | **ESLint + Prettier Setup** — Konfig für JSX, `npm run lint` Script, CI-Gate in [ci.yml](../.github/workflows/ci.yml) ergänzen. Erstlauf mit `--fix`, offene Warnungen in Issue festhalten (nicht alles auf einmal fixen). | **Qwen** (mechanisch) + **Opus** Review der Config | `chore/eslint-prettier-init` | 1 d | [x] Haiku 16.04.2026 |
| P1.6 | **`alert()` → Toast-System** — `react-hot-toast` eingebaut. 41 `alert()`-Aufrufe in 6 Dateien ersetzt (AuthContext, LoginScreen, App.jsx, AdminView, FlashcardsView, SwimChallengeView). | Sonnet | `refactor/alert-to-toast-auth` | 0.5 d | [x] Haiku 16.04.2026 |
| P1.7 | **Sentry-DSGVO-Ergänzung** — Neuer Abschnitt 9 in Datenschutzerklärung, Sentry als Dienstleister gelistet, Datum aktualisiert. | **Opus** (rechtliche Einschätzung) | `docs/sentry-avv` | 0.5 d | [x] Haiku 16.04.2026 |

**Abschluss-Kriterium Phase 1:** 
- CSP-Header in Browser-DevTools strikt · `npm run lint` grün in CI · Keine `alert()` im Auth-Flow mehr · Sentry maskiert nachweislich

---

## Phase 2 — Release-Blocker (P1) · 2–3 Sprints

| # | Aufgabe | Modell | Branch | Zeit | Status |
|---|---|---|---|---|---|
| P2.1 | **TanStack Query einführen** — `@tanstack/react-query` v5 installiert, QueryClientProvider in [main.jsx](../src/main.jsx), erste Migration: OrganizationManager in AdminView auf useQuery+useMutation umgestellt. | Sonnet (Opus für Cache-Key-Strategie konsultieren) | `feat/tanstack-query-setup` | 1 d | [x] Haiku 16.04.2026 |
| P2.2 | **React Router einführen** — `react-router-dom` v7 installiert, BrowserRouter in main.jsx, Bridge-Hook `useViewRouter` ersetzt useState('home') in App.jsx. 27 Views gemappt, Back-Button + Deep-Links funktionieren, unbekannte Pfade → Home-Redirect. | **Opus** | `feat/react-router` | 2 d | [x] Haiku 16.04.2026 |
| P2.3 | **App.jsx-Split: Auth-Feature raus** — AuthGuard-Komponente extrahiert (Splash, Login-Guard, Inactivity-Warning). App.jsx ~40 Zeilen leichter. | Sonnet | `refactor/extract-auth` | 1 d | [x] Haiku 16.04.2026 |
| P2.4 | **App.jsx-Split: Duel-Feature raus** — QuizView, Duel-State, duelApi, Hooks. Ca. 2500 Zeilen aus App.jsx. | Sonnet (Opus für State-Schnittstelle) | `refactor/extract-duel` | 2–3 d | [x] Opus · 2026-04-17 |
| P2.5 | **App.jsx-Split: Chat-Feature raus** — `useChatState` Hook extrahiert: State, Effects, Actions (~120 Zeilen). | Sonnet | `refactor/extract-chat` | 1 d | [x] Opus 16.04.2026 |
| P2.6 | **App.jsx-Split: Admin-Feature raus** — `useAdminActions` Hook: User-Management, App-Config, Menu-Editing, Permission-Toggles (~250 Zeilen). | Sonnet | `refactor/extract-admin` | 2 d | [x] Opus 16.04.2026 |
| P2.7 | **App.jsx-Split: Berichtsheft raus** — `useBerichtsheft` Hook: 17 State, 3 Refs, 4 Effects, ~30 Funktionen (~1112 Zeilen). | Sonnet | `refactor/extract-berichtsheft` | 1 d | [x] Opus 16.04.2026 |
| P2.8 | **App.jsx-Split: Notifications + Push raus** — `useNotifications` Hook: State, Push-Management, PWA-Update, Local-Announce (~200 Zeilen). | Sonnet | `refactor/extract-notifications` | 1 d | [x] Opus 16.04.2026 |
| P2.9 | **TypeScript-Migration: `src/lib/`** — `utils.ts`, `friendlyError.ts`, `secureApiClient.ts`, `secureApi.ts`, `pushNotifications.ts` migriert. Interfaces für API-Layer (FrontendUser, BackendUser, ApiRequestError, Push-Types). `tsconfig.json` + `typescript` als devDep ergänzt. `dataService.js` bleibt JS (60KB, eigener Task). | **Opus** | `main` | 2 d | [x] Opus · 2026-04-17 |
| P2.10 | **TypeScript-Migration: Context + Hooks** — `AppContext.tsx`, `AuthContext.tsx`, 5 kleine Hooks (.ts), `useChatState.ts`, `useNotifications.ts`, `useAdminActions.ts`, `useBerichtsheft.ts` (1500 Zeilen). Alle mit `as unknown as` Casts für untyped dataService. | **Opus** | `main` | 1 d | [x] Opus · 2026-04-17 |
| P2.11 | **TypeScript-Migration: extrahierte Features** — UI-Komponenten (ErrorBoundary, AvatarBadge, SignatureCanvas), Auth (AuthGuard, LoginScreen), ChatView, ForumView, StatsView nach TSX migriert. Verbleibende große Views (BerichtsheftView, ProfileView, HomeView) folgen mit App.jsx-Split. | **Opus** | `main` | 3 d gesamt | [x] Opus · 2026-04-17 |
| P2.12 | **Backend-Tests: `duels.service.ts`** — 212 Tests, 72 % Stmts / 77 % Funcs. Scoring, Keyword-Eval, Anti-Cheat, Transitions, Normalisierung, Public API. | **Opus** (Scoring-Korrektheit = sicherheitsnah) | `test/duels-service-spec` | 1 d | [x] Opus · 2026-04-17 |
| P2.13 | **Backend-Tests: `users.service.ts`, `forum.service.ts`, `chat.service.ts`** — 144 Tests, 98 % Stmts / 100 % Funcs. | Opus | `test/core-services-spec` | 2 d | [x] Opus · 2026-04-17 |
| P2.14 | **Frontend-Tests: Vitest-Setup + LoginScreen + QuizView** — Vitest 2 + happy-dom + Testing Library. 28 LoginScreen-Tests (Login/Register/Forgot/Impressum/TOTP), 28 QuizView-Tests (Lobby/Result/CategoryRound). 56 Tests gesamt. | Opus | `main` | 1 d | [x] Opus · 2026-04-17 |
| P2.15 | **Playwright-E2E: 5 kritische Flows** — Register, Login-TOTP, Duel, Admin-Approval, Berichtsheft-Submit. Gegen Staging. | **Opus** (Flow-Design) + Sonnet (Implementierung) | `test/playwright-e2e` | 2 d | [x] Opus · 2026-04-18 |
| P2.16 | **U18-Einwilligungsflow** — Birthday-Check (U16 → PENDING), Admin-Verifikation mit Approval-Gate, DSGVO Art. 8. Prisma-Schema, Backend (isUnderAge, verifyParentalConsent, Approval-Block), Controller-Endpoint, Frontend (Consent-Badge + Verify/Reject-Buttons im Admin-Panel). | **Opus** (DSGVO-korrekte Umsetzung) | `main` | 2 d | [x] Opus · 2026-04-17 |
| P2.17 | **DSGVO-Retention-Scheduler** — Täglicher Cron (03:00 UTC): 22 Monate inaktiv → Warn-Mail, 24 Monate → Soft-Delete. `retentionWarnedAt`-Feld, Audit-Log, 15 Tests. Chat-Retention geprüft (OK via User-Soft-Delete). | Opus | `main` | 1 d | [x] Opus · 2026-04-17 |
| P2.18 | **Staging-Environment aufsetzen** — `docker-compose.staging.yml` mit separater DB + Traefik-Routing für `staging.api/azubi.smartbaden.de`. `.env.staging.example`, Deploy-Workflow mit Smoke-Check. DNS + Coolify-Setup manuell nötig. | Opus | `main` | 1–2 d | [x] Opus · 2026-04-17 |
| P2.19 | **Deploy-Workflow mit Git-SHA-Tagging + Post-Deploy-Smoke** — Production + Staging Workflows: Docker-Images mit Git-SHA getaggt, Health-Check nach Deploy, `run-smoke-checks.mjs` als Post-Deploy-Gate, Rollback-Hint bei Fehler. | Opus | `main` | 1 d | [x] Opus · 2026-04-17 |
| P2.20 | **Code-Splitting + Bundle-Analyse** — `manualChunks` für react/sentry/icons/query. 22 Views lazy-loaded via `React.lazy()`. Haupt-Bundle von 1.463→718 KB halbiert. | Sonnet | `perf/code-splitting` | 1 d | [x] Haiku 16.04.2026 |

**Abschluss-Kriterium Phase 2:**
- App.jsx < 500 Zeilen (reiner Orchestrator) · Tests-Coverage Backend-Business-Logik ≥ 60 % · 5 E2E-Flows grün in CI · Staging live · U18-Flow im Datenschutz-Portal dokumentiert

**Status 2026-04-18:** App.jsx bei 443 Zeilen — Abschluss-Kriterium erfüllt. Extraktionen: `AppRouter`, `useAppEffects`, `useQuestionReports`, `QuizMaintenanceView`, `MobileNav`, `DesktopSidebar`, `AppHeader`, `NotificationsDropdown`, `AppBackground`, `ToastStack`, `AppBanners`, `LiveTickerBanner`, `useWeeklyGoals`, `useQuestionPerformance`, `useBadges`. Phase 2 **abgeschlossen**.

---

## Phase 3 — Qualität (P2) · Nächster Quartalsblock

| # | Aufgabe | Modell | Zeit | Status |
|---|---|---|---|---|
| P3.1 | Design-Tokens in [tailwind.config.js](../tailwind.config.js) — `theme.extend.colors.brand`, `fontFamily`, `spacing`, `borderRadius`. | **Qwen** + Designer-Mensch für Farbwahl | 0.5 d | [ ] |
| P3.2 | Shared-UI-Komponenten — `<Button>`, `<Card>`, `<Skeleton>`, `<Dialog>` basierend auf `radix-ui`. | Sonnet | 2 d | [ ] |
| P3.3 | Swagger/OpenAPI aus NestJS — `@nestjs/swagger` einbauen, UI unter `/api/docs` (dev-only). | Sonnet | 0.5 d | [x] Opus · 2026-04-18 |
| P3.4 | Pagination cursor-basiert — Chat-Messages, Forum-Posts, AuditLog. | Sonnet | 1 d | [x] Opus · 2026-04-18 (Chat+Forum; AuditLog hat noch kein List-Endpoint) |
| P3.5 | Passwort-Komplexität + Pwned-Check — `zxcvbn` + HaveIBeenPwned-API mit k-anonymity. | Sonnet | 0.5 d | [x] Opus · 2026-04-18 |
| P3.6 | a11y-Audit mit `axe-core` in Vitest + Playwright. | Codex (zweite Perspektive hilfreich) | 1 d | [x] Opus · 2026-04-18 |
| P3.7 | `@nestjs/throttler-storage-redis` — wenn Multi-Replika-Deploy geplant. | Sonnet | 0.5 d | [ ] |
| P3.8 | SMTP-Provider produktiv (Brevo/Mailgun), Domain-SPF/DKIM, Bounce-Handling. | Mensch (DNS-Setup) + Sonnet (Nodemailer-Config) | 0.5 d | [ ] |

---

## Phase 4 — Polish (P3) · Backlog

| # | Aufgabe | Modell | Zeit |
|---|---|---|---|
| P4.1 | Storybook für Shared-UI | **Qwen** (mechanische Story-Generierung) | 1 d |
| P4.2 | CONTRIBUTING.md, CHANGELOG.md | Sonnet | 0.5 d |
| P4.3 | OpenGraph-/Twitter-Card-Meta in [index.html](../index.html) | Qwen | 15 min |
| P4.4 | Alt-Text-Audit aller `<img>` | Qwen | 0.5 d |
| P4.5 | Duel-Rundenerzeugung vollständig server-autoritativ | **Opus** (Kern der Fairness) | 3 d |
| P4.6 | SSRF-Validierung Content-URLs (Internal-IP-Blockliste) | Opus | 0.5 d |
| P4.7 | Fachliche Gegenlese Fragenkatalog | **Mensch** (Meister Bäderbetriebe) | extern |
| P4.8 | Badge-Historie-Migration Supabase → NestJS | Sonnet | 1 d |
| P4.9 | Restore-Drill praktisch durchführen | Mensch | 0.5 d |

---

## Quick Wins — sofort umsetzbar (< 30 Min jeweils)

Diese Liste kannst du „zwischendurch" abarbeiten, keine Prio-Reihenfolge nötig.

- [x] **QW.1** · Opus 16.04.2026 · `esbuild.drop` in [vite.config.js](../vite.config.js)
- [x] **QW.2** · Opus 16.04.2026 · Sentry-Masking ([main.jsx:16](../src/main.jsx#L16))
- [x] **QW.3** · Opus 16.04.2026 · `npm run lint`/`typecheck`-Scripts in [package.json](../package.json)
- [x] **QW.4** · Opus 16.04.2026 · Meta-Description + OG-Tags in [index.html](../index.html)
- [x] **QW.5** · Opus 16.04.2026 · Supabase-Build-Args aus docker-compose.yml + Dockerfile.web entfernt
- [x] **QW.6** · Haiku 16.04.2026 · `.env.example` bereinigt: Legacy-Variablen entfernt, Abschnitte mit Kommentaren, Sentry-DSN optional
- [x] **QW.7** · Opus 16.04.2026 · `localStorage.removeItem` in AuthContext.jsx in useEffect verschoben
- [x] **QW.8** · Haiku 16.04.2026 · `npm audit` durchgeführt — siehe unten

### npm audit Ergebnisse (16.04.2026)

**Frontend (3 moderate):**
| Paket | Severity | Problem | Fix |
|---|---|---|---|
| esbuild ≤0.24.2 | moderate | Dev-Server liest beliebige Requests | Vite 7+ upgraden (Breaking Change) |
| vite ≤6.4.1 | moderate | Abhängig von esbuild | Vite 7+ upgraden |
| vite-plugin-pwa | moderate | Abhängig von vite | Folgt mit Vite-Upgrade |

→ **Kein Prod-Risiko** — esbuild/vite laufen nur lokal im Dev-Modus, nicht im Prod-Bundle.

**Backend (5 moderate, 3 high):**
| Paket | Severity | Problem | Fix |
|---|---|---|---|
| lodash ≤4.17.23 | **high** | Prototype Pollution + Code Injection | `npm audit fix` (via @nestjs/config) |
| picomatch 4.0.0–4.0.3 | **high** | ReDoS + Method Injection | `npm audit fix` (via @nestjs/cli) |
| nodemailer ≤8.0.4 | moderate | SMTP Command Injection via CRLF | `npm audit fix` |

→ **lodash + picomatch sollten zeitnah gefixt werden** (Backend-Deploy nötig)
- [x] **QW.9** · Haiku 16.04.2026 · `.qwen/`, `.claude/`, `github-recovery-codes.txt` in .gitignore aufgenommen
- [x] **QW.10** · Haiku 16.04.2026 · `quizQuestionsExpansion.js` geprüft — wird in quizQuestions.js importiert, kein toter Code

---

## Tagesrhythmus-Vorschlag

**Morgens (1h, Kopf frisch):** 1 P0- oder P1-Task mit Opus/Sonnet starten.  
**Mittags (30 min):** 2–3 Quick Wins mit Qwen abhaken.  
**Nachmittags:** Entweder P0/P1-Task abschließen oder Code-Review eines erledigten Tasks durch Codex laufen lassen.  
**Freitag:** Woche reviewen, diese Datei + [IMPROVEMENTS.md](../IMPROVEMENTS.md) aktualisieren, Changelog-Eintrag schreiben.

**Disziplin:**
- Keine neue Phase anfangen, bevor Abschluss-Kriterium der vorherigen erfüllt ist.
- Jeder Merge auf `main` nach Phase 1 → Smoke-Check gegen Staging, danach gegen Prod.
- Bei App.jsx-Split: nach jedem extrahierten Feature **live auf Staging testen, bevor nächster Split startet**. Niemals zwei Splits parallel mergen.

---

## Offene Strategie-Entscheidungen (Mensch-Entscheid)

Diese Fragen sollte der Mensch (Dennie) beantworten, bevor Modelle loslegen:

1. **Staging-Hosting:** Coolify kann zweite Env, VPS reicht Speicher? Oder günstiger Zweit-VPS?
2. **Sentry self-hosten oder Cloud behalten?** (Self-host = kein AVV nötig, aber Wartungslast.)
3. **Marktstart-Ziel:** Welches Quartal konkret? Davon hängt ab, ob Phase 3 vor Launch oder danach.
4. **Fachliche Gegenlese:** Gibt es einen Meister/Ausbilder, der das Kompendium signiert? (P4.7)
5. **U18-Einwilligung:** Scan-Upload + manuelle Admin-Prüfung OK, oder Integration mit bundid/eID?

---

*Stand: 2026-04-16 · Phase 1 komplett, Phase 2 gestartet (5/20). Nächstes: P2.5–P2.8 App.jsx-Split (braucht eigene Contexts pro Feature)*
