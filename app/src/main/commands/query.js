'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csvString = require('csv-string');

var _csvString2 = _interopRequireDefault(_csvString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      let headers = false;

      yield fulcrum.db.each(fulcrum.args.sql, {}, function (columns, row, index) {
        if (!headers) {
          headers = true;
          process.stdout.write(_csvString2.default.stringify(columns.map(function (c) {
            return c.name;
          })));
        }

        if (row) {
          process.stdout.write(_csvString2.default.stringify(row));
        }
      });
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'query',
        desc: 'run a query in the local database',
        builder: {
          sql: {
            type: 'string',
            desc: 'sql query',
            required: true
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3F1ZXJ5LmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJoZWFkZXJzIiwiZnVsY3J1bSIsImRiIiwiZWFjaCIsImFyZ3MiLCJzcWwiLCJjb2x1bW5zIiwicm93IiwiaW5kZXgiLCJwcm9jZXNzIiwic3Rkb3V0Iiwid3JpdGUiLCJzdHJpbmdpZnkiLCJtYXAiLCJjIiwibmFtZSIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJ0eXBlIiwicmVxdWlyZWQiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FnQm5CQSxVQWhCbUIscUJBZ0JOLGFBQVk7QUFDdkIsVUFBSUMsVUFBVSxLQUFkOztBQUVBLFlBQU1DLFFBQVFDLEVBQVIsQ0FBV0MsSUFBWCxDQUFnQkYsUUFBUUcsSUFBUixDQUFhQyxHQUE3QixFQUFrQyxFQUFsQyxFQUFzQyxVQUFDQyxPQUFELEVBQVVDLEdBQVYsRUFBZUMsS0FBZixFQUF5QjtBQUNuRSxZQUFJLENBQUNSLE9BQUwsRUFBYztBQUNaQSxvQkFBVSxJQUFWO0FBQ0FTLGtCQUFRQyxNQUFSLENBQWVDLEtBQWYsQ0FBcUIsb0JBQUlDLFNBQUosQ0FBY04sUUFBUU8sR0FBUixDQUFZO0FBQUEsbUJBQUtDLEVBQUVDLElBQVA7QUFBQSxXQUFaLENBQWQsQ0FBckI7QUFDRDs7QUFFRCxZQUFJUixHQUFKLEVBQVM7QUFDUEUsa0JBQVFDLE1BQVIsQ0FBZUMsS0FBZixDQUFxQixvQkFBSUMsU0FBSixDQUFjTCxHQUFkLENBQXJCO0FBQ0Q7QUFDRixPQVRLLENBQU47QUFVRCxLQTdCa0I7QUFBQTs7QUFDYlMsTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLE9BRFE7QUFFakJDLGNBQU0sbUNBRlc7QUFHakJDLGlCQUFTO0FBQ1BmLGVBQUs7QUFDSGdCLGtCQUFNLFFBREg7QUFFSEYsa0JBQU0sV0FGSDtBQUdIRyxzQkFBVTtBQUhQO0FBREUsU0FIUTtBQVVqQkMsaUJBQVMsTUFBS3hCO0FBVkcsT0FBWixDQUFQO0FBRGM7QUFhZjs7QUFka0IsQyIsImZpbGUiOiJxdWVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDU1YgZnJvbSAnY3N2LXN0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3F1ZXJ5JyxcbiAgICAgIGRlc2M6ICdydW4gYSBxdWVyeSBpbiB0aGUgbG9jYWwgZGF0YWJhc2UnLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBzcWw6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAnc3FsIHF1ZXJ5JyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCBoZWFkZXJzID0gZmFsc2U7XG5cbiAgICBhd2FpdCBmdWxjcnVtLmRiLmVhY2goZnVsY3J1bS5hcmdzLnNxbCwge30sIChjb2x1bW5zLCByb3csIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgaGVhZGVycyA9IHRydWU7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKENTVi5zdHJpbmdpZnkoY29sdW1ucy5tYXAoYyA9PiBjLm5hbWUpKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoQ1NWLnN0cmluZ2lmeShyb3cpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19