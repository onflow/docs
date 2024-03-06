---
title: Unstaging a 1.0 Contract
description: How to unstage a Cadence 1.0 supported Contract from the command line
sidebar_position: 2
---

Unstage a Cadence 1.0 supported contract project using the Flow CLI.

```shell
flow migrate unstage-contract <contract_name>
```

## Example Usage

```
>
flow migrate unstage-contract HelloWorld --network=testnet

Attempts to the unstage the contract `HelloWorld` from the Testnet network.

```

## Arguments

### Contract Name

- Name: `contract_name`
- Valid Input: Existing contract name in `flow.json`.
