# Installation

Fulcrum Desktop has installers for Windows (32bit and 64bit), macOS and Linux.
Installers are available from the [releases](https://github.com/fulcrumapp/fulcrum-desktop/releases) page.

#### macOS

Install the .dmg, drag to `Applications`. That's it!

#### Windows

Install from the setup .exe and follow the instructions.

#### Linux

Ubuntu:

```sh
wget https://github.com/fulcrumapp/fulcrum-desktop/releases/download/v0.0.22/fulcrum-desktop_0.0.22_amd64.deb -O fulcrum-desktop.deb
sudo apt-get update
sudo dpkg -i fulcrum-desktop.deb # it will complain about missing dependencies, the next command will fix it up
sudo apt-get install -f
```
