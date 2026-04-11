# Restore-Drill Dokumentation

> **Zweck:** Schritt-für-Schritt Anleitung zum Testen von PostgreSQL-Backups in einer isolierten Umgebung.
> **Wichtigkeit:** Backups sind wertlos wenn sie nie getestet wurden. Dieses Dokument stellt sicher, dass Restore-Prozeduren funktionieren und im Notfall schnell ausgeführt werden können.

---

## 1. Voraussetzungen

| Requirement | Status |
|-------------|--------|
| Docker + Docker Compose installiert | ✅ |
| Zugriff auf VPS (`ssh root@smartbaden.de`) | ✅ |
| Backup-Datei vorhanden (`./backups/azubi-app-*.sql.gz`) | ✅ |
| `RESTORE_CONFIRM=YES` für Restore-Skript | ✅ |

---

## 2. Restore-Drill Ablauf

### 2.1 Backup erstellen (falls nicht vorhanden)

```bash
# Auf dem VPS
ssh root@smartbaden.de
cd /opt/baeder-azubi-app

# Aktuelles Backup erstellen
./ops/backup-postgres.sh

# Datei verifizieren
ls -lh ./backups/
```

### 2.2 Isolierte Testumgebung starten

**WICHTIG:** Nie auf der Produktions-Datenbank testen!

```bash
# Docker Compose Overlay für Drill erstellen
cat > docker-compose.drill.yml <<'EOF'
services:
  postgres-drill:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: azubi_app_drill
      POSTGRES_USER: azubi_app
      POSTGRES_PASSWORD: drill_test_password_123
    ports:
      - "15432:5432"
    volumes:
      - postgres-drill-data:/var/lib/postgresql/data
    security_opt:
      - no-new-privileges:true

volumes:
  postgres-drill-data:
EOF

# Drill-DB starten
docker compose -f docker-compose.drill.yml up -d

# Warten bis DB bereit ist
sleep 5
docker compose -f docker-compose.drill.yml exec postgres-drill pg_isready -U azubi_app -d azubi_app_drill
```

### 2.3 Restore in Drill-Umgebung

```bash
# Neuestes Backup finden
LATEST_BACKUP=$(ls -t ./backups/azubi-app-*.sql.gz | head -1)
echo "Restore file: ${LATEST_BACKUP}"

# Restore durchführen
RESTORE_CONFIRM=YES ./ops/restore-postgres.sh "${LATEST_BACKUP}"

# Connection String für Drill-DB
export DRILL_DB_URL="postgresql://azubi_app:drill_test_password_123@localhost:15432/azubi_app_drill"
```

### 2.4 Restore verifizieren

```bash
# Tabellen auflisten
docker compose -f docker-compose.drill.yml exec postgres-drill \
  psql -U azubi_app -d azubi_app_drill -c "\dt"

# Zeilenanzahl prüfen (Produktion vs. Drill)
docker compose -f docker-compose.drill.yml exec postgres-drill \
  psql -U azubi_app -d azubi_app_drill -c "
    SELECT schemaname, tablename, n_live_tup
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC;
  "

# Wichtige Tabellen prüfen
docker compose -f docker-compose.drill.yml exec postgres-drill \
  psql -U azubi_app -d azubi_app_drill -c "
    SELECT 'users' as table_name, COUNT(*) FROM \"User\"
    UNION ALL
    SELECT 'duels', COUNT(*) FROM \"Duel\"
    UNION ALL
    SELECT 'chat_messages', COUNT(*) FROM \"ChatMessage\"
    UNION ALL
    SELECT 'organizations', COUNT(*) FROM \"Organization\";
  "
```

### 2.5 Drill-Protokoll erstellen

```bash
# Protokoll-Datei
cat > ./backups/restore-drill-$(date +%Y%m%d).log <<EOF
=== Restore-Drill Protokoll ===
Datum: $(date)
Backup-Datei: ${LATEST_BACKUP}
Backup-Größe: $(du -h ${LATEST_BACKUP} | cut -f1)
Restore-Dauer: $(time RESTORE_CONFIRM=YES ./ops/restore-postgres.sh ${LATEST_BACKUP} 2>&1)
Tabellen wiederhergestellt: $(docker compose -f docker-compose.drill.yml exec postgres-drill psql -U azubi_app -d azubi_app_drill -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
Zeilen gesamt: $(docker compose -f docker-compose.drill.yml exec postgres-drill psql -U azubi_app -d azubi_app_drill -t -c "SELECT SUM(n_live_tup) FROM pg_stat_user_tables;")
Status: ERFOLGREICH
EOF
```

### 2.6 Aufräumen

```bash
# Drill-Umgebung stoppen und entfernen
docker compose -f docker-compose.drill.yml down -v

# Overlay-Datei löschen
rm docker-compose.drill.yml
```

---

## 3. Produktions-Restore (NUR im Notfall!)

**⚠️ ACHTUNG:** Dies überschreibt die Produktionsdatenbank!

```bash
# 1. Backup erstellen (immer!)
./ops/backup-postgres.sh

# 2. Wartungsmodus aktivieren (falls vorhanden)
# docker compose exec server npx nestjs-cli maintenance enable

# 3. Restore durchführen
RESTORE_CONFIRM=YES ./ops/restore-postgres.sh ./backups/azubi-app-YYYYMMDD-HHMMSS.sql.gz

# 4. Server neustarten
docker compose restart server

# 5. Health-Checks
curl -s http://localhost/healthz
curl -s http://localhost/api/v1/health

# 6. Wartungsmodus deaktivieren
# docker compose exec server npx nestjs-cli maintenance disable
```

---

## 4. Restore-Drill Zeitplan

| Frequenz | Aktion | Verantwortlich |
|----------|--------|----------------|
| **Wöchentlich** | Automatisches Backup (Cron) | System |
| **Monatlich** | Restore-Drill in Testumgebung | DevOps |
| **Quartal** | Vollständiger Drill mit Protokoll | Tech Lead |
| **Nach Major Release** | Restore-Drill Pflicht | DevOps |

---

## 5. Troubleshooting

| Problem | Lösung |
|---------|--------|
| `pg_isready` timeout | DB-Start abwarten: `docker compose logs -f postgres-drill` |
| Restore fehlschlägt | Backup-Integrität prüfen: `gunzip -t backup.sql.gz` |
| Tabellen fehlen | Schema-Migrationen nach Restore: `npx prisma migrate deploy` |
| Daten inkonsistent | Foreign-Key-Checks: `SELECT * FROM pg_stat_user_tables WHERE n_live_tup = 0;` |

---

## 6. Erfolgs-Kriterien

Ein Restore-Drill gilt als **erfolgreich** wenn:

- [ ] Restore ohne Fehler durchläuft
- [ ] Alle Tabellen vorhanden sind
- [ ] Zeilenanzahl mit Backup übereinstimmt (±5% Toleranz)
- [ ] Wichtige Tabellen (User, Duel, Chat) Daten enthalten
- [ ] Protokoll erstellt und archiviert ist
- [ ] Drill-Dauer < 15 Minuten (für typische DB-Größe)

---

## 7. Historie

| Datum | Backup-Datei | Dauer | Status | Durchgeführt von |
|-------|-------------|-------|--------|------------------|
| 2026-04-11 | `azubi-app-20260411-*.sql.gz` | -- | -- | -- |
| *Erster Drill steht aus* | | | | |
