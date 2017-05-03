'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodegit = require('nodegit');

var _nodegit2 = _interopRequireDefault(_nodegit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Git {
  static clone(url, path) {
    return _asyncToGenerator(function* () {
      return yield _nodegit2.default.Clone(url, path);
    })();
  }

  static init(path) {
    return _asyncToGenerator(function* () {
      return yield _nodegit2.default.Repository.init(path, 0);
    })();
  }

  static pull(path) {
    return _asyncToGenerator(function* () {
      const repo = yield _nodegit2.default.Repository.open(path);

      yield repo.fetchAll({
        callbacks: {
          credentials: function (url, userName) {
            return _nodegit2.default.Cred.sshKeyFromAgent(userName);
          },
          certificateCheck: function () {
            return 1;
          }
        }
      });

      yield repo.mergeBranches('master', 'origin/master');
    })();
  }
}
exports.default = Git;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2dpdC5qcyJdLCJuYW1lcyI6WyJHaXQiLCJjbG9uZSIsInVybCIsInBhdGgiLCJDbG9uZSIsImluaXQiLCJSZXBvc2l0b3J5IiwicHVsbCIsInJlcG8iLCJvcGVuIiwiZmV0Y2hBbGwiLCJjYWxsYmFja3MiLCJjcmVkZW50aWFscyIsInVzZXJOYW1lIiwiQ3JlZCIsInNzaEtleUZyb21BZ2VudCIsImNlcnRpZmljYXRlQ2hlY2siLCJtZXJnZUJyYW5jaGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7QUFFZSxNQUFNQSxHQUFOLENBQVU7QUFDdkIsU0FBYUMsS0FBYixDQUFtQkMsR0FBbkIsRUFBd0JDLElBQXhCLEVBQThCO0FBQUE7QUFDNUIsYUFBTyxNQUFNLGtCQUFJQyxLQUFKLENBQVVGLEdBQVYsRUFBZUMsSUFBZixDQUFiO0FBRDRCO0FBRTdCOztBQUVELFNBQWFFLElBQWIsQ0FBa0JGLElBQWxCLEVBQXdCO0FBQUE7QUFDdEIsYUFBTyxNQUFNLGtCQUFJRyxVQUFKLENBQWVELElBQWYsQ0FBb0JGLElBQXBCLEVBQTBCLENBQTFCLENBQWI7QUFEc0I7QUFFdkI7O0FBRUQsU0FBYUksSUFBYixDQUFrQkosSUFBbEIsRUFBd0I7QUFBQTtBQUN0QixZQUFNSyxPQUFPLE1BQU0sa0JBQUlGLFVBQUosQ0FBZUcsSUFBZixDQUFvQk4sSUFBcEIsQ0FBbkI7O0FBRUEsWUFBTUssS0FBS0UsUUFBTCxDQUFjO0FBQ2xCQyxtQkFBVztBQUNUQyx1QkFBYSxVQUFTVixHQUFULEVBQWNXLFFBQWQsRUFBd0I7QUFDbkMsbUJBQU8sa0JBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkYsUUFBekIsQ0FBUDtBQUNELFdBSFE7QUFJVEcsNEJBQWtCLFlBQVc7QUFDM0IsbUJBQU8sQ0FBUDtBQUNEO0FBTlE7QUFETyxPQUFkLENBQU47O0FBV0EsWUFBTVIsS0FBS1MsYUFBTCxDQUFtQixRQUFuQixFQUE2QixlQUE3QixDQUFOO0FBZHNCO0FBZXZCO0FBeEJzQjtrQkFBSmpCLEciLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdpdCBmcm9tICdub2RlZ2l0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0IHtcbiAgc3RhdGljIGFzeW5jIGNsb25lKHVybCwgcGF0aCkge1xuICAgIHJldHVybiBhd2FpdCBnaXQuQ2xvbmUodXJsLCBwYXRoKTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBpbml0KHBhdGgpIHtcbiAgICByZXR1cm4gYXdhaXQgZ2l0LlJlcG9zaXRvcnkuaW5pdChwYXRoLCAwKTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBwdWxsKHBhdGgpIHtcbiAgICBjb25zdCByZXBvID0gYXdhaXQgZ2l0LlJlcG9zaXRvcnkub3BlbihwYXRoKTtcblxuICAgIGF3YWl0IHJlcG8uZmV0Y2hBbGwoe1xuICAgICAgY2FsbGJhY2tzOiB7XG4gICAgICAgIGNyZWRlbnRpYWxzOiBmdW5jdGlvbih1cmwsIHVzZXJOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGdpdC5DcmVkLnNzaEtleUZyb21BZ2VudCh1c2VyTmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNlcnRpZmljYXRlQ2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhd2FpdCByZXBvLm1lcmdlQnJhbmNoZXMoJ21hc3RlcicsICdvcmlnaW4vbWFzdGVyJyk7XG4gIH1cbn1cbiJdfQ==