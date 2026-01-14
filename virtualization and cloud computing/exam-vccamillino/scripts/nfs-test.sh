#!/usr/bin/env bash
set -e
set -u
set -o pipefail

echo "Testing VirtualBox shared folder /vagrant..."
vagrant ssh target1 -c "cd /vagrant && touch pippo pluto paperino"
vagrant ssh target2 -c "cd /vagrant && touch topolino topolina topolini"

echo "Verifying VirtualBox shared folder files are visible on both nodes..."
vagrant ssh target1 -c "ls -la /vagrant/pippo /vagrant/pluto /vagrant/paperino /vagrant/topolino /vagrant/topolina /vagrant/topolini"
vagrant ssh target2 -c "ls -la /vagrant/pippo /vagrant/pluto /vagrant/paperino /vagrant/topolino /vagrant/topolina /vagrant/topolini"

echo ""
echo "Testing NFS shared directory /data..."

# Test NFS mount status
echo "Checking NFS mount status..."
vagrant ssh target1 -c "mount | grep '/data' || echo 'No NFS mount on target1 (expected - it is the server)'"
vagrant ssh target2 -c "mount | grep '/data' || echo 'ERROR: No NFS mount found on target2!'"

# Test file creation and visibility across nodes
echo "Creating test files from target1..."
TIMESTAMP=$(date +%s)
vagrant ssh target1 -c "sudo touch /data/nfs_test_target1_${TIMESTAMP}.txt && echo 'Test file from target1' | sudo tee /data/nfs_test_target1_${TIMESTAMP}.txt > /dev/null"

echo "Creating test files from target2..."
vagrant ssh target2 -c "sudo touch /data/nfs_test_target2_${TIMESTAMP}.txt && echo 'Test file from target2' | sudo tee /data/nfs_test_target2_${TIMESTAMP}.txt > /dev/null"

echo "Verifying cross-node file visibility..."
echo "Files visible from target1:"
vagrant ssh target1 -c "ls -la /data/nfs_test_target*_${TIMESTAMP}.txt"

echo "Files visible from target2:"
vagrant ssh target2 -c "ls -la /data/nfs_test_target*_${TIMESTAMP}.txt"

echo "Testing file content accessibility..."
echo "Reading target2's file from target1:"
vagrant ssh target1 -c "cat /data/nfs_test_target2_${TIMESTAMP}.txt"

echo "Reading target1's file from target2:"
vagrant ssh target2 -c "cat /data/nfs_test_target1_${TIMESTAMP}.txt"

echo "Testing write permissions from both nodes..."
vagrant ssh target1 -c "echo 'Modified from target1' | sudo tee -a /data/nfs_test_target2_${TIMESTAMP}.txt > /dev/null"
vagrant ssh target2 -c "echo 'Modified from target2' | sudo tee -a /data/nfs_test_target1_${TIMESTAMP}.txt > /dev/null"

echo "Verifying modifications:"
echo "target2's file modified from target1:"
vagrant ssh target2 -c "cat /data/nfs_test_target2_${TIMESTAMP}.txt"

echo "target1's file modified from target2:"
vagrant ssh target1 -c "cat /data/nfs_test_target1_${TIMESTAMP}.txt"

# Clean up test files
echo "Cleaning up test files..."
vagrant ssh target1 -c "sudo rm -f /data/nfs_test_target*_${TIMESTAMP}.txt"

# Clean up VirtualBox test files
echo "Cleaning up VirtualBox test files..."
vagrant ssh target1 -c "rm -f /vagrant/pippo /vagrant/pluto /vagrant/paperino /vagrant/topolino /vagrant/topolina /vagrant/topolini"

echo ""
echo "NFS test completed successfully!"
echo "Both VirtualBox shared folders (/vagrant) and NFS mounts (/data) are working correctly."
