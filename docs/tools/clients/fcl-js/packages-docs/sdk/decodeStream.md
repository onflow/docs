---
sidebar_position: 1
title: "decodeStream"
description: "decodeStream function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/decode/decode-stream.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/decode/decode-stream.ts). DO NOT EDIT MANUALLY -->

# decodeStream

Pipes a generic stream of data into a granular stream of decoded data. The data...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.decodeStream(stream, decodeResponse, customDecoders)
```

Or import directly the specific function:

```typescript
import { decodeStream } from "@onflow/sdk"

decodeStream(stream, decodeResponse, customDecoders)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Create a subscription stream
const rawStream = await fcl.send([
  fcl.subscribeEvents({
    eventTypes: ["flow.AccountCreated"],
    startHeight: 0
  })
]);

// Decode the stream data
const decodedStream = fcl.decodeStream(
  rawStream,
  fcl.decodeResponse,
  {}
);

// Listen for decoded events
decodedStream.on("events", (events) => {
  events.forEach(event => {
    console.log("Decoded event:", event);
  });
});

decodedStream.on("error", (error) => {
  console.error("Stream error:", error);
});

decodedStream.on("close", () => {
  console.log("Stream closed");
});
```

## Parameters

### `stream` 

- Type: [`StreamConnection`](../types#streamconnection)
- Description: The raw stream connection to decode


### `decodeResponse` 

- Type: `DecodeResponseFn`
- Description: Function to decode response data

```typescript
type DecodeResponseFn = (
  response: Record<string, any>,
  customDecoders?: Record<string, any>
) => Promise<any>
```

### `customDecoders` (optional)

- Type: `Record<string, any>`
- Description: Optional custom decoders for specific data types



## Returns

[`StreamConnection`](../types#streamconnection)


---