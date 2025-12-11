---
title: Initialize Configuration
description: How to initialize Flow configuration using CLI
sidebar_position: 1
---

The `flow init` command creates a new Flow project with a basic `flow.json` configuration file. This is the first step to set up any Flow project.

## Basic usage

```shell
flow init
```

This command will:

- Create a new `flow.json` configuration file.
- Set up default networks (emulator, testnet, mainnet).
- Create an emulator service account.
- Generate a basic project structure with `cadence/` directories.
- Give you options for project scaffolding.

## Project structure

After you run `flow init`, you'll have:

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

## Configuration only

If you only want to generate the `flow.json` file, but not create the full project structure, use the `--config-only` flag:

```shell
flow init --config-only
```

This is useful when:

- You already have a project structure.
- You want to add Flow configuration to a current project.
- You want to set up configuration for a specific environment.

## Global configuration

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

Local configuration files will override global settings for properties that overlap.

## Error handling

If a `flow.json` file already exists, you'll see this error:

```shell
❌ Command Error: configuration already exists at: flow.json
```

**Solutions:**

- Delete the current `flow.json` file first.
- Initialize in a different directory.
- Use `--config-only` to create a new config in a different location.

## Flags

### Configuration only

```shell
flow init --config-only
```

Creates only the `flow.json` file without project structure.

### Global flags

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

After you initialize the configuration:

1. **Review the generated `flow.json`** - Understand the default setup
2. **Add your contracts** - Use `flow config add contract`
3. **Create accounts** - Use `flow accounts create` or `flow config add account`
4. **Configure deployments** - Use `flow config add deployment`
5. **Start developing** - Run `flow emulator start`

## Related Commands

- [`flow config add`] - Add configuration items
- [`flow accounts create`] - Create new accounts
- [`flow project deploy`] - Deploy contracts

<!-- Reference-style links, will not render on page. -->

[`flow config add`]: ./manage-configuration.md
[`flow project deploy`]: ../deployment/deploy-project-contracts.md
[`flow accounts create`]: ../accounts/create-accounts.md