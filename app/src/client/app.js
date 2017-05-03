'use strict';

var _child_process = require('child_process');

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
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQvYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9ubG9hZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbWQiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsImNvbnNvbGUiLCJsb2ciLCJ0b1N0cmluZyIsInRyaW0iLCJsZW5ndGgiLCJhbGVydCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFFQUEsT0FBT0MsTUFBUCxHQUFnQixNQUFNO0FBQ3BCQyxXQUFTQyxhQUFULENBQXVCLE1BQXZCLEVBQStCQyxPQUEvQixHQUF5QyxNQUFNO0FBQzdDLFVBQU1DLE1BQU0sOEdBQVo7O0FBRUEsNkJBQUtBLEdBQUwsRUFBVSxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQ25DQyxjQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QkosS0FBeEI7O0FBRUEsVUFBSUEsU0FBUyxJQUFULElBQWlCRSxPQUFPRyxRQUFQLEdBQWtCQyxJQUFsQixHQUF5QkMsTUFBekIsS0FBb0MsQ0FBekQsRUFBNEQ7QUFDMURDLGNBQU8sb0VBQVA7QUFDRDtBQUNGLEtBTkQ7QUFPRCxHQVZEO0FBV0QsQ0FaRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGknKS5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGNtZCA9ICdybSAvdXNyL2xvY2FsL2Jpbi9mdWxjcnVtICYmIGxuIC1zIC9BcHBsaWNhdGlvbnMvRnVsY3J1bS5hcHAvQ29udGVudHMvc2NyaXB0cy9mdWxjcnVtIC91c3IvbG9jYWwvYmluL2Z1bGNydW0nO1xuXG4gICAgZXhlYyhjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdGaW5pc2hlZCcsIGVycm9yKTtcblxuICAgICAgaWYgKGVycm9yID09IG51bGwgJiYgc3RkZXJyLnRvU3RyaW5nKCkudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydChgU3VjY2Vzc2Z1bGx5IGluc3RhbGxlZCAnZnVsY3J1bScgY29tbWFuZCBhdCAvdXNyL2xvY2FsL2Jpbi9mdWxjcnVtYCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59O1xuIl19