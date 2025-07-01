---
sidebar_position: 1
title: "resolveArguments"
description: "resolveArguments function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-arguments.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-arguments.ts). DO NOT EDIT MANUALLY -->

# resolveArguments

Resolves transaction arguments by evaluating argument functions and converting them to appropriate types.

This function processes all arguments in a transaction or script interaction, calling their transform functions
to convert JavaScript values into Cadence-compatible argument formats that can be sent to the Flow network.

The resolution process includes:
- Calling argument resolver functions if present
- Applying type transformations using the xform field
- Handling recursive argument resolution up to a depth limit

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveArguments(ix)
```

Or import directly the specific function:

```typescript
import { resolveArguments } from "@onflow/sdk"

resolveArguments(ix)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Arguments are automatically resolved during send()
await fcl.send([
  fcl.script`
    access(all) fun main(amount: UFix64, recipient: Address): String {
      return "Sending ".concat(amount.toString()).concat(" to ").concat(recipient.toString())
    }
  `,
  fcl.args([
    fcl.arg("100.0", fcl.t.UFix64),    // Will be resolved to Cadence UFix64
    fcl.arg("0x01", fcl.t.Address)     // Will be resolved to Cadence Address
  ])
]).then(fcl.decode);

// The resolveArguments function handles the conversion automatically
```

## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing arguments to resolve


## Returns

[`Promise<Interaction>`](../types#interaction)


The interaction with resolved arguments ready for network transmission

---