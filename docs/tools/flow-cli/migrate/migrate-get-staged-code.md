---
title: Get staged Cadence 1.0 Contract Code
description: How to get staged Cadence 1.0 contract code from the command line
sidebar_position: 5
---

Get the staged contract code from a contract thats been correctly staged.

```shell
flow migrate staged_code <contract_name>
```

## Example Usage

```
>
flow migrate staged_code HelloWorld --network=testnet

Attempts to return the contract code of HelloWorld on the Testnet network.

```

## Arguments

### Contract Name

- Name: `contract_name`
- Valid Input: Existing contract name in `flow.json`.
