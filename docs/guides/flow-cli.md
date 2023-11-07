---
title: Flow CLI
sidebar_label: Install Flow CLI
description: Guide to installing and using Flow CLI
sidebar_position: 2
---

## Installation

## macOS

### Homebrew

```sh
brew install flow-cli
```

### From a pre-built binary

_This installation method only works on x86-64._

This script downloads and installs the appropriate binary for your system:

```sh
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

To update, simply re-run the installation command above.

It is currently not possible to install earlier versions of the Flow CLI with Homebrew.
## Linux

### From a pre-built binary

_This installation method only works on x86-64._

This script downloads and installs the appropriate binary for your system:

```sh
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

To update, simply re-run the installation command above.

### Install a specific version

To install a specific version of Flow CLI newer than v0.42.0, append the version tag to the command (e.g. the command below installs CLI version v0.44.0).

```sh
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)" -- v0.44.0
```

To install a version older than v0.42.0, refer to [Installing versions before 0.42.0](../tools/flow-cli/install.md#installing-versions-before-0420) below.

## Windows

### From a pre-built binary

_This installation method only works on Windows 10, 8.1, or 7 (SP1, with [PowerShell 3.0](https://www.microsoft.com/en-ca/download/details.aspx?id=34595)), on x86-64._

1. Open PowerShell ([Instructions](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-windows-powershell?view=powershell-7#finding-powershell-in-windows-10-81-80-and-7))
2. In PowerShell, run:

    ```powershell
    iex "& { $(irm 'https://raw.githubusercontent.com/onflow/flow-cli/master/install.ps1') }"
    ```

To update, simply re-run the installation command above.


## Create your first project
With the Flow CLI super commands, initiating your new project becomes effortless. Execute the flow setup 
command and make a selection from a variety of accessible scaffolds:
```
> flow setup hello-world --scaffold

🔨 General Scaffolds
   [1] Empty Cadence Project - Empty project containing only basic folder structure and flow.json configuration.
   [2] Simple Cadence Project - Scaffold contains required folder structure as well as some example Cadence code.
   [3] Cadence NFT Project - Scaffold contains the ExampleNFT sample NFT contract.
   [4] Hybrid Custody Project - Starter for exploring & implementing Hybrid Custody.

💻 Web Scaffolds
   [5] FCL Web Dapp - Simple TypeScript web application using next.js, FCL, and Cadence.

📱 Mobile Scaffolds
   [6] Swift iOS simple example - iOS example demonstrating usage of FCL and Flow interactions.
   [7] Android simple example - Android example demonstrating usage of FCL and Flow interactions.
   [8] FCL React Native Mobile Dapp - React Native (Expo) mobile dapp example demonstrating FCL and Flow interactions.

🏀 Unity Scaffolds
   [9] Simple Unity - Simple example demonstrating how to interact with the Flow network using Unity SDK.
   [10] Mobile Unity Game - Example words game built on Flow using the Unity SDK.
```

After you have created your new project, you can proceed to writing contracts. Once your contracts have been written, run the `flow dev` command the CLI will deploy them to the Flow emulator. Flow emulator is 
a simplified version of Flow network that runs locally. It makes writing, deploying and testing contracts easier.

So proceed by starting the emulator: 

```
> flow emulator
```

And then the flow dev:
```
> flow dev
```

### Next steps

As part of the next steps you can read more about [flow dev command](../tools/flow-cli/super-commands.md).
