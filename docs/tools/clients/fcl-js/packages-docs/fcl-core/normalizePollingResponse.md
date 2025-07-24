---
title: "normalizePollingResponse"
description: "normalizePollingResponse function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/normalizers/service/polling-response.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/normalizers/service/polling-response.ts). DO NOT EDIT MANUALLY -->

# normalizePollingResponse

Normalizes a polling response to ensure compatibility with FCL format

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.normalizePollingResponse(resp)
```

Or import directly the specific function:

```typescript
import { normalizePollingResponse } from "@onflow/fcl-core"

normalizePollingResponse(resp)
```

## Usage

```typescript
const resp = normalizePollingResponse({
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "PENDING", // PENDING | APPROVED | DECLINED | REDIRECT
  reason: null,      // Reason for Declining Transaction
  data: null,        // Return value for APPROVED
  updates: BackChannelRpc,
  local: Frame,
})
```

## Parameters

### `resp` 


- Type: 
```typescript
export interface PollingResponse {
  f_type: "PollingResponse"
  f_vsn: "1.0.0"
  status: "APPROVED" | "DECLINED" | "REDIRECT"
  reason: string | null
  data: any
}
```
- Description: The polling response to normalize


## Returns

```typescript
export interface PollingResponse {
  f_type: "PollingResponse"
  f_vsn: "1.0.0"
  status: "APPROVED" | "DECLINED" | "REDIRECT"
  reason: string | null
  data: any
}
```


The normalized polling response or null

---