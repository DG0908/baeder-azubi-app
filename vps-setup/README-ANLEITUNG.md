# Supabase Self-Hosted — Anleitung für smartbaden.de

## Übersicht

Diese Skripte installieren und konfigurieren eine vollständige Supabase-Instanz auf einem Ubuntu 24.04 VPS (2 CPU, 8 GB RAM, 100 GB SSD).

| Dienst | URL |
|--------|-----|
| API (PostgREST, Auth, Realtime, Storage) | `https://db.smartbaden.de` |
| Studio (Dashboard) | `https://studio.smartbaden.de` |
| App | `https://azubi.smartbaden.de` (bleibt auf Netlify/Vercel) |

---

## Voraussetzungen

- Ubuntu 24.04 VPS mit Root-Zugang (SSH)
- Domain `smartbaden.de` mit DNS-Verwaltung
- Aktuelles Supabase Cloud Projekt (ID: `ummqefvkrpzqdznvcnek`)

---

## Schritt 1: DNS-Einträge setzen

Erstelle diese DNS-Einträge bei deinem Domain-Anbieter **bevor** du das Installationsskript ausführst:

| Typ | Name | Wert | TTL |
|-----|------|------|-----|
| A | `db.smartbaden.de` | `DEINE_VPS_IP` | 300 |
| A | `studio.smartbaden.de` | `DEINE_VPS_IP` | 300 |

Prüfe die Propagierung:
```bash
dig db.smartbaden.de +short
dig studio.smartbaden.de +short
```

Beide sollten deine VPS-IP zurückgeben.

---

## Schritt 2: Skripte auf den Server kopieren

```bash
# Vom lokalen Rechner aus:
scp -r vps-setup/ root@DEINE_VPS_IP:/root/vps-setup/

# Auf dem Server:
ssh root@DEINE_VPS_IP
cd /root/vps-setup
chmod +x *.sh
```

---

## Schritt 3: Installation (01-install.sh)

Dieses Skript macht Folgendes:
- Aktualisiert Ubuntu und installiert alle Abhängigkeiten
- Installiert Docker, Docker Compose, Nginx, Certbot
- Klont das offizielle Supabase Docker-Setup
- Generiert sichere JWT-Schlüssel (JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY)
- Erstellt eine `.env`-Datei mit allen Konfigurationen
- Richtet Nginx als Reverse Proxy ein (mit SSL)
- Holt SSL-Zertifikate von Let's Encrypt

```bash
sudo bash 01-install.sh
```

### Nach der Installation: .env bearbeiten

```bash
nano /opt/supabase/docker/.env
```

Ändere mindestens diese Werte:
- `POSTGRES_PASSWORD` — Ein sicheres Datenbankpasswort
- `GOTRUE_SMTP_HOST` — Dein SMTP-Server (z.B. `smtp.gmail.com`)
- `GOTRUE_SMTP_USER` — SMTP-Benutzername
- `GOTRUE_SMTP_PASS` — SMTP-Passwort

Dann starte Supabase:
```bash
cd /opt/supabase/docker
docker compose up -d
```

### Prüfe ob alles läuft:
```bash
docker compose ps
curl -s https://db.smartbaden.de/rest/v1/ | head
```

---

## Schritt 4: Datenbank migrieren (02-migrate.sh)

### Supabase Cloud Verbindungsstring finden

1. Öffne das [Supabase Dashboard](https://supabase.com/dashboard/project/ummqefvkrpzqdznvcnek)
2. Gehe zu **Settings** → **Database**
3. Scrolle zu **Connection string** → **URI**
4. Kopiere den **Direct connection** String (Port 5432, NICHT Port 6543!)
5. Ersetze `[YOUR-PASSWORD]` mit deinem Datenbank-Passwort

Der String sieht so aus:
```
postgresql://postgres.ummqefvkrpzqdznvcnek:[DEIN-PASSWORT]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

### Migration ausführen

```bash
sudo bash 02-migrate.sh "postgresql://postgres.ummqefvkrpzqdznvcnek:[DEIN-PASSWORT]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

Das Skript:
- Exportiert Schema und Daten aus Supabase Cloud
- Importiert alles in die lokale Datenbank
- Zeigt einen Zeilenvergleich (Cloud vs. Lokal) zur Verifizierung

### Wichtig:
- Verwende den **Direct connection** String (Port 5432)
- Die Migration überschreibt die lokale Datenbank
- Ein vollständiger Dump wird als Backup gespeichert unter `/opt/supabase/migration/`

---

## Schritt 5: App umstellen

Nach erfolgreicher Migration muss die App auf den neuen Server zeigen.

### supabase.js aktualisieren

Suche in deinem Projekt nach der Supabase-Konfiguration (z.B. `src/supabase.js` oder `src/lib/supabase.js`):

**Vorher (Supabase Cloud):**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ummqefvkrpzqdznvcnek.supabase.co'
const supabaseAnonKey = 'ALTER_ANON_KEY_VON_CLOUD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Nachher (Self-Hosted):**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://db.smartbaden.de'
const supabaseAnonKey = 'NEUER_ANON_KEY_AUS_ENV_DATEI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Den neuen ANON_KEY findest du in `/opt/supabase/docker/.env` (Zeile `ANON_KEY=...`).

### Environment-Variablen (falls verwendet)

Falls du `.env`-Dateien oder Netlify/Vercel Environment Variables verwendest:

```
VITE_SUPABASE_URL=https://db.smartbaden.de
VITE_SUPABASE_ANON_KEY=NEUER_ANON_KEY
```

### App deployen

```bash
npm run build
# Deploy auf Netlify/Vercel wie gewohnt
```

---

## Schritt 6: Cronjobs einrichten (setup-cron.sh)

```bash
sudo bash setup-cron.sh
```

Richtet ein:
- **Backup** täglich um 3:00 Uhr → `/opt/supabase/backups/`
- **Gesundheitscheck** alle 5 Minuten → startet gefallene Container automatisch neu
- **SSL-Erneuerung** 2x täglich → erneuert Let's Encrypt Zertifikate

Logs ansehen:
```bash
tail -f /var/log/supabase/health-check.log
tail -f /var/log/supabase/backup.log
```

---

## Wartung

### Manuelles Backup erstellen

```bash
sudo bash /opt/supabase/scripts/03-backup.sh
```

Backups werden gespeichert unter `/opt/supabase/backups/` und nach 30 Tagen automatisch gelöscht.

### Supabase aktualisieren (04-update.sh)

```bash
sudo bash 04-update.sh
```

Das Skript:
1. Erstellt zuerst ein Backup
2. Lädt die neuesten Docker-Images herunter
3. Startet die Container neu
4. Prüft ob alles läuft

**Achtung:** Während des Updates ist die App ca. 1-3 Minuten nicht erreichbar.

### Gesundheitscheck manuell ausführen

```bash
sudo bash /opt/supabase/scripts/05-health-check.sh
```

### Logs ansehen

```bash
# Container-Logs
cd /opt/supabase/docker
docker compose logs -f              # Alle
docker compose logs -f supabase-db  # Nur Datenbank
docker compose logs -f supabase-auth # Nur Auth

# Eigene Logs
tail -f /var/log/supabase/health-check.log
tail -f /var/log/supabase/backup.log
```

### Container-Status

```bash
cd /opt/supabase/docker
docker compose ps
```

### Einzelnen Container neustarten

```bash
cd /opt/supabase/docker
docker compose restart supabase-auth    # z.B. Auth neustarten
docker compose restart supabase-db      # Datenbank neustarten
```

---

## Troubleshooting

### Problem: "certbot fehlgeschlagen"

**Ursache:** DNS-Einträge noch nicht propagiert.

**Lösung:**
```bash
# DNS prüfen
dig db.smartbaden.de +short

# Wenn die IP korrekt ist, certbot erneut ausführen:
certbot --nginx -d db.smartbaden.de -d studio.smartbaden.de
```

### Problem: Container startet nicht

```bash
# Logs des Containers ansehen
cd /opt/supabase/docker
docker compose logs supabase-db

# Häufig: POSTGRES_PASSWORD nicht gesetzt
# Lösung: .env bearbeiten und Container neustarten
nano .env
docker compose down
docker compose up -d
```

### Problem: "Connection refused" bei der Migration

**Ursache:** Supabase Cloud blockiert die IP oder falscher Verbindungsstring.

**Lösung:**
1. Prüfe ob du den **Direct connection** String (Port 5432) verwendest
2. Nicht den Pooler-String (Port 6543)
3. Prüfe ob die IP des VPS nicht geblockt ist

### Problem: App bekommt "Invalid API key"

**Ursache:** Der ANON_KEY in der App stimmt nicht mit dem auf dem Server überein.

**Lösung:**
```bash
# ANON_KEY auf dem Server auslesen:
grep ANON_KEY /opt/supabase/docker/.env

# Diesen Key in die App-Konfiguration eintragen
```

### Problem: Auth/Login funktioniert nicht

**Ursache:** GOTRUE_SITE_URL oder Redirect-URLs falsch konfiguriert.

**Lösung:**
```bash
nano /opt/supabase/docker/.env

# Prüfe diese Werte:
# GOTRUE_SITE_URL=https://azubi.smartbaden.de
# GOTRUE_URI_ALLOW_LIST=https://azubi.smartbaden.de,https://azubi.smartbaden.de/**

# Dann neustarten:
cd /opt/supabase/docker
docker compose restart supabase-auth
```

### Problem: Festplatte voll

```bash
# Docker-Bereinigung
docker system prune -a --volumes

# Alte Backups prüfen
du -sh /opt/supabase/backups/
ls -la /opt/supabase/backups/

# Älteste Backups manuell löschen
rm /opt/supabase/backups/supabase_backup_2024*.sql.gz
```

### Problem: SSL-Zertifikat abgelaufen

```bash
# Manuell erneuern
certbot renew --force-renewal
systemctl reload nginx
```

### Problem: Realtime (WebSocket) funktioniert nicht

**Ursache:** Nginx leitet WebSocket-Verbindungen nicht weiter.

**Lösung:** Prüfe die Nginx-Konfiguration:
```bash
# Diese Zeilen müssen in der db.smartbaden.de Config stehen:
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_http_version 1.1;

# Falls fehlend, neu laden:
nginx -t && systemctl reload nginx
```

---

## Dateiübersicht

| Datei | Zweck |
|-------|-------|
| `01-install.sh` | Vollständige Installation (einmalig) |
| `02-migrate.sh` | Datenbank von Cloud migrieren (einmalig) |
| `03-backup.sh` | Datenbank-Backup (täglich via cron) |
| `04-update.sh` | Supabase aktualisieren (bei Bedarf) |
| `05-health-check.sh` | Gesundheitscheck (alle 5 Min. via cron) |
| `setup-cron.sh` | Cronjobs einrichten (einmalig) |

## Wichtige Verzeichnisse auf dem Server

| Pfad | Inhalt |
|------|--------|
| `/opt/supabase/docker/` | Docker Compose + .env |
| `/opt/supabase/docker/.env` | Alle Konfigurationen und Keys |
| `/opt/supabase/backups/` | Datenbank-Backups |
| `/opt/supabase/scripts/` | Cron-Skripte |
| `/var/log/supabase/` | Log-Dateien |
| `/etc/nginx/sites-available/` | Nginx-Konfigurationen |
| `/etc/letsencrypt/` | SSL-Zertifikate |

---

## Rückfall auf Supabase Cloud

Falls Probleme auftreten, kannst du jederzeit zurück zu Supabase Cloud wechseln:

1. In der App `supabaseUrl` zurück auf `https://ummqefvkrpzqdznvcnek.supabase.co` setzen
2. Den alten ANON_KEY wieder eintragen
3. App deployen

Die Cloud-Instanz läuft weiterhin parallel, solange du sie nicht löschst.
