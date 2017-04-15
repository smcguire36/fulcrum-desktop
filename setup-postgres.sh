echo 'DROP DATABASE fulcrumapp;' | psql fulcrum_development
echo 'CREATE DATABASE fulcrumapp;' | psql fulcrum_development
echo 'CREATE EXTENSION postgis;' | psql fulcrumapp
