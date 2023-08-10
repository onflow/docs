---
title: Start Emulator
description: How to start Flow emulator from the command line
sidebar_position: 1
---

The Flow CLI provides a command to start an emulator. 
The Flow Emulator is a lightweight tool that emulates the behaviour of the real Flow network.

```shell
flow emulator
```

⚠️ The emulator command expects configuration to be initialized. See [flow init](../flow.json/initialize-configuration.md) command.


## Example Usage

```shell
> flow emulator

INFO[0000] ⚙️   Using service account 0xf8d6e0586b0a20c7  serviceAddress=f8d6e0586b0a20c7 ...
...
```

To learn more about using the Emulator, have a look at the [README of the repository](https://github.com/onflow/flow-emulator).

## Flags

### Emulator Flags
You can specify any [emulator flags found here](https://github.com/onflow/flow-emulator#configuration) and they will be applied to the emulator service.

### Configuration

- Flag: `--config-path`
- Short Flag: `-f`
- Valid inputs: valid filename

Specify a filename for the configuration files, you can provide multiple configuration
files by using `-f` flag multiple times.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.