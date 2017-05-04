'use strict';

var _child_process = require('child_process');

var _electron = require('electron');

window.onload = () => {
  document.querySelector('.cli').onclick = () => {
    const cmd = 'rm /usr/local/bin/fulcrum && ln -s /Applications/Fulcrum.app/Contents/scripts/fulcrum /usr/local/bin/fulcrum';

    (0, _child_process.exec)(cmd, (error, stdout, stderr) => {
      console.log('Finished', error);

      if (error == null && stderr.toString().trim().length === 0) {
        alert(`Successfully installed 'fulcrum' command at /usr/local/bin/fulcrum`);
      }
    });
  };

  document.querySelector('.quit').onclick = () => {
    _electron.remote.app.quit();
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9ubG9hZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbWQiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsImNvbnNvbGUiLCJsb2ciLCJ0b1N0cmluZyIsInRyaW0iLCJsZW5ndGgiLCJhbGVydCIsImFwcCIsInF1aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0FBRUFBLE9BQU9DLE1BQVAsR0FBZ0IsTUFBTTtBQUNwQkMsV0FBU0MsYUFBVCxDQUF1QixNQUF2QixFQUErQkMsT0FBL0IsR0FBeUMsTUFBTTtBQUM3QyxVQUFNQyxNQUFNLDhHQUFaOztBQUVBLDZCQUFLQSxHQUFMLEVBQVUsQ0FBQ0MsS0FBRCxFQUFRQyxNQUFSLEVBQWdCQyxNQUFoQixLQUEyQjtBQUNuQ0MsY0FBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JKLEtBQXhCOztBQUVBLFVBQUlBLFNBQVMsSUFBVCxJQUFpQkUsT0FBT0csUUFBUCxHQUFrQkMsSUFBbEIsR0FBeUJDLE1BQXpCLEtBQW9DLENBQXpELEVBQTREO0FBQzFEQyxjQUFPLG9FQUFQO0FBQ0Q7QUFDRixLQU5EO0FBT0QsR0FWRDs7QUFZQVosV0FBU0MsYUFBVCxDQUF1QixPQUF2QixFQUFnQ0MsT0FBaEMsR0FBMEMsTUFBTTtBQUM5QyxxQkFBT1csR0FBUCxDQUFXQyxJQUFYO0FBQ0QsR0FGRDtBQUdELENBaEJEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IHJlbW90ZSB9IGZyb20gJ2VsZWN0cm9uJztcblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsaScpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgY21kID0gJ3JtIC91c3IvbG9jYWwvYmluL2Z1bGNydW0gJiYgbG4gLXMgL0FwcGxpY2F0aW9ucy9GdWxjcnVtLmFwcC9Db250ZW50cy9zY3JpcHRzL2Z1bGNydW0gL3Vzci9sb2NhbC9iaW4vZnVsY3J1bSc7XG5cbiAgICBleGVjKGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0ZpbmlzaGVkJywgZXJyb3IpO1xuXG4gICAgICBpZiAoZXJyb3IgPT0gbnVsbCAmJiBzdGRlcnIudG9TdHJpbmcoKS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsZXJ0KGBTdWNjZXNzZnVsbHkgaW5zdGFsbGVkICdmdWxjcnVtJyBjb21tYW5kIGF0IC91c3IvbG9jYWwvYmluL2Z1bGNydW1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucXVpdCcpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgcmVtb3RlLmFwcC5xdWl0KCk7XG4gIH07XG59O1xuIl19