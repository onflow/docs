---
title: Accounts
sidebar_label: Accounts
sidebar_position: 3
---

:::info

Are you a Cadence developer looking for information about Accounts on Cadence? If so, check out the Cadence specific documentation [here](../../build/basics/accounts.md)

:::

# Accounts

There are three types of accounts used for EVM on Flow.

1. **Externally Owned Accounts (EOA)**: EOAs are controlled by private individuals using cryptographic keys and can initiate transactions directly. They are the primary account type for users to interact with the blockchain, holding and sending cryptocurrency or calling smart contract functions.
2. **Contract Accounts**: These accounts hold smart contract code and are governed by this code's logic. Unlike EOAs, Contract Accounts do not initiate transactions on their own but can execute transactions in response to calls they receive from EOAs or other contracts.
3. **Cadence Owned Accounts (COA)**

EOAs and Contract accounts function the same as on other EVM networks.  Read more about EOAs and Contract accounts on the [Ethereum docs](https://ethereum.org/developers/docs/accounts). EVM developers can use EVM on Flow without having to use COAs. However, in order to leverage all the features of Cadence, developers will need to utilize Cadence Owned Accounts.

## Cadence Owned Accounts

Cadence Owned Accounts (COAs) are a new account type on Flow which mediates interactions between EVM and Cadence  environments. COAs are intended for use by end-users, the same as EOAs. However, COAs execute EVM transactions as directed from Cadence whereas EOAs run EVM transactions identically to other EVMs via the JSON-RPC endpoint.
Unlike EOAs, COAs do not have a key but are assigned a 20-byte EVM address upon creation from Cadence.

COAs exist in Cadence as a Resource type which is in turn owned by a Flow account on the Cadence VM. COAs facilitate the execution of EVM transactions using its `run` method. They also enable the deployment of Solidity contracts from Cadence, as well as other utility functions to interact with EVM.

For more information on Cadence Owned Accounts, see the [Flow EVM Support FLIP](https://github.com/onflow/flips/pull/225/files)

![FlowEVM-Account-Model](flow-evm-account-model.png)
