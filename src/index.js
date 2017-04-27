require('source-map-support').install();
require('babel-register')({
  sourceMaps: 'inline',
  sourceType: 'module',
  resolveModuleSource: (source, filename) => {
    if (source === 'fulcrum') {
      return 'fulcrum-sync-plugin';
    }
    return source;
  }
});
require('./main');
