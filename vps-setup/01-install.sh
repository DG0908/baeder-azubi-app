#!/usr/bin/env bash
###############################################################################
# 01-install.sh — Vollständige Supabase Self-Hosted Installation
#
# Ziel-Server: Ubuntu 24.04, 2 CPU, 8 GB RAM, 100 GB SSD
# Domain:      db.smartbaden.de  (API / Kong)
#              studio.smartbaden.de (Supabase Studio)
#
# Verwendung:  sudo bash 01-install.sh
###############################################################################
set -euo pipefail

# ─── Farben ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[FEHLER]${NC} $*"; }

# ─── Root-Check ──────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  error "Dieses Skript muss als root ausgeführt werden (sudo)."
  exit 1
fi

SUPABASE_DIR="/opt/supabase"
BACKUP_DIR="${SUPABASE_DIR}/backups"
LOG_DIR="/var/log/supabase"
DOMAIN_API="db.smartbaden.de"
DOMAIN_STUDIO="studio.smartbaden.de"
EMAIL_CERTBOT="admin@smartbaden.de"

echo ""
echo "============================================================"
echo "  Supabase Self-Hosted Installation für smartbaden.de"
echo "============================================================"
echo ""
warn "Stelle sicher, dass die DNS-Einträge bereits gesetzt sind:"
echo "  ${DOMAIN_API}    → IP dieses Servers"
echo "  ${DOMAIN_STUDIO} → IP dieses Servers"
echo ""
read -rp "Weiter? (j/n) " CONFIRM
[[ "$CONFIRM" != "j" ]] && { echo "Abgebrochen."; exit 0; }

###############################################################################
# 1. System aktualisieren
###############################################################################
info "System wird aktualisiert …"
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git jq openssl apt-transport-https ca-certificates \
  gnupg lsb-release ufw

###############################################################################
# 2. Docker installieren
###############################################################################
if command -v docker &>/dev/null; then
  info "Docker ist bereits installiert: $(docker --version)"
else
  info "Docker wird installiert …"
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  systemctl enable docker
  systemctl start docker
  info "Docker installiert: $(docker --version)"
fi

# Docker Compose (Plugin) prüfen
if docker compose version &>/dev/null; then
  info "Docker Compose Plugin: $(docker compose version)"
else
  error "Docker Compose Plugin konnte nicht gefunden werden."
  exit 1
fi

###############################################################################
# 3. Nginx installieren
###############################################################################
info "Nginx wird installiert …"
apt-get install -y nginx
systemctl enable nginx

###############################################################################
# 4. Certbot installieren
###############################################################################
info "Certbot wird installiert …"
apt-get install -y certbot python3-certbot-nginx

###############################################################################
# 5. Firewall konfigurieren
###############################################################################
info "Firewall wird konfiguriert …"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
info "Firewall aktiv — SSH, HTTP, HTTPS erlaubt."

###############################################################################
# 6. Verzeichnisse erstellen
###############################################################################
info "Verzeichnisse werden erstellt …"
mkdir -p "${SUPABASE_DIR}" "${BACKUP_DIR}" "${LOG_DIR}"

###############################################################################
# 7. Supabase Docker-Setup klonen
###############################################################################
info "Supabase Docker-Setup wird geklont …"
if [[ -d "${SUPABASE_DIR}/docker" ]]; then
  warn "Verzeichnis ${SUPABASE_DIR}/docker existiert bereits — wird aktualisiert."
  cd "${SUPABASE_DIR}/docker"
  git pull
else
  git clone --depth 1 https://github.com/supabase/supabase.git "${SUPABASE_DIR}/repo"
  cp -r "${SUPABASE_DIR}/repo/docker" "${SUPABASE_DIR}/docker"
fi
cd "${SUPABASE_DIR}/docker"

###############################################################################
# 8. JWT-Schlüssel und API-Keys generieren
###############################################################################
info "JWT-Schlüssel werden generiert …"

# 256-Bit-Secret für HS256 (mind. 32 Zeichen, base64-kodiert für Stärke)
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n/+=')

# Hilfsfunktion: JWT erzeugen (HS256)
generate_jwt() {
  local role="$1"
  local secret="$2"
  # JWT Header
  local header
  header=$(echo -n '{"alg":"HS256","typ":"JWT"}' | openssl base64 -e | tr -d '=\n' | tr '/+' '_-')
  # JWT Payload — gültig bis 2040
  local payload
  payload=$(echo -n "{\"role\":\"${role}\",\"iss\":\"supabase\",\"iat\":$(date +%s),\"exp\":2240524800}" \
    | openssl base64 -e | tr -d '=\n' | tr '/+' '_-')
  # Signatur
  local signature
  signature=$(echo -n "${header}.${payload}" \
    | openssl dgst -sha256 -hmac "${secret}" -binary \
    | openssl base64 -e | tr -d '=\n' | tr '/+' '_-')
  echo "${header}.${payload}.${signature}"
}

ANON_KEY=$(generate_jwt "anon" "${JWT_SECRET}")
SERVICE_ROLE_KEY=$(generate_jwt "service_role" "${JWT_SECRET}")

info "JWT_SECRET erzeugt (${#JWT_SECRET} Zeichen)"
info "ANON_KEY erzeugt"
info "SERVICE_ROLE_KEY erzeugt"

###############################################################################
# 9. .env-Datei erstellen
###############################################################################
info ".env-Datei wird erstellt …"

# Dashboard-Passwort generieren
DASHBOARD_PASSWORD=$(openssl rand -base64 24 | tr -d '\n/+=')

cat > "${SUPABASE_DIR}/docker/.env" <<ENVEOF
############################################################
# Supabase Self-Hosted — .env
# Generiert am $(date '+%Y-%m-%d %H:%M:%S')
#
# WICHTIG: Ändere POSTGRES_PASSWORD und DASHBOARD_PASSWORD!
############################################################

## --- Allgemein ---
POSTGRES_PASSWORD=CHANGE_ME_sicheres_db_passwort
JWT_SECRET=${JWT_SECRET}
ANON_KEY=${ANON_KEY}
SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}

## --- API / Kong ---
SITE_URL=https://${DOMAIN_API}
API_EXTERNAL_URL=https://${DOMAIN_API}
SUPABASE_PUBLIC_URL=https://${DOMAIN_API}

## --- Studio ---
STUDIO_DEFAULT_ORGANIZATION=smartbaden
STUDIO_DEFAULT_PROJECT=baeder-azubi-app
STUDIO_PORT=3000
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}

## --- Auth (GoTrue) ---
GOTRUE_SITE_URL=https://azubi.smartbaden.de
GOTRUE_URI_ALLOW_LIST=https://azubi.smartbaden.de,https://azubi.smartbaden.de/**
GOTRUE_DISABLE_SIGNUP=false
GOTRUE_EXTERNAL_EMAIL_ENABLED=true
GOTRUE_MAILER_AUTOCONFIRM=false
GOTRUE_SMS_AUTOCONFIRM=false
GOTRUE_JWT_EXPIRY=3600
GOTRUE_JWT_DEFAULT_GROUP_NAME=authenticated

## --- SMTP (anpassen!) ---
GOTRUE_SMTP_HOST=CHANGE_ME_smtp_host
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=CHANGE_ME_smtp_user
GOTRUE_SMTP_PASS=CHANGE_ME_smtp_pass
GOTRUE_SMTP_ADMIN_EMAIL=noreply@smartbaden.de
GOTRUE_SMTP_SENDER_NAME=SmartBaden
GOTRUE_MAILER_URLPATHS_INVITE=/auth/v1/verify
GOTRUE_MAILER_URLPATHS_CONFIRMATION=/auth/v1/verify
GOTRUE_MAILER_URLPATHS_RECOVERY=/auth/v1/verify

## --- Postgres ---
POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432

## --- Realtime ---
REALTIME_IP_HEADER=x-forwarded-for

## --- Storage ---
STORAGE_BACKEND=file
FILE_SIZE_LIMIT=52428800
IMGPROXY_ENABLE_WEBP_DETECTION=true

## --- Meta / Analytics ---
LOGFLARE_API_KEY=$(openssl rand -hex 16)

## --- Docker ---
DOCKER_SOCKET_LOCATION=/var/run/docker.sock
ENVEOF

info ".env-Datei erstellt unter ${SUPABASE_DIR}/docker/.env"
warn "WICHTIG: Bearbeite die .env-Datei und setze POSTGRES_PASSWORD und SMTP-Einstellungen!"
echo "  nano ${SUPABASE_DIR}/docker/.env"

###############################################################################
# 10. Nginx-Konfiguration
###############################################################################
info "Nginx-Konfiguration wird erstellt …"

# ── db.smartbaden.de (API über Kong, Port 8000) ──
cat > /etc/nginx/sites-available/${DOMAIN_API} <<'NGINX_API'
# Supabase API (Kong) — db.smartbaden.de
# SSL wird von certbot hinzugefügt

server {
    listen 80;
    server_name db.smartbaden.de;

    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name db.smartbaden.de;

    # SSL-Zertifikate werden von certbot gesetzt
    ssl_certificate     /etc/letsencrypt/live/db.smartbaden.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/db.smartbaden.de/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Sicherheits-Header
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Request-Größe für Uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # WebSocket-Unterstützung (Realtime)
        proxy_http_version 1.1;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
NGINX_API

# ── studio.smartbaden.de (Studio, Port 3000) ──
cat > /etc/nginx/sites-available/${DOMAIN_STUDIO} <<'NGINX_STUDIO'
# Supabase Studio — studio.smartbaden.de
# SSL wird von certbot hinzugefügt

server {
    listen 80;
    server_name studio.smartbaden.de;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name studio.smartbaden.de;

    ssl_certificate     /etc/letsencrypt/live/studio.smartbaden.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/studio.smartbaden.de/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # IP-Beschränkung (optional — eigene IP eintragen)
    # allow YOUR_IP;
    # deny all;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX_STUDIO

# Symlinks erstellen
ln -sf /etc/nginx/sites-available/${DOMAIN_API} /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/${DOMAIN_STUDIO} /etc/nginx/sites-enabled/

# Default-Site entfernen
rm -f /etc/nginx/sites-enabled/default

###############################################################################
# 11. SSL-Zertifikate holen (HTTP-only zuerst)
###############################################################################
info "SSL-Zertifikate werden angefordert …"
echo ""
warn "Falls die DNS-Einträge noch nicht propagiert sind, wird certbot fehlschlagen."
warn "In dem Fall: Skript erneut ausführen oder manuell: certbot --nginx"
echo ""

# Temporäre Nginx-Config ohne SSL für certbot
cat > /etc/nginx/sites-available/temp-certbot <<TEMPCFG
server {
    listen 80;
    server_name ${DOMAIN_API} ${DOMAIN_STUDIO};
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    location / {
        return 200 'Certbot Setup';
        add_header Content-Type text/plain;
    }
}
TEMPCFG

# Temporär nur die certbot-Config aktivieren
rm -f /etc/nginx/sites-enabled/${DOMAIN_API}
rm -f /etc/nginx/sites-enabled/${DOMAIN_STUDIO}
ln -sf /etc/nginx/sites-available/temp-certbot /etc/nginx/sites-enabled/temp-certbot
nginx -t && systemctl restart nginx

# Zertifikate anfordern
certbot certonly --webroot -w /var/www/html \
  -d "${DOMAIN_API}" \
  -d "${DOMAIN_STUDIO}" \
  --non-interactive --agree-tos -m "${EMAIL_CERTBOT}" \
  || warn "Certbot fehlgeschlagen — Zertifikate manuell anfordern!"

# Temporäre Config entfernen und richtige aktivieren
rm -f /etc/nginx/sites-enabled/temp-certbot
rm -f /etc/nginx/sites-available/temp-certbot
ln -sf /etc/nginx/sites-available/${DOMAIN_API} /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/${DOMAIN_STUDIO} /etc/nginx/sites-enabled/

nginx -t && systemctl restart nginx
info "Nginx konfiguriert und gestartet."

###############################################################################
# 12. Supabase starten
###############################################################################
info "Supabase-Container werden gestartet …"
echo ""
warn "Stelle sicher, dass POSTGRES_PASSWORD in der .env gesetzt ist!"
read -rp "Wurde die .env-Datei bearbeitet? Jetzt starten? (j/n) " START_CONFIRM
if [[ "$START_CONFIRM" == "j" ]]; then
  cd "${SUPABASE_DIR}/docker"
  docker compose pull
  docker compose up -d
  info "Supabase-Container gestartet!"
  echo ""
  docker compose ps
else
  warn "Supabase nicht gestartet. Starte manuell:"
  echo "  cd ${SUPABASE_DIR}/docker && docker compose up -d"
fi

###############################################################################
# 13. Zusammenfassung
###############################################################################
echo ""
echo "============================================================"
echo -e "${GREEN}  Installation abgeschlossen!${NC}"
echo "============================================================"
echo ""
echo "Wichtige Dateien:"
echo "  .env:         ${SUPABASE_DIR}/docker/.env"
echo "  Backups:      ${BACKUP_DIR}/"
echo "  Logs:         ${LOG_DIR}/"
echo ""
echo "Zugangsdaten:"
echo "  Studio:       https://${DOMAIN_STUDIO}"
echo "  API:          https://${DOMAIN_API}"
echo "  Studio User:  admin"
echo "  Studio Pass:  ${DASHBOARD_PASSWORD}"
echo ""
echo "Generierte Keys (auch in .env gespeichert):"
echo "  ANON_KEY:         ${ANON_KEY:0:40}…"
echo "  SERVICE_ROLE_KEY: ${SERVICE_ROLE_KEY:0:40}…"
echo ""
echo -e "${YELLOW}Nächste Schritte:${NC}"
echo "  1. .env bearbeiten (POSTGRES_PASSWORD, SMTP)"
echo "  2. docker compose up -d  (falls noch nicht gestartet)"
echo "  3. 02-migrate.sh ausführen für Datenmigration"
echo "  4. setup-cron.sh ausführen für automatische Backups"
echo ""
