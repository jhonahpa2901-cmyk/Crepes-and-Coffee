#!/bin/bash
set -e

echo "Starting Laravel application..."

# Solo hacer cache básico
php artisan config:cache || true
php artisan route:cache || true

# Migraciones sin timeout
php artisan migrate --force --no-interaction || true

# Storage link
php artisan storage:link || true

echo "Application ready"
exec "$@" 