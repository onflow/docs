---
title: Deploy a Contract
sidebar_position: 3
---

Deploy a new contract to a Flow account using the Flow CLI.   

```shell
flow accounts add-contract <filename> [<argument> <argument>...] [flags]
```

⚠️  Deprecation notice: using name argument in adding contract command will be deprecated soon.
```shell
flow accounts add-contract <name> <filename> [<argument> <argument>...] [flags]
```

## Example Usage

```shell
> flow accounts add-contract ./FungibleToken.cdc

Contract 'FungibleToken' deployed to the account 0xf8d6e0586b0a20c7

Address	 0xf8d6e0586b0a20c7
Balance	 99999999999.70000000
Keys	 1

Key 0	Public Key		 640a5a359bf3536d15192f18d872d57c98a96cb871b92b70cecb0739c2d5c37b4be12548d3526933c2cda9b0b9c69412f45ffb6b85b6840d8569d969fe84e5b7
	Weight			 1000
	Signature Algorithm	 ECDSA_P256
	Hash Algorithm		 SHA3_256
	Revoked 		 false
	Sequence Number 	 6
	Index 			 0

Contracts Deployed: 1
Contract: 'FungibleToken'
```
**Testnet Example**
```
> flow accounts add-contract ./FungibleToken.cdc --signer alice --network testnet

Contract 'FungibleToken' deployed to the account 0xf8d6e0586b0a20c7

Address	 0xf8d6e0586b0a20c7
Balance	 99999999999.70000000
Keys	 1

Key 0	Public Key		 640a5a359bf3536d15192f18d872d57c98a96cb871b92b70cecb0739c2d5c37b4be12548d3526933c2cda9b0b9c69412f45ffb6b85b6840d8569d969fe84e5b7
	Weight			 1000
	Signature Algorithm	 ECDSA_P256
	Hash Algorithm		 SHA3_256
	Revoked 		 false
	Sequence Number 	 6
	Index 			 0

Contracts Deployed: 1
Contract: 'FungibleToken'
```
*Make sure alice account is defined in flow.json*

## Arguments

### Name

- Name: `name`
- Valid inputs: any string value.

Name of the contract as it is defined in the contract source code.

⚠️  Deprecation notice: use filename argument only, no need to use name argument.

### Filename

- Name: `filename`
- Valid inputs: a path in the current filesystem.

Path to the file containing the contract source code.

### Arguments
- Name: `argument`
- Valid inputs: valid [cadence values](https://cadencelang.dev/docs/1.0/json-cadence-spec)
  matching argument type in transaction code.

Input arguments values matching corresponding types in the source code and passed in the same order.

Example:
```shell
> flow accounts add-contract ./contract.cdc Hello 2
```
Transaction code:
```
access(all) contract HelloWorld {
    init(a:String, b:Int) {
    }
}
```

## Flags

### Signer

- Flag: `--signer`
- Valid inputs: the name of an account defined in the configuration (`flow.json`)

Specify the name of the account that will be used to sign the transaction.

### Arguments JSON

- Flag: `--args-json`
- Valid inputs: arguments in JSON-Cadence form.
- Example: `flow accounts add-contract ./tx.cdc '[{"type": "String", "value": "Hello"}]'`

Arguments passed to the Cadence transaction in Cadence JSON format.
Cadence JSON format contains `type` and `value` keys and is
[documented here](https://cadencelang.dev/docs/1.0/json-cadence-spec).

### Include Fields

- Flag: `--include`
- Valid inputs: `contracts`

Specify fields to include in the result output. Applies only to the text output.


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
- Valid inputs: the name of a network defined in the configuration (`flow.json`).
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
