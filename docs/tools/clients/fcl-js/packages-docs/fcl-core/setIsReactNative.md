---
title: "setIsReactNative"
description: "setIsReactNative function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/utils/is-react-native.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/utils/is-react-native.ts). DO NOT EDIT MANUALLY -->

# setIsReactNative

Sets the React Native environment flag for FCL. This function should be called during
initialization of React Native applications to inform FCL that it's running in a React Native
environment. This enables React Native-specific behaviors and optimizations.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.setIsReactNative(value)
```

Or import directly the specific function:

```typescript
import { setIsReactNative } from "@onflow/fcl-core"

setIsReactNative(value)
```

## Usage

```typescript
// Set React Native flag during app initialization
import * as fcl from "@onflow/fcl"

// In your React Native app's entry point (e.g., App.js)
fcl.setIsReactNative(true)

// Configure FCL for React Native
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/api/testnet/authn"
})
```

## Parameters

### `value` 


- Type: `boolean`
- Description: True to indicate React Native environment, false otherwise


## Returns

`void`


---