---
title: Creating a Fungible Token
description: Learn how to create and deploy a fungible token on Flow using Cadence. Follow this guide to implement the Flow Fungible Token standard, manage token minting, transfers, and vault management.
sidebar_position: 6
keywords:
  - fungible token
  - Flow token
  - token standard
  - smart contract
  - Cadence
  - token minting
  - token transfers
  - vault management
  - Flow CLI
  - token deployment
  - FT standard
  - token balance
  - Flow development
  - token contract
  - blockchain tokens
---

:::info

This guide is an in-depth tutorial on launching a Fungible Token contract from scratch. To launch in 2 minutes using a tool check out [Toucans](https://toucans.ecdao.org/)

:::

## What are Fungible Tokens?

Fungible tokens are digital assets that are interchangeable and indistinguishable with other tokens of the same type. This means that each token is identical in specification to every other token in circulation. Think of them like traditional money; every dollar bill has the same value as every other dollar bill. Fungible tokens play a crucial role in web3 ecosystems, serving as both a means of payment and an incentive for network participation. They can take on various roles including currencies, structured financial instruments, shares of index funds, and even voting rights in decentralized autonomous organizations.

## Vaults on Flow

On the Flow blockchain and in the Cadence programming language,
fungible tokens are stored in structures called resources.
Resources are objects in Cadence that store data,
but have special restrictions about how they can be stored and transferred,
making them perfect for representing digital objects with real value.

You can learn more about resources in the Cadence [documentation](https://cadence-lang.org/docs/language/resources)
and [tutorials](https://cadence-lang.org/docs/tutorial/resources).

For fungible tokens specifically, tokens are represented by a resource type called a `Vault`:

```cadence
access(all) resource interface Vault {

    /// Field that tracks the balance of a vault
    access(all) var balance: UFix64

}
```

Think of a `Vault` as a digital piggy bank.
Users who own fungible tokens store vault objects that track their balances
directly in their account storage. This is opposed to languages
that track user balances in a central ledger smart contract.

When you transfer tokens from one vault to another:

1. The transferor's vault creates a temporary vault holding the transfer amount.
2. The original vault's balance decreases by the transfer amount.
3. The recipient's vault receives the tokens from the temporary vault
   and adds the temporary vault's balance to the its own balance.
4. The temporary vault is then destroyed.

This process ensures secure and accurate token transfers on the Flow blockchain.

## Fungible Token Standard

The [Fungible Token Standard](https://github.com/onflow/flow-ft) defines how a fungible token should behave on Flow.
Wallets and other platforms need to recognize these tokens,
so they adhere to a specific interface, which defines fields like balance,
totalSupply, withdraw functionality, and more.
This interface ensures that all fungible tokens on Flow have a consistent structure and behavior.
Clink the link to the fungible token standard to see the full standard
and learn about specific features and requirements.

[Learn more about interfaces here](https://developers.flow.com/cadence/language/interfaces).

## Setting Up a Project

To start creating a Fungible Token on the Flow blockchain, you'll first need some tools and configurations in place.

### Installing Flow CLI

The **Flow CLI** (Command Line Interface) provides a suite of tools that allow developers to interact seamlessly with the Flow blockchain.

If you haven't installed the Flow CLI yet and have [Homebrew](https://brew.sh/) installed,
you can run `brew install flow-cli`. If you don't have Homebrew,
please follow [the installation guide here](https://developers.flow.com/tools/flow-cli/install).

### Initializing a New Project

> 💡 Note: Here is [a link to the completed code](https://github.com/chasefleming/FooToken) if you want to skip ahead or reference as you follow along.

Once you have the Flow CLI installed, you can set up a new project using the `flow init` command. This command initializes the necessary directory structure and a `flow.json` configuration file (a way to configure your project for contract sources, deployments, accounts, and more):

```bash
flow init FooToken
```

> Note: Select "No" when it asks you to install core contracts for the purposes of this tutorial.

Upon execution, the command will generate the following directory structure:

```
/cadence
    /contracts
    /scripts
    /transactions
    /tests
flow.json
```

Now, navigate into the project directory:

```bash
cd FooToken
```

In our configuration file, called `flow.json`, for the network we want to use,
we are going to state the address the `FungibleToken` contract is deployed
to via `aliases` in a new `contracts` section. Since it is a standard contract,
it has already been deployed to the emulator, a tool that runs and emulates
a local development version of the Flow Blockchain, for us.
You can find addresses for other networks, like Testnet and Mainnet, on the [Fungible Token Standard repo](https://github.com/onflow/flow-ft).

We'll also need to add the addresses for `ViewResolver`, `MetadataViews`,
and `FungibleTokenMetadataViews`, which are other important contracts to use.
These contracts are deployed to the Flow emulator by default,
so there is not need to copy their code into your repo.
The addresses below are the addresses in the emulator that your contract
will import them from.

```json
"contracts": {
  "FungibleToken": {
    "aliases": {
      "emulator": "0xee82856bf20e2aa6"
    }
  },
  "FungibleTokenMetadataViews": {
    "aliases": {
      "emulator": "0xee82856bf20e2aa6"
    }
  },
  "ViewResolver": {
    "aliases": {
      "emulator": "0xf8d6e0586b0a20c7"
    }
  },
  "MetadataViews": {
    "aliases": {
      "emulator": "0xf8d6e0586b0a20c7"
    }
  }
}
```

## Writing Our Token Contract

Next let's create a `FooToken` contract at `cadence/contract/FooToken.cdc` using the boilerplate `generate` command from the Flow CLI:

```bash
flow generate contract FooToken
```

This will create a new file called `FooToken.cdc` in the `contracts` directory. Let's open it up and add some code.

In this contract file, we want to import our `FungibleToken` contract that we've defined in `flow.json`.

```cadence
import "FungibleToken"
```

In this same file, let's create our contract which implements the `FungibleToken` contract interface (it does so by setting it following the `FooToken:`).
We'll also include fields for standard storage and public paths
for our resource definitions.
In our `init` — which runs on the contract's first deployment and is used to set initial values — let's set an starting total supply of 1,000 tokens for this example.

```cadence
// ...previous code

access(all) contract FooToken: FungibleToken {
    access(all) var totalSupply: UFix64

    access(all) let VaultStoragePath: StoragePath
    access(all) let VaultPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    init() {
        self.totalSupply = 1000.0
        self.VaultStoragePath = /storage/fooTokenVault
        self.VaultPublicPath = /public/fooTokenVault
        self.MinterStoragePath = /storage/fooTokenMinter
    }
}
```

### Creating a Vault

Inside of this contract, we'll need to create a resource for a `Vault`.
The `FungibleToken` standard requires that your vault implements the `FungibleToken.Vault` interface.
This interface inherits from [many other interfaces](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc#L140)
which enforce different functionality that you can learn about in the standard.

```cadence
import "FungibleToken"

access(all) contract FooToken: FungibleToken {
    // ...totalSupply and path code

    access(all) resource Vault: FungibleToken.Vault {

        access(all) var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }
    }

    // ...init code
}
```

In order to give an account a vault, we need to create a function
that creates a vault of our FooToken type and returns it to the account.
This function takes a `vaultType: Type` argument that allows the caller
to specify which type of `Vault` they want to create.
Contracts that implement multiple `Vault` types can use this argument,
but since your contract is only implementing one `Vault` type,
it can ignore the argument.

A simpler version of this function with no parameter
should also be added to your `Vault` implementation.

```cadence
import "FungibleToken"

access(all) contract FooToken: FungibleToken {
    // ...other code

    access(all) resource Vault: FungibleToken.Vault {

        // ...other vault code

        access(all) fun createEmptyVault(): @FooToken.Vault {
            return <-create Vault(balance: 0.0)
        }

        // ...vault init code
    }

    // ...other code

    access(all) fun createEmptyVault(vaultType: Type): @FooToken.Vault {
        return <- create Vault(balance: 0.0)
    }

    // ...FooToken.init() code
}
```

Inside our `Vault` resource, we also need a way to withdraw balances.
To do that, we need to add a `withdraw()` function that returns a new vault
with the transfer amount and decrements the existing balance.

```cadence
import "FungibleToken"

access(all) contract FooToken: FungibleToken {

    // ...previous code

    access(all) resource Vault: FungibleToken.Vault {

        // ...other vault code

        access(FungibleToken.Withdraw) fun withdraw(amount: UFix64): @FooToken.Vault {
            self.balance = self.balance - amount
            return <-create Vault(balance: amount)
        }

        // ...vault init code
    }

    // ...additional code
}
```

As you can see, this function has an `access(FungibleToken.Withdraw)` access modifier.
This is an example of entitlements in Cadence.
[Entitlements](https://cadence-lang.org/docs/language/access-control#entitlements)
are a way for developers to restrict access to privileged fields and functions
in a composite type like a resource when a reference is created for it.
In this example, the `withdraw()` function is always accessible to code that
controls the full `Vault` object, but if a reference is created for it,
the `withdraw()` function can only be called if the reference
is authorized by the owner with `FungibleToken.Withdraw`,
which is [a standard entitlement](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc#L53)
defined by the FungibleToken contract:

```cadence
// Example of an authorized entitled reference to a FungibleToken.Vault
<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>
```

Entitlements are important to understand because they are what protects
privileged functionality in your resource objects from being accessed by third-parties.
It is recommended to read the [entitlements documentation](https://cadence-lang.org/docs/language/access-control#entitlements)
to understand how to use the feature properly.

[References](https://cadence-lang.org/docs/language/references) can be freely up-casted and down-casted in Cadence, so it is important
for privileged functionality to be protected by an entitlement so that it can
only be accessed if it is authorized.

In addition to withdrawing, the vault also needs a way to deposit.
We'll [typecast](https://cadence-lang.org/docs/language/operators#casting-operators)
to make sure we are dealing with the correct token, update the vault balance,
and destroy the vault. Add this code to your resource:

```cadence
import "FungibleToken"

access(all) contract FooToken: FungibleToken {

    // ...previous code

    access(all) resource Vault: FungibleToken.Vault {

        // ...other vault code

        access(all) fun deposit(from: @{FungibleToken.Vault}) {
            let vault <- from as! @FooToken.Vault
            self.balance = self.balance + vault.balance
            destroy vault
        }

        // ...vault init

    }

    // ...additional code
}
```

Many projects rely on events the signal when withdrawals, deposits, or burns happen.
Luckily, the `FungibleToken` standard handles the definition and emission
of events for projects, so there is no need for you to add any events
to your implementation for withdraw, deposit, and burn.

Here are the `FungibleToken` event definitions:

```cadence
/// The event that is emitted when tokens are withdrawn from a Vault
access(all) event Withdrawn(type: String, amount: UFix64, from: Address?, fromUUID: UInt64, withdrawnUUID: UInt64, balanceAfter: UFix64)

/// The event that is emitted when tokens are deposited to a Vault
access(all) event Deposited(type: String, amount: UFix64, to: Address?, toUUID: UInt64, depositedUUID: UInt64, balanceAfter: UFix64)

/// Event that is emitted when the global burn method is called with a non-zero balance
access(all) event Burned(type: String, amount: UFix64, fromUUID: UInt64)
```

These events are [emitted by the `Vault` interface](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc#L198)
in the `FungibleToken` contract whenever the relevant function is called on any implementation.

One important piece to understand about the `Burned` event in particular
is that in order for it to be emitted when a `Vault` is burned, it needs to
be burnt via [the `Burner` contract's `burn()` method](https://github.com/onflow/flow-ft/blob/master/contracts/utility/Burner.cdc#L23).

The [`Burner` contract](../core-contracts/14-burner.md) defines a standard
that all projects should use for handling the destruction of any resource.
It allows projects to define custom logic that can be executed when a resource is destroyed,
like emitting events, or updating a field in the contract to show that the resource was destroyed.

This will call the resource's `burnCallback()` function, which emits the event.
You'll need to also add this function to your token contract now:

```cadence
import "FungibleToken"

access(all) contract FooToken: FungibleToken {

    // ...previous code

    access(all) resource Vault: FungibleToken.Vault {

        // ...other vault code

        /// Called when a fungible token is burned via the `Burner.burn()` method
        access(contract) fun burnCallback() {
            if self.balance > 0.0 {
                FooToken.totalSupply = FooToken.totalSupply - self.balance
            }
            self.balance = 0.0
        }

        // ...vault init

    }

    // ...additional code
}
```

If you ever need to destroy a `Vault` with a non-zero balance,
you should destroy it via the `Burner.burn` method so this important function can be called.

There are three other utility methods that need to be added to your `Vault`
to get various information:

```cadence
import "FungibleToken"

access(all) contract FooToken: FungibleToken {

    // ...previous code

    access(all) resource Vault: FungibleToken.Vault {

        // ...other vault code

        /// getSupportedVaultTypes optionally returns a list of vault types that this receiver accepts
        access(all) view fun getSupportedVaultTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[self.getType()] = true
            return supportedTypes
        }

        /// Says if the Vault can receive the provided type in the deposit method
        access(all) view fun isSupportedVaultType(type: Type): Bool {
            return self.getSupportedVaultTypes()[type] ?? false
        }

        /// Asks if the amount can be withdrawn from this vault
        access(all) view fun isAvailableToWithdraw(amount: UFix64): Bool {
            return amount <= self.balance
        }

        // ...vault init

    }

    // ...additional code
}
```

### Adding Support for Metadata Views

The Fungible Token standard also enforces that implementations
provide functionality to return a set of standard views about the tokens
via the [ViewResolver](https://github.com/onflow/flow-nft/blob/master/contracts/ViewResolver.cdc)
and [FungibleTokenMetadataViews](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleTokenMetadataViews.cdc) definitions.
(You will need to add these imports to your contract now)
These provide developers with standard ways of representing metadata
about a given token such as supply, token symbols, website links, and standard
account paths and types that third-parties can access in a standard way.
You can see the [metadata views documentation](../advanced-concepts/metadata-views.md)
for a more thorough guide using a NFT contract as an example.

For now, you can add this code to your contract to support the important metadata views:

```cadence
import "FungibleToken"

// Add these imports
import "MetadataViews"
import "FungibleTokenMetadataViews"

access(all) contract FooToken: FungibleToken {
    // ...other code

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<FungibleTokenMetadataViews.FTView>(),
            Type<FungibleTokenMetadataViews.FTDisplay>(),
            Type<FungibleTokenMetadataViews.FTVaultData>(),
            Type<FungibleTokenMetadataViews.TotalSupply>()
        ]
    }

    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<FungibleTokenMetadataViews.FTView>():
                return FungibleTokenMetadataViews.FTView(
                    ftDisplay: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                    ftVaultData: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                )
            case Type<FungibleTokenMetadataViews.FTDisplay>():
                let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                        // Change this to your own SVG image
                        url: "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"
                    ),
                    mediaType: "image/svg+xml"
                )
                let medias = MetadataViews.Medias([media])
                return FungibleTokenMetadataViews.FTDisplay(
                    // Change these to represent your own token
                    name: "Example Foo Token",
                    symbol: "EFT",
                    description: "This fungible token is used as an example to help you develop your next FT #onFlow.",
                    externalURL: MetadataViews.ExternalURL("https://developers.flow.com/build/guides/fungible-token"),
                    logos: medias,
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/flow_blockchain")
                    }
                )
            case Type<FungibleTokenMetadataViews.FTVaultData>():
                return FungibleTokenMetadataViews.FTVaultData(
                    storagePath: self.VaultStoragePath,
                    receiverPath: self.VaultPublicPath,
                    metadataPath: self.VaultPublicPath,
                    receiverLinkedType: Type<&FooToken.Vault>(),
                    metadataLinkedType: Type<&FooToken.Vault>(),
                    createEmptyVaultFunction: (fun(): @{FungibleToken.Vault} {
                        return <-FooToken.createEmptyVault(vaultType: Type<@FooToken.Vault>())
                    })
                )
            case Type<FungibleTokenMetadataViews.TotalSupply>():
                return FungibleTokenMetadataViews.TotalSupply(
                    totalSupply: FooToken.totalSupply
                )
        }
        return nil
    }

    // ...other code

    access(all) resource Vault: FungibleToken.Vault {

        // ...other vault code

        access(all) view fun getViews(): [Type] {
            return FooToken.getContractViews(resourceType: nil)
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            return FooToken.resolveContractView(resourceType: nil, viewType: view)
        }

        // ...other vault code
    }

    // ...other FooToken code
}
```

### Creating a Minter

Let's create a minter resource which is used to mint vaults that have tokens in them. We can keep track of tokens we are minting with totalSupply

If we want the ability to create new tokens, we'll need a way to mint them. To do that, let's create another resource on the `FooToken` contract. This will have a `mintToken`function which can increase the total supply of the token.

```cadence
import "FungibleToken"
import "MetadataViews"
import "FungibleTokenMetadataViews"

access(all) contract FooToken: FungibleToken {

    // ...additional contract code

    // Add this event
    access(all) event TokensMinted(amount: UFix64, type: String)

    /// Minter
    ///
    /// Resource object that token admin accounts can hold to mint new tokens.
    ///
    access(all) resource Minter {
        /// mintTokens
        ///
        /// Function that mints new tokens, adds them to the total supply,
        /// and returns them to the calling context.
        ///
        access(all) fun mintTokens(amount: UFix64): @FooToken.Vault {
            FooToken.totalSupply = FooToken.totalSupply + amount
            let vault <-create Vault(balance: amount)
            emit TokensMinted(amount: amount, type: vault.getType().identifier)
            return <-vault
        }
    }

    // ...additional contract code
}
```

We also want to decide which account/s we want to give this ability to.
In our example, we'll give it to the account where the contract is deployed.
We can set this in the contract init function below the setting of total supply
so that when the contract is created the minter is stored on the same account.

```cadence
import "FungibleToken"
import "MetadataViews"
import "FungibleTokenMetadataViews"

access(all) contract FooToken: FungibleToken {

    // ...additional contract code

    init() {
        self.totalSupply = 1000.0 // existed before
        self.account.save(<- create Minter(), to: self.MinterStoragePath)
    }
}
```

After each of these steps, your `FooToken.cdc` contract file should now look like this:

```cadence
import "FungibleToken"
import "MetadataViews"
import "FungibleTokenMetadataViews"

access(all) contract FooToken: FungibleToken {

    /// The event that is emitted when new tokens are minted
    access(all) event TokensMinted(amount: UFix64, type: String)

    /// Total supply of FooTokens in existence
    access(all) var totalSupply: UFix64

    /// Storage and Public Paths
    access(all) let VaultStoragePath: StoragePath
    access(all) let VaultPublicPath: PublicPath
    access(all) let ReceiverPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<FungibleTokenMetadataViews.FTView>(),
            Type<FungibleTokenMetadataViews.FTDisplay>(),
            Type<FungibleTokenMetadataViews.FTVaultData>(),
            Type<FungibleTokenMetadataViews.TotalSupply>()
        ]
    }

    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<FungibleTokenMetadataViews.FTView>():
                return FungibleTokenMetadataViews.FTView(
                    ftDisplay: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                    ftVaultData: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                )
            case Type<FungibleTokenMetadataViews.FTDisplay>():
                let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                        // Change this to your own SVG image
                        url: "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"
                    ),
                    mediaType: "image/svg+xml"
                )
                let medias = MetadataViews.Medias([media])
                return FungibleTokenMetadataViews.FTDisplay(
                    // Change these to represent your own token
                    name: "Example Foo Token",
                    symbol: "EFT",
                    description: "This fungible token is used as an example to help you develop your next FT #onFlow.",
                    externalURL: MetadataViews.ExternalURL("https://developers.flow.com/build/guides/fungible-token"),
                    logos: medias,
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/flow_blockchain")
                    }
                )
            case Type<FungibleTokenMetadataViews.FTVaultData>():
                return FungibleTokenMetadataViews.FTVaultData(
                    storagePath: self.VaultStoragePath,
                    receiverPath: self.VaultPublicPath,
                    metadataPath: self.VaultPublicPath,
                    receiverLinkedType: Type<&FooToken.Vault>(),
                    metadataLinkedType: Type<&FooToken.Vault>(),
                    createEmptyVaultFunction: (fun(): @{FungibleToken.Vault} {
                        return <-FooToken.createEmptyVault(vaultType: Type<@FooToken.Vault>())
                    })
                )
            case Type<FungibleTokenMetadataViews.TotalSupply>():
                return FungibleTokenMetadataViews.TotalSupply(
                    totalSupply: FooToken.totalSupply
                )
        }
        return nil
    }

    access(all) resource Vault: FungibleToken.Vault {

        /// The total balance of this vault
        access(all) var balance: UFix64

        // initialize the balance at resource creation time
        init(balance: UFix64) {
            self.balance = balance
        }

        /// Called when a fungible token is burned via the `Burner.burn()` method
        access(contract) fun burnCallback() {
            if self.balance > 0.0 {
                FooToken.totalSupply = FooToken.totalSupply - self.balance
            }
            self.balance = 0.0
        }

        access(all) view fun getViews(): [Type] {
            return FooToken.getContractViews(resourceType: nil)
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            return FooToken.resolveContractView(resourceType: nil, viewType: view)
        }

        access(all) view fun getSupportedVaultTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[self.getType()] = true
            return supportedTypes
        }

        access(all) view fun isSupportedVaultType(type: Type): Bool {
            return self.getSupportedVaultTypes()[type] ?? false
        }

        access(all) view fun isAvailableToWithdraw(amount: UFix64): Bool {
            return amount <= self.balance
        }

        access(FungibleToken.Withdraw) fun withdraw(amount: UFix64): @FooToken.Vault {
            self.balance = self.balance - amount
            return <-create Vault(balance: amount)
        }

        access(all) fun deposit(from: @{FungibleToken.Vault}) {
            let vault <- from as! @FooToken.Vault
            self.balance = self.balance + vault.balance
            vault.balance = 0.0
            destroy vault
        }

        access(all) fun createEmptyVault(): @FooToken.Vault {
            return <-create Vault(balance: 0.0)
        }
    }

    access(all) resource Minter {
        /// mintTokens
        ///
        /// Function that mints new tokens, adds them to the total supply,
        /// and returns them to the calling context.
        ///
        access(all) fun mintTokens(amount: UFix64): @FooToken.Vault {
            FooToken.totalSupply = FooToken.totalSupply + amount
            let vault <-create Vault(balance: amount)
            emit TokensMinted(amount: amount, type: vault.getType().identifier)
            return <-vault
        }
    }

    access(all) fun createEmptyVault(vaultType: Type): @FooToken.Vault {
        return <- create Vault(balance: 0.0)
    }

    init() {
        self.totalSupply = 1000.0

        self.VaultStoragePath = /storage/fooTokenVault
        self.VaultPublicPath = /public/fooTokenVault
        self.MinterStoragePath = /storage/fooTokenMinter

        // Create the Vault with the total supply of tokens and save it in storage
        //
        let vault <- create Vault(balance: self.totalSupply)
        emit TokensMinted(amount: vault.balance, type: vault.getType().identifier)
        self.account.storage.save(<-vault, to: self.VaultStoragePath)

        // Create a public capability to the stored Vault that exposes
        // the `deposit` method and getAcceptedTypes method through the `Receiver` interface
        // and the `balance` method through the `Balance` interface
        //
        let fooTokenCap = self.account.capabilities.storage.issue<&FooToken.Vault>(self.VaultStoragePath)
        self.account.capabilities.publish(fooTokenCap, at: self.VaultPublicPath)

        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)
    }
}
```

## Deploying the Contract

In order to use the contract, we need to deploy it to the network we want to use it on.
In our case we are going to deploy it to emulator while developing.

Back in our `flow.json`, let's add our `FooToken` to the `contracts` after `FungibleToken` with the path of the source code:

```json
"FooToken": "cadence/contracts/FooToken.cdc"
```

Let's also add a new `deployments` section to `flow.json` with the network
we want to deploy it to, `emulator`, the account we want it deployed to `emulator-account`,
and the list of contracts we want deployed in the array.

```json
"deployments": {
  "emulator": {
    "emulator-account": ["FooToken"]
  }
}
```

Next, using the Flow CLI, we will start the emulator. As mentioned,
this will give us a local development environment for the Flow Blockchain.

```bash
flow emulator start
```

Open a new terminal and run the following to deploy your project:

```bash
flow project deploy
```

Congrats, you've deployed your contract to the Flow Blockchain emulator.
To read more about deploying your project to other environments,
see the [CLI docs](https://developers.flow.com/tools/flow-cli/deployment/deploy-project-contracts).

## Reading the Token's Total Supply

Let's now check that our total supply was initialized with 1,000 FooTokens. Go ahead and create a script called `get_total_supply.cdc` using the `generate` command.

```bash
flow generate script get_total_supply
```

In `cadence/scripts/get_total_supply.cdc` (which was just created), let's add this code which will log the `totalSupply` value from the `FooToken` contract:

```cadence
import "FooToken"

access(all) fun main(): UFix64 {
  return FooToken.totalSupply
}
```

To run this using the CLI, enter this in your terminal:

```bash
flow scripts execute cadence/scripts/get_total_supply.cdc
```

In the terminal where you started the emulator, you should see `Result: 1000.0`

To learn more about running scripts using Flow CLI, [see the docs](https://developers.flow.com/tools/flow-cli/scripts/execute-scripts).

## Giving Accounts the Ability to Receive Tokens

On Flow, newly created accounts cannot receive arbitrary assets.
They need to be initialized to receive resources.
In our case, we want to give accounts tokens and we'll need to create
a `Vault` (which acts as a receiver) on each account that we want
to have the ability to receive tokens. To do this, we'll need to run a transaction
which will create the vault and set it in their storage
using the `createEmptyVault()` function we created earlier on the contract.

Let's first create the file at `cadence/transactions/setup_ft_account.cdc` using the `generate` command:

```bash
flow generate transaction setup_ft_account
```

Then add this code to it.
This will call the `createEmptyVault` function, save it in storage,
and create a capability for the vault which will later allow us to read from it
(To learn more about capabilities, see [the Cadence docs here](https://developers.flow.com/cadence/language/capabilities)).

```cadence
import "FungibleToken"
import "FooToken"

transaction () {

    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {

        // Return early if the account already stores a FooToken Vault
        if signer.storage.borrow<&FooToken.Vault>(from: FooToken.VaultStoragePath) != nil {
            return
        }

        let vault <- FooToken.createEmptyVault(vaultType: Type<@FooToken.Vault>())

        // Create a new FooToken Vault and put it in storage
        signer.storage.save(<-vault, to: FooToken.VaultStoragePath)

        // Create a public capability to the Vault that exposes the Vault interfaces
        let vaultCap = signer.capabilities.storage.issue<&FooToken.Vault>(
            FooToken.VaultStoragePath
        )
        signer.capabilities.publish(vaultCap, at: FooToken.VaultPublicPath)
    }
}
```

There are also examples of [generic transactions](https://github.com/onflow/flow-ft/blob/master/transactions/metadata/setup_account_from_address.cdc)
that you can use to setup an account for ANY fungible token using metadata views!
You should check those out and try to use generic transactions whenever it is possible.

Next let's create a new emulator account using the CLI. We'll use this account to create a new vault and mint tokens into it. Run:

```bash
flow accounts create
```

Let's call it `test-acct` and select "Emulator" for the network:

```bash
test-acct
```

This will have added a new account, called `test-acct` to your `flow.json`.

To call our setup account transaction from the CLI, we'll run the following:

```bash
flow transactions send ./cadence/transactions/setup_ft_account.cdc --signer test-acct --network emulator
```

To learn more about running transactions using CLI, [see the docs](https://developers.flow.com/tools/flow-cli/transactions/send-transactions).

## Reading a Vault's Balance

Let's now read the balance of the newly created account (`test-acct`) to check it's zero.

Create this new script file `cadence/scripts/get_footoken_balance.cdc`:

```bash
flow generate script get_footoken_balance
```

Add this code which attempts to borrow the capability from the account requested and logs the vault balance if permitted:

```cadence
import "FungibleToken"
import "FooToken"
import "FungibleTokenMetadataViews"

access(all) fun main(address: Address): UFix64 {
    let vaultData = FooToken.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
        ?? panic("Could not get FTVaultData view for the FooToken contract")

    return getAccount(address).capabilities.borrow<&{FungibleToken.Balance}>(
            vaultData.metadataPath
        )?.balance
        ?? panic("Could not borrow a reference to the FooToken Vault in account "
            .concat(address.toString()).concat(" at path ").concat(vaultData.metadataPath.toString())
            .concat(". Make sure you are querying an address that has an FooToken Vault set up properly."))
}
```

To run this script using the CLI, enter the following in your terminal.
Note: you'll need to replace `123` with the address created by CLI
in your `flow.json` for the `test-acct` address.

```bash
flow scripts execute cadence/scripts/get_footoken_balance.cdc 123 // change "123" to test-acct address
```

You should see a balance of zero logged.

## Minting More Tokens

Now that we have an account with a vault, let's mint some tokens into it
using the Minter we created on the contract account.

To do this, let's create a new transaction file `cadence/transactions/mint_footoken.cdc`:

```bash
flow generate transaction mint_footoken
```

Next, let's add the following code to the `mint_footoken.cdc` file.
This code will attempt to borrow the minting capability
and mint 20 new tokens into the receivers account.

```cadence
import "FungibleToken"
import "FooToken"

transaction(recipient: Address, amount: UFix64) {

    /// Reference to the Example Token Minter Resource object
    let tokenMinter: &FooToken.Minter

    /// Reference to the Fungible Token Receiver of the recipient
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {

        // Borrow a reference to the admin object
        self.tokenMinter = signer.storage.borrow<&FooToken.Minter>(from: FooToken.MinterStoragePath)
            ?? panic("Cannot mint: Signer does not store the FooToken Minter in their account!")

        self.tokenReceiver = getAccount(recipient).capabilities.borrow<&{FungibleToken.Receiver}>(FooToken.VaultPublicPath)
            ?? panic("Could not borrow a Receiver reference to the FungibleToken Vault in account "
                .concat(recipient.toString()).concat(" at path ").concat(FooToken.VaultPublicPath.toString())
                .concat(". Make sure you are sending to an address that has ")
                .concat("a FungibleToken Vault set up properly at the specified path."))
    }

    execute {

        // Create mint tokens
        let mintedVault <- self.tokenMinter.mintTokens(amount: amount)

        // Deposit them to the receiever
        self.tokenReceiver.deposit(from: <-mintedVault)
    }
}
```

To run this transaction, enter this in your terminal.
Note: `123` should be replaced with address of `test-acct` found in your `flow.json`.
This command also states to sign with our `emulator-account` on the Emulator network.

```bash
flow transactions send ./cadence/transactions/mint_footoken.cdc 123 20.0 --signer emulator-account --network emulator
```

Let's go ahead and read the vault again. Remember to replace `123` with the correct address.

```bash
flow scripts execute cadence/scripts/get_footoken_balance.cdc 123
```

It should now say 20 tokens are in the vault.

## Transferring Tokens Between Accounts

The final functionality we'll add is the ability to transfer tokens from one account to another.

To do that, create a new `cadence/transactions/transfer_footoken.cdc` transaction file:

```bash
flow generate transaction transfer_footoken
```

Let's add the code which states that the signer of the transaction
will withdraw from their vault and put it into the receiver's vault
which will be passed as a transaction argument.

```cadence
import "FungibleToken"
import "FooToken"

transaction(to: Address, amount: UFix64) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @{FungibleToken.Vault}

    prepare(signer: auth(BorrowValue) &Account) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FooToken.Vault>(from: FooToken.VaultStoragePath)
            ?? panic("The signer does not store an FooToken.Vault object at the path "
                    .concat(FooToken.VaultStoragePath.toString())
                    .concat(". The signer must initialize their account with this vault first!"))

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.capabilities.borrow<&{FungibleToken.Receiver}>(FooToken.VaultPublicPath)
            ?? panic("Could not borrow a Receiver reference to the FooToken Vault in account "
                .concat(recipient.toString()).concat(" at path ").concat(FooToken.VaultPublicPath.toString())
                .concat(". Make sure you are sending to an address that has ")
                .concat("a FooToken Vault set up properly at the specified path."))

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}
```

To send our tokens, we'll need to create a new account to send them to. Let's make one more account on emulator. Run:

```bash
flow accounts create
```

And pick the name:

```bash
test-acct-2
```

Make sure to select Emulator as the network.

Don't forget the new account will need a vault added, so let's run the following transaction to add one:

```bash
flow transactions send ./cadence/transactions/setup_ft_account.cdc --signer test-acct-2 --network emulator
```

Now, let's send 1 token from our earlier account to the new account. Remember to replace `123` with account address of `test-acct-2`.

```bash
flow transactions send ./cadence/transactions/transfer_footoken.cdc 123 1.0 --signer test-acct --network emulator
```

After that, read the balance of `test-acct-2` (replace the address `123`).

```bash
flow scripts execute cadence/scripts/get_footoken_balance.cdc 123
```

You should now see 1 token in `test-acct-2` account!

The transfer transaction also has a [generic version](https://github.com/onflow/flow-ft/blob/master/transactions/generic_transfer_with_address.cdc) that developers are encouraged to use!

## More

- [View a repo of this example code](https://github.com/chasefleming/FooToken)
- [Review an `ExampleToken` contract implementing all of the remaining FungibleToken interface](https://github.com/onflow/flow-ft/blob/master/contracts/ExampleToken.cdc)
- [View the Flow Token Standard](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc)
