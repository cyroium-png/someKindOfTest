#!/usr/bin/env bash
set -euo pipefail

# Creates a local .env from current environment variables if .env does not exist.
# This script does NOT print or embed secret values into git. Use locally only.

ENV_FILE=.env
if [ -f "$ENV_FILE" ]; then
  echo "$ENV_FILE already exists. Edit it directly if you need to change values."
  exit 0
fi

cat > "$ENV_FILE" <<EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-4000}
DATABASE_URL=${DATABASE_URL:-}
SUPABASE_URL=${SUPABASE_URL:-}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-}
JWT_SECRET=${JWT_SECRET:-}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-1h}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}
ENABLE_CRON=${ENABLE_CRON:-false}
LOG_LEVEL=${LOG_LEVEL:-info}
EOF

echo "Created $ENV_FILE with values from environment (or blanks)."
echo "Edit $ENV_FILE and add your secrets. The file is in .gitignore and will not be committed if .gitignore is respected."

echo "To set environment for PM2 without storing secrets in files, consider using your provider's secret manager or run:"
echo "  pm2 start ecosystem.config.js --update-env"

exit 0
