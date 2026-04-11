# Security Tracker – Baeder-Azubi-App

> **Letztes Update:** 2026-04-11
> **Zweck:** Zentrale Übersicht aller Sicherheitsmaßnahmen, offenen Risiken und des Umsetzungsstands.
> Diese Datei wird von allen beteiligten Agents (Qwen, Claude, Codex) als gemeinsame Quelle genutzt.

---

## Gesamt-Bewertung

| Kategorie | Stand | Punkte |
|-----------|-------|--------|
| Backend-Sicherheit | Exzellent | **9.5 / 10** |
| Frontend-Architektur | Mangelhaft | **4.0 / 10** |
| Deployment/Infrastruktur | Gut | **7.5 / 10** |
| Testabdeckung | Ausbaufähig | **5.0 / 10** |
| Wartbarkeit / Code-Qualität | Gut | **7.5 / 10** |
| Dokumentation | Sehr gut | **9.0 / 10** |
| **Gesamt** | | **8.0 / 10** |

---

## Maßnahmen-Tracker

### Legende

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Abgeschlossen |
| ⚠️ | Teilweise umgesetzt |
| ❌ | Nicht begonnen |
| 🔴 | P0 – Kritisch |
| 🟠 | P1 – Hoch |
| 🟡 | P2 – Mittel |
| 🟢 | P3 – Niedrig |

---

### P0 – Kritisch (sofort)

| # | Maßnahme | Status | Commit / Hash | Anmerkungen |
|---|----------|--------|---------------|-------------|
| 0.1 | **Hardcoded Secrets entfernt** | ✅ | Vorgänger-Commits | `.env.example` mit Platzhaltern, keine Secrets im Repo |
| 0.2 | **Supabase Direct-Zugriff blockiert** | ✅ | Vorgänger-Commits | `VITE_ENABLE_UNSAFE_LEGACY_DB_WRITES=false` |
| 0.3 | **NestJS Backend als Authority** | ✅ | `server/` | Auth, Duels, Chat, RBAC serverseitig |

---

### P1 – Hoch (abgeschlossen)

| # | Maßnahme | Status | Commit / Hash | Anmerkungen |
|---|----------|--------|---------------|-------------|
| 1.1 | **CSRF-Schutz auf `/auth/refresh`** | ✅ | `a648b3d` | `X-Requested-With` Header-Check, Frontend sendet mit |
| 1.2 | **`UpdateDuelStateDto` Schema-Validierung** | ✅ | `f0d4cc2` | `GameStateDto` mit Typen, Min/Max, `@ValidateNested` |
| 1.3 | **RolesGuard-Audit – `@Roles` nachgerüstet** | ✅ | `f0d4cc2` | `PUT /app-config → ADMIN`, `POST /notifications/push/test → ADMIN+AUSBILDER` |
| 1.4 | **Forum-Rate-Limiting** | ✅ | `a648b3d` | Posts: 5/10min, Replies: 15/10min |
| 1.5 | **Exception Filter – Pfad-Leak entfernt** | ✅ | `a648b3d` | `request.url` aus Fehlerantworten entfernt |
| 1.6 | **Toter Code bereinigt** | ✅ | `a648b3d` | `DEMO_ACCOUNTS` Import, `quizQuestions.js.backup` (309 KB), Supabase-Meldungen |

---

### P1 – Hoch (offen)

| # | Maßnahme | Status | Dringlichkeit | Anmerkungen |
|---|----------|--------|---------------|-------------|
| 1.7 | **CSRF-Schutz auf ALLE state-changing Endpoints** | ✅ | 🔴 | Globale `CsrfMiddleware` + Frontend `apiRequest()` sendet `X-Requested-With` |
| 1.8 | **RolesGuard Default-Deny** | ✅ | Diese Session | `@Allow()` Decorator + RolesGuard umgestellt, alle 119 Endpunkte explizit abgesichert |
| 1.9 | **Rate-Limiting über Auth + Forum hinaus** | ✅ | Diese Session | 58 state-changing Endpunkte mit @Throttle versehen, nach Risiko gestaffelt |

---

### P2 – Mittel

| # | Maßnahme | Status | Anmerkungen |
|---|----------|--------|-------------|
| 2.1 | **API-Versionierung (`/api/v1/`)** | ✅ | NestJS URI versioning + defaultVersion '1', Frontend VITE_API_BASE_URL angepasst |
| 2.2 | **Pagination überall (limit/offset)** | ✅ | Chat, Forum, Exam-Grades, Report-Books mit limit/offset (max 100) |
| 2.3 | **Passwort-Komplexitätsprüfung** | ✅ | Custom Validator: 12+ Zeichen, Groß/Klein, Ziffer, Sonderzeichen |
| 2.4 | **SSRF-Validierung bei Content-URLs** | ✅ | Blockiert private IPs, localhost, metadata.google.internal |
| 2.5 | **Duel-Rundenerzeugung server-autoritativ** | ✅ | Server generiert Fragen aus Bank/DB, validiert Übergänge, prüft Antworten |
| 2.6 | **Badge-Historie in Secure-Export migrieren** | ❌ | Hängt noch an alter Supabase-Tabelle |
| 2.7 | **PrismaService Query-Middleware** | ✅ | Slow-Query-Logging (>500ms), Error-Logging mit Model/Action-Kontext, konfigurierbar |

---

### P3 – Niedrig

| # | Maßnahme | Status | Anmerkungen |
|---|----------|--------|-------------|
| 3.1 | **TypeScript für gesamtes Frontend** | ❌ | Nur `swimLearning/` ist TS |
| 3.2 | **React Router statt Conditional Rendering** | ❌ | Kein Deep-Linking, kein Back-Button |
| 3.3 | **App.jsx aufteilen** | ❌ | ~9.700 Zeilen, 200+ State-Variablen |
| 3.4 | **React Query für API-Caching** | ❌ | Jeder View-Wechsel = neuer API-Call |
| 3.5 | **Prop-Drilling eliminieren** | ❌ | 20–40 Props pro View-Komponente |
| 3.6 | **CI/CD Pipeline mit Approval Gates** | ❌ | Manuelles Deployment |
| 3.7 | **Restore-Drill dokumentieren** | ❌ | Backup-Skripte vorhanden, aber nie getestet |
| 3.8 | **Automatisierte Tests** | ❌ | Keine Tests für Auth, Approval, Chat, Duels |

---

## CSRF-Gap-Analyse

### Aktueller Stand
- **Geschützt:** Alle 79 state-changing Endpunkte via globaler `CsrfMiddleware`

### Umsetzung

| Komponente | Datei | Funktion |
|------------|-------|----------|
| Backend-Middleware | `server/src/common/middleware/csrf.middleware.ts` | Prüft `X-Requested-With` auf POST/PUT/PATCH/DELETE |
| Frontend-Client | `src/lib/secureApiClient.js` | Sendet `X-Requested-With` Header in `apiRequest()` |
| Registrierung | `server/src/common/common.module.ts` | `MiddlewareConsumer` auf alle Routen |

### Historische Gap-Analyse (archiviert)

| Modul | Endpunkte | Risiko |
|-------|-----------|--------|
| ~~auth~~ | ~~5 Endpunkte~~ | ✅ Behoben |
| ~~users~~ | ~~2 Endpunkte~~ | ✅ Behoben |
| ~~chat~~ | ~~2 Endpunkte~~ | ✅ Behoben |
| ~~forum~~ | ~~5 Endpunkte~~ | ✅ Behoben |
| ~~duels~~ | ~~5 Endpunkte~~ | ✅ Behoben |
| ~~notifications~~ | ~~5 Endpunkte~~ | ✅ Behoben |
| ~~content~~ | ~~6 Endpunkte~~ | ✅ Behoben |
| ~~flashcards~~ | ~~3 Endpunkte~~ | ✅ Behoben |
| ~~exam-simulator~~ | ~~4 Endpunkte~~ | ✅ Behoben |
| ~~question-workflows~~ | ~~3 Endpunkte~~ | ✅ Behoben |
| ~~school-attendance~~ | ~~3 Endpunkte~~ | ✅ Behoben |
| ~~exam-grades~~ | ~~2 Endpunkte~~ | ✅ Behoben |
| ~~report-books~~ | ~~5 Endpunkte~~ | ✅ Behoben |
| ~~swim-sessions~~ | ~~2 Endpunkte~~ | ✅ Behoben |
| ~~swim-training-plans~~ | ~~1 Endpunkte~~ | ✅ Behoben |

### Status
✅ **Abgeschlossen** – Globale `CsrfMiddleware` implementiert (Option B).

---

## Nächste Schritte (priorisiert)

1. ~~**CSRF-Schutz global einführen** (1.7)~~ → ✅ **Erledigt**
2. ~~**RolesGuard systematisch auditieren** (1.8)~~ → ✅ **Erledigt**
3. ~~**Rate-Limits für alle state-changing Endpunkte** (1.9)~~ → ✅ **Erledigt**
4. ~~**Passwort-Komplexitätsprüfung** (2.3)~~ → ✅ **Erledigt**
5. ~~**SSRF-Validierung bei Content-URLs** (2.4)~~ → ✅ **Erledigt**
6. ~~**Pagination bei Chat/Forum/Content** (2.2)~~ → ✅ **Erledigt**
7. ~~**API-Versionierung** (2.1)~~ → ✅ **Erledigt**
8. ~~**Duel-Runden server-autoritativ** (2.5)~~ → ✅ **Erledigt**
9. ~~**Prisma Query-Middleware** (2.7)~~ → ✅ **Erledigt**
10. **Automatisierte Tests** (3.8) → Qualitätssicherung
11. **Badge-Historie migrieren** (2.6) → Export-Vollständigkeit
12. **Restore-Drill dokumentieren** (3.7) → Notfallbereitschaft

---

## Änderungs-Historie

| Datum | Änderung | Author |
|-------|----------|--------|
| 2026-04-11 | Initial erstellt – P1-Review, Endpoint-Audit, Gap-Analysen | Qwen |
| 2026-04-11 | **1.7 CSRF-Schutz global** – `CsrfMiddleware`, `apiRequest()`, Docs aktualisiert | Qwen |
| 2026-04-11 | **1.8 RolesGuard Default-Deny** – `@Allow()` Decorator, RolesGuard umgestellt, alle 119 Endpunkte explizit mit `@Roles()` oder `@Allow()` markiert | Qwen |
| 2026-04-11 | **1.9 Rate-Limits flächendeckend** – 58 state-changing Endpunkte mit `@Throttle` versehen, nach Risiko gestaffelt (5–30/10min) | Qwen |
| 2026-04-11 | **2.2 Pagination** – limit/offset (max 100) für Chat, Forum, Exam-Grades, Report-Books | Qwen |
| 2026-04-11 | **2.3 Passwort-Komplexität** – Custom Validator: 12+ Zeichen, Groß/Klein, Ziffer, Sonderzeichen | Qwen |
| 2026-04-11 | **2.4 SSRF-Schutz** – Blockiert private IPs, localhost, metadata.google.internal bei Content-URLs | Qwen |
| 2026-04-11 | **2.1 API-Versionierung** – `/api/v1/` für alle Endpunkte, NestJS enableVersioning | Qwen |
| 2026-04-11 | **2.5 Duel-Runden server-autoritativ** – Bereits implementiert, validiert und dokumentiert | Qwen |
| 2026-04-11 | **2.7 Prisma Query-Middleware** – Slow-Query-Logging, Error-Logging, konfigurierbarer Threshold | Qwen |
