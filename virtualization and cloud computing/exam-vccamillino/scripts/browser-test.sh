#!/usr/bin/env bash
set -e
set -u
set -o pipefail

# prometheus
curl -sk https://prom.vcc.internal/-/ready  # Should return: "Prometheus Server is Ready."

# Dex discovery
curl -sk https://auth.vcc.internal/.well-known/openid-configuration | jq .issuer  # Should return: "https://auth.vcc.internal"

# grafana
curl -sk https://mon.vcc.internal/api/health | jq .  # Should return: {"database": "ok", ...}

# Forgejo
curl -sk https://git.vcc.internal/api/healthz  # Should return: HTTP 200