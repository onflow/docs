---
title: Execute Flow Interaction Templates (FLIX) with the Flow CLI
sidebar_title: Execute FLIX
description: How to execute Flow Interaction Templates (FLIX) on Flow from the command line
sidebar_position: 12
---

The Flow CLI provides a command to execute Flow Interaction Templates (FLIX). FLIX are an easy way to interact with Flow. They are a standard for distributing Cadence scripts and transactions, and metadata about them, in a way that is consumable by tooling and wallets. FLIX are audited for correctness and safety by an ecosystem of auditors.

```shell
flow flix <query> [<argument> <argument>...] [flags]
```

Queries can be a FLIX id, name, or path to a local FLIX file.

## Example Usage

```shell
# Execute a FLIX transaction by name on Testnet
flix flow transfer-flow 5.0 "0x123" --network testnet --signer "testnet-account"
```

```shell
# Execute a FLIX script by id on Testnet
flow flix bd10ab0bf472e6b58ecc0398e9b3d1bd58a4205f14a7099c52c0640d9589295f --network testnet
```

```shell
# Execute a local FLIX script by path on Testnet
flow flix ./multiply.template.json 2 3 --network testnet`
```

## Resources

To find out more about FLIX, see the [read the FLIP](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md).

For a list of all templates, check out the [FLIX template repository](https://github.com/onflow/flow-interaction-template-service/tree/master/templates).

To generate a FLIX, see the [FLIX CLI readme](https://github.com/onflow/flow-interaction-template-tools/tree/master/cli).

## Arguments
- Name: `argument`
- Valid inputs: valid [cadence values](../../../../cadence/json-cadence-spec.md)
  matching argument type in script code.

Input arguments values matching corresponding types in the source code and passed in the same order.
You can pass a `nil` value to optional arguments by executing the flow script like this: `flow scripts execute script.cdc nil`.

## Flags

### Arguments JSON

- Flag: `--args-json`
- Valid inputs: arguments in JSON-Cadence form.
- Example: `flow scripts execute script.cdc '[{"type": "String", "value": "Hello World"}]'`

Arguments passed to the Cadence script in the Cadence JSON format.
Cadence JSON format contains `type` and `value` keys and is 
[documented here](../../../../cadence/json-cadence-spec.md).

## Block Height

- Flag: `--block-height`
- Valid inputs: a block height number

## Block ID

- Flag: `--block-id`
- Valid inputs: a block ID

### Signer

- Flag: `--signer`
- Valid inputs: the name of an account defined in the configuration (`flow.json`)

Specify the name of the account that will be used to sign the transaction.

### Proposer

- Flag: `--proposer`
- Valid inputs: the name of an account defined in the configuration (`flow.json`)

Specify the name of the account that will be used as proposer in the transaction.

### Payer

- Flag: `--payer`
- Valid inputs: the name of an account defined in the configuration (`flow.json`)

Specify the name of the account that will be used as payer in the transaction.

### Authorizer

- Flag: `--authorizer`
- Valid inputs: the name of a single or multiple comma-separated accounts defined in the configuration (`flow.json`)

Specify the name of the account(s) that will be used as authorizer(s) in the transaction. If you want to provide multiple authorizers separate them using commas (e.g. `alice,bob`)

### Arguments JSON

- Flag: `--args-json`
- Valid inputs: arguments in JSON-Cadence form.
- Example: `flow transactions send ./tx.cdc '[{"type": "String", "value": "Hello World"}]'`

Arguments passed to the Cadence transaction in Cadence JSON format.
Cadence JSON format contains `type` and `value` keys and is 
[documented here](../../../../cadence/json-cadence-spec.md).

### Gas Limit

- Flag: `--gas-limit`
- Valid inputs: an integer greater than zero.
- Default: `1000`

Specify the gas limit for this transaction.

### Host

- Flag: `--host`
- Valid inputs: an IP address or hostname.
- Default: `127.0.0.1:3569` (Flow Emulator)

Specify the hostname of the Access API that will be
used to execute the command. This flag overrides
any host defined by the `--network` flag.

### Network Key

- Flag: `--network-key`
- Valid inputs: A valid network public key of the host in hex string format

Specify the network public key of the Access API that will be
used to create a secure GRPC client when executing the command.

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

