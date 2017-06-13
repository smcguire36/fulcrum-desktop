#!/bin/sh

METABASE_URL="http://downloads.metabase.com/v0.24.2/metabase.jar"

sudo apt-get update

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
mkdir -p geoserver

curl -L "$METABASE_URL" -o metabase/metabase.jar

sudo add-apt-repository ppa:openjdk-r/ppa -y

sudo apt-get install -y openjdk-8-jre

sudo yarn global add jsreport-cli

curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/metabase.service" > /home/ubuntu/metabase/metabase.service
sudo cp /home/ubuntu/metabase/metabase.service /etc/systemd/system/metabase.service

curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/jsreport.service" > /home/ubuntu/jsreport/jsreport.service
sudo cp /home/ubuntu/jsreport/jsreport.service /etc/systemd/system/jsreport.service

curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/metabase.sh" > /home/ubuntu/metabase/metabase.sh
curl -L "https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/resources/linux/jsreport.sh" > /home/ubuntu/jsreport/jsreport.sh

sudo chmod +x /home/ubuntu/metabase/metabase.sh
sudo chmod +x /home/ubuntu/jsreport/jsreport.sh

cd ~/jsreport

sudo jsreport init

sudo systemctl daemon-reload

# GeoServer
sudo apt-get install -y tomcat7 tomcat7-admin

cd ~/geoserver

curl -L "http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0.war" > geoserver.war

sudo cp geoserver.war /var/lib/tomcat7/webapps/geoserver.war

sudo unzip /var/lib/tomcat7/webapps/geoserver.war -d /var/lib/tomcat7/webapps/geoserver

wget http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0-excel-plugin.zip
wget http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0-gdal-plugin.zip
wget http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0-geopkg-plugin.zip
wget http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0-spatialite-plugin.zip
wget http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0-vectortiles-plugin.zip
wget http://fulcrum-devops.s3.amazonaws.com/geoserver/geoserver-2.11.0-wps-plugin.zip

unzip -o geoserver-2.11.0-excel-plugin.zip -d plugins
unzip -o geoserver-2.11.0-gdal-plugin.zip -d plugins
unzip -o geoserver-2.11.0-geopkg-plugin.zip -d plugins
unzip -o geoserver-2.11.0-spatialite-plugin.zip -d plugins
unzip -o geoserver-2.11.0-vectortiles-plugin.zip -d plugins
unzip -o geoserver-2.11.0-wps-plugin.zip -d plugins

sudo cp -rp plugins/*.jar /var/lib/tomcat7/webapps/geoserver/WEB-INF/lib/

sudo chown -R tomcat7:tomcat7 /var/lib/tomcat7/webapps/geoserver

sudo systemctl enable metabase
sudo systemctl enable jsreport

sudo service metabase stop
sudo service jsreport stop
sudo service tomcat7 stop

sudo service metabase start
sudo service jsreport start
sudo service tomcat7 start

