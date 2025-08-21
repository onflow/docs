---
title: 'build'
description: 'build function documentation.'
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/cadence/build.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/cadence/build.ts). DO NOT EDIT MANUALLY -->

# build

A builder function that creates an interaction from an array of builder functions.

The build function takes an array of builder functions and applies them to create a complete interaction object. This is the foundation for constructing all interactions in Flow, whether they're scripts, transactions, or queries.

Each builder function modifies specific parts of the interaction object, such as adding Cadence code, arguments, authorization details, or other configuration.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from '@onflow/sdk';

sdk.build(fns);
```

Or import directly the specific function:

```typescript
import { build } from '@onflow/sdk';

build(fns);
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';

// Build a script interaction
const scriptInteraction = await fcl.build([
  fcl.script`
    access(all) fun main(a: Int, b: Int): Int {
      return a + b
    }
  `,
  fcl.args([fcl.arg(1, fcl.t.Int), fcl.arg(2, fcl.t.Int)]),
]);

// Build a transaction interaction
const txInteraction = await fcl.build([
  fcl.transaction`
    transaction(name: String) {
      prepare(account: AuthAccount) {
        log("Hello, " + name)
      }
    }
  `,
  fcl.args([fcl.arg('World', fcl.t.String)]),
  fcl.proposer(proposerAuthz),
  fcl.payer(payerAuthz),
  fcl.authorizations([authorizerAuthz]),
  fcl.limit(100),
]);
```

## Parameters

### `fns` (optional)

- Type: `(false | InteractionBuilderFn)[]`
- Description: The functions to apply to the interaction

## Returns

[`Promise<Interaction>`](../types#interaction)

A promise of an interaction

---
