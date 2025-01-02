---
sidebar_position: 2
title: Differences vs. EVM
sidebar_custom_props:
  icon: ↔️
---

Flow [Cadence] is designed with many improvements over prior blockchain networks.  As a result, you'll notice many differences between Flow vs other blockchains, especially Ethereum. This document will be most useful to developers who are already familiar with building on the EVM, but contains details useful to all developers. Check out [Why Flow] for a more general overview of the Flow blockchain.

:::tip

Remember, Flow also supports full [EVM] equivalence!  You can start by moving over your existing contracts, then start building new features that take advantage of the power of Cadence.

:::

## The Flow Cadence Account Model

Key pairs establish ownership on blockchains. In other blockchains (e.g. Bitcoin and Ethereum), the user's address is also calculated based on their public key, making a unique one-to-one relationship between accounts (addresses) and public keys. This also means there is no concrete "account creation" process other than generating a valid key pair. 

With the advent of smart contracts, Ethereum introduced a new account type for deploying contracts that can use storage space (i.e., to store contract bytecode). You can learn more about the distinction between EOA and Contract [accounts on Ethereum].

The [Flow account model] combines the concepts of EOAs and Contract Accounts into a single account model and decouples accounts and public keys. Flow accounts are associated with one or more public keys of varying weights that specify interested parties that need to produce valid cryptographic signatures for each transaction authorized by that account.

![Screenshot 2023-08-16 at 16.43.07.png](../basics/_accounts_images/Screenshot_2023-08-16_at_16.43.07.png)

This natively enables interesting use cases, like key revocation, rotation, and multi-signature transactions. All Flow accounts can use network storage (e.g., for deploying contracts and storing resources like NFTs) based on the number of FLOW tokens they hold.

:::warning

You must run an explicit account creation transaction on Flow to create a new account. [Flow CLI] can create an account on any network with a given public key.  Doing so requires a [very small fee] to be paid in FLOW.

:::

Another key difference is that [storage] for data and assets related to an account are stored in the account, **not** in the contract as with the EVM.

Check out the [Accounts] concept document to learn more about Flow accounts.

## Smart Contracts

On Flow, smart contracts can be written in [Cadence], or Solidity. Cadence syntax is user-friendly and inspired by modern languages like Swift. Notable features of Cadence that make it unique and the key power of the Flow blockchain are:

- **Resource-oriented**: Cadence introduces a new type called Resources. Resources enable onchain representation of digital assets natively and securely. Resources can only exist in one location at a time and are strictly controlled by the execution environment to avoid common mishandling mistakes. Each resource has a unique `uuid` associated with it on the blockchain. Examples of usage are fungible tokens, NFTs, or any custom data structure representing a real-world asset. Check out [Resources] to learn more.
- **Capability-based**: Cadence offers a [Capability-based Security] model. This also enables the use of Resources as structures to build access control. Capabilities and [Entitlements] can provide fine-grained access to the underlying objects for better security. For example, when users list an NFT on a Flow marketplace, they create a new Capability to the stored NFT in their account so the buyer can withdraw the asset when they provide the tokens. Check out [Capability-based Access Control] to learn more about Capabilities on Cadence.

:::warning

Cadence is not compiled. All contracts are public and unobfuscated on Flow. This isn't that different from the EVM, where it's trivial to decompile a contract back into Solidity. 

:::

Check out the [Cadence] website to learn the details of the Cadence programming language.

If you are a Solidity developer, we recommend you start with Cadence's [Guide for Solidity Developers] to dive deeper into the differences between the two languages.

Here are some additional resources that can help you get started with Cadence:

- [The Cadence tutorial]
- ERC-20 equivalent on Flow is the Flow Fungible Token Standard
  - [Repository](https://github.com/onflow/flow-ft)
  - [Tutorial](https://cadence-lang.org/docs/tutorial/fungible-tokens)
- ERC-721 equivalent on Flow is the Flow Non-Fungible Token Standard
  - [Repository](https://github.com/onflow/flow-nft)
  - [Tutorial](https://cadence-lang.org/docs/tutorial/non-fungible-tokens-1)
- Asset marketplaces with Cadence
  - [Tutorial](https://cadence-lang.org/docs/tutorial/marketplace-setup)
  - [NFT Storefront](https://github.com/onflow/nft-storefront/) is an example marketplace standard

## Transactions and Scripts

You can interact with the state on most other blockchains by cryptographically authorizing smart contract function calls. On Flow, transactions offer rich functionality through Cadence code. This allows you to seamlessly combine multiple contracts and function calls into a single transaction that updates the blockchain state - all executing together as one unified operation.

Here is a sample transaction that mints an NFT from `ExampleNFT` contract on Testnet:

```cadence
import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x2bd9d8989a3352a1

/// Mints a new ExampleNFT into recipient's account

transaction(recipient: Address) {

    /// Reference to the receiver's collection
    let recipientCollectionRef: &{NonFungibleToken.Collection}

    /// Previous NFT ID before the transaction executes
    let mintingIDBefore: UInt64

    prepare(signer: &Account) {

        self.mintingIDBefore = ExampleNFT.totalSupply

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient)
            .capabilities.get<&{NonFungibleToken.Collection}>(ExampleNFT.CollectionPublicPath)
            .borrow()
            ?? panic("The recipient does not have a NonFungibleToken Receiver at "
                    .concat(ExampleNFT.CollectionPublicPath.toString())
                    .concat(" that is capable of receiving an NFT.")
                    .concat("The recipient must initialize their account with this collection and receiver first!"))

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

### Authorizing Transactions

The process to authorize a transaction on Flow Cadence is more complex, but also much more powerful than an EVM transaction:

- [Accounts] can have multiple keys with varying weights
- Multiple accounts can sign a single transaction (`prepare` takes any number of arguments)
- Transaction computation fees can be paid by a different account, called the `Payer` account.
- The [transaction nonce] is provided by the `Proposer` account. This enables rate control and order to be dictated by a different party if needed.
- All of the above roles can be the same account.

The same powerful concept also exists for querying the blockchain state using Scripts. Here is a sample script that fetches the `ExampleNFT` IDs owned by a given account on Testnet:

```cadence
/// Script to get NFT IDs in an account's collection

import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x2bd9d8989a3352a1

access(all) fun main(address: Address, collectionPublicPath: PublicPath): [UInt64] {

    let account = getAccount(address)

    let collectionRef = account
        .capabilities.get<&{NonFungibleToken.Collection}>(collectionPublicPath)
        .borrow()
            ?? panic("The account with address "
                    .concat(address.toString())
                    .concat("does not have a NonFungibleToken Collection at "
                    .concat(ExampleNFT.CollectionPublicPath.toString())
                    .concat(". The account must initialize their account with this collection first!")))

    return collectionRef.getIDs()

}
```

Check out [Transactions] and [Scripts] to learn more about the concepts. You can also read the Cadence language reference on [Transactions] to dive deeper.

## Flow Nodes

Developers need a blockchain node to send transactions and fetch state. Flow is based on a multi-node architecture that separates tasks like consensus and computation into separate nodes. You can learn more about the Flow architecture in the [Flow Primer].

Access Nodes are the node type that are most useful for developers, as they provide access to the Flow network [via an API].

## SDKs and Tools

If you're already familiar with blockchain development, here's a comparison between popular software packages and Flow's tooling:

- [Hardhat](https://hardhat.org/) / [Truffle](https://trufflesuite.com/) / [Foundry](https://getfoundry.sh/)
  - [Flow CLI](https://github.com/onflow/flow-cli/) provides local development tools and the [Flow Emulator](https://github.com/onflow/flow-emulator)
- [OpenZeppelin](https://www.openzeppelin.com/)
  - [Emerald OZ](https://oz.ecdao.org/overview)
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
  - [Cadence testing framework](https://cadence-lang.org/docs/testing-framework) enables native tests in Cadence.
  - [overflow](https://github.com/bjartek/overflow) for testing in Go.

<!-- Relative-style links.  Does not render on the page -->

[Why Flow]: ../flow.md
[EVM]: ../../evm/about.md
[accounts on Ethereum]: https://ethereum.org/en/developers/docs/accounts
[Flow CLI]: ../../tools/flow-cli/accounts/create-accounts.md
[very small fee]: ../basics/fees.md#fee-structure
[Flow account model]: ../basics/accounts.md
[Accounts]: ../basics/accounts.md
[storage]: ../basics/accounts.md#storage
[Cadence]: https://cadence-lang.org/
[Resources]: https://cadence-lang.org/docs/language/resources
[Capability-based Security]: https://en.wikipedia.org/wiki/Capability-based_security
[Entitlements]: https://cadence-lang.org/docs/language/access-control#entitlements
[Capability-based Access Control]: https://cadence-lang.org/docs/language/capabilities
[Guide for Solidity Developers]: https://cadence-lang.org/docs/solidity-to-cadence
[The Cadence tutorial]: https://cadence-lang.org/docs/tutorial/first-steps
[transaction nonce]: https://ethereum.org/en/developers/docs/accounts/#an-account-examined
[Transactions]: ../basics/transactions.md
[Scripts]: ../basics/scripts.md
[Transactions]: https://cadence-lang.org/docs/language/transactions
[Flow Primer]: https://flow.com/primer#primer-how-flow-works
[via an API]: ../../networks/flow-networks/index.md
