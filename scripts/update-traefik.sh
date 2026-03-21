#!/usr/bin/env bash
# Update Traefik dynamic config with current azubi-app-server container IP.
# Run this after "docker compose up -d server" on the VPS.
# Usage: bash /opt/azubi-app/scripts/update-traefik.sh

set -euo pipefail

CONTAINER="azubi-app-server-1"
NETWORK="coolify"
TRAEFIK_CONFIG="/traefik/dynamic/azubi-api.yaml"
DOMAIN="api.smartbaden.de"

# Get container IP in coolify network
IP=$(docker inspect "$CONTAINER" \
  --format "{{range \$k,\$v := .NetworkSettings.Networks}}{{if eq \$k \"$NETWORK\"}}{{\$v.IPAddress}}{{end}}{{end}}")

if [ -z "$IP" ]; then
  echo "ERROR: Container $CONTAINER not found in network $NETWORK"
  echo "Make sure the container is running: docker compose up -d server"
  exit 1
fi

echo "Container IP: $IP"

# Write Traefik dynamic config
docker exec coolify-proxy sh -c "cat > $TRAEFIK_CONFIG << YAML
http:
  routers:
    azubi-api:
      rule: \"Host(\\\`$DOMAIN\\\`)\"
      entryPoints:
        - https
      service: azubi-api
      tls:
        certResolver: letsencrypt
  services:
    azubi-api:
      loadBalancer:
        servers:
          - url: \"http://$IP:3000\"
YAML"

echo "Traefik config updated: $DOMAIN -> http://$IP:3000"

# Verify
sleep 2
HEALTH=$(curl -sk "https://$DOMAIN/api/health" 2>/dev/null || echo "FAILED")
echo "Health check: $HEALTH"
