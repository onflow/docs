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
3. **Cadence Owned Accounts (COA)**: Bridging Cadence and EVM environments, COAs operate similarly to EOAs but execute transactions directed from Cadence. Created from Cadence without a key, COAs are assigned a 20-byte EVM address. As a Resource type owned by a Flow account in the Cadence Virtual Machine, COAs can run EVM transactions, deploy Solidity contracts from Cadence, and perform other EVM interactions. This integration allows developers to utilize the full potential of Cadence within the EVM framework on Flow.

![Account-Model](flow-evm-account-model.png)

[EOAs and Contract](https://ethereum.org/developers/docs/accounts) accounts function the same as on other EVM networks. EVM developers can use EVM on Flow without having to use COAs. However, in order to unlock all the features of Cadence, developers may choose to utilize Cadence Owned Accounts.

For more information on Cadence Owned Accounts, see the [Flow EVM Support FLIP](https://github.com/onflow/flips/pull/225/files).