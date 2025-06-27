---
sidebar_position: 1
title: "getMutate"
description: "getMutate function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/exec/mutate.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/exec/mutate.ts). DO NOT EDIT MANUALLY -->

# getMutate

Factory function that returns a mutate function for a given currentUser.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.getMutate(currentUserOrConfig)
```

Or import directly the specific function:

```typescript
import { getMutate } from "@onflow/fcl-core"

getMutate(currentUserOrConfig)
```


## Parameters

### `currentUserOrConfig` 


- Type: 
```typescript
export interface CurrentUserService extends CurrentUserServiceApi {
  (): CurrentUserServiceApi
}
```
- Description: CurrentUser actor or configuration


## Returns

```typescript
(opts?: MutateOptions) => Promise<string>
```


---