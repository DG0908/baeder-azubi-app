#!/usr/bin/env bash
###############################################################################
# 04-update.sh — Supabase Self-Hosted Update
#
# Verwendung:  sudo bash 04-update.sh
#
# Ablauf:
#   1. Erstellt ein Backup der Datenbank
#   2. Zieht die neuesten Docker-Images
#   3. Startet die Container neu
#   4. Überprüft ob alles läuft
###############################################################################
set -euo pipefail

# ─── Farben ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[FEHLER]${NC} $*"; }
step()  { echo -e "${CYAN}[SCHRITT]${NC} $*"; }

# ─── Root-Check ──────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  error "Dieses Skript muss als root ausgeführt werden (sudo)."
  exit 1
fi

SUPABASE_DIR="/opt/supabase"
DOCKER_DIR="${SUPABASE_DIR}/docker"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "============================================================"
echo "  Supabase Self-Hosted — Update"
echo "============================================================"
echo ""

# Prüfe ob Docker-Compose-Datei existiert
if [[ ! -f "${DOCKER_DIR}/docker-compose.yml" ]]; then
  error "docker-compose.yml nicht gefunden unter ${DOCKER_DIR}"
  error "Bitte zuerst 01-install.sh ausführen!"
  exit 1
fi

###############################################################################
# 1. Aktuellen Status anzeigen
###############################################################################
step "1/5 — Aktueller Status"
cd "${DOCKER_DIR}"
echo ""
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Image}}"
echo ""

###############################################################################
# 2. Bestätigung einholen
###############################################################################
warn "Das Update wird die Container kurzzeitig stoppen!"
warn "Die App ist während des Updates nicht erreichbar (ca. 1-3 Minuten)."
echo ""
read -rp "Update jetzt durchführen? (j/n) " CONFIRM
[[ "$CONFIRM" != "j" ]] && { echo "Abgebrochen."; exit 0; }

###############################################################################
# 3. Backup erstellen
###############################################################################
step "2/5 — Backup wird erstellt …"
if [[ -f "${SCRIPT_DIR}/03-backup.sh" ]]; then
  bash "${SCRIPT_DIR}/03-backup.sh"
elif [[ -f "/opt/supabase/scripts/03-backup.sh" ]]; then
  bash "/opt/supabase/scripts/03-backup.sh"
else
  warn "Backup-Skript nicht gefunden — manuelles Backup wird erstellt …"
  BACKUP_FILE="${SUPABASE_DIR}/backups/pre_update_$(date '+%Y%m%d_%H%M%S').sql.gz"
  mkdir -p "${SUPABASE_DIR}/backups"
  DB_CONTAINER=$(docker ps --filter "name=supabase-db" --format "{{.Names}}" | head -1)
  if [[ -n "${DB_CONTAINER}" ]]; then
    docker exec "${DB_CONTAINER}" pg_dump -U postgres --no-owner --clean --if-exists postgres \
      2>/dev/null | gzip > "${BACKUP_FILE}"
    info "Backup erstellt: ${BACKUP_FILE}"
  else
    error "DB-Container nicht gefunden — Backup übersprungen!"
    read -rp "Trotzdem fortfahren? (j/n) " SKIP_BACKUP
    [[ "$SKIP_BACKUP" != "j" ]] && { echo "Abgebrochen."; exit 0; }
  fi
fi

###############################################################################
# 4. Git-Repo aktualisieren (falls vorhanden)
###############################################################################
step "3/5 — Supabase-Konfiguration wird aktualisiert …"
if [[ -d "${SUPABASE_DIR}/repo/.git" ]]; then
  info "Supabase-Repository wird aktualisiert …"
  cd "${SUPABASE_DIR}/repo"
  git pull
  # Neue Docker-Dateien kopieren (aber .env behalten!)
  cp -n "${SUPABASE_DIR}/repo/docker/docker-compose.yml" "${DOCKER_DIR}/docker-compose.yml.new" 2>/dev/null || true
  if [[ -f "${DOCKER_DIR}/docker-compose.yml.new" ]]; then
    warn "Neue docker-compose.yml verfügbar als docker-compose.yml.new"
    warn "Bitte manuell vergleichen und ggf. übernehmen!"
  fi
else
  info "Kein Git-Repo vorhanden — überspringe Config-Update."
fi

###############################################################################
# 5. Docker-Images aktualisieren und Container neustarten
###############################################################################
step "4/5 — Docker-Images werden aktualisiert …"
cd "${DOCKER_DIR}"

info "Neue Images werden heruntergeladen …"
docker compose pull

info "Container werden neu gestartet …"
docker compose down
docker compose up -d

# Warte auf Container-Start
info "Warte 15 Sekunden auf Container-Start …"
sleep 15

###############################################################################
# 6. Verifizierung
###############################################################################
step "5/5 — Status wird geprüft …"
echo ""

# Container-Status
TOTAL=$(docker compose ps -q | wc -l)
RUNNING=$(docker compose ps --filter "status=running" -q | wc -l)

echo "Container: ${RUNNING}/${TOTAL} laufen"
echo ""
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Image}}"
echo ""

# API-Test
if curl -sf -o /dev/null "http://127.0.0.1:8000/rest/v1/" -H "apikey: $(grep ANON_KEY .env | cut -d= -f2)"; then
  info "API antwortet auf Port 8000."
else
  warn "API antwortet noch nicht — braucht möglicherweise noch einen Moment."
fi

# Alte Images aufräumen
echo ""
read -rp "Alte, nicht verwendete Docker-Images löschen? (j/n) " CLEANUP
if [[ "$CLEANUP" == "j" ]]; then
  docker image prune -f
  info "Alte Images entfernt."
fi

echo ""
echo "============================================================"
if [[ "${RUNNING}" -eq "${TOTAL}" ]]; then
  echo -e "${GREEN}  Update erfolgreich abgeschlossen!${NC}"
else
  echo -e "${YELLOW}  Update abgeschlossen — einige Container laufen noch nicht.${NC}"
  echo "  Prüfe die Logs: docker compose -f ${DOCKER_DIR}/docker-compose.yml logs"
fi
echo "============================================================"
echo ""
