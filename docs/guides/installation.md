# Installation

Fulcrum Desktop has installers for Linux, macOS, and Windows (32-bit and 64-bit).
Installers are available from the [releases](https://github.com/fulcrumapp/fulcrum-desktop/releases) page.

#### Linux

Ubuntu x64:

```sh
curl -o- -L https://raw.githubusercontent.com/fulcrumapp/fulcrum-desktop/master/install.sh | sudo bash
```

#### macOS

Open the .dmg, drag the icon to `Applications`. That's it!

#### Windows

Install from the Setup .exe and follow the instructions. This will create a shortcut icon on your desktop (and open up a GUI window - _which is not currently functional_ - you can close this window). Double-clicking the shortcut icon will open the GUI again; doing this also triggers the auto-updater, if there is an updated release available it will be downloaded and installed.

To use the CLI, start cmd.exe, PowerShell, or [cmder](http://cmder.net/) and navigate to scripts folder:

```sh
cd C:\Users\your-username\AppData\Local\Programs\Fulcrum\scripts
```

Run the `fulcrum` command to list the various arguments and options available:

```sh
.\fulcrum.cmd
```

Email and password parameters must be manually passed during `setup`:

```sh
.\fulcrum.cmd setup --email EMAIL --password SECRET
```

Windows seems to prefer double quotes with command parameters as seen here during `sync`:

```sh
.\fulcrum.cmd sync --org "Organization Name"
```
