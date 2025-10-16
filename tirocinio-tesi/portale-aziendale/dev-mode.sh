#!/bin/zsh

# Portale Aziendale - Development Mode Script
# Runs Angular dev server with hot reload while backend serves API only

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo "${GREEN}[SUCCESS]${NC} $1"
}

echo ""
echo "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║                                                           ║${NC}"
echo "${GREEN}║         Development Mode with Hot Reload                 ║${NC}"
echo "${GREEN}║                                                           ║${NC}"
echo "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Keycloak is running
if ! curl -k -s -f -o /dev/null "http://localhost:8443/" 2>/dev/null; then
    print_info "Keycloak not running. Starting Keycloak stack..."
    cd identity-provider/keycloak
    
    # Ensure swarm and secrets exist
    if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
        docker swarm init
    fi
    
    docker secret inspect kc_user >/dev/null 2>&1 || printf 'Admin' | sudo docker secret create kc_user -
    docker secret inspect kc_pwd >/dev/null 2>&1 || printf 'tirocinio0799000' | sudo docker secret create kc_pwd -
    docker secret inspect pgsql_db_user >/dev/null 2>&1 || printf 'Admin' | sudo docker secret create pgsql_db_user -
    docker secret inspect pgsql_db_pwd >/dev/null 2>&1 || printf 'tirocinio0799000!' | sudo docker secret create pgsql_db_pwd -
    
    sudo docker stack deploy --compose-file docker-compose.yml kc-portale-aziendale
    cd - > /dev/null
    
    print_info "Waiting for Keycloak..."
    sleep 15
fi

# Start backend if not running
if ! curl -k -s -f -o /dev/null "https://localhost:5007/swagger/" 2>/dev/null; then
    print_info "Starting backend API..."
    cd back-end/net/It.gs.back-end
    
    # Kill any process on port 5007
    lsof -ti:5007 | xargs kill -9 2>/dev/null || true
    sleep 1
    
    nohup dotnet run > ../../../backend.log 2>&1 &
    echo $! > ../../../backend.pid
    cd - > /dev/null
    
    print_info "Waiting for backend..."
    sleep 5
fi

# Start Angular dev server
print_info "Starting Angular dev server with hot reload..."
print_info "Using design configuration (local Keycloak)"
echo ""

cd front-end/angular

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm ci
fi

print_success "Development servers ready!"
echo ""
print_info "Access points:"
echo "  ${YELLOW}Frontend (hot reload):${NC}  http://localhost:4200/"
echo "  ${YELLOW}Backend API:${NC}            https://localhost:5007/api/v1"
echo "  ${YELLOW}Swagger:${NC}                https://localhost:5007/swagger/"
echo "  ${YELLOW}Keycloak:${NC}               http://localhost:8443/"
echo ""
print_info "Press Ctrl+C to stop Angular dev server"
print_info "Backend will continue running (stop with ./stop-local.sh)"
echo ""

# Run Angular with design config (points to local Keycloak)
npm run design
