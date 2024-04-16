---
title: Cadence Boilerplate Generation
sidebar_label: Cadence Boilerplate
description: Cadence Boilerplate Generation via the CLI
sidebar_position: 16
---

## Introduction

Flow CLI now includes a feature to automatically generate boilerplate code for contracts, transactions, and scripts. This feature enhances the development experience by simplifying the initial setup of various components in Flow.

```shell
> flow generate
Usage:
  flow generate [command]

Aliases:
  generate, g

Available Commands:
  contract    Generate a new contract
  script      Generate a new script
  transaction Generate a new transaction
```

## Generate Contract

To create a new contract with basic structure, use the `contract` command. It creates a new Cadence file with a template contract definition.

```shell
flow generate contract [ContractName]
```

### Usage Example

```shell
> flow generate contract HelloWorld
```

This command creates a file `cadence/contracts/HelloWorld.cdc` with the following content:

```cadence
access(all) contract HelloWorld {
    init() {}
}
```

## Generate Transaction

For initializing a transaction, use the `transaction` command. It sets up a new Cadence file with a template transaction structure.

```shell
flow generate transaction [TransactionName]
```

### Usage Example

```shell
> flow generate transaction SayHello
```

This command creates a file `cadence/transactions/SayHello.cdc` with the following content:

```cadence
transaction() {
    prepare() {}

    execute {}
}
```

## Generate Script

Similarly, to start a new script, the `script` command generates a Cadence file with a basic script structure.

```shell
flow generate script [ScriptName]
```

### Usage Example

```shell
> flow generate script ReadHello
```

This command creates a file `cadence/scripts/ReadHello.cdc` with the following content:

```cadence
access(all) fun main() {}
```

## Optional `--dir` Flag

The `--dir` flag is an optional feature in the Flow CLI `generate` commands, allowing you to specify a custom directory for the generated contract, transaction, or script files. If this flag is not provided, the CLI adheres to the recommended project setup:

- Contracts are generated in the `cadence/contracts` directory.
- Transactions are generated in the `cadence/transactions` directory.
- Scripts are generated in the `cadence/scripts` directory.

- **Usage**: `--dir=<directory_name>`
- **Example**: `flow generate contract HelloWorld --dir=custom_contracts`

Use the `--dir` flag only if your project requires a different organizational structure than the default.

