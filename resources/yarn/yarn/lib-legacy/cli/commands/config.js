'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFlags = exports.run = undefined;

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

exports.hasWrapper = hasWrapper;

var _buildSubCommands2;

function _load_buildSubCommands() {
  return _buildSubCommands2 = _interopRequireDefault(require('./_build-sub-commands.js'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasWrapper(flags, args) {
  return args[0] !== 'get';
}
/* eslint object-shorthand: 0 */

var _buildSubCommands = (0, (_buildSubCommands2 || _load_buildSubCommands()).default)('config', {
  set: (() => {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      if (args.length === 0 || args.length > 2) {
        return false;
      }
      const key = args[0];
      const val = args[1] || true;
      const yarnConfig = config.registries.yarn;
      yield yarnConfig.saveHomeConfig({ [key]: val });
      reporter.success(reporter.lang('configSet', key, val));
      return true;
    });

    function set(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    }

    return set;
  })(),
  get: function get(config, reporter, flags, args) {
    if (args.length !== 1) {
      return false;
    }

    reporter.log(String(config.getOption(args[0])));
    return true;
  },


  delete: (() => {
    var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      if (args.length !== 1) {
        return false;
      }

      const key = args[0];
      const yarnConfig = config.registries.yarn;
      yield yarnConfig.saveHomeConfig({ [key]: undefined });
      reporter.success(reporter.lang('configDelete', key));
      return true;
    });

    function _delete(_x5, _x6, _x7, _x8) {
      return _ref2.apply(this, arguments);
    }

    return _delete;
  })(),

  list: function list(config, reporter, flags, args) {
    if (args.length) {
      return false;
    }

    reporter.info(reporter.lang('configYarn'));
    reporter.inspect(config.registries.yarn.config);

    reporter.info(reporter.lang('configNpm'));
    reporter.inspect(config.registries.npm.config);

    return true;
  }
});

const run = _buildSubCommands.run,
      setFlags = _buildSubCommands.setFlags;
exports.run = run;
exports.setFlags = setFlags;