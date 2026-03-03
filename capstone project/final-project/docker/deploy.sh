#!/usr/bin/env bash

source .env

REQUIRED_FILES=(
  ".env"
)

DOCKER_COMPOSE=(docker compose --project-name "${PROJECT_NAME}" -f docker-compose.yml -f "docker-compose-production.yml")

check_files() {
  local missing=0
  for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
      echo "Missing file: $file"
      missing=1
    fi
  done
  return $missing
}

echo "Checking required files..."
if ! check_files; then
  echo "One or more required files are missing. Aborting deploy."
  exit 1
fi

echo "All required files present. Proceeding with deploy..."
echo "${REGISTRY_TOKEN}" | docker login "${REGISTRY_URL}" -u "${REGISTRY_USER}" --password-stdin

echo "Pulling latest docker images..."
"${DOCKER_COMPOSE[@]}" pull backend
"${DOCKER_COMPOSE[@]}" pull frontend

echo "Starting containers..."
"${DOCKER_COMPOSE[@]}" up -d

echo "Showing logs..."
"${DOCKER_COMPOSE[@]}" logs -f
