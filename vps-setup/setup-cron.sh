#!/usr/bin/env bash
###############################################################################
# setup-cron.sh — Cronjobs für Supabase Self-Hosted einrichten
#
# Verwendung:  sudo bash setup-cron.sh
#
# Richtet ein:
#   - Backup täglich um 3:00 Uhr
#   - Gesundheitscheck alle 5 Minuten
#   - Logs unter /var/log/supabase/
###############################################################################
set -euo pipefail

# ─── Farben ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[FEHLER]${NC} $*"; }

# ─── Root-Check ──────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  error "Dieses Skript muss als root ausgeführt werden (sudo)."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_DIR="/opt/supabase/scripts"
LOG_DIR="/var/log/supabase"

echo ""
echo "============================================================"
echo "  Cronjobs für Supabase einrichten"
echo "============================================================"
echo ""

###############################################################################
# 1. Skripte in festes Verzeichnis kopieren
###############################################################################
info "Skripte werden nach ${INSTALL_DIR} kopiert …"
mkdir -p "${INSTALL_DIR}" "${LOG_DIR}"

for script in 03-backup.sh 05-health-check.sh; do
  if [[ -f "${SCRIPT_DIR}/${script}" ]]; then
    cp "${SCRIPT_DIR}/${script}" "${INSTALL_DIR}/${script}"
    chmod +x "${INSTALL_DIR}/${script}"
    info "  ${script} kopiert"
  else
    error "  ${script} nicht gefunden in ${SCRIPT_DIR}!"
    exit 1
  fi
done

###############################################################################
# 2. Log-Rotation einrichten
###############################################################################
info "Log-Rotation wird konfiguriert …"

cat > /etc/logrotate.d/supabase <<'LOGROTATE'
/var/log/supabase/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
}
LOGROTATE

info "Log-Rotation konfiguriert (14 Tage aufbewahren)."

###############################################################################
# 3. Cronjobs einrichten
###############################################################################
info "Cronjobs werden eingerichtet …"

# Bestehende Supabase-Cronjobs entfernen
EXISTING_CRON=$(crontab -l 2>/dev/null | grep -v "supabase" | grep -v "# Supabase" || true)

# Neue Cronjobs hinzufügen
NEW_CRON="${EXISTING_CRON}

# Supabase — Tägliches Backup um 3:00 Uhr
0 3 * * * ${INSTALL_DIR}/03-backup.sh >> ${LOG_DIR}/backup.log 2>&1

# Supabase — Gesundheitscheck alle 5 Minuten
*/5 * * * * ${INSTALL_DIR}/05-health-check.sh >> ${LOG_DIR}/health-check.log 2>&1

# Supabase — SSL-Zertifikat erneuern (2x täglich, wie von certbot empfohlen)
0 0,12 * * * certbot renew --quiet --post-hook 'systemctl reload nginx' >> ${LOG_DIR}/certbot.log 2>&1
"

# Leere Zeilen am Anfang entfernen
echo "${NEW_CRON}" | sed '/^$/N;/^\n$/d' | crontab -

info "Cronjobs eingerichtet."

###############################################################################
# 4. Zusammenfassung
###############################################################################
echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}  Cronjobs erfolgreich eingerichtet!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Aktive Cronjobs:"
echo ""
crontab -l | grep -A0 "Supabase"
echo ""
echo "Skripte:     ${INSTALL_DIR}/"
echo "Logs:        ${LOG_DIR}/"
echo ""
echo "Log-Dateien:"
echo "  ${LOG_DIR}/backup.log        — Backup-Protokoll"
echo "  ${LOG_DIR}/health-check.log  — Gesundheitscheck-Protokoll"
echo "  ${LOG_DIR}/certbot.log       — SSL-Erneuerung"
echo ""
echo "Logs ansehen:"
echo "  tail -f ${LOG_DIR}/health-check.log"
echo "  tail -f ${LOG_DIR}/backup.log"
echo ""
