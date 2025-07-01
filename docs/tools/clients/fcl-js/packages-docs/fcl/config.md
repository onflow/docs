---
sidebar_position: 1
title: "config"
description: "config function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../fcl-core/src/fcl-core.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../fcl-core/src/fcl-core.ts). DO NOT EDIT MANUALLY -->

# config

Sets the config

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.config(values)
```

Or import directly the specific function:

```typescript
import { config } from "@onflow/fcl"

config(values)
```


## Parameters

### `values` (optional)


- Type: 
```typescript
Record<string, unknown>
```
- Description: - The values to set


## Returns

```typescript
{ put: typeof put; get: typeof get; all: typeof all; first: typeof first; update: typeof update; delete: typeof _delete; where: typeof where; subscribe: typeof subscribe; overload: typeof overload; load: typeof load; }
```


The config object

---