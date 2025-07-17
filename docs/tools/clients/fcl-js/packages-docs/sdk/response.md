---
title: "response"
description: "response function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/response/response.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/response/response.ts). DO NOT EDIT MANUALLY -->

# response

Creates a default response object

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.response()
```

Or import directly the specific function:

```typescript
import { response } from "@onflow/sdk"

response()
```

## Usage

```typescript
import { response } from "@onflow/sdk"

// Create a default response object
const defaultResponse = response();
console.log(defaultResponse.transaction); // null
console.log(defaultResponse.account); // null
console.log(defaultResponse.block); // null

// Typically used internally by the SDK to initialize responses
// You'll rarely need to use this directly in application code
```


## Returns

```typescript
{ tag: any; transaction: any; transactionStatus: any; transactionId: any; encodedData: any; events: any; event: any; accountStatusEvent: any; account: any; block: any; blockHeader: any; blockDigest: any; latestBlock: any; collection: any; networkParameters: any; streamConnection: any; heartbeat: any; nodeVersionInfo: any; }
```


A default response object

---