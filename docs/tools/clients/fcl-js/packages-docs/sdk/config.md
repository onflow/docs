---
sidebar_position: 1
title: "config"
description: "config function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/../config/src/config.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/../config/src/config.ts). DO NOT EDIT MANUALLY -->

# config

Sets the config

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.config(values)
```

Or import directly the specific function:

```typescript
import { config } from "@onflow/sdk"

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