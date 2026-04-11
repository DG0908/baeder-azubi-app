# Server-Cheatsheet — smartbaden.de VPS

> Hostinger Frankfurt · Coolify · Docker Compose  
> Zuletzt aktualisiert: 11.04.2026

---

## SSH-Zugang

```bash
ssh root@smartbaden.de
```

---

## Container-Namen herausfinden

```bash
docker ps
```

Bekannte Namen (Stand 11.04.2026):
- Server (NestJS):  `azubi-app-server-1`
- Frontend (Nginx): `azubi-app-web-1`
- Datenbank:        `azubi-app-postgres-1`
- Push-Backend:     `azubi-push-backend`

---

## Prisma-Migrationen ausführen

**Nach jedem Deploy der eine neue Migration enthält:**

```bash
# Container-Name aus `docker ps` ermitteln, dann:
docker exec <server-container-name> npx prisma migrate deploy

# Aktueller Container-Name:
docker exec azubi-app-server-1 npx prisma migrate deploy
```

> Wann nötig? Immer wenn in `server/prisma/migrations/` ein neues Verzeichnis
> committed wurde. Im Commit-Log steht dann z.B. `feat: add-feature-flags`.

---

## Logs anschauen

```bash
# Server-Logs (letzte 100 Zeilen, live):
docker logs <server-container-name> --tail=100 -f

# Alle Container:
docker compose logs -f
```

---

## App neu starten (ohne Rebuild)

```bash
docker restart <server-container-name>
```

---

## Vollständiges Re-Deployment

```bash
cd /root/baeder-azubi-app   # oder Coolify-Pfad
git pull origin main
docker compose build
docker compose up -d
docker exec <server-container-name> npx prisma migrate deploy
```

---

## Datenbank-Backup

```bash
# Backup erstellen:
./ops/backup-postgres.sh

# Backup lokal ziehen (von Windows-Seite):
./ops/pull-backup-to-local.ps1
```

---

## Health-Check

```bash
curl -s https://smartbaden.de/api/health
# Erwartet: { "status": "ok" }
```

---

## Häufige Fehler

| Symptom | Ursache | Fix |
|---|---|---|
| `500` auf `/api/app-config` | Migration fehlt (neue DB-Spalte) | `docker exec ... npx prisma migrate deploy` |
| App startet nicht | Build-Fehler | `docker logs <server>` |
| Login schlägt fehl | JWT-Secret fehlt | Coolify → Umgebungsvariablen prüfen |
| Container-Name unbekannt | Nach Coolify-Rebuild ändern sich Namen | `docker ps` |
