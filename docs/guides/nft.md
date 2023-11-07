---
title: How to Create an NFT Project on Flow
sidebar_label: Create an NFT Project
description: Guide to creating an NFT Project with the Flow CLI and Cadence.
sidebar_position: 5
---

This tutorial dives into the technical steps required to craft an NFT on the Flow blockchain, providing developers with a clear roadmap from setup to deployment.

## What are NFTs

NFTs, or Non-Fungible Tokens, represent a unique digital asset verified using blockchain technology. Unlike cryptocurrencies such as Bitcoin, which are fungible and can be exchanged on a one-for-one basis, NFTs are distinct and cannot be exchanged on a like-for-like basis. This uniqueness and indivisibility make them ideal for representing rare and valuable items like art, collectibles, tickets and even real estate. Their blockchain-backed nature ensures the authenticity and ownership of these digital assets.

## Setting Up a Project

To start creating an NFT on the Flow blockchain, you'll first need some tools and configurations in place.

### Installing Flow CLI

The **Flow CLI** (Command Line Interface) provides a suite of tools that allow developers to interact seamlessly with the Flow blockchain.

If you haven't installed the Flow CLI yet and have [Homebrew](https://brew.sh/) installed, you can run `brew install flow-cli`. If you don’t have Homebrew, please follow [the installation guide here](https://developers.flow.com/tools/flow-cli/install).

### Initializing a New Project


> 💡 Note: Here is [a link to the completed code](https://github.com/chasefleming/foobar-nft) if you want to skip ahead or reference as you follow along.

Once you have the Flow CLI installed, you can set up a new project using the `flow setup` command. This command initializes the necessary directory structure and a `flow.json` configuration file (a way to configure your project for contract sources, deployments, accounts, and more):

```bash
flow setup foobar-nft
```

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

To begin, let's create a contract file named `FooBar` for the `FooBar` token, which will be the focus of this tutorial:

```bash
touch cadence/contracts/FooBar.cdc
```

With the contract file in place, you can now set up the basic contract structure:

```cadence
pub contract FooBar {
    init() {}
}
```

## Setting Up Our NFT on the Contract

### Understanding Resources

On the Flow blockchain, "[Resources](https://developers.flow.com/cadence/tutorial/resources-compose)" are a key feature of the Cadence programming language. They represent unique, non-duplicable assets, ensuring that they can only exist in one place at a time. This concept is crucial for representing NFTs on Flow, as it guarantees their uniqueness.

To begin, let's define a basic `NFT` resource. This resource requires an `init` method, which is invoked when the resource is instantiated:

```cadence
pub contract FooBar {

    pub resource NFT {
        init() {}
    }

    init() {}
}
```

Every resource in Cadence has a unique identifier assigned to it. We can use it to set an ID for our NFT. Here's how you can do that:

```cadence
pub contract FooBar {

    pub resource NFT {
        pub let id: UInt64

        init() {
            self.id = self.uuid
        }
    }

    init() {}
}
```

We also need to keep track of the total supply of NFTs in existance. To do this let’s create a `totalSupply` variable on our contract and increase it by one whenever a new NFT is created. We can set this on the initialization of the NFT using the resource `init` function:

```cadence
pub contract FooBar {
    pub var totalSupply: UInt64

    pub resource NFT {
        pub let id: UInt64

        init() {
            self.id = self.uuid
            FooBar.totalSupply = FooBar.totalSupply + 1
        }
    }

    init() {
        self.totalSupply = 0
    }
}
```

To control the creation of NFTs, it's essential to have a mechanism that restricts their minting. This ensures that not just anyone can create an NFT and inflate its supply. To achieve this, you can introduce an `NFTMinter` resource that contains a `createNFT` function:

```cadence
pub contract FooBar {

    // ...[previous code]...

    pub resource NFTMinter {
        pub fun createNFT(): @NFT {
            return <-create NFT()
        }

        init() {}
    }

    init() {
        self.totalSupply = 0
    }
}
```

In this example, the `NFTMinter` resource will be stored on the contract account's storage. This means that only the contract account will have the ability to mint new NFTs. To set this up, add the following line to the contract's `init` function:

```cadence
pub contract FooBar {

    // ...[previous code]...

    init() {
        self.totalSupply = 0
        self.account.save(<- create NFTMinter(), to: /storage/NFTMinter)
    }
}
```

### Setting Up an NFT Collection

Storing individual NFTs directly in an account's storage can cause issues, especially if you want to store multiple NFTs. Instead, it's required to create a collection that can hold multiple NFTs. This collection can then be stored in the account's storage.

Start by creating a new resource named `Collection`. This resource will act as a container for your NFTs, storing them in a dictionary indexed by their IDs. Additionally, to ensure that all NFTs within a collection are destroyed when the collection itself is destroyed, you can add a `destroy` function:

```cadence
pub contract FooBar {

    // ...[NFT resource code]...

    pub resource Collection {
        pub var ownedNFTs: @{UInt64: NFT}

        init() {
            self.ownedNFTs <- {}
        }

        destroy () {
            destroy self.ownedNFTs
        }
    }

    // ...[NFTMinter code]...
}
```

To allow accounts to create their own collections, add a function in the main contract that creates a new `Collection` and returns it:

```cadence
pub contract FooBar {

    pub var ownedNFTs: @{UInt64: NFT}

    pub fun createEmptyCollection(): @Collection {
        return <-create Collection()
    }

    // ...[following code]...
}
```

To manage the NFTs within a collection, you'll need functions to deposit and withdraw NFTs. Here's how you can add a `deposit` function:

```cadence
pub resource Collection {

    pub var ownedNFTs: @{UInt64: NFT}

    pub fun deposit(token: @NFT) {
        let tokenID = token.id
        self.ownedNFTs[token.id] <-! token
    }

    // ...[following code]...
}
```

Similarly, you can add a `withdraw` function to remove an NFT from the collection:

```cadence
pub resource Collection {
    // ...[deposit code]...

    pub fun withdraw(withdrawID: UInt64): @NFT {
        let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Token not in collection")
        return <- token
    }

    // ...[createEmptyCollection code]...
}
```

To facilitate querying, you'll also want a function to retrieve all the NFT IDs within a collection:

```cadence
pub resource Collection {
    // ...[withdraw code]...

    pub fun getIDs(): [UInt64] {
        return self.ownedNFTs.keys
    }

    // ...[createEmptyCollection code]...
}
```

For security reasons, you might not want to expose all the functions of the Collection to everyone. Instead, you can create an [interface](https://developers.flow.com/cadence/language/interfaces) that exposes only the methods you want to make public. In Cadence, interfaces act as a blueprint for resources and structures, ensuring that certain methods or properties exist. By leveraging these interfaces, you establish clear boundaries and standardized interactions. In this case, you might want to expose only the `deposit` and `getIDs` methods. This interface can then be used to create capabilities, ensuring that only the allowed methods are accessible.

```cadence
pub contract FooBar {

    // ...[previous code]...

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NFT)
        pub fun getIDs(): [UInt64]
    }

    pub resource Collection: CollectionPublic {
        // ...[Collection code]...
    }

    // ...[following code]...
}
```

## Fitting the Flow NFT Standard

To ensure compatibility and interoperability within the Flow ecosystem, it's crucial that your NFT contract adheres to the [Flow NFT standard](https://github.com/onflow/flow-nft). This standard defines the events, functions, resources, and other elements that a contract should have. By following this standard, your NFTs will be compatible with various marketplaces, apps, and other services within the Flow ecosystem.

### Applying the Standard

To start, you need to inform the Flow blockchain that your contract will implement the `NonFungibleToken` standard. Since it's a standard, there's no need for deployment. It's already available on the Emulator, Testnet, and Mainnet for the community's benefit.

Begin by importing the token standard into your contract:

```cadence
import "NonFungibleToken"

pub contract FooBar: NonFungibleToken {

    // ...[rest of code]...

}
```

### Adding Standard Events

To ensure interoperability, the Flow NFT standard requires certain events to be emitted during specific operations.

### Adding ContractInitialized Event

For instance, when the contract is initialized, a `ContractInitialized` event should be emitted:

```cadence
import "NonFungibleToken"

pub contract FooBar: NonFungibleToken {

    pub event ContractInitialized()

    // ...[rest of code]...

    init() {
        self.totalSupply = 0
        emit ContractInitialized()
        self.account.save(<- create NFTMinter(), to: /storage/NFTMinter)
    }
}
```

### Adding Withdraw and Deposit Events

Additionally, when NFTs are withdrawn or deposited, corresponding events should be emitted:

```cadence
import "NonFungibleToken"

pub contract FooBar: NonFungibleToken {

     pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    // ...[rest of code]...
}
```

You can then update your `deposit` and `withdraw` functions to emit these events:

```cadence
pub fun deposit(token: @NFT) {
    let tokenID = token.id
    self.ownedNFTs[token.id] <-! token
    emit Deposit(id: tokenID, to: self.owner?.address) // new
}

pub fun withdraw(withdrawID: UInt64): @NFT {
    let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Token not in collection")
    emit Withdraw(id: token.id, from: self.owner?.address) // new
    return <- token
}
```

### Update NFT Resource

The `NFT` resource should also be updated to implement the `NonFungibleToken.INFT` interface:

```cadence
pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64

    init() {
        self.id = self.uuid
        FooBar.totalSupply = FooBar.totalSupply + 1
    }
}
```

### Adding Provider, Receiver, CollectionPublic

Your `Collection` resource should also implement the `Provider`, `Receiver`, and `CollectionPublic` interfaces from the standard:

```cadence
pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
    // ...[rest of code]...
}
```

With these implementations, you can now remove your custom `CollectionPublic` interface since the standard already provides it.

To ensure users can access a read-only reference to an NFT in the collection without actually removing it, introduce the **`borrowNFT`** function.

```cadence
pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {

    // ...[getIDs code]...

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
        return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }

    // ...[rest of code]...
}
```

Lastly, update the `ownedNFTs`, `deposit`, and `withdraw` variables/methods to use the `NonFungibleToken.NFT` type:

```cadence
pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

pub fun deposit(token: @NonFungibleToken.NFT) {
    //...[deposit code]...
}

pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
    //...[withdraw code]...
}
```

## Deploying the Contract

With your contract ready, it's time to deploy it. First, add the `FooBar` contract to the `flow.json` configuration file:

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

Choose the `emulator` for the network and `emulator-account` for the account to deploy to. Then, select the `FooBar` contract (you may need to scroll down). This will update your `flow.json` configuration. After that, you can select `No` when asked to deploy another contract.

To start the Flow emulator, run (you may need to approve a prompt to allow connection the first time):

```bash
flow emulator start
```

In a separate terminal or command prompt, deploy the contract:

```bash
flow project deploy
```

You’ll then see a message that says `All contracts deployed successfully`.

## Creating an NFTCollection

To manage multiple NFTs, you'll need an NFT collection. Start by creating a transaction file for this purpose:

```bash
touch cadence/transactions/CreateCollection.cdc
```

Transactions, on the other hand, are pieces of Cadence code that can mutate the state of the blockchain. Transactions need to be signed by one or more accounts, and they can have multiple phases, represented by different blocks of code.

In this file, import the necessary contracts and define a transaction to create a new collection, storing it in the account's storage. Additionally, for the **`CollectionPublic`** interface, create a capability that allows others to read from its methods. This capability ensures secure, restricted access to specific functionalities or information within a resource.

```cadence
import "FooBar"
import "NonFungibleToken"

transaction {
    prepare(acct: AuthAccount) {
        acct.save(<- FooBar.createEmptyCollection(), to: /storage/FooBarCollection)
        acct.link<&FooBar.Collection{NonFungibleToken.CollectionPublic}>(/public/FooBarCollection, target: /storage/FooBarCollection)
    }

    execute {
        log("NFT collection created")
    }
}
```

To store this new NFT collection, create a new account:

```bash
flow accounts create
```

Name it `test-acct` and select `emulator` as the network. Then, using the Flow CLI, run the transaction:

```bash
flow transactions send cadence/transactions/CreateCollection.cdc --signer test-acct --network emulator
```

Congratulations! You've successfully created an NFT collection for the `test-acct`.

## Get an Account's NFTs

To retrieve the NFTs associated with an account, you'll need a script. Scripts are read-only operations that allow you to query the blockchain. They don't modify the blockchain's state, and therefore, they don't require gas fees or signatures (read more about scripts here).

Start by creating a script file:

```bash
touch cadence/scripts/GetNFTs.cdc
```

In this script, import the necessary contracts and define a function that retrieves the NFT IDs associated with a given account:

```cadence
import "FooBar"
import "NonFungibleToken"

pub fun main(account: Address): [UInt64] {
    let publicReference = getAccount(account).getCapability(/public/FooBarCollection)
        .borrow<&FooBar.Collection{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow public reference to FooBar")

    return publicReference.getIDs()
}
```

To check the NFTs associated with the `test-acct`, run the script (note: replace `0x123` with the address for `test-acct` from `flow.json`):

```bash
flow scripts execute cadence/scripts/GetNFTs.cdc 0x123
```

Since you haven't added any NFTs to the collection yet, the result will be an empty array.

## Minting and Depositing an NFT to a Collection

To mint and deposit an NFT into a collection, create a new transaction file:

```bash
touch cadence/transactions/DepositNFT.cdc
```

In this file, define a transaction that takes a recipient's address as an argument. This transaction will borrow the minting capability from the contract account, borrow the recipient's collection capability, create a new NFT using the minter, and deposit it into the recipient's collection:

```cadence
import "FooBar"
import "NonFungibleToken"
transaction(recipient: Address) {
    prepare(acct: AuthAccount) {
        let nftMinter = acct.borrow<&FooBar.NFTMinter>(from: /storage/NFTMinter)
            ?? panic("Could not borrow a reference to the NFTMinter")
        let recipientReference = getAccount(recipient).getCapability(/public/FooBarCollection)
            .borrow<&FooBar.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
        recipientReference.deposit(token: <- nftMinter.createNFT())
    }
    execute {
        log("New NFT deposited into collection")
    }
}
```

To run this transaction, use the Flow CLI. Remember, the contract account (which has the minting resource) should be the one signing the transaction. Pass the test account's address (from the `flow.json` file) as the recipient argument (note: replace `0x123` with the address for `test-acct` from `flow.json`):

```bash
flow transactions send cadence/transactions/DepositNFT.cdc 0x123 --signer emulator-account --network emulator
```

After executing the transaction, you can run the earlier script to verify that the NFT was added to the `test-acct`'s collection (remember to replace `0x123`):

```bash
flow scripts execute cadence/scripts/GetNFTs.cdc 0x123
```

You should now see a value in the `test-acct`'s collection array!

## Transferring an NFT to Another Account

To transfer an NFT to another account, create a new transaction file:

```bash
touch cadence/transactions/TransferNFT.cdc
```

In this file, define a transaction that takes a recipient's address and the ID of the NFT you want to transfer as arguments. This transaction will borrow the sender's collection, get the recipient's capability, withdraw the NFT from the sender's collection, and deposit it into the recipient's collection:

```cadence
import "FooBar"

transaction(recipient: Address, id: UInt64) {
    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&FooBar.Collection>(from: /storage/FooBarCollection)!
        let recipientReference = getAccount(recipient).getCapability(/public/FooBarCollection)
            .borrow<&FooBar.Collection{FooBar.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
        recipientReference.deposit(token: <- collection.withdraw(withdrawID: id))
    }

    execute {
        log("NFT transferred to another collection")
    }
}
```

To transfer the NFT, first create a new account:

```bash
flow accounts create
```

Name it `test-acct-2` and select `Emulator` as the network. Next, create a collection for this new account:

```bash
flow transactions send cadence/transactions/CreateCollection.cdc --signer test-acct-2 --network emulator
```

Now, run the transaction to transfer the NFT from `test-acct` to `test-acct-2` using the addresses from the `flow.json` file (replace `0x124` with `test-acct-2`'s address. Also note that `0` is the `id` of the `NFT` we'll be transferring):

```bash
flow transactions send cadence/transactions/TransferNFT.cdc 0x124 0 --signer test-acct --network emulator
```

To verify the transfer, you can run the earlier script for `test-acct-2` (replace `0x124`):

```bash
flow scripts execute cadence/scripts/GetNFTs.cdc 0x123
```

## Adding MetadataViews

Many NFT projects include metadata associated with the NFT, such as a name, description, or image. However, different projects might store this metadata in various formats. To ensure compatibility across the Flow ecosystem, Flow uses `MetadataViews` to standardize the representation of this metadata.

There are two types of Metadata Views: NFT level and contract level. In this guide, we’ll show you how to implement the most basic display, but for a deeper dive into what is possible, check out the [MetadataViews API doc](https://developers.flow.com/references/core-contracts/flow-nft/MetdataViews/MetadataViews).

### NFT Metadata

For the NFT metadata, you'll add a simple `MetadataView` called `Display`, which includes a `name`, `description`, and `thumbnail`. This format is common for many NFT projects. (For more details, refer to the [Display documentation](https://developers.flow.com/references/core-contracts/flow-nft/MetdataViews/MetadataViews#display)).

Start by importing the `MetadataViews` contract into your `FooBar` contract:

```cadence
import "MetadataViews"
```

Because this is already deployed to Emulator and our `flow setup` command added it to our `flow.json`, there is no more configuration we need to do.

Update the `NFT` resource to implement the `[ViewResolver` interface](https://github.com/onflow/flow-nft/blob/master/contracts/MetadataViews.cdc#L20) provided by the MetadataViews contract. This interface specifies that a `getViews` function and a `resolveView` function should exist. Then, add fields for `name`, `thumbnail`, and `description`:

```cadence
pub resource NFT: NonFungibleToken.INFT, MetadataViews.ViewResolver {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String

    // ...[rest of NFT code]...
}
```

Now, add the methods from the `ViewResolver` interface to the `NFT` resource. These methods will return the metadata in the standardized `Display` format:

```cadence
pub resource NFT: NonFungibleToken.INFT, ViewResolver {
    // ...[NFT code]...

    pub fun getViews(): [Type] {
        return [Type<MetadataViews.Display>()]
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
        if (view == Type<MetadataViews.Display>()) {
            return MetadataViews.Display(
                name: self.name,
                thumbnail: self.thumbnail,
                description: self.description
            )
        }
        return nil
    }
}
```

Finally, to retrieve our NFT along with its metadata, we currently have a `borrowNFT` function. However, this function only returns a `NonFungibleToken.NFT` with an `id` field. To address this, let's introduce a new function in our collection that borrows the NFT and returns it as a `FooBar` NFT. We'll utilize the `auth` [syntax to downcast](https://developers.flow.com/cadence/language/operators#conditional-downcasting-operator-as) the `NonFungibleToken.NFT` to our specific type.

```cadence
pub fun borrowFooBarNFT(id: UInt64): &FooBar.NFT? {
    if self.ownedNFTs[id] != nil {
        let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
        return ref as! &FooBar.NFT
    }

    return nil
}
```

### Contract Metadata

For the contract level metadata, we need to create an interface that defines the required methods for the contract. Luckily, there is already a commonly used contract interface called `ViewResolver` deployed both to the Emulator and other networks. This interface requires a `getViews` and a `resolveViews` method. It is also deployed on [Testnet](https://testnet.contractbrowser.com/A.631e88ae7f1d7c20.ViewResolver) and [Mainnet](https://contractbrowser.com/A.1d7e57aa55817448.ViewResolver). You can find its address in the `flow.json` we generated with the `setup` command. To use it, return to your `FooBar` contract, import this new contract, and specify that `FooBar` should implement it.


```cadence
import "NonFungibleToken"
import "MetadataViews"
import "ViewResolver"

pub contract FooBar: NonFungibleToken, ViewResolver {
    //...[contract code]...
}
```

Just like the NFT (except at a contract level), we’ll add functions for `getView` which returns the `Display` and `resolveViews` which tells it how to get the `Display` values:

```cadence
pub contract FooBar: NonFungibleToken, ViewResolver {

//...[all code above contract init]...

pub fun getViews(): [Type] {
        return [Type<MetadataViews.Display>()]
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
        switch view {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: /storage/FooBarCollection,
                    publicPath: /public/FooBarCollection,
                    providerPath: /private/FooBarCollection,
                    publicCollection: Type<&FooBar.Collection{NonFungibleToken.CollectionPublic}>(),
                    publicLinkedType: Type<&FooBar.Collection{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                    providerLinkedType: Type<&FooBar.Collection{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                    createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                        return <-FooBar.createEmptyCollection()
                    })
                )
        }
        return nil
    }

//...[contract init code]...

}
```

Finally, we need a way to read this data like we did with the NFT. Let’s also make a `borrowViewResolver` function that we add below the `borrowFooBarNFT` method inside of the `Collection`:

```cadence
pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {

    // ...[borrowFooBarNFT]...

    pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
        let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
        return ref as! &FooBar.NFT
    }

    // ...[Collection init]...
}
```

Congrats, you did it! You’re now ready to launch the next fun NFT project on Flow.

## More

- Explore [an example NFT repository](https://github.com/nvdtf/flow-nft-scaffold/blob/main/cadence/contracts/exampleNFT/ExampleNFT.cdc)
- Watch a [video tutorial on creating an NFT project in the Flow Playground](https://www.youtube.com/watch?v=bQVXSpg6GE8)
- Dive into the details of [the NFT Standard](https://github.com/onflow/flow-nft)
- For a deeper dive into `MetadataViews`, consult the [API documentation](https://developers.flow.com/references/core-contracts/flow-nft/MetdataViews/MetadataViews#docusaurus_skipToContent_fallback) or [the FLIP that introduced this feature](https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md).
- Use a [no code tool for creating NFT projects on Flow](https://www.touchstone.city/)