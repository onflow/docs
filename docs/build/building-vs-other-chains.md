---
sidebar_position: 3
title: Differences vs. Other Blockchains
sidebar_custom_props:
  icon: ↔️
---

This document summarizes the differences you might encounter between building on Flow vs. other blockchains, especially Ethereum. This will be most useful to developers who are already familiar with building on a blockchain system. Check out [Introduction to Flow](../build/flow.md) for a more beginner-friendly overview of the Flow blockchain.

Summary of key differences covered:

- The Flow account model
- Smart contracts
    - The Cadence language
    - Transactions and Scripts
    - Events
- Nodes
- SDKs and Tools

## The Flow Account Model

Key pairs establish ownership on blockchains. In other blockchains (e.g. Bitcoin), the user’s address is also calculated based on their public key, making a unique one-to-one relationship between accounts (addresses) and public keys. This also means there is no concrete “account creation” process other than generating a valid key pair. With the advent of smart contracts, Ethereum introduced a new account type for deploying contracts that can use storage space (i.e., to store contract bytecode). You can learn more about the distinction between EOA and Contract accounts on Ethereum [here](https://ethereum.org/en/developers/docs/accounts/).

Flow combines the concepts of EOAs and Contract Accounts into a single account model and decouples accounts and public keys. Flow accounts are associated with one or more public keys of varying weights that specify interested parties that need to produce valid cryptographic signatures for each transaction authorized by that account.

![Screenshot 2023-08-16 at 16.43.07.png](../build/key-concepts/_accounts_images/Screenshot_2023-08-16_at_16.43.07.png)

This natively enables interesting use cases, like key revocation, rotation, and multi-signature transactions. All Flow accounts can use network storage (e.g., for deploying contracts and storing resources like NFTs) based on the number of FLOW tokens they hold.

<Callout type="info">

You must run an explicit account creation transaction on Flow to create a new account. [Flow CLI](../tools/flow-cli/accounts/create-accounts.md) can create an account on any network with a given public key.

</Callout>

Check out the [Accounts](../build/key-concepts/accounts.md) concept document to learn more about Flow accounts.

## Smart Contracts

On Flow, smart contracts are written in Cadence. Cadence syntax is user-friendly and inspired by modern languages like Swift. Notable features of Cadence that make it unique and the key power of the Flow blockchain are:

- **Resource-oriented**: Cadence introduces a new type called Resources. Resources enable onchain representation of digital assets natively and securely. Resources can only exist in one location at a time and are strictly controlled by the execution environment to avoid common mishandling mistakes. Each resource has a unique `uuid` associated with it on the blockchain. Examples of usage are fungible tokens, NFTs, or any custom data structure representing a real-world asset. Check out [Resources](../cadence/language/resources.mdx) to learn more.
- **Capability-based**: Cadence offers a [Capability-based Security](https://en.wikipedia.org/wiki/Capability-based_security) model. This also enables the use of Resources as structures to build access control. Capabilities can provide fine-grained access to the underlying objects for better security. For example, when users list an NFT on a Flow marketplace, they create a new Capability to the stored NFT in their account so the buyer can withdraw the asset when they provide the tokens. Check out [Capability-based Access Control](../cadence/language/capabilities.md) to learn more about Capabilities on Cadence.

<Callout type="info">

Cadence is not compiled. All contracts are open source on Flow.

</Callout>

Check out the [Cadence website](https://cadencelang.dev/) to learn more about Cadence.

If you’re already familiar with smart contracts, here are some resources that can help you get started with Cadence:

- [The Cadence tutorial](../cadence/tutorial/01-first-steps.md)
- [Guide for Solidity Developers](../cadence/solidity-to-cadence.md)
- ERC-20 equivalent on Flow is the Flow Fungible Token Standard
    - [Repository](https://github.com/onflow/flow-ft)
    - [Tutorial](../cadence/tutorial/06-fungible-tokens.md)
- ERC-721 equivalent on Flow is the Flow Non-Fungible Token Standard
    - [Repository](https://github.com/onflow/flow-nft)
    - [Tutorial](../cadence/tutorial/05-non-fungible-tokens-1.md)
- Asset marketplaces with Cadence
    - [Tutorial](../cadence/tutorial/07-marketplace-setup.md)
    - [NFT Storefront](https://github.com/onflow/nft-storefront/) is an example marketplace standard

### Transactions and Scripts

You can interact with the state on most other blockchains by cryptographically authorizing smart contract function calls. On Flow, transactions are more complex and are pieces of Cadence code. This means that any number of contracts and function calls can be composed together atomically to mutate the blockchain state.

Here is a sample transaction that mints an NFT from `ExampleNFT` contract on Testnet:

```cadence
import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x2bd9d8989a3352a1

/// Mints a new ExampleNFT into recipient's account

transaction(recipient: Address) {

    /// Reference to the receiver's collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    /// Previous NFT ID before the transaction executes
    let mintingIDBefore: UInt64

    prepare(signer: AuthAccount) {

        self.mintingIDBefore = ExampleNFT.totalSupply

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(ExampleNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

    }

    execute {

        let currentIDString = self.mintingIDBefore.toString()

        // Mint the NFT and deposit it to the recipient's collection
        ExampleNFT.mintNFT(
            recipient: self.recipientCollectionRef,
            name: "Example NFT #".concat(currentIDString),
            description: "Example description for #".concat(currentIDString),
            thumbnail: "https://robohash.org/".concat(currentIDString),
            royalties: []
        )
    }

    post {
        self.recipientCollectionRef.getIDs().contains(self.mintingIDBefore): "The next NFT ID should have been minted and delivered"
        ExampleNFT.totalSupply == self.mintingIDBefore + 1: "The total supply should have been increased by 1"
    }
}
```

Authorizing transactions is also more complex on Flow involving multiple roles:

- Accounts can have multiple keys with varying weights
- Multiple accounts can sign a single transaction (`prepare` takes any number of arguments)
- Transaction computation fees can be paid by a different account, called the `Payer` account.
- The transaction [nonce](https://ethereum.org/en/developers/docs/accounts/#an-account-examined) is provided by the `Proposer` account. This enables rate control and order to be dictated by a different party if needed.
- All of the above roles can be the same account.

The same powerful concept also exists for querying the blockchain state using Scripts. Here is a sample script that fetches the `ExampleNFT` IDs owned by a given account on Testnet:

```cadence
/// Script to get NFT IDs in an account's collection

import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x2bd9d8989a3352a1

pub fun main(address: Address, collectionPublicPath: PublicPath): [UInt64] {

    let account = getAccount(address)

    let collectionRef = account
        .getCapability(collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection at specified path")

    return collectionRef.getIDs()

}
```

Check out [Transactions](../build/key-concepts/transactions.md) and [Scripts](../build/key-concepts/scripts.md) to learn more about the concepts. You can also read the Cadence language reference on [Transactions](../cadence/language/transactions.md) to dive deeper.

## Flow Nodes

Developers need a blockchain node to send transactions and fetch state. Flow is based on a multi-node architecture that separates roles like consensus and computation. You can learn more about the Flow architecture [here](https://flow.com/primer#primer-how-flow-works).

Access Nodes are the node type that are most useful for developers, as they provide access to the Flow network via an API. Flow provides public access nodes for multiple networks. They provide two flavours of APIs:

- [HTTP API](https://developers.flow.com/http-api)
- gRPC
    - Mainnet: `access.mainnet.nodes.onflow.org:9000`
    - Testnet: `access.devnet.nodes.onflow.org:9000`
    - [Specification](./run-and-secure/nodes/access-api.mdx)

### Running Your Own Node

If you’re getting started you don’t need to run your own node and you can use the above public nodes. The public access nodes are rate-limited, so as your product matures you might want to run your own node. There are multiple options available:

- Start with a [Light (Observer) Node](../node-ops/node-operation/observer-node.mdx).
- You can also use a third-party provider like [Quicknode](https://www.quicknode.com/docs/flow).

Check out [Running a Node](../node-ops/running-node.md) for more information.

## SDKs and Tools

If you’re already familiar with blockchain development, here's a comparison between popular software packages and Flow's tooling:

- [hardhat](https://hardhat.org/) / [Truffle](https://trufflesuite.com/) / [Foundry](https://github.com/foundry-rs/foundry)
    - [Flow CLI](https://github.com/onflow/flow-cli/) provides local development tools and the [Flow Emulator](https://github.com/onflow/flow-emulator)
- [OpenZeppelin](https://www.openzeppelin.com/)
    - No equivalent, you can pick contracts from any core Flow contract repository
- [go-ethereum](https://geth.ethereum.org/)
    - [Flow Go SDK](https://github.com/onflow/flow-go-sdk/)
    - [FCL](https://github.com/onflow/fcl-js/) also provides Backend API for Flow in JS
- [web3.js](https://github.com/web3/web3.js)
    - [FCL](https://github.com/onflow/fcl-js/)
    - [flow-cadut](https://github.com/onflow/flow-cadut) provides more utilities for using Flow on Web
- [Remix](https://remix.ethereum.org/)
    - [Flow Playground](https://play.flow.com/) provides basic experimentation on the web
    - [Cadence VSCode Extension](https://marketplace.visualstudio.com/items?itemName=onflow.cadence) is strongly suggested to install for local development
- [Testing Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/testing/)
    - [Cadence testing framework](../cadence/testing-framework.mdx) enables native tests in Cadence.
    - [overflow](https://github.com/bjartek/overflow) for testing in Go.
    - [js-testing](https://github.com/onflow/flow-js-testing) for testing in JS.