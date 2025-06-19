---
sidebar_position: 1
title: "subscribeEvents"
description: "subscribeEvents function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-subscribe-events.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-subscribe-events.ts). DO NOT EDIT MANUALLY -->

# subscribeEvents

Subscribe to events with the given filter and parameters.

Creates a subscription to listen for real-time events from the Flow blockchain. This function configures
the subscription parameters for filtering specific events based on type, addresses, contracts, and other criteria.

Events are emitted by Cadence code during transaction execution and provide insights into what happened.
Subscriptions allow you to listen for these events in real-time without polling.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.subscribeEvents(options)
```

Or import directly the specific function:

```typescript
import { subscribeEvents } from "@onflow/sdk"

subscribeEvents(options)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Subscribe to FlowToken transfer events
const subscription = await fcl.send([
  fcl.subscribeEvents({
    eventTypes: [
      "A.1654653399040a61.FlowToken.TokensWithdrawn",
      "A.1654653399040a61.FlowToken.TokensDeposited"
    ],
    startHeight: 1000000, // Start from specific block height
    heartbeatInterval: 3000 // 3 second heartbeat
  })
]);

// Subscribe to events from specific contracts
const contractSubscription = await fcl.send([
  fcl.subscribeEvents({
    contracts: ["FlowToken", "FungibleToken"],
    addresses: ["0x1654653399040a61"]
  })
]);

// Handle the subscription data elsewhere using fcl.subscribe()
```

## Parameters

### `options` 

- Type: [`EventFilter`](../types#eventfilter)



## Returns

`InteractionBuilderFn`

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```

---