---
title: Fungible Token Contract
sidebar_position: 2
sidebar_label: Fungible Token
description: Learn about Flow's Fungible Token standard contract, its implementation, events, and how to interact with fungible tokens on the Flow blockchain.
keywords:
  - fungible token
  - FT standard
  - token contract
  - Flow tokens
  - token events
  - token transactions
  - token metadata
  - token standard
  - Flow FT
  - token implementation
  - token interface
  - token deployment
  - token addresses
  - token events
  - token specification
---

The `FungibleToken` contract implements the Fungible Token Standard. It is the second contract ever deployed on Flow.

- [Basic Fungible Token Tutorial](https://cadence-lang.org/docs/tutorial/fungible-tokens)
- [Fungible Token Guide](../guides/fungible-token.md)
- [Fungible Token Standard Repo](https://github.com/onflow/flow-ft)

The `FungibleTokenMetadataViews` and `FungibleTokenSwitchboard` contracts
are also deployed to the same account as `FungibleToken`.

Source: [FungibleToken.cdc](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc)

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0xee82856bf20e2aa6` |
| Cadence Testing Framework | `0x0000000000000002` |
| Testnet                   | `0x9a0766d93b6608b7` |
| Mainnet                   | `0xf233dcee88fe0abe` |

# Transactions

All `FungibleToken` projects are encouraged to use
the generic token transactions and scripts in the `flow-ft` [repo](https://github.com/onflow/flow-ft/tree/master/transactions).
They can be used for any token that implements the fungible token standard properly
without changing any code besides import addresses on different networks.

# Events

Events emitted from all contracts follow a standard format:

```
A.{contract address}.{contract name}.{event name}
```

The components of the format are:

- `contract address` - the address of the account the contract has been deployed to
- `contract name` - the name of the contract in the source code
- `event name` - the name of the event as declared in the source code

## FungibleToken Events

Contracts that implement the Fungible Token standard get access
to standard events that are emitted every time a relevant action occurs,
like depositing and withdrawing tokens.

This means that projects do not have to implement their own custom events
unless the standard events do not satisfy requirements they have for events.

The `FungibleToken` events will have the following format:

```
A.{contract address}.FungibleToken.Deposited
A.{contract address}.FungibleToken.Withdrawn
```

Where the `contract address` is the `FungibleToken` address on the network being queried.
The addresses on the various networks are shown above.

### FungibleToken.Deposited

```cadence
access(all) event Deposited (
    type: String,
    amount: UFix64,
    to: Address?,
    toUUID: UInt64,
    depositedUUID: UInt64,
    balanceAfter: UFix64
)
```

Whenever `deposit()` is called on a resource type that implements
`FungibleToken.Vault`, the `FungibleToken.Deposited` event is emitted
with the following arguments:

- `type: String`: The type identifier of the token being deposited.
  - Example: `A.4445e7ad11568276.FlowToken.Vault`
- `amount: UFix64`: The amount of tokens that were deposited.
  - Example: `0.00017485`
- `to: Address?`: The address of the account that owns the Vault that received
  the tokens. If the vault is not stored in an account, `to` will be `nil`.
  - Example: `0x4445e7ad11568276`
- `toUUID: UInt64`: The UUID of the Vault that received the tokens.
  - Example: `177021372071991`
- `depositedUUID`: The UUID of the Vault that was deposited (and therefore destroyed).
  - Example: `177021372071991`
- `balanceAfter: UFix64`: The balance of the Vault that received the tokens after the deposit happened.
  - Example: `1.00047545`

### FungibleToken.Withdrawn

```cadence
access(all) event Withdrawn (
    type: String,
    amount: UFix64,
    from: Address?,
    fromUUID: UInt64,
    withdrawnUUID: UInt64,
    balanceAfter: UFix64
)
```

Whenever `withdraw()` is called on a resource type that implements
`FungibleToken.Vault`, the `FungibleToken.Withdrawn` event is emitted
with the following arguments:

- `type: String`: The type identifier of the token being withdrawn.
  - Example: `A.4445e7ad11568276.FlowToken.Vault`
- `amount: UFix64`: The amount of tokens that were withdrawn.
  - Example: `0.00017485`
- `from: Address?`: The address of the account that owns the Vault that the tokens
  were withdrawn from. If the vault is not stored in an account, `to` will be `nil`.
  - Example: `0x4445e7ad11568276`
- `fromUUID: UInt64`: The UUID of the Vault that the tokens were withdrawn from.
  - Example: `177021372071991`
- `withdrawnUUID`: The UUID of the Vault that was withdrawn.
  - Example: `177021372071991`
- `balanceAfter: UFix64`: The balance of the Vault that the tokens
  were withdrawn from after the withdrawal.
  - Example: `1.00047545`

### FungibleToken.Burned

```cadence
access(all) event Burned (
    type: String,
    amount: UFix64,
    fromUUID: UInt64
)
```

Whenever a fungible token that implements `FungibleToken.Vault` is burned
via the `Burner.burn()` method, this event is emitted with the following arguments:

- `type: String`: The type identifier of the token that was burnt.
  - Example: `A.4445e7ad11568276.FlowToken.Vault`
- `amount: UFix64`: The amount of tokens that were burnt.
  - Example: `0.00017485`
- `fromUUID: UInt64`: The UUID of the Vault that was burnt.
  - Example: `177021372071991`