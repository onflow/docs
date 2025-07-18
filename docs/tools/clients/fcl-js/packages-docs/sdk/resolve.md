---
title: "resolve"
description: "resolve function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve.ts). DO NOT EDIT MANUALLY -->

# resolve

Resolves an interaction by applying a series of resolvers in sequence.

This is the main resolver function that takes a built interaction and prepares it
for submission to the Flow blockchain by applying all necessary resolvers.

The resolve function uses a pipeline approach, applying each resolver in sequence
to transform the interaction from its initial built state to a fully resolved state
ready for transmission to the Flow Access API.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolve(context)
```

Or import directly the specific function:

```typescript
import { resolve } from "@onflow/sdk"

resolve(context)
```

## Usage

```typescript
import { resolve, build, script } from "@onflow/sdk"

const interaction = await build([
  script`
    access(all) fun main(): String {
      return "Hello, World!"
    }
  `
])

const resolved = await resolve(interaction)
```

## Parameters

### `context` 


- Type: 
```typescript
export interface SdkContext {
  get accessNodeUrl(): string
  get transport(): SdkTransport
  get computeLimit(): number
  get customResolver(): ((args: any) => Promise<any>) | undefined
  get customDecoders(): {[key: string]: (data: any) => any}
  get contracts(): {
    [contractName: string]: string
  }
  get debug(): {[key: string]: any} 
  get legacyContractIdentifiers(): Record<string, string>
}
```


## Returns

[`Promise<Interaction>`](../types#interaction)


---