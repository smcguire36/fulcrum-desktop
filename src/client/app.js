import { exec } from 'child_process';

window.onload = () => {
  document.querySelector('.cli').onclick = () => {
    const cmd = 'rm /usr/local/bin/fulcrum && ln -s /Applications/Fulcrum.app/Contents/scripts/fulcrum /usr/local/bin/fulcrum';

    exec(cmd, (error, stdout, stderr) => {
      console.log('Finished', error);

      if (error == null && stderr.toString().trim().length === 0) {
        alert(`Successfully installed 'fulcrum' command at /usr/local/bin/fulcrum`);
      }
    });
  };
};
