---
title: FLOW for Wallets & Custodians
sidebar_title: For Wallets & Custodians
description: How to integrate your wallet software with FLOW
---

{/*

TODO:
- Insert protocol for emitting event when tokens deposited into account
- Peter to insert generalised websequence digram from this doc https://docs.google.com/document/d/1b1fVgHBlGYMu0WvIz5fwDMc153UGzXz0Pp2lr1atRrE/edit#heading=h.vyfahjj5ho25
- Insert sequence diagram https://www.notion.so/dapperlabs/Token-Staking-Process-6877e85a057e4eab8beae7f5187f3ffb#6cdcd35f8084439d93da479f1dc0831d
- Insert Unstaking transaction example
https://github.com/onflow/flow-internal/issues/1131

*/}

## Creating an Account

A user needs a Flow account in order to receive, hold and send FLOW tokens.
The [accounts & keys documentation](../start-here/accounts-and-keys.md) provides a detailed
overview of how accounts work on Flow.

You can create an account using templates and helper code from one of the Flow SDKs:

- [Create an Account with the Flow Go SDK](https://github.com/onflow/flow-go-sdk/blob/master/examples/create_account/main.go)

## Receiving FLOW Deposits

Every Flow account supports the FLOW token by default. Once an account is created, it is
already provisioned to receive FLOW deposits from other users.

FLOW, like any other `FungibleToken` on Flow, is stored in a special resource called a `FungibleToken.Vault`.
Every new account is created with an empty FLOW vault stored at the `/storage/flowTokenVault` storage path.

```cadence
let vault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
```

Conceptually, a vault is like a mailbox with a lock. Anybody can deposit tokens
but only the account holder can withdraw them. This functionality is made possible by
resource capabilities in Cadence. Each account publishes a `FungibleToken.Receiver` interface
that points to its FLOW vault. The receiver is the mail slot; it allows others to
deposit FLOW into a vault without stealing what's inside.

Here's how you deposit FLOW into an account:

```cadence
let receiver = account
  .getCapability(/public/flowTokenReceiver)
  .borrow<&{FungibleToken.Receiver}>()
    ?? panic("Could not borrow FungibleToken.Receiver reference")

receiver.deposit(from: <-senderVault)
```

### Detecting Deposits

The `FlowToken` contract emits a `FlowToken.TokensDeposited` event whenever tokens
move between accounts.

```cadence
pub event TokensDeposited(amount: UFix64, to: Address?)
```

You can query for this event to detect when tokens are deposited into a user's account.

{/*
TODO: Link to event querying docs
*/}

## Getting the Balance of an Account
Detailed below is an example of how to query the balance of a `FlowToken.Vault` instance.

### From Cadence

Similar to the token receiver, each account publishes a `FungibleToken.Balance` capability
that allows anybody to read the balance of an account. This allows Cadence programs
to fetch the balance of an account directly in code.

```cadence
let balanceRef = account
  .getCapability(/public/flowTokenBalance)
  .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
    ?? panic("Could not borrow FungibleToken.Balance reference")

log(balanceRef.balance)
```

The above code can be executed as part of a [read-only Cadence script](https://github.com/onflow/flow-ft/blob/master/transactions/scripts/get_balance.cdc).

### From the Access API

The FLOW Access API makes it easy to query an account's balance without writing any
Cadence code.

The [GetAccount RPC method](#) includes a `balance` field, which holds the FLOW token balance
for the requested account.

```go
import (
  "github.com/onflow/flow-go-sdk"
  "github.com/onflow/flow-go-sdk/client"
)

func main() {
  flowClient, _ := client.New(accessAPIHost)

  account, _ := flowClient.GetAccount(ctx, address)

  fmt.Println(account.Balance)
}
```

## Sending FLOW

Below is an example of a transaction that transfers FLOW from one account to another.

```cadence
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS

transaction(amount: UFix64, to: Address) {

  // The FungibleToken.Vault resource that holds the tokens to be transferred
  let sentVault: @FungibleToken.Vault

  prepare(sender: AuthAccount) {
    // Get a reference to the sender's stored vault
    let vault = sender.
      borrow<&ExampleToken.Vault>(from: /storage/flowTokenVault)
        ?? panic("Could not borrow reference to the owner's Vault!")

    // Withdraw tokens from the sender's stored vault
    self.sentVault <- vault.withdraw(amount: amount)
  }

  execute {
    // Get the recipient's public account object
    let recipient = getAccount(to)

    // Get a reference to the recipient's FungibleToken.Receiver
    let receiver = recipient
      .getCapability(/public/flowTokenReceiver)
      .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow receiver reference to the recipient's Vault")

    // Deposit the withdrawn tokens in the recipient's receiver
    receiver.deposit(from: <-self.sentVault)
  }
}
```

This transaction template is available for use in our SDKs:

- [Transfer Tokens with the FCL (Flow Client Library)](https://github.com/onflow/fcl-js/tree/master/packages/six-transfer-tokens)
- _Coming soon: Transfer Tokens with the Go SDK_

## Staking FLOW

The [FLOW staking documentation](../nodes/staking/) outlines the steps a custodian can take
to support staking through a trusted node operator.
