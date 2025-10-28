---
title: Flow Emulator
description: Local Flow network for development and testing
sidebar_position: 3
---

The Flow Emulator is a lightweight tool that emulates the behavior of the real Flow network for local development and testing.

## Installation

The emulator is included with the [Flow CLI]. Follow the [installation guide] to get started.

## Quick Start

First, create a `flow.json` configuration file:

```bash
flow init --config-only
```

Then start the Flow Emulator in fork mode (defaults to mainnet when value omitted):

```bash
flow emulator --fork
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

## Available Commands

- `snapshot`: Create/Load/List emulator snapshots. See: [Create Emulator Snapshot]

## Key Flags

- **Networking**
  - `--host <string>`: Host to listen on for gRPC/REST/Admin (default: all interfaces)
  - `--port, -p <int>`: gRPC port (default `3569`)
  - `--rest-port <int>`: REST API port (default `8888`)
  - `--admin-port <int>`: Admin API port (default `8080`)
  - `--debugger-port <int>`: Debug Adapter Protocol port (default `2345`)
  - `--grpc-debug`: Enable gRPC server reflection
  - `--rest-debug`: Enable REST API debug output

- **State & Persistence**
  - `--persist`: Enable persistent storage (default disabled)
  - `--dbpath <path>`: Directory for on-disk state (default `./flowdb`)
  - `--sqlite-url <url>`: Use SQLite storage backend
  - `--redis-url <url>`: Use Redis storage backend
  - `--checkpoint-dir <path>`: Load state from checkpoint directory
  - `--state-hash <string>`: Load state from checkpoint state hash

- **Forking**
  - `--fork <string>`: Start the emulator in fork mode using a network from `flow.json`. If provided without a value, defaults to `mainnet`.
  - `--fork-host <host>`: Access node to query when forking Mainnet/Testnet
  - `--fork-height <uint>`: Starting block height when forking

- **Cadence & VM**
  - `--block-time, -b <duration>`: Time between sealed blocks (e.g. `1s`, `300ms`)
  - `--coverage-reporting`: Enable code coverage reporting
  - `--computation-reporting`: Enable computation reporting
  - `--legacy-upgrade`: Enable legacy contract upgrade behavior
  - `--scheduled-transactions`: Enable scheduled transactions (default true)
  - `--script-gas-limit <int>`: Gas limit for scripts (default `100000`)
  - `--transaction-max-gas-limit <int>`: Max transaction gas limit (default `9999`)
  - `--transaction-expiry <int>`: Transaction expiry in blocks (default `10`)
  - `--skip-tx-validation`: Skip tx signature and sequence number checks
  - `--simple-addresses`: Use sequential addresses starting with `0x01`
  - `--storage-limit`: Enforce account storage limit (default true)
  - `--storage-per-flow <decimal>`: MB of storage per 1 FLOW token
  - `--token-supply <decimal>`: Initial FLOW token supply (default `1000000000.0`)
  - `--transaction-fees`: Enable transaction fees
  - `--setup-evm`: Deploy EVM contracts (default true)
  - `--setup-vm-bridge`: Deploy VM Bridge contracts (default true)

- **Service Account & Identity**
  - `--chain-id <emulator|testnet|mainnet>`: Address generation chain (default `emulator`)
  - `--service-priv-key <hex>` / `--service-pub-key <hex>`: Service account keys
  - `--service-sig-algo <ECDSA_P256|ECDSA_secp256k1>`: Service key signature algo (default `ECDSA_P256`)
  - `--service-hash-algo <SHA3_256|SHA2_256>`: Service key hash algo (default `SHA3_256`)
  - `--min-account-balance <decimal>`: Minimum account balance / account creation cost
  - `--contracts`: Deploy common contracts on start
  - `--contract-removal`: Allow contract removal for development (default true)
  - `--init`: Initialize a new account profile

- **Logging & Output**
  - `--verbose, -v`: Verbose logging
  - `--log-format <text|JSON>`: Logging output format (default `text`)

- **Snapshots**
  - `--snapshot`: Enable snapshots in the emulator

## Examples

```bash
# Verbose logs
flow emulator --verbose

# Custom ports
flow emulator --port 9000 --rest-port 9001 --admin-port 9002

# Custom block time (1 second between blocks)
flow emulator --block-time 1s

# Persist state on disk
flow emulator --persist --dbpath ./flowdb

# Fork from Mainnet using flow.json
flow emulator --fork

# Fork from Testnet using flow.json and pin to a height
flow emulator --fork testnet --fork-height 12345678

# Fork from Testnet at a specific height
flow emulator --fork-host access.devnet.nodes.onflow.org:9000 --fork-height 12345678

# Disable fees and use simple addresses for local testing
flow emulator --transaction-fees=false --simple-addresses

# Enable code coverage reporting
flow emulator --coverage-reporting

# Change the gRPC and REST API ports
flow emulator --port 9000 --rest-port 9001

# For a complete list of available flags, run:
flow emulator --help
```

For the complete and current list of flags, run:

```bash
flow emulator --help
```

## Debugging & Testing

- **Code Coverage**: Add `--coverage-reporting` flag and visit `http://localhost:8080/emulator/codeCoverage`
- **Debugging**: Use `#debugger()` pragma in Cadence code for breakpoints
- **Fork mode note**: When using `flow emulator --fork`, only Flow chain state is available. External oracles/APIs and cross-chain reads are not live; mock these or run local stub services for E2E.

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

## Additional Resources

To learn more about using the Emulator, please have a look at the [public GitHub repository].


<!-- Reference-style links -->
[Flow CLI]: ../flow-cli/index.md
[installation guide]: ../flow-cli/install.md
[Create Emulator Snapshot]: ../flow-cli/utils/snapshot-save.md
[public GitHub repository]: https://github.com/onflow/flow-emulator