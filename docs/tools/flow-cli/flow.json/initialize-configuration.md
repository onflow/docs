---
title: Initialize Configuration
description: How to initialize Flow configuration using CLI
sidebar_position: 1
---

The `flow init` command creates a new Flow project with a basic `flow.json` configuration file. This is the first step in setting up any Flow project.

## Basic Usage

```shell
flow init
```

This command will:
- Create a new `flow.json` configuration file
- Set up default networks (emulator, testnet, mainnet)
- Create an emulator service account
- Generate a basic project structure with `cadence/` directories

## Example Output

```shell
> flow init

Configuration initialized
Service account: 0xf8d6e0586b0a20c7

Start emulator by running: 'flow emulator' 
Reset configuration using: 'flow init --reset'
```

## Project Structure

After running `flow init`, you'll have:

```
my-project/
├── flow.json
├── emulator-account.pkey
└── cadence/
    ├── contracts/
    ├── scripts/
    ├── transactions/
    └── tests/
```

## Configuration Only

If you only want to generate the `flow.json` file without creating the full project structure, use the `--config-only` flag:

```shell
flow init --config-only
```

This is useful when:
- You already have a project structure
- You want to add Flow configuration to an existing project
- You're setting up configuration for a specific environment

## Global Configuration

You can create a global `flow.json` file that applies to all Flow projects on your system:

```shell
flow init --global
```

**Global configuration locations:**
- **macOS/Linux:** `~/flow.json`
- **Windows:** `C:\Users\$USER\flow.json`

**Priority order:**
1. Local `flow.json` (highest priority)
2. Global `flow.json` (lowest priority)

Local configuration files will override global settings for overlapping properties.

## Error Handling

If a `flow.json` file already exists, you'll see this error:

```shell
❌ Command Error: configuration already exists at: flow.json
```

**Solutions:**
- Delete the existing `flow.json` file first
- Initialize in a different directory
- Use `--config-only` to create a new config in a different location

## Flags

### Configuration Only

```shell
flow init --config-only
```

Creates only the `flow.json` file without project structure.



### Global Flags

The following global flags are also available:

```shell
# Log level
flow init --log debug

# Output format
flow init --output json

# Approve prompts automatically
flow init --yes
```

**Available log levels:** `debug`, `info`, `error`, `none`

## Next Steps

After initializing your configuration:

1. **Review the generated `flow.json`** - Understand the default setup
2. **Add your contracts** - Use `flow config add contract`
3. **Create accounts** - Use `flow accounts create` or `flow config add account`
4. **Configure deployments** - Use `flow config add deployment`
5. **Start developing** - Run `flow emulator start`

## Related Commands

- [`flow config add`](./manage-configuration.md) - Add configuration items
- [`flow accounts create`](../accounts/create-accounts.md) - Create new accounts
- [`flow project deploy`](../deployment/deploy-project-contracts.md) - Deploy contracts






