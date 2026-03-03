#!/usr/bin/env bash
set -e

# ------------------------------------------------------------------------------
# Codymatch unified setup script
#
# - Normalizes shell script line endings
# - Checks Node & npm versions
# - Checks Docker & Docker Compose
# - Creates local env files from examples (if missing)
# - Configures Git hooks via core.hooksPath
#
# Works on Linux, macOS, and Windows via WSL2 / Git Bash.
# This script must be executed from the root of the repository.
# ------------------------------------------------------------------------------

REQUIRED_NODE_MAJOR=25
REQUIRED_NPM_MAJOR=11
MIN_DOCKER_MAJOR=28

# Detect root directory of the repo (independent of current working directory)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"


#!/usr/bin/env bash
set -e

# Detect root directory of the repo (independent of current working directory)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# ------------------------------------------------------------------------------
# Normalize line endings (CRLF -> LF) for env and shell files
# This makes the project work on Linux, macOS and WSL/Windows even if
# some files were saved with Windows-style CRLF endings.
# ------------------------------------------------------------------------------
normalize_line_endings() {
  echo "Normalizing line endings for .sh / .env / docker-compose*.yml (CRLF -> LF if needed)..."

  local patterns=(
    "*.sh"
    "*.env"
    "docker-compose*.yml"
  )

  for pattern in "${patterns[@]}"; do
    find "$ROOT_DIR" -type f -name "$pattern" -print0 2>/dev/null | while IFS= read -r -d '' file; do
      if grep -q $'\r' "$file"; then
        printf '  -> Fixing %s\n' "$file"
        local tmp="${file}.tmp.$$"
        tr -d '\r' < "$file" > "$tmp" && mv "$tmp" "$file"
      fi
    done
  done
}

normalize_line_endings

# ------------------------------------------------------------------------------
# Colors & logging helpers
# ------------------------------------------------------------------------------

if [ -t 1 ]; then
  COLOR_RESET="\033[0m"
  COLOR_BOLD="\033[1m"
  COLOR_RED="\033[31m"
  COLOR_GREEN="\033[32m"
  COLOR_YELLOW="\033[33m"
  COLOR_BLUE="\033[34m"
else
  COLOR_RESET=""
  COLOR_BOLD=""
  COLOR_RED=""
  COLOR_GREEN=""
  COLOR_YELLOW=""
  COLOR_BLUE=""
fi

log_info() {
  echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $*"
}

log_ok() {
  echo -e "${COLOR_GREEN}[OK] ${COLOR_RESET} $*"
}

log_warn() {
  echo -e "${COLOR_YELLOW}[WARN]${COLOR_RESET} $*"
}

log_error() {
  echo -e "${COLOR_RED}[ERROR]${COLOR_RESET} $*"
}

print_section() {
  echo
  echo -e "${COLOR_BOLD}============================================================${COLOR_RESET}"
  echo -e "${COLOR_BOLD}$1${COLOR_RESET}"
  echo -e "${COLOR_BOLD}============================================================${COLOR_RESET}"
}

# ------------------------------------------------------------------------------
# Node & npm version check
# ------------------------------------------------------------------------------

check_node_and_npm() {
  print_section "Step 1: Checking Node & npm versions"

  if ! command -v node >/dev/null 2>&1; then
    log_error "Node is not installed or not in PATH."
    echo "       Please install Node ${REQUIRED_NODE_MAJOR}.x and re-run ./setup.sh."
    exit 1
  fi

  if ! command -v npm >/dev/null 2>&1; then
    log_error "npm is not installed or not in PATH."
    echo "       Please install npm ${REQUIRED_NPM_MAJOR}.x (or compatible) and re-run ./setup.sh."
    exit 1
  fi

  local node_version npm_version node_major npm_major
  node_version="$(node -v)"  # e.g. v25.2.0
  npm_version="$(npm -v)"    # e.g. 11.0.0

  node_major="${node_version#v}"
  node_major="${node_major%%.*}"
  npm_major="${npm_version%%.*}"

  log_info "Detected node: $node_version"
  log_info "Detected npm:  $npm_version"

  local ok=true

  if [ "$node_major" -ne "$REQUIRED_NODE_MAJOR" ]; then
    log_error "Node major version must be ${REQUIRED_NODE_MAJOR}.x, found $node_version"
    ok=false
  fi

  if [ "$npm_major" -ne "$REQUIRED_NPM_MAJOR" ]; then
    log_error "npm major version must be ${REQUIRED_NPM_MAJOR}.x, found $npm_version"
    ok=false
  fi

  if [ "$ok" = false ]; then
    echo "       Please align your Node/npm versions and re-run ./setup.sh."
    exit 1
  fi

  log_ok "Node & npm versions are OK"
}

# ------------------------------------------------------------------------------
# Docker & Docker Compose check
# ------------------------------------------------------------------------------

check_docker_and_compose() {
  print_section "Step 2: Checking Docker & Docker Compose"

  if ! command -v docker >/dev/null 2>&1; then
    log_error "docker command not found."
    echo "       Please install Docker (Engine / Desktop) and re-run ./setup.sh."
    exit 1
  fi

  # Get server (Engine) version
  local docker_server_version docker_server_major
  docker_server_version="$(docker version --format '{{.Server.Version}}' 2>/dev/null || echo "unknown")"
  log_info "Docker server (Engine) version: $docker_server_version"

  docker_server_major="${docker_server_version%%.*}"

  if [ "$docker_server_version" = "unknown" ] || [ -z "$docker_server_major" ]; then
    log_warn "Could not detect Docker server version correctly."
    echo "       Please ensure Docker Engine is properly installed and running."
  else
    if [ "$docker_server_major" -lt "$MIN_DOCKER_MAJOR" ]; then
      log_error "Docker Engine is too old. Need >= ${MIN_DOCKER_MAJOR}.x (found $docker_server_version)"
      echo "       Please update Docker Engine and re-run ./setup.sh."
      exit 1
    fi
  fi

  # Compose: prefer plugin `docker compose`
  local compose_cmd compose_version
  if docker compose version >/dev/null 2>&1; then
    compose_cmd="docker compose"
    compose_version="$(docker compose version --short 2>/dev/null || echo "unknown")"
  else
    compose_cmd=""
  fi

  if [ -z "$compose_cmd" ]; then
    log_error "Docker Compose (v2) is not available."
    echo "       Please install Docker Compose v2 (docker compose) and re-run ./setup.sh."
    exit 1
  fi

  log_info "Docker Compose command: $compose_cmd"
  log_info "Docker Compose version: $compose_version"
  log_ok "Docker & Docker Compose are available"
}

# ------------------------------------------------------------------------------
# Git hooks setup
# ------------------------------------------------------------------------------

setup_git_hooks() {
  print_section "Step 4: Configuring Git hooks"

  if [ ! -d ".git" ]; then
    log_error "This directory is not a Git repository (no .git folder)."
    echo "       Please run ./setup.sh from the root of the Codymatch repository."
    exit 1
  fi

  if [ ! -d ".githooks" ]; then
    log_warn ".githooks directory not found. No hooks will be configured."
    return
  fi

  # Ensure all hook scripts are executable
  chmod +x .githooks/* 2>/dev/null || true

  # Point Git to the versioned hooks directory
  git config core.hooksPath .githooks

  log_ok "Git hooks path configured to .githooks"
  log_info "Git will now use hooks from: .githooks/"
}

# ------------------------------------------------------------------------------
# Normalize line endings for shell scripts
# ------------------------------------------------------------------------------

normalize_shell_line_endings() {
  print_section "Step 0: Normalizing line endings for shell scripts"

  # List of scripts we care about (add/remove as needed)
  SCRIPTS=(
    "./setup.sh"
    "./docker/codymatch.sh"
    "./backend/startup.sh"
    "./frontend/startup.sh"
  )

  # Include versioned hooks if you use .githooks
  if [ -d ".githooks" ]; then
    for hook in .githooks/*; do
      [ -f "$hook" ] && SCRIPTS+=("$hook")
    done
  fi

  for f in "${SCRIPTS[@]}"; do
    [ -f "$f" ] || continue
    if grep -q $'\r' "$f"; then
      log_warn "Found CRLF line endings in $f – normalizing to LF"
      tmp="$f.tmp.$$"
      # Portable way: remove '\r' from each line
      tr -d '\r' < "$f" > "$tmp" && mv "$tmp" "$f"
      chmod +x "$f"
    fi
  done

  log_ok "Shell script line endings normalized (if needed)"
}

# ------------------------------------------------------------------------------
# Env files setup (docker/.env, backend/tests/.env.test)
# ------------------------------------------------------------------------------

ensure_env_files() {
  print_section "Step 3: Ensuring local env files"

  # docker/.env from docker/example.env
  if [ -f "docker/.env" ]; then
    log_info "docker/.env already exists, skipping creation."
  elif [ -f "docker/example.env" ]; then
    cp "docker/example.env" "docker/.env"
    log_ok "Created docker/.env from docker/example.env"
  else
    log_warn "docker/example.env not found. Cannot create docker/.env automatically."
  fi

  # backend/tests/.env.test from backend/tests/example.env.test
  if [ -f "backend/tests/.env.test" ]; then
    log_info "backend/tests/.env.test already exists, skipping creation."
  elif [ -f "backend/tests/example.env.test" ]; then
    cp "backend/tests/example.env.test" "backend/tests/.env.test"
    log_ok "Created backend/tests/.env.test from backend/tests/example.env.test"
  else
    log_warn "backend/tests/example.env.test not found. Cannot create backend/tests/.env.test automatically."
  fi
}

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------

main() {
  echo -e "${COLOR_BOLD}Codymatch unified setup${COLOR_RESET}"
  echo "Root directory: $ROOT_DIR"
  echo "Note: this script is intended to run in a POSIX shell"
  echo "      (Linux, macOS, WSL2, or Git Bash on Windows)."

  normalize_shell_line_endings
  check_node_and_npm
  check_docker_and_compose
  ensure_env_files
  setup_git_hooks

  print_section "All checks completed"
  log_ok "Your local environment looks good."
  echo "Next steps:"
  echo "  1. Go to the docker folder:   cd docker"
  echo "  2. Start the dev environment: ./codymatch.sh bul"
  echo
  echo "Reminder:"
  echo "  Avoid running 'npm install' directly on your host."
  echo "  Prefer running npm commands through the docker helper:"
  echo "    cd docker"
  echo "    ./codymatch.sh backend npm install <package>"
  echo "    ./codymatch.sh frontend npm install <package>"
  echo
}

main "$@"
