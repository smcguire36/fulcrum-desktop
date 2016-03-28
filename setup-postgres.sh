echo 'DROP DATABASE fulcrumapp;' | psql -U postgres
echo 'CREATE DATABASE fulcrumapp;' | psql -U postgres
echo 'CREATE EXTENSION postgis;' | psql -U postgres fulcrumapp
