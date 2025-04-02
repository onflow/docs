---
title: Accounts
sidebar_label: Accounts
sidebar_position: 7
---

:::info

Are you a Cadence developer looking for information about Accounts on Cadence? If so, check out the Cadence specific documentation [here](../build/basics/accounts.md)

:::

# Accounts

There are three types of accounts used for Flow EVM.

1. **Externally Owned Accounts (EOA)**: EOAs are controlled by private individuals using cryptographic keys and can initiate transactions directly. They are the primary account type for users to interact with the blockchain, holding and sending cryptocurrency or calling smart contract functions.
2. **Contract Accounts**: These accounts hold smart contract code and are governed by this code's logic. Unlike EOAs, Contract Accounts do not initiate transactions on their own but can execute transactions in response to calls they receive from EOAs or other contracts.
3. **Cadence Owned Accounts (COA)**: This is an account type unique to Flow EVM. These accounts are managed by [Cadence resources](https://cadence-lang.org/docs/language/resources) and can be used to interact with the Flow EVM from within the Cadence environment.

EOAs and Contract accounts function the same as on other EVM networks. Users may interact with these accounts using the standard EVM JSON-RPC API ([see endpoints here](./using.mdx)). You can read more about EOAs and Contract accounts on the [Ethereum docs](https://ethereum.org/developers/docs/accounts).

However, in order to leverage all the features of Cadence, developers will need to utilize Cadence Owned Accounts.

:::danger

🚨🚨🚨 **ASSET LOSS RISK** 🚨🚨🚨

Cadence-Owned Accounts, easily identifiable by the leading zeroes (`0x00000000000000000000000`) **only exist on Flow**. The keys to these addresses are generated in a way that is not compatible with other networks.

As a result, any assets sent to one of these addresses on another network **will be lost permanently!**

We're working with major wallet providers to block such transfers, and recommend that all app and wallet developers do the same.

:::

## Cadence Owned Accounts

A Cadence Owned Account (COA) is a natively supported EVM smart contract wallet type that allows a Cadence resource to own and control an EVM address. This native wallet type provides the primitives needed to bridge or control assets across Flow EVM and Cadence facilitating composability between environments.

![Account-Model](./flow-evm-account-model.png)

### Why use COAs?

COAs create powerful new opportunities to improve the UX, functionality and utility of EVM applications by taking advantage of Cadence. Key benefits include:

- **Enhanced Composability**: Applications written in Solidity can be extended and composed upon within Cadence. This allows developers to build upon existing EVM applications and deliver a more feature-rich user experience.

- **Atomic Interactions**: Developers are able to execute multiple EVM transactions atomically from a COA. This is particularly useful for applications that require multiple transactions to be executed within a single block, or require all prior transactions' state changes to revert if a single transaction in the batch fails. This is not possible natively using EOAs or with `UserOperations` when using the ERC-4337 standard; in both cases each individual transaction is distinct and cannot be reverted back once state has changed.

- **Native Account Abstraction**: COAs are controlled by Cadence resources, which are in turn owned by Flow accounts. [Flow accounts](./accounts.md) have built-in support for multi-signature authentication, key rotation, and account recovery. As a Cadence resource, COAs naturally inherit [these features](../build/advanced-concepts/account-abstraction.md).

- **Fine-Grained Access Control**: As Cadence resources, access to a COA can be governed by more sophisticated policies than those available with basic EVM accounts. By utilizing powerful Cadence access control primitives such as [capabilities and entitlements](https://cadence-lang.org/docs/language/access-control), developers can restrict who is able to interact with a COA and what actions they are permitted to perform.

### Differences from Traditional EVM Accounts

COAs are smart contracts that are deployed to, and are fully accessible within, Flow EVM. However, unlike traditional EVM accounts (e.g. EOAs or smart contract accounts), COAs are owned by a Cadence resource. This means that COAs can be created and controlled natively within the Cadence execution environment.

Unlike EOAs, COAs do not have an associated key, but are assigned a 20-byte EVM address upon creation from Cadence. This address is based on the UUID of the Cadence resource and is prefixed with `0x000000000000000000000002`. This address determines the location of the COA smart contract deployment and is the EVM address that is used to interact with the COA.

A COA may instantiate transactions itself (where the COA's EVM address acts as `tx.origin`). This behaviour differs from other EVM environments, where only externally owned accounts (EOAs) may instantiate transactions.

Because COAs are owned by Cadence resources, an EVM transaction is not required to trigger a transaction from a COA (e.g. a transaction to make a call to `execute` or EIP-4337's `validateUserOpMethod`). Instead, call transactions may be triggered directly from the Cadence resource that owns the COA. By invoking the `call` method on this resource, a transaction event will be emitted within the EVM environment.

### More Information

To learn how to create and interact with COAs in Cadence, see the guide for [Interacting with COAs from Cadence](../tutorials/cross-vm-apps/interacting-with-coa.md).

For more information about Cadence Owned Accounts, see the [Flow EVM Support FLIP](https://github.com/onflow/flips/pull/225/files)
