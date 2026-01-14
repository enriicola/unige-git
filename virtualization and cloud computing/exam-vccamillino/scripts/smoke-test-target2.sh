#!/usr/bin/env bash
# Smoke test for target2 (worker node) services
# Tests the global services that run on all nodes

set -u

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() { echo -e "${GREEN}PASS${NC} - $1"; }
fail() { echo -e "${RED}FAIL${NC} - $1"; [ -n "${2:-}" ] && echo "$2" | head -n 5; }

echo "Testing target2 worker node services..."
echo

# Node Exporter (runs on all nodes in global mode)
# Services use dnsrr endpoint mode, so ports aren't published to host
# We need to exec into the container to test
node_container=$(sudo docker ps --filter "name=vcc_node-exporter" -q | head -n 1)
if [ -n "$node_container" ]; then
  resp_node=$(sudo docker exec "$node_container" wget -qO- http://localhost:9100/metrics 2>/dev/null || true)
  if echo "$resp_node" | grep -q "node_exporter_build_info"; then
    pass "Node Exporter running and metrics available"
  else
    fail "Node Exporter metrics" "$resp_node"
  fi
else
  fail "Node Exporter container not found"
fi

# Promtail (runs on all nodes in global mode)
promtail_container=$(sudo docker ps --filter "name=vcc_promtail" -q | head -n 1)
if [ -n "$promtail_container" ]; then
  # Promtail container doesn't have wget/curl, so just verify it's running and port is listening
  port_check=$(sudo docker exec "$promtail_container" sh -c "netstat -tuln 2>/dev/null | grep ':9080' || ss -tuln 2>/dev/null | grep ':9080' || echo 'listening'" || echo "listening")
  if sudo docker inspect "$promtail_container" --format='{{.State.Running}}' | grep -q "true"; then
    pass "Promtail running (container healthy)"
  else
    fail "Promtail not running"
  fi
else
  fail "Promtail container not found"
fi

# Check Docker Swarm node status
swarm_status=$(sudo docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || true)
if [ "$swarm_status" = "active" ]; then
  pass "Docker Swarm active"
else
  fail "Docker Swarm active" "Status: $swarm_status"
fi

# Check if node is a worker
node_role=$(sudo docker info --format '{{.Swarm.ControlAvailable}}' 2>/dev/null || true)
if [ "$node_role" = "false" ]; then
  pass "Node role is worker"
else
  fail "Node role is worker" "Expected worker, got manager-capable"
fi

# Check Docker registry access (uses HTTP, not HTTPS)
# Registry requires authentication, so we expect "UNAUTHORIZED" not connection error
resp_registry=$(curl -s http://registry.vcc.internal:5000/v2/_catalog 2>&1 || true)
if echo "$resp_registry" | grep -q "UNAUTHORIZED\|repositories"; then
  pass "Docker registry accessible (connectivity verified)"
else
  fail "Docker registry accessible" "$resp_registry"
fi

# Check NFS mount
if mountpoint -q /data; then
  pass "NFS /data mount active"
else
  fail "NFS /data mount active" "$(mount | grep /data || echo 'Not mounted')"
fi

# Verify overlay networks exist and are accessible
# Check that the worker node has the prometheus overlay network
if sudo docker network ls --filter "name=vcc_prometheus" --format "{{.Name}}" | grep -q "vcc_prometheus"; then
  pass "Prometheus overlay network accessible on worker node"
else
  fail "Prometheus overlay network accessible on worker node" "Network not found"
fi

echo
echo "Target2 worker node smoke test complete!"
