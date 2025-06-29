---
sidebar_position: 1
title: "authz"
description: "authz function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# authz

A convenience method that produces the needed authorization details for the current user to submit transactions to Flow. It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.

You can replace this function with your own authorization function if needed.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.authz()
```

Or import directly the specific function:

```typescript
import { authz } from "@onflow/fcl"

authz()
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';
// login somewhere before
fcl.authenticate();
// once logged in authz will produce values
console.log(fcl.authz);
// prints {addr, signingFunction, keyId, sequenceNum} from the current authenticated user.

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2

    transaction(name: String) {
      prepare(account: auth(BorrowValue) &Account) {
        account.storage.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg('myName', t.String)],
  proposer: fcl.authz, // optional - default is fcl.authz
  payer: fcl.authz, // optional - default is fcl.authz
  authorizations: [fcl.authz], // optional - default is [fcl.authz]
});
```


## Returns

```typescript
(account: Account) => Promise<Account>
```


An object containing the necessary details from the current user to authorize a transaction in any role.

---