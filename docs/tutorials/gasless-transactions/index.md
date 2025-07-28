---
title: Gasless Transactions
description: Learn about techniques for building apps with gasless transactions for your users.
sidebar_position: 4
keywords:
  - Backend
  - Flow
  - Flow EVM
  - Flow Node
  - Gas Free
  - EVM Gateway
  - RPC Endpoint
---

# Gasless Transactions

The [Flow Wallet] currently sponsors all transactions - on testnet and mainnet! This is possible because [sponsored transactions] are a native feature of the Flow Protocol. Additional methods for gas sponsorship are available and are described here.

## What You'll Learn

In this tutorial series, you'll discover how to:

- Set up a gas free EVM endpoint for your backend

## Tutorials

- [Gas Free EVM Endpoint] - Learn how to set up a gas free EVM endpoint for your backend, all transactions sent through this endpoint will not be charged for gas fees from the sender's account(EVM Gateway's service account will be used to pay for the gas fees).

[Flow Wallet]: https://wallet.flow.com/
[sponsored transactions]: /build/advanced-concepts/account-abstraction#sponsored-transactions
[Gas Free EVM Endpoint]: ./gas-free-evm-endpoint.md
