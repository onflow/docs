---
title: DeFi Actions Transaction
description: Build your first transaction that uses DeFi actions on Flow Cadence.
sidebar_position: 1
keywords:
  -
---

:::warning

Defi actions on Flow are being reviewed and finalized in [FLIP 339]. The specific implementation may change as a part of this process.

These tutorials will be updated, but you may need to refactor your code if the implementation changes.

:::

[Staking] is an entry-level way to participate in the blockchain process by supplying some of the tokens needed to participate in governance in return for a share of the reward this process generates. It's a great way to increase the value of a holding that would otherwise sit unutilized and provides a much higher rate of return than a savings account, though you should make sure you understand how [slashing] works and make your own determinations on risk.

You can stake directly by locking up your tokens with [Flow Port], or you can participate in other platforms and protocols that have a different strategy for participating in this process. [IncrementFi] has a Liquid Staking Protocol they describe as:

> LSP allows users to earn staking rewards without locking $flow tokens or running node softwares. Users can deposit $flow tokens and receive transferrable $stFlow tokens in return. Liquid staking combines the benefits of staking (earning rewards) and brings liquidity, as well as additional possibilities to increase your assets or hedge your positions by participating in Flow's DeFi ecosystem.

Participation in staking comes with a tedious chore - you'll need to regularly complete one or more transactions to claim your rewards and restake them to compound your earnings.

Defi actions simplify this process by giving you a suite of blocks that once instantiated, perform actions in the same way from one protocol to another. In this tutorial, you'll learn how to build a transaction that simplifies restaking on [IncrementFi], and can be adapted using different connectors to work on other protocols as well.

## Learning Objectives

After completing this tutorial, you will be able to:

-

## Getting Started

Begin by using the [DeFi Actions Scaffold] repo as a template to create a new repository. Clone your new repository and open it in your editor.

Follow the instructions in the README for **testnet**.

<!-- Reference-style links, will not render on page -->

[Staking]: ../../networks/staking/index.md
[slashing]: ../../networks/staking/04-stake-slashing.md
[Flow Port]: https://port.flow.com/
[IncrementFi]: https://app.increment.fi/
[zap]: ./breakthislinkfornow
[zapper]: ./breakthislinkfornow
[`/cadence/transactions/increment_fi_restake.cdc`]: https://github.com/onflow/defiactions-scaffold/blob/main/cadence/transactions/increment_fi_restake.cdc
