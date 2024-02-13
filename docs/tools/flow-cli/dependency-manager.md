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

`flow dependencies add testnet://0afe396ebc8eee65.FlowToken`

> Note: You can also use the shorthand `deps`
> 

In this command, the string that will be used as the `source` in the `flow.json` after installation is `testnet://0afe396ebc8eee65.FLOAT`. This can be broken down into three sections for formatting it yourself for another contract:

- **Network**: `testnet`
- **Address**: `0ae53cb6e3f42a79`
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
          "source": "emulator://0ae53cb6e3f42a79.FlowToken",
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

## Other Things to Note

- After installation, you will have a local folder named `imports` that you should add to `.gitignore`. This folder is where your dependencies will be stored locally.
- If your contracts change on the network, the Dependency Manager will ask if you want to update the local dependencies in your `imports` folder. The hash saved in the dependency object is used for this check, so don't remove it.
- Dependencies will function just like contracts. For instance, you can add them to [`deployments` in your `flow.json`](./deployment/deploy-project-contracts.md) and run `flow project deploy`, as well as import them in your scripts, transactions, and contracts just as you would with a contract you added yourself (e.g., `import "FlowToken"`).
- Core contract aliases will be automatically added for you across all networks.