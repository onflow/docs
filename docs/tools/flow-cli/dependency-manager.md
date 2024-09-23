---
title: Dependency Manager
sidebar_label: Dependency Manager
description: Dependency Manager for the Flow Blockchain.
sidebar_position: 11
---

The Dependency Manager in the Flow CLI aids in speeding up and managing the development process when you use contracts from outside your project. It eliminates the manual process of copying, pasting, and updating contracts you are using or building upon. This could include core contracts or any other ecosystem contracts that you use.

For example, suppose you wanted to build a new application using the `FlowToken` contract. First, you would have to find the contract on the network you want to use as the source of truth and then copy it into your local project, adding it to your `flow.json`. You would then repeat this process for each import (dependency) it relies on (e.g., the NonFungibleToken contract) to get it working. The Dependency Manager streamlines this process with a few simple commands.

## `add`

If you know the address and name of the contract you want to install (this can usually be found easily in the [Contract Browser](https://contractbrowser.com/)), you can install the dependency and all its dependencies with a single CLI command, as shown below (using FlowToken as an example):

`flow dependencies add testnet://7e60df042a9c0868.FlowToken`

> Note: You can also use the shorthand `deps`

In this command, the string that will be used as the `source` in the `flow.json` after installation is `testnet://7e60df042a9c0868.FlowToken`. This can be broken down into three sections for formatting it yourself for another contract:

- **Network**: `testnet`
- **Address**: `7e60df042a9c0868`
- **Contract Name**: `FlowToken`

This is the remote source of the contract on the network that will be used as the source of truth.

## `install`

Another way to install a dependency and its dependencies is to use the `install` command. For this, you can add the dependency in the short format like:

```
{
    "dependencies": {
       "FlowToken": "emulator://0ae53cb6e3f42a79.FlowToken"
    }
}

```

Or the extended format like this:

```
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

Now you can run the following command from your terminal:

```
flow dependencies install

```

This will look at all the dependencies you have in your `flow.json`, install them, and all their dependencies.

### Other Things to Note

- After installation, you will have a local folder named `imports` that you should add to `.gitignore`. This folder is where your dependencies will be stored locally.
- If your contracts change on the network, the Dependency Manager will ask if you want to update the local dependencies in your `imports` folder. The hash saved in the dependency object is used for this check, so don't remove it.
- Dependencies will function just like contracts. For instance, you can add them to [`deployments` in your `flow.json`](./deployment/deploy-project-contracts.md) and run `flow project deploy`, as well as import them in your scripts, transactions, and contracts just as you would with a contract you added yourself (e.g., `import "FlowToken"`).
- Core contract aliases will be automatically added for you across all networks.

## `discover`

The `discover` command is used to interactively discover and install core contracts for your project. It will guide you through the process of selecting an available contracts and adding it to your `flow.json` file.

```
flow dependencies discover
```

You will then be presented with a list of available core contracts to install.

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
  [ ] EV
```

After selecting the contracts you would like to install, you can confirm your selection by pressing `enter`. The selected contracts will be added to your `flow.json` file and accessible in your project.
