---
sidebar_position: 1
title: "useServiceDiscovery"
description: "Namespace containing useServiceDiscovery utilities"
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native). DO NOT EDIT MANUALLY -->

# useServiceDiscovery

## Overview

Namespace containing useServiceDiscovery utilities

## Functions

### getAsyncStorage


#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.useServiceDiscovery.getAsyncStorage()
```

Or import the namespace directly:

```typescript
import { useServiceDiscovery } from "@onflow/fcl-react-native"

useServiceDiscovery.getAsyncStorage()
```


#### Returns

```typescript
{ can: boolean; get: (key: string) => Promise<any>; put: (key: string, value: any) => Promise<void>; }
```


---