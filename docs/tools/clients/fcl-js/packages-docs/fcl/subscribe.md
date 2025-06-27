---
sidebar_position: 1
title: "subscribe"
description: "subscribe function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/transport/subscribe/subscribe.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/transport/subscribe/subscribe.ts). DO NOT EDIT MANUALLY -->

# subscribe

Subscribe to real-time data from the Flow blockchain and automatically decode the responses.

This is a utility function used for subscribing to real-time data from the WebSocket Streaming API. Data returned will be automatically decoded via the 'decode' function.

Available topics include: `events`, `blocks`, `block_headers`, `block_digests`, `transaction_statuses`, `account_statuses`.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.subscribe(subscribeParams, opts)
```

Or import directly the specific function:

```typescript
import { subscribe } from "@onflow/fcl"

subscribe(subscribeParams, opts)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { SubscriptionTopic } from "@onflow/sdk";

// Subscribe to events
const subscription = fcl.subscribe({
  topic: SubscriptionTopic.EVENTS,
  args: {
    eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"]
  },
  onData: (events) => {
    console.log("Received events:", events);
  },
  onError: (error) => {
    console.error("Subscription error:", error);
  }
});

// Subscribe to blocks
const blockSubscription = fcl.subscribe({
  topic: SubscriptionTopic.BLOCKS,
  args: {
    blockStatus: "finalized"
  },
  onData: (block) => {
    console.log("New block:", block);
  },
  onError: (error) => {
    console.error("Block subscription error:", error);
  }
});

// Later, to unsubscribe:
subscription.unsubscribe();
blockSubscription.unsubscribe();
```

## Parameters

### `subscribeParams` 


- Type: 
```typescript
SubscribeParams<T>
```

### `opts` (optional)


- Type: 
```typescript
{ node?: string; transport?: SdkTransport; }
```
- Description: Additional options for the subscription


## Returns

[`Subscription`](../types#subscription)


A subscription object that allows you to manage the subscription (e.g., to unsubscribe later)

---