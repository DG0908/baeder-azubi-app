#!/usr/bin/env bash
###############################################################################
# 03-backup.sh — Automatisches PostgreSQL-Backup für Supabase Self-Hosted
#
# Verwendung:
#   sudo bash 03-backup.sh          # Manuelles Backup
#   (oder via cron — siehe setup-cron.sh)
#
# Funktionen:
#   - Vollständiger PostgreSQL-Dump
#   - Komprimierung mit gzip
#   - Dateiname mit Zeitstempel
#   - Alte Backups (>30 Tage) werden gelöscht
###############################################################################
set -euo pipefail

# ─── Konfiguration ──────────────────────────────────────────────────────────
SUPABASE_DIR="/opt/supabase"
BACKUP_DIR="${SUPABASE_DIR}/backups"
ENV_FILE="${SUPABASE_DIR}/docker/.env"
RETENTION_DAYS=30
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="${BACKUP_DIR}/supabase_backup_${TIMESTAMP}.sql.gz"
LOG_FILE="/var/log/supabase/backup.log"

# ─── Farben (nur wenn Terminal, nicht in cron) ───────────────────────────────
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; NC=''
fi
info()  { echo -e "${GREEN}[INFO]${NC}  $(date '+%Y-%m-%d %H:%M:%S') $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $(date '+%Y-%m-%d %H:%M:%S') $*"; }
error() { echo -e "${RED}[FEHLER]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"; }

# ─── Log-Verzeichnis erstellen ───────────────────────────────────────────────
mkdir -p "$(dirname "${LOG_FILE}")"
mkdir -p "${BACKUP_DIR}"

# ─── Logging: alles auch in Log-Datei schreiben ─────────────────────────────
exec > >(tee -a "${LOG_FILE}") 2>&1

# ─── .env laden ──────────────────────────────────────────────────────────────
if [[ ! -f "${ENV_FILE}" ]]; then
  error ".env-Datei nicht gefunden: ${ENV_FILE}"
  exit 1
fi
source "${ENV_FILE}"

if [[ -z "${POSTGRES_PASSWORD:-}" || "${POSTGRES_PASSWORD}" == "CHANGE_ME_sicheres_db_passwort" ]]; then
  error "POSTGRES_PASSWORD nicht korrekt gesetzt in ${ENV_FILE}"
  exit 1
fi

###############################################################################
# 1. Backup erstellen
###############################################################################
info "Backup wird erstellt: ${BACKUP_FILE}"

# Datenbank-Container-Name finden
DB_CONTAINER=$(docker ps --filter "name=supabase-db" --format "{{.Names}}" | head -1)
if [[ -z "${DB_CONTAINER}" ]]; then
  # Fallback: direkte Verbindung
  DB_CONTAINER=$(docker ps --filter "ancestor=supabase/postgres" --format "{{.Names}}" | head -1)
fi

if [[ -z "${DB_CONTAINER}" ]]; then
  error "PostgreSQL-Container nicht gefunden! Sind die Container gestartet?"
  exit 1
fi

info "Verwende Container: ${DB_CONTAINER}"

# pg_dump über Docker ausführen
docker exec "${DB_CONTAINER}" pg_dump \
  -U postgres \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  postgres 2>/dev/null | gzip > "${BACKUP_FILE}"

# Prüfe ob Backup erstellt wurde und nicht leer ist
if [[ ! -f "${BACKUP_FILE}" ]]; then
  error "Backup-Datei wurde nicht erstellt!"
  exit 1
fi

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
BACKUP_SIZE_BYTES=$(stat -c %s "${BACKUP_FILE}" 2>/dev/null || stat -f %z "${BACKUP_FILE}" 2>/dev/null)

if [[ "${BACKUP_SIZE_BYTES}" -lt 1000 ]]; then
  error "Backup-Datei ist zu klein (${BACKUP_SIZE}) — möglicherweise fehlerhaft!"
  exit 1
fi

info "Backup erstellt: ${BACKUP_FILE} (${BACKUP_SIZE})"

###############################################################################
# 2. Alte Backups löschen
###############################################################################
info "Lösche Backups älter als ${RETENTION_DAYS} Tage …"

DELETED_COUNT=0
while IFS= read -r old_file; do
  if [[ -n "${old_file}" ]]; then
    rm -f "${old_file}"
    info "  Gelöscht: $(basename "${old_file}")"
    ((DELETED_COUNT++)) || true
  fi
done < <(find "${BACKUP_DIR}" -name "supabase_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -type f 2>/dev/null)

if [[ ${DELETED_COUNT} -gt 0 ]]; then
  info "${DELETED_COUNT} alte Backup(s) gelöscht."
else
  info "Keine alten Backups zum Löschen."
fi

###############################################################################
# 3. Zusammenfassung
###############################################################################
TOTAL_BACKUPS=$(find "${BACKUP_DIR}" -name "supabase_backup_*.sql.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" | cut -f1)

echo ""
info "═══ Backup-Zusammenfassung ═══"
info "  Datei:         ${BACKUP_FILE}"
info "  Größe:         ${BACKUP_SIZE}"
info "  Gesamt:        ${TOTAL_BACKUPS} Backup(s), ${TOTAL_SIZE} belegt"
info "  Aufbewahrung:  ${RETENTION_DAYS} Tage"
info "Backup erfolgreich abgeschlossen."
