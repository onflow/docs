---
title: Check if a contract has been validated
description: How to check if a contract has been validated from the command line
sidebar_position: 6
---

Returns whether this contract update passed the last emulated migration from the Flow CLI, validating the contained code.

```shell
flow migrate is_validated <contract_name>
```

## Example Usage

```
> flow migrate is_validated HelloWorld --network=testnet

Attempts to confirm if the contract has been validated on the Testnet network.

```

## Arguments

### Contract Name

- Name: `contract_name`
- Valid Input: Existing contract name in `flow.json`.
