---
title: FLOW Coin
sidebar_position: 10
description: Learn about the FLOW coin, its role as the native token of the Flow blockchain, and how to acquire, use, and build with it. Understand staking, delegation, and transaction fee mechanisms.
keywords:
  - FLOW coin
  - FLOW token
  - native token
  - fungible token
  - staking
  - delegation
  - transaction fees
  - Flow protocol
  - Flow rewards
  - token utility
  - Flow wallet
  - token custody
  - Flow transactions
  - Flow governance
  - Flow ecosystem
---

## Introduction

This section contains information about the FLOW Coin for individual backers, wallet providers, custodians and node operators.

### FLOW as a Native Coin

FLOW is the default coin for the Flow protocol, meaning it is used for all protocol-level fee payments,
rewards and staking transactions. FLOW implements the standard [Flow Fungible Token interface](https://github.com/onflow/flow-ft),
which all other on-chain fungible tokens also conform to. This interface is defined in Cadence,
Flow's native smart-contract programming language, which makes it easy to write applications that
interact with FLOW.

## How to Get FLOW

There are two ways to acquire FLOW Coins as yield:

1. [Earn FLOW as a Validator or Delegator](../../networks/staking/06-technical-overview.md): Receive newly-minted FLOW as a reward for running a node.
1. [Earn FLOW as a Community Contributor](https://github.com/onflow/developer-grants): Flow offers grants for selected proposals as well as RFPs for teams to submit proposals for funded development

## How to Use FLOW

With FLOW, you can:

- Spend
- Stake
- Delegate
- Hold
- Vote
- Send and share
- Create, develop, and grow your dapp

### Spending FLOW

All you need to spend FLOW is an account and a tool for signing transactions
(a wallet, custodian, or other signing service).
The FCL (Flow Client Library) makes it super duper easy to go to any dapp,
login with your account, have a great time,
and then sign with the wallet of your choice only once you decide to make a purchase.

### Staking FLOW

[You can use FLOW to operate a staked node.](../../networks/staking/06-technical-overview.md) Node operators receive newly-minted FLOW
as a reward for helping to secure the network.

### Delegating FLOW

[You can use FLOW for stake delegation.](../../networks/staking/06-technical-overview.md) Delegators receive newly-minted FLOW
as a reward for helping to secure the network.

### Holding FLOW

If you have already purchased FLOW and wish to hold it, you have a couple of options:

- For relatively small, short term holdings - most people use a wallet.
  Wallets are used to help you sign transactions (verify your actions) when using your FLOW tokens.

- For larger, long term holdings - you may want to use a custody provider to keep your funds safe.

You can find wallets and custodians supporting Flow in the [Flow Port](https://port.flow.com/)

### Voting with FLOW

Participating in the Flow community is more than just running a node or building a dapp.
It's also about engaging in discussion, debate, and decision making about the protocol,
the content on it, and the people impacted by it.
You can use your Flow account to submit votes to community polls and other governance related activities.

### Sending and Sharing FLOW

If you simply want to share the love and bring your friends to Flow, it's easier than an edible arrangement.

It is possible to use the Flow blockchain without holding any FLOW coins yourself.
Free to play games, trials, community polls,
and other community activities can all take place with only an account
(which may be created on a person's behalf)
and a small fixed fee which may be paid by a user agent.

The protocol requires some FLOW coins to process these transactions,
but (and this is the cool part!) a product can support users who do not themselves hold FLOW
while still providing that user with all the underlying security guarantees the Flow protocol provides.

Transferring FLOW, creating accounts, and updating keys are all actions made easy on [Flow Port](https://port.flow.com/)

### Submitting Transactions and Updating Users

Transactions are submitted using a Flow SDK via the Access API.

On Flow, a transaction is identified by its hash - the hash that exists as soon as that transaction is signed and submitted to an Access or Collection node.
Results of transactions can be queried by transaction hash through the Access API.
A user can check the status of a transaction at any time via the [Flow Block Explorer](https://flowscan.io/).

To expose these results natively in your app, you can use a Flow SDK to fetch transaction results,
[for example using the Flow Go SDK](https://github.com/onflow/flow-go-sdk#querying-transaction-results).

Using a Flow SDK you can also fetch account state by address from a Flow Access API,
[for example using the Flow Go SDK](https://github.com/onflow/flow-go-sdk#querying-accounts).

Once the transaction is sealed, an event is emitted and you will be able to read transaction events and update the user.

The Flow SDKs also allow polling for events using the Flow Access API,
[for example using the Flow Go SDK](https://github.com/onflow/flow-go-sdk#querying-events).

## How to Build with FLOW

To get started building on Flow, please see the [Flow App Quickstart](../getting-started/fcl-quickstart.md)
