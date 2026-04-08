---
title: Add Project Contracts
description: How to define and configure Cadence contracts for Flow projects using Flow CLI commands
sidebar_position: 2
---

## Generate a Contract

Create a new contract file with the Flow CLI:

```bash
flow generate contract Foo
```

This command creates `cadence/contracts/Foo.cdc` with a basic contract template and automatically adds it to your `flow.json` configuration.

## Add a contract to configuration

If you have a contract file, add it to your project configuration with the CLI:

```bash
flow config add contract
```

Follow the interactive prompts:

1. **Contract name**: Enter the contract name (for exxample, `Foo`)
2. **Contract filename**: Enter the path to your contract file (for example, `./cadence/contracts/Foo.cdc`)
3. **Add aliases**: Optionally add network aliases for dependencies

You can also use flags to specify all details at once:

```bash
flow config add contract \
  --name Foo \
  --filename ./cadence/contracts/Foo.cdc
```

**What gets added to `flow.json`:**

```json
{
  "contracts": {
    "Foo": "./cadence/contracts/Foo.cdc"
  }
}
```

## Configure contract deployment targets

After a contract is added to your configuration, configure deployment targets with the CLI:

```bash
flow config add deployment
```

Follow the interactive prompts:

1. **Network**: Select the network (for example, `testnet`, `mainnet`, `emulator`)
2. **Account**: Select the account to deploy to (for example, `my-testnet-account`)
3. **Contract**: Select the contract to deploy (for example, `Foo`)
4. **Deploy more contracts**: Choose `yes` to add additional contracts to the same deployment

You can also use flags to specify all details:

```bash
flow config add deployment \
  --network testnet \
  --account my-testnet-account \
  --contract Foo
```

**What gets added to `flow.json`:**

```json
{
  "deployments": {
    "testnet": {
      "my-testnet-account": ["Foo"]
    }
  }
}
```

## Add multiple contracts to a deployment

To deploy multiple contracts to the same account, run the deployment configuration command multiple times or use the interactive prompt to add more contracts:

```bash
flow config add deployment --network testnet --account my-testnet-account --contract Bar
```

This adds `Bar` to the existing deployment:

```json
{
  "deployments": {
    "testnet": {
      "my-testnet-account": ["Foo", "Bar"]
    }
  }
}
```

## Remove contracts and deployments

Remove contracts or deployments using the CLI:

```bash
# Remove a contract from configuration
flow config remove contract Foo

# Remove a contract from a specific deployment
flow config remove deployment testnet my-testnet-account Foo
```

## Best Practices

- **Use CLI commands**: Always use `flow config add` and `flow config remove` rather than manually edit `flow.json`
- **Generate contracts**: Use `flow generate contract` to create new contracts with proper structure
- **Verify configuration**: Use `flow accounts list` and check your `flow.json` to verify your configuration
- **Network-specific deployments**: Configure separate deployments for each network (emulator, testnet, mainnet)

For more information, see [Manage Configuration] and [Production Deployment].

<!-- Relative links, will not render on page -->

[Manage Configuration]: ../flow.json/manage-configuration.md
[Production Deployment]: ../../../../blockchain-development-tutorials/cadence/getting-started/production-deployment.md