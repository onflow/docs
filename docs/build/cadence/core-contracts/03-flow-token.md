---
title: Flow Token Contract
sidebar_position: 3
sidebar_label: Flow Token
description: Learn about the FLOW token smart contract, its implementation, events system, and deployment addresses across different networks. Understand how to interact with the native token of the Flow blockchain.
keywords:
  - FLOW token
  - Flow contract
  - token events
  - token transactions
  - token minting
  - token burning
  - core contracts
  - native token
  - Flow protocol
  - token implementation
  - token deployment
  - contract addresses
  - token initialization
  - Flow mainnet
  - Flow testnet
---

The `FlowToken` contract defines the FLOW network token.

Source: [FlowToken.cdc](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowToken.cdc)

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0x0ae53cb6e3f42a79` |
| Cadence Testing Framework | `0x0000000000000003` |
| Testnet                   | `0x7e60df042a9c0868` |
| Mainnet                   | `0x1654653399040a61` |

# Transactions

Transactions and scripts for `FlowToken` are in the `flow-core-contracts` [repo](https://github.com/onflow/flow-core-contracts/tree/master/transactions/flowToken).

As mentioned in the `FungibleToken` page, developers are encouraged to use
the generic token transactions in the `flow-ft` [repo](https://github.com/onflow/flow-ft/tree/master/transactions) instead.

# Events

Flow relies on a set of core contracts that define key portions of the Flow protocol. Those contracts are core contracts
and are made to emit the events documented below. You can read about the [core contracts here](./index.md)
and view their source code and event definitions.

Events emitted from core contracts follow a standard format:

```
A.{contract address}.{contract name}.{event name}
```

The components of the format are:

- `contract address` - the address of the account the contract has been deployed to
- `contract name` - the name of the contract in the source code
- `event name` - the name of the event as declared in the source code

### Flow Token Contract

Description of events emitted from the [FLOW Token contract](./03-flow-token.md).
The contract defines the fungible FLOW token. Please note that events for the fungible token contracts are the same
if deployed to a different account but the `contract address` is
changed to the address of the account the contract has been deployed to.

### Tokens Initialized

Event that is emitted when the contract gets created.

- Event name: `TokensInitialized`
- Mainnet event: `A.1654653399040a61.FlowToken.TokensInitialized`
- Testnet event: `A.7e60df042a9c0868.FlowToken.TokensInitialized`

```cadence
access(all) event TokensInitialized(initialSupply: UFix64)
```

| Field         | Type   | Description                      |
| ------------- | ------ | -------------------------------- |
| initialSupply | UFix64 | The initial supply of the tokens |

### Tokens Withdrawn

Event that is emitted when tokens get withdrawn from a Vault.

- Event name: `TokensWithdrawn`
- Mainnet event: `A.1654653399040a61.FlowToken.TokensWithdrawn`
- Testnet event: `A.7e60df042a9c0868.FlowToken.TokensWithdrawn`

```cadence
access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
```

| Field  | Type     | Description                                                                                                                             |
| ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| amount | UFix64   | The amount of tokens withdrawn                                                                                                          |
| from   | Address? | Optional address of the account that owns the vault where tokens were withdrawn from. `nil` if the vault is not in an account's storage |

### Tokens Deposited

Event that is emitted when tokens get deposited to a Vault.

- Event name: `TokensDeposited`
- Mainnet event: `A.1654653399040a61.FlowToken.TokensDeposited`
- Testnet event: `A.7e60df042a9c0868.FlowToken.TokensDeposited`

```cadence
access(all) event TokensDeposited(amount: UFix64, to: Address?)
```

| Field  | Type     | Description                                                                                                                           |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| amount | UFix64   | The amount of tokens withdrawn                                                                                                        |
| to     | Address? | Optional address of the account that owns the vault where tokens were deposited to. `nil` if the vault is not in an account's storage |

### Tokens Minted

Event that is emitted when new tokens gets minted.

- Event name: `TokensMinted`
- Mainnet event: `A.1654653399040a61.FlowToken.TokensMinted`
- Testnet event: `A.7e60df042a9c0868.FlowToken.TokensMinted`

```cadence
access(all) event TokensMinted(amount: UFix64)
```

| Field  | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| amount | UFix64 | The amount of tokens to mint |

### Tokens Burned

Event that is emitted when tokens get destroyed.

- Event name: `TokensBurned`
- Mainnet event: `A.1654653399040a61.FlowToken.TokensBurned`
- Testnet event: `A.7e60df042a9c0868.FlowToken.TokensBurned`

```cadence
access(all) event TokensBurned(amount: UFix64)
```

| Field  | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| amount | UFix64 | The amount of tokens to burn |

### Minter Created

Event that is emitted when a new minter resource gets created.

- Event name: `MinterCreated`
- Mainnet event: `A.1654653399040a61.FlowToken.MinterCreated`
- Testnet event: `A.7e60df042a9c0868.FlowToken.MinterCreated`

```cadence
access(all) event MinterCreated(allowedAmount: UFix64)
```

| Field         | Type   | Description                                             |
| ------------- | ------ | ------------------------------------------------------- |
| allowedAmount | UFix64 | The amount of tokens that the minter is allowed to mint |

### Burner Created

Event that is emitted when a new burner Resource gets created.

- Event name: `BurnerCreated`
- Mainnet event: `A.1654653399040a61.FlowToken.BurnerCreated`
- Testnet event: `A.7e60df042a9c0868.FlowToken.BurnerCreated`

```cadence
access(all) event BurnerCreated()
```

### Staking Events

To learn more about staking events, read [staking/events/](../../../protocol/staking/07-staking-scripts-events.md)
