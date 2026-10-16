#!/usr/bin/env sh
# Builds the images one at a time (parallel builds can run out of memory
# on Docker Desktop's default settings), then starts every service.
set -e
cd "$(dirname "$0")"

for service in backend travelweb admin; do
  echo "==> Building $service"
  docker compose build "$service"
done

docker compose up -d

echo
echo "Website: http://localhost:3000"
echo "Admin:   http://localhost:3001"
echo "API:     http://localhost:8088"
echo "The backend may need up to a minute before data appears."
