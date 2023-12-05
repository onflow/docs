---
title: Options for Building Staking Integrations
sidebar_label: Technical Staking Options
---

This document describes two different methods for staking at a high level.

<Callout type="warning">

We highly recommended you use the Staking Collection paradigm,
as this will be the most supported method for staking with any set up.

</Callout>

# Staking Collection

A Staking Collection is a resource that allows its owner to manage multiple staking
objects in a single account via a single storage path, and perform staking actions
using Flow. It also supports machine accounts, a necessary feature for Flow epoch node operation.

The staking collection paradigm is the most flexible of the three choices
and will receive the most support in the future. It is the set-up that Flow Port and many other staking providers use.

The staking collection setup and guide is detailed in the [staking collection guide.](./14-staking-collection.md)

# Staking

The basic method to stake is to stake directly with the `FlowIDTableStaking` smart contract.
This would involve calling the node or delegator registration functions directly in the staking
contract and storing the staking objects directly in account storage.

This is probably the simplest way to implement this, but it is not very flexible
and not recommended.

The basic staking guide is detailed [here](./15-staking-guide.md)