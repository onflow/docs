---
title: Manage Configuration
description: How to configure the Flow CLI using config commands
sidebar_position: 3
---

Instead of manually editing `flow.json`, use the Flow CLI's `config` commands to add, remove, and manage your project configuration. These commands provide validation and ensure your configuration is properly formatted.

## Basic Commands

```shell
# Add configuration items
flow config add <account|contract|network|deployment>

# Remove configuration items
flow config remove <account|contract|network|deployment>
```

## Adding Configuration

### Add an Account

```shell
flow config add account
```

You can use flags to specify account details:

```shell
flow config add account \
  --name my-testnet-account \
  --address f8d6e0586b0a20c7 \
  --private-key ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee \
  --sig-algo ECDSA_P256 \
  --hash-algo SHA3_256 \
  --key-index 0
```

**Available flags:**
- `--name`: Account name
- `--address`: Account address
- `--private-key`: Private key
- `--sig-algo`: Signature algorithm (default: ECDSA_P256)
- `--hash-algo`: Hash algorithm (default: SHA3_256)
- `--key-index`: Key index (default: 0)

**What gets added to `flow.json`:**
```json
"accounts": {
  "my-testnet-account": {
    "address": "f8d6e0586b0a20c7",
    "key": "ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee"
  }
}
```

### Add a Contract

```shell
flow config add contract
```

You can use flags to specify contract details:

```shell
flow config add contract \
  --name MyToken \
  --filename ./cadence/contracts/MyToken.cdc \
  --testnet-alias 9a0766d93b6608b7 \
  --mainnet-alias f233dcee88fe0abe
```

**Available flags:**
- `--name`: Contract name
- `--filename`: Path to contract source file
- `--testnet-alias`: Address for testnet alias
- `--mainnet-alias`: Address for mainnet alias
- `--emulator-alias`: Address for emulator alias

**What gets added to `flow.json`:**
```json
"contracts": {
  "MyToken": {
    "source": "./cadence/contracts/MyToken.cdc",
    "aliases": {
      "testnet": "9a0766d93b6608b7",
      "mainnet": "f233dcee88fe0abe"
    }
  }
}
```

### Add a Network

```shell
flow config add network
```

You can use flags to specify network details:

```shell
flow config add network \
  --name custom-testnet \
  --host access-001.devnet30.nodes.onflow.org:9001 \
  --network-key ba69f7d2e82b9edf25b103c195cd371cf0cc047ef8884a9bbe331e62982d46daeebf836f7445a2ac16741013b192959d8ad26998aff12f2adc67a99e1eb2988d
```

**Available flags:**
- `--name`: Network name
- `--host`: Flow Access API host address
- `--network-key`: Network key for secure connections

**What gets added to `flow.json`:**
```json
"networks": {
  "custom-testnet": {
    "host": "access-001.devnet30.nodes.onflow.org:9001",
    "key": "ba69f7d2e82b9edf25b103c195cd371cf0cc047ef8884a9bbe331e62982d46daeebf836f7445a2ac16741013b192959d8ad26998aff12f2adc67a99e1eb2988d"
  }
}
```

### Add a Deployment

```shell
flow config add deployment
```

You can use flags to specify deployment details:

```shell
flow config add deployment \
  --network testnet \
  --account my-testnet-account \
  --contract MyToken
```

**Available flags:**
- `--network`: Network name for deployment
- `--account`: Account name for deployment
- `--contract`: Contract name(s) to deploy (can specify multiple)

**What gets added to `flow.json`:**
```json
"deployments": {
  "testnet": {
    "my-testnet-account": ["MyToken"]
  }
}
```

## Removing Configuration

### Remove an Account

```shell
flow config remove account my-testnet-account
```

### Remove a Contract

```shell
flow config remove contract MyToken
```

### Remove a Network

```shell
flow config remove network custom-testnet
```

### Remove a Deployment

```shell
flow config remove deployment my-testnet-account testnet
```

**Note:** This removes all deployments for the specified account on the specified network.

## Configuration File Management

### Using Custom Configuration Files

```shell
# Use a specific configuration file
flow config add account --config-path ./config/flow.json

# Use multiple configuration files (merged in order)
flow config add account -f flow.json -f private.json
```

### Configuration File Priority

When using multiple configuration files with `-f` flag:

1. Files are merged from left to right
2. Later files override earlier ones for overlapping properties
3. Non-overlapping properties are combined

**Example:**
```shell
flow config add account -f flow.json -f private.json
```

If both files have an `admin-account`, the one from `private.json` will be used.

### Security Best Practices

For better security, consider using separate configuration files for sensitive data:

**Main configuration file (`flow.json`):**
```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "3ae53cb6e3f42a79",
      "key": {
        "type": "file",
        "location": "./my-testnet-account.key"
      }
    }
  }
}
```

**Private key file (`my-testnet-account.key`):**
```
334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111
```

**Private configuration file (`private.json`):**
```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "3ae53cb6e3f42a79",
      "key": "334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111"
    }
  }
}
```

⚠️ **Important:** Always add private files to `.gitignore` to prevent committing sensitive data to source control.

## Validation

The `config add` command validates all inputs:

- **Account addresses** must be valid Flow addresses (16-character hex)
- **Private keys** must be valid hex-encoded keys
- **Contract sources** must point to existing `.cdc` files
- **Network hosts** must be valid host:port combinations
- **Deployments** must reference existing accounts and contracts

## Best Practices

1. **Use CLI commands** instead of manual editing when possible
2. **Validate your configuration** by running `flow config add` commands
3. **Use descriptive names** for accounts and contracts
4. **Keep sensitive data separate** using multiple config files
5. **Test deployments** on emulator before adding to testnet/mainnet

## Common Use Cases

### Setting Up a New Project

```shell
# Initialize project
flow init

# Add your contracts
flow config add contract --name MyToken --filename ./cadence/contracts/MyToken.cdc
flow config add contract --name MyNFT --filename ./cadence/contracts/MyNFT.cdc

# Create accounts for different networks
flow config add account --name emulator-account --address f8d6e0586b0a20c7 --private-key ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee
flow config add account --name testnet-account --address 3ae53cb6e3f42a79 --private-key 12332967fd2bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111

# Configure deployments
flow config add deployment --network emulator --account emulator-account --contract MyToken --contract MyNFT
flow config add deployment --network testnet --account testnet-account --contract MyToken --contract MyNFT
```

### Adding to Existing Project

```shell
# Add new contract
flow config add contract --name NewContract --filename ./cadence/contracts/NewContract.cdc

# Add deployment for new contract
flow config add deployment --network testnet --account testnet-account --contract NewContract
```

### Managing Multiple Environments

```shell
# Use separate config files for different environments
flow config add account --name admin-account --address f8d6e0586b0a20c7 --private-key ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee -f flow.json
flow config add account --name admin-account --address f1d6e0586b0a20c7 --private-key 3335dfdeb0ff03a7a73ef39788563b62c89adea67bbb21ab95e5f710bd1d40b7 -f private.json
```

## Related Commands

- [`flow init`](./initialize-configuration.md) - Initialize a new project
- [`flow project deploy`](../deployment/deploy-project-contracts.md) - Deploy contracts
- [`flow accounts create`](../accounts/create-accounts.md) - Create new accounts






