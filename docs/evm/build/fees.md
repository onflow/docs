---
title: Fees
sidebar_label: Fees
sidebar_position: 2
---

:::info

Are you a Cadence developer looking for information about Fees on Cadence? If so, check out the Cadence specific documentation [here](../../build/basics/fees.md)

:::

# Fees

EVM transactions are ultra low-cost and use the native FLOW token as gas. [Externally Owned Accounts (EOAs)](https://developers.flow.com/evm/build/accounts) function the same on Flow as other EVM networks like Ethereum.

**Gasless Transactions**

Fees needed to execute transactions on a Web3 app are often a major challenge for new users and can be a barrier to adoption. Builders can easily extend their apps with Cadence to create ‘gasless’ experiences by specifying their app as the [sponsor](https://developers.flow.com/build/differences-vs-evm/account-abstraction#sponsored-transactions) instead of the user.

![FlowEVM-RPC-Payer](flow-rpc-payer.drawio.png)

To learn more about the technical implementation of EVM fees and how they are calculated, read this [explainer](https://forum.flow.com/t/how-evm-transaction-fees-work-on-flow-previewnet/5751).
