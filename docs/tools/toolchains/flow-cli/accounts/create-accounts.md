---
title: Create an Account
description: How to create a Flow account from the command line
sidebar_position: 2
---

The Flow CLI provides a command to submit an account creation 
transaction to any Flow Access API. There are two options how to create an account, you can use the 
interactive mode which guides you through the process and creates the account for you or by using 
the manual process which requires a pre-existing account on the network you chose.

## Interactive Mode
Creating the account in interactive mode prompts you for an account name and network selection. 
After you enter the required information the account will be created for you and saved to `flow.json`. 
If account creation is done on testnet or mainnet the account key will be saved to a separate key file, 
which will also be put in `.gitignore`. You can [read more about key security here](../flow.json/security.md).

💡 _Please note that the account creation process can take up to a minute so please be patient._

```shell
flow accounts create

Enter an account name: mike
✔ Testnet

🎉 New account created with address 0x77e6ae4c8c2f1dd6 and name mike on Testnet network.

Here’s a summary of all the actions that were taken:
 - Added the new account to flow.json.
 - Saved the private key to mike.pkey.
 - Added mike.pkey to .gitignore.
```

## Manual Mode
Manual mode requires you to have a pre-existing account on the network which you will have to provide as a signer. 
That account must be added to `flow.json` for the command to work. You also have to generate a key pair, we 
suggest using the `flow keys generate` command, [which you can read more about here](../keys/generate-keys.md).

```shell
# Create an account on Flow Testnet
> flow accounts create \
    --key a69c6986e846ba6d0....1397f5904cd319c3e01e96375d5777f1a47010 \
    --signer my-testnet-account 

Address	 0x01cf0e2f2f715450
Balance	 10000000
Keys	 1

Key 0	Public Key		 a69c6986e846ba6d0....1397f5904cd319c3e01e96375d5777f1a47010
	Weight			 1000
	Signature Algorithm	 ECDSA_P256
	Hash Algorithm		 SHA3_256

Contracts Deployed: 0
```

In the above example, the `flow.json` file would look something like this:

```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "a2c4941b5f3c7151",
      "key": "12c5dfde...bb2e542f1af710bd1d40b2"
    }
  }
}
```

## Flags
    
### Public Key

- Flag: `--key`
- Valid inputs: a hex-encoded public key in raw form.

Specify the public key that will be added to the new account
upon creation.

### Key Weight

- Flag: `--key-weight`
- Valid inputs: number between 0 and 1000
- Default: 1000

Specify the weight of the public key being added to the new account. 

When opting to use this flag, you must specify a `--key-weight` flag for each public `--key` flag provided.

### Public Key Signature Algorithm
    
- Flag: `--sig-algo`
- Valid inputs: `"ECDSA_P256", "ECDSA_secp256k1"`
- Default: `"ECDSA_P256"`

Specify the ECDSA signature algorithm for the provided public key.
This option can only be used together with the `--key` flag.

Flow supports the secp256k1 and P-256 curves.

### Public Key Hash Algorithm

- Flag: `--hash-algo`
- Valid inputs: `"SHA2_256", "SHA3_256"`
- Default: `"SHA3_256"`

Specify the hash algorithm that will be paired with the public key
upon account creation.

### Signer

- Flag: `--signer`
- Valid inputs: the name of an account defined in `flow.json`.

Specify the name of the account that will be used to sign the transaction
and pay the account creation fee.

### Contract

- Flag: `--contract`
- Valid inputs: String with format `name:filename`, where `name` is 
  name of the contract as it is defined in the contract source code
  and `filename` is the filename of the contract source code.

Specify one or more contracts to be deployed during account creation.

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