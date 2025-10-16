#!/bin/zsh

# Portale Aziendale - Stop Local Services Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo ""
echo "${YELLOW}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${YELLOW}║                                                           ║${NC}"
echo "${YELLOW}║         Stopping Portale Aziendale Services...           ║${NC}"
echo "${YELLOW}║                                                           ║${NC}"
echo "${YELLOW}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Stop backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    print_info "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || print_warning "Backend process not found"
    rm backend.pid
    print_success "Backend stopped"
else
    print_warning "No backend PID file found"
    # Try to kill any dotnet process on port 5007
    if lsof -ti:5007 >/dev/null 2>&1; then
        print_info "Found process on port 5007, stopping it..."
        lsof -ti:5007 | xargs kill -9 2>/dev/null || true
        print_success "Process on port 5007 stopped"
    fi
fi

# Stop Keycloak stack
print_info "Stopping Keycloak stack..."
if docker stack ps kc-portale-aziendale >/dev/null 2>&1; then
    sudo docker stack rm kc-portale-aziendale
    print_success "Keycloak stack stopped"
    print_info "Waiting for cleanup..."
    sleep 5
else
    print_warning "Keycloak stack not running"
fi

# Optional: Stop Docker Swarm
echo ""
echo "Do you want to leave Docker Swarm? (y/N)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    print_info "Leaving Docker Swarm..."
    docker swarm leave --force
    print_success "Left Docker Swarm"
fi

echo ""
print_success "All services stopped!"
echo ""
print_info "To remove Docker secrets, run:"
echo "  ${YELLOW}docker secret rm kc_user kc_pwd pgsql_db_user pgsql_db_pwd${NC}"
echo ""
