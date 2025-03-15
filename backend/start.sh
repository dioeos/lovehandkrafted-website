#! bin/bash
set -e

echo "Waiting for database to be ready..."
python manage.py db_readiness || echo "Database readiness check failed"

echo "Applying database migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Waiting for Vendor group setup..."
python manage.py setup_vendor || echo "Vendor group setup failed"

echo "Listing all content types in Django application..."
python manage.py list_content_types

echo "Checking stale data in Django application..."
python manage.py check_stale_data


echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000