---
title: Build a Transaction
description: How to build a Flow transaction from the command line
sidebar_position: 3
---

The Flow CLI provides a command to build a transactions with options to specify
authorizer accounts, payer account and proposer account. 

The `build` command doesn't produce any signatures and instead
is designed to be used with the `sign` and `send-signed` commands. 

Use this functionality in the following order:
1. Use this command (`build`) to build the transaction.
2. Use the `sign` command to sign with each account specified in the build process.
3. Use the `send-signed` command to submit the signed transaction to the Flow network.

```shell
flow transactions build <code filename> [<argument> <argument>...] [flags]
```

## Example Usage

```shell
> flow transactions build ./transaction.cdc "Meow" \
  --authorizer alice \
  --proposer bob \
  --payer charlie \
  --filter payload --save built.rlp

ID		e8c0a69952fbe50a66703985e220307c8d44b8fa36c76cbca03f8c43d0167847
Payer		e03daebed8ca0615
Authorizers	[f3fcd2c1a78f5eee]

Proposal Key:	
    Address	179b6b1cb6755e31
    Index	0
    Sequence	1

No Payload Signatures

No Envelope Signatures


Arguments (1):
    - Argument 0: {"type":"String","value":"Meow"}


Code

transaction(greeting: String) {
  let guest: Address

  prepare(authorizer: &Account) {
    self.guest = authorizer.address
  }

  execute {
    log(greeting.concat(",").concat(self.guest.toString()))
  }
}


Payload:
f9013df90138b8d17472616e...73616374696f6e286eeec0c0
```

JSON arguments from a file example:
```shell
> flow transactions build tx1.cdc --args-json "$(cat args.json)"
```

## Arguments

### Code Filename

- Name: `filename`
- Valid inputs: Any filename and path valid on the system.

The first argument is a path to a Cadence file containing the
transaction to be executed.

### Arguments
- Name: `argument`
- Valid inputs: valid [cadence values](https://cadencelang.dev/docs/1.0/json-cadence-spec)
  matching argument type in transaction code.

Input arguments values matching corresponding types in the source code and passed in the same order.
For passing complex argument values see [send transaction](./send-transactions.md#example-usage) document. 

## Flags

### Payer

- Flag: `--payer`
- Valid Inputs: Flow address or account name from configuration.
- Default: service account

Specify account address that will be paying for the transaction.
Read more about payers [here](../../../build/basics/transactions.md).

### Proposer

- Flag: `--proposer`
- Valid inputs: Flow address or account name from configuration.
- Default: service account

Specify a name of the account that is proposing the transaction.
Account must be defined in flow configuration.

### Proposer Key Index

- Flag: `--proposer-key-index`
- Valid inputs: number of existing key index
- Default: 0

Specify key index for the proposer account.

### Authorizer

- Flag: `--authorizer`
- Valid Inputs: Flow address or account name from configuration.
- Default: service account

Additional authorizer addresses to add to the transaction.
Read more about authorizers [here](../../../build/basics/transactions.md).

### Arguments JSON

- Flag: `--args-json`
- Valid inputs: arguments in JSON-Cadence form.
- Example: `flow transactions build ./tx.cdc '[{"type": "String", "value": "Hello World"}]'`

Arguments passed to the Cadence transaction in Cadence JSON format.
Cadence JSON format contains `type` and `value` keys and is
[documented here](https://cadencelang.dev/docs/1.0/json-cadence-spec).

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
used to execute the commands.

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

### Include Fields

- Flag: `--include`
- Valid inputs: `code`, `payload`, `signatures`

Specify fields to include in the result output. Applies only to the text output.

### Filter

- Flag: `--filter`
- Short Flag: `-x`
- Valid inputs: case-sensitive name of the result property.

Specify any property name from the result you want to return as the only value.

### Output

- Flag: `--output`
- Short Flag: `-o`
- Valid inputs: `json`, `inline`

Specify in which format you want to display the result.

### Save

- Flag: `--save`
- Short Flag: `-s`
- Valid inputs: valid filename

Specify the filename where you want the result to be saved.

### Log

- Flag: `--log`
- Short Flag: `-l`
- Valid inputs: `none`, `error`, `debug`
- Default: `info`

Specify the log level. Control how much output you want to see while command execution.

### Configuration

- Flag: `--config-path`
- Short Flag: `-f`
- Valid inputs: valid filename

Specify a filename for the configuration files, you can provide multiple configuration
files by using `-f` flag multiple times.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.

