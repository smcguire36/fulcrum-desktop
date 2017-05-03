try {
  if (process.env.DEVELOPMENT) {
    require('../../app/src/main/commands/cli');
  } else {
    require('../resources/app.asar/app/src/main/commands/cli');
  }
} catch (ex) {
  console.log(ex);
}
