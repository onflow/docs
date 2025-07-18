---
title: "isReactNative"
description: "isReactNative function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/utils/is-react-native.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/utils/is-react-native.ts). DO NOT EDIT MANUALLY -->

# isReactNative

Checks if the current environment is React Native. This function returns a boolean
indicating whether FCL is running in a React Native environment rather than a browser or Node.js.
This is useful for platform-specific functionality and enabling React Native-specific features.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.isReactNative()
```

Or import directly the specific function:

```typescript
import { isReactNative } from "@onflow/fcl-core"

isReactNative()
```

## Usage

```typescript
// Check if running in React Native
import * as fcl from "@onflow/fcl"

if (fcl.isReactNative()) {
  console.log("Running in React Native")
  // Use React Native specific wallet integrations
  // Enable deep linking for wallet connections
} else {
  console.log("Running in browser or Node.js")
  // Use web-based wallet integrations
}
```


## Returns

`boolean`


True if running in React Native environment, false otherwise

---