---
title: Start Emulator
description: How to start the Flow Emulator from the command line
sidebar_position: 1
---

The Flow Emulator is a lightweight development tool that mimics the behavior of the real Flow network. It is bundled with the [Flow CLI](../install.md), which makes starting and configuring the emulator straightforward.

## Starting the Emulator

To start the emulator with default settings, use the following command:

```bash
flow emulator
```

This will start the emulator with a default configuration.

### Example Output

When you run the `flow emulator` command, you will see output similar to the following:

```bash
INFO[0000] ⚙️   Using service account 0xf8d6e0586b0a20c7  serviceAddress=f8d6e0586b0a20c7 ...
INFO[0000] 🌱  Starting Flow Emulator
INFO[0000] 🛠  GRPC server started on 127.0.0.1:3569
INFO[0000] 📡  HTTP server started on 127.0.0.1:8080
```

### Initial Configuration

The emulator requires a configuration file (`flow.json`). If you don’t already have one, create it using the `flow init` command:

```bash
flow init
```

This initializes a default configuration file that the emulator will use.

## Customizing the Emulator

You can customize the emulator behavior by using flags. Below are some commonly used flags:

### Emulator Flags

**Port Configuration**: Change the gRPC and REST API ports:

```bash
flow emulator --port 9000 --rest-port 9001
```

**Persistence**: Enable persistence of state across restarts:

```bash
flow emulator --persist
```

**Verbose Logging**: Enable detailed logs for debugging:

```bash
flow emulator --verbose
```

For a complete list of available flags, run:

```bash
flow emulator --help
```

## Learn More

To explore advanced features like snapshots, rollbacks, and debugging, visit the [Flow Emulator README](https://github.com/onflow/flow-emulator).