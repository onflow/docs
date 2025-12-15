---
title: Commands Overview
description: Essential Flow CLI commands for project development
sidebar_position: 2
---

Flow CLI provides a set of powerful commands that simplify your development workflow. These "super commands" handle complex tasks automatically, which lets you focus on writing your smart contracts while the CLI manages the rest.

## Project lifecycle

### 1. Initialize a project

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

📖 **[Learn more about project initialization]**

### 2. Generate project files

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

**Generated structure:**
```
cadence/
├── contracts/
│   └── MyToken.cdc
├── scripts/
│   └── GetBalance.cdc
├── transactions/
│   └── TransferTokens.cdc
└── tests/
    └── MyToken_test.cdc
```

📖 **[Learn more about generating Cadence boilerplate]**

### 3. Run Tests

Test your contracts with `flow test`:

```bash
# Run all tests
flow test

# Run specific test file
flow test cadence/tests/MyToken_test.cdc

# Run with coverage
flow test --coverage

# Run with verbose output
flow test --verbose
```

📖 **[Learn more about testing]**

### 4. Deploy contracts

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

📖 **[Learn more about project deployment]**

## Configuration management

### Add configuration items

Use `flow config add` to manage your project configuration:

```bash
# Add an account
flow config add account --name my-account --address 0x123 --private-key abc123

# Add a contract
flow config add contract --name MyToken --filename ./cadence/contracts/MyToken.cdc

# Add a deployment
flow config add deployment --network testnet --account my-account --contract MyToken
```

### Remove configuration items

```bash
# Remove an account
flow config remove account my-account

# Remove a contract
flow config remove contract MyToken

# Remove a deployment
flow config remove deployment testnet my-account MyToken
```

📖 **[Learn more about configuration management]**

## Account management

### List accounts

```bash
# List all configured accounts with status
flow accounts list
```

### Create accounts

```bash
# Interactive account creation
flow accounts create

# Create with specific network
flow accounts create --network testnet

# Create with custom key
flow accounts create --key <private-key>
```

### Fund accounts

```bash
# Interactive funding prompt
flow accounts fund

# Fund by account name from flow.json
flow accounts fund testnet-account

# Fund by address
flow accounts fund 0x8e94eaa81771313a
```

### Manage account keys

```bash
# Generate new key pair
flow keys generate

# Decode a key
flow keys decode <key>

# Derive public key from private key
flow keys derive <private-key>
```

📖 **[Learn more about account management]**

## Contract interactions

### Execute scripts

```bash
# Run a script
flow scripts execute cadence/scripts/GetBalance.cdc

# Run with arguments
flow scripts execute cadence/scripts/GetBalance.cdc --arg 0x123

# Run on specific network
flow scripts execute cadence/scripts/GetBalance.cdc --network testnet
```

### Send transactions

```bash
# Send a transaction
flow transactions send cadence/transactions/TransferTokens.cdc

# Send with arguments
flow transactions send cadence/transactions/TransferTokens.cdc --arg 0x123 --arg 100

# Send with specific signer
flow transactions send cadence/transactions/TransferTokens.cdc --signer my-account
```

### Get system transactions

```bash
# Get system transaction from latest block
flow transactions get-system latest

# Get specific system transaction by ID
flow transactions get-system latest 07a8...b433

# Get system transaction from specific block height
flow transactions get-system 12345
```

- 📖 **[Learn more about scripts]** 
- 📖 **[Learn more about transactions]**

## Dependency management

### Install dependencies

```bash
# Install a contract dependency
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter

# Install from mainnet
flow dependencies install mainnet://f233dcee88fe0abe.FungibleToken

# Install with specific account
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter --account my-account
```

### Manage dependencies

```bash
# List installed dependencies
flow dependencies list

# Discover available contracts
flow dependencies discover

# Install a contract dependency
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter
```

📖 **[Learn more about dependency management]**

## Scheduled transactions

### Setup manager resource

```bash
# Initialize Manager resource for scheduled transactions
flow schedule setup --network testnet --signer my-account
```

### List scheduled transactions

```bash
# List all scheduled transactions for an account
flow schedule list my-account --network testnet
```

### Get transaction details

```bash
# Get details for a specific scheduled transaction
flow schedule get 123 --network testnet
```

### Cancel scheduled transaction

```bash
# Cancel a scheduled transaction and receive refund
flow schedule cancel 123 --network testnet --signer my-account
```

📖 **[Learn more about scheduled transactions]**

## Development workflow

### Local development

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

### Testnet deployment

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

## Import schema

Use simplified imports in your Cadence code:

```cadence
// Instead of complex import paths
import FungibleToken from 0x9a0766d93b6608b7

// Use simple contract names
import "FungibleToken"
```

The CLI automatically resolves imports based on your `flow.json` configuration.

## Best Practices

### 1. Use configuration commands

Rather than manually edit `flow.json`, use CLI commands:
```bash
# ✅ Good
flow config add account --name my-account --address 0x123

# ❌ Avoid
# Manually editing flow.json
```

### 2. Test locally first

Always test on emulator before you deploy:
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

### 3. Use descriptive names

Choose clear names for accounts and contracts:
```bash
# ✅ Good
flow config add account --name testnet-deployer
flow generate contract MyNFT

# ❌ Avoid
flow config add account --name acc1
flow generate contract c1
```

### 4. Secure your keys

Use secure key management:
```bash
# Use file-based keys
flow config add account --name my-account --key-file ./keys/my-account.key

# Use environment variables
FLOW_PRIVATE_KEY=abc123 flow project deploy
```

📖 **[Learn more about security best practices]**

## Related Documentation

- **[Configuration Management]** - Learn how to manage your `flow.json` file
- **[Project Deployment]** - Deploy contracts to different networks
- **[Account Management]** - Create and manage Flow accounts
- **[Testing]** - Write and run tests for your contracts
- **[Security]** - Secure your private keys and configuration

<!-- Reference-style links, will not render on page. -->

[Learn more about project initialization]: ./flow.json/initialize-configuration.md
[Learn more about generating Cadence boilerplate]: ./generate.md
[Learn more about testing]: ./tests.md
[Learn more about project deployment]: ./deployment/deploy-project-contracts.md
[Learn more about configuration management]: ./flow.json/manage-configuration.md
[Learn more about account management]: ./accounts/create-accounts.md
[Learn more about scripts]: ./scripts/execute-scripts.md
[Learn more about transactions]: ./transactions/send-transactions.md
[Learn more about dependency management]: ./dependency-manager.md
[Learn more about scheduled transactions]: ./scheduled-transactions.md
[Learn more about security best practices]: ./flow.json/security.md
[Configuration Management]: ./flow.json/manage-configuration.md
[Project Deployment]: ./deployment/deploy-project-contracts.md
[Account Management]: ./accounts/create-accounts.md
[Testing]: ./tests.md
[Security]: ./flow.json/security.md