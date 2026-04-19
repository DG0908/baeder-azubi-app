# Feature-Rollout & Beta-Tester — Umsetzungsplan

Stand: 2026-04-19
Status: Entwurf, freigegeben zur Umsetzung

## Ziel

Admin kann neue Bereiche (Views) schrittweise freigeben:

1. **alpha** — nur Admin sieht den Bereich (während aktiver Entwicklung)
2. **beta** — Admin + explizit markierte Beta-Tester sehen den Bereich (enger Testkreis, inkl. Frau des Owners)
3. **stable** — alle berechtigten User sehen den Bereich (regulärer Betrieb)

Zusätzlich:

- Bestehende Rollen-Gates (z.B. "nur ADMIN/AUSBILDER sieht Trainer-Dashboard") bleiben harte Filter und werden nicht durch Stages überschrieben
- Ein-Klick-Übergang `beta → stable` ohne Deploy (DB-gesteuert)
- Optional: Per-User-Override (Feature-X für User-Y früher/später freigeben) als Feinsteuerung

## Orthogonale Gate-Regel

```
User sieht Feature  ⇔  (Rolle erfüllt)  UND  (Stage erlaubt ODER Override)
```

Algorithmus (`useFeature(key)` Hook, gleichwertig Backend-Check):

```
1.  Rolle nicht in requiredRoles?         → false  (hart, wird nie übersteuert)
2.  featureOverrides[key] === false?      → false  (expliziter Opt-out)
3.  Admin (AppRole.ADMIN)?                → true   (Admin sieht alles)
4.  featureOverrides[key] === true?       → true   (expliziter Opt-in)
5.  stage === 'stable'?                   → true
6.  stage === 'beta' UND isBetaTester?    → true
7.  stage === 'alpha'?                    → false  (nur Admin, s. Regel 3)
8.  sonst                                 → false
```

## Datenmodell

### Prisma-Änderungen

```prisma
model User {
  // NEU:
  isBetaTester      Boolean  @default(false)
  featureOverrides  Json?    // { "notfall-trainer": true, "swim-challenge": false } — nur Abweichungen
  ...
}

model AppConfig {
  // BESTEHEND: featureFlags Json @default("{}")  (bleibt, für Legacy-Flags wie quizMaintenance)
  // NEU:
  featureStages    Json     @default("{}")  // { "notfall-trainer": "beta", "swim-challenge": "stable" }
  ...
}
```

Rationale:

- `featureStages` als **neue Spalte** statt Umbau von `featureFlags` — Legacy-Shape bleibt untouched, keine Migrations-Kompatibilitätsakrobatik
- `featureOverrides` als Json auf User — nur Deltas, kein N×M-Join-Tabelle-Overhead bei ~12 Usern × 25 Features
- `isBetaTester` als dediziertes Flag statt Gruppen-Tabelle — YAGNI, kann später zu Gruppen generalisiert werden

### Default-Stages aus Code

Wenn `featureStages[key]` in DB nicht gesetzt ist, gilt der Default aus `APP_FEATURE_REGISTRY` (siehe unten). So ist jede neue Feature-Registrierung beim Deploy sofort in gewünschter Stage aktiv, Admin kann per UI überschreiben.

## Feature-Registry

Neue Datei `src/lib/featureRegistry.ts`, gespiegelt im Server unter `server/src/modules/app-config/feature-registry.ts` (Single Source of Truth könnte später shared package sein; erstmal duplizieren, weil kein Monorepo-Setup vorliegt).

```ts
export type FeatureStage = 'alpha' | 'beta' | 'stable';
export type AppRoleKey = 'ADMIN' | 'AUSBILDER' | 'AZUBI' | 'RETTUNGSSCHWIMMER_AZUBI';

export interface FeatureDefinition {
  key: string;
  label: string;
  requiredRoles: AppRoleKey[];
  defaultStage: FeatureStage;
}

export const APP_FEATURE_REGISTRY: FeatureDefinition[] = [
  // Kern-Lern-Bereiche — alle Rollen, stable
  { key: 'quiz',              label: 'Quiz',                requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'flashcards',        label: 'Karteikarten',        requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'exam-simulator',    label: 'Prüfungs-Simulator',  requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'calculator',        label: 'Rechner',             requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'interactive-learning', label: 'Interaktives Lernen', requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'materials',         label: 'Materialien',         requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'resources',         label: 'Ressourcen',          requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'notfall-trainer',   label: 'Notfall-Trainer',     requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'swim-challenge',    label: 'Schwimm-Challenge',   requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },

  // Sozial
  { key: 'chat',              label: 'Chat',                requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'forum',             label: 'Forum',               requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'news',              label: 'News',                requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },

  // Dokumentation
  { key: 'berichtsheft',      label: 'Berichtsheft',        requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'school-card',       label: 'Schul-Karte',         requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'exams',             label: 'Prüfungen',           requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'stats',             label: 'Statistiken',         requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },

  // Admin/Ausbilder-only — Stage 'stable', Rolle schützt
  { key: 'trainer-dashboard', label: 'Ausbilder-Dashboard', requiredRoles: ['ADMIN','AUSBILDER'],                                    defaultStage: 'stable' },
  { key: 'questions',         label: 'Fragen-Workflow',     requiredRoles: ['ADMIN','AUSBILDER'],                                    defaultStage: 'stable' },
  { key: 'admin',             label: 'Admin-Bereich',       requiredRoles: ['ADMIN'],                                                defaultStage: 'stable' },

  // Immer-an (nicht abschaltbar, aber trotzdem registriert für Konsistenz)
  { key: 'home',              label: 'Home',                requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
  { key: 'profile',           label: 'Profil',              requiredRoles: ['ADMIN','AUSBILDER','AZUBI','RETTUNGSSCHWIMMER_AZUBI'], defaultStage: 'stable' },
];
```

Die Keys spiegeln `APP_CONFIG_MENU_IDS` — so bleibt die Kopplung zum bestehenden Menü-System eindeutig.

## Backend

### Neue/geänderte Endpoints

Alle Admin-Endpoints: `@Roles(AppRole.ADMIN)` + Audit-Log-Eintrag.

```
GET  /users/me/features
  → 200 { "notfall-trainer": true, "swim-challenge": false, ... }
  Server-computed für den aktuellen User. Wird einmal pro Session gefetched + in React Query gecached.

PATCH /admin/features/:key
  Body: { stage: 'alpha' | 'beta' | 'stable' }
  Schreibt in AppConfig.featureStages der org des Admins.

PATCH /admin/users/:id/beta-tester
  Body: { isBetaTester: boolean }

PATCH /admin/users/:id/feature-overrides
  Body: { featureOverrides: { [key]: true | false | null } }
  null = Eintrag entfernen (zurück zum Default-Verhalten)
```

### Backend-Gate-Utility

Neue Datei `server/src/common/utils/feature-gate.ts`:

```ts
export function canUserAccessFeature(
  user: { role: AppRole; isBetaTester: boolean; featureOverrides: Record<string, boolean> | null },
  featureKey: string,
  orgStages: Record<string, FeatureStage>,
): boolean { ... }
```

Kritische Backend-Routen, die view-spezifische Daten liefern (z.B. `GET /notfall-trainer/*`, `GET /swim-sessions/*`), bekommen Guard `@RequireFeature('notfall-trainer')`. So blockiert der Server auch direkte API-Aufrufe bei abgeschaltetem Feature.

### Rollout der Backend-Guards

Nicht alle Routen auf einmal. Stattdessen: nur die **neu registrierten** Features (Notfall-Trainer, SwimChallenge, Forum, Chat) bekommen sofort Backend-Guards. Bestehende stable-Features kriegen den Guard opportunistisch beim nächsten Touch.

## Frontend

### Hook

```ts
// src/hooks/useFeature.ts
export function useFeature(key: string): boolean { ... }
```

Basis: ein globaler `useFeatureMap()` Query via React Query → `GET /users/me/features` → Map in Context. `useFeature(key)` ist dann ein O(1)-Lookup.

### Gate-Punkte

1. **Navigation/Menü** — Sidebar/Home-Grid filtert Einträge per `useFeature`.
2. **AppRouter** — Unbekannte/abgeschaltete Routes redirecten auf Home mit Toast "Bereich nicht verfügbar".
3. **Direkte Aufrufe aus anderen Views** (z.B. "Zum Notfall-Trainer"-Button) — Buttons werden ausgeblendet, nicht disabled.

### Admin-UI

Neuer Tab in [AdminView.jsx](src/components/views/AdminView.jsx) "Feature-Freigabe" mit drei Unterbereichen (aufklappbar):

**1. Features & Stages** — Tabelle
```
| Label              | Rollen             | Stage                          | Aktionen          |
|--------------------|--------------------|--------------------------------| ------------------|
| Notfall-Trainer    | alle               | [alpha] [beta] [stable] (btn)  | Default wieder    |
| Trainer-Dashboard  | ADMIN, AUSBILDER   | [alpha] [beta] [stable] (btn)  | Default wieder    |
```
Stage-Wechsel mit `confirm()`-Dialog bei `stable` ("Bist du sicher? Alle User sehen den Bereich sofort.").

**2. Beta-Tester** — User-Liste mit Toggle
```
☑ Dennie Gulbinski    (ADMIN)     — Beta-Tester
☑ [Frau]              (AZUBI)     — Beta-Tester
☐ User X              (AZUBI)
```
Bulk-Buttons: "Alle Admins/Ausbilder aktivieren", "Alle entfernen".

**3. Pro-User-Override** (eigener Collapse pro User) — erst bei Bedarf, nicht im MVP-Scope der ersten PR.

## Rollout-Schritte (PR-Struktur)

### PR 1 — Backend-Fundament
- Prisma-Migration (`isBetaTester`, `featureOverrides`, `featureStages`)
- `feature-registry.ts` im Server
- `feature-gate.ts` Utility + Unit-Tests
- `GET /users/me/features` Endpoint
- Audit-Log-Actions: `feature.stage_changed`, `user.beta_tester_changed`, `user.feature_overrides_changed`

**Acceptance:** Endpoint liefert für bestehende User alle Features als `true` (alles stable-default) — **niemand verliert Zugriff nach Migration.**

### PR 2 — Admin-Endpoints
- `PATCH /admin/features/:key`, `PATCH /admin/users/:id/beta-tester`, `PATCH /admin/users/:id/feature-overrides`
- Validierung + Audit
- DTO-Tests + Controller-Tests

### PR 3 — Frontend-Hook + Nav-Gate
- `src/lib/featureRegistry.ts` (Spiegel)
- `useFeature` Hook + Context
- Sidebar/Home-Grid: Filter eingebaut
- AppRouter: Redirect-Logik für abgeschaltete Features
- Smoke-Test: Admin kann alles, Non-Admin bei alpha-Feature sieht es nicht

### PR 4 — Admin-UI
- Neuer Tab "Feature-Freigabe" in AdminView mit Sektion Features + Beta-Tester
- Per-User-Override kommt erst in PR 5 falls benötigt

### PR 5 (optional, später) — Per-User-Override-UI + Backend-Route-Guards flächig

## Nicht-Ziele (explizit ausgeschlossen)

- Keine Zeitsteuerung ("ab Datum X automatisch stable") — YAGNI bei ~12 Usern, Admin klickt manuell
- Keine Feature-Flag-Historisierung ("wer hat wann was geändert") über Audit-Log hinaus
- Keine Multi-Tenancy-Feinheiten — `featureStages` ist per-org, das reicht

## Migrationspfad / Rückwärtskompatibilität

- Alle bestehenden Features werden initial in Registry mit `defaultStage: 'stable'` registriert → identisches Verhalten wie heute
- `featureStages` DB-Spalte beginnt leer → Defaults aus Code greifen → keine Änderung für Endnutzer am Tag 1
- Bestehende Rolle-Checks im Frontend (z.B. `user.role === 'admin'`) bleiben erstmal — wir ersetzen sie opportunistisch durch `useFeature`, nicht im Big Bang
- `AppConfig.featureFlags` (Legacy `quizMaintenance`) bleibt unverändert

## Entschiedene Fragen (2026-04-19)

1. **Downgrade `stable → beta` erlaubt** — mit Bestätigungs-Dialog ("Bereich wird für Azubis unsichtbar. Fortfahren?").
2. **Owner = Admin in Gate-Logik** — `isOwner || role === ADMIN` triggert Admin-Pfad in Regel 3.
3. **`home`/`profile` readonly** — in der Tabelle als Zeile mit Badge "Immer aktiv" statt Stage-Dropdown. Keine Änderung möglich.

## Code-Struktur-Disziplin (No-Monolith)

AdminView.jsx hat bereits 1557 Zeilen. Neuer Code wird **nicht** dort angehängt, sondern in eigene Module extrahiert:

### Backend — eigenes NestJS-Modul

```
server/src/modules/feature-rollout/
  feature-rollout.module.ts
  feature-rollout.controller.ts      — alle /admin/features/*, /users/me/features Routes
  feature-rollout.service.ts         — Business-Logik (Gate-Auswertung, Stage-Update)
  feature-registry.ts                — APP_FEATURE_REGISTRY (SSoT Server-Seite)
  dto/
    update-feature-stage.dto.ts
    update-beta-tester.dto.ts
    update-feature-overrides.dto.ts
```

`server/src/common/utils/feature-gate.ts` bleibt utility-only (pure function, testbar).

Nicht in `app-config` integrieren, obwohl `featureStages` physisch in `AppConfig`-Tabelle liegt — Rollout-Logik ist eigener Bounded Context.

### Frontend — pro Verantwortung eine Datei

```
src/lib/featureRegistry.ts              — Registry-Daten (Spiegel zum Server)
src/lib/api/features.ts                 — API-Calls (neue Struktur per dataService-Freeze)
src/context/FeatureContext.jsx          — Provider + useFeatureMap Query
src/hooks/useFeature.ts                 — O(1)-Lookup-Hook
src/components/views/admin/
  FeatureRolloutTab.jsx                 — Tab-Container
  FeatureStageTable.jsx                 — Sektion 1: Features & Stages
  BetaTesterList.jsx                    — Sektion 2: Beta-Tester
  UserFeatureOverrides.jsx              — Sektion 3 (erst PR 5, optional)
```

AdminView.jsx bekommt **nur einen** neuen Import + Tab-Eintrag (≤10 neue Zeilen).

### Schwellen (verbindlich)

- Jede neue Datei startet mit klarer Einzelverantwortung
- **Warnung bei >500 Zeilen**, **Stopp bei >800** (siehe Memory `feedback_no_monolith`)
- Extraktion statt weitere Files im selben `Tab.jsx`

## Referenzen

- [AdminView.jsx](src/components/views/AdminView.jsx) — Einbauort für neuen Tab
- [AppRouter.jsx](src/components/AppRouter.jsx) — Redirect-Logik
- [app-config.constants.ts](server/src/modules/app-config/app-config.constants.ts) — Menu-IDs als Feature-Keys
- [schema.prisma](server/prisma/schema.prisma) — Zu erweiternde Modelle: User, AppConfig
