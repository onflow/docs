---
title: Deploy a Project
description: How to deploy Flow project contracts with the CLI
sidebar_position: 3
---

```shell
flow project deploy
```

This command automatically deploys your project's contracts based on the configuration defined in your `flow.json` file.

:::info

Use Flow CLI commands to configure your project rather than manually edit `flow.json`.

Before you use this command, read about how to
[configure project contracts and deployment targets] with CLI commands.

:::

## Example usage

```shell
> flow project deploy --network=testnet

Deploying 2 contracts for accounts: my-testnet-account

NonFungibleToken -> 0x8910590293346ec4
KittyItems -> 0x8910590293346ec4

✨  All contracts deployed successfully
```

:::info

The `flow.json` configuration shown below is created automatically when you use CLI commands. You should use `flow config add contract` and `flow config add deployment` to configure your project rather than manually edit the file. See [Add Project Contracts] for details.

:::

Your `flow.json` file might look something like this:

```json
{
  ...
  "contracts": {
    "NonFungibleToken": "./cadence/contracts/NonFungibleToken.cdc",
    "KittyItems": "./cadence/contracts/KittyItems.cdc"
  },
  "deployments": {
    "testnet": {
      "my-testnet-account": ["KittyItems", "NonFungibleToken"]
    }
  },
  ...
}
```

Here's a sketch of the contract source files:

```cadence NonFungibleToken.cdc
access(all) contract NonFungibleToken {
  // ...
}
```

```cadence KittyItems.cdc
import "NonFungibleToken"

access(all) contract KittyItems {
  // ...
}
```

## Initialization arguments

To deploy contracts that take initialization arguments, you must add those arguments to the deployment configuration.

:::info

For basic deployments, use `flow config add deployment` to configure your contracts. Initialization arguments are an advanced feature that may require you to manually edit `flow.json` after the basic deployment is configured with CLI commands.

:::

You can specify each deployment as an object that contains
`name` and `args` keys that specify arguments to be
used during the deployment. Example:

```json
{
  "deployments": {
    "testnet": {
      "my-testnet-account": [
        "NonFungibleToken",
        {
          "name": "Foo",
          "args": [
            { "type": "String", "value": "Hello World" },
            { "type": "UInt32", "value": "10" }
          ]
        }
      ]
    }
  }
}
```

:::danger

⚠️ **Never** put raw private keys in `flow.json`. Always use `.pkey` files for key storage. Before you proceed, we recommend that you read the [Flow CLI security guidelines]
to learn about the best practices for private key storage.

## Dependency resolution

The `deploy` command attempts to resolve the import statements in all contracts being deployed.

After the dependencies are found, the CLI will deploy the contracts in a deterministic order such that no contract is deployed until all of its dependencies are deployed. The command will return an error if no such ordering exists due to one or more cyclic dependencies.

In the example above, `NonFungibleToken` will always be deployed before `KittyItems` since `KittyItems` imports `NonFungibleToken`.

## Address replacement

After it resolves all dependencies, the `deploy` command rewrites each contract so that its dependencies are imported from their _target addresses_ rather than their source file location.

The rewritten versions are then deployed to their respective targets, which leaves the original contract files unchanged.

### Contracts that import from other contracts

In the example above, the `KittyItems` contract would be rewritten like this:

```cadence KittyItems.cdc
import NonFungibleToken from 0xf8d6e0586b0a20c7

access(all) contract KittyItems {
  // ...
}
```

### Contracts that import from dependencies

When your contracts import from the `dependencies` section, the deploy command uses the network-specific aliases defined in those dependencies.

**Example `flow.json` with dependencies:**

```json
{
  "contracts": {
    "ExampleConnectors": {
      "source": "cadence/contracts/ExampleConnectors.cdc",
      "aliases": {
        "testing": "0000000000000007"
      }
    }
  },
  "dependencies": {
    "FlowToken": {
      "source": "mainnet://1654653399040a61.FlowToken",
      "hash": "cefb25fd19d9fc80ce02896267eb6157a6b0df7b1935caa8641421fe34c0e67a",
      "aliases": {
        "emulator": "0ae53cb6e3f42a79",
        "mainnet": "1654653399040a61",
        "testnet": "7e60df042a9c0868"
      }
    },
    "FungibleToken": {
      "source": "mainnet://f233dcee88fe0abe.FungibleToken",
      "hash": "23c1159cf99b2b039b6b868d782d57ae39b8d784045d81597f100a4782f0285b",
      "aliases": {
        "emulator": "ee82856bf20e2aa6",
        "mainnet": "f233dcee88fe0abe",
        "testnet": "9a0766d93b6608b7"
      }
    }
  },
  "deployments": {
    "testnet": {
      "testnet-account": ["ExampleConnectors"]
    }
  }
}
```

**Original contract source:**

```cadence ExampleConnectors.cdc
import "FungibleToken"
import "FlowToken"

access(all) contract ExampleConnectors {
  // ...
}
```

**Rewritten for testnet deployment:**

```cadence ExampleConnectors.cdc
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract ExampleConnectors {
  // ...
}
```

**Rewritten for mainnet deployment:**

```cadence ExampleConnectors.cdc
import FungibleToken from 0xf233dcee88fe0abe
import FlowToken from 0x1654653399040a61

access(all) contract ExampleConnectors {
  // ...
}
```

The deploy command automatically uses the addresses from the `dependencies` section's aliases for the target network. Notice how the addresses change based on the network—testnet uses `0x9a0766d93b6608b7` for `FungibleToken`, while mainnet uses `0xf233dcee88fe0abe`. Contracts in the `dependencies` section are not deployed—they're assumed to already exist on the network at the addresses specified in their aliases.

## Merge multiple configuration files

You can use the `-f` flag multiple times to merge several configuration files.

If there is an overlap in any of the fields in the configuration between two or more configuration files, the value of the overlapped field in the configuration that results will come from the configuration file that is on the further right order in the list of configuration files specified in the `-f` flag.

:::danger

**Never** put raw private keys in `flow.json`. Always use `.pkey` files for key storage.

:::

:::info

Use `flow config add account` to create accounts in your main `flow.json` file. The merging feature is useful to separate sensitive account information into a separate file that you can exclude from version control.

:::

**Example usage:**

```bash
flow project deploy -f flow.json -f private.json
```

**Example configuration files:**

```json flow.json
{
  "accounts": {
    "admin-account": {
      "address": "f8d6e0586b0a20c7",
      "key": {
        "type": "file",
        "location": "admin-account.pkey"
      }
    },
    "test-account": {
      "address": "f8d6e0586b0a20c8",
      "key": {
        "type": "file",
        "location": "test-account.pkey"
      }
    }
  }
}
```

```json private.json
{
  "accounts": {
    "admin-account": {
      "address": "f1d6e0586b0a20c7",
      "key": {
        "type": "file",
        "location": "admin-account-private.pkey"
      }
    }
  }
}
```

When you use multiple configuration files with overlapping fields, the rightmost file takes precedence.
In this example, the merged configuration that results will be:

```json
{
  "accounts": {
    "admin-account": {
      "address": "f1d6e0586b0a20c7",
      "key": {
        "type": "file",
        "location": "admin-account-private.pkey"
      }
    },
    "test-account": {
      "address": "f8d6e0586b0a20c8",
      "key": {
        "type": "file",
        "location": "test-account.pkey"
      }
    }
  }
}
```

**Security best practice:** Ensure `.pkey` files are added to `.gitignore` to prevent accidentally committing private keys to version control.

## Flags

### Allow updates

- Flag: `--update`
- Valid inputs: `true`, `false`
- Default: `false`

Indicate whether to overwrite and upgrade current contracts. The system will only overwrite contracts that are different from current contracts. 

### Show update diff

- Flag: `--show-diff`
- Valid inputs: `true`, `false`
- Default: `false`

Shows a diff to approve before an update between deployed contract and new contract updates.

### Host

- Flag: `--host`
- Valid inputs: an IP address or hostname.
- Default: `127.0.0.1:3569` (Flow Emulator)

Specify the hostname of the Access API that will be used to execute the command. This flag overrides any host defined by the `--network` flag.

### Network key

- Flag: `--network-key`
- Valid inputs: A valid network public key of the host in hex string format

Specify the network public key of the Access API that will be used to create a secure GRPC client when executing the command.

### Network

- Flag: `--network`
- Short Flag: `-n`
- Valid inputs: the name of a network defined in the configuration (`flow.json`)
- Default: `emulator`

Specify which network you want the command to use for execution.

### Filter

- Flag: `--filter`
- Short Flag: `-x`
- Valid inputs: a case-sensitive name of the result property.

Specify any property name from the result you want to return as the only value.

### Output

- Flag: `--output`
- Short Flag: `-o`
- Valid inputs: `json`, `inline`

Specify the format of the command results.

### Save

- Flag: `--save`
- Short Flag: `-s`
- Valid inputs: a path in the current filesystem.

Specify the filename where you want the result to be saved

### Log

- Flag: `--log`
- Short Flag: `-l`
- Valid inputs: `none`, `error`, `debug`
- Default: `info`

Specify the log level. Control how much output you want to see during command execution.

### Configuration

- Flag: `--config-path`
- Short Flag: `-f`
- Valid inputs: a path in the current filesystem.
- Default: `flow.json`

Specify the path to the `flow.json` configuration file.
You can use the `-f` flag multiple times to merge
several configuration files.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.

<!-- Relative links, will not render on page -->

[configure project contracts and deployment targets]: ./project-contracts.md
[Add Project Contracts]: ./project-contracts.md
[Flow CLI security guidelines]: ../flow.json/security.md