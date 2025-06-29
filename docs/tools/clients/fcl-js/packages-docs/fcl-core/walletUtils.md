---
sidebar_position: 1
title: "WalletUtils"
description: "Namespace containing WalletUtils utilities"
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core). DO NOT EDIT MANUALLY -->

# WalletUtils

## Overview

Namespace containing WalletUtils utilities

## Functions

### approve

Sends an approval response to FCL with the provided data. This indicates that the user
has approved the requested operation (authentication, transaction signing, etc.) and includes the
resulting data (signatures, account information, etc.).

Sends "FCL:VIEW:RESPONSE". with status "APPROVED".

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.approve(data)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.approve(data)
```

#### Usage

```typescript
// Approve authentication with account data
import { approve } from "@onflow/fcl"

const accountData = {
  f_type: "AuthnResponse",
  f_vsn: "1.0.0",
  addr: "0x1234567890abcdef",
  services: [
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authz",
      method: "HTTP/POST",
      endpoint: "https://wallet.example.com/authz"
    }
  ]
}

approve(accountData)
```

#### Parameters

##### `data`


- Type: `any`
- Description: The approval data to send back to FCL (signatures, account info, etc.)

#### Returns

`void`

### close

Closes the wallet service window/iframe and notifies FCL that the service is shutting down.
This should be called when the user cancels an operation or when the wallet service needs to close itself.

Sends "FCL:VIEW:CLOSE".

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.close()
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.close()
```


#### Returns

`void`

### decline

Sends a decline response to FCL indicating that the user has rejected or cancelled
the requested operation. This should be called when the user explicitly cancels an operation
or when an error prevents the operation from completing.

Sends "FCL:VIEW:RESPONSE". with status "DECLINED".

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.decline(reason)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.decline(reason)
```

#### Usage

```typescript
// Decline when user cancels authentication
import { decline } from "@onflow/fcl"

document.getElementById('cancel-btn').addEventListener('click', () => {
  decline("User cancelled authentication")
})
```

#### Parameters

##### `reason`


- Type: `string`
- Description: Human-readable reason for declining the request

#### Returns

`void`

### encodeAccountProof

Encodes account proof data for cryptographic signing on the Flow blockchain. This function
creates a standardized message format that combines the application identifier, account address,
and nonce into a format suitable for cryptographic signing. The encoded message can then be signed
by the account's private key to create an account proof.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.encodeAccountProof(accountProofData, includeDomainTag)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.encodeAccountProof(accountProofData, includeDomainTag)
```

#### Usage

```typescript
// Basic account proof encoding
import { encodeAccountProof } from "@onflow/fcl"

const accountProofData = {
  address: "0x1234567890abcdef",
  nonce: "75f8587e5bd982ec9289c5be1f9426bd12b4c1de9c7a7e4d8c5f9e8b2a7c3f1e9", // 64 hex chars (32 bytes)
  appIdentifier: "MyAwesomeApp"
}

const encodedMessage = encodeAccountProof(accountProofData)
console.log("Encoded message:", encodedMessage)
```

#### Parameters

##### `accountProofData`


- Type: 
```typescript
export interface AccountProofData {
  address: string
  nonce: string
  signatures: CompositeSignature[]
}
```

##### `includeDomainTag` (optional)


- Type: `boolean`
- Description: Whether to include the FCL domain tag in the encoding

#### Returns

`string`

### encodeMessageFromSignable

Encodes a message from a signable object for a specific signer address.

This function determines whether the signer should sign the transaction payload or envelope
based on their role in the transaction (authorizer, proposer, or payer), then encodes the
appropriate message for signing.

Payload signers include authorizers and proposers (but not payers)
Envelope signers include only payers

The encoded message is what gets signed by the account's private key to create the transaction signature.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.encodeMessageFromSignable(signable, signerAddress)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.encodeMessageFromSignable(signable, signerAddress)
```

#### Usage

```typescript
import * as fcl from "@onflow/fcl";

// This function is typically used internally by authorization functions
// when implementing custom wallet connectors or signing flows

const signable = {
  voucher: {
    cadence: "transaction { prepare(acct: AuthAccount) {} }",
    authorizers: ["0x01"],
    proposalKey: { address: "0x01", keyId: 0, sequenceNum: 42 },
    payer: "0x02",
    refBlock: "a1b2c3",
    computeLimit: 100,
    arguments: [],
    payloadSigs: []
  }
};

// For an authorizer (payload signer)
const authorizerMessage = fcl.encodeMessageFromSignable(signable, "0x01");
console.log("Authorizer signs:", authorizerMessage);

// For a payer (envelope signer)
const payerMessage = fcl.encodeMessageFromSignable(signable, "0x02");
console.log("Payer signs:", payerMessage);
```

#### Parameters

##### `signable`


- Type: `any`
- Description: The signable object containing transaction data and voucher

##### `signerAddress`


- Type: `any`
- Description: The address of the signer to encode the message for

#### Returns

```typescript
(signable: Signable, signerAddress: string) => string
```

### injectExtService

Injects an external authentication service into the global FCL extensions array.
This function is used by wallet providers to register their authentication services with FCL,
making them available for user authentication. The service must be of type "authn" and have
a valid endpoint.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.injectExtService(service)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.injectExtService(service)
```

#### Usage

```typescript
// Register a wallet authentication service
const walletService = {
  type: "authn",
  endpoint: "https://example-wallet.com/fcl/authn",
  method: "HTTP/POST",
  identity: { address: "0x123..." },
  provider: { name: "Example Wallet" }
}
fcl.WalletUtils.injectExtService(walletService)
```

#### Parameters

##### `service`


- Type: [`Service`](../types#service)
- Description: The authentication service to inject. Must have type "authn" and a valid endpoint

#### Returns

`void`

### onMessageFromFCL

Sets up a message listener to receive messages from the parent FCL application. This
function is used by wallet services to listen for specific message types from FCL and respond
accordingly. It handles message filtering, data sanitization, and provides context about the
message origin for security purposes.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.onMessageFromFCL(messageType, cb)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.onMessageFromFCL(messageType, cb)
```

#### Usage

```typescript
// Listen for authentication requests from FCL
import { onMessageFromFCL } from "@onflow/fcl"

const removeListener = onMessageFromFCL("FCL:VIEW:READY:RESPONSE", (data, context) => {
  console.log("FCL is ready for communication")
  console.log("Message from:", context.origin)
  console.log("Ready data:", data)

  // Verify origin for security
  if (context.origin === "https://myapp.com") {
    initializeWalletServices()
  } else {
    console.warn("Unexpected origin:", context.origin)
  }
})

// Stop listening when wallet service closes
window.addEventListener("beforeunload", () => {
  removeListener()
})
```

#### Parameters

##### `messageType`


- Type: `string`
- Description: The specific message type to listen for (e.g., "FCL:VIEW:READY:RESPONSE")

##### `cb` (optional)


- Type: 
```typescript
(data: any, context: { origin: string; }) => void
```
- Description: Callback function executed when a matching message is received

#### Returns

```typescript
() => void
```

### ready

Initiates the communication handshake between a wallet service and FCL. This function
listens for the "FCL:VIEW:READY:RESPONSE" message from FCL and automatically sends "FCL:VIEW:READY"
to indicate the wallet service is ready to receive requests. This is typically the first function
called when a wallet service loads.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.ready(cb, msg)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.ready(cb, msg)
```

#### Usage

```typescript
// Basic wallet service initialization
import { ready } from "@onflow/fcl"

ready((data, context) => {
  console.log("FCL is ready to communicate")
  console.log("FCL origin:", context.origin)
  console.log("Ready data:", data)

  // Wallet service is now ready to handle authentication requests
  initializeWalletUI()
})
```

#### Parameters

##### `cb`


- Type: 
```typescript
(data: any, context: { origin: string; }) => void
```
- Description: Callback function executed when FCL responds with ready confirmation

##### `msg` (optional)


- Type: 
```typescript
export interface PollingResponse {
  f_type: "PollingResponse"
  f_vsn: "1.0.0"
  status: "APPROVED" | "DECLINED" | "REDIRECT"
  reason: string | null
  data: any
}
```
- Description: Optional message payload to include with ready signal

#### Returns

`void`

### redirect

Sends a redirect response to FCL indicating that the operation requires a redirect
to complete. This is used when the wallet service needs to redirect the user to another URL
(such as a native app deep link or external service).

Sends "FCL:VIEW:RESPONSE". with status "REDIRECT".

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.redirect(data)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.redirect(data)
```

#### Usage

```typescript
// Redirect to native wallet app
import { redirect } from "@onflow/fcl"

redirect({
  f_type: "RedirectResponse",
  f_vsn: "1.0.0",
  url: "flow-wallet://sign?transaction=abc123",
  callback: "https://myapp.com/callback"
})
```

#### Parameters

##### `data`


- Type: `any`
- Description: Redirect data containing the target URL and any additional parameters

#### Returns

`void`

### sendMsgToFCL

Sends messages from a wallet or service back to the parent FCL application. This function
handles communication between wallet UIs (running in iframes, popups, or redirects) and the main FCL
application. It automatically detects the communication method (redirect, iframe, or popup) and sends
the message accordingly.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.WalletUtils.sendMsgToFCL(type, msg)
```

Or import the namespace directly:

```typescript
import { WalletUtils } from "@onflow/fcl-core"

WalletUtils.sendMsgToFCL(type, msg)
```

#### Usage

```typescript
// Send approval response with signature data
import { sendMsgToFCL } from "@onflow/fcl"

sendMsgToFCL("FCL:VIEW:RESPONSE", {
  f_type: "CompositeSignature",
  f_vsn: "1.0.0",
  addr: "0x1234567890abcdef",
  keyId: 0,
  signature: "abc123..."
})
```

#### Parameters

##### `type`


- Type: `string`
- Description: The message type identifier (e.g., "FCL:VIEW:RESPONSE", "FCL:VIEW:READY")

##### `msg` (optional)


- Type: 
```typescript
export interface PollingResponse {
  f_type: "PollingResponse"
  f_vsn: "1.0.0"
  status: "APPROVED" | "DECLINED" | "REDIRECT"
  reason: string | null
  data: any
}
```
- Description: Optional message payload containing response data

#### Returns

`void`


---