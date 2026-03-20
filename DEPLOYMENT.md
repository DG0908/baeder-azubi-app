# Deployment

Diese Datei ist jetzt auf den sicheren Zielbetrieb ausgerichtet. Die fruehere reine Frontend-/Prototypeinrichtung ist **nicht** mehr die massgebliche Deployment-Variante.

## Zielbild

- React/Vite-Frontend hinter Nginx
- NestJS-Backend unter `/api`
- PostgreSQL nur intern
- Docker Compose als Standard-Deployment

## Produktivablauf

1. `.env.example` nach `.env` kopieren und alle Secrets ersetzen
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` und `VITE_WEB_PUSH_PUBLIC_KEY` muessen auch fuer den Docker-Web-Build gesetzt sein.
2. Images bauen:

```bash
docker compose build
```

3. Stack starten:

```bash
docker compose up -d
```

4. Migrationen anwenden:

```bash
docker compose exec server npx prisma migrate deploy
```

5. Health pruefen:

```bash
curl http://localhost/healthz
curl http://localhost/api/health
```

## Vor jedem Release

- Backup erstellen: `./ops/backup-postgres.sh`
- Release-Fenster dokumentieren
- Health und Admin-Login nach Deployment pruefen
- Web-Push mit einem Testgeraet pruefen
- Ergebnis im Betriebsprotokoll festhalten

## Restore

Restore nie ungetestet zuerst auf Produktion ausfuehren.

```bash
RESTORE_CONFIRM=YES ./ops/restore-postgres.sh <backup-file.sql.gz>
```

## Verbindliche Zusatzdokumente

- `README.md`
- `docs/operations-runbook.md`
- `docs/production-go-live-checklist.md`
- `docs/dsgvo-betriebskonzept.md`
