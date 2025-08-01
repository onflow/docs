# Transactions

Transactions let you send Cadence code to the Flow blockchain that permanently alters its state.

We are assuming you have read the [Scripts Documentation](./scripts.md) before this, as transactions are sort of scripts with more required things.

While `query` is used for sending scripts to the chain, `mutate` is used for building and sending transactions. Just like [scripts](./scripts.md), `fcl.mutate` is a [JavaScript Tagged Template Literal](https://styled-components.com/docs/advanced#tagged-template-literals) that we can pass Cadence code into.

Unlike scripts, they require a little more information, things like a proposer, authorizations and a payer, which may be a little confusing and overwhelming.

## Sending Your First Transaction

There is a lot to unpack in the following code snippet.
It sends a transaction to the Flow blockchain. For the transaction, the current user is authorizing it as both the `proposer` and the `payer`.
Something that is unique to Flow is the one paying for the transaction doesn't always need to be the one performing the transaction.
Proposers and Payers are special kinds of authorizations that are always required for a transaction.
The `proposer` acts similar to the `nonce` in Ethereum transactions, and helps prevent repeat attacks.
The `payer` is who will be paying for the transaction.
If these are not set, FCL defaults to using the current user for all roles.

`fcl.mutate` will return a `transactionId`. We can pass the response directly to `fcl.tx` and then use the `onceExecuted` method which resolves a promise when a transaction result is available.

```javascript
import * as fcl from "@onflow/fcl"

const transactionId = await fcl.mutate({
  cadence: `
    transaction {
      execute {
        log("Hello from execute")
      }
    }
  `,
  proposer: fcl.currentUser,
  payer: fcl.currentUser,
  limit: 50
})

const transaction = await fcl.tx(transactionId).onceExecuted()
console.log(transaction) // The transactions status and events after being executed
```

## Authorizing a Transaction

The below code snippet is the same as the above one, except for one extremely important difference.
Our Cadence code this time has a prepare statement, and we are using the `fcl.currentUser` when constructing our transaction.

The `prepare` statement's arguments directly map to the order of the authorizations in the `authorizations` array.
Four authorizations means four `&Account`s as arguments passed to `prepare`. In this case though there is only one, and it is the `currentUser`.

These authorizations are important as you can only access/modify an accounts storage if you have the said accounts authorization.

```javascript
import * as fcl from "@onflow/fcl"

const transactionId = await fcl.mutate({
  cadence: `
    transaction {
      prepare(acct: &Account) {
        log("Hello from prepare")
      }
      execute {
        log("Hello from execute")
      }
    }
  `,
  proposer: fcl.currentUser,
  payer: fcl.currentUser,
  authorizations: [fcl.currentUser],
  limit: 50
})

const transaction = await fcl.tx(transactionId).onceExecuted()
console.log(transaction) // The transactions status and events after being executed
```

To learn more about `mutate`, check out the [API documentation](./packages-docs/fcl/mutate.md).

## Transaction Finality

As of **FCL v1.15.0**, it is now recommended to use use `onceExecuted` in most cases, leading to a 2.5x reduction in latency when waiting for a transaction result.  For example, the following code snippet should be updated from:

```ts
import * as fcl from "@onflow/fcl"
const result = await fcl.tx(txId).onceSealed()
```

to:

```ts
import * as fcl from "@onflow/fcl"
const result = await fcl.tx(txId).onceExecuted()
```

Developers manually subscribing to transaction statuses should update their listeners to treat "executed" as the final status (see the release notes [here](https://github.com/onflow/fcl-js/releases/tag/%40onflow%2Ffcl%401.15.0)).  For example, the following code snippet should be updated from:

```ts
import * as fcl from "@onflow/fcl"
import { TransactionExecutionStatus } from "@onflow/typedefs"

fcl.tx(txId).subscribe((txStatus) => {
  if (
    txStatus.status === TransactionExecutionStatus.SEALED
  ) {
    console.log("Transaction executed!")
  }
})
```

```ts
import * as fcl from "@onflow/fcl"
import { TransactionExecutionStatus } from "@onflow/typedefs"

fcl.tx(txId).subscribe((txStatus) => {
  if (
    // SEALED status is no longer necessary
    txStatus.status === TransactionExecutionStatus.EXECUTED
  ) {
    console.log("Transaction executed!")
  }
})
```

The "executed" status corresponds to soft finality, indicating that the transaction has been included in a block and a transaction status is available, backed by a cryptographic proof.  Only in rare cases should a developer need to wait for "sealed" status in their applications and you can learn more about the different transaction statuses on Flow [here](../../../build/basics/transactions.md#transaction-status).

See the following video for demonstration of how to update your code to wait for "executed" status:

<iframe
  width="560"
  height="315"
  src="https://www.youtube-nocookie.com/embed/ubhxIszdzfo"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>