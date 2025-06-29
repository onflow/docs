---
sidebar_position: 1
title: "AppUtils"
description: "Namespace containing AppUtils utilities"
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core). DO NOT EDIT MANUALLY -->

# AppUtils

## Overview

Namespace containing AppUtils utilities

## Functions

### verifyAccountProof

Verifies the authenticity of an account proof signature on the Flow blockchain.
Account proofs are cryptographic signatures used to prove ownership of a Flow account without
revealing private keys. This function validates that the provided signatures were indeed created
by the private keys associated with the specified Flow account address.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.AppUtils.verifyAccountProof(appIdentifier, accountProofData, opts)
```

Or import the namespace directly:

```typescript
import { AppUtils } from "@onflow/fcl-core"

AppUtils.verifyAccountProof(appIdentifier, accountProofData, opts)
```

#### Usage

```typescript
import * as fcl from "@onflow/fcl"

const accountProofData = {
  address: "0x123",
  nonce: "F0123"
  signatures: [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}],
}

const isValid = await fcl.AppUtils.verifyAccountProof(
  "AwesomeAppId",
  accountProofData,
  {fclCryptoContract}
)
```

#### Parameters

##### `appIdentifier`


- Type: `string`
- Description: A unique identifier for your application. This is typically
your app's name or domain and is included in the signed message to prevent replay attacks
across different applications.

##### `accountProofData`


- Type: 
```typescript
export interface AccountProofData {
  address: string
  nonce: string
  signatures: CompositeSignature[]
}
```

##### `opts` (optional)


- Type: 
```typescript
export interface VerifySignaturesScriptOptions {
  fclCryptoContract?: string
}
```
- Description: Optional configuration parameters

#### Returns

`Promise<boolean>`

### verifyUserSignatures

Verifies user signatures for arbitrary messages on the Flow blockchain. This function
validates that the provided signatures were created by the private keys associated with the specified
Flow account when signing the given message. This is useful for authenticating users or validating
signed data outside of transaction contexts.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.AppUtils.verifyUserSignatures(message, compSigs, opts)
```

Or import the namespace directly:

```typescript
import { AppUtils } from "@onflow/fcl-core"

AppUtils.verifyUserSignatures(message, compSigs, opts)
```

#### Usage

```typescript
// Basic message signature verification
import * as fcl from "@onflow/fcl"

const originalMessage = "Hello, Flow blockchain!"
const hexMessage = Buffer.from(originalMessage).toString("hex")

const signatures = [{
  f_type: "CompositeSignature",
  f_vsn: "1.0.0",
  addr: "0x1234567890abcdef",
  keyId: 0,
  signature: "abc123def456..." // signature from user's wallet
}]

const isValid = await fcl.AppUtils.verifyUserSignatures(
  hexMessage,
  signatures
)
```

#### Parameters

##### `message`


- Type: `string`
- Description: The message that was signed, encoded as a hexadecimal string. The original
message should be converted to hex before passing to this function.

##### `compSigs`


- Type: [`CompositeSignature[]`](../types#compositesignature)
- Description: Array of composite signatures to verify. All signatures
must be from the same account address.

##### `opts` (optional)


- Type: 
```typescript
export interface VerifySignaturesScriptOptions {
  fclCryptoContract?: string
}
```
- Description: Optional configuration parameters

#### Returns

`Promise<boolean>`


---