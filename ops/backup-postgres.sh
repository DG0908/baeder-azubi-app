#!/bin/sh
set -eu

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required."
  exit 1
fi

: "${POSTGRES_USER:?POSTGRES_USER must be set in the environment}"
: "${POSTGRES_DB:?POSTGRES_DB must be set in the environment}"

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "${BACKUP_DIR}"

TARGET_FILE="${BACKUP_DIR}/azubi-app-${STAMP}.sql.gz"

docker compose exec -T postgres \
  pg_dump \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  | gzip > "${TARGET_FILE}"

echo "Backup created: ${TARGET_FILE}"
