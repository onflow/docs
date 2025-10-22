---
title: Scheduled Transactions
description: Manage scheduled transactions on Flow with the CLI
sidebar_position: 14
---

The Flow CLI provides commands to manage scheduled transactions. These commands allow you to set up a Manager resource, list scheduled transactions, get transaction details, and cancel transactions.

## What are Scheduled Transactions?

Scheduled transactions enable smart contracts to schedule autonomous execution in the future without external triggers. This allows for use cases like recurring payments, automated arbitrage, and time-based contract logic.

The scheduled transactions system uses priorities (High, Medium, Low) with different execution guarantees and fee multipliers to ensure predictable performance while enabling novel autonomous blockchain patterns.

📖 **[Learn more about scheduled transactions](../../../blockchain-development-tutorials/forte/scheduled-transactions/scheduled-transactions-introduction.md)**

## Prerequisites

Before using the scheduled transactions commands, you must initialize a Manager resource in your account storage. The Manager resource is provided by the **FlowTransactionSchedulerUtils** core contract and provides a convenient way to group, schedule, cancel, and query scheduled transactions through a single resource.

## Why Use the Manager?

While it's possible to schedule transactions directly, **using the Manager resource is essential for proper tooling integration**. The Manager provides a standardized interface that allows CLI commands, block explorers, and other developer tools to discover and interact with your scheduled transactions.

**Key benefits of using the Manager:**
- **Tooling Integration**: CLI commands and other tools can automatically discover and manage your scheduled transactions
- **Centralized Management**: All your scheduled transactions are organized in one place for easy tracking
- **Enhanced Querying**: Query transactions by handler type, timestamp, or status through standardized interfaces
- **Metadata Access**: Tools can resolve handler views and metadata to provide richer information about your scheduled transactions

Without the Manager, your scheduled transactions exist but cannot be easily discovered or managed through tooling, requiring manual tracking and interaction.

## Commands

### Setup Manager Resource

Initialize a Manager resource in your account storage to start managing scheduled transactions.

```shell
flow schedule setup
```

This command creates and stores a Manager resource at the standard storage path, allowing you to manage scheduled transactions for your account.

#### Example Usage

```shell
flow schedule setup --network testnet --signer my-account
```

#### Flags

- `--signer` - The account that will own the Manager resource
- `--network` / `-n` - Network to execute on (emulator, testnet, mainnet)
- `--host` - Access API hostname
- `--config-path` / `-f` - Path to flow.json configuration file

---

### List Scheduled Transactions

List all scheduled transactions for a given account that has a Manager resource.

```shell
flow schedule list <account>
```

#### Arguments

**Account**
- Name: `account`
- Valid inputs: Flow account address (with or without `0x` prefix) or account name from flow.json

The account address or name that has scheduled transactions to list.

#### Example Usage

```shell
flow schedule list 0x01cf0e2f2f715450 --network testnet
```

#### Flags

- `--network` / `-n` - Network to query (emulator, testnet, mainnet)
- `--host` - Access API hostname
- `--output` / `-o` - Output format (`json`, `inline`)
- `--filter` / `-x` - Filter output by property name
- `--save` / `-s` - Save output to file
- `--config-path` / `-f` - Path to flow.json configuration file

---

### Get Transaction Details

Get detailed information about a specific scheduled transaction by its ID.

```shell
flow schedule get <transaction-id>
```

#### Arguments

**Transaction ID**
- Name: `transaction-id`
- Valid inputs: Unsigned integer (UInt64)

The unique identifier of the scheduled transaction to retrieve.

#### Example Usage

```shell
flow schedule get 123 --network testnet
```

#### Flags

- `--network` / `-n` - Network to query (emulator, testnet, mainnet)
- `--host` - Access API hostname
- `--output` / `-o` - Output format (`json`, `inline`)
- `--filter` / `-x` - Filter output by property name
- `--save` / `-s` - Save output to file
- `--config-path` / `-f` - Path to flow.json configuration file

---

### Cancel Scheduled Transaction

Cancel a scheduled transaction and receive a partial fee refund.

```shell
flow schedule cancel <transaction-id>
```

When you cancel a scheduled transaction, a portion of the fees paid will be refunded based on the configured refund multiplier. The transaction must be in a scheduled state (not already executed or canceled).

#### Arguments

**Transaction ID**
- Name: `transaction-id`
- Valid inputs: Unsigned integer (UInt64)

The unique identifier of the scheduled transaction to cancel.

#### Example Usage

```shell
flow schedule cancel 123 --network testnet --signer my-account
```

#### Flags

- `--signer` - Account that owns the Manager resource containing the transaction
- `--network` / `-n` - Network to execute on (emulator, testnet, mainnet)
- `--host` - Access API hostname
- `--output` / `-o` - Output format (`json`, `inline`)
- `--config-path` / `-f` - Path to flow.json configuration file

---

## Common Flags

These flags are available across all scheduled transactions commands:

### Network

- Flag: `--network`
- Short Flag: `-n`
- Valid inputs: the name of a network defined in the configuration (`flow.json`)
- Default: `emulator`

Specify which network you want the command to use for execution.

### Host

- Flag: `--host`
- Valid inputs: an IP address or hostname
- Default: `127.0.0.1:3569` (Flow Emulator)

Specify the hostname of the Access API that will be used to execute the commands. This flag overrides any host defined by the `--network` flag.

### Network Key

- Flag: `--network-key`
- Valid inputs: A valid network public key of the host in hex string format

Specify the network public key of the Access API that will be used to create a secure GRPC client when executing the command.

### Configuration

- Flag: `--config-path`
- Short Flag: `-f`
- Valid inputs: a path in the current filesystem
- Default: `flow.json`

Specify the path to the `flow.json` configuration file. You can use the `-f` flag multiple times to merge several configuration files.

### Output

- Flag: `--output`
- Short Flag: `-o`
- Valid inputs: `json`, `inline`

Specify the format of the command results.

### Filter

- Flag: `--filter`
- Short Flag: `-x`
- Valid inputs: a case-sensitive name of the result property

Specify any property name from the result you want to return as the only value.

### Save

- Flag: `--save`
- Short Flag: `-s`
- Valid inputs: a path in the current filesystem

Specify the filename where you want the result to be saved.

### Log

- Flag: `--log`
- Short Flag: `-l`
- Valid inputs: `none`, `error`, `debug`
- Default: `info`

Specify the log level. Control how much output you want to see during command execution.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.
