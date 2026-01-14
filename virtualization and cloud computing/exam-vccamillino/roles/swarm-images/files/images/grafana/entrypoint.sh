#!/bin/sh
set -e

# Export Grafana environment variables
export GF_SERVER_ROOT_URL="https://mon.vcc.internal"
export GF_DATABASE_TYPE=postgres
export GF_DATABASE_HOST="postgres:5432"
export GF_DATABASE_NAME=$DB_NAME
export GF_DATABASE_USER=$DB_USR
export GF_DATABASE_PASSWORD=$DB_PWD
export GF_PATHS_PROVISIONING=/etc/grafana/provisioning

# Todo 35d: Set environment variables for Dex OAuth authentication
export GF_AUTH_GENERIC_OAUTH_ENABLED="true"
export GF_AUTH_GENERIC_OAUTH_NAME="Dex"
export GF_AUTH_GENERIC_OAUTH_ALLOW_SIGN_UP="true"
export GF_AUTH_GENERIC_OAUTH_CLIENT_ID="grafana"
export GF_AUTH_GENERIC_OAUTH_CLIENT_SECRET=$GR_SCR
export GF_AUTH_GENERIC_OAUTH_SCOPES="openid profile email groups"
export GF_AUTH_GENERIC_OAUTH_AUTH_URL="https://auth.vcc.internal/auth"
export GF_AUTH_GENERIC_OAUTH_TOKEN_URL="https://auth.vcc.internal/token"
export GF_AUTH_GENERIC_OAUTH_API_URL="https://auth.vcc.internal/userinfo"

# Todo 35b: Add the certificate to system certificates
if [ -f /usr/local/share/ca-certificates/traefik.crt ]; then
    echo "[INFO] Certificate found, updating CA certificates..."
    update-ca-certificates
else
    echo "[ERROR] Certificate not found at /usr/local/share/ca-certificates/traefik.crt"
    exit 1
fi

# Todo 35a: Perform database health check
echo "[INFO] Waiting for PostgreSQL database..."
until PGPASSWORD=$GF_DATABASE_PASSWORD psql -h "postgres" -U $GF_DATABASE_USER -d $GF_DATABASE_NAME -c "SELECT 1;" > /dev/null 2>&1; do
    echo "[INFO] Database not ready, retrying..."
    sleep 2
done
echo "[INFO] Database is ready!"

# Todo 35c: Wait for Dex to be alive
echo "[INFO] Waiting for Dex authentication service..."
until [ $(curl -s -k -o /dev/null -w "%{http_code}" --max-time 5 "https://auth.vcc.internal/healthz") -eq 200 ]; do
    echo "[INFO] Dex not ready, retrying..."
    sleep 2
done
echo "[INFO] Dex is ready!"

# Start Grafana
echo "[INFO] Starting Grafana..."
exec /run.sh "$@"
