---
title: Generating Cadence Boilerplate
sidebar_label: Generating Cadence Boilerplate
description: Generate template files for common Cadence code using the Flow CLI
sidebar_position: 12
---

The `flow generate` command provides a convenient way to create boilerplate template files for common Cadence code components. TO streamline the development process, this command automatically generates properly structured files with the correct syntax and organization.

## Overview

```bash
flow generate [command]
```

**Aliases:** `generate`, `g`

The generate command supports four main subcommands to create different types of Cadence files:

- **contract** - Generate Cadence smart contract templates.
- **script** - Generate Cadence script templates.
- **test** - Generate Cadence test templates.
- **transaction** - Generate Cadence transaction templates.

## Generate contract

Creates a new Cadence smart contract with a basic template structure.

### Usage

```bash
flow generate contract <name> [flags]
```

### Example

```bash
flow generate contract HelloWorld
```

This command creates a file `cadence/contracts/HelloWorld.cdc` with the following content:

```cadence
access(all) contract HelloWorld {
    init() {}
}
```

:::info

When you generate a contract, a test file that corresponds to that contracts is also created automatically (unless `--skip-tests` is used). For example, when you generate `HelloWorld`, the contract will also create `cadence/tests/HelloWorld.test.cdc`.

:::

### Flags

- `--dir string` - Directory to generate files in (defaults to `cadence/contracts/`).
- `--skip-tests` - Skip test file generation.
- `-h, --help` - Help for contract command.

## Generate transaction

Creates a new Cadence transaction with a basic template structure.

### Use

```bash
flow generate transaction <name> [flags]
```

### Example

```bash
flow generate transaction TransferTokens
```

This command creates a file `cadence/transactions/TransferTokens.cdc` with the following content:

```cadence
transaction() {
    prepare() {}

    execute {}
}
```

### Flags

- `--dir string` - Directory to generate files in (defaults to `cadence/transactions/`).
- `--skip-tests` - Skip test file generation.
- `-h, --help` - Help for transaction command.

## Generate script

Creates a new Cadence script with a basic template structure.

### Use

```bash
flow generate script <name> [flags]
```

### Example

```bash
flow generate script GetBalance
```

This command creates a file `cadence/scripts/GetBalance.cdc` with the following content:

```cadence
access(all) fun main() {}
```

### Flags

- `--dir string` - Directory to generate files in (defaults to `cadence/scripts/`).
- `--skip-tests` - Skip test file generation.
- `-h, --help` - Help for script command.

## Generate test

Creates a new Cadence test file with a basic template structure.

### Use

```bash
flow generate test <name> [flags]
```

### Example

```bash
flow generate test MyToken
```

This command creates a file `cadence/tests/MyToken.test.cdc` with a basic test structure.

After you generate a test, you can run it using `flow test`. For more information about how to write and run Cadence tests, see the [Cadence Tests documentation].

### Flags

- `--dir string` - Directory to generate files in (defaults to `cadence/tests/`).
- `--skip-tests` - Skip test file generation.
- `-h, --help` - Help for test command.

## Custom directory use

All generate commands support the `--dir` flag to specify a custom directory for the generated files. This is useful when your project requires a different organizational structure than the default.

### Examples

```bash
# Generate contract in a custom directory
flow generate contract MyToken --dir=src/contracts

# Generate transaction in a custom directory  
flow generate transaction Transfer --dir=src/transactions

# Generate script in a custom directory
flow generate script GetData --dir=src/scripts

# Generate test in a custom directory
flow generate test MyToken --dir=src/tests
```

## Project structure

When you use the default directories, the generate command creates the following structure:

```
cadence/
├── contracts/
│   └── MyToken.cdc
├── scripts/
│   └── GetBalance.cdc
├── transactions/
│   └── TransferTokens.cdc
└── tests/
    └── MyToken.test.cdc
```

The generate command is an essential tool to accelerate Flow development with standardized, well-structured boilerplate code for all common Cadence components.

<!-- Reference-style links, will not render on page. -->

[Cadence Tests documentation]: ./tests.md