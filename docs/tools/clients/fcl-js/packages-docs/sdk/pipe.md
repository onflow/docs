---
sidebar_position: 1
title: "pipe"
description: "pipe function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# pipe


## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.pipe(args)
```

Or import directly the specific function:

```typescript
import { pipe } from "@onflow/sdk"

pipe(args)
```


## Parameters

### `args` (optional)

- Type: `[(false | InteractionBuilderFn)[]] | [MaybePromise<Interaction>, (false | InteractionBuilderFn)[]]`



## Returns

`InteractionBuilderFn | Promise<Interaction>`


---