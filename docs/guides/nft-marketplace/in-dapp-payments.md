---
title: In App Payments on Flow
description: Learn about the different payment options available for applications on Flow.
sidebar_label: In App Payments
sidebar_position: 6
sidebar_custom_props:
  icon: 🏦
---

## Introduction

User payments are an important part of many blockchain apps. In order to create a stellar user experience, your app should make it as easy as possible for users to purchase digital assets. For most users, this means being able to pay for digital assets (e.g. NFTs) using their local fiat currency (e.g. via credit card).

## Direct vs Peer-to-peer Sales

Before diving into payments, it is important to define the difference between direct sales and peer-to-peer sales.

* **Direct sales:** users purchase digital assets (e.g. NFTs) directly from a app developer.
* **Peer-to-peer sales:** users purchase digital assets (e.g. NFTs) from other app users, usually via a marketplace.

This section will highlight the considerations you should make when implementing payments for direct sales and peer-to-peer sales.

## Available Payment Options

### FLOW

FLOW is the default cryptocurrency that powers the Flow blockchain network, and is primarily used for staking and for paying [network fees](../../build/key-concepts/fees.md#fees).

Many of the payment providers support FLOW, including well-trusted cryptocurrency exchanges.

However, FLOW isn’t always well-suited for day-to-day user payments due to its price volatility, much like any cryptocurrency.

<Callout type="warning">

**App Custody Gotcha:**  app-custody apps that allow their users to hold FLOW will need to comply with any necessary regulations regarding cryptocurrency asset custody. Consult your legal counsel.

</Callout>

### Direct Credit Card Payments

Some apps choose to directly integrate off-chain credit card providers such as [Alipay](https://en.wikipedia.org/wiki/Alipay), [Circle](https://en.wikipedia.org/wiki/Circle_(company)), [PayPal](https://en.wikipedia.org/wiki/PayPal) or [Stripe](https://en.wikipedia.org/wiki/Stripe_(company)) in order to support NFT sales. In these scenarios, payments are processed externally by the provider, and then the NFT asset is delivered in a transaction authorized by the app developer.

While direct credit card payments result in a good user experience, they bring significant challenges for the app developer. Credit card payments are prone to [chargebacks](https://en.wikipedia.org/wiki/Chargeback) and fraud, meaning users can purchase an asset, dispute the credit card transaction, and then keep the original asset without paying. Because of this, app developers sometimes opt for the app custody model when supporting direct credit card payments.

Credit card payments introduce additional challenges when used in peer-to-peer payment platforms such as an NFT marketplace. When a user buys an NFT from another user using their credit card, the payment is still processed by the app developer, which makes the developer responsible for paying the seller. To pay the proceeds to the seller, the developer must comply with necessary regulations. Consult your legal counsel.

### Recommendation

USDC and FLOW are the recommended payment methods for FCL-powered apps, due to their ease of integration, stability and widespread ecosystem support.
