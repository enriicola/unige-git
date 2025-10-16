#!/bin/zsh

# Portale Aziendale - Local Development Setup Script
# This script sets up and runs the entire stack locally with Keycloak

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
KEYCLOAK_DIR="identity-provider/keycloak"
BACKEND_DIR="back-end/net/It.gs.back-end"
FRONTEND_DIR="front-end/angular"
STACK_NAME="kc-portale-aziendale"

# Function to print colored messages
print_info() {
    echo "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    print_info "Waiting for $name to be ready..."
    while [ $attempt -le $max_attempts ]; do
        if curl -k -s -f -o /dev/null "$url"; then
            print_success "$name is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    print_error "$name failed to start after $max_attempts attempts"
    return 1
}

# Banner
echo ""
echo "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║                                                           ║${NC}"
echo "${GREEN}║         Portale Aziendale - Local Setup Script            ║${NC}"
echo "${GREEN}║                                                           ║${NC}"
echo "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
print_info "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 16.x or higher."
    exit 1
fi

if ! command_exists dotnet; then
    print_error ".NET SDK is not installed. Please install .NET 6 SDK."
    exit 1
fi

print_success "All prerequisites are installed"

# Check if ports are available
print_info "Checking port availability..."
PORTS_REQUIRED=(80 5007 8443 5432)
PORTS_IN_USE=()

for port in "${PORTS_REQUIRED[@]}"; do
    if port_in_use $port; then
        PORTS_IN_USE+=($port)
    fi
done

if [ ${#PORTS_IN_USE[@]} -gt 0 ]; then
    print_warning "The following ports are already in use: ${PORTS_IN_USE[*]}"
    echo "Do you want to continue anyway? Services may fail to start. (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_info "Exiting..."
        exit 1
    fi
fi

# Start Docker service
print_info "Ensuring Docker service is running..."
if ! docker info >/dev/null 2>&1; then
    print_info "Starting Docker service..."
    sudo service docker start
    sleep 3
fi
print_success "Docker is running"

# Initialize Docker Swarm if needed
print_info "Checking Docker Swarm status..."
if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
    print_info "Initializing Docker Swarm..."
    # Get the default interface IP (prefer wired over wireless)
    ADVERTISE_ADDR=$(ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' | head -n 1)
    if [ -n "$ADVERTISE_ADDR" ]; then
        print_info "Using IP address: $ADVERTISE_ADDR"
        docker swarm init --advertise-addr "$ADVERTISE_ADDR"
    else
        docker swarm init
    fi
    print_success "Docker Swarm initialized"
else
    print_success "Docker Swarm is already active"
fi

# Create Docker secrets for Keycloak (if they don't exist)
print_info "Setting up Docker secrets..."

create_secret_if_not_exists() {
    local secret_name=$1
    local secret_value=$2
    
    if docker secret inspect "$secret_name" >/dev/null 2>&1; then
        print_warning "Secret '$secret_name' already exists, skipping..."
    else
        printf "$secret_value" | sudo docker secret create "$secret_name" -
        print_success "Secret '$secret_name' created"
    fi
}

create_secret_if_not_exists "kc_user" "Admin"
create_secret_if_not_exists "kc_pwd" "tirocinio0799000"
create_secret_if_not_exists "pgsql_db_user" "Admin"
create_secret_if_not_exists "pgsql_db_pwd" "tirocinio0799000!"

print_success "All Docker secrets are configured"

# Deploy Keycloak stack
print_info "Deploying Keycloak stack..."
cd "$KEYCLOAK_DIR"

# Remove old stack if exists
if docker stack ps "$STACK_NAME" >/dev/null 2>&1; then
    print_warning "Removing existing Keycloak stack..."
    sudo docker stack rm "$STACK_NAME"
    print_info "Waiting for cleanup..."
    sleep 10
fi

sudo docker stack deploy --compose-file docker-compose.yml "$STACK_NAME"
print_success "Keycloak stack deployed"

cd - > /dev/null

# Wait for Keycloak to be ready (Keycloak 22+ uses / instead of /auth/)
wait_for_service "http://localhost:8443/" "Keycloak"

# Build and install frontend dependencies
print_info "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install --force || print_warning "npm install failed, will try to build anyway"
else
    print_warning "node_modules exists, skipping install (run 'npm install --force' manually if needed)"
fi
cd - > /dev/null

# Build Angular app with design configuration (points to local Keycloak)
print_info "Building Angular app with local Keycloak configuration..."
cd "$FRONTEND_DIR"
npm run build -- --configuration=design
print_success "Angular app built"
cd - > /dev/null

# Copy Angular dist to backend wwwroot
print_info "Copying Angular dist to backend wwwroot..."
rm -rf "$BACKEND_DIR/wwwroot"
mkdir -p "$BACKEND_DIR/wwwroot"
cp -r "$FRONTEND_DIR/dist/starter/." "$BACKEND_DIR/wwwroot/"
print_success "Frontend files copied to backend"

# Restore backend dependencies
print_info "Restoring .NET dependencies..."
cd "$BACKEND_DIR"
dotnet restore
print_success ".NET dependencies restored"
cd - > /dev/null

# Start the backend in the background
print_info "Starting .NET backend..."
cd "$BACKEND_DIR"

# Kill any existing dotnet process on port 5007
if port_in_use 5007; then
    print_warning "Port 5007 is in use, attempting to free it..."
    lsof -ti:5007 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Run backend in background
nohup dotnet run > ../../../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../../../backend.pid
cd - > /dev/null

print_success "Backend started with PID $BACKEND_PID (logs: backend.log)"

# Wait for backend to be ready
wait_for_service "https://localhost:5007/health" "Backend API" || wait_for_service "https://localhost:5007/swagger/" "Backend API"

# Print success message and URLs
echo ""
echo "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║                                                           ║${NC}"
echo "${GREEN}║                   Setup Complete! 🎉                      ║${NC}"
echo "${GREEN}║                                                           ║${NC}"
echo "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
print_success "All services are running!"
echo ""
print_info "Access the application at:"
echo "  ${BLUE}Frontend:${NC}       https://localhost:5007/"
echo "  ${BLUE}API Swagger:${NC}    https://localhost:5007/swagger/"
echo "  ${BLUE}Keycloak Admin:${NC} http://localhost:8443/"
echo ""
print_info "Keycloak credentials:"
echo "  Username: Admin"
echo "  Password: tirocinio0799000"
echo ""
print_info "Next steps:"
echo "  1. Open Keycloak and import the realm from 'identity-provider/realm-export.json'"
echo "  2. Create a test user and assign them to 'base-user' or 'admin-user' groups"
echo "  3. Visit the frontend and login with your test user"
echo ""
print_warning "Note: Accept the self-signed certificate warnings in your browser"
echo ""
print_info "To stop all services, run:"
echo "  ${YELLOW}./stop-local.sh${NC}"
echo ""
print_info "To view backend logs, run:"
echo "  ${YELLOW}tail -f backend.log${NC}"
echo ""
