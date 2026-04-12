#!/bin/sh
set -eu

echo "Applying Prisma migrations..."
./node_modules/.bin/prisma migrate deploy

echo "Starting NestJS server..."
exec node dist/main.js
