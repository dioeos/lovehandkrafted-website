#! bin/bash
set -e

echo "Waiting for database to be ready..."
python manage.py db_readiness || echo "Database readiness check failed"

echo "Applying database migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000