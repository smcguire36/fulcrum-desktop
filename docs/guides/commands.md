# Commands

Fulcrum Desktop has several built-in commands to setup and sync the database with your Fulcrum account.  

Run the `fulcrum` command to list the various arguments and options available:

Linux: `/opt/Fulcrum/scripts/fulcrum`  
Mac: `fulcrum`  
Windows: To use the CLI, start cmd.exe, PowerShell, or [cmder](http://cmder.net/) and navigate to the scripts folder.
`cd C:\Users\your-username\AppData\Local\Programs\Fulcrum\scripts` and run `.\fulcrum.cmd`

### Authenticate and setup the database

#### Linux/macOS

`fulcrum setup`

#### Windows

Email and password parameters must be manually passed during `setup`:

```sh
.\fulcrum.cmd setup --email EMAIL --password SECRET
```

### Sync the given account

#### Linux/macOS

`fulcrum sync --org 'Organization Name'`

#### Windows

Windows seems to prefer double quotes with command parameters as seen here during `sync`:

```sh
.\fulcrum.cmd sync --org "Organization Name"
```
