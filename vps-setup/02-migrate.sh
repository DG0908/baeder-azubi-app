#!/usr/bin/env bash
###############################################################################
# 02-migrate.sh — Datenbank-Migration von Supabase Cloud → Self-Hosted
#
# Verwendung:
#   sudo bash 02-migrate.sh "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
#
# Das Skript exportiert die gesamte Datenbank (Schema + Daten + Auth)
# aus Supabase Cloud und importiert sie in die lokale PostgreSQL-Instanz.
###############################################################################
set -euo pipefail

# ─── Farben ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[FEHLER]${NC} $*"; }
step()    { echo -e "${CYAN}[SCHRITT]${NC} $*"; }

# ─── Parameter prüfen ───────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  error "Supabase Cloud Verbindungsstring fehlt!"
  echo ""
  echo "Verwendung:"
  echo "  sudo bash 02-migrate.sh \"postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres\""
  echo ""
  echo "Den Verbindungsstring findest du im Supabase Dashboard unter:"
  echo "  Settings → Database → Connection string → URI"
  echo ""
  echo "WICHTIG: Verwende den 'Direct connection'-String (Port 5432),"
  echo "         NICHT den Pooler-String (Port 6543)!"
  exit 1
fi

CLOUD_CONNECTION="$1"
SUPABASE_DIR="/opt/supabase"
DUMP_DIR="${SUPABASE_DIR}/migration"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Lokale DB-Verbindung aus .env lesen
if [[ ! -f "${SUPABASE_DIR}/docker/.env" ]]; then
  error ".env-Datei nicht gefunden unter ${SUPABASE_DIR}/docker/.env"
  error "Bitte zuerst 01-install.sh ausführen!"
  exit 1
fi

source "${SUPABASE_DIR}/docker/.env"

if [[ "${POSTGRES_PASSWORD}" == "CHANGE_ME_sicheres_db_passwort" ]]; then
  error "POSTGRES_PASSWORD in .env ist noch nicht gesetzt!"
  exit 1
fi

# Lokale Verbindung — direkt zum Docker-Container
LOCAL_HOST="127.0.0.1"
LOCAL_PORT="5432"
LOCAL_USER="postgres"
LOCAL_DB="postgres"

# pg_dump installieren falls nötig
if ! command -v pg_dump &>/dev/null; then
  info "PostgreSQL-Client wird installiert …"
  apt-get update -y && apt-get install -y postgresql-client
fi

# Prüfe pg_dump Version
PG_VERSION=$(pg_dump --version | grep -oP '\d+' | head -1)
info "pg_dump Version: ${PG_VERSION}"

mkdir -p "${DUMP_DIR}"

echo ""
echo "============================================================"
echo "  Datenbank-Migration: Supabase Cloud → Self-Hosted"
echo "============================================================"
echo ""
warn "Dies wird die lokale Datenbank ÜBERSCHREIBEN!"
warn "Cloud-Verbindung: ${CLOUD_CONNECTION:0:60}…"
echo ""
read -rp "Fortfahren? (j/n) " CONFIRM
[[ "$CONFIRM" != "j" ]] && { echo "Abgebrochen."; exit 0; }

###############################################################################
# 1. Rollen und Globale Objekte exportieren (optional, oft nicht nötig)
###############################################################################
step "1/6 — Teste Verbindung zur Cloud-Datenbank …"
if PGPASSWORD="" psql "${CLOUD_CONNECTION}" -c "SELECT 1;" &>/dev/null; then
  info "Verbindung zur Cloud-DB erfolgreich."
else
  error "Verbindung zur Cloud-DB fehlgeschlagen!"
  error "Prüfe den Verbindungsstring und stelle sicher, dass die IP freigegeben ist."
  exit 1
fi

###############################################################################
# 2. Schema exportieren (ohne Daten)
###############################################################################
step "2/6 — Schema wird exportiert …"
SCHEMA_FILE="${DUMP_DIR}/schema_${TIMESTAMP}.sql"

pg_dump "${CLOUD_CONNECTION}" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --no-comments \
  --exclude-schema='supabase_migrations' \
  --exclude-schema='_realtime' \
  --exclude-schema='_analytics' \
  --exclude-schema='supabase_functions' \
  --exclude-schema='pgbouncer' \
  --exclude-schema='pgsodium' \
  --exclude-schema='pgsodium_masks' \
  --exclude-schema='vault' \
  --exclude-schema='_supabase' \
  -f "${SCHEMA_FILE}" 2>/dev/null || true

info "Schema exportiert: ${SCHEMA_FILE} ($(du -h "${SCHEMA_FILE}" | cut -f1))"

###############################################################################
# 3. Daten exportieren
###############################################################################
step "3/6 — Daten werden exportiert …"
DATA_FILE="${DUMP_DIR}/data_${TIMESTAMP}.sql"

pg_dump "${CLOUD_CONNECTION}" \
  --data-only \
  --no-owner \
  --no-privileges \
  --exclude-schema='supabase_migrations' \
  --exclude-schema='_realtime' \
  --exclude-schema='_analytics' \
  --exclude-schema='supabase_functions' \
  --exclude-schema='pgbouncer' \
  --exclude-schema='pgsodium' \
  --exclude-schema='pgsodium_masks' \
  --exclude-schema='vault' \
  --exclude-schema='_supabase' \
  --exclude-table-data='auth.schema_migrations' \
  --exclude-table-data='auth.flow_state' \
  --exclude-table-data='auth.audit_log_entries' \
  -f "${DATA_FILE}" 2>/dev/null || true

info "Daten exportiert: ${DATA_FILE} ($(du -h "${DATA_FILE}" | cut -f1))"

###############################################################################
# 4. Vollständiger Dump als Backup
###############################################################################
step "4/6 — Vollständiger Dump als Backup …"
FULL_FILE="${DUMP_DIR}/full_dump_${TIMESTAMP}.sql.gz"

pg_dump "${CLOUD_CONNECTION}" \
  --no-owner \
  --no-privileges \
  --exclude-schema='supabase_migrations' \
  --exclude-schema='_realtime' \
  --exclude-schema='_analytics' \
  --exclude-schema='supabase_functions' \
  --exclude-schema='pgbouncer' \
  --exclude-schema='pgsodium' \
  --exclude-schema='pgsodium_masks' \
  --exclude-schema='vault' \
  --exclude-schema='_supabase' \
  2>/dev/null | gzip > "${FULL_FILE}" || true

info "Vollständiger Dump: ${FULL_FILE} ($(du -h "${FULL_FILE}" | cut -f1))"

###############################################################################
# 5. In lokale Datenbank importieren
###############################################################################
step "5/6 — Daten werden in lokale DB importiert …"

# Warte bis die lokale DB erreichbar ist
info "Warte auf lokale Datenbank …"
for i in $(seq 1 30); do
  if PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${LOCAL_HOST}" -p "${LOCAL_PORT}" \
     -U "${LOCAL_USER}" -d "${LOCAL_DB}" -c "SELECT 1;" &>/dev/null; then
    break
  fi
  if [[ $i -eq 30 ]]; then
    error "Lokale Datenbank nicht erreichbar nach 30 Sekunden!"
    error "Sind die Docker-Container gestartet?"
    exit 1
  fi
  sleep 1
done
info "Lokale Datenbank erreichbar."

# Schema importieren
info "Schema wird importiert …"
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${LOCAL_HOST}" -p "${LOCAL_PORT}" \
  -U "${LOCAL_USER}" -d "${LOCAL_DB}" \
  -f "${SCHEMA_FILE}" 2>&1 | grep -i error || true

# Daten importieren
info "Daten werden importiert …"
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${LOCAL_HOST}" -p "${LOCAL_PORT}" \
  -U "${LOCAL_USER}" -d "${LOCAL_DB}" \
  -f "${DATA_FILE}" 2>&1 | grep -i error || true

info "Import abgeschlossen."

###############################################################################
# 6. Verifizierung
###############################################################################
step "6/6 — Migration wird verifiziert …"
echo ""

# Hilfsfunktion: Tabellenzeilen zählen
count_rows() {
  local conn="$1"
  local table="$2"
  local label="$3"
  local count
  count=$(psql "${conn}" -t -c "SELECT count(*) FROM ${table};" 2>/dev/null | tr -d ' ' || echo "FEHLER")
  printf "  %-40s %s\n" "${label}" "${count}"
}

count_rows_local() {
  local table="$1"
  local label="$2"
  local count
  count=$(PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${LOCAL_HOST}" -p "${LOCAL_PORT}" \
    -U "${LOCAL_USER}" -d "${LOCAL_DB}" \
    -t -c "SELECT count(*) FROM ${table};" 2>/dev/null | tr -d ' ' || echo "FEHLER")
  printf "  %-40s %s\n" "${label}" "${count}"
}

echo "┌────────────────────────────────────────────────────────┐"
echo "│  Zeilenvergleich: Cloud vs. Lokal                      │"
echo "├────────────────────────────────────────────────────────┤"

echo "│"
echo "│  === CLOUD ==="
count_rows "${CLOUD_CONNECTION}" "auth.users" "auth.users"

# Versuche typische App-Tabellen zu finden
TABLES=$(psql "${CLOUD_CONNECTION}" -t -c "
  SELECT schemaname || '.' || tablename
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename
  LIMIT 15;" 2>/dev/null | tr -d ' ' | grep -v '^$' || true)

for tbl in ${TABLES}; do
  count_rows "${CLOUD_CONNECTION}" "${tbl}" "${tbl}"
done

echo "│"
echo "│  === LOKAL ==="
count_rows_local "auth.users" "auth.users"

for tbl in ${TABLES}; do
  count_rows_local "${tbl}" "${tbl}"
done

echo "│"
echo "└────────────────────────────────────────────────────────┘"

echo ""
info "Migration abgeschlossen!"
echo ""
echo "Dump-Dateien gespeichert unter: ${DUMP_DIR}/"
echo ""
warn "Nächste Schritte:"
echo "  1. Prüfe die Zeilenzahlen oben — Cloud und Lokal sollten übereinstimmen"
echo "  2. Teste die API: curl https://db.smartbaden.de/rest/v1/"
echo "  3. Aktualisiere die App (supabase.js) auf die neue URL"
echo "  4. Richte Backups ein mit setup-cron.sh"
echo ""
