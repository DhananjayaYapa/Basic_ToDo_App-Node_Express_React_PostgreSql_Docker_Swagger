#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
	echo "DATABASE_URL is not set. Falling back to docker-compose default URL."
	export DATABASE_URL="postgresql://postgres:postgres@db:5432/todo_app_db"
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
node dist/server.js