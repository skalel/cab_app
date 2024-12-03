#!/bin/sh

echo "Gerando .env..."

cat <<EOT > /app/.env
DB_CONNECTION_STRING="$DB_CONNECTION_STRING"
GOOGLE_API_KEY="$GOOGLE_API_KEY"
EOT

echo ".env gerado com sucesso em /app/.env"
