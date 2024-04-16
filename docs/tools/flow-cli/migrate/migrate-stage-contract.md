---
title: Staging a 1.0 Contract
description: How to stage a Cadence 1.0 supported Contract from the command line
sidebar_position: 1
---

Stage a Cadence 1.0 supported contract project using the Flow CLI.

```shell
flow migrate stage-contract <contract_name>
```

## Example Usage

```
> flow migrate stage-contract HelloWorld --network=testnet

Attempts to the stage the contract `HelloWorld` onto the Testnet network.

```

## Arguments

### Contract Name

- Name: `contract_name`
- Valid Input: Existing contract name in `flow.json`.
