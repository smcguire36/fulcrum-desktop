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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9ubG9hZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbWQiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsImNvbnNvbGUiLCJsb2ciLCJ0b1N0cmluZyIsInRyaW0iLCJsZW5ndGgiLCJhbGVydCIsImFwcCIsInF1aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0FBRUFBLE9BQU9DLE1BQVAsR0FBZ0IsTUFBTTtBQUNwQkMsV0FBU0MsYUFBVCxDQUF1QixNQUF2QixFQUErQkMsT0FBL0IsR0FBeUMsTUFBTTtBQUM3QyxVQUFNQyxNQUFNLDhHQUFaOztBQUVBLDZCQUFLQSxHQUFMLEVBQVUsQ0FBQ0MsS0FBRCxFQUFRQyxNQUFSLEVBQWdCQyxNQUFoQixLQUEyQjtBQUNuQ0MsY0FBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JKLEtBQXhCOztBQUVBLFVBQUlBLFNBQVMsSUFBVCxJQUFpQkUsT0FBT0csUUFBUCxHQUFrQkMsSUFBbEIsR0FBeUJDLE1BQXpCLEtBQW9DLENBQXpELEVBQTREO0FBQzFEQyxjQUFPLG9FQUFQO0FBQ0Q7QUFDRixLQU5EO0FBT0QsR0FWRDs7QUFZQVosV0FBU0MsYUFBVCxDQUF1QixPQUF2QixFQUFnQ0MsT0FBaEMsR0FBMEMsTUFBTTtBQUM5QyxxQkFBT1csR0FBUCxDQUFXQyxJQUFYO0FBQ0QsR0FGRDtBQUdELENBaEJEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuaW1wb3J0IHsgcmVtb3RlIH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xpJykub25jbGljayA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNtZCA9ICdybSAvdXNyL2xvY2FsL2Jpbi9mdWxjcnVtICYmIGxuIC1zIC9BcHBsaWNhdGlvbnMvRnVsY3J1bS5hcHAvQ29udGVudHMvc2NyaXB0cy9mdWxjcnVtIC91c3IvbG9jYWwvYmluL2Z1bGNydW0nO1xyXG5cclxuICAgIGV4ZWMoY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdGaW5pc2hlZCcsIGVycm9yKTtcclxuXHJcbiAgICAgIGlmIChlcnJvciA9PSBudWxsICYmIHN0ZGVyci50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBhbGVydChgU3VjY2Vzc2Z1bGx5IGluc3RhbGxlZCAnZnVsY3J1bScgY29tbWFuZCBhdCAvdXNyL2xvY2FsL2Jpbi9mdWxjcnVtYCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl0Jykub25jbGljayA9ICgpID0+IHtcclxuICAgIHJlbW90ZS5hcHAucXVpdCgpO1xyXG4gIH07XHJcbn07XHJcbiJdfQ==