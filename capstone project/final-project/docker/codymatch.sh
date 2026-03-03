#!/usr/bin/env bash
USERID=$(id -u)
GROUPID=$(id -g)
export USERID GROUPID

if [[ "$1" == "test" || ( "$1" == "backend" && "$2" == "test" ) || ( "$1" == "frontend" && "$2" == "test" ) ]]; then
  source  "../backend/tests/.env.test"
else
  source ".env"
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[0;37m'

error_message () {
          echo -e "${RED}Command not found ..."
          echo -e ""
          echo -e "${WHITE}List of commands:"
          echo -e ""
          echo -e "${GREEN}up                         ${WHITE}Create and start containers"
          echo -e "${GREEN}stop                       ${WHITE}Stop running containers"
          echo -e "${GREEN}down                       ${WHITE}Stop and remove containers & networks"
          echo -e "${GREEN}build                      ${WHITE}Stop and remove containers & networks + build or rebuild services"
          echo -e "${GREEN}logs                       ${WHITE}View output from containers"
          echo -e "${GREEN}test [test_file] [--stop]     ${WHITE}Run tests in backend service. Optionally specify a test file to run only that file. Use --stop to stop the test DB after tests complete."
          echo -e "${GREEN}backend test [--stop]        ${WHITE}Run backend tests only. Use --stop for non-watch mode."
          echo -e "${GREEN}frontend test [--stop]       ${WHITE}Run frontend tests only. Use --stop for non-watch mode."
          echo -e "${GREEN}lint                       ${WHITE}Run linting with auto-fix in both backend and frontend"
          echo -e "${GREEN}deploy                     ${WHITE}Deploy services"
          echo -e ""
          echo -e "${GREEN}backend restart            ${WHITE}Restart backend service container"
          echo -e "${GREEN}backend logs               ${WHITE}View output from backend container"
          echo -e "${GREEN}backend bash               ${WHITE}Execute /bin/sh command in backend container"
          echo -e "${GREEN}backend npm                ${WHITE}Execute npm command in backend container"
          echo -e "${GREEN}backend npx                ${WHITE}Execute npx command in backend container"
          echo -e ""
          echo -e "${GREEN}frontend restart           ${WHITE}Restart frontend service container"
          echo -e "${GREEN}frontend logs              ${WHITE}View output from frontend container"
          echo -e "${GREEN}frontend bash              ${WHITE}Execute /bin/sh command in frontend container"
          echo -e "${GREEN}frontend npm               ${WHITE}Execute npm command in frontend container"
          echo -e "${GREEN}frontend npx               ${WHITE}Execute npx command in frontend container"
          echo -e ""
          echo -e "${GREEN}bul                        ${WHITE}Build, up and log all services"
          echo -e "${GREEN}dul                        ${WHITE}Down, up and log all services"
          echo -e "${GREEN}ul                         ${WHITE}Up and log all services"
          echo -e "${GREEN}brl                        ${WHITE}Restart backend and log all services"
          echo -e ""
          echo -e "${GREEN}migrate                    ${WHITE}Run database migrations"
          echo -e "${GREEN}migrate-undo               ${WHITE}Undo last database migration"
          echo -e "${GREEN}migrate-undo-all           ${WHITE}Undo all database migrations"
          echo -e "${GREEN}migration:new [name]       ${WHITE}Create a new migration with the given name"
          echo -e ""
}

if [[ "$ENVIRONMENT" == "development" ]]; then
  COMPOSE_ENV_FILE="docker-compose-development.yml"
fi
if [[ "$ENVIRONMENT" == "test" ]]; then
  COMPOSE_ENV_FILE="docker-compose-test.yml"
fi
if [[ "$ENVIRONMENT" == "production" ]]; then
  COMPOSE_ENV_FILE="docker-compose-production.yml"
fi

DOCKER_COMPOSE=(docker compose --project-name "${PROJECT_NAME}" -f docker-compose.yml -f "${COMPOSE_ENV_FILE}")

case $1 in
up)
  "${DOCKER_COMPOSE[@]}" up -d
  ;;

stop)
  "${DOCKER_COMPOSE[@]}" stop
  ;;

down)
  "${DOCKER_COMPOSE[@]}" down
  ;;

build)
  "${DOCKER_COMPOSE[@]}" down
  "${DOCKER_COMPOSE[@]}" build
  ;;

logs)
  "${DOCKER_COMPOSE[@]}" logs -f
  ;;

test)
  # Optional second arg:
  #   ./codymatch.sh test                → all backend + frontend tests
  #   ./codymatch.sh test some-file.js  → only that backend test file
  #   ./codymatch.sh test --stop         → all backend + frontend tests (non-watch), then stop
  #
  # NOTE: when TEST_FILE is provided, frontend tests are NOT run.

  TEST_FILE=""
  STOP_AFTER=false

  if [[ "$2" == "--stop" ]]; then
    STOP_AFTER=true
  elif [[ -n "$2" ]]; then
    TEST_FILE="$2"
  fi

  echo "Stopping old test DB if it exists..."
  docker rm -f test-db >/dev/null 2>&1 || true

  echo "Starting test-db container from db service..."
  "${DOCKER_COMPOSE[@]}" run -d -T \
    --name test-db \
    -p "${DB_PORT}:5432" \
    db

  echo "Waiting for test DB to become ready..."
  for _ in {1..30}; do
    if docker exec test-db pg_isready > /dev/null 2>&1; then
      echo "test-db is ready"
      break
    fi
    sleep 1
  done

  if ! docker exec test-db pg_isready > /dev/null 2>&1; then
    echo "test-db failed to become ready in time." >&2
    docker rm -f test-db >/dev/null 2>&1 || true
    exit 1
  fi

  echo "Running backend migrations on test DB..."
  "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T \
    backend sh -c "npm run migrate"
  MIGRATION_EXIT_CODE=$?

  if [[ $MIGRATION_EXIT_CODE -ne 0 ]]; then
    echo "Backend migration failed."
    docker rm -f test-db >/dev/null 2>&1 || true
    exit 1
  fi

  echo "Running backend tests..."

  BACKEND_TEST_EXIT_CODE=0
  FRONTEND_TEST_EXIT_CODE=0

  if [[ -n "$TEST_FILE" && "$STOP_AFTER" == false ]]; then
    echo "Running backend test file: $TEST_FILE"
    "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T \
      backend sh -c "npm run test -- tests/$TEST_FILE"
    BACKEND_TEST_EXIT_CODE=$?
  else
    echo "Running all backend tests"
    if [[ "$STOP_AFTER" == true ]]; then
      # Non-watch mode, used e.g. in pre-push
      "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T backend sh -c \
        "npm run test:run -- --no-file-parallelism --bail=1"
      BACKEND_TEST_EXIT_CODE=$?
    else
      # Default test command (may be watch or not, depending on package.json)
      "${DOCKER_COMPOSE[@]}" run --rm --no-deps backend sh -c \
        "npm run test -- --no-file-parallelism --bail=1"
      BACKEND_TEST_EXIT_CODE=$?
    fi
  fi

  # Only run frontend tests when we run the full suite (no specific backend file)
  if [[ -z "$TEST_FILE" ]]; then
    echo "Running frontend tests..."

    if [[ "$STOP_AFTER" == true ]]; then
      # Non-watch mode for frontend (single run)
      "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T frontend sh -c \
        "npm run test:run"
      FRONTEND_TEST_EXIT_CODE=$?
    else
      # Default frontend test script
      "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T frontend sh -c \
        "npm run test"
      FRONTEND_TEST_EXIT_CODE=$?
    fi
  fi

  echo "Cleaning up test DB..."
  docker rm -f test-db > /dev/null 2>&1 || true

  if [[ $BACKEND_TEST_EXIT_CODE -ne 0 ]]; then
    echo "Backend tests failed."
    exit 1
  fi

  if [[ $FRONTEND_TEST_EXIT_CODE -ne 0 ]]; then
    echo "Frontend tests failed."
    exit 1
  fi

  echo "All tests passed."
  exit 0
  ;;
lint)
  echo "Running backend linting..."
  "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T backend npm run lint
  echo "Running frontend linting..."
  "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T frontend npm run lint
  ;;
backend|frontend)
    case $2 in
      test)
        STOP_AFTER=false
        TEST_FILE=""

        if [[ "$3" == "--stop" ]]; then
          STOP_AFTER=true
        elif [[ -n "$3" && "$1" == "backend" ]]; then
          TEST_FILE="$3"
          if [[ "$4" == "--stop" ]]; then
            STOP_AFTER=true
          fi
        fi

        if [[ "$1" == "backend" ]]; then
          echo "Stopping old test DB if it exists..."
          docker rm -f test-db >/dev/null 2>&1 || true

          echo "Starting test-db container from db service..."
          "${DOCKER_COMPOSE[@]}" run -d -T \
            --name test-db \
            -p "${DB_PORT}:5432" \
            db

          echo "Waiting for test DB to become ready..."
          for _ in {1..30}; do
            if docker exec test-db pg_isready > /dev/null 2>&1; then
              echo "test-db is ready"
              break
            fi
            sleep 1
          done

          if ! docker exec test-db pg_isready > /dev/null 2>&1; then
            echo "test-db failed to become ready in time." >&2
            docker rm -f test-db >/dev/null 2>&1 || true
            exit 1
          fi

          echo "Running backend migrations on test DB..."
          "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T \
            backend sh -c "npm run migrate"
          MIGRATION_EXIT_CODE=$?

          if [[ $MIGRATION_EXIT_CODE -ne 0 ]]; then
            echo "Backend migration failed."
            docker rm -f test-db >/dev/null 2>&1 || true
            exit 1
          fi

          echo "Running backend tests..."

          BACKEND_TEST_EXIT_CODE=0

          if [[ -n "$TEST_FILE" ]]; then
            echo "Running backend test file: $TEST_FILE"
            "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T \
              backend sh -c "npm run test -- tests/$TEST_FILE"
            BACKEND_TEST_EXIT_CODE=$?
          else
            if [[ "$STOP_AFTER" == true ]]; then
              "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T backend sh -c \
                "npm run test:run -- --no-file-parallelism --bail=1"
            else
              "${DOCKER_COMPOSE[@]}" run --rm --no-deps backend sh -c \
                "npm run test -- --no-file-parallelism --bail=1"
            fi
            BACKEND_TEST_EXIT_CODE=$?
          fi

          echo "Cleaning up test DB..."
          docker rm -f test-db > /dev/null 2>&1 || true

          if [[ $BACKEND_TEST_EXIT_CODE -ne 0 ]]; then
            echo "Backend tests failed."
            exit 1
          fi

          echo "Backend tests passed."
          exit 0
        fi

        echo "Running frontend tests..."
        if [[ "$STOP_AFTER" == true ]]; then
          "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T frontend sh -c \
            "npm run test:run"
        else
          "${DOCKER_COMPOSE[@]}" run --rm --no-deps -T frontend sh -c \
            "npm run test"
        fi

        FRONTEND_TEST_EXIT_CODE=$?
        if [[ $FRONTEND_TEST_EXIT_CODE -ne 0 ]]; then
          echo "Frontend tests failed."
          exit 1
        fi

        echo "Frontend tests passed."
        exit 0
        ;;
      restart)
        "${DOCKER_COMPOSE[@]}" restart "$1"
        ;;

      logs)
        "${DOCKER_COMPOSE[@]}" logs -f "$1"
        ;;

      bash)
        "${DOCKER_COMPOSE[@]}" exec "$1" /bin/sh
        ;;

      npm)
        "${DOCKER_COMPOSE[@]}" exec "$1" npm "${@:3}"
        ;;

      npx)
        "${DOCKER_COMPOSE[@]}" exec "$1" npx "${@:3}"
        ;;

      *)
        error_message
        ;;
      esac
      ;;
bul)
    "${DOCKER_COMPOSE[@]}" down
    "${DOCKER_COMPOSE[@]}" build
    "${DOCKER_COMPOSE[@]}" up -d
    "${DOCKER_COMPOSE[@]}" logs -f
    ;;
dul)
    "${DOCKER_COMPOSE[@]}" down
    "${DOCKER_COMPOSE[@]}" up -d
    "${DOCKER_COMPOSE[@]}" logs -f
    ;;
ul)
    "${DOCKER_COMPOSE[@]}" up -d
    "${DOCKER_COMPOSE[@]}" logs -f
    ;;
brl)
    "${DOCKER_COMPOSE[@]}" restart backend
    "${DOCKER_COMPOSE[@]}" logs -f
    ;;
migrate)
    "${DOCKER_COMPOSE[@]}" exec backend npm run migrate
    ;;
migrate-undo)
    "${DOCKER_COMPOSE[@]}" exec backend npm run migrate-undo
    ;;
migrate-undo-all)
    "${DOCKER_COMPOSE[@]}" exec backend npm run migrate-undo-all
    ;;
migration:new)
    "${DOCKER_COMPOSE[@]}" exec backend npm run migration:new -- "${2}"
    ;;
*)
  error_message
  ;;
esac
