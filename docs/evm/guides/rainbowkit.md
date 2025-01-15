---
title: RainbowKit
description: Learn how to use the Flow Wallet with RainbowKit, Wagmi, and Viem.
sidebar_position: 5
keywords: [Solidity, Flow, Flow EVM, RainbowKit, Wagmi, Viem]
---

# RainbowKit

[RainbowKit] is a popular wallet aggregator that makes it easy to connect your app to dozens of wallets.  It works nicely with [wagmi] and provides nicely styled connection-related components that are customizable.

The [Flow Wallet] is **not** included as one of the default wallets in the library. This is a deliberate decision - the Flow Wallet is designed to handle the unique structure of [COA Accounts], so it doesn't work on other EVM networks.

Don't worry, [Metamask] and other traditional wallets still work, but the Flow wallet is currently sponsoring **all** gas for all transactions on Flow Mainnet!

## Objectives

After completing this guide, you'll be able to:

* Configure [RainbowKit] to allow connection with the [Flow Wallet].
* Configure a custom list of `connectors`.
* Configure [wagmi] to use the custom list of `connectors`.

## Prerequisites

### Next.js and Modern Frontend Development

This tutorial uses [Next.js].  You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework.  You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks.  If you don't have your own preference, you can just follow along with us and use [Yarn].

### Solidity

You don't need to be an expert, but you should be comfortable writing code in [Solidity].  You can use [Hardhat], [Foundry], or even [Remix].

## The Name of A Major Section in Sentence Case

Text can go here.

:::info[Action]

Anything that is a direct instruction to complete tasks in the tutorial goes in one of these.

:::

```cadence
//Code snippets will often follow Action boxes, but may be put anywhere appropriate.
access(all) fun() foo: String {
    return "bar";
}
```

### The Name of A Minor Section in Sentence Case

Generally, avoid going with smaller sub-sections than H3/###

## Conclusion

In this tutorial, you ...

Now that you have completed the tutorial, you should be able to:

* Copy/paste the Objectives from above here.


(OPTIONAL) Now that you've completed this tutorial, you're ready to...

<!-- Relative links, will not render on page -->
[Cadence]: https://cadence-lang.org/docs
[Next.js]: https://nextjs.org/docs/app/getting-started/installation
[Yarn]: https://yarnpkg.com
[Solidity]: https://soliditylang.org
[Hardhat]: ./hardhat.md
[Foundry]: ./foundry.md
[Remix]: ./remix.md
[RainbowKit]: https://www.rainbowkit.com
[wagmi]: https://wagmi.sh
[Flow Wallet]: https://wallet.flow.com
[COA Accounts]: ../accounts.md
[MetaMask]: https://metamask.io