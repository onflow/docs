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

### Generate Usage

```shell
# Generate FLIX json file using cadence transaction or script, this example is not using a prefilled json file so will not have associated message metadata 
flow flix generate cadence/transactions/update-helloworld.cdc --save cadence/templates/update-helloworld.template.json
```

Example of Cadence simple, no metadata associated
```cadence
import "HelloWorld"
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
    "f_version": "1.0.0",
    "id": "f5873ad5c845458619f2781e085a71d03ed9e8685ca6e1cfff8e139645227360",
    "data": {
        "type": "transaction",
        "interface": "",
        "messages": {},
        "cadence": "import HelloWorld from 0xHelloWorld\ntransaction(greeting: String) {\n\n  prepare(acct: AuthAccount) {\n    log(acct.address)\n  }\n\n  execute {\n    HelloWorld.updateGreeting(newGreeting: greeting)\n  }\n}\n",
        "dependencies": {
            "0xHelloWorld": {
                "HelloWorld": {
                    "testnet": {
                        "address": "0xa58395c2f736c46e",
                        "fq_address": "A.a58395c2f736c46e.HelloWorld",
                        "contract": "HelloWorld",
                        "pin": "82d8fb62ec356884316c28388630b9acb6ba5027d566efe0d2adff2c6e74b4dc",
                        "pin_block_height": 132414699
                    }
                }
            }
        },
        "arguments": {
            "greeting": {
                "index": 0,
                "type": "String",
                "messages": {},
                "balance": ""
            }
        }
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
    "f_version": "1.0.0",
    "id": "",
    "data": {
        "type": "transaction",
        "interface": "",
        "messages": {
            "title": {
                "i18n": {
                    "en-US": "Update Greeting"
                }
            },
            "description": {
                "i18n": {
                    "en-US": "Update greeting of the HelloWorld smart contract"
                }
            }
        },
        "cadence": "",
        "dependencies": {},
        "arguments": {
            "greeting": {
                "messages": {
                    "title": {
                        "i18n": {
                            "en-US": "Greeting"
                        }
                    },
                    "description": {
                        "i18n": {
                            "en-US": "HelloWorld contract greeting"
                        }
                    }
                }
            }
        }
    }
}

```

Example of generated output using prefilled json

```json
{
    "f_type": "InteractionTemplate",
    "f_version": "1.0.0",
    "id": "7238aed3ce8588ba3603d7a0ad79bf3aa1f7848618a61ae93d6865aff15387b2",
    "data": {
        "type": "transaction",
        "interface": "",
        "messages": {
            "title": {
                "i18n": {
                    "en-US": "Update Greeting"
                }
            },
            "description": {
                "i18n": {
                    "en-US": "Update greeting of the HelloWorld smart contract"
                }
            }
        },
        "cadence": "import HelloWorld from 0xHelloWorld\ntransaction(greeting: String) {\n\n  prepare(acct: AuthAccount) {\n    log(acct.address)\n  }\n\n  execute {\n    HelloWorld.updateGreeting(newGreeting: greeting)\n  }\n}\n",
        "dependencies": {
            "0xHelloWorld": {
                "HelloWorld": {
                    "testnet": {
                        "address": "0xa58395c2f736c46e",
                        "fq_address": "A.a58395c2f736c46e.HelloWorld",
                        "contract": "HelloWorld",
                        "pin": "82d8fb62ec356884316c28388630b9acb6ba5027d566efe0d2adff2c6e74b4dc",
                        "pin_block_height": 132414700
                    }
                }
            }
        },
        "arguments": {
            "greeting": {
                "index": 0,
                "type": "String",
                "messages": {
                    "title": {
                        "i18n": {
                            "en-US": "Greeting"
                        }
                    },
                    "description": {
                        "i18n": {
                            "en-US": "HelloWorld contract greeting"
                        }
                    }
                },
                "balance": ""
            }
        }
    }
}

```

### Package

Queries can be a FLIX `id`, `name`, `url` or `path` to a local FLIX file. This command leverages [FCL](../clients/fcl-js/) which will execute FLIX cadence code. 

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
[documented here](../../cadence/json-cadence-spec.md).

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

