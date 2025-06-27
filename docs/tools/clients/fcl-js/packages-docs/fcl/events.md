---
sidebar_position: 1
title: "events"
description: "events function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../fcl-core/src/events/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../fcl-core/src/events/index.ts). DO NOT EDIT MANUALLY -->

# events

Subscribes to Flow blockchain events in real-time. This function provides a way to listen
for specific events emitted by smart contracts on the Flow blockchain. It automatically handles
fallback to legacy polling for environments that don't support WebSocket subscriptions.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.events(filterOrType)
```

Or import directly the specific function:

```typescript
import { events } from "@onflow/fcl"

events(filterOrType)
```

## Usage

```typescript
// Subscribe to a specific event type
import * as fcl from "@onflow/fcl"

const unsubscribe = fcl.events("A.0x1654653399040a61.FlowToken.TokensWithdrawn")
  .subscribe((event) => {
    console.log("Event received:", event)
    console.log("Event data:", event.data)
    console.log("Transaction ID:", event.transactionId)
  })

// Stop listening after 30 seconds
setTimeout(() => {
  unsubscribe()
}, 30000)

// Subscribe to multiple event types with error handling
const unsubscribe = fcl.events({
  eventTypes: [
    "A.0x1654653399040a61.FlowToken.TokensWithdrawn",
    "A.0x1654653399040a61.FlowToken.TokensDeposited"
  ]
}).subscribe(
  (event) => {
    console.log("Token event:", event.type, event.data)
  },
  (error) => {
    console.error("Event subscription error:", error)
  }
)

// Subscribe to events starting from a specific block height
const unsubscribe = fcl.events({
  eventTypes: ["A.CONTRACT.EVENT"],
  startBlockHeight: 12345678
}).subscribe((event) => {
  console.log("Historical and new events:", event)
})
```

## Parameters

### `filterOrType` (optional)


- Type: [`string | EventFilter`](../types#string | eventfilter)
- Description: Event filter object or event type string.
If a string is provided, it will be treated as a single event type to subscribe to.
If an EventFilter object is provided, it can contain multiple event types and other filter criteria.


## Returns

```typescript
{ subscribe: (onData: (event: Event) => void, onError?: (error: Error) => void) => () => void; }
```


An object containing a subscribe method
• returns.subscribe Function to start the subscription
• returns.subscribe.onData Callback function called when an event is received
• returns.subscribe.onError Optional callback function called when an error occurs
• returns.subscribe.unsubscribe Function returned by subscribe() to stop the subscription

---