---
title: "getEvents"
description: "getEvents function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/build/build-get-events.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/build/build-get-events.ts). DO NOT EDIT MANUALLY -->

# getEvents

A builder function that returns the interaction to get events.

Events are emitted by Cadence code during transaction execution and provide insights into what happened during execution.
This function queries for events of a specific type within a range of block heights.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.getEvents(eventType, start, end)
```

Or import directly the specific function:

```typescript
import { getEvents } from "@onflow/fcl-core"

getEvents(eventType, start, end)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get FlowToken transfer events from blocks 1000 to 2000
const events = await fcl.send([
  fcl.getEvents("A.1654653399040a61.FlowToken.TokensDeposited", 1000, 2000)
]).then(fcl.decode);

console.log("Found events:", events.length);
events.forEach(event => {
  console.log("Event data:", event.data);
  console.log("Transaction ID:", event.transactionId);
});
```

## Parameters

### `eventType` 


- Type: `string`
- Description: The type of event to get (e.g., "A.1654653399040a61.FlowToken.TokensWithdrawn")

### `start` 


- Type: `number`
- Description: The start block height to query from

### `end` 


- Type: `number`
- Description: The end block height to query to


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---