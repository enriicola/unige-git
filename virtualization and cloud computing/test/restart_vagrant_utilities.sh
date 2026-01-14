#!/bin/bash
# The commands to stop/restart the vagrant vmware utility on Mac are:

sudo launchctl unload -w /Library/LaunchDaemons/com.vagrant.vagrant-vmware-utility.plist
sudo launchctl load -w /Library/LaunchDaemons/com.vagrant.vagrant-vmware-utility.plist
