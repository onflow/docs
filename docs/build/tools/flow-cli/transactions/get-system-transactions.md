---
title: Get a System Transaction
description: How to get a Flow system transaction from the command line
sidebar_position: 8
---

The Flow CLI provides a command to fetch the system transaction for a given block reference. You can optionally provide a transaction ID to target a specific system transaction within that block. If scheduled callbacks ran in that block, their effects and fee events may appear in the result.

```shell
flow transactions get-system <block_id|latest|block_height> [tx_id]
```

## Use cases

- System chunk transaction for protocol operations: see [Epoch Scripts and Events](../../../protocol/staking/05-epoch-scripts-events.md) and [Staking rewards via system chunk](../../../protocol/staking/08-staking-rewards.md).
- Transactions related to scheduled callbacks: see [Introduction to Scheduled Callbacks](https://developers.flow.com/blockchain-development-tutorials/flow-actions/scheduled-callbacks-introduction). Consider `--include fee-events` for callback fee details.

## Example Usage

```shell
> flow transactions get-system latest --network mainnet

Status		✅ SEALED
ID		40bc4b100c1930c61381c22e0f4c10a7f5827975ee25715527c1061b8d71e5aa
Payer		—
Authorizers	[]

Proposal Key:	—

No Payload Signatures
No Envelope Signatures

Events:		 
    Index	0
    Type	A.1654653399040a61.FlowToken.TokensDeposited
    Tx ID	40bc4b100c1930c61381c22e0f4c10a7f5827975ee25715527c1061b8d71e5aa
    Values
		- amount (UFix64):	0.00100000
		- to ({}?):		5068e27f275c546c

Code (hidden, use --include code)

Payload (hidden, use --include payload)
```

Select a specific system transaction within the block by ID:

```shell
> flow transactions get-system latest 07a8...b433 --network mainnet
```

## Arguments

### Block Reference

- Name: `<block_id|latest|block_height>`
- Valid Input: a block ID (hex), the keyword `latest`, or a block height (number).

The first argument is a reference to the block whose system transaction you want to fetch.

### Transaction ID (optional)

- Name: `[tx_id]`
- Valid Input: a transaction ID (hex).

Optionally narrow the result to a specific system transaction within the referenced block.

## Flags
    
### Include Fields

- Flag: `--include`
- Valid inputs: `code`, `payload`, `signatures`, `fee-events`

Specify fields to include in the result output. Applies only to the text output.

### Exclude Fields

- Flag: `--exclude`
- Valid inputs: `events`

Specify fields to exclude from the result output. Applies only to the text output.

### Host

- Flag: `--host`
- Valid inputs: an IP address or host address.
- Default: `127.0.0.1:3569` (Flow Emulator)

Specify the host address of the Access API that will be
used to execute the command. This flag overrides
any host defined by the `--network` flag.

### Network Key

- Flag: `--network-key`
- Valid inputs: A valid network public key of the host in hex string format

Specify the network public key of the Access API that will be
used to create secure client connections when executing the command.

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
- Valid inputs: a path in the current file system.

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
- Valid inputs: a path in the current file system.
- Default: `flow.json`

Specify the path to the `flow.json` configuration file.
You can use the `-f` flag multiple times to merge
several configuration files.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.

## Notes

System transactions currently cover:
- System chunk transactions used by protocol operations. See an overview of system chunks and service events: [Epoch Scripts and Events](../../../protocol/staking/05-epoch-scripts-events.md).
- Scheduled callbacks execution. Learn more: [Introduction to Scheduled Callbacks](https://developers.flow.com/blockchain-development-tutorials/flow-actions/scheduled-callbacks-introduction).

More resources:
- [Staking rewards via system chunk](../../../protocol/staking/08-staking-rewards.md)
- [Epoch schedule and system chunk transactions](../../../protocol/staking/03-schedule.md)
