---
title: Build Faster with Flow’s Native Account Abstraction
description: Flow is a fast blockchain with account abstraction built in, enabling developers to deliver smooth onboarding, secure transactions, and better Web3 UX.
keywords:
  - account abstraction
  - multi-sig
  - sponsored transactions
  - bundled transactions
  - account recovery
  - multi-factor authentication
sidebar_position: 2
---

# Blockchain Account Abstraction

Flow is a fast blockchain with account abstraction, designed to make Web3 as seamless as Web2. It provides native support for key use cases that Account Abstraction , which empowers developers to deliver mainstream-ready user experiences. With Cadence, Flow was designed with these use cases in mind through the separation of the contract and transaction layers. This guide demonstrates how Flow supports key use cases that Account Abstraction makes possible.

## Multi-sig transactions on a Fast Blockchain with Account Abstraction

Since accounts are smart contracts, they can be defined in order to require multiple signatures in order to execute a transaction, which unlocks a range of new users that improve the user experience for Web3 apps.

| Account Abstraction                                                                                                                                                         | Flow                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The move from from Externally-Owned Accounts (EOAs) to smart contract accounts allows developers to build in logic to require multiple signatures to execute transactions. | Flow has native support for multi-sig transactions since all accounts are defined as smart contracts. Flow provides [support for multiple keys] to be added to an account and weights can be applied to denote relative priority. |

## Sponsored transactions for mainstream-ready Web3 apps

The requirement that users pay fees to execute transactions in order to use Web3 apps can be a hurdle for newcomers as they begin to explore these experiences. In order to remove this significant point of friction that requires newcomers to acquire crypto before they can get started with an app, developers can subsidize these costs on behalf of users.

| Account Abstraction                                                                                                                                                                                         | Flow                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The ERC-4337 standard introduces the concept of [paymasters], which can allow a developer to pay the fees for a transaction for their users. | Flow has built-in support for [3 different roles] for transactions which provides native support for sponsored transactions. |

## Bundled transactions for faster user experience

To deliver a more streamlined user experience that reduces the amount of interruptions in the form of transaction approvals developers can bundle multiple transactions together into a single transaction that executes the set of operations with one signature.

| Account Abstraction                                                                                                                                                                                                                                                        | Flow                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The ERC-4337 standard outlines support for bundled transactions through a new mempool that holds user operations from smart wallets. Bundlers package sets of these user operations into a single transaction on the blockchain and return the result back to each wallet. | Since Cadence has an explicit separation of contracts and transactions, Flow has protocol-level support to bundle transactions across multiple contracts into a single transaction. |

## Account recovery

Account Abstraction allows developers to build more robust account management features for users, which addresses the major pain point where users lose access to assets forever if they lose the keys to their account. Apps can let recover access to their accounts and enclosed assets through social recovery or pre-approved accounts.

| Account Abstraction                                                                                                                                                                          | Flow                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Smart contract accounts can be defined to include account recovery logic that allows users to define custom recovery methods that can rely on specific accounts or other validated sources. | Since all accounts are smart contracts, Flow has native support for account recovery and cycling of keys to help users regain access to accounts in a secure manner. |

## Multi-factor authentication

Multi-factor authentication is a broadly accepted concept in Web2 apps for secure access to accounts and Account Abstraction allows developers to deliver the same benefits to Web3 users.

| Account Abstraction                                                                                                                                                       | Flow                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Smart contract accounts can require a secondary factor to confirm transactions which can be delivered in the form of familiar confirmation channels such as email or SMS. | Since all accounts are smart contracts, Flow has native support for multi-factor authentication as developers can implement these security mechanisms for their users. |

## Seamless experience

Account Abstraction brings the potential for dramatic improvements to the user experience of Web3 apps. Developers can introduce conditions under which a user can grant a smart contract account to pre-approve transactions under certain conditions, which reduces interruptions for the user to explicitly sign each transaction.

These improvements are especially notable on mobile, where the previous jarring experience required users to switch between apps in approve transactions.

| Account Abstraction                                                                                                                                                                                                           | Flow                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developers can build new features that streamline the user experience of Web3 apps, such as 'session keys' that pre-approve transactions for a period of time or set custom limits on transaction volume or network fees. | Since all accounts are smart contracts, Flow has support for these new controls that allow apps to sign pre-approved transactions based on user controls and preferences. |

## Conclusion

Flow delivers more than just developer convenience, it’s a **high-performance blockchain with account abstraction** built directly into its core protocol. Flow combines speed, scalability, and advanced features like multi-sig, sponsored transactions, bundled operations, account recovery, and multi-factor authentication. This empowers developers to create secure, seamless, and mainstream-ready Web3 experiences but not sacrifice performance.

<!-- Relative links. Will not render on the page -->

[support for multiple keys]: ../basics/accounts.md#account-keys
[paymasters]: https://eips.ethereum.org/EIPS/eip-4337#extension-paymasters 
[3 different roles]: ../basics/transactions.md#signer-roles