---
sidebar_position: 1
title: "cdc"
description: "cdc function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/sdk.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/sdk.ts). DO NOT EDIT MANUALLY -->

# cdc

Creates a template function

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.cdc(head, rest)
```

Or import directly the specific function:

```typescript
import { cdc } from "@onflow/sdk"

cdc(head, rest)
```

## Usage

```typescript
import { template } from "@onflow/util-template"

// String template
const simpleTemplate = template("Hello, World!");
console.log(simpleTemplate()); // "Hello, World!"

// Template literal with interpolation
const name = "Alice";
const greeting = template`Hello, ${name}!`;
console.log(greeting()); // "Hello, Alice!"

// Cadence script template
const cadenceScript = template`
  access(all) fun main(greeting: String): String {
    return greeting.concat(", from Flow!")
  }
`;
console.log(cadenceScript()); // The Cadence script as a string

// Used with FCL for dynamic Cadence code
import * as fcl from "@onflow/fcl";

const contractAddress = "0x123456789abcdef0";
const scriptTemplate = fcl.cadence`
  import MyContract from ${contractAddress}

  access(all) fun main(): String {
    return MyContract.getMessage()
  }
`;
```

## Parameters

### `head` 

- Type: `string | TemplateStringsArray | ((x?: unknown) => string)`
- Description: - A string, template string array, or template function


### `rest` (optional)

- Type: `unknown[]`
- Description: - The rest of the arguments



## Returns

`(x?: unknown) => string`


---