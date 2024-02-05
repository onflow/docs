---
title: Accounts
sidebar_label: Accounts
sidebar_position: 3
---

:::info

Are you a Cadence developer looking for information about Accounts on Cadence? If so, check out the Cadence specific documentation [here](../../build/basics/accounts.md)

:::

# Accounts

There are three types of accounts on FlowEVM.

1. **Externally Owned Accounts (EOA)**: EOAs are controlled by private individuals using cryptographic keys and can initiate transactions directly. They are the primary account type for users to interact with the blockchain, holding and sending cryptocurrency or calling smart contract functions.
2. **Contract account**: These accounts hold smart contract code and are governed by this code's logic. Unlike EOAs, Contract Accounts do not initiate transactions on their own but can execute transactions in response to calls they receive from EOAs or other contracts.

EOAs and Contract Accounts on FlowEVM function the same as on other EVM networks. Read more about EOAs and Contract Accounts on the [ethereum docs](https://ethereum.org/developers/docs/accounts).

Finally, 

3. Cadence Owned Accounts (COA)

## Cadence Owned Accounts

Cadence Owned Accounts (COAs) are a new account type on FlowEVM which mediates interactions between FlowEVM and Cadence environments. COAs are intended for use by end-users, the same as EOAs. However, COAs execute FlowEVM transactions as directed from Cadence whereas EOAs run FlowEVM transactions identically to other EVMs via the JSON-RPC endpoint. Unlike EOAs, COAs do not have a key but are assigned a 20-byte EVM address upon creation from Cadence. 

Cadence Owned Accounts (COAs) are created on FlowEVM through the Cadence VM bridge. When a Cadence Owned Account is created, a Cadence resource is created which controls it. This resource will typically be stored in a cadence account which 'owns' the FlowEVM Cadence Owned Account (hence, 'Cadence Owned Account'). Transactions upon the Cadence Owned Account on FlowEVM occur by executing a method available on its corresponding resource in Cadence.

For more information on Cadence Owned Accounts, see the [FlowEVM FLIP](https://github.com/onflow/flips/pull/225/files)

![FlowEVM-Account-Model](flow-evm-account-model.png)