---
title: Deploying Contracts
sidebar_label: Deploying Contracts
description: Learn how to deploy and update smart contracts on Flow Mainnet and Testnet. Understand account creation, key management, and deployment best practices.
sidebar_position: 3
sidebar_custom_props:
  icon: 🥇
keywords:
  - contract deployment
  - Flow mainnet
  - Flow testnet
  - account creation
  - key management
  - Flow CLI
  - smart contracts
  - deployment guide
  - contract updates
  - sporks
  - network migration
  - testnet faucet
  - deployment security
  - contract addresses
  - Flow deployment
---

# Deploying Contracts

Deploying smart contracts to Flow's networks is the final step for you to bring your blockchain application to life. This guide covers everything you need to know to deploy your Cadence contracts to both Flow Testnet and Mainnet, from account creation to contract updates.

## What you'll learn

After you complete this guide, you'll be able to:

- **Create and fund accounts** on Flow Testnet and Mainnet.
- **Deploy contracts** with Flow CLI with proper configuration.
- **Update current contracts** and preserve their addresses.
- **Understand the differences** between testnet and mainnet deployment.
- **Follow security best practices** for production deployments.

## Prerequisites

Before you deploy contracts, make sure you have:

- **Flow CLI installed** and configured.
- **A Flow project** with contracts ready for deployment.
- **Basic understanding** of Cadence smart contracts.
- **Completed testing** of your contracts locally.

## Deployment Workflow

The recommended deployment workflow follows this progression:

1. **Emulator Deployment** - Deploy and test your contracts locally (free, instant).
2. **Testnet Deployment** - Deploy and test your contracts on Flow Testnet (free).
3. **Mainnet Deployment** - Deploy to Flow Mainnet after testing is complete (costs FLOW tokens).
4. **Contract Updates** - Update contracts as needed with the `update` command.

This approach ensures your contracts work correctly before you commit real resources to mainnet deployment.

## Deploy to emulator

The Flow Emulator is your local development environment where you can deploy and test contracts instantly without any network costs or delays. This is the first step in your deployment journey.

### Start the emulator

First, start the [Flow Emulator]. In a second terminal:

```zsh
flow emulator start
```

### Create an emulator account

Create a local account for testing:

```zsh
flow accounts create --network emulator
```

When prompted:

1. **Account name**: Enter `emulator-account`
2. Select `emulator` as the network when prompted

This creates a new account on the emulator and adds it to your `flow.json` configuration.

### Configure emulator deployment

Update your `flow.json` to include emulator deployment configuration:

```zsh
flow config add deployment
```

Follow the prompts:

1. **Network**: `emulator`
2. **Account**: `emulator-account`
3. **Contract**: `YourContract`
4. **Deploy more contracts**: `no` (or `yes` if you have multiple contracts)

Your `flow.json` will now include an emulator deployment section:

```json
{
  "deployments": {
    "emulator": {
      "emulator-account": ["YourContract"]
    }
  }
}
```

### Deploy contract to emulator

Deploy your contract to the local emulator:

```zsh
flow project deploy --network emulator
```

:::warning

You cannot deploy the same contract to multiple accounts on the same network with one deployment command. If you attempt to do so, you will see:

❌ Command Error: the same contract cannot be deployed to multiple accounts on the same network

Edit `flow.json` to remove the duplicate.

:::

You will see output similar to:

```zsh
Deploying 1 contracts for accounts: emulator-account

YourContract -> 0xf8d6e0586b0a20c7 (contract deployed successfully)

🎉 All contracts deployed successfully
```

### Test your emulator deployment

Verify your contract works via these scripts and transactions:

```zsh
# Run a script to read contract state
flow scripts execute cadence/scripts/YourScript.cdc --network emulator

# Send a transaction to interact with your contract
flow transactions send cadence/transactions/YourTransaction.cdc --network emulator --signer emulator-account
```

:::info

The emulator provides instant feedback and is perfect for rapid development and testing. All transactions are free and execute immediately.

:::

## Deploy to Testnet

For a more complete quickstart, visit the [Getting Started] guide.

- You should test your contracts, transactions and scripts on Testnet, have strong smart contract test coverage and follow the additional guidelines set out here: [Smart Contract Testing Guidelines].
- Use `flow init` to [Create a Project] if you need one to practice deployment with.

### Create a Testnet account

First, you'll need a testnet account to deploy your contracts. Create one with:

```zsh
flow accounts create --network testnet
```

:::info

For security reasons, Flow Cadence does not allow accounts to have the same address on testnet, mainnet, and/or the emulator.

::::

When prompted:

1. **Account name**: Enter `testnet-account`
2. Select `testnet` as the network when prompted

This creates a new account on testnet and adds it to your `flow.json` configuration. It also saves the private key for the new account in `<account-name>.pkey` and uses this file to import the key because `flow.json` is visible in the repo.

:::danger

As with any other blockchain network, **anyone** with access to the private key for an account can access that account at any time without your knowledge.

:::

### Fund your Testnet account

To deploy contracts and send transactions on testnet, you need FLOW tokens. Flow provides a faucet service to get free testnet tokens.

```zsh
flow accounts fund testnet-account
```

This will open the faucet in your browser. You can also navigate there manually.

1. Visit the [Testnet Faucet].
2. Enter your testnet account address.
3. Complete any required verification (captcha, and so on).
4. Request tokens (you'll receive 100000 testnet FLOW tokens).

Check your account balance:

```zsh
flow accounts list
```

You will see your account details with a balance of FLOW tokens.

### Configure Testnet deployment

Update your `flow.json` to include testnet deployment configuration:

```zsh
flow config add deployment
```

Follow the prompts:

1. **Network**: `testnet`
2. **Account**: `testnet-account`
3. **Contract**: `YourContract`
4. **Deploy more contracts**: `no` (or `yes` if you have multiple contracts)

Your `flow.json` will now include a testnet deployment section:

```json
{
  "deployments": {
    "testnet": {
      "testnet-account": ["YourContract"]
    }
  }
}
```

### Deploy contract to Testnet

Deploy your contract to the public testnet:

```zsh
flow project deploy --network testnet
```

You will see output similar to:

```zsh
Deploying 1 contracts for accounts: testnet-account

YourContract -> 0x9942a81bc6c3c5b7 (contract deployed successfully)

🎉 All contracts deployed successfully
```

## Deploy to Mainnet

After you've successfully tested your contracts on testnet, you can deploy to mainnet. You'll need a mainnet account with real FLOW tokens.

### Create a Mainnet account

For mainnet, you'll need to acquire FLOW tokens through exchanges or other means, as there's no faucet.

```zsh
flow accounts create --network mainnet
```

When prompted:

1. **Account name**: Enter `mainnet-account`
2. **Select "Mainnet" Network**

### Acquire FLOW tokens

You can purchase FLOW tokens from major exchanges. Make sure your mainnet account has sufficient FLOW tokens to cover deployment costs. Flow is a very efficient network, so even 1.0 FLOW is sufficient to deploy large numbers of contracts.

### Configure Mainnet deployment

Add mainnet deployment configuration to your `flow.json`:

```zsh
flow config add deployment --network mainnet
```

Follow the prompts:

1. **Network**: `mainnet`
2. **Account**: `mainnet-account`
3. **Contract**: `YourContract`
4. **Deploy more contracts**: `no` (or `yes` if you have multiple contracts)

Your `flow.json` will now include mainnet configuration:

```json
{
  "deployments": {
    "mainnet": {
      "mainnet-account": ["YourContract"]
    }
  }
}
```

### Deploy to Mainnet

Deploy your contracts to mainnet:

```zsh
flow project deploy --network mainnet
```

:::warning

This deployment costs (a relatively small amount of) real FLOW tokens and you cannot undo it. You can, however, redeploy your contracts to update them, or delete them.

:::

You will see output similar to:

```zsh
Deploying 1 contracts for accounts: mainnet-account

YourContract -> 0xABC123DEF456789 (contract deployed successfully)

🎉 All contracts deployed successfully
```

:::info

All your contract deployment addresses are stored in `flow.json`. Mainnet, Testnet and local (emulator) are stored as well.

:::

## Deploy updated contracts on mainnet

You can update contracts and retain the contract address. To do this, use the [Flow CLI contract update command] to redeploy an updated version of your contract:

```zsh
flow accounts update-contract ./YourContract.cdc --signer mainnet-account --network mainnet
```
<!-- Relative links, will not render on page -->

[Flow CLI]: ../../../build/tools/flow-cli/install
[Getting Started]: ../../../blockchain-development-tutorials/cadence/getting-started/smart-contract-interaction
[Smart Contract Testing Guidelines]: ./testing.md
[Create a Project]: ../../../build/tools/flow-cli/index.md
[Flow CLI contract update command]: ../../../build/tools/flow-cli/accounts/account-update-contract.md
[Flow CLI get account command]: ../../../build/tools/flow-cli/accounts/get-accounts.md
[Sporks]: ../../../protocol/node-ops/node-operation/network-upgrade
[Flow Emulator]: ../../../build/tools/emulator
[Testnet Faucet]: https://faucet.flow.com/
[core contracts]: ../core-contracts/index.md
[some code examples from the Flow Go SDK]: https://github.com/onflow/flow-go-sdk/tree/master/examples
[Forum]: https://forum.flow.com/
[Discord]: https://discord.com/invite/J6fFnh2xx6
