#!/bin/sh

echo "Gerando .env..."

cat <<EOT > /app/.env
VITE_APP_API_URL="$VITE_APP_API_URL"
VITE_GOOGLE_API_KEY="$GOOGLE_API_KEY"
EOT

echo ".env gerado com sucesso em /app/.env"
