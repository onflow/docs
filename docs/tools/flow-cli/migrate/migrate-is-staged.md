---
title: Check if a contract is staged
description: How to check if a contract has been properly staged from the command line
sidebar_position: 4
---

Check to see if a contract has been staged from the Flow CLI

```shell
flow migrate is_staged <contract_name>
```

## Example Usage

```
>
flow migrate is_staged HelloWorld --network=previewnet

Attempts to confirm if the contract has been staged on the Previewnet network.

```

## Arguments

### Contract Name

- Name: `contract_name`
- Valid Input: Existing contract name in `flow.json`.
