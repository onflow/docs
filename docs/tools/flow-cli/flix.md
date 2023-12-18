---
title: Flow Interaction Templates (FLIX)
sidebar_label: Flow Interaction Templates (FLIX)
description: Flow Interaction Templates (FLIX) via the CLI
sidebar_position: 12
---
## Introduction

The Flow CLI provides a `flix` command with a few sub commands `execute` and `package`. Get familiar with Flow Interaction Templates [(FLIX)](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md). FLIX are a standard for distributing Cadence scripts and transactions, and metadata in a way that is consumable by tooling and wallets. FLIX can be audited for correctness and safety by auditors in the ecosystem.

```shell
>flow flix
execute, generate, package

Usage:
  flow flix [command]

Available Commands:
  execute     execute FLIX template with a given id, name, local filename, or url
  generate    generate FLIX json template given local Cadence filename
  package     package file for FLIX template fcl-js is default  


```

### Execute

The Flow CLI provides a `flix` command to `execute` FLIX. The Cadence being execute in the FLIX can be a transaciton or script.

```shell
flow flix execute <query> [<argument> <argument>...] [flags]
```

:::warning

A FLIX template might only support testnet and/or mainnet. Generally, emulator is not supported. This can be the case if the FLIX template relies on contract dependencies.  

:::


Queries can be a FLIX `id`, `name`, `url` or `path` to a local FLIX file.

### Execute Usage

```shell
# Execute a FLIX transaction by name on Testnet
flow flix execute transfer-flow 5.0 "0x123" --network testnet --signer "testnet-account"
```

```shell
# Execute a FLIX script by id on Testnet
flow flix execute bd10ab0bf472e6b58ecc0398e9b3d1bd58a4205f14a7099c52c0640d9589295f --network testnet
```

```shell
# Execute a local FLIX script by path on Testnet
flow flix execute ./multiply.template.json 2 3 --network testnet
```

The Flow CLI provides a `flix` command to `package` up generated plain and simple JavaScript. This JavaScript uses FCL (Flow Client Library) to call the cadence the Flow Interaction Templates (FLIX) is based on. 

<Callout type="info">
Currently, `flix package` command only supports generating FCL (Flow Client Library) specific JavaScript, there are plans to support other languages like golang.
</Callout>


```shell
flow flix package <query> [flags]
```

### Generate

Generate FLIX json file. This command will take in a Cadence file and produce a FLIX json file. There are two ways to provide metadata to populate the FLIX json structure. 
 - Use `--pre-fill` flag to pass in a pre populated FLIX json structure

:::warning

When generating a FLIX template, make sure all contract dependencies have been deployed to the supported networks. Add any aliases to your flow.json that will be needed to populate dependencies. Verify all depenencies have been populated after generating.

:::


### Generate Usage

```shell
# Generate FLIX json file using cadence transaction or script, this example is not using a prefilled json file so will not have associated message metadata 
flow flix generate cadence/transactions/update-helloworld.cdc --save cadence/templates/update-helloworld.template.json
```

Example of Cadence simple, no metadata associated
```cadence
#interaction(
    version: "1.1.0",
    title: "Get Gretting",
    description: "Call HelloWorld contract to get greeting",
    language: "en-US",    
)

import "HelloWorld"
pub fun main(): String {
  return HelloWorld.greeting
}
```

### Cadence Doc Pragma
It's recommended to use pragma to set the metadata for the script or transaction. Here is an example where a parameter is described. `parameters` is an array of `Parameter` in the order of the parameters passed into the transaction or script.

```cadence

import "HelloWorld"

#interaction (
  version: "1.1.0",
	title: "Update Greeting",
	description: "Update the greeting on the HelloWorld contract",
	language: "en-US",
	parameters: [
		Parameter(
			name: "greeting", 
			title: "Greeting", 
			description: "The greeting to set on the HelloWorld contract"
		)
	],
)
transaction(greeting: String) {

  prepare(acct: AuthAccount) {
    log(acct.address)
  }

  execute {
    HelloWorld.updateGreeting(newGreeting: greeting)
  }
}



```


Resulting json when no prefill json is used
```json
{
    "f_type": "InteractionTemplate",
    "f_version": "1.1.0",
    "id": "fd9abd34f51741401473eb1cf676b105fed28b50b86220a1619e50d4f80b0be1",
    "data": {
        "type": "script",
        "interface": "",
        "messages": [
            {
                "key": "title",
                "i18n": [
                    {
                        "tag": "en-US",
                        "translation": "Get Gretting"
                    }
                ]
            },
            {
                "key": "description",
                "i18n": [
                    {
                        "tag": "en-US",
                        "translation": "Call HelloWorld contract to get greeting"
                    }
                ]
            }
        ],
        "cadence": {
            "body": "#interaction(\n    version: \"1.1.0\",\n    title: \"Get Gretting\",\n    description: \"Call HelloWorld contract to get greeting\",\n    language: \"en-US\",    \n)\n\nimport \"HelloWorld\"\npub fun main(): String {\n  return HelloWorld.greeting\n}\n",
            "network_pins": [
                {
                    "network": "testnet",
                    "pin_self": "41c4c25562d467c534dc92baba92e0c9ab207628731ee4eb4e883425abda692c"
                }
            ]
        },
        "dependencies": [
            {
                "contracts": [
                    {
                        "contract": "HelloWorld",
                        "networks": [
                            {
                                "network": "testnet",
                                "address": "0xe15193734357cf5c",
                                "dependency_pin_block_height": 137864533,
                                "dependency_pin": {
                                    "pin": "aad46badcab3caaeb4f0435625f43e15bb4c15b1d55c74a89e6f04850c745858",
                                    "pin_self": "a06b3cd29330a3c22df3ac2383653e89c249c5e773fd4bbee73c45ea10294b97",
                                    "pin_contract_name": "HelloWorld",
                                    "pin_contract_address": "0xe15193734357cf5c",
                                    "imports": []
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "parameters": null
    }
}
```

```shell
# Generate FLIX json file using cadence transaction or script passing in a pre filled FLIX json file. The json file will get filled out by the `flow flix generate` command
flow flix generate cadence/scripts/read-helloworld.cdc --pre-fill cadence/templates/read-helloworld.prefill.json --save cadence/templates/read-helloworld.template.json
```
Example of json prefill file with message metadata
```json
{
    "f_type": "InteractionTemplate",
    "f_version": "1.1.0",
    "id": "",
    "data": {
        "type": "transaction",
        "interface": "",
        "messages": [
            {
                "key": "title",
                "i18n": [
                    {
                        "tag": "en-US",
                        "translation": "Update Greeting"
                    }
                ]
            },
            {
                "key": "description",
                "i18n": [
                    {
                        "tag": "en-US",
                        "translation": "Update the greeting on the HelloWorld contract"
                    }
                ]
            }
        ],
        "cadence": {},
        "dependencies": [],
         "parameters": [
            {
                "label": "greeting",
                "index": 0,
                "type": "String",
                "messages": [
                    {
                        "key": "title",
                        "i18n": [
                            {
                                "tag": "en-US",
                                "translation": "Greeting"
                            }
                        ]
                    },
                    {
                        "key": "description",
                        "i18n": [
                            {
                                "tag": "en-US",
                                "translation": "The greeting to set on the HelloWorld contract"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

```

Example of generated output using prefilled json

```json
{
    "f_type": "InteractionTemplate",
    "f_version": "1.1.0",
    "id": "a641017b01f75e1d7b5c53414fbef824ed7410312667b9dd2bea3a9c4fa67a32",
    "data": {
        "type": "transaction",
        "interface": "",
        "messages": [
            {
                "key": "title",
                "i18n": [
                    {
                        "tag": "en-US",
                        "translation": "Update Greeting"
                    }
                ]
            },
            {
                "key": "description",
                "i18n": [
                    {
                        "tag": "en-US",
                        "translation": "Update the greeting on the HelloWorld contract"
                    }
                ]
            }
        ],
        "cadence": {
            "body": "import \"HelloWorld\"\n\n)\ntransaction(greeting: String) {\n\n  prepare(acct: AuthAccount) {\n    log(acct.address)\n  }\n\n  execute {\n    HelloWorld.updateGreeting(newGreeting: greeting)\n  }\n}\n",
            "network_pins": [
                {
                    "network": "testnet",
                    "pin_self": "f61e68b5ba6987aaee393401889d5410b01ffa603a66952307319ea09fd505e7"
                }
            ]
        },
        "dependencies": [
            {
                "contracts": [
                    {
                        "contract": "HelloWorld",
                        "networks": [
                            {
                                "network": "testnet",
                                "address": "0xe15193734357cf5c",
                                "dependency_pin_block_height": 139542222,
                                "dependency_pin": {
                                    "pin": "85d9d00534d0de99a8dea3ac9dfb4852fcde236ceef0c32fdcec805b71c74796",
                                    "pin_self": "a06b3cd29330a3c22df3ac2383653e89c249c5e773fd4bbee73c45ea10294b97",
                                    "pin_contract_name": "HelloWorld",
                                    "pin_contract_address": "0xe15193734357cf5c",
                                    "imports": []
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "parameters": [
            {
                "label": "greeting",
                "index": 0,
                "type": "String",
                "messages": [
                    {
                        "key": "title",
                        "i18n": [
                            {
                                "tag": "en-US",
                                "translation": "Greeting"
                            }
                        ]
                    },
                    {
                        "key": "description",
                        "i18n": [
                            {
                                "tag": "en-US",
                                "translation": "The greeting to set on the HelloWorld contract"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

```

### Package

Queries can be a FLIX `url` or `path` to a local FLIX file. This command leverages [FCL](../clients/fcl-js/) which will execute FLIX cadence code. Package files can be generated in JavaScript or TypeScript. 

:::warning
Currently package doesn't support `id`, `name` flix query.
:::

### Package Usage

```shell
# Generate packaged code that leverages FCL to call the Cadence transaction code, `--save` flag will save the output to a specific file
flow flix package transfer-flow --save ./package/transfer-flow.js
```

```shell
# Geneate package code for a FLIX script using id, since there is no saving file, the result will display in terminal
flow flix package bd10ab0bf472e6b58ecc0398e9b3d1bd58a4205f14a7099c52c0640d9589295f 
```

```shell
# Generate package code using local template file to save in a local file 
flow flix package ./multiply.template.json --save ./multiply.js
```

```shell
# Generate package code using local template file to save in a local typescript file 
flow flix package ./multiply.template.json --lang ts --save ./multiply.ts 
```


### Example Package Output
```shell
flow flix package transfer-flow
```

```javascript

/**
    This binding file was auto generated based on FLIX template v1.0.0. 
    Changes to this file might get overwritten.
    Note fcl version 1.3.0 or higher is required to use templates. 
**/

import * as fcl from "@onflow/fcl"
const flixTemplate = "transfer-flow"

/**
* Transfer tokens from one account to another
* @param {Object} Parameters - parameters for the cadence
* @param {string} Parameters.amount - The amount of FLOW tokens to send: UFix64
* @param {string} Parameters.to - The Flow account the tokens will go to: Address
* @returns {Promise<string>} - returns a promise which resolves to the transaction id
*/
export async function transferTokens({amount, to}) {
  const transactionId = await fcl.mutate({
    template: flixTemplate,
    args: (arg, t) => [arg(amount, t.UFix64), arg(to, t.Address)]
  });

  return transactionId
}
```

```shell
# Generate TypeScript version of package file 
flow flix package https://flix.flow.com/v1/templates?name=transfer-flow --lang ts
```

```typescript

/**
    This binding file was auto generated based on FLIX template v1.1.0. 
    Changes to this file might get overwritten.
    Note fcl version 1.9.0 or higher is required to use templates. 
**/

import * as fcl from "@onflow/fcl"
const flixTemplate = "https://flix.flow.com/v1/templates?name=transfer-flow"

interface TransferTokensParams {
  amount: string; // The amount of FLOW tokens to send
  to: string; // The Flow account the tokens will go to
}

/**
* transferTokens: Transfer tokens from one account to another
* @param string amount - The amount of FLOW tokens to send
* @param string to - The Flow account the tokens will go to
* @returns {Promise<string>} - Returns a promise that resolves to the transaction ID
*/
export async function transferTokens({amount, to}: TransferTokensParams): Promise<string> {
  const transactionId = await fcl.mutate({
    template: flixTemplate,
    args: (arg, t) => [arg(amount, t.UFix64), arg(to, t.Address)]
  });

  return transactionId
}

```
:::Warning
Notice that fcl v1.9.0 is needed to use FLIX v1.1 templates
:::

## Resources

To find out more about FLIX, see the [read the FLIP](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md).

For a list of all templates, check out the [FLIX template repository](https://github.com/onflow/flow-interaction-template-service/tree/master/templates).

To generate a FLIX, see the [FLIX CLI readme](https://github.com/onflow/flow-interaction-template-tools/tree/master/cli).

## Arguments
- Name: `argument`
- Valid input: valid [FLIX](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md)  

Input argument value matching corresponding types in the source code and passed in the same order.
You can pass a `nil` value to optional arguments by executing the flow FLIX execute script like this: `flow flix execute template.json nil`.

## Flags

### Arguments JSON

- Flag: `--args-json`
- Valid inputs: arguments in JSON-Cadence form.
- Example: `flow flix execute template.script.json '[{"type": "String", "value": "Hello World"}]'`

Arguments passed to the Cadence script in the Cadence JSON format.
Cadence JSON format contains `type` and `value` keys and is 
[documented here](../../build/cadence-reference/json-cadence-spec.md).

## Pre Fill

- Flag: `--pre-fill`
- Valid inputs: a json file in the FLIX json structure [FLIX json format](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md)


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

