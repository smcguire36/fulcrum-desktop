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

Ubuntu x64:

```sh
curl -o- -L https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/install.sh | sudo bash
```
