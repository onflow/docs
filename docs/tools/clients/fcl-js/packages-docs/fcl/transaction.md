---
sidebar_position: 1
title: "transaction"
description: "transaction function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# transaction

A template builder to use a Cadence transaction for an interaction

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.transaction(args)
```

Or import directly the specific function:

```typescript
import { transaction } from "@onflow/fcl"

transaction(args)
```


## Parameters

### `args` (optional)


- Type: 
```typescript
[string | TemplateStringsArray, ...any[]]
```
- Description: The arguments to pass


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---