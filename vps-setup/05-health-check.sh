#!/usr/bin/env bash
###############################################################################
# 05-health-check.sh — Supabase Self-Hosted Gesundheitscheck
#
# Verwendung:
#   sudo bash 05-health-check.sh     # Manuell
#   (oder via cron alle 5 Minuten — siehe setup-cron.sh)
#
# Prüft:
#   - Alle Supabase-Container laufen
#   - API antwortet (Kong / PostgREST)
#   - Datenbank erreichbar
#   - Festplattenplatz ausreichend
#   - Startet gefallene Container automatisch neu
###############################################################################
set -euo pipefail

# ─── Konfiguration ──────────────────────────────────────────────────────────
SUPABASE_DIR="/opt/supabase"
DOCKER_DIR="${SUPABASE_DIR}/docker"
ENV_FILE="${DOCKER_DIR}/.env"
LOG_FILE="/var/log/supabase/health-check.log"
DISK_WARN_PERCENT=80
DISK_CRIT_PERCENT=90

# ─── Farben (nur bei Terminal) ───────────────────────────────────────────────
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; NC=''
fi

# ─── Logging ─────────────────────────────────────────────────────────────────
mkdir -p "$(dirname "${LOG_FILE}")"

log()   { echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO]  $*" >> "${LOG_FILE}"; }
logw()  { echo "$(date '+%Y-%m-%d %H:%M:%S') [WARN]  $*" >> "${LOG_FILE}"; }
loge()  { echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $*" >> "${LOG_FILE}"; }

ok()    { echo -e "  ${GREEN}[OK]${NC}     $*"; }
fail()  { echo -e "  ${RED}[FEHLER]${NC} $*"; }
warnt() { echo -e "  ${YELLOW}[WARN]${NC}   $*"; }

# ─── Zähler ──────────────────────────────────────────────────────────────────
ERRORS=0
WARNINGS=0
RESTARTS=0

###############################################################################
# Header
###############################################################################
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Supabase Gesundheitscheck — $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════════════════"
echo ""

###############################################################################
# 1. Docker-Dienst prüfen
###############################################################################
echo -e "${CYAN}[1] Docker-Dienst${NC}"

if systemctl is-active --quiet docker; then
  ok "Docker läuft"
  log "Docker läuft"
else
  fail "Docker ist nicht aktiv!"
  loge "Docker ist nicht aktiv"
  systemctl start docker
  if systemctl is-active --quiet docker; then
    warnt "Docker wurde neu gestartet"
    logw "Docker wurde neu gestartet"
    ((RESTARTS++)) || true
  else
    fail "Docker konnte nicht gestartet werden!"
    loge "Docker-Start fehlgeschlagen"
    ((ERRORS++)) || true
  fi
fi
echo ""

###############################################################################
# 2. Container-Status prüfen
###############################################################################
echo -e "${CYAN}[2] Container-Status${NC}"

cd "${DOCKER_DIR}"

# Erwartete Dienste (Kern-Services von Supabase Docker)
EXPECTED_SERVICES=(
  "supabase-db"
  "supabase-kong"
  "supabase-auth"
  "supabase-rest"
  "supabase-realtime"
  "supabase-storage"
  "supabase-studio"
  "supabase-meta"
)

for service in "${EXPECTED_SERVICES[@]}"; do
  # Suche Container anhand des Namens (enthält den Service-Namen)
  CONTAINER=$(docker ps -a --filter "name=${service}" --format "{{.Names}}|{{.Status}}" | head -1)

  if [[ -z "${CONTAINER}" ]]; then
    fail "${service}: Container nicht gefunden!"
    loge "${service}: Container nicht gefunden"
    ((ERRORS++)) || true
    continue
  fi

  CNAME=$(echo "${CONTAINER}" | cut -d'|' -f1)
  CSTATUS=$(echo "${CONTAINER}" | cut -d'|' -f2)

  if echo "${CSTATUS}" | grep -qi "up"; then
    ok "${service}: ${CSTATUS}"
    log "${service}: running"
  else
    fail "${service}: ${CSTATUS}"
    loge "${service}: ${CSTATUS}"
    ((ERRORS++)) || true

    # Neustart versuchen
    warnt "${service} wird neu gestartet …"
    logw "${service} wird neu gestartet"
    docker compose restart "${service}" 2>/dev/null || docker restart "${CNAME}" 2>/dev/null || true
    sleep 5

    # Erneut prüfen
    NEW_STATUS=$(docker ps --filter "name=${service}" --format "{{.Status}}" | head -1)
    if echo "${NEW_STATUS}" | grep -qi "up"; then
      ok "${service}: nach Neustart wieder aktiv"
      log "${service}: nach Neustart wieder aktiv"
      ((RESTARTS++)) || true
      ((ERRORS--)) || true
    else
      fail "${service}: Neustart fehlgeschlagen!"
      loge "${service}: Neustart fehlgeschlagen"
    fi
  fi
done
echo ""

###############################################################################
# 3. API-Erreichbarkeit prüfen
###############################################################################
echo -e "${CYAN}[3] API-Erreichbarkeit${NC}"

# .env laden für ANON_KEY
if [[ -f "${ENV_FILE}" ]]; then
  ANON_KEY=$(grep '^ANON_KEY=' "${ENV_FILE}" | cut -d= -f2-)
else
  ANON_KEY=""
fi

# Kong / API
if curl -sf -o /dev/null --max-time 10 "http://127.0.0.1:8000/rest/v1/" \
   -H "apikey: ${ANON_KEY}" -H "Authorization: Bearer ${ANON_KEY}"; then
  ok "API (Kong:8000) antwortet"
  log "API antwortet"
else
  fail "API (Kong:8000) antwortet NICHT!"
  loge "API antwortet nicht"
  ((ERRORS++)) || true
fi

# Auth (GoTrue)
if curl -sf -o /dev/null --max-time 10 "http://127.0.0.1:9999/health"; then
  ok "Auth (GoTrue:9999) antwortet"
  log "Auth antwortet"
else
  # Fallback: Auth über Kong
  if curl -sf -o /dev/null --max-time 10 "http://127.0.0.1:8000/auth/v1/health"; then
    ok "Auth (über Kong) antwortet"
    log "Auth antwortet (via Kong)"
  else
    fail "Auth (GoTrue) antwortet NICHT!"
    loge "Auth antwortet nicht"
    ((ERRORS++)) || true
  fi
fi

# Studio
if curl -sf -o /dev/null --max-time 10 "http://127.0.0.1:3000/"; then
  ok "Studio (:3000) antwortet"
  log "Studio antwortet"
else
  warnt "Studio (:3000) antwortet nicht (unkritisch)"
  logw "Studio antwortet nicht"
  ((WARNINGS++)) || true
fi

# HTTPS extern
if curl -sf -o /dev/null --max-time 10 "https://db.smartbaden.de/rest/v1/" \
   -H "apikey: ${ANON_KEY}" -H "Authorization: Bearer ${ANON_KEY}" 2>/dev/null; then
  ok "Externer HTTPS-Zugriff (db.smartbaden.de) funktioniert"
  log "Externer HTTPS-Zugriff OK"
else
  warnt "Externer HTTPS-Zugriff nicht verfügbar"
  logw "Externer HTTPS-Zugriff fehlgeschlagen"
  ((WARNINGS++)) || true
fi
echo ""

###############################################################################
# 4. Datenbank prüfen
###############################################################################
echo -e "${CYAN}[4] Datenbank${NC}"

if [[ -f "${ENV_FILE}" ]]; then
  source "${ENV_FILE}"
fi

DB_CONTAINER=$(docker ps --filter "name=supabase-db" --format "{{.Names}}" | head -1)
if [[ -n "${DB_CONTAINER}" ]]; then
  DB_CHECK=$(docker exec "${DB_CONTAINER}" psql -U postgres -c "SELECT 1;" 2>/dev/null || echo "FEHLER")
  if echo "${DB_CHECK}" | grep -q "1"; then
    ok "PostgreSQL antwortet"
    log "PostgreSQL antwortet"

    # Verbindungszahl prüfen
    CONN_COUNT=$(docker exec "${DB_CONTAINER}" psql -U postgres -t \
      -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ')
    if [[ -n "${CONN_COUNT}" ]]; then
      if [[ "${CONN_COUNT}" -gt 80 ]]; then
        warnt "Hohe Verbindungszahl: ${CONN_COUNT}"
        logw "Hohe Verbindungszahl: ${CONN_COUNT}"
        ((WARNINGS++)) || true
      else
        ok "Aktive Verbindungen: ${CONN_COUNT}"
      fi
    fi

    # DB-Größe
    DB_SIZE=$(docker exec "${DB_CONTAINER}" psql -U postgres -t \
      -c "SELECT pg_size_pretty(pg_database_size('postgres'));" 2>/dev/null | tr -d ' ')
    ok "Datenbankgröße: ${DB_SIZE}"
  else
    fail "PostgreSQL antwortet NICHT!"
    loge "PostgreSQL antwortet nicht"
    ((ERRORS++)) || true
  fi
else
  fail "DB-Container nicht gefunden!"
  loge "DB-Container nicht gefunden"
  ((ERRORS++)) || true
fi
echo ""

###############################################################################
# 5. Festplatte prüfen
###############################################################################
echo -e "${CYAN}[5] Festplattenplatz${NC}"

DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
DISK_FREE=$(df -h / | awk 'NR==2 {print $4}')

if [[ "${DISK_USAGE}" -ge "${DISK_CRIT_PERCENT}" ]]; then
  fail "Festplatte ${DISK_USAGE}% belegt! (Frei: ${DISK_FREE})"
  loge "Festplatte kritisch: ${DISK_USAGE}%"
  ((ERRORS++)) || true
elif [[ "${DISK_USAGE}" -ge "${DISK_WARN_PERCENT}" ]]; then
  warnt "Festplatte ${DISK_USAGE}% belegt (Frei: ${DISK_FREE})"
  logw "Festplatte Warnung: ${DISK_USAGE}%"
  ((WARNINGS++)) || true
else
  ok "Festplatte ${DISK_USAGE}% belegt (Frei: ${DISK_FREE})"
  log "Festplatte: ${DISK_USAGE}% belegt"
fi

# Docker-Volumes
DOCKER_DISK=$(docker system df --format "{{.Size}}" 2>/dev/null | head -1)
ok "Docker belegt: ${DOCKER_DISK:-unbekannt}"

# Backup-Größe
if [[ -d "${SUPABASE_DIR}/backups" ]]; then
  BACKUP_SIZE=$(du -sh "${SUPABASE_DIR}/backups" 2>/dev/null | cut -f1)
  BACKUP_COUNT=$(find "${SUPABASE_DIR}/backups" -name "*.sql.gz" -type f 2>/dev/null | wc -l)
  ok "Backups: ${BACKUP_COUNT} Dateien, ${BACKUP_SIZE}"
fi
echo ""

###############################################################################
# 6. Speicher (RAM) prüfen
###############################################################################
echo -e "${CYAN}[6] Arbeitsspeicher${NC}"

MEM_TOTAL=$(free -h | awk '/^Mem:/ {print $2}')
MEM_USED=$(free -h | awk '/^Mem:/ {print $3}')
MEM_PERCENT=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2*100}')

if [[ "${MEM_PERCENT}" -ge 90 ]]; then
  warnt "RAM: ${MEM_USED} / ${MEM_TOTAL} (${MEM_PERCENT}%)"
  logw "RAM kritisch: ${MEM_PERCENT}%"
  ((WARNINGS++)) || true
else
  ok "RAM: ${MEM_USED} / ${MEM_TOTAL} (${MEM_PERCENT}%)"
fi
echo ""

###############################################################################
# 7. Nginx prüfen
###############################################################################
echo -e "${CYAN}[7] Nginx${NC}"

if systemctl is-active --quiet nginx; then
  ok "Nginx läuft"
  log "Nginx läuft"
else
  fail "Nginx ist nicht aktiv!"
  loge "Nginx nicht aktiv"
  systemctl start nginx
  if systemctl is-active --quiet nginx; then
    warnt "Nginx wurde neu gestartet"
    logw "Nginx wurde neu gestartet"
    ((RESTARTS++)) || true
  else
    ((ERRORS++)) || true
  fi
fi

# SSL-Zertifikat prüfen
CERT_FILE="/etc/letsencrypt/live/db.smartbaden.de/fullchain.pem"
if [[ -f "${CERT_FILE}" ]]; then
  CERT_EXPIRY=$(openssl x509 -enddate -noout -in "${CERT_FILE}" 2>/dev/null | cut -d= -f2)
  CERT_EPOCH=$(date -d "${CERT_EXPIRY}" +%s 2>/dev/null || echo 0)
  NOW_EPOCH=$(date +%s)
  DAYS_LEFT=$(( (CERT_EPOCH - NOW_EPOCH) / 86400 ))

  if [[ "${DAYS_LEFT}" -le 7 ]]; then
    fail "SSL-Zertifikat läuft in ${DAYS_LEFT} Tagen ab!"
    loge "SSL läuft in ${DAYS_LEFT} Tagen ab"
    ((ERRORS++)) || true
  elif [[ "${DAYS_LEFT}" -le 30 ]]; then
    warnt "SSL-Zertifikat läuft in ${DAYS_LEFT} Tagen ab"
    logw "SSL läuft in ${DAYS_LEFT} Tagen ab"
    ((WARNINGS++)) || true
  else
    ok "SSL-Zertifikat gültig (noch ${DAYS_LEFT} Tage)"
  fi
else
  warnt "SSL-Zertifikat nicht gefunden"
  ((WARNINGS++)) || true
fi
echo ""

###############################################################################
# Zusammenfassung
###############################################################################
echo "═══════════════════════════════════════════════════════════"
if [[ ${ERRORS} -eq 0 && ${WARNINGS} -eq 0 ]]; then
  echo -e "  ${GREEN}STATUS: ALLES OK${NC}"
  log "Health-Check: ALLES OK"
elif [[ ${ERRORS} -eq 0 ]]; then
  echo -e "  ${YELLOW}STATUS: ${WARNINGS} Warnung(en)${NC}"
  log "Health-Check: ${WARNINGS} Warnungen"
else
  echo -e "  ${RED}STATUS: ${ERRORS} Fehler, ${WARNINGS} Warnung(en)${NC}"
  loge "Health-Check: ${ERRORS} Fehler, ${WARNINGS} Warnungen"
fi

if [[ ${RESTARTS} -gt 0 ]]; then
  echo -e "  ${YELLOW}${RESTARTS} Dienst(e) wurden automatisch neu gestartet${NC}"
fi
echo "═══════════════════════════════════════════════════════════"
echo ""

# Exit-Code für Monitoring
if [[ ${ERRORS} -gt 0 ]]; then
  exit 2
elif [[ ${WARNINGS} -gt 0 ]]; then
  exit 1
else
  exit 0
fi
