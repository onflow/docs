---
title: Deploying Contracts
sidebar_label: Deploying Contracts
description: Learn how to deploy and update smart contracts on Flow Mainnet and Testnet. Understand account creation, key management, deployment best practices, and network sporks.
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

In order to deploy your smart contracts to the mainnet, you need a funded account. If you want to get started on Testnet, look below for information on how to get started.

<Callout type="info">
Make sure you handle your mainnet account keys appropriately. Using a Key Management Service is the best practice. 
</Callout>

### Creating an Account

There are two simple methods of creating an account on testnet. **Interactive** and **Manual**, both use the Flow CLI. On mainnet you will have to fund your newly created account, there is no faucet.
Make sure to install the Flow CLI. [Flow CLI](../../tools/flow-cli/accounts/create-accounts.md) has a interactive mode for generating keys.

<Callout type="success">
Anyone can deploy and update contracts on mainnet. Audits are encouraged but not mandatory to deploying contracts to mainnet. Take every precauction to reduce issues and protect users. 
</Callout>

### Create and deploy a mainnet project

The tool of choice is Flow CLI, there are quickstarts and guides that use Flow CLI, [Getting Started](../getting-started/flow-cli)

- It is highly encouraged to test your contracts, transactions and scripts on Testnet, have strong smart contract test coverage and follow any additional guidelines set out here: [Smart Contract Testing Guidelines](./testing.md).
- Follow the Flow CLI instructions to [Create a Project](../../tools/flow-cli/index.md). You have the Flow CLI installed and ran `flow init` in your project folder and generating a `flow.json` file
- Mainnet account: You completed the mainnet account setup, (see above) and have your key pair and mainnet address ready.
- [Deploy your project](../../tools/flow-cli/deployment/deploy-project-contracts.md), notice that your account now has contracts deployed on mainnet.
- [Deploy a contract](../../tools/flow-cli/accounts/account-add-contract.md) to mainnet. You can deploy contracts individually using the `account-add-contract` command.

<Callout type="info">
All your contract deployment addresses are stored in `flow.json`. Mainnet, Testnet and local (emulator) are stored as well.
</Callout>

### Deploy updated contracts on mainnet

Contracts can be updated and retain the contract address. You can use the [Flow CLI contract update command](../../tools/flow-cli/accounts/account-update-contract.md) to re-deploy an updated version of your contract:

<Callout type="warning">
If you see `Error Code: 1103`, your new account does not have enough funds to complete the transaction. Make sure you have enough FLOW and your account is set up correctly, check [Flowdiver](https://flowdiver.io/) to verify.
</Callout>

Once all your contracts are deployed, you can visit [flow-view-source](https://flow-view-source.com/) or run the [Flow CLI get account command](../../tools/flow-cli/accounts/get-accounts.md) to confirm the deployment.

### Sporks

Currently, **historical event data is not migrated between sporks,** so you'll need to design your application with this in mind. We recognize the usefulness of historical event data and plan on adding a means of accessing it in the near future. Past spork transactional data is available, [See Previous Spork Access Node Info](../../networks/node-ops/node-operation/past-upgrades)

More Information on [Sporks](../../networks/node-ops/node-operation/spork)

### Testnet

The Flow test network, known as Flow Testnet, exists to help developers test their software and smart contracts against a live network. It's also used as a means of releasing and testing new protocol and smart contract features before they are integrated into Flow's main network (Mainnet).

When the Flow protocol is updated or a new version of Cadence is released, those updates will always be made available on the [Flow Emulator](../../tools/emulator) _before_ they're integrated into Flow Testnet or Flow Mainnet.

## Getting Started on Testnet

If you need to create a flow.json file to store information about accounts and contracts use the `flow init` command to create a project
<Callout type="info">
To create accounts and generate keys, make sure to install [Flow CLI](../../tools/flow-cli/install). Flow CLI provides convenient functions to simplifies interacting with the blockchain.
</Callout>

### Creating an Account

There is a simple Flow CLI command to run to create an account. `flow accounts create` command will create a new account and generate a key pair then add the account to your flow.json. The command will try and You can also use the [Testnet Faucet](https://faucet.flow.com/fund-account) to create and fund an account.

More information about [Flow CLI](../../tools/flow-cli/accounts/create-accounts) and creating accounts.

### Creating and deploying a Project

Flow CLI can be used to create a Cadence project and stay organized, [Flow CLI: Create a project](../../tools/flow-cli). This will make deployment much easiler and help with the iterative development process.

After you have a project created and want to deploy your Cadence; contracts, transactions and scripts.
`flow accounts add-contract <CONTRACT_PATH> --signer <ACCOUNT_NAME> --network testnet` will deploy your contract to testnet.
More information on how to use Flow CLI to [deploy](../../tools/flow-cli/deployment/deploy-project-contracts.md).

Make sure Flow project was initialized in the previous step and the `flow.json` is present.

### Making Use of Core Contracts

Flow Testnet comes with some useful contracts already deployed, called **core contracts.** More information and import addresses for the [core contracts](../../build/core-contracts/index.md).

Once your accounts are set up and you're ready to develop, you can look over [some code examples from the Flow Go SDK](https://github.com/onflow/flow-go-sdk/tree/master/examples).

### Breaking Changes

The Flow blockchain is improved continuously and thus version updates to Cadence, Flow node software, and the Flow SDKs will contain important updates as well as breaking changes.

You should anticipate future updates and join the community ([Forum](https://forum.flow.com/) or [Discord](https://discord.com/invite/J6fFnh2xx6)) to stay tuned on important announcements. Notices and guidelines for changes will be provided as early as possible.

### Testnet Sporking

"Sporking" (soft forking) is the process of upgrading the Flow network node software and migrating the chain state from one version to another.

Currently, **historical event data is not migrated between sporks.** You'll need to design your application with this in mind. We recognize the usefulness of historical event data and plan on adding a means of accessing it in the near future. Only one previous spork data is available through old Access Node.

<Callout type="warning">
Flow Testnet is explicitly for experimentation and testing and should not be used to exchange "real value" (e.g. developing a fiat money on/off-ramp for your testnet application).
</Callout>
