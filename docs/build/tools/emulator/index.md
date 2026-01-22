---
title: Flow Emulator
description: Local Flow network for development and testing
sidebar_position: 3
keywords:
  - Flow Emulator
  - local development
  - testing
  - flow emulator --fork
  - fork mode
  - emulator flags
  - mainnet fork
  - testnet fork
  - fork-height
  - fork-host
  - gRPC server
  - REST API
  - snapshots
  - persistent storage
  - block time
  - code coverage
  - debugging
  - service account
  - Flow CLI
  - local blockchain
  - E2E testing
  - off-chain mocking
  - precreate accounts
  - num-accounts
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

## Available commands

- `snapshot`: Create/Load/List emulator snapshots. See: [Create Emulator Snapshot]

## Key flags

- **Networking**
  - `--host <string>`: Host to listen on for gRPC, REST, and Admin (default: all interfaces)
  - `--port, -p <int>`: gRPC port (default `3569`)
  - `--rest-port <int>`: REST API port (default `8888`)
  - `--admin-port <int>`: Admin API port (default `8080`)
  - `--debugger-port <int>`: Debug Adapter Protocol port (default `2345`)
  - `--grpc-debug`: Turn on gRPC server reflection
  - `--rest-debug`: Turn on REST API debug output

- **State and Persistence**
  - `--persist`: Turn on persistent storage (default disabled)
  - `--dbpath <path>`: Directory for on-disk state (default `./flowdb`)
  - `--sqlite-url <url>`: Use SQLite storage backend
  - `--redis-url <url>`: Use Redis storage backend
  - `--checkpoint-dir <path>`: Load state from checkpoint directory
  - `--state-hash <string>`: Load state from checkpoint state hash

- **Forking**
  - `--fork <string>`: Start the emulator in fork mode using a network from `flow.json`. If provided without a value, defaults to `mainnet`.
  - `--fork-host <host>`: Access node to query when you fork Mainnet or Testnet
  - `--fork-height <uint>`: Starting block height when you fork

- **Cadence and VM**
  - `--block-time, -b <duration>`: Time between sealed blocks (for exxample, `1s`, `300ms`)
  - `--coverage-reporting`: Turn on code coverage reporting
  - `--computation-reporting`: Turn on computation reporting
  - `--legacy-upgrade`: Turn on legacy contract upgrade behavior
  - `--scheduled-transactions`: Turn on scheduled transactions (default true)
  - `--script-compute-limit <int>`: Compute unit limit for scripts (default `100000`)
  - `--transaction-max-compute-limit <int>`: Max transaction compute unit limit (default `9999`)
  - `--transaction-expiry <int>`: Transaction expiry in blocks (default `10`)
  - `--skip-tx-validation`: Skip tx signature and sequence number checks
  - `--simple-addresses`: Use sequential addresses starting with `0x01`
  - `--storage-limit`: Enforce account storage limit (default true)
  - `--storage-per-flow <decimal>`: MB of storage per 1 FLOW token
  - `--token-supply <decimal>`: Initial FLOW token supply (default `1000000000.0`)
  - `--transaction-fees`: Turn on transaction fees
  - `--setup-evm`: Deploy EVM contracts (default true)
  - `--setup-vm-bridge`: Deploy VM Bridge contracts (default true)

- **Service Account and Identity**
  - `--chain-id <emulator|testnet|mainnet>`: Address generation chain (default `emulator`)
  - `--service-priv-key <hex>` / `--service-pub-key <hex>`: Service account keys
  - `--service-sig-algo <ECDSA_P256|ECDSA_secp256k1>`: Service key signature algo (default `ECDSA_P256`)
  - `--service-hash-algo <SHA3_256|SHA2_256>`: Service key hash algo (default `SHA3_256`)
  - `--min-account-balance <decimal>`: Minimum account balance or account creation cost
  - `--num-accounts <int>`: Number of accounts to precreate and fund at startup (default `0`)
  - `--contracts`: Deploy common contracts on start
  - `--contract-removal`: Allow contract removal for development (default true)
  - `--init`: Initialize a new account profile

- **Logging and Output**
  - `--verbose, -v`: Verbose logging
  - `--log-format <text|JSON>`: Logging output format (default `text`)

- **Snapshots**
  - `--snapshot`: Enable snapshots in the emulator

## Precreated Accounts

The Flow Emulator supports precreating and funding multiple accounts automatically when the emulator starts up. This feature streamlines development workflows by eliminating the need to manually create test accounts for each emulator session.

### Usage

Use the `--num-accounts` flag to specify the number of accounts to precreate:

```bash
flow emulator --num-accounts 5
```

Or via environment variable:

```bash
FLOW_NUMACCOUNTS=5 flow emulator
```

### Account Details

**Funding**: Each precreated account is automatically funded with **1000.0 FLOW tokens**. The funding amount is currently fixed and not configurable.

**Keys**: All precreated accounts use the **same public key as the service account**. This simplifies development by allowing you to use the same private key across all accounts. The service account private key (displayed at startup) can be used to sign transactions for any precreated account.

**Account Addresses**: Accounts are created sequentially at emulator startup. Account addresses and the shared private key are displayed in the console when the emulator starts.

### Example Output

When starting the emulator with `--num-accounts 3`:

```
Available Accounts
==================
(0) 0x01cf0e2f2f715450 (1000.0 FLOW)
(1) 0x179b6b1cb6755e31 (1000.0 FLOW)
(2) 0xf3fcd2c1a78f5eee (1000.0 FLOW)

Private Keys
==================
(0) 0x<SERVICE_PRIVATE_KEY>
(1) 0x<SERVICE_PRIVATE_KEY>
(2) 0x<SERVICE_PRIVATE_KEY>
```

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

# Precreate 5 accounts for testing
flow emulator --num-accounts 5

# Precreate accounts with persistence enabled
flow emulator --num-accounts 3 --persist

# For a complete list of available flags, run:
flow emulator --help
```

For the complete and current list of flags, run:

```bash
flow emulator --help
```

## Debugging and Testing

- **Code Coverage**: Add `--coverage-reporting` flag and visit `http://localhost:8080/emulator/codeCoverage`
- **Computation Profiling**: Add `--computation-profiling` and/or `--computation-reporting` flags to analyze computational costs and identify performance bottlenecks in your Cadence code. See the [Cadence Computation Profiling guide] for detailed instructions.
- **Debugging**: Use `#debugger()` pragma in Cadence code for breakpoints
- **Fork mode note**: When you use `flow emulator --fork`, only Flow chain state is available. External oracles/APIs and cross-chain reads are not live; mock these or run local stub services for E2E.

### Fork Mode Tutorial

For a complete guide on using the emulator in fork mode with dapps, E2E tests, and account impersonation, see: [Interactive Testing with Forked Emulator].

## Snapshots

The Flow CLI provides a command to create emulator snapshots, which are points in blockchain history you can later jump to and reset the state to that moment. This can be useful to test where you establish a beginning state, run tests and after revert back to the initial state.

### Quick snapshot workflow

```bash
# 1) Start the emulator with snapshots enabled (in a separate terminal)
flow emulator --snapshot

# 2) Create a snapshot at the current state
flow emulator snapshot create baseline

# 3) Make changes, run tests, etc.

# 4) Reset the emulator back to the snapshot
flow emulator snapshot load baseline
```

### Create a new snapshot

Create a new emulator snapshot at the current block with a name of `myInitialState`.

```shell
flow emulator snapshot create myInitialState
```

### Load a current snapshot

To jump to a previously created snapshot we use the load command in combination with the name.

```shell
flow emulator snapshot load myInitialState
```

### List all snapshots

To list all the snapshots we previously created and can load to run:

```shell
flow emulator list
```

## Additional resources

To learn more about how to use the Emulator, have a look at the [public GitHub repository].

<!-- Reference-style links -->

[Flow CLI]: ../flow-cli/index.md
[installation guide]: ../flow-cli/install.md
[Create Emulator Snapshot]: ../flow-cli/utils/snapshot-save.md
[public GitHub repository]: https://github.com/onflow/flow-emulator
[Interactive Testing with Forked Emulator]: ../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md
[Cadence Computation Profiling guide]: ../../cadence/advanced-concepts/computation-profiling.md
