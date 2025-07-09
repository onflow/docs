---
sidebar_position: 1
title: "send"
description: "send function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/transport/send/send.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/transport/send/send.ts). DO NOT EDIT MANUALLY -->

# send

Sends arbitrary scripts, transactions, and requests to Flow.

This method consumes an array of builders that are to be resolved and sent. The builders required to be included in the array depend on the interaction that is being built.

WARNING: Must be used in conjunction with 'fcl.decode(response)' to get back correct keys and all values in JSON.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.send(args, opts)
```

Or import directly the specific function:

```typescript
import { send } from "@onflow/fcl-core"

send(args, opts)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// a script only needs to resolve the arguments to the script
const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
// note: response values are encoded, call await fcl.decode(response) to get JSON

// a transaction requires multiple 'builders' that need to be resolved prior to being sent to the chain - such as setting the authorizations.
const response = await fcl.send([
  fcl.transaction`
    ${transaction}
  `,
  fcl.args(args),
  fcl.proposer(proposer),
  fcl.authorizations(authorizations),
  fcl.payer(payer),
  fcl.limit(9999)
]);
// note: response contains several values
```

## Parameters

### `args` (optional)


- Type: 
```typescript
false | Function | (false | Function)[]
```
- Description: An array of builders (functions that take an interaction object and return a new interaction object)

### `opts` (optional)


- Type: `any`
- Description: Additional optional options for the request


## Returns

`Promise<any>`


A promise that resolves to a ResponseObject containing the data returned from the chain. Should always be decoded with fcl.decode() to get back appropriate JSON keys and values.

---