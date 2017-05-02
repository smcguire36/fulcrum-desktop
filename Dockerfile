FROM ubuntu:14.04

# System Dependencies
RUN apt-get update -y && \
    apt-get install -y \
      software-properties-common \
      python-software-properties \
      curl \
      build-essential \
      libssl-dev \
      wget \
      vim \
      zip \
      libpq-dev \
      libxml2-dev \
      libxslt1-dev \
      imagemagick \
      libmagickwand-dev \
      git \
      gawk \
      libyaml-dev \
      sqlite3 \
      autoconf \
      libgmp-dev \
      libgdbm-dev \
      libncurses5-dev \
      automake \
      make \
      bison \
      flex \
      libtool \
      xz-utils \
      libffi-dev \
      libgmp-dev \
      apt-transport-https \
      libreadline6-dev

# GIS Dependencies
RUN add-apt-repository -y ppa:ubuntugis/ppa && \
    apt-get update -y && \
    apt-get install -y \
      libjson0 \
      libjson0-dev \
      libsqlite3-dev \
      libproj-dev \
      libgeos-dev \
      libgeos++-dev \
      libspatialite-dev \
      libgeotiff-dev \
      libgdal-dev \
      gdal-bin \
      libmapnik-dev \
      mapnik-utils \
      python-dev \
      python-setuptools \
      python-pip \
      python-gdal \
      python-mapnik \
      libprotobuf-dev \
      protobuf-compiler

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -

RUN apt-get update -y

RUN sudo apt-get install -y nodejs yarn gdebi-core

RUN wget --quiet https://github.com/fulcrumapp/fulcrum-desktop/releases/download/v0.0.24/Fulcrum_0.0.24_amd64.deb -O fulcrum.deb && gdebi fulcrum.deb

RUN apt-get install -f -y

ENV PATH "$PATH:/opt/Fulcrum"
