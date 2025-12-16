---
title: Cadence VS Code Extension
sidebar_position: 4
---

This extension integrates [Cadence], the resource-oriented smart contract programming language of [Flow], into [Visual Studio Code].
It provides features like syntax highlighting, type checking, code completion, etc.

Note that most editing features (type checking, code completion, etc.) are implemented in the [Cadence Language Server].

## Features

- Syntax highlighting (including in Markdown code fences)
- Run the emulator, submit transactions, scripts from the editor

## Installation

To install the extension, ensure you have the [VS Code IDE installed].  
Then, you can install the Cadence extension from the [VS Code Marketplace].

## Develop the extension

### Prerequisites

- Must have Typescript installed globally: `npm i -g typescript`

### Get started

- Run the Typescript watcher: `tsc -watch -p ./`
- Press `F5` in VSCode to launch the extension.
- Manually reload the extension host when you make changes to TypeScript code.

### Configuration for extension host if missing (`launch.json`):

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "extensionHost",
      "request": "launch",
      "name": "Launch Extension",
      "runtimeExecutable": "${execPath}",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/out/**/*.js"]
    }
  ]
}

```

### Build

If you build the extension from source, you need to build both the extension itself and the Flow CLI (if you don't already have a version installed). Unless you're developing the extension or need access to unreleased features, use the Flow CLI install option (above). It's much easier!

If you haven't already, install dependencies.

```shell script
npm install
```

Next, build and package the extension.

```shell script
npm run package
```

This will result in a `.vsix` file that contains the packaged extension.

Install the packaged extension.

```shell script
code --install-extension cadence-*.vsix
```

Restart VS Code and the extension is installed!

<!-- Relative links, will not render on page -->

[Flow]: https://www.onflow.org/
[Visual Studio Code]: https://code.visualstudio.com/
[Cadence Language Server]: https://github.com/onflow/cadence-tools/tree/master/languageserver
[VS Code IDE installed]: https://code.visualstudio.com/docs/setup/mac  
[VS Code Marketplace]: https://marketplace.visualstudio.com/items?itemName=onflow.cadence