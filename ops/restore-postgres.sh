#!/bin/sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "Usage: RESTORE_CONFIRM=YES ./ops/restore-postgres.sh <backup-file.sql.gz|sql>"
  exit 1
fi

if [ "${RESTORE_CONFIRM:-}" != "YES" ]; then
  echo "Refusing restore without RESTORE_CONFIRM=YES."
  echo "Run restores against a dedicated restore-drill or staging environment first."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required."
  exit 1
fi

: "${POSTGRES_USER:?POSTGRES_USER must be set in the environment}"
: "${POSTGRES_DB:?POSTGRES_DB must be set in the environment}"

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

case "${BACKUP_FILE}" in
  *.sql.gz)
    gunzip -c "${BACKUP_FILE}" | docker compose exec -T postgres \
      psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
    ;;
  *.sql)
    cat "${BACKUP_FILE}" | docker compose exec -T postgres \
      psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
    ;;
  *)
    echo "Unsupported backup format: ${BACKUP_FILE}"
    exit 1
    ;;
esac

echo "Restore completed from ${BACKUP_FILE}"
