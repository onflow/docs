---
title: Profile a Transaction
description: How to profile the computational performance of a Flow transaction
sidebar_position: 9
keywords:
  - flow cli
  - transactions
  - profiling
  - performance
  - optimization
  - computation
  - pprof
  - gas optimization
  - cadence profiling
---

The Flow CLI provides a command to profile the computational performance of sealed transactions on any Flow network. This diagnostic tool generates detailed CPU profiles in the industry-standard `pprof` format, allowing you to analyze exactly where computation is being spent during transaction execution.

The command works by forking the blockchain state and replaying the transaction in an isolated environment, ensuring accurate profiling results that match the original execution.

```shell
flow transactions profile <tx_id> --network <network_name> [flags]
```

## Use Cases

Transaction profiling helps developers:

- **Optimize Transaction Costs**: Identify computational bottlenecks and optimize gas-heavy operations
- **Debug High Gas Usage**: Understand why a transaction consumed more computation than expected
- **Analyze Production Transactions**: Profile real transactions on mainnet or testnet to understand actual performance
- **Compare Implementations**: Evaluate different approaches by comparing their computational profiles
- **Find Performance Issues**: Trace computation usage through contract calls and dependencies

## Example Usage

Profile a mainnet transaction:

```shell
> flow transactions profile 07a8...b433 --network mainnet

Transaction Profiling Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transaction ID:  07a8...b433
Network:         mainnet
Block Height:    12345678
Status:          SEALED
Events emitted:  5
Computation:     1234

Profile saved: profile-07a8b433.pb.gz

Analyze with:
  go tool pprof -http=:8080 profile-07a8b433.pb.gz
```

Profile with custom output location:

```shell
> flow transactions profile 0xabc123 --network testnet --output my-profile.pb.gz

Profile saved: my-profile.pb.gz
```

Profile an emulator transaction:

```shell
> flow transactions profile 0xdef456 --network emulator
```

## Analyzing Profile Data

The generated `.pb.gz` file can be analyzed using Go's pprof tools. If you don't have Go installed, see the [Go installation guide](https://go.dev/doc/install).

### Interactive Web Interface

Open the profile in an interactive web interface:

```bash
go tool pprof -http=:8080 profile-07a8b433.pb.gz
```

Then navigate to `http://localhost:8080` in your browser.

The pprof web interface provides several visualization options:

| View | Description |
|------|-------------|
| **Flame Graph** | Visual representation of call stacks with computation costs |
| **Graph** | Directed graph showing call relationships |
| **Top** | List of functions sorted by computation usage |
| **Source** | Source code annotated with computation costs |

### Command-Line Analysis

View top computation consumers:

```bash
go tool pprof -top profile-07a8b433.pb.gz
```

List all functions with costs:

```bash
go tool pprof -list=. profile-07a8b433.pb.gz
```

Generate a flame graph image:

```bash
go tool pprof -png profile-07a8b433.pb.gz > profile.png
```

For comprehensive information on analyzing computation profiles, see the [Cadence Computation Profiling guide](../../../cadence/advanced-concepts/computation-profiling.md).

## How It Works

The profiling process:

1. **Fetches the Transaction**: Retrieves the target sealed transaction by ID from the specified network
2. **Forks Blockchain State**: Creates a fork of the blockchain state from the block immediately before the transaction's block (uses the same forking mechanism as [Fork Testing](../fork-testing.md))
3. **Replays Execution**: Replays all prior transactions in the same block to recreate the exact state
4. **Profiles Target Transaction**: Executes the target transaction with Cadence runtime profiling enabled
5. **Exports Profile**: Saves the profiling data to a pprof-compatible file

This ensures the profile accurately reflects the transaction's execution in its original context.

:::info
The transaction profiling command uses Flow's state forking capabilities under the hood to create an accurate execution environment. Learn more about state forking in the [Fork Testing guide](../fork-testing.md).
:::

## Arguments

### Transaction ID

- Name: `<tx_id>`
- Valid Input: transaction ID (with or without `0x` prefix)

The transaction ID to profile. The transaction must be sealed.

## Flags

### Network

- Flag: `--network`
- Short Flag: `-n`
- Valid inputs: the name of a network defined in `flow.json`
- **Required**

Specify which network the transaction was executed on (e.g., `mainnet`, `testnet`, `emulator`).

### Output

- Flag: `--output`
- Short Flag: `-o`
- Valid inputs: valid file path
- Default: `profile-{tx_id_prefix}.pb.gz`

Custom output file path for the profile data. The file will be saved in compressed pprof format (`.pb.gz`).

### Host

- Flag: `--host`
- Valid inputs: an IP address or hostname
- Default: `127.0.0.1:3569` (Flow Emulator)

Specify the hostname of the Access API that will be used to fetch transaction data. This flag overrides any host defined by the `--network` flag.

### Network Key

- Flag: `--network-key`
- Valid inputs: A valid network public key of the host in hex string format

Specify the network public key of the Access API that will be used to create a secure GRPC client when executing the command.

### Filter

- Flag: `--filter`
- Short Flag: `-x`
- Valid inputs: a case-sensitive name of the result property

Specify any property name from the result you want to return as the only value.

### Output Format

- Flag: `--output`
- Short Flag: `-o`
- Valid inputs: `json`, `inline`

Specify the format of the command results displayed in the console.

### Save

- Flag: `--save`
- Short Flag: `-s`
- Valid inputs: a path in the current filesystem

Specify the filename where you want the result summary to be saved.

### Log

- Flag: `--log`
- Short Flag: `-l`
- Valid inputs: `none`, `error`, `debug`
- Default: `info`

Specify the log level. Control how much output you want to see during command execution.

### Configuration

- Flag: `--config-path`
- Short Flag: `-f`
- Valid inputs: a path in the current filesystem
- Default: `flow.json`

Specify the path to the `flow.json` configuration file.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.

## Requirements

### Transaction Must Be Sealed

Only sealed transactions can be profiled. Attempting to profile a pending or finalized transaction will result in an error.

```shell
Error: transaction is not sealed (status: PENDING)
```

Wait for the transaction to be sealed before profiling, or use a different transaction.

### Network Configuration

The network must be properly configured in your `flow.json` file:

```json
{
  "networks": {
    "mainnet": "access.mainnet.nodes.onflow.org:9000",
    "testnet": "access.devnet.nodes.onflow.org:9000"
  }
}
```

### Go Toolchain (for analysis)

To analyze the generated profile files, you need Go installed on your system. The `pprof` tool is included in the standard Go distribution.

Install Go from: https://go.dev/doc/install

## Related Documentation

- **[Cadence Computation Profiling](../../../cadence/advanced-concepts/computation-profiling.md)** - Comprehensive guide on profiling and optimization
- **[Fork Testing Guide](../fork-testing.md)** - Learn more about the state forking capabilities used by this command
- **[Testing Strategy](../../../cadence/smart-contracts/testing-strategy.md)** - How profiling fits into your overall testing and optimization workflow
- **[Transaction Fees](../../../cadence/basics/fees.md)** - Understanding computation costs and fee optimization
