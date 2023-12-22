---
title: Flow Users / Backers
description: FAQ
---

## Does Flow have a block explorer?

There are two block explorers live today. You can find them here:

- https://flowdiver.io/
- https://flow.bigdipper.live/

## I staked and now I can't see my FLOW - what happened?

Once you complete a successful staking or delegation request, your tokens are sent to the staking contract. Your tokens are not lost - they are staked! To view your active stake or delegation, navigate to the Stake & Delegate page on Flow Port (left side bar, or this URL + your address after the last slash ([https://port.onflow.org/stake-delegate/](https://port.onflow.org/stake-delegate/))

## Is it possible to add multiple public keys to a given account/address so that it can be controlled by more than one private key?

Yes, accounts support multiple, weighted keys, [here](https://cadence-lang.org/docs/language/accounts)
using `AuthAccount`’s `fun addPublicKey(_ publicKey: [UInt8])`and <br/>`fun removePublicKey(_ index: Int)` functions.

## How do keys and accounts work on Flow?

Accounts are created with associated keys. There can be multiple keys on an account. To execute transactions from the account, a total of 1000 weight keys need to sign. The account holds a field for FLOW balance. When transactions move flow, that balance is updated by the protocol. The account also holds place for storage and contract code.

FLOW supports a variety of signature schemes for adding keys to an account.

Details: [concepts/accounts-and-keys](../../build/basics/accounts.md)

## How do I create a Flow account if I do not have a service account?

Instructions to generate an address are here: [flow-go-sdk/creating-accounts](../../tools/clients/flow-go-sdk/index.mdx#create-accounts). You don't need a service account.
