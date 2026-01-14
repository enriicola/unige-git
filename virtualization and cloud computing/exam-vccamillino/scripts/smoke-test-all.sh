#!/usr/bin/env bash
set -e
set -u
set -o pipefail

echo "testing target1..."
vagrant ssh target1 -c "bash /vagrant/scripts/smoke-test-target1.sh"

echo "testing target2..."
vagrant ssh target2 -c "bash /vagrant/scripts/smoke-test-target2.sh"
