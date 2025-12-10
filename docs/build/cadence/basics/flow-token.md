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

# FLOW Coin

This section contains information about the FLOW Coin for individual backers, wallet providers, custodians and node operators.

### FLOW as a Native Coin

FLOW is the default coin for the Flow protocol, meaning it is used for all protocol-level fee payments, rewards and staking transactions. FLOW implements the standard [Flow Fungible Token interface], which all other onchain fungible tokens also conform to. This interface is defined in Cadence, Flow's native smart-contract programming language, which makes it easy to write applications that interact with FLOW.

## How to Get FLOW

There are two ways to acquire FLOW Coins as yield:

1. [Earn FLOW as a Validator or Delegator]: Receive newly-minted FLOW as a reward when you run a node.
1. [Earn FLOW as a Community Contributor]: Flow offers grants for selected proposals as well as RFPs for teams to submit proposals for funded development

## How to use FLOW

With FLOW, you can:

- Spend
- Stake
- Delegate
- Hold
- Vote
- Send and share
- Create, develop, and grow your dapp

### Spend FLOW

All you need to spend FLOW is an account and a tool to sign transactions (a wallet, custodian, or other signing service). The FCL (Flow Client Library) makes it super duper easy to go to any dapp, login with your account, have a great time, and then sign with the wallet of your choice only once you decide to make a purchase.

### Stake FLOW

[You can use FLOW to operate a staked node.] Node operators receive newly-minted FLOW as a reward for helping to secure the network.

### Delegate FLOW

[You can use FLOW for stake delegation.] Delegators receive newly-minted FLOW as a reward for helping to secure the network.

### Hold FLOW

If you have already purchased FLOW and wish to hold it, you have a couple of options:

- For relatively small, short term holdings - most people use a wallet.
  Wallets are used to help you sign transactions (verify your actions) when you use your FLOW tokens.

- For larger, long term holdings - you may want to use a custody provider to keep your funds safe.

You can find wallets and custodians that support Flow in the [Flow Port]

### Vote with FLOW

Participation in the Flow community means more than just run a node or build a dapp. It's also about engaging in discussion, debate, and decision making about the protocol, the content on it, and the people that it impacts. You can use your Flow account to submit votes to community polls and other governance related activities.

### Send and share FLOW

If you simply want to share the love and bring your friends to Flow, it's easier than an edible arrangement.

It is possible to use the Flow blockchain and not hold any FLOW coins yourself. Free to play games, trials, community polls, and other community activities can all take place with only an account (which may be created on a person's behalf) and a small fixed fee which may be paid by a user agent.

The protocol requires some FLOW coins to process these transactions, but (and this is the cool part!) a product can support users who do not themselves hold FLOW and still provide that user with all the underlying security guarantees the Flow protocol provides.

It's easy to transfer FLOW, create accounts, and update keys on [Flow Port]

### Submit transactions and update users

Transactions are submitted with a Flow SDK via the Access API.

On Flow, a transaction is identified by its hash - the hash that exists as soon as that transaction is signed and submitted to an Access or Collection node. Results of transactions can be queried by transaction hash through the Access API. A user can check the status of a transaction at any time via the [Flow Block Explorer].

To expose these results natively in your app, you can use a Flow SDK to [fetch transaction results].

With a Flow SDK, you can also [fetch account state by address] from a Flow Access API.

After the transaction is sealed, an event is emitted and you will be able to read transaction events and update the user.

The Flow SDKs also allow [polling for events] with the Flow Access API.

## How to build with FLOW

To get started with Flow, see the [Flow App Quickstart]

<!-- Relative links, will not render on page -->

[Flow Fungible Token interface]: https://github.com/onflow/flow-ft
[Earn FLOW as a Validator or Delegator]: ../../../protocol/staking/06-technical-overview.md
[Earn FLOW as a Community Contributor]: https://github.com/onflow/developer-grants
[You can use FLOW to operate a staked node.]: ../../../protocol/staking/06-technical-overview.md
[You can use FLOW for stake delegation.]: ../../../protocol/staking/06-technical-overview.md
[Flow Port]: https://port.flow.com/
[Flow Block Explorer]: https://flowscan.io/
[fetch transaction results]: https://github.com/onflow/flow-go-sdk#querying-transaction-results
[fetch account state by address]: https://github.com/onflow/flow-go-sdk#querying-accounts
[polling for events]: https://github.com/onflow/flow-go-sdk#querying-events)
[Flow App Quickstart]: ../../../blockchain-development-tutorials/cadence/getting-started/building-a-frontend-app.md