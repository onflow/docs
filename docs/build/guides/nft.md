---
title: Creating an NFT Contract
description: Learn how to create and deploy a non-fungible token (NFT) contract on Flow using Cadence. Follow this guide to implement the Flow NFT standard, manage collections, and handle token minting and transfers.
sidebar_position: 5
keywords:
  - NFT
  - non-fungible token
  - Flow NFT
  - NFT standard
  - smart contract
  - Cadence
  - token minting
  - NFT collection
  - Flow CLI
  - token deployment
  - NFT transfer
  - digital assets
  - Flow development
  - NFT contract
  - blockchain NFTs
  - bridge
---

:::info

This guide is an in-depth tutorial on launching NFT contracts from scratch.
To launch in 2 minutes using a tool check out [Touchstone](https://www.touchstone.city/)

:::

## What are NFTs

NFTs, or Non-Fungible Tokens, represent a unique digital asset verified
using blockchain technology. Unlike cryptocurrencies such as Bitcoin,
which are fungible and can be exchanged on a one-for-one basis,
NFTs are distinct and cannot be exchanged on a like-for-like basis.
This uniqueness and indivisibility make them ideal for representing
rare and valuable items like art, collectibles, tickets and even real estate.
Their blockchain-backed nature ensures the authenticity and ownership of these digital assets.

## Setting Up a Project

To start creating an NFT on the Flow blockchain, you'll first need some tools and configurations in place.

### Installing Flow CLI

The **Flow CLI** (Command Line Interface) provides a suite of tools
that allow developers to interact seamlessly with the Flow blockchain.

If you haven't installed the Flow CLI yet and have [Homebrew](https://brew.sh/) installed,
you can run `brew install flow-cli`. If you don't have Homebrew,
please follow [the installation guide here](../../tools/flow-cli/install.md).

### Initializing a New Project

> 💡 Note: Here is [a link to the completed code](https://github.com/chasefleming/foobar-nft) if you want to skip ahead or reference as you follow along.

Once you have the Flow CLI installed, you can set up a new project using the `flow init` command. This command initializes the necessary directory structure and a `flow.json` configuration file (a way to configure your project for contract sources, deployments, accounts, and more):

```bash
flow init foobar-nft
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
cd foobar-nft
```

To begin, let's create a contract file named `FooBar` for the `FooBar` token,
which will be the focus of this tutorial. To do this, we can use the boilerplate `generate` command from the Flow CLI:

```bash
flow generate contract FooBar
```

This will create a new file at `cadence/contracts/FooBar.cdc` with the following contents:

```cadence
access(all) contract FooBar {
    init() {}
}
```

Now, add these contracts to your `flow.json`.
These are important contracts that your contract will import that
are pre-deployed to the emulator.

```json
"contracts": {
    "NonFungibleToken": {
		"aliases": {
			"emulator": "f8d6e0586b0a20c7"
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

## Setting Up Our NFT on the Contract

### Understanding Resources

On the Flow blockchain, "[Resources](https://cadence-lang.org/docs/tutorial/resources-compose)"
are a key feature of the Cadence programming language.
They represent unique, non-duplicable assets, ensuring that they can only exist
in one place at a time. This concept is crucial for representing NFTs on Flow,
as it guarantees their uniqueness.

To begin, let's define a basic `NFT` resource.
This resource requires an `init` method, which is invoked when the resource is instantiated:

```cadence
access(all) contract FooBar {

    access(all) resource NFT {
        init() {}
    }

    init() {}
}
```

Every resource in Cadence has a unique identifier assigned to it.
We can use it to set an ID for our NFT. Here's how you can do that:

```cadence
access(all) contract FooBar {

    access(all) resource NFT {
        access(all) let id: UInt64

        init() {
            self.id = self.uuid
        }
    }

    init() {}
}
```

To control the creation of NFTs, it's essential to have a mechanism
that restricts their minting. This ensures that not just anyone can create an NFT and inflate its supply.
To achieve this, you can introduce an `NFTMinter` resource that contains a `createNFT` function:

```cadence
access(all) contract FooBar {

    // ...[previous code]...

    access(all) resource NFTMinter {
        access(all) fun createNFT(): @NFT {
            return <-create NFT()
        }

        init() {}
    }

    init() {}
}
```

In this example, the `NFTMinter` resource will be stored on the contract account's storage.
This means that only the contract account will have the ability to mint new NFTs.
To set this up, add the following line to the contract's `init` function:

```cadence
access(all) contract FooBar {

    // ...[previous code]...

    init() {
        self.account.storage.save(<- create NFTMinter(), to: /storage/fooBarNFTMinter)
    }
}
```

### Setting Up an NFT Collection

Storing individual NFTs directly in an account's storage can cause issues,
especially if you want to store multiple NFTs.
Instead, it's required to create a collection that can hold multiple NFTs.
This collection can then be stored in the account's storage.

Start by creating a new resource named `Collection`.
This resource will act as a container for your NFTs, storing them in a dictionary indexed by their IDs.

```cadence
access(all) contract FooBar {

    // ...[NFT resource code]...

    access(all) resource Collection {

        access(all) var ownedNFTs: @{UInt64: NFT}

        init() {
            self.ownedNFTs <- {}
        }

    }

    // ...[NFTMinter code]...
}
```

## Fitting the Flow NFT Standard

To ensure compatibility and interoperability within the Flow ecosystem,
it's crucial that your NFT contract adheres to the [Flow NFT standard](https://github.com/onflow/flow-nft).
This standard defines the events, functions, resources, metadata and other elements that a contract should have.
By following this standard, your NFTs will be compatible with various marketplaces, apps, and other services within the Flow ecosystem.

### Applying the Standard

To start, you need to inform the Flow blockchain that your contract will implement the `NonFungibleToken` standard.
Since it's a standard, there's no need for deployment.
It's already available on the Emulator, Testnet, and Mainnet for the community's benefit.

Begin by importing the token standard into your contract
and adding the correct interface conformances to FooBar, NFT, and Collection:

```cadence
import "NonFungibleToken"

access(all) contract FooBar: NonFungibleToken {

    /// Standard Paths
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath

    /// Path where the minter should be stored
    /// The standard paths for the collection are stored in the collection resource type
    access(all) let MinterStoragePath: StoragePath

    // ...contract code

    access(all) resource NFT: NonFungibleToken.NFT {
        // ...NFT code
    }

    access(all) resource Collection: NonFungibleToken.Collection {

        // Make sure to update this field!
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        // ...Collection Code
    }

    // ...rest of the contract code

    init() {
        // Set the named paths
        self.CollectionStoragePath = /storage/fooBarNFTCollection
        self.CollectionPublicPath = /public/fooBarNFTCollection
        self.MinterStoragePath = /storage/fooBarNFTMinter
        self.account.storage.save(<- create NFTMinter(), to: self.MinterStoragePath)
    }
}
```

As you can see, we also added standard paths for the Collection and Minter

These interface conformances for [NFT](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc#L98)
and [Collection](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc#L190)
inherit from other interfaces that provide important functionality and restrictions
for your NFT and Collection types.

To allow accounts to create their own collections, add a function
in the main contract that creates a new `Collection` and returns it.
This function takes a `nftType: Type` argument that allows the caller
to specify which type of `Collection` they want to create.
Contracts that implement multiple `NFT` and/or `Collection` types can use this argument,
but since your contract is only implementing one `NFT` and `Collection` type,
it can ignore the argument.
You'll also want to add a simpler one directly
to the `NFT` and `Collection` definitions
so users can directly create a collection from an existing collection:

```cadence
access(all) contract FooBar: NonFungibleToken {

    // ...other FooBar contract code

    access(all) resource NFT: NonFungibleToken.NFT {
        // ...NFT code

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-FooBar.createEmptyCollection(nftType: Type<@FooBar.NFT>())
        }
    }


    access(all) resource Collection: NonFungibleToken.Collection {

        // ...other Collection code

        /// createEmptyCollection creates an empty Collection of the same type
        /// and returns it to the caller
        /// @return A an empty collection of the same type
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-FooBar.createEmptyCollection(nftType: Type<@FooBar.NFT>())
        }
    }

    // ...other FooBar contract code

    /// createEmptyCollection creates an empty Collection for the specified NFT type
    /// and returns it to the caller so that they can own NFTs
    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    // ...FooBar minter and init code
}
```

To manage the NFTs within a collection, you'll need functions to deposit and withdraw NFTs. Here's how you can add a `deposit` function:

```cadence
access(all) resource Collection: NonFungibleToken.Collection {

    access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

    /// deposit takes a NFT and adds it to the collections dictionary
    /// and adds the ID to the id array
    access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
        let token <- token as! @FooBar.NFT
        let id = token.id

        // add the new token to the dictionary which removes the old one
        let oldToken <- self.ownedNFTs[token.id] <- token

        destroy oldToken
    }

    // ...[following code]...
}
```

Similarly, you can add a `withdraw` function to remove an NFT from the collection:

```cadence
access(all) resource Collection: NonFungibleToken.Collection {
    // ...[deposit code]...

    /// withdraw removes an NFT from the collection and moves it to the caller
    access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
        let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("FooBar.Collection.withdraw: Could not withdraw an NFT with ID "
                        .concat(withdrawID.toString())
                        .concat(". Check the submitted ID to make sure it is one that this collection owns."))

        return <-token
    }

    // ...[createEmptyCollection code]...
}
```

As you can see, this function has an `access(NonFungibleToken.Withdraw)` access modifier.
This is an example of entitlements in Cadence.
[Entitlements](https://cadence-lang.org/docs/language/access-control#entitlements)
are a way for developers to restrict access to privileged fields and functions
in a composite type like a resource when a reference is created for it.
In this example, the `withdraw()` function is always accessible to code that
controls the full `Collection` object, but if a reference is created for it,
the `withdraw()` function can only be called if the reference
is authorized by the owner with `NonFungibleToken.Withdraw`,
which is [a standard entitlement](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc#L58)
defined by the `NonFungibleToken` contract:

```cadence
// Example of an authorized entitled reference to a NonFungibleToken.Collection
<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>
```

Entitlements are important to understand because they are what protects
privileged functionality in your resource objects from being accessed by third-parties.
It is recommended to read the [entitlements documentation](https://cadence-lang.org/docs/language/access-control#entitlements)
to understand how to use the feature properly.

[References](https://cadence-lang.org/docs/language/references) can be freely up-casted and down-casted in Cadence, so it is important
for privileged functionality to be protected by an entitlement so that it can
only be accessed if it is authorized.

### Standard NFT Events

Many projects rely on events the signal when withdrawals or deposits happen.
Luckily, the `NonFungibleToken` standard handles the definition and emission
of events for projects, so there is no need for you to add any events
to your implementation for withdraw and deposit.

Here are the `FungibleToken` event definitions:

```cadence
    /// Event that is emitted when a token is withdrawn,
    /// indicating the type, id, uuid, the owner of the collection that it was withdrawn from,
    /// and the UUID of the resource it was withdrawn from, usually a collection.
    ///
    /// If the collection is not in an account's storage, `from` will be `nil`.
    ///
    access(all) event Withdrawn(type: String, id: UInt64, uuid: UInt64, from: Address?, providerUUID: UInt64)

    /// Event that emitted when a token is deposited to a collection.
    /// Indicates the type, id, uuid, the owner of the collection that it was deposited to,
    /// and the UUID of the collection it was deposited to
    ///
    /// If the collection is not in an account's storage, `from`, will be `nil`.
    ///
    access(all) event Deposited(type: String, id: UInt64, uuid: UInt64, to: Address?, collectionUUID: UInt64)

```

These events are [emitted by the `Collection` interface](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc#L202)
in the `NonFungibleToken` contract whenever the relevant function is called on any implementation.

There is also a `NonFungibleToken.NFT.ResourceDestroyed` event that is emitted every time an NFT is destroyed:
```cadence
    /// Event that is emitted automatically every time a resource is destroyed
    /// The type information is included in the metadata event so it is not needed as an argument
    access(all) event ResourceDestroyed(id: UInt64 = self.id, uuid: UInt64 = self.uuid)
```
`ResourceDestroyed` events are standard events that can be added to any resource definition
to be emitted when the resource is destroyed. Learn more about them [in the Cadence docs](https://cadence-lang.org/docs/language/resources#destroy-events).

Additionally, check out the optional [`Burner` contract](../core-contracts/14-burner.md),
which is the standard that all projects should use for handling the destruction of any resource.

Lastly, there is a [standard `NonFungibleToken.Updated` event](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc#L63-L77)
that your contract can emit if the NFT is updated in any way.
This is optional though, so no need to include support for it in your implementation.

To facilitate querying, you'll also want a function to retrieve
important information from the collection, like what types it supports
and all the NFT IDs within a collection:

```cadence
access(all) resource Collection: NonFungibleToken.Collection {
    // ...[withdraw code]...

    /// getIDs returns an array of the IDs that are in the collection
    access(all) view fun getIDs(): [UInt64] {
        return self.ownedNFTs.keys
    }

    /// getSupportedNFTTypes returns a list of NFT types that this receiver accepts
    access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
        let supportedTypes: {Type: Bool} = {}
        supportedTypes[Type<@FooBar.NFT>()] = true
        return supportedTypes
    }

    /// Returns whether or not the given type is accepted by the collection
    /// A collection that can accept any type should just return true by default
    access(all) view fun isSupportedNFTType(type: Type): Bool {
        return type == Type<@FooBar.NFT>()
    }

    // ...[createEmptyCollection code]...
}
```

### Supporting NFT Metadata

The Non-Fungible Token standard also enforces that implementations
provide functionality to return a set of standard views about the tokens
via the [ViewResolver](https://github.com/onflow/flow-nft/blob/master/contracts/ViewResolver.cdc)
and [MetadataViews](https://github.com/onflow/flow-nft/blob/master/contracts/MetadataViews.cdc) definitions.
(You will need to add these imports to your contract)
These provide developers with standard ways of representing metadata
about a given token such as token symbols, images, royalties, editions,
website links, and standard account paths and types that third-parties can access in a standard way.
You can see the [metadata views documentation](../advanced-concepts/metadata-views.md)
for a more thorough guide using a NFT contract as an example.

For now, you can add this code to your contract to support the important metadata:

```cadence
// Add this import!
import "MetadataViews"

access(all) contract FooBar: NonFungibleToken {

    // ...other FooBar contract code

    access(all) resource NFT: NonFungibleToken.NFT {

        // ...other NFT code

        /// Gets a list of views specific to the individual NFT
        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>()
            ]
        }

        /// Resolves a view for this specific NFT
        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: "FooBar Example Token",
                        description: "An Example NFT Contract from the Flow NFT Guide",
                        thumbnail: MetadataViews.HTTPFile(
                            url: "Fill this in with a URL to a thumbnail of the NFT"
                        )
                    )
                case Type<MetadataViews.Editions>():
                    // There is no max number of NFTs that can be minted from this contract
                    // so the max edition field value is set to nil
                    let editionInfo = MetadataViews.Edition(name: "FooBar Edition", number: self.id, max: nil)
                    let editionList: [MetadataViews.Edition] = [editionInfo]
                    return MetadataViews.Editions(
                        editionList
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                    )
                case Type<MetadataViews.NFTCollectionData>():
                    return FooBar.resolveContractView(resourceType: Type<@FooBar.NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return FooBar.resolveContractView(resourceType: Type<@FooBar.NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())
            }
            return nil
        }
    }

    access(all) resource Collection: NonFungibleToken.Vault {

        // ...[getIDs code]...

        /// Allows a caller to borrow a reference to a specific NFT
        /// so that they can get the metadata views for the specific NFT
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id]
        }

        // ...[rest of code]...
    }

    /// Gets a list of views for all the NFTs defined by this contract
    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }

    /// Resolves a view that applies to all the NFTs defined by this contract
    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<MetadataViews.NFTCollectionData>():
                let collectionData = MetadataViews.NFTCollectionData(
                    storagePath: self.CollectionStoragePath,
                    publicPath: self.CollectionPublicPath,
                    publicCollection: Type<&FooBar.Collection>(),
                    publicLinkedType: Type<&FooBar.Collection>(),
                    createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                        return <-FooBar.createEmptyCollection(nftType: Type<@FooBar.NFT>())
                    })
                )
                return collectionData
            case Type<MetadataViews.NFTCollectionDisplay>():
                let media = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(
                        url: "Add your own SVG+XML link here"
                    ),
                    mediaType: "image/svg+xml"
                )
                return MetadataViews.NFTCollectionDisplay(
                    name: "The FooBar Example Collection",
                    description: "This collection is used as an example to help you develop your next Flow NFT.",
                    externalURL: MetadataViews.ExternalURL("Add your own link here"),
                    squareImage: media,
                    bannerImage: media,
                    socials: {
                        "twitter": MetadataViews.ExternalURL("Add a link to your project's twitter")
                    }
                )
        }
        return nil
    }
}
```

If you ever plan on making your NFTs more complex, you should look into
adding views for `Edition`, `EVMBridgedMetadata`, `Traits`, and `Royalties`.
These views make it much easier for third-party sites like marketplaces
and NFT information aggregators to clearly display information
about your projects on their apps and websites and are critical
for every project to include if we want to have a vibrant and interoperable
ecosystem.

## Flow VM Bridge NFTs

Flow provides an EVM environment where projects can deploy
their solidity smart contracts as an easier on-ramp to building on Flow.
The [Cross-VM Bridge](https://www.github.com/onflow/flow-evm-bridge) enables the movement of
fungible and non-fungible tokens between Flow-Cadence & Flow-EVM.

Learn about how you can [bridge your NFTs to Flow-EVM](../../blockchain-development-tutorials/cross-vm-apps/vm-bridge.md#cross-vm-bridge) and how you can build your NFT project [to be compatible with the Flow VM bridge](../../blockchain-development-tutorials/cross-vm-apps/vm-bridge.md#prep-your-assets-for-bridging).

## Deploying the Contract

With your contract ready, it's time to deploy it.
First, add the `FooBar` contract to the `flow.json` configuration file:

```bash
flow config add contract
```

When prompted, enter the following name and location (press `Enter` to skip alias questions):

```
Enter name: FooBar
Enter contract file location: cadence/contracts/FooBar.cdc
```

Next, configure the deployment settings by running the following command:

```bash
flow config add deployment
```

Choose the `emulator` for the network and `emulator-account`
for the account to deploy to.
Then, select the `FooBar` contract (you may need to scroll down).
This will update your `flow.json` configuration.
After that, you can select `No` when asked to deploy another contract.

To start the Flow emulator, run (you may need to approve a prompt to allow connection the first time):

```bash
flow emulator start
```

In a separate terminal or command prompt, deploy the contract:

```bash
flow project deploy
```

You'll then see a message that says `All contracts deployed successfully`.

## Creating an NFTCollection

To manage multiple NFTs, you'll need an NFT collection.
Start by creating a transaction file for this purpose (we can use the `generate` command again):

```bash
flow generate transaction setup_foobar_collection
```

This creates a transaction file at `cadence/transactions/setup_foobar_collection.cdc`.

Transactions, on the other hand, are pieces of Cadence code
that can mutate the state of the blockchain.
Transactions need to be signed by one or more accounts,
and they can have multiple phases, represented by different blocks of code.

In this file, import the necessary contracts and define a transaction
to create a new collection, storing it in the account's storage.
Additionally, the transaction creates a capability that allows others
to get a public reference to the collection to read from its methods.

This capability ensures secure, restricted access to specific functionalities or information within a resource.

```cadence
import "FooBar"
import "NonFungibleToken"

transaction {

    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {

        // Return early if the account already has a collection
        if signer.storage.borrow<&FooBar.Collection>(from: FooBar.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- FooBar.createEmptyCollection(nftType: Type<@FooBar.NFT>())

        // save it to the account
        signer.storage.save(<-collection, to: FooBar.CollectionStoragePath)

        let collectionCap = signer.capabilities.storage.issue<&FooBar.Collection>(FooBar.CollectionStoragePath)
        signer.capabilities.publish(collectionCap, at: FooBar.CollectionPublicPath)
    }
}
```

There are also examples of [generic transactions](https://github.com/onflow/flow-nft/blob/master/transactions/setup_account_from_address.cdc)
that you can use to setup an account for ANY non-fungible token using metadata views!
You should check those out and try to use generic transactions whenever it is possible.

To store this new NFT collection, create a new account:

```bash
flow accounts create
```

Name it `test-acct` and select `emulator` as the network. Then, using the Flow CLI, run the transaction:

```bash
flow transactions send cadence/transactions/setup_foobar_collection.cdc --signer test-acct --network emulator
```

Congratulations! You've successfully created an NFT collection for the `test-acct`.

## Get an Account's NFTs

To retrieve the NFTs associated with an account, you'll need a script.
Scripts are read-only operations that allow you to query the blockchain.
They don't modify the blockchain's state, and therefore,
they don't require gas fees or signatures (read more about scripts here).

Start by creating a script file using the `generate` command again:

```bash
flow generate script get_foobar_ids
```

In this script, import the necessary contracts and define a function that retrieves the NFT IDs associated with a given account:

```cadence
import "NonFungibleToken"
import "FooBar"

access(all) fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.capabilities.borrow<&{NonFungibleToken.Collection}>(
            FooBar.CollectionPublicPath
    ) ?? panic("The account ".concat(address.toString()).concat(" does not have a NonFungibleToken Collection at ")
                .concat(FooBar.CollectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))

    return collectionRef.getIDs()
}
```

To check the NFTs associated with the `test-acct`, run the script (note: replace `0x123` with the address for `test-acct` from `flow.json`):

```bash
flow scripts execute cadence/scripts/get_foobar_ids.cdc 0x123
```

Since you haven't added any NFTs to the collection yet, the result will be an empty array.

## Minting and Depositing an NFT to a Collection

To mint and deposit an NFT into a collection, create a new transaction file:

```bash
flow generate transaction mint_foobar_nft
```

In this file, define a transaction that takes a recipient's address as an argument.
This transaction will borrow the minting capability from the contract account,
borrow the recipient's collection capability, create a new NFT using the minter,
and deposit it into the recipient's collection:

```cadence
import "NonFungibleToken"
import "FooBar"

transaction(
    recipient: Address
) {

    /// local variable for storing the minter reference
    let minter: &FooBar.NFTMinter

    /// Reference to the receiver's collection
    let recipientCollectionRef: &{NonFungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.storage.borrow<&FooBar.NFTMinter>(from: FooBar.MinterStoragePath)
            ?? panic("The signer does not store a FooBar Collection object at the path "
                        .concat(FooBar.CollectionStoragePath.toString())
                        .concat("The signer must initialize their account with this collection first!"))

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient).capabilities.borrow<&{NonFungibleToken.Receiver}>(
                FooBar.CollectionPublicPath
        ) ?? panic("The account ".concat(recipient.toString()).concat(" does not have a NonFungibleToken Receiver at ")
                .concat(FooBar.CollectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))
    }

    execute {
        // Mint the NFT and deposit it to the recipient's collection
        let mintedNFT <- self.minter.createNFT()
        self.recipientCollectionRef.deposit(token: <-mintedNFT)
    }
}
```

To run this transaction, use the Flow CLI. Remember, the contract account
(which has the minting resource) should be the one signing the transaction.
Pass the test account's address (from the `flow.json` file) as the recipient argument
(note: replace `0x123` with the address for `test-acct` from `flow.json`):

```bash
flow transactions send cadence/transactions/mint_foobar_nft.cdc 0x123 --signer emulator-account --network emulator
```

After executing the transaction, you can run the earlier script to verify
that the NFT was added to the `test-acct`'s collection (remember to replace `0x123`):

```bash
flow scripts execute cadence/scripts/get_foobar_ids.cdc 0x123
```

You should now see a value in the `test-acct`'s collection array!

## Transferring an NFT to Another Account

To transfer an NFT to another account, create a new transaction file using `generate`:

```bash
flow generate transaction transfer_foobar_nft
```

In this file, define a transaction that takes a recipient's address and the ID
of the NFT you want to transfer as arguments.
This transaction will borrow the sender's collection, get the recipient's capability,
withdraw the NFT from the sender's collection, and deposit it into the recipient's collection:

```cadence
import "FooBar"
import "NonFungibleToken"

transaction(recipient: Address, withdrawID: UInt64) {

    /// Reference to the withdrawer's collection
    let withdrawRef: auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}

    /// Reference of the collection to deposit the NFT to
    let receiverRef: &{NonFungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {

        // borrow a reference to the signer's NFT collection
        self.withdrawRef = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(
                from: FooBar.CollectionStoragePath
            ) ?? panic("The signer does not store a FooBar Collection object at the path "
                        .concat(FooBar.CollectionStoragePath.toString())
                        .concat("The signer must initialize their account with this collection first!"))

        // get the recipients public account object
        let recipient = getAccount(recipient)

        // borrow a public reference to the receivers collection
        let receiverCap = recipient.capabilities.get<&{NonFungibleToken.Receiver}>(FooBar.CollectionPublicPath)

        self.receiverRef = receiverCap.borrow()
            ?? panic("The account ".concat(recipient.toString()).concat(" does not have a NonFungibleToken Receiver at ")
                .concat(FooBar.CollectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))
    }

    execute {
        let nft <- self.withdrawRef.withdraw(withdrawID: withdrawID)
        self.receiverRef.deposit(token: <-nft)
    }
}
```

To transfer the NFT, first create a new account:

```bash
flow accounts create
```

Name it `test-acct-2` and select `Emulator` as the network. Next, create a collection for this new account:

```bash
flow transactions send cadence/transactions/setup_foobar_collection.cdc --signer test-acct-2 --network emulator
```

Now, run the transaction to transfer the NFT from `test-acct` to `test-acct-2`
using the addresses from the `flow.json` file (replace `0x124` with `test-acct-2`'s address.
Also note that `0` is the `id` of the `NFT` we'll be transferring):

```bash
flow transactions send cadence/transactions/transfer_foobar_nft.cdc 0x124 0 --signer test-acct --network emulator
```

To verify the transfer, you can run the earlier script for `test-acct-2` (replace `0x124`):

```bash
flow scripts execute cadence/scripts/get_foobar_ids.cdc 0x123
```

The transfer transaction also has a [generic version](https://github.com/onflow/flow-nft/blob/master/transactions/generic_transfer_with_address.cdc)
that developers are encouraged to use!

Congrats, you did it! You're now ready to launch the next fun NFT project on Flow.

## More

- Explore [an example NFT repository](https://github.com/nvdtf/flow-nft-scaffold/blob/main/cadence/contracts/exampleNFT/ExampleNFT.cdc)
- Dive into the details of [the NFT Standard](https://github.com/onflow/flow-nft)
- Check out the [`Burner` contract](../core-contracts/14-burner.md), which is the standard
that all projects should use for handling the destruction of any resource.
- For a deeper dive into `MetadataViews`, consult the [introduction guide](../advanced-concepts/metadata-views.md) or [the FLIP that introduced this feature](https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md).
- Learn about how you can [bridge your NFTs to Flow-EVM](../../blockchain-development-tutorials/cross-vm-apps/vm-bridge.md#cross-vm-bridge) and how you can build your NFT project [to be compatible with the Flow VM bridge](../../blockchain-development-tutorials/cross-vm-apps/vm-bridge.md#prep-your-assets-for-bridging).
- Use a [no code tool for creating NFT projects on Flow](https://www.touchstone.city/)
