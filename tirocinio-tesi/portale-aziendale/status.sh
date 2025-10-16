#!/bin/zsh

# Portale Aziendale - Status Check Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local service=$1
    local url=$2
    
    echo -n "${BLUE}$service:${NC} "
    if curl -k -s -f -o /dev/null "$url" 2>/dev/null; then
        echo "${GREEN}✓ Running${NC}"
        return 0
    else
        echo "${RED}✗ Not responding${NC}"
        return 1
    fi
}

print_port() {
    local name=$1
    local port=$2
    
    echo -n "${BLUE}$name (port $port):${NC} "
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "${GREEN}✓ Listening${NC}"
        return 0
    else
        echo "${RED}✗ Not listening${NC}"
        return 1
    fi
}

echo ""
echo "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${BLUE}║                                                           ║${NC}"
echo "${BLUE}║         Portale Aziendale - Service Status                ║${NC}"
echo "${BLUE}║                                                           ║${NC}"
echo "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Docker Swarm
echo -n "${BLUE}Docker Swarm:${NC} "
if docker info 2>/dev/null | grep -q "Swarm: active"; then
    echo "${GREEN}✓ Active${NC}"
else
    echo "${RED}✗ Inactive${NC}"
fi

# Check Keycloak stack
echo -n "${BLUE}Keycloak Stack:${NC} "
if docker stack ps kc-portale-aziendale >/dev/null 2>&1; then
    REPLICAS=$(docker stack ps kc-portale-aziendale --format "{{.CurrentState}}" | grep -c "Running" || echo "0")
    echo "${GREEN}✓ Deployed ($REPLICAS replicas running)${NC}"
else
    echo "${RED}✗ Not deployed${NC}"
fi

echo ""
echo "${BLUE}Service Endpoints:${NC}"
print_status "  Backend API       " "https://localhost:5007/swagger/"
print_status "  Frontend          " "https://localhost:5007/"
print_status "  Keycloak          " "http://localhost:8443/"

echo ""
echo "${BLUE}Port Status:${NC}"
print_port "  Backend HTTPS     " "5007"
print_port "  Keycloak HTTPS    " "8443"
print_port "  PostgreSQL        " "5432"

echo ""

# Check backend process
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "${BLUE}Backend Process:${NC} ${GREEN}✓ Running (PID: $BACKEND_PID)${NC}"
    else
        echo "${BLUE}Backend Process:${NC} ${RED}✗ Not running (stale PID file)${NC}"
    fi
else
    echo "${BLUE}Backend Process:${NC} ${YELLOW}⚠ No PID file found${NC}"
fi

echo ""
echo "${BLUE}Quick Access URLs:${NC}"
echo "  Frontend:       ${YELLOW}https://localhost:5007/${NC}"
echo "  API Swagger:    ${YELLOW}https://localhost:5007/swagger/${NC}"
echo "  Keycloak Admin: ${YELLOW}http://localhost:8443/${NC}"
echo ""

# Check logs
if [ -f backend.log ]; then
    echo "${BLUE}Recent Backend Logs (last 5 lines):${NC}"
    tail -n 5 backend.log | sed 's/^/  /'
    echo ""
    echo "View full logs: ${YELLOW}tail -f backend.log${NC}"
    echo ""
fi
