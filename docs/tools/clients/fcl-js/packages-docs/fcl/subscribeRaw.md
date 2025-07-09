---
sidebar_position: 1
title: "subscribeRaw"
description: "subscribeRaw function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/transport/subscribe/subscribe-raw.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/transport/subscribe/subscribe-raw.ts). DO NOT EDIT MANUALLY -->

# subscribeRaw

Subscribe to a topic without decoding the data.

This function creates a raw subscription to Flow blockchain data streams without automatic decoding.
It's useful when you need more control over data processing or want to handle raw responses directly.
For most use cases, consider using the `subscribe()` function instead which provides automatic decoding.

Available topics include: `events`, `blocks`, `block_headers`, `block_digests`, `transaction_statuses`, `account_statuses`.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.subscribeRaw(subscribeRawParams, opts)
```

Or import directly the specific function:

```typescript
import { subscribeRaw } from "@onflow/fcl"

subscribeRaw(subscribeRawParams, opts)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { SubscriptionTopic } from "@onflow/sdk";

// Subscribe to raw event data without automatic decoding
const rawSubscription = fcl.subscribeRaw({
  topic: SubscriptionTopic.EVENTS,
  args: {
    eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"]
  },
  onData: (rawData) => {
    console.log("Raw event data:", rawData);
    // Handle raw data manually - no automatic decoding
  },
  onError: (error) => {
    console.error("Raw subscription error:", error);
  }
});

// Subscribe to raw block data
const blockSubscription = fcl.subscribeRaw({
  topic: SubscriptionTopic.BLOCKS,
  args: {
    blockStatus: "finalized"
  },
  onData: (rawBlock) => {
    console.log("Raw block data:", rawBlock);
  },
  onError: (error) => {
    console.error("Error:", error);
  }
});

// Unsubscribe when done
rawSubscription.unsubscribe();
```

## Parameters

### `subscribeRawParams` 


- Type: 
```typescript
SubscribeRawParams<T>
```

### `opts` (optional)


- Type: 
```typescript
{ node?: string; transport?: SdkTransport; }
```
- Description: Additional options for the subscription


## Returns

```typescript
{ unsubscribe: () => void; }
```


A subscription object with an unsubscribe method

---