let json;

if (process.env.DEVELOPMENT) {
  json = require('../package');
} else {
  json = require('./package');
}

export default json;
