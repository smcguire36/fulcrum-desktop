#!/bin/sh

METABASE_URL="http://downloads.metabase.com/v0.24.1/metabase.jar"

apt-get update

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

sudo apt-get update

sudo apt-get install -y \
  git \
  wget \
  curl \
  python-software-properties \
  autoconf \
  bison \
  flex \
  libtool \
  make \
  build-essential \
  binutils-doc \
  vim \
  zip \
  libpq-dev \
  libdbus-1-dev \
  libgconf2-dev \
  libgnome-keyring-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libnss3-dev \
  libxtst-dev \
  gcc-multilib \
  g++-multilib \
  libxss1 \
  indicator-application \
  libappindicator1 \
  libappindicator3-1 \
  libdbusmenu-glib4 \
  libdbusmenu-gtk3-4 \
  libdbusmenu-gtk4 \
  libindicator3-7 \
  libindicator7 \
  icnsutils \
  graphicsmagick \
  rpm \
  bsdtar \
  xz-utils \
  nodejs \
  yarn

cd ~

mkdir -p metabase
mkdir -p jsreport

curl -L "$METABASE_URL" -o metabase/metabase.jar

sudo add-apt-repository ppa:openjdk-r/ppa -y

sudo apt-get install -y openjdk-8-jre

sudo yarn global add jsreport-cli

sudo curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/metabase.service" > /etc/systemd/system/metabase.service
sudo curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/jsreport.service" > /etc/systemd/system/jsreport.service

sudo curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/metabase.sh" > /home/ubuntu/metabase/metabase.sh
sudo curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/jsreport.sh" > /home/ubuntu/metabase/jsreport.sh

sudo chmod +x /home/ubuntu/metabase/metabase.sh
sudo chmod +x /home/ubuntu/jsreport/jsreport.sh

cd ~/jsreport

sudo jsreport init

sudo systemctl daemon-reload

sudo service metabase start
sudo service jsreport start
