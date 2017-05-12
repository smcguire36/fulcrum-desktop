#!/bin/sh

apt-get update

METABASE_URL="http://downloads.metabase.com/v0.24.1/metabase.jar"

cd ~

curl -L "$METABASE_URL" -o metabase.jar

sudo add-apt-repository ppa:openjdk-r/ppa -y

sudo apt-get install -y openjdk-8-jre

echo "To start metabase:"
echo "  java -jar metabase.jar"
