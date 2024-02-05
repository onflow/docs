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

1. Externally Owned Account (EOA)
2. Contract Account
3. Cadence Owned Account (COA) 

EOAs and Contract accounts on FlowEVM function the same as on other EVM networks.  Read more about EOAs and Contract 
accounts on the [Ethereum docs](https://ethereum.org/developers/docs/accounts). EVM developers can use FlowEVM without
having to use COAs. However, in order to leverage Flow features for FlowEVM developers need to use COAs.

## Cadence Owned Accounts

Cadence Owned Accounts (COAs) are a new account type on FlowEVM which mediates interactions between FlowEVM and Cadence 
environments. COAs are intended for use by end-users, the same as EOAs. However, COAs execute FlowEVM transactions as 
directed from Cadence whereas EOAs run FlowEVM transactions identically to other EVMs via the JSON-RPC endpoint. 
Unlike EOAs, COAs do not have a key but are assigned a 20-byte EVM address upon creation from Cadence. 

COAs exist in Cadence as a Resource type which is in turn owned by a Flow account on the Cadence VM. COAs facilitate 
the execution of FlowEVM transactions using its `run` method. They also enable the deployment of Solidity contracts from
Cadence, as well as other utility functions to interact with FlowEVM.

For more information on Cadence Owned Accounts, see the [FlowEVM FLIP](https://github.com/onflow/flips/pull/225/files)

![FlowEVM-Account-Model](flow-evm-account-model.png)