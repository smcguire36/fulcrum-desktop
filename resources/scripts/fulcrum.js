try {
  if (process.env.DEVELOPMENT) {
    require('../../app/main/commands/cli');
  } else {
    require('../resources/app.asar/app/main/commands/cli');
  }
} catch (ex) {
  console.log(ex);
}
