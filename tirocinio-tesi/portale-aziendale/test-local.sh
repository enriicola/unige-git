#!/bin/zsh

# Portale Aziendale - Smoke Test Script
# Quick verification that all services are functional

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -k -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_code" ] || [ "$response" = "302" ]; then
        echo "${GREEN}✓ PASS${NC} (HTTP $response)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo "${RED}✗ FAIL${NC} (Expected $expected_code, got $response)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo ""
echo "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${BLUE}║                                                           ║${NC}"
echo "${BLUE}║         Portale Aziendale - Smoke Tests                  ║${NC}"
echo "${BLUE}║                                                           ║${NC}"
echo "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Infrastructure Tests
echo "${YELLOW}Infrastructure Tests:${NC}"
test_endpoint "Keycloak" "http://localhost:8443/"
test_endpoint "Keycloak Health" "http://localhost:8443/realms/master"
echo ""

# Backend Tests
echo "${YELLOW}Backend API Tests:${NC}"
test_endpoint "Backend Root" "https://localhost:5007/"
test_endpoint "Swagger UI" "https://localhost:5007/swagger/index.html"
test_endpoint "API v1 (should redirect to auth)" "https://localhost:5007/api/v1/Notice/searchNoticeData" "401"
echo ""

# Frontend Tests
echo "${YELLOW}Frontend Tests:${NC}"
test_endpoint "Frontend Root" "https://localhost:5007/"
test_endpoint "Frontend Assets" "https://localhost:5007/assets/layout/images/logo-dark.png"
echo ""

# Results Summary
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "${GREEN}✓ All tests passed! ($PASSED/$((PASSED + FAILED)))${NC}"
    echo ""
    echo "${GREEN}Your application is ready to use!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Configure Keycloak realm (see LOCAL-SETUP.md)"
    echo "  2. Create test users"
    echo "  3. Login at ${YELLOW}https://localhost:5007/${NC}"
    echo ""
    exit 0
else
    echo "${RED}✗ Some tests failed! ($PASSED passed, $FAILED failed)${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Check service status: ${YELLOW}./status.sh${NC}"
    echo "  - View backend logs: ${YELLOW}tail -f backend.log${NC}"
    echo "  - Check Keycloak logs: ${YELLOW}docker service logs kc-portale-aziendale_keycloak${NC}"
    echo ""
    exit 1
fi
