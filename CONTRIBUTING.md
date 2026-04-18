# Contributing zur Bäder-Azubi-App

Danke, dass du mithelfen möchtest! Diese Anleitung beschreibt die lokalen Setup-
Schritte, unsere Git- und Commit-Konventionen sowie die Qualitäts-Gates, die vor
jedem Merge in `main` erfüllt sein müssen.

## Projekt im Überblick

- **Frontend:** React 18 + Vite + TailwindCSS, PWA-fähig
- **Backend:** NestJS + Prisma (PostgreSQL), Web-Push, Swagger unter `/api/docs`
- **Deployment:** Docker Compose + Nginx, produktiv auf Coolify/Hostinger (Frankfurt)
- **Sprache:** Deutsch in Commit-Messages, Dokumentation und UI; englische Tech-Begriffe
  bleiben unverändert.

## Lokales Setup

### Voraussetzungen

- Node.js ≥ 20.x
- PostgreSQL ≥ 15 (lokal oder via Docker)
- Docker + Docker Compose (optional, empfohlen für DB)

### Frontend

```bash
npm install
cp .env.example .env           # lokal anpassen
npm run dev                     # http://localhost:5173
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev               # http://localhost:3000, Swagger unter /api/docs
```

## Git-Workflow

1. **Feature-Branch:** `feat/<kurzer-name>` oder `fix/<kurzer-name>` von `main` aus.
2. **Commit früh und oft,** mit aussagekräftigen deutschen Messages.
3. **Merge in `main`** über `--no-ff`, damit die Feature-Historie sichtbar bleibt.
4. **Push direkt nach jedem Merge.** Der Produktiv-Deploy auf Coolify zieht von `main`.

Destruktive Git-Operationen (`--force`, `reset --hard`, Branch-Löschung ohne Merge)
nur nach Rücksprache.

## Commit-Message-Konvention

Wir nutzen eine Conventional-Commits-lose Variante auf Deutsch:

```
<typ>(<scope>): <kurze Beschreibung>

<optionaler Body mit Details>

<optionale Footer-Zeile z. B. für Co-Authors>
```

**Typen:**

| Typ | Wann |
|---|---|
| `feat` | neues Feature oder fachliche Funktionalität |
| `fix` | Bugfix |
| `refactor` | Umbau ohne Verhaltensänderung |
| `docs` | nur Dokumentation |
| `test` | nur Tests |
| `chore` | Build, CI, Dependencies |
| `security` | sicherheitsrelevante Änderung (Pflicht bei Auth, SSRF, Crypto) |

**Scope-Beispiele:** `auth`, `duel`, `api`, `ui`, `a11y`, `infra`.

**Beispiel:**

```
feat(security): SSRF-Validator gehärtet + Push-Endpoints abgedeckt (P4.6)

Neu blockiert: 0.0.0.0/8, Hex-/Oktal-/Dezimal-IPv4-Obfuskation,
IPv6-Varianten, .local/.internal Suffixe. 21 neue Tests, Backend
491/491 grün.
```

## Qualitäts-Gates

Bevor ein Branch nach `main` gemerged wird:

| Gate | Kommando | Pflicht |
|---|---|---|
| Lint | `npm run lint` (Frontend) | ja |
| Format | `npm run format` | ja |
| Tests Frontend | `npm test` | ja |
| Tests Backend | `cd server && npm test` | ja |
| E2E (bei UI-Änderungen) | `npm run test:e2e` | bei sichtbarer UI |
| Build | `npm run build` + `cd server && npm run build` | ja |

Bei a11y-relevanten Änderungen: `axe`-Audit prüfen
(siehe [src/test-utils/a11y.js](src/test-utils/a11y.js) + `e2e/06-a11y.spec.ts`).

## Code-Stil

- **TypeScript** für neue Module; bestehendes JSX wird schrittweise migriert
  (siehe Phase P2.9 in [docs/marktreife-roadmap.md](docs/marktreife-roadmap.md)).
- **Tailwind-Tokens** statt hart-kodierter Farben. Brand = Teal (`brand-*`),
  Accent = Cyan (`accent-*`), Semantic-Aliase `success` / `warning` / `danger`.
- **Shared-UI-Primitives** aus [src/components/ui/primitives/](src/components/ui/primitives/)
  bevorzugen (Button, Card, Skeleton, Dialog).
- **Keine Kommentare für "was der Code tut"** — nur für "warum" (Constraints,
  Workarounds, überraschende Invarianten).

## Sicherheitsrelevante Änderungen

Für Änderungen an Auth, Session-Handling, Admin-Flows, externen URL-Fetches,
Crypto oder Push-Subscriptions gelten zusätzliche Anforderungen:

- Commit-Typ `security` nutzen.
- Tests für Angriffsszenarien ergänzen (siehe
  [server/src/common/validators/no-internal-ip.validator.spec.ts](server/src/common/validators/no-internal-ip.validator.spec.ts)
  als Vorbild).
- Keine neuen Abhängigkeiten ohne `npm audit`-Check.
- Bei Fragen: vor dem Merge kurz mit dem Maintainer (Owner) abstimmen.

## Reportieren von Sicherheitslücken

Bitte **nicht** als öffentliches GitHub-Issue eröffnen. Kontakt per E-Mail an den
Repo-Owner — siehe `git log -1 --format=%ae`. Wir antworten innerhalb von 48 Stunden.

## Fragen?

GitHub-Issue öffnen oder direkt in den Maintainer-Chat. Danke!
