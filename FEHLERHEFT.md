# Fehlerheft — Bäder-Azubi-App

Bekannte Fehler und deren Lösungen. Immer hier nachschauen bevor man lange sucht.

---

## Inhaltsverzeichnis

- [Prisma](#prisma)
- [Docker](#docker)
- [Frontend](#frontend)
- [NestJS / Backend](#nestjs--backend)

---

## Prisma

### P3009 — Migration fehlgeschlagen, Spalte existiert schon (error 42701)

**Symptom:**
Server startet nicht, Logs zeigen immer wieder:
```
Error P3009: migrate found failed migrations in the target database
error 42701: column "xyz" of relation "User" already exists
```
Endlosschleife: Prisma versucht die Migration erneut, scheitert, wiederholt.

**Ursache:**
Die Spalte wurde manuell per `ALTER TABLE` hinzugefügt (oder eine Migration lief halb durch),
aber Prisma hat in `_prisma_migrations` `rolled_back_at` gesetzt → gilt als fehlgeschlagen.
Bei jedem Neustart versucht Prisma sie erneut auszuführen.

**Lösung:**
```bash
# 1. Den fehlerhaften Eintrag in _prisma_migrations bereinigen
docker exec azubi-app-postgres-1 psql -U azubi_app -d azubi_app -c "
DELETE FROM \"_prisma_migrations\"
  WHERE migration_name = 'MIGRATION_NAME' AND rolled_back_at IS NOT NULL;
UPDATE \"_prisma_migrations\"
  SET applied_steps_count = 1
  WHERE migration_name = 'MIGRATION_NAME';
"

# 2. Server neu starten
docker compose restart server
```
`MIGRATION_NAME` = Ordnername der Migration (z. B. `20260415_add_unlocked_avatar_ids`).

**Vorbeugung:**
- Niemals manuell `ALTER TABLE` im laufenden System ausführen — nur Prisma darf das Schema ändern.
- Wenn doch mal manuell etwas geändert wurde, sofort danach:
  ```bash
  docker exec azubi-app-server-1 npx prisma migrate resolve --applied MIGRATION_NAME
  ```

---

### Prisma-Migration erzeugt doppelten Eintrag in `_prisma_migrations`

**Symptom:**
Nach `prisma migrate resolve --applied` existieren zwei Einträge für dieselbe Migration,
beide mit `applied_steps_count = 0`.

**Ursache:**
`resolve --applied` wurde ausgeführt während der alte (fehlgeschlagene) Eintrag noch existierte.
Prisma hat einen neuen Eintrag erstellt statt den alten zu korrigieren.

**Lösung:**
```bash
docker exec azubi-app-postgres-1 psql -U azubi_app -d azubi_app -c "
DELETE FROM \"_prisma_migrations\"
  WHERE migration_name = 'MIGRATION_NAME' AND applied_steps_count = 0;
UPDATE \"_prisma_migrations\"
  SET applied_steps_count = 1
  WHERE migration_name = 'MIGRATION_NAME';
"
docker compose restart server
```

---

## Docker

### Backend läuft nach Code-Änderung noch auf altem Stand

**Symptom:**
Endpoint gibt 404 oder altes Verhalten, obwohl der Code geändert wurde.
`docker compose up -d --build` hat scheinbar nichts getan.

**Ursache:**
Docker nutzt gecachte Layer. `--build` reicht nicht wenn sich nur TypeScript-Dateien
geändert haben — der Cache wird nicht invalidiert.

**Lösung:**
```bash
docker compose build --no-cache server
docker compose up -d server
```

**Zur Kontrolle** (prüfen ob neue Version läuft):
```bash
docker compose logs server --tail=30
```

---

### Backend vergessen zu deployen

**Symptom:**
Frontend-Änderungen sind live (Coolify deployed automatisch), Backend-Änderungen nicht.

**Ursache:**
Das Frontend liegt auf Coolify (automatisches Git-Deployment).
Das Backend liegt auf dem VPS (Hostinger Frankfurt) und muss **manuell** deployed werden.

**Lösung:**
Nach jedem Backend-Commit auf dem VPS ausführen:
```bash
cd /path/to/app
git pull
docker compose build --no-cache server
docker compose up -d server
docker compose logs server --tail=50
```

**Merkhilfe:**
> Coolify = Frontend (automatisch). VPS-Terminal = Backend (manuell).

---

## Frontend

### Click-Event auf innerem Element wird blockiert (Button-in-Button)

**Symptom:**
Ein Button innerhalb eines anderen Buttons löst keinen Click aus.
Besonders bei disabled-Zustand des äußeren Buttons.

**Ursache:**
`<button>` darf laut HTML-Spec keine interaktiven Elemente enthalten.
Browser-Verhalten: Click-Events propagieren nicht durch disabled `<button>` hindurch.

**Lösung:**
Äußeres Element von `<button>` auf `<div role="button" tabIndex={0}>` ändern
und Click-Logik mit `onClick` + `onKeyDown` (Enter/Space) selbst verwalten:
```jsx
<div
  role="button"
  tabIndex={0}
  onClick={handleCardClick}
  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
  className="cursor-pointer ..."
>
  <button onClick={innerAction}>...</button>
</div>
```

---

## NestJS / Backend

### TypeScript-Fehler: `unknown[]` nicht zuweisbar zu `Prisma.JsonValue[]`

**Symptom:**
Build schlägt fehl:
```
Type 'unknown[]' is not assignable to type 'JsonValue[]'
```

**Ursache:**
Prisma `Json?`-Felder werden als `Prisma.JsonValue | null` typisiert.
`Array.from()` oder `.map()` auf einem `unknown`-Wert gibt `unknown[]` zurück.

**Lösung:**
Expliziter Cast nach dem Array-Aufbau:
```typescript
const result = (Array.isArray(fallback) ? fallback : []) as Prisma.JsonValue[];
```

---

*Zuletzt aktualisiert: April 2026*
