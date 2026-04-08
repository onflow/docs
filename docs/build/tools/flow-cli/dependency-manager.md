---
title: Dependency Manager
sidebar_label: Dependency Manager
description: Dependency Manager for the Flow Blockchain.
sidebar_position: 11
---

The Dependency Manager in the Flow CLI streamlines the development process when you use contracts from outside your project. It eliminates the manual tasks of copying, pasting, and updating contracts that you use or build upon, such as core contracts or any other ecosystem contracts.

For example, if you wanted to build a new application with the `FlowToken` contract, you would traditionally need to locate the contract on the network, copy it into your local project, and add it to your `flow.json` file. You would repeat this process for each import (dependency) it relies on, like the `NonFungibleToken` contract. The Dependency Manager simplifies this process with a few straightforward commands.

## `install`

The `install` command allows you to install dependencies and all their sub-dependencies with ease. You can use it to install specific dependencies or to install all dependencies listed in your `flow.json`.

### Install specific dependencies

If you know the address and name of the contract you want to install (which can often be found via the [Contract Browser]), you can use the following syntax:

```bash
flow dependencies install testnet://7e60df042a9c0868.FlowToken
```

In this command, the string `testnet://7e60df042a9c0868.FlowToken` used as the `source` in the `flow.json` is broken down as:

- **Network:** `testnet`
- **Address:** `7e60df042a9c0868`
- **Contract Name:** `FlowToken`

This specifies the remote source of the contract on the network that will be used as the source of truth.

### Install core contracts with simplified syntax

For core contracts (and [DeFiActions]), you can use a simplified syntax that defaults to the Flow Mainnet:

```bash
flow dependencies install FlowToken
```

This command is functionally equivalent to:

```bash
flow dependencies install mainnet://1654653399040a61.FlowToken
```

### Install multiple dependencies

You can also install multiple dependencies at once. For example:

```bash
flow dependencies install testnet://7e60df042a9c0868.FlowToken NonFungibleToken
```

This command installs both the `FlowToken` contract from Testnet and the `NonFungibleToken` contract from Mainnet.

### Install all dependencies from an address

Sometimes you may want to install all the contracts that exist at a particular address, rather than specify each contract name individually. To do this, omit the contract name in the dependency source. For example:

```bash
flow dependencies install testnet://7e60df042a9c0868
```

This tells the Dependency Manager to fetch every contract deployed at the `7e60df042a9c0868` address on `testnet` and store them in your `imports` folder. You can later import these contracts in your code or use them in your deployments as needed.

### Install dependencies from `flow.json`

If you run the `install` command but don't specify any dependencies, it will install all the dependencies listed in your `flow.json` file and ensure they are up to date:

```bash
flow dependencies install
```

This command checks all the dependencies specified in your `flow.json`, installs them, and updates them if there have been changes on the network.

### Example `flow.json` entry

After installation, your `flow.json` might include an entry like:

```json
{
  "dependencies": {
    "FlowToken": {
      "source": "testnet://7e60df042a9c0868.FlowToken",
      "aliases": {
        "emulator": "0ae53cb6e3f42a79"
      }
    }
  }
}
```

### Other things to note

- After installation, a local folder named `imports` will be created. We recommend that you add this folder to your `.gitignore`, as it stores your dependencies locally.
- If the contracts change on the network, the Dependency Manager will prompt you to update the local dependencies in your `imports` folder. The hash saved in the dependency object is used for this check, so don't remove it.
- Dependencies function just like local contracts. You can add them to [`deployments` in your `flow.json`](./deployment/deploy-project-contracts.md) and run `flow project deploy`. You can also import them in your scripts, transactions, and contracts (for example, `import "FlowToken"`).
- Core contract aliases are automatically added for you across all networks.

## `discover`

The `discover` command helps you interactively find and install core contracts for your project. Core contracts are standard smart contracts maintained by the Flow Foundation and are commonly used across the Flow ecosystem (learn more about core contracts [here]).

To use the `discover` command, run:

```bash
flow dependencies discover
```

You'll be presented with a list of available core contracts to install:

```shell
Select any core contracts you would like to install or skip to continue.
Use arrow keys to navigate, space to select, enter to confirm or skip, q to quit:

> [ ] FlowEpoch
  [ ] FlowIDTableStaking
  [ ] FlowClusterQC
  [ ] FlowDKG
  [ ] FlowServiceAccount
  [ ] NodeVersionBeacon
  [ ] RandomBeaconHistory
  [ ] FlowStorageFees
  [ ] FlowFees
  [ ] FungibleTokenSwitchboard
  [ ] EVM
  [ ] Crypto
```

After selecting the contracts, press `enter` to confirm. The selected contracts will be added to your `flow.json` file and will be accessible in your project.

## `list`

The `list` command displays all the dependencies currently installed in your project. This is useful to review what contracts your project depends on and their sources.

To list your installed dependencies, run:

```bash
flow dependencies list
```

This command will show you all the dependencies from your `flow.json` file along with their source information, which helps you keep track of what external contracts your project uses.

<!-- Reference-style links, will not render on page. -->

[Contract Browser]: https://contractbrowser.com/
[DeFiActions]: https://github.com/onflow/FlowActions/tree/main?tab=readme-ov-file#deployments
[here]: ../../cadence/core-contracts/index.md