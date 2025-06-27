---
sidebar_position: 1
title: "getExecHttpPost"
description: "getExecHttpPost function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/current-user/exec-service/strategies/http-post.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/current-user/exec-service/strategies/http-post.ts). DO NOT EDIT MANUALLY -->

# getExecHttpPost

Creates an HTTP POST strategy executor that handles wallet service communication
via HTTP POST requests. This function manages the full lifecycle including polling for
responses, handling local views, and managing user interactions.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.getExecHttpPost(execLocal)
```

Or import directly the specific function:

```typescript
import { getExecHttpPost } from "@onflow/fcl-core"

getExecHttpPost(execLocal)
```

## Usage

```typescript
// Create an HTTP POST executor
const httpPostExec = getExecHttpPost(async (view, { serviceEndpoint, onClose }) => {
  // Render local view and return cleanup function
  return [viewData, () => cleanup()]
})
```

## Parameters

### `execLocal` 


- Type: 
```typescript
export type ExecLocalFunction = (
  view: any,
  options: {
    serviceEndpoint: typeof serviceEndpoint
    onClose: () => void
  }
) => Promise<[any, () => void]>
```
- Description: Function to execute local view rendering and user interaction


## Returns

```typescript
({ service, body, config, opts }: ExecHttpPostParams) => Promise<any>
```


HTTP POST strategy function that can be used to execute services

---