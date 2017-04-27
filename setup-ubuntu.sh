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
  nodejs \
  yarn
