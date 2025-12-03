---
title: Non-Fungible Token Contract
sidebar_position: 8
sidebar_label: Non-Fungible Token
description: Learn about Flow's Non-Fungible Token (NFT) standard contract interface, its implementation, events system, and how to build NFT contracts on Flow. Understand the core NFT functionality and event handling.
keywords:
  - NFT
  - non-fungible token
  - NFT standard
  - token contract
  - NFT events
  - NFT transactions
  - token interface
  - Flow NFT
  - NFT implementation
  - token collection
  - NFT deposits
  - NFT withdrawals
  - token updates
  - NFT metadata
  - digital assets
---

# Non-Fungible Token Contract

The `NonFungibleToken` contract interface implements the Fungible Token Standard. All NFT contracts are encouraged to import and implement this standard.

- [Basic Non-Fungible Token Tutorial]
- [Non Fungible Token Guide]
- [Non Fungible Token Standard Repo]

Source: [NonFungibleToken.cdc]

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0xf8d6e0586b0a20c7` |
| Cadence Testing Framework | `0x0000000000000001` |
| Testnet                   | `0x631e88ae7f1d7c20` |
| Mainnet                   | `0x1d7e57aa55817448` |

## Transactions

All `NonFungibleToken` projects are encouraged to use the generic token transactions and scripts in the `flow-nft` [repo]. You can  use them for any token that implements the non-fungible token standard properly, and you won't have to change any code besides import addresses on different networks.

## Events

Events emitted from all contracts follow a standard format:

```
A.{contract address}.{contract name}.{event name}
```

The components of the format are:

- `contract address` - the address of the account the contract has been deployed to.
- `contract name` - the name of the contract in the source code.
- `event name` - the name of the event as declared in the source code.

## NonFungibleToken events

Contracts that implement the Non-Fungible Token standard get access to standard events that are emitted every time a relevant action occurs, like token deposits and withdrawls.

This means that projects do not have to implement their own custom events unless the standard events do not satisfy requirements they have for events.

The `NonFungibleToken` events will have the following format:

```
A.{contract address}.NonFungibleToken.Deposited
A.{contract address}.NonFungibleToken.Withdrawn
```

Where the `contract address` is the `NonFungibleToken` address on the network being queried. The addresses on the various networks are shown above.

### NonFungibleToken.Deposited

```cadence
access(all) event Deposited (
    type: String,
    id: UInt64,
    uuid: UInt64,
    to: Address?,
    collectionUUID: UInt64
)
```

Whenever `deposit()` is called on a resource type that implements `NonFungibleToken.Collection`, the `NonFungibleToken.Deposited` event is emitted with the following arguments:

- `type: String`: The type identifier of the token being deposited.
  - Example: `A.4445e7ad11568276.TopShot.NFT`
- `id: UInt64`: The ID of the token that was deposited. Note: This may or may not be the UUID.
  - Example: `173838`
- `uuid: UInt64`: The UUID of the token that was deposited.
  - Example: `177021372071991`
- `to: Address?`: The address of the account that owns the Collection that received the token. If the collection is not stored in an account, `to` will be `nil`.
  - Example: `0x4445e7ad11568276`
- `collectionUUID: UInt64`: The UUID of the Collection that received the token.
  - Example: `177021372071991`

### NonFungibleToken.Withdrawn

```cadence
access(all) event Withdrawn (
    type: String,
    id: UInt64,
    uuid: UInt64,
    from: Address?,
    providerUUID: UInt64
)
```

Whenever `withdraw()` is called on a resource type that implements `NonFungibleToken.Collection`, the `NonFungibleToken.Withdrawn` event is emitted with the following arguments:

- `type: String`: The type identifier of the token being withdrawn.
  - Example: `A.4445e7ad11568276.TopShot.NFT`
- `id: UInt64`: The id of the token that was withdrawn. Note: May or may not be the UUID.
  - Example: `113838`
- `uuid: UInt64`: The UUID of the token that was withdrawn.
  - Example: `177021372071991`
- `from: Address?`: The address of the account that owns the Collection that the token was withdrawn from. If the collection is not stored in an account, `to` will be `nil`.
  - Example: `0x4445e7ad11568276`
- `providerUUID: UInt64`: The UUID of the Collection that the token was withdrawn from.
  - Example: `177021372071991`

### NonFungibleToken.Updated

```cadence
access(all) event Updated(
    type: String,
    id: UInt64,
    uuid: UInt64,
    owner: Address?
)
```

Whenever a non-fungible token is updated for whatever reason, projects should call the `NonFungibleToken.emitNFTUpdated()` function to emit this event. It indicates to event listeners that they should query the NFT to update any stored information they have about the NFT in their database.

- `type: String`: The type identifier of the token that was updated.
  - Example: `A.4445e7ad11568276.TopShot.NFT`
- `id: UInt64`: The ID of the token that was updated. This may or may not be the UUID.
  - Example: `173838`
- `uuid: UInt64`: The UUID of the token that was updated.
  - Example: `177021372071991`
- `owner: Address?`: The address of the account that owns the Collection that owns the token. If the collection is not stored in an account, `to` will be `nil`.
  - Example: `0x4445e7ad11568276`

<!-- Reference-style links, will not render on page -->

[repo]: https://github.com/onflow/flow-nft/tree/master/transactions
[Basic Non-Fungible Token Tutorial]: https://cadence-lang.org/docs/tutorial/non-fungible-tokens-1)
[Non Fungible Token Guide]: ../../../blockchain-development-tutorials/tokens/nft-cadence.md)
[Non Fungible Token Standard Repo]: https://github.com/onflow/flow-nft)
[NonFungibleToken.cdc]: https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc)