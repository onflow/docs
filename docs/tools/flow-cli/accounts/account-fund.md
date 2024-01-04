---
title: Funding a Testnet Account
description: How to fund a Testnet Flow account from the command line
sidebar_position: 7
---

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

Flow [account address](../../../build/basics/accounts.md) (prefixed with `0x` or not).
