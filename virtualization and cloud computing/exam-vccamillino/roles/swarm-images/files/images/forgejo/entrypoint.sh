#!/bin/sh
set -e # fail on error

# Fix permissions for the git user (UID 1000) on the data directory
chown -R git:git /data

# TODO 30f: add the certificate to the system certificates FIRST
echo "LOG TLS - Adding custom CA certificate to trust store..."
if [ -f /usr/local/share/ca-certificates/traefik.crt ]; then
  update-ca-certificates
  echo "LOG TLS - CA certificate added to trust store!"
else
  echo "LOG TLS - Warning: Certificate file not found at /usr/local/share/ca-certificates/traefik.crt"
fi

# This helper allows to run stuff as the forgejo user (todo 30a)
# Fixed: su-exec doesn't need -u flag, and we need to pass the correct config path
forgejo_cli() { 
  su-exec git forgejo --config /data/gitea/conf/app.ini "$@"
}

# TODO 30b: wait until database is alive with a proper health check (SELECT 1 query)
echo "LOG DB - Waiting for database to be ready..."
until PGPASSWORD="$DB_PASSWORD" psql -h "${DB_HOST:-postgres}" -U "$DB_USERNAME" -d "$DB_NAME" -c 'SELECT 1' >/dev/null 2>&1; do
  echo "LOG DB - Database is not ready yet, waiting..."
  sleep 5
done
echo "LOG DB - Database is ready!"

# TODO 30c: run the database migration command
echo "LOG DB - Running database migrations..."
export GITEA_WORK_DIR=/data/gitea
forgejo_cli migrate
echo "LOG DB - Database migrations completed!"

# TODO 30d: create admin user (if it does not exist already)
echo "LOG USER - Checking for admin user..."
# Count lines that contain admin users, excluding header lines
admin_user_count=$(forgejo_cli admin user list --admin 2>/dev/null | grep -v "ID" | grep -v "^$" | wc -l)

if [ "$admin_user_count" -eq 0 ]; then
  echo "LOG USER - Creating admin user..."
  forgejo_cli admin user create \
    --username "$FORGEJO_ADMIN" \
    --password "$FORGEJO_ADMIN_PASSWORD" \
    --email "$FORGEJO_EMAIL" \
    --admin
  echo "LOG USER - Admin user created!"
else
  echo "LOG USER - Admin user already exists."
fi

# TODO 30e: wait for forgejo to be alive
echo "LOG FORGEJO - Starting Forgejo service in background..."
# Start the original forgejo entrypoint in the background
/bin/s6-svscan /etc/s6 &
FORGEJO_PID=$!

# Wait for Forgejo to be alive (check the homepage)
echo "LOG FORGEJO - Waiting for Forgejo to be alive..."
until curl -sf http://localhost:3000/ >/dev/null 2>&1; do
  echo "LOG FORGEJO - Forgejo not ready yet, waiting..."
  sleep 5
done
echo "LOG FORGEJO - Forgejo is alive!"

# TODO 30g: wait for dex to be alive
echo "LOG AUTH - Waiting for authentication server (Dex) to be ready..."
until curl -sf https://auth.vcc.internal/.well-known/openid-configuration >/dev/null 2>&1; do
  echo "LOG AUTH - Authentication server not ready yet, waiting..."
  sleep 5
done
echo "LOG AUTH - Authentication server is ready!"

# TODO 30h: Create the openid client with the "forgejo" OAuth client
echo "LOG AUTH - Setting up OAuth authentication..."

# Check if "dex" OAuth source exists
auth_count=$(forgejo_cli admin auth list 2>/dev/null | grep -E "^[0-9]+\s+dex\s+" | wc -l)

if [ "$auth_count" -eq 0 ]; then
  echo "LOG AUTH - Creating OAuth authentication source..."
  forgejo_cli admin auth add-oauth \
    --name "dex" \
    --provider "openidConnect" \
    --key "$DEX_FORGEJO_CLIENT_ID" \
    --secret "$DEX_FORGEJO_CLIENT_SECRET" \
    --auto-discover-url "https://auth.vcc.internal/.well-known/openid-configuration" \
    --group-claim-name "groups" \
    --admin-group "admin"
  echo "LOG AUTH - OAuth authentication source created!"
else
  echo "LOG AUTH - OAuth authentication already configured."
fi

# Keep the Forgejo process running in foreground
echo "LOG FORGEJO - Setup complete, Forgejo is running."
wait $FORGEJO_PID