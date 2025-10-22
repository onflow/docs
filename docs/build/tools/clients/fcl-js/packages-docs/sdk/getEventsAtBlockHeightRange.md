---
title: "getEventsAtBlockHeightRange"
description: "getEventsAtBlockHeightRange function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-get-events-at-block-height-range.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-get-events-at-block-height-range.ts). DO NOT EDIT MANUALLY -->

# getEventsAtBlockHeightRange

A builder function that returns all instances of a particular event (by name) within a height range.

The block range provided must be from the current spork.

The block range provided must be 250 blocks or lower per request.

Event type is a string that follow a standard format: A.\{AccountAddress\}.\{ContractName\}.\{EventName\}

Please read more about [events in the documentation](https://docs.onflow.org/cadence/language/events/).

Block height range expresses the height of the start and end block in the chain.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.getEventsAtBlockHeightRange(eventType, startHeight, endHeight)
```

Or import directly the specific function:

```typescript
import { getEventsAtBlockHeightRange } from "@onflow/sdk"

getEventsAtBlockHeightRange(eventType, startHeight, endHeight)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get events at block height range
await fcl
  .send([
    fcl.getEventsAtBlockHeightRange(
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn", // event name
      35580624, // block to start looking for events at
      35580624 // block to stop looking for events at
    ),
  ])
  .then(fcl.decode);
```

## Parameters

### `eventType` 


- Type: `string`
- Description: The type of event to get

### `startHeight` 


- Type: `number`
- Description: The height of the block to start looking for events (inclusive)

### `endHeight` 


- Type: `number`
- Description: The height of the block to stop looking for events (inclusive)


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---