#!/bin/sh

apt-get update

GITHUB_FEED="https://api.github.com/repos/fulcrumapp/fulcrum-desktop/releases/latest"

VERSION=$(curl -s "$GITHUB_FEED" | grep '"name":' | head -n 1 | sed -e '1s/  "name": "//' | sed -e '1s/",//')

DEB_FILE="Fulcrum_${VERSION}_amd64.deb"

DOWNLOAD_URL="https://github.com/fulcrumapp/fulcrum-desktop/releases/download/v${VERSION}/${DEB_FILE}"

cd ~

curl -L $DOWNLOAD_URL -o $DEB_FILE

# these 2 packages are needed for Ubuntu 16.04
sudo apt-get install -y libasound2 libcurl4-openssl-dev

dpkg -i $DEB_FILE

apt-get install -f

echo "Fulcrum successfully installed to /opt/Fulcrum"
echo "To get started, run:"
echo "  /opt/Fulcrum/scripts/fulcrum setup"
