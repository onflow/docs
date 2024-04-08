---
sidebar_position: 2
---

This documentation comes from the README of
[the `flow-nft` github repository](https://github.com/onflow/flow-nft/blob/standard-v2/README.md). Please visit that repo to see more detailed documentation and examples.

# Flow Non-Fungible Token Standard

This standard defines the minimum functionality required to
implement a safe, secure, and easy-to-use non-fungible token
contract on the [Flow blockchain](https://flow.com/)

The version of the contracts in the `master` branch is the
Cadence 1.0 version of the contracts and is not the same
as the ones that are currently deployed to testnet and mainnet.
See the `cadence-0.42` branch for the currently deployed versions.

## Import Addresses

The `NonFungibleToken`, `ViewResolver`, and `MetadataViews` contracts are already deployed
on various networks. You can import them in your contracts from these addresses.
There is no need to deploy them yourself.

Note: With the emulator, you must use the -contracts flag to deploy these contracts.

| Network           | Contract Address     |
| ------------------| -------------------- |
| Emulator/Canary   | `0xf8d6e0586b0a20c7` |
| PreviewNet        | `0xb6763b4399a888c8` |
| Testnet/Crescendo | `0x631e88ae7f1d7c20` |
| Mainnet           | `0x1d7e57aa55817448` |

## Core Types

Contracts that implement the `NonFungibleToken` interface are expected
to utilize two resource interfaces:

- `NFT` - A resource interface that describes the structure of a single NFT.
- `Collection` - A resource interface that describes an object
  that can hold multiple NFTs of the same type and defines ways
  to deposit, withdraw, and query information about the stored NFTs.

  Users typically store one collection per NFT type, saved at a well-known location in their account storage.

  For example, all NBA Top Shot Moments owned by a single user are held in a [`TopShot.Collection`](https://github.com/dapperlabs/nba-smart-contracts/blob/master/contracts/TopShot.cdc#L605) stored in their account at the path `/storage/MomentCollection`.

## Core Features

The `NonFungibleToken` contract defines the following set of functionality
that should be included in each implementation:

### Create a new NFT collection

Create a new collection using the `Token.createEmptyCollection(nftType: Type)` function.

This function MUST return an empty collection that contains no NFTs.

Users typically save new collections to a contract-defined location in their account
and public a capability to their collection.

### Withdraw an NFT

Withdraw an `NFT` from a `Collection` using the [`withdraw()`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/ExampleNFT.cdc#L160) function.
This function emits the [`NonFungibleToken.Withdrawn`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/NonFungibleToken.cdc#L78) event automatically.

### Deposit an NFT

Deposit an `NFT` into a `Collection` using the [`deposit()`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/ExampleNFT.cdc#L169-L176) function.
This function emits the [`NonFungibleToken.Deposited`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/NonFungibleToken.cdc#L86) event automatically.

#### ⚠️ Important

In order to comply with the deposit function in the interface,
an implementation MUST take a `@{NonFungibleToken.NFT}` resource as an argument.
This means that anyone can send a resource object that conforms to `{NonFungibleToken.NFT}` to a deposit function.
In an implementation, you MUST cast the `token` as your specific token type before depositing it or you will
deposit another token type into your collection. For example:

```cadence
/// `ExampleNFT` much be changed to the name of your contract
let token <- token as! @ExampleNFT.NFT
```

### List NFTs in an account

Return a list of NFTs in a `Collection` using the [`getIDs`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/ExampleNFT.cdc#L179) function.

### Return the NFT type that a collection can accept in a deposit

Return types of NFTs that a `Collection` can accept in a deposit
using the [`getSupportedNFTTypes`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/ExampleNFT.cdc#L143-L157) functions.

### Get Available SubNFTs, if any

Some NFTs can own other NFTs, the standard provides a [function](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/NonFungibleToken.cdc#L111-L131) that
projects can optionally implement to return information the owned NFTs.

## NFT Metadata

The primary documentation for metadata views is on [the Flow developer portal](https://developers.flow.com/build/advanced-concepts/metadata-views).
Please refer to that for the most thorough exploration of the views with examples.

NFT metadata is represented in a flexible and modular way using
the [standard proposed in FLIP-0636](https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md).

When writing an NFT contract,
you should implement the [`MetadataViews.Resolver`](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/MetadataViews.cdc#L3-L6) interface,
which allows your NFT to utilize one or more metadata types called views.

Each view represents a different type of metadata,
such as an on-chain creator biography or an off-chain video clip.
Views do not specify or require how to store your metadata, they only specify
the format to query and return them, so projects can still be flexible with how they store their data.

### How to read metadata

This example shows how to read basic information about an NFT
including the name, description, image and owner.

**Source: [get_nft_metadata.cdc](https://github.com/onflow/flow-nft/blob/standard-v2/transactions/scripts/get_nft_metadata.cdc)**

### How to implement metadata

The [example NFT contract](https://github.com/onflow/flow-nft/blob/standard-v2/contracts/ExampleNFT.cdc) shows a basic example
for how to implement metadata views.

## Comparison to other standards on Ethereum

This standard covers much of the same ground as ERC-721 and ERC-1155,
but without most of the downsides.

- Tokens cannot be sent to contracts that don't understand how to use them, because an account needs to have a `Receiver` or `Collection` in its storage to receive tokens.
- If the recipient is a contract that has a stored `Collection`, the tokens can just be deposited to that Collection without having to do a clunky `approve`, `transferFrom`.
- Events are defined in the contract for withdrawing and depositing, so a recipient will always be notified that someone has sent them tokens with their own deposit event.
- This version can support batch transfers of NFTs. Even though it isn't explicitly defined in the contract, a batch transfer can be done within a transaction by just withdrawing all the tokens to transfer, then depositing them wherever they need to be, all atomically.
- Transfers can trigger actions because users can define custom `Receivers` to execute certain code when a token is sent.
- Easy ownership indexing: rather than iterating through all tokens to find which ones you own, you have them all stored in your account's collection and can get the list of the ones you own instantly.