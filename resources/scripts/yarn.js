try {
  if (process.env.DEVELOPMENT) {
    require('../yarn/yarn.asar/bin/yarn.js');
  } else {
    require('../resources/yarn.asar/bin/yarn.js');
  }
} catch (ex) {
  console.log(ex);
}
