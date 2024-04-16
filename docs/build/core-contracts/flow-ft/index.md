---
title: Fungible Token (FT) Standard
sidebar_position: 2
---

This documentation comes from the README of
[the `flow-ft` github repository](https://github.com/onflow/flow-ft/blob/v2-standard/README.md). Please visit that repo to see more detailed documentation and examples.

# Fungible Token Standard

This is a description of the Flow standard for fungible token contracts. 
It is meant to contain the minimum requirements to implement a safe, secure, easy to understand,
and easy to use fungible token contract.
It also includes an example implementation to show how a 
concrete smart contract would actually implement the interface.

The version of the contracts in the `master` branch is the
Cadence 1.0 version of the contracts and is not the same
as the ones that are currently deployed to testnet and mainnet.
See the `cadence-0.42` branch for the currently deployed versions.

## Import Addresses

The `FungibleToken`, `FungibleTokenMetadataViews`, and `FungibleTokenSwitchboard` contracts are already deployed
on various networks. You can import them in your contracts from these addresses.
There is no need to deploy them yourself.

| Network           | Contract Address     |
| ----------------- | -------------------- |
| Emulator          | `0xee82856bf20e2aa6` |
| PreviewNet        | `0xa0225e7000ac82a9` |
| Testnet/Crescendo | `0x9a0766d93b6608b7` |
| Sandboxnet        | `0xe20612a0776ca4bf` |
| Mainnet           | `0xf233dcee88fe0abe` |

The `Burner` contract is also deployed to these addresses, but should not be used until after the Cadence 1.0 network upgrade.

## Basics of the Standard:

The code for the standard is in [`contracts/FungibleToken.cdc`](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc). An example implementation of the standard that simulates what a simple token would be like is in [`contracts/ExampleToken.cdc`](https://github.com/onflow/flow-ft/blob/master/contracts/ExampleToken.cdc). 

The exact smart contract that is used for the official Flow Network Token (`FlowToken`) is in [the `flow-core-contracts` repository](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowToken.cdc).

Example transactions that users could use to interact with fungible tokens are located in the `transactions/` directory. These templates are mostly generic and can be used with any fungible token implementation by providing the correct addresses, names, and values.

The standard consists of a contract interface called `FungibleToken` that defines important
functionality for token implementations. Contracts are expected to define a resource
that implement the `FungibleToken.Vault` resource interface.
A `Vault` represents the tokens that an account owns. Each account that owns tokens
will have a `Vault` stored in its account storage. 
Users call functions on each other's `Vault`s to send and receive tokens.  

The standard uses unsigned 64-bit fixed point numbers `UFix64` as the type to represent token balance information. This type has 8 decimal places and cannot represent negative numbers.

## Core Features (All contained in the main FungibleToken interface)

### `Balance` Interface

Specifies that the implementing type must have a `UFix64` `balance` field.
  - `access(all) var balance: UFix64`

### `Provider` Interface
Defines a [`withdraw ` function](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleToken.cdc#L95) for withdrawing a specific amount of tokens *amount*.
  - `access(all) fun withdraw(amount: UFix64): @{FungibleToken.Vault}`
      - Conditions
          - the returned Vault's balance must equal the amount withdrawn
          - The amount withdrawn must be less than or equal to the balance
          - The resulting balance must equal the initial balance - amount
  - Users can give other accounts a reference to their `Vault` cast as a `Provider`
  to allow them to withdraw and send tokens for them. 
  A contract can define any custom logic to govern the amount of tokens
  that can be withdrawn at a time with a `Provider`. 
  This can mimic the `approve`, `transferFrom` functionality of ERC20.
- [`FungibleToken.Withdrawn` event](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleToken.cdc#L50)
    - Event that is emitted automatically to indicate how much was withdrawn
    and from what account the `Vault` is stored in.
      If the `Vault` is not in account storage when the event is emitted,
      `from` will be `nil`.
    - Contracts do not have to emit their own events,
    the standard events will automatically be emitted.

Defines [an `isAvailableToWithdraw()` function](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleToken.cdc#L95)
to ask a `Provider` if the specified number of tokens can be withdrawn from the implementing type.

### `Receiver` Interface
Defines functionality to depositing fungible tokens into a resource object.
- [`deposit()` function](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleToken.cdc#L119):
  - `access(all) fun deposit(from: @{FungibleToken.Vault})`
  - Conditions
      - `from` balance must be non-zero
      - The resulting balance must be equal to the initial balance + the balance of `from`
  - It is important that if you are making your own implementation of the fungible token interface that
  you cast the input to `deposit` as the type of your token.
  `let vault <- from as! @ExampleToken.Vault`
  The interface specifies the argument as `@FungibleToken.Vault`, any resource that satisfies this can be sent to the deposit function. The interface checks that the concrete types match, but you'll still need to cast the `Vault` before storing it.
- deposit event
    - [`FungibleToken.Deposited` event](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleToken.cdc#L53) from the standard
    that indicates how much was deposited and to what account the `Vault` is stored in.
      - If the `Vault` is not in account storage when the event is emitted,
        `to` will be `nil`.
      - This event is emitted automatically on any deposit, so projects do not need
        to define and emit their own events.

Defines Functionality for Getting Supported Vault Types
- Some resource types can accept multiple different vault types in their deposit functions,
  so the `getSupportedVaultTypes()` and `isSupportedVaultType()` functions allow callers
  to query a resource that implements `Receiver` to see if the `Receiver` accepts
  their desired `Vault` type in its deposit function.

Users could create custom `Receiver`s to trigger special code when transfers to them happen,
like forwarding the tokens to another account, splitting them up, and much more.

### `Vault` Interface
[Interface](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleToken.cdc#L134) that inherits from `Provider`, `Receiver`, `Balance`, `ViewResolver.Resolver`,
and `Burner.Burnable` and provides additional pre and post conditions.

The `ViewResolver.Resolver` interface defines functionality for retrieving metadata
about a particular resource object. Fungible Token metadata is described below.

See the comments in [the `Burner` contract](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/Burner.cdc) for context about it.
Basically, it defines functionality for tokens to have custom logic when those tokens
are destroyed.

### Creating an empty Vault resource
Defines functionality in the contract to create a new empty vault of
of the contract's defined type.
- `access(all) fun createEmptyVault(vaultType: Type): @{FungibleToken.Vault}`
- Defined in the contract 
- To create an empty `Vault`, the caller calls the function and provides the Vault Type
  that they want. They get a vault back and can store it in their storage.
- Conditions:
    - the balance of the returned Vault must be 0


## Comparison to Similar Standards in Ethereum

This spec covers much of the same ground that a spec like ERC-20 covers, but without most of the downsides.  

- Tokens cannot be sent to accounts or contracts that don't have owners or don't understand how to use them, because an account has to have a `Vault` in its storage to receive tokens.  No `safetransfer` is needed.
- If the recipient is a contract that has a stored `Vault`, the tokens can just be deposited to that Vault without having to do a clunky `approve`, `transferFrom`
- Events are defined in the contract for withdrawing and depositing, so a recipient will always be notified that someone has sent them tokens with the deposit event.
- The `approve`, `transferFrom` pattern is not included, so double spends are not permitted
- Transfers can trigger actions because users can define custom `Receivers` to execute certain code when a token is sent.
- Cadence integer types protect against overflow and underflow, so a `SafeMath`-equivalent library is not needed.

## FT Metadata

FT Metadata is represented in a flexible and modular way using both
the [standard proposed in FLIP-0636](https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md)
and the [standard proposed in FLIP-1087](https://github.com/onflow/flips/blob/main/application/20220811-fungible-tokens-metadata.md).

[A guide for NFT metadata](https://developers.flow.com/build/advanced-concepts/metadata-views)
is provided on the docs site. Many of the concepts described there also apply
to fungible tokens, so it is useful to read for any Cadence developer.

When writing an FT contract interface, your contract will implement
the `FungibleToken` contract interface which already inherits
from [the `ViewResolver` contract interface](https://github.com/onflow/flow-nft/blob/master/contracts/ViewResolver.cdc),
so you will be required to implement the metadata functions.
Additionally, your `Vault` will also implement the `ViewResolver.Resolver` by default,
which allows your `Vault` resource to implement one or more metadata types called views.

Views do not specify or require how to store your metadata, they only specify
the format to query and return them, so projects can still be flexible with how they store their data.

### Fungible token Metadata Views

The [FungibleTokenMetadataViews contract](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleTokenMetadataViews.cdc) defines four new views that can used to communicate any fungible token information:

1. `FTView`: A view that wraps the two other views that actually contain the data.
2. `FTDisplay`: The view that contains all the information that will be needed by other dApps to display the fungible token: name, symbol, description, external URL, logos and links to social media.
3. `FTVaultData`: The view that can be used by other dApps to interact programmatically with the fungible token, providing the information about the public and private paths used by default by the token, the public and private linked types for exposing capabilities and the function for creating new empty vaults. You can use this view to [setup an account using the vault stored in other account without the need of importing the actual token contract.](https://github.com/onflow/flow-ft/blob/v2-standard/transactions/setup_account_from_vault_reference.cdc)
4. `TotalSupply`: Specifies the total supply of the given token.

### How to implement metadata

The [Example Token contract](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/ExampleToken.cdc) shows how to implement metadata views for fungible tokens.

### How to read metadata

In the `flow-ft` github repository you can find examples on how to read metadata, accessing the `ExampleToken` display (name, symbol, logos, etc.) and its vault data (paths, linked types and the method to create a new vault).

Latter using that reference you can call methods defined in the [Fungible Token Metadata Views contract](https://github.com/onflow/flow-ft/blob/v2-standard/contracts/FungibleTokenMetadataViews.cdc) that will return you the structure containing the desired information.

# How to use the Fungible Token contract

To use the Flow Token contract as is, you need to follow these steps:

1. If you are using any network or the playground, there is no need to deploy
the `FungibleToken` definition to accounts yourself.
It is a pre-deployed interface in the emulator, testnet, mainnet,
and playground and you can import definition from those accounts:
    - `0xee82856bf20e2aa6` on emulator
    - `0x9a0766d93b6608b7` on testnet
    - `0xf233dcee88fe0abe` on mainnet
2. Deploy the `ExampleToken` definition, making sure to import the `FungibleToken` interface.
3. You can use the `get_balance.cdc` or `get_supply.cdc` scripts to read the 
   balance of a user's `Vault` or the total supply of all tokens, respectively.
4. Use the `setup_account.cdc` on any account to set up the account to be able to
   use `ExampleToken`.
5. Use the `transfer_tokens.cdc` transaction file to send tokens from one user with
   a `Vault` in their account storage to another user with a `Vault` in their account storage.
6. Use the `mint_tokens.cdc` transaction with the admin account to mint new tokens.
7. Use the `burn_tokens.cdc` transaction with the admin account to burn tokens.
8. Use the `create_minter.cdc` transaction to create a new MintandBurn resource
   and store it in a new Admin's account.

# Fungible Token Switchboard

`FungibleTokenSwitchboard.cdc`, allows users to receive payments
in different fungible tokens using a single `&{FungibleToken.Receiver}`
placed in a standard receiver path `/public/GenericFTReceiver`.
The switchboard routes received tokens to the correct vault in the owner's account.

You can see more documentation about the switchboard in
[the flow-ft github repo](https://github.com/onflow/flow-ft/tree/v2-standard?tab=readme-ov-file#fungible-token-switchboard).



