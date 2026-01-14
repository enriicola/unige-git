#!/usr/bin/env bash
# Simple smoke test for VCC services via Traefik on target1
# Uses curl --resolve to set SNI/Host to the service domains

set -u

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() { echo -e "${GREEN}PASS${NC} - $1"; }
fail() { echo -e "${RED}FAIL${NC} - $1"; [ -n "${2:-}" ] && echo "$2" | head -n 5; }

# Git (Forgejo)
resp_git=$(curl -sk --resolve git.vcc.internal:443:127.0.0.1 https://git.vcc.internal/ || true)
if echo "$resp_git" | grep -iq '<title>.*VCC Git'; then
  pass "Forgejo homepage"
else
  fail "Forgejo homepage" "$resp_git"
fi

# Dex OIDC discovery
resp_dex=$(curl -sk --resolve auth.vcc.internal:443:127.0.0.1 https://auth.vcc.internal/.well-known/openid-configuration || true)
if echo "$resp_dex" | grep -q '"issuer"\s*:\s*"https://auth.vcc.internal"'; then
  pass "Dex OIDC discovery"
else
  fail "Dex OIDC discovery" "$resp_dex"
fi

# Grafana login page
resp_graf=$(curl -sk --resolve mon.vcc.internal:443:127.0.0.1 https://mon.vcc.internal/login || true)
if echo "$resp_graf" | grep -iq '<title>Grafana'; then
  pass "Grafana login"
else
  fail "Grafana login" "$resp_graf"
fi

# Prometheus readiness
resp_prom=$(curl -sk --resolve prom.vcc.internal:443:127.0.0.1 https://prom.vcc.internal/-/ready || true)
if echo "$resp_prom" | grep -q "Prometheus Server is Ready."; then
  pass "Prometheus readiness"
else
  fail "Prometheus readiness" "$resp_prom"
fi
