#!/bin/zsh

clear||cls # macos&linux||windows

echo "*************************************************"
echo "\033[32m📡 Welcome to the Enrico's Vulnerability Scanner!\033[0m"
echo "*************************************************"


echo "\n📦 Installing the required packages..."
python3 -m pip install reportlab nvdlib pyyaml requests pyopenssl ndg-httpsclient pyasn1 mysql-connector-python

# docker up
# docker scout cves mysql
# docker ps

# fetch the IP address of the containers of every service
# docker inspect my-apache-app | grep IPAddress

# fetch the port of the containers of every service
# docker port my-apache-app

# store the IP addresses and ports of every service in a list
# TODO 

# build the yaml input file according to the IP addresses and ports of the services
# TODO


# launch the vulnerability scanner program
echo "\n🚀 Launching the scanner..."
python3 scanner.py #| tee output #tee command used to duplicate the stdout in a given file

if [ $? -eq 0 ]; then
    echo "✅ The scanner has finished successfully :D"
else
    echo "❌ The scanner has failed :c"
fi

# check if uname is Darwin (MacOS) or windows or linux
output_file="report.pdf"
if [ "$(uname)" == "Darwin" ]; then
    open $output_file
elif [ "$(uname)" == "Windows_NT" ]; then
    $output_file
else
    xdg-open $output_file
fi