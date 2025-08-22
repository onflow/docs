---
title: "TestUtils"
description: "Namespace containing TestUtils utilities"
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk](https://github.com/onflow/fcl-js/tree/master/packages/sdk). DO NOT EDIT MANUALLY -->

# TestUtils

## Overview

Namespace containing TestUtils utilities

## Functions

### authzDeepResolveMany

Creates a deep test authorization resolver with nested resolution for complex testing scenarios.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.authzDeepResolveMany(opts, depth)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.authzDeepResolveMany(opts, depth)
```


#### Parameters

##### `opts` (optional)


- Type: 
```typescript
interface IAuthzResolveMany {
  tempId?: string
  authorizations: any[]
  proposer?: any
  payer?: any
}
```
- Description: Configuration including authorizations array and optional proposer/payer

##### `depth` (optional)


- Type: `number`
- Description: The depth of nesting for the resolver (default: 1)

#### Returns

[`InteractionAccount`](../types#interactionaccount)

### authzFn

Creates a test authorization function for testing transactions.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.authzFn(opts)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.authzFn(opts)
```


#### Parameters

##### `opts` (optional)


- Type: 
```typescript
interface IAuthzOpts {
  signingFunction?: (signable: any) => any
}
```
- Description: Optional configuration including custom signing function

#### Returns

`Partial<InteractionAccount>`

### authzResolve

Creates a test authorization resolver that can be used for testing account resolution.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.authzResolve(opts)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.authzResolve(opts)
```


#### Parameters

##### `opts` (optional)


- Type: 
```typescript
interface IAuthzResolveOpts {
  tempId?: string
}
```
- Description: Optional configuration including temporary ID

#### Returns

```typescript
Partial<InteractionAccount>; kind: InteractionResolverKind.ACCOUNT; addr: string; keyId: string | number; sequenceNum: number; signature: string; signingFunction: any; role: { proposer: boolean; authorizer: boolean; payer: boolean; param?: boolean; }; authorization: any; }
```

### authzResolveMany

Creates a test authorization resolver that handles multiple accounts with different roles.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.authzResolveMany(opts)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.authzResolveMany(opts)
```


#### Parameters

##### `opts` (optional)


- Type: 
```typescript
interface IAuthzResolveMany {
  tempId?: string
  authorizations: any[]
  proposer?: any
  payer?: any
}
```
- Description: Configuration including authorizations array and optional proposer/payer

#### Returns

[`InteractionAccount`](../types#interactionaccount)

### idof

Generates a unique identifier for an account based on its address and key ID.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.idof(acct)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.idof(acct)
```


#### Parameters

##### `acct`


- Type: [`InteractionAccount`](../types#interactionaccount)
- Description: The account object

#### Returns

`string`

### run

Runs a set of functions on an interaction

This is a utility function for testing that builds and resolves an interaction with the provided builder functions.
It automatically adds a reference block and then resolves the interaction for testing purposes.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.run(fns)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.run(fns)
```

#### Usage

```typescript
import { run } from "@onflow/sdk"
import * as fcl from "@onflow/fcl";

// Test a simple script interaction
const result = await run([
  fcl.script`
    access(all) fun main(): Int {
      return 42
    }
  `
]);

console.log(result.cadence); // The Cadence script
console.log(result.tag); // "SCRIPT"

// Test a transaction with arguments
const txResult = await run([
  fcl.transaction`
    transaction(amount: UFix64) {
      prepare(account: AuthAccount) {
        log(amount)
      }
    }
  `,
  fcl.args([fcl.arg("10.0", fcl.t.UFix64)])
]);

console.log(txResult.message.arguments); // The resolved arguments
```

#### Parameters

##### `fns` (optional)


- Type: 
```typescript
((ix: Interaction) => Interaction | Promise<Interaction>)[]
```
- Description: An array of functions to run on the interaction

#### Returns

[`Promise<Interaction>`](../types#interaction)

### sig

Generates a test signature string for an account.

#### Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TestUtils.sig(opts)
```

Or import the namespace directly:

```typescript
import { TestUtils } from "@onflow/sdk"

TestUtils.sig(opts)
```


#### Parameters

##### `opts`


- Type: `Partial<InteractionAccount>`
- Description: Partial account object containing address and keyId

#### Returns

`string`


---