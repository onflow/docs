---
sidebar_position: 1
title: "TransactionExecutionStatus"
description: "TransactionExecutionStatus function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# TransactionExecutionStatus

The execution status of the transaction.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.TransactionExecutionStatus()
```

Or import directly the specific function:

```typescript
import { TransactionExecutionStatus } from "@onflow/fcl"

TransactionExecutionStatus()
```



## Returns

```typescript
{ readonly UNKNOWN: 0; readonly PENDING: 1; readonly FINALIZED: 2; readonly EXECUTED: 3; readonly SEALED: 4; readonly EXPIRED: 5; }
```


---