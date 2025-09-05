---
title: "tx"
description: "tx function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../fcl-core/src/transaction/transaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../fcl-core/src/transaction/transaction.ts). DO NOT EDIT MANUALLY -->

# tx

Creates a transaction monitor that provides methods for tracking and subscribing to
transaction status updates on the Flow blockchain. This function returns an object with methods
to get snapshots, subscribe to status changes, and wait for specific transaction states.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.tx(transactionId, opts)
```

Or import directly the specific function:

```typescript
import { tx } from "@onflow/fcl"

tx(transactionId, opts)
```

## Usage

```typescript
// Basic transaction monitoring
import * as fcl from "@onflow/fcl"

const txId = await fcl.mutate({
  cadence: `
    transaction {
      execute { log("Hello, World!") }
    }
  `
})

// Get current status
const status = await fcl.tx(txId).snapshot()
console.log("Current status:", status.status)

// Subscribe to all status changes
const unsubscribe = fcl.tx(txId).subscribe((status) => {
  console.log("Status update:", status.status)
  if (status.status === fcl.transaction.isSealed) {
    console.log("Transaction sealed!")
    console.log("Events:", status.events)
  }
})
// Clean up subscription when done
setTimeout(() => unsubscribe(), 60000)

// Wait for specific transaction states
try {
  // Wait for finalization (consensus reached)
  const finalizedStatus = await fcl.tx(txId).onceFinalized()
  console.log("Transaction finalized")

  // Wait for execution (transaction executed)
  const executedStatus = await fcl.tx(txId).onceExecuted()
  console.log("Transaction executed")

  // Wait for sealing (transaction sealed in block)
  const sealedStatus = await fcl.tx(txId).onceSealed()
  console.log("Transaction sealed:", sealedStatus.events)
} catch (error) {
  console.error("Transaction failed:", error.message)
}

// Handle transaction errors
fcl.tx(txId).subscribe(
  (status) => {
    if (status.statusCode === 1) {
      console.error("Transaction error:", status.errorMessage)
    }
  },
  (error) => {
    console.error("Subscription error:", error)
  }
)
```

## Parameters

### `transactionId` 


- Type: `string`
- Description: The 64-character hex transaction ID to monitor. Must be a valid
Flow transaction hash (64 bytes represented as hex string).

### `opts` (optional)


- Type: 
```typescript
{ pollRate?: number; txNotFoundTimeout?: number; }
```
- Description: Optional configuration parameters

#### Properties:

- **`pollRate`**  - Polling rate in milliseconds when using legacy polling fallback
- **`txNotFoundTimeout`**  - Timeout in milliseconds for ignoring transaction
not found errors during initial transaction propagation (do not modify unless you know what you are doing)


## Returns

[`Promise<TransactionStatus>`](../types#transactionstatus)


Transaction monitor object with methods for tracking transaction status

---