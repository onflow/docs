---
title: Gasless Transactions
description: Build on a blockchain with no gas fees. Flow enables gasless transactions natively, letting developers build apps without user transaction costs.
sidebar_position: 9
keywords:
  - Backend
  - Flow
  - Flow EVM
  - Flow Node
  - Gas Free
  - EVM Gateway
  - RPC Endpoint
---

# Gasless Transactions on Flow

Flow is one of the easiest platforms for developers to onboard new users. Currently, the Flow Wallet automatically sponsors transactions on **both testnet and mainnet**. This allows developers to build seamless Web3 applications without requiring users to manage gas tokens or pay transaction fees.

In addition to native sponsorship, Flow also supports multiple methods for gas sponsorship that you can tailor to your application’s needs. You can learn about these approaches in more detail [here].

The [Flow Wallet] currently sponsors all transactions - on testnet and mainnet! This is possible because [sponsored transactions] are a native feature of the Flow Protocol. Additional methods for gas sponsorship are available and are described here.

## What You'll Learn

In this tutorial series, you’ll discover how to:

- Configure and deploy a **gas free EVM endpoint** for your backend.
- Allow **gasless transactions** so that users can interact with your app without ever paying gas fees.
- Use Flow’s EVM Gateway service account to automatically cover gas fees for transactions, which ensures a smooth experience for your users.


## Tutorial for how to build on an EVM blockchain without Gas fees

Learn how to set up a gas free EVM endpoint for your backend. All transactions sent through this endpoint aren't charged gas fees from the sender’s account. Instead, the EVM Gateway’s service account will sponsor the gas, which makes transactions completely **gasless for end users**.

Tutorial: [Gas Free EVM Endpoint] 

[Flow Wallet]: https://wallet.flow.com/
[sponsored transactions]: ../../build/cadence/advanced-concepts/account-abstraction#sponsored-transactions
[Gas Free EVM Endpoint]: ./sponsored-transactions-evm-endpoint.md
[here]: https://developers.flow.com/build/cadence/advanced-concepts/account-abstraction#sponsored-transactions