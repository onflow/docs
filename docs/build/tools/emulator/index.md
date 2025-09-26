---
title: Flow Emulator
description: Local Flow network for development and testing
sidebar_position: 3
---

The Flow Emulator is a lightweight tool that emulates the behavior of the real Flow network for local development and testing.

## Quick Start

Start the Flow Emulator with the CLI:

```bash
flow emulator
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
```

## Development Tools

- **Code Coverage**: Add `--coverage-reporting` flag and visit `http://localhost:8080/emulator/codeCoverage`
- **Debugging**: Use `#debugger()` pragma in Cadence code for breakpoints

## Installation

The emulator is included with the [Flow CLI](../flow-cli/index.md). Follow the [installation guide](../flow-cli/install.md) to get started.

## Additional Resources

For advanced configuration options, see the [Flow Emulator repository](https://github.com/onflow/flow-emulator/).
