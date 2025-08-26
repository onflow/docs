---
title: Commands Overview
description: Essential Flow CLI commands for project development
sidebar_position: 2
---

Flow CLI provides a set of powerful commands that simplify your development workflow. These "super commands" handle complex tasks automatically, letting you focus on writing your smart contracts while the CLI manages the rest.

## Project Lifecycle

### 1. Initialize a Project

Start a new Flow project with `flow init`:

```bash
flow init my-project
```

This creates:
- `flow.json` - Project configuration
- `cadence/` directory structure
- Example contracts, scripts, and tests
- Emulator account setup

**Options:**
```bash
# Configuration only (no project structure)
flow init --config-only

# Global configuration
flow init --global

# Custom service account
flow init --service-private-key <key>
```

📖 **[Learn more about project initialization](./flow.json/initialize-configuration.md)**

### 2. Generate Project Files

Create new files with the `flow generate` command:

```bash
# Generate a new contract
flow generate contract MyToken

# Generate a new script
flow generate script GetBalance

# Generate a new transaction
flow generate transaction TransferTokens

# Generate a new test
flow generate test MyToken
```

**Generated Structure:**
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

📖 **[Learn more about generating Cadence boilerplate](./generate.md)**

### 3. Run Tests

Test your contracts with `flow test`:

```bash
# Run all tests
flow test

# Run specific test file
flow test cadence/tests/MyToken.test.cdc

# Run with coverage
flow test --coverage

# Run with verbose output
flow test --verbose
```

📖 **[Learn more about testing](./tests.md)**

### 4. Deploy Contracts

Deploy your contracts with `flow project deploy`:

```bash
# Deploy to emulator
flow project deploy

# Deploy to testnet
flow project deploy --network=testnet

# Deploy to mainnet
flow project deploy --network=mainnet

# Update existing contracts
flow project deploy --update
```

📖 **[Learn more about project deployment](./deployment/deploy-project-contracts.md)**

## Configuration Management

### Add Configuration Items

Use `flow config add` to manage your project configuration:

```bash
# Add an account
flow config add account --name my-account --address 0x123 --private-key abc123

# Add a contract
flow config add contract --name MyToken --filename ./cadence/contracts/MyToken.cdc

# Add a deployment
flow config add deployment --network testnet --account my-account --contract MyToken
```

### Remove Configuration Items

```bash
# Remove an account
flow config remove account my-account

# Remove a contract
flow config remove contract MyToken

# Remove a deployment
flow config remove deployment testnet my-account MyToken
```

📖 **[Learn more about configuration management](./flow.json/manage-configuration.md)**

## Account Management

### Create Accounts

```bash
# Interactive account creation
flow accounts create

# Create with specific network
flow accounts create --network testnet

# Create with custom key
flow accounts create --key <private-key>
```

### Manage Account Keys

```bash
# Generate new key pair
flow keys generate

# Decode a key
flow keys decode <key>

# Derive public key from private key
flow keys derive <private-key>
```

📖 **[Learn more about account management](./accounts/create-accounts.md)**

## Contract Interactions

### Execute Scripts

```bash
# Run a script
flow scripts execute cadence/scripts/GetBalance.cdc

# Run with arguments
flow scripts execute cadence/scripts/GetBalance.cdc --arg 0x123

# Run on specific network
flow scripts execute cadence/scripts/GetBalance.cdc --network testnet
```

### Send Transactions

```bash
# Send a transaction
flow transactions send cadence/transactions/TransferTokens.cdc

# Send with arguments
flow transactions send cadence/transactions/TransferTokens.cdc --arg 0x123 --arg 100

# Send with specific signer
flow transactions send cadence/transactions/TransferTokens.cdc --signer my-account
```

📖 **[Learn more about scripts and transactions](./scripts/execute-scripts.md)**

## Dependency Management

### Install Dependencies

```bash
# Install a contract dependency
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter

# Install from mainnet
flow dependencies install mainnet://f233dcee88fe0abe.FungibleToken

# Install with specific account
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter --account my-account
```

### Manage Dependencies

```bash
# Discover available contracts
flow dependencies discover

# Install a contract dependency
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter
```

📖 **[Learn more about dependency management](./dependency-manager.md)**

## Development Workflow

### Local Development

1. **Start the emulator:**
```bash
flow emulator start
```

2. **Deploy contracts:**
```bash
flow project deploy
```

3. **Run tests:**
```bash
flow test
```

4. **Execute scripts:**
```bash
flow scripts execute cadence/scripts/GetBalance.cdc
```

5. **Send transactions:**
```bash
flow transactions send cadence/transactions/TransferTokens.cdc
```

### Testnet Deployment

1. **Configure testnet account:**
```bash
flow config add account --name testnet-account --address 0x123 --private-key abc123
```

2. **Deploy to testnet:**
```bash
flow project deploy --network=testnet
```

3. **Test on testnet:**
```bash
flow scripts execute cadence/scripts/GetBalance.cdc --network=testnet
```

## Import Schema

Use simplified imports in your Cadence code:

```cadence
// Instead of complex import paths
import FungibleToken from 0x9a0766d93b6608b7

// Use simple contract names
import "FungibleToken"
```

The CLI automatically resolves imports based on your `flow.json` configuration.

## Best Practices

### 1. Use Configuration Commands

Instead of manually editing `flow.json`, use CLI commands:
```bash
# ✅ Good
flow config add account --name my-account --address 0x123

# ❌ Avoid
# Manually editing flow.json
```

### 2. Test Locally First

Always test on emulator before deploying:
```bash
# 1. Start emulator
flow emulator start

# 2. Deploy locally
flow project deploy

# 3. Run tests
flow test

# 4. Deploy to testnet
flow project deploy --network=testnet
```

### 3. Use Descriptive Names

Choose clear names for accounts and contracts:
```bash
# ✅ Good
flow config add account --name testnet-deployer
flow generate contract MyNFT

# ❌ Avoid
flow config add account --name acc1
flow generate contract c1
```

### 4. Secure Your Keys

Use secure key management:
```bash
# Use file-based keys
flow config add account --name my-account --key-file ./keys/my-account.key

# Use environment variables
FLOW_PRIVATE_KEY=abc123 flow project deploy
```

📖 **[Learn more about security best practices](./flow.json/security.md)**

## Related Documentation

- **[Configuration Management](./flow.json/manage-configuration.md)** - Learn how to manage your `flow.json` file
- **[Project Deployment](./deployment/deploy-project-contracts.md)** - Deploy contracts to different networks
- **[Account Management](./accounts/create-accounts.md)** - Create and manage Flow accounts
- **[Testing](./tests.md)** - Write and run tests for your contracts
- **[Security](./flow.json/security.md)** - Secure your private keys and configuration