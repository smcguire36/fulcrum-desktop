# Installation

Fulcrum Desktop has installers for Windows (32bit and 64bit), macOS and Linux.
Installers are available from the [releases](https://github.com/fulcrumapp/fulcrum-desktop/releases) page.

#### macOS

Open the .dmg, drag the icon to `Applications`. That's it!

#### Windows

Install from the setup .exe and follow the instructions.

To use the CLI, start cmd.exe or PowerShell:

```sh
cd AppData\Local\Programs\Fulcrum\scripts
fulcrum.cmd setup --email EMAIL --password SECRET
fulcrum.cmd sync --org 'Organization Name'
```

#### Linux

Ubuntu:

```sh
wget https://github.com/fulcrumapp/fulcrum-desktop/releases/download/v0.0.22/fulcrum-desktop_0.0.22_amd64.deb -O fulcrum-desktop.deb
sudo apt-get update
sudo dpkg -i fulcrum-desktop.deb # it will complain about missing dependencies, the next command will fix it up
sudo apt-get install -f
```
