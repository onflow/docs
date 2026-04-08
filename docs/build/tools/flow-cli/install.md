---
title: Install Instructions
description: How to install the Flow command-line interface (CLI)
sidebar_position: 1
---

You can install the Flow CLI on macOS, Windows (7 or greater) and most Linux systems.

## macOS

### Homebrew

```sh
brew install flow-cli
```

### From a pre-built binary

_This installation method only works on x86-64._

This script downloads and installs the appropriate binary for your system:

```sh
sudo sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

To update, simply re-run the installation command above.

It is currently not possible to install earlier versions of the Flow CLI with Homebrew.

## Linux

### From a pre-built binary

_This installation method only works on x86-64._

This script downloads and installs the appropriate binary for your system:

```sh
sudo sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

To update, simply re-run the installation command above.

### Install a specific version

To install a specific version of Flow CLI, the version tag can be appended to the installation command. For example, to install version v2.0.0:

```sh
sudo sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)" -- v2.0.0
```

## Windows

### From a pre-built binary

_This installation method only works on Windows 10, 8.1, or 7 (SP1, with [PowerShell 3.0]), on x86-64._

1. Open PowerShell ([Instructions])
2. In PowerShell, run:

   ```powershell
   iex "& { $(irm 'https://raw.githubusercontent.com/onflow/flow-cli/master/install.ps1') }"
   ```

To update, simply re-run the installation command above.

# Upgrade the Flow CLI

## macOS

### Homebrew

```sh
brew upgrade flow-cli
```

### From a pre-built binary

_This update method only works on x86-64._

This script downloads and updates the appropriate binary for your system:

```sh
sudo sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

## Linux

### From a pre-built binary

_This update method only works on x86-64._

This script downloads and updates the appropriate binary for your system:

```sh
sudo sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

## Windows

### From a pre-built binary

_This update method only works on Windows 10, 8.1, or 7 (SP1, with [PowerShell 3.0]), on x86-64._

1. Open PowerShell ([Instructions])
2. In PowerShell, run:

   ```powershell
   iex "& { $(irm 'https://raw.githubusercontent.com/onflow/flow-cli/master/install.ps1') }"
   ```

## Uninstall Flow CLI

To remove the flow CLI, you can run the following command if it was previously installed from a pre-built binary.

- macOS: `rm /usr/local/bin/flow`
- Linux: `rm ~/.local/bin/flow`
- Windows: `rm ~/Users/{user}/AppData/Flow/flow.exe`

If you installed it with Hombrew, you can remove it with: `brew uninstall flow-cli`.

## Next steps

Now that you have the Flow CLI installed, you can:

- **[Get started with Flow CLI commands]** - Learn the essential commands for project development.
- **[Initialize a new project]** - Create your first Flow project.
- **[Configure your project]** - Set up your `flow.json` configuration file.

<!-- Reference-style links, will not render on page. -->

[PowerShell 3.0]: https://www.microsoft.com/en-ca/download/details.aspx?id=34595
[Instructions]: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-windows-powershell?view=powershell-7#finding-powershell-in-windows-10-81-80-and-7
[Get started with Flow CLI commands]: ./commands.md
[Initialize a new project]: ./flow.json/initialize-configuration.md
[Configure your project]: ./flow.json/configuration.md
