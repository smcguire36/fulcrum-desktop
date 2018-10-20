'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      yield _this.app.activatePlugins();

      const account = yield fulcrum.fetchAccount(fulcrum.args.org);

      if (account == null) {
        console.error('Unable to find organization:', fulcrum.args.org);
        return;
      }

      yield account.reset();
    });
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'reset',
        desc: 'reset an organization',
        builder: {
          org: {
            desc: 'organization name',
            required: true,
            type: 'string'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3Jlc2V0LmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJhcHAiLCJhY3RpdmF0ZVBsdWdpbnMiLCJhY2NvdW50IiwiZnVsY3J1bSIsImZldGNoQWNjb3VudCIsImFyZ3MiLCJvcmciLCJjb25zb2xlIiwiZXJyb3IiLCJyZXNldCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJyZXF1aXJlZCIsInR5cGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFBZSxNQUFNO0FBQUE7QUFBQTs7QUFBQSxTQWdCbkJBLFVBaEJtQixxQkFnQk4sYUFBWTtBQUN2QixZQUFNLE1BQUtDLEdBQUwsQ0FBU0MsZUFBVCxFQUFOOztBQUVBLFlBQU1DLFVBQVUsTUFBTUMsUUFBUUMsWUFBUixDQUFxQkQsUUFBUUUsSUFBUixDQUFhQyxHQUFsQyxDQUF0Qjs7QUFFQSxVQUFJSixXQUFXLElBQWYsRUFBcUI7QUFDbkJLLGdCQUFRQyxLQUFSLENBQWMsOEJBQWQsRUFBOENMLFFBQVFFLElBQVIsQ0FBYUMsR0FBM0Q7QUFDQTtBQUNEOztBQUVELFlBQU1KLFFBQVFPLEtBQVIsRUFBTjtBQUNELEtBM0JrQjtBQUFBOztBQUNiQyxNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsT0FEUTtBQUVqQkMsY0FBTSx1QkFGVztBQUdqQkMsaUJBQVM7QUFDUFIsZUFBSztBQUNITyxrQkFBTSxtQkFESDtBQUVIRSxzQkFBVSxJQUZQO0FBR0hDLGtCQUFNO0FBSEg7QUFERSxTQUhRO0FBVWpCQyxpQkFBUyxPQUFLbEI7QUFWRyxPQUFaLENBQVA7QUFEYztBQWFmOztBQWRrQixDIiwiZmlsZSI6InJlc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGFzeW5jIHRhc2soY2xpKSB7XHJcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xyXG4gICAgICBjb21tYW5kOiAncmVzZXQnLFxyXG4gICAgICBkZXNjOiAncmVzZXQgYW4gb3JnYW5pemF0aW9uJyxcclxuICAgICAgYnVpbGRlcjoge1xyXG4gICAgICAgIG9yZzoge1xyXG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgdGhpcy5hcHAuYWN0aXZhdGVQbHVnaW5zKCk7XHJcblxyXG4gICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IGZ1bGNydW0uZmV0Y2hBY2NvdW50KGZ1bGNydW0uYXJncy5vcmcpO1xyXG5cclxuICAgIGlmIChhY2NvdW50ID09IG51bGwpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignVW5hYmxlIHRvIGZpbmQgb3JnYW5pemF0aW9uOicsIGZ1bGNydW0uYXJncy5vcmcpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgYWNjb3VudC5yZXNldCgpO1xyXG4gIH1cclxufVxyXG4iXX0=