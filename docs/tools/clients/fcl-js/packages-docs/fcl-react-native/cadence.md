---
sidebar_position: 1
title: "cadence"
description: "cadence function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../fcl-core/src/fcl-core.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../fcl-core/src/fcl-core.ts). DO NOT EDIT MANUALLY -->

# cadence

Creates a template function

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.cadence(head, rest)
```

Or import directly the specific function:

```typescript
import { cadence } from "@onflow/fcl-react-native"

cadence(head, rest)
```


## Parameters

### `head` 


- Type: 
```typescript
string | TemplateStringsArray | ((x?: unknown) => string)
```
- Description: - A string, template string array, or template function

### `rest` (optional)


- Type: `unknown[]`
- Description: - The rest of the arguments


## Returns

```typescript
(x?: unknown) => string
```


A template function

---