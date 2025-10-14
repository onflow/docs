---
title: Flow Emulator
description: Local Flow network for development and testing
sidebar_position: 3
---

The Flow Emulator is a lightweight tool that emulates the behavior of the real Flow network for local development and testing.

## Installation

The emulator is included with the [Flow CLI](../flow-cli/index.md). Follow the [installation guide](../flow-cli/install.md) to get started.

## Quick Start

First, create a `flow.json` configuration file:

```bash
flow init --config-only
```

Then start the Flow Emulator:

```bash
flow emulator
```

You'll see output similar to:

```bash
INFO[0000] ⚙️   Using service account 0xf8d6e0586b0a20c7  serviceAddress=f8d6e0586b0a20c7 ...
INFO[0000] 🌱  Starting Flow Emulator
INFO[0000] 🛠  GRPC server started on 127.0.0.1:3569
INFO[0000] 📡  HTTP server started on 127.0.0.1:8080
```

This starts a local Flow network with:

- gRPC server on port `3569`
- REST API on `http://localhost:8888`
- Admin API on port `8080`

## Common Options

```bash
# Start with verbose logging
flow emulator --verbose

# Set custom block time (e.g., 1 second between blocks)
flow emulator --block-time 1s

# Persist state between restarts
flow emulator --persist

# Change the gRPC and REST API ports
flow emulator --port 9000 --rest-port 9001

# For a complete list of available flags, run:
flow emulator --help
```

For all available options, see the [CLI commands overview](../flow-cli/index.md).

## Debugging & Testing

- **Code Coverage**: Add `--coverage-reporting` flag and visit `http://localhost:8080/emulator/codeCoverage`
- **Debugging**: Use `#debugger()` pragma in Cadence code for breakpoints

## Snapshots

The Flow CLI provides a command to create emulator snapshots, which are points in blockchain history you can later jump to and reset the state to that moment. This can be useful for testing where you establish a beginning state, run tests and after revert back to the initial state.

### Create a new snapshot

Create a new emulator snapshot at the current block with a name of `myInitialState`.

```shell
flow emulator snapshot create myInitialState
```

### Load an existing snapshot

To jump to a previously created snapshot we use the load command in combination with the name.

```shell
flow emulator snapshot load myInitialState
```

### List all existing snapshots

To list all the existing snapshots we previously created and can load to run:

```shell
flow emulator list
```

To learn more about using the Emulator, have a look at the [README of the repository](https://github.com/onflow/flow-emulator).

## Additional Resources

For advanced configuration options, see the [Flow Emulator repository](https://github.com/onflow/flow-emulator/).
