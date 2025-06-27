---
sidebar_position: 1
title: "TransactionExecutionStatus"
description: "TransactionExecutionStatus function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/sdk.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/sdk.ts). DO NOT EDIT MANUALLY -->

# TransactionExecutionStatus

The execution status of the transaction.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.TransactionExecutionStatus()
```

Or import directly the specific function:

```typescript
import { TransactionExecutionStatus } from "@onflow/sdk"

TransactionExecutionStatus()
```



## Returns

```typescript
{ readonly UNKNOWN: 0; readonly PENDING: 1; readonly FINALIZED: 2; readonly EXECUTED: 3; readonly SEALED: 4; readonly EXPIRED: 5; }
```


---