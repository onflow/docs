---
title: Execute a Script
description: How to execute a Cadence script on Flow from the command line
sidebar_position: 6
---

The Flow CLI provides a command to execute a Cadence script on the Flow execution state with any Flow Access API.

```shell
flow scripts execute <filename> [<argument> <argument>...] [flags]
```

## Example usage

```shell
# Execute a script on Flow Testnet
> flow scripts execute script.cdc "Hello" "World"

"Hello World"
```

Script source code:
```
access(all) fun main(greeting: String, who: String): String {
	return greeting.concat(" ").concat(who)
}
```

## Arguments

### Filename

- Name: `filename`
- Valid inputs: a path in the current filesystem.

The first argument is a path to a Cadence file that contains the 
script to be executed.

### Arguments

- Name: `argument`
- Valid inputs: valid [cadence values] that matches argument type in script code.

Input arguments values matching corresponding types in the source code and passed in the same order. To pass a `nil` value to optional arguments, you can execute the flow script like this: `flow scripts execute script.cdc nil`.

## Flags

### Arguments JSON

- Flag: `--args-json`
- Valid inputs: arguments in JSON-Cadence form.
- Example: `flow scripts execute script.cdc '[{"type": "String", "value": "Hello World"}]'`

Arguments passed to the Cadence script in the Cadence JSON format. Cadence JSON format contains `type` and `value` keys and is [documented here].

### Host

- Flag: `--host`
- Valid inputs: an IP address or hostname.
- Default: `127.0.0.1:3569` (Flow Emulator)

Specify the hostname of the Access API to use to execute the command. This flag overrides any host defined by the `--network` flag.

### Network key

- Flag: `--network-key`
- Valid inputs: A valid network public key of the host in hex string format

Specify the network public key of the Access API to use to create a secure GRPC client when you execute the command.

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

Specify the path to the `flow.json` configuration file. You can use the `-f` flag multiple times to merge several configuration files.

### Version Check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.

<!-- Reference-style links, will not render on page. -->

[documented here]: https://cadencelang.dev/docs/1.0/json-cadence-spec
[cadence values]: https://cadencelang.dev/docs/1.0/json-cadence-spec