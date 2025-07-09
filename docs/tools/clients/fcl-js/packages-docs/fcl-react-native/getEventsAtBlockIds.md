---
sidebar_position: 1
title: "getEventsAtBlockIds"
description: "getEventsAtBlockIds function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-get-events-at-block-ids.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-get-events-at-block-ids.ts). DO NOT EDIT MANUALLY -->

# getEventsAtBlockIds

A builder function that returns all instances of a particular event (by name) within a set of blocks, specified by block ids.

The block range provided must be from the current spork.

Event type is a string that follow a standard format: A.\{AccountAddress\}.\{ContractName\}.\{EventName\}

Please read more about [events in the documentation](https://docs.onflow.org/cadence/language/events/).

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.getEventsAtBlockIds(eventType, blockIds)
```

Or import directly the specific function:

```typescript
import { getEventsAtBlockIds } from "@onflow/fcl-react-native"

getEventsAtBlockIds(eventType, blockIds)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

const events = await fcl.send([
  fcl.getEventsAtBlockIds("A.7e60df042a9c0868.FlowToken.TokensWithdrawn", [
    "c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7",
    "5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f"
  ])
]).then(fcl.decode);
```

## Parameters

### `eventType` 


- Type: `string`
- Description: The type of event to get

### `blockIds` 


- Type: `string[]`
- Description: The ids of the blocks to scan for events


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---