if [ -z "$GH_TOKEN" ]; then
  echo "You must set the GH_TOKEN environment variable."
  echo "See README.md for more details."
  exit 1
fi

# This will build, package and upload the app to GitHub.

yarn build
./bump-version
cp src/version.json app/version.json

if [ "$1" == "mac" ]; then
  node_modules/.bin/build --mac -p always
elif [ "$1" == "linux" ]; then
  node_modules/.bin/build --linux -p always
else
  echo "Must pass either mac or linux"
  exit 1
fi
