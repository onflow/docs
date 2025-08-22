---
title: Funding a Testnet Account
description: How to fund a Testnet Flow account from the command line
sidebar_position: 7
---

:::info

The [Flow Testnet Faucet](https://testnet-faucet.onflow.org/) allows users to create accounts and receive 1,000 Testnet FLOW tokens for testing and development purposes. You can also fund an existing Testnet accounts without needing to create one through the site, or through the CLI.

:::

Fund a valid Testnet Flow Account using the Flow CLI.

```shell
flow accounts fund <address>
```

## Example Usage

```
> flow accounts fund 8e94eaa81771313a

Opening the faucet to fund 0x8e94eaa81771313a on your native browser.

If there is an issue, please use this link instead: https://testnet-faucet.onflow.org/fund-account?address=8e94eaa81771313a

```

## Arguments

### Address

- Name: `address`
- Valid Input: Flow Testnet account address.

Flow [account address](../../../cadence/basics/accounts.md) (prefixed with `0x` or not).
