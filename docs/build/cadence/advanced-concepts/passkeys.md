---
title: Passkeys 
description: Implement passkeys on Flow using WebAuthn, covering key extraction, challenges, signature formatting for Flow, and signature extensions.
keywords:
  - passkeys
  - WebAuthn
  - authentication
  - ECDSA P256
  - ES256
  - Flow account keys
  - wallet integration
  - credential management
  - signature verification
  - biometric authentication
  - FIDO2
  - multi-factor authentication
  - passwordless authentication
  - Flow transactions
  - public key cryptography
sidebar_position: 9
---

# Passkeys

This is a wallet‑centric, high‑level guide (per [FLIP 264: WebAuthn Credential Support]) with code snippets covering passkey registration and signing on Flow, focusing on nuances for passkey signing and account keys:

1. Create a passkey and add a Flow account key
2. Sign a transaction with the user's passkey (includes conversion, extension, and submission)

It accompanies the [PoC demo] for reference and cites the FLIP where behavior is normative.

:::note Platform-specific APIs

This tutorial focuses on the **Web Authentication API** (WebAuthn) for browser-based applications. Other platforms such as iOS, Android, and desktop applications will require platform-specific APIs (such as Apple's [Authentication Services] or Android's [Credential Manager]), but the underlying concepts—credential creation, challenge signing, and signature formatting—remain the same across all platforms.

:::

## What you'll learn

After you complete this guide, you'll be able to:

- Create a passkey and derive a Flow‑compatible public key.
- Generate the correct challenge for signing transactions (wallet sets SHA2‑256(signable)).
- Convert a WebAuthn ECDSA DER signature into Flow's raw `r||s` format and attach the transaction signature extension.

## Passkey benefits

**Sign transactions securely**  
Users can sign Flow transactions with passkeys while the private key stays securely stored within the authenticator. This reduces the risk of key extraction attacks and phishing attempts.

**Authenticate across devices**  
Users can scan a QR code displayed on a desktop browser with a mobile device to approve transactions. Cloud-synchronized passkeys (such as those stored in Apple iCloud or Google Password Manager) allow authentication across multiple devices without manual key transfers.

**Authenticate with platform-based security**  
Users can sign transactions directly on devices with built-in authenticators, such as Face ID on iPhones or Windows Hello on Windows PCs. This approach allows native transaction signing without the need for an external security key.

**Recover access with cloud-synced passkeys**  
Cloud-synced passkeys help users recover access if they lose a device, though this introduces trade-offs between convenience and self-custody (see [Limitations of passkeys].

**Work with multi-key accounts**  
Combine passkeys with other authentication types with Flow's native [multi-key account support] to build secure recovery options and shared access patterns with weighted keys.

## Prerequisites

- Working knowledge of modern frontend (React/Next.js) and basic backend.
- Familiarity with WebAuthn/Passkeys concepts and platform constraints.
- Flow Command Line (FCL) installed and configured for your app.
- Flow accounts and keys: [Signature and Hash Algorithms].

## Registration

When a user generates a passkey via [navigator.credentials.create()] with `{ publicKey }`, the authenticator returns an attestation that contains the new credential's public key. On Flow, you can register that public key on an account if the algorithm of the requested passkey is either `ES256` or `ES256k`. This guide demonstrates an `ES256` passkey which translates to an `ECDSA_P256` Flow key paired with `SHA2_256` hashing. Alternatively, an `ES256k` passkey translates to an `ECDSA_secp256k1` Flow key paired with `SHA2_256` hashing.

High‑level steps:

1. On the client, generate `PublicKeyCredentialCreationOptions` with:
  - `pubKeyCredParams`'s `alg` equal to `ES256` (`-7`)
  - the RP id is derived from to the web origin
  - the challenge equal to an arbitrary constant
2. On the client, call `navigator.credentials.create()`.
3. Verify attestation if necessary and extract the public key (P‑256 in this guide). Convert it to raw uncompressed 64‑byte `X||Y` hex string as expected by Flow.
4. Submit a transaction to add the key to the Flow account with weight and algorithms:
   - Signature algorithm: `ECDSA_P256`
   - Hash algorithm: `SHA2_256`

:::info

Libraries like SimpleWebAuthn can parse the COSE key and produce the raw public key bytes required for onchain registration. Ensure you normalize into the exact raw byte format Flow expects before it writes to the account key.

:::

### Build creation options and create credential

Minimum example — wallet‑mode registration:

This builds `PublicKeyCredentialCreationOptions` for a wallet RP with a constant registration challenge and ES256 (P‑256) so you can register the newly-created public key on a Flow account.

```tsx
// In a wallet (RP = wallet origin). The challenge satisfies API & correlates request/response.
// Use a stable, opaque user.id per wallet user (do not randomize per request).

const rp = { name: "Passkey Wallet", id: window.location.hostname } as const
const user = {
  id: getStableUserIdBytes(), // Uint8Array (16–64 bytes) stable per user
  name: "flow-user",
  displayName: "Flow User",
} as const

const creationOptions: PublicKeyCredentialCreationOptions = {
  challenge: new TextEncoder().encode("flow-wallet-register"), // constant is acceptable in wallet-mode; wallet providers may choose and use a constant value as needed for correlation
  rp,
  user,
  pubKeyCredParams: [
    { type: "public-key", alg: -7 }, // ES256 (ECDSA on P-256 with SHA-256)
    // Optionally ES256K (ECDSA on secp256k1 with SHA-256) if the device supports secp256k1 keys:
    // { type: "public-key", alg: -47 },
  ],
  authenticatorSelection: { userVerification: "preferred" },
  timeout: 60_000,
  attestation: "none",
}

const credential = await navigator.credentials.create({ publicKey: creationOptions })

// Send to wallet-core (or local) to extract COSE ECDSA P-256 public key (verify attestation if necessary)
// Then register the raw uncompressed key bytes on the Flow account as ECDSA_P256/SHA2_256 (this guide's choice)
```

:::tip RP ID for non-browser platforms

For web applications, `rpId` is set to `window.location.hostname`. For native mobile and desktop applications, use your app's identifier instead:
- **iOS**: Use your app's bundle identifier (such as `com.example.wallet`) or an associated domain.
- **Android**: Use your app's package name (such as `com.example.wallet`) or an associated domain.
- **Desktop**: Use your application identifier or registered domain.

The `rpId` should remain consistent across credential creation and assertion for the same user account. However, Flow does not validate or enforce this consistency.
:::

### Extract and normalize public key

Client-side example — extract COSE ECDSA public key (no verification) and derive raw uncompressed 64-byte `X||Y` hex suitable for Flow key registration:

This parses the `attestationObject` to locate the COSE EC2 `credentialPublicKey`, reads the x/y coordinates, and returns raw uncompressed 64-byte `X||Y` hex suitable for Flow key registration. Attestation verification is intentionally omitted here.

```tsx
// Uses a small CBOR decoder (e.g., 'cbor' or 'cbor-x') to parse attestationObject
import * as CBOR from 'cbor'

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function extractCosePublicKeyFromAttestation(attObj: Uint8Array): Uint8Array {
  // attestationObject is a CBOR map with 'authData'
  const decoded: any = CBOR.decode(attObj)
  const authData = new Uint8Array(decoded.authData)

  // Parse authData (WebAuthn spec):
  // rpIdHash(32) + flags(1) + signCount(4) = 37 bytes header
  let offset = 37
  // aaguid (16)
  offset += 16
  // credentialId length (2 bytes, big-endian)
  const credIdLen = (authData[offset] << 8) | authData[offset + 1]
  offset += 2
  // credentialId (credIdLen bytes)
  offset += credIdLen
  // The next CBOR structure is the credentialPublicKey (COSE key)
  return authData.slice(offset)
}

function coseEcP256ToUncompressedXYHex(coseKey: Uint8Array): string {
  // COSE EC2 key is a CBOR map; for P-256, x = -2, y = -3
  const m: Map<number, any> = CBOR.decode(coseKey)
  const x = new Uint8Array(m.get(-2))
  const y = new Uint8Array(m.get(-3))
  if (x.length > 32 || y.length > 32) throw new Error('Invalid P-256 coordinate lengths')
  const xy = new Uint8Array(64)
  xy.set(x, 32 - x.length)
  xy.set(y, 64 - y.length)
  return toHex(xy) // 64-byte X||Y hex, no 0x or 0x04 prefix
}

// Usage
const cred = (await navigator.credentials.create({ publicKey: creationOptions })) as PublicKeyCredential
const att = cred.response as AuthenticatorAttestationResponse
const attObj = new Uint8Array(att.attestationObject as ArrayBuffer)
const cosePubKey = extractCosePublicKeyFromAttestation(attObj)
const publicKeyHex = coseEcP256ToUncompressedXYHex(cosePubKey)
```

 

### Add key to account

Now that you have the user's public key, provision a Flow account with that key. Account creation (or to add key to an account) requires payment. In practice, account instantiation typically occurs on the wallet provider's backend service.

In the PoC demo, we used a test API to provision an account with the public key:

```ts
const ACCOUNT_API = "https://wallet.example.com/api/accounts/provision"

export async function createAccountWithPublicKey(
  publicKeyHex: string,
  _opts?: {signAlgo?: number; hashAlgo?: number; weight?: number}
): Promise<string> {
  const trimmed = publicKeyHex
  const body: ProvisionAccountRequest = {
    publicKey: trimmed,
    signatureAlgorithm: "ECDSA_P256",
    hashAlgorithm: "SHA2_256",
  }
  const res = await fetch(ACCOUNT_API, {
    method: "POST",
    headers: {Accept: "application/json", "Content-Type": "application/json"},
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Account API error: ${res.status}`)
  const json = (await res.json()) as ProvisionAccountResponse
  if (!json?.address) throw new Error("Account API missing address in response")
  return json.address
}
```

:::note

In production, this would be a service owned by the wallet provider that creates the account and attaches the user's public key, for reasons like payment handling, abuse prevention, telemetry, and correlation as needed.

:::

## Signing

### Generate the challenge

- Assertion (transaction signing): Wallet sets `challenge` to the SHA2‑256 of the signable transaction message (payload or envelope per signer role). No server‑sent or random challenge is used. Flow includes a domain‑separation tag in the signable bytes.

Minimal example — derive signable message and hash (per FLIP):

Compute the signer‑specific signable message and hash it with SHA2‑256 to produce the WebAuthn `challenge` (no server‑generated nonce is used in wallet mode).

```tsx
// Imports for helpers used to build the signable message
import { encodeMessageFromSignable, encodeTransactionPayload } from '@onflow/fcl'
// Hash/encoding utilities (example libs)
import { sha256 } from '@noble/hashes/sha256'
import { hexToBytes } from '@noble/hashes/utils'

// Inputs:
// - signable: object containing the voucher/payload bytes (e.g., from a ready payload)
// - address: the signing account address (hex string)

declare const signable: any
declare const address: string

// 1) Encode the signable message for this signer (payload vs envelope)
const msgHex = encodeMessageFromSignable(signable, address)
const payloadMsgHex = encodeTransactionPayload(signable.voucher)
const role = msgHex === payloadMsgHex ? "payload" : "envelope"

// 2) Compute SHA2-256(msgHex) -> 32-byte challenge
const signableHash: Uint8Array = sha256(hexToBytes(msgHex))

// 3) Call navigator.credentials.get with challenge = signableHash
// (see next subsection for a full getAssertion example)
```

:::info

`encodeMessageFromSignable` and `encodeTransactionPayload` are FCL‑specific helpers. If you don't use FCL, construct the Flow signable transaction message yourself (payload for proposer/authorizer, envelope for payer, prepended by the transaction domain tag), then compute `SHA2‑256(messageBytes)` for the challenge. The payload encoding shown here applies regardless of wallet implementation; the helper calls are simply conveniences from FCL.

:::

### Request assertion

Minimal example — wallet assertion:

Build [PublicKeyCredentialRequestOptions] and request an assertion with the transaction hash as `challenge`. `rpId` must match the wallet domain. When the wallet has mapped the active account to a credential, include `allowCredentials` with that credential ID to avoid extra prompts. You can omit it, which is permissible for discoverable credentials. You will invoke [navigator.credentials.get()].

```tsx
// signableHash is SHA2-256(signable message: payload or envelope)
declare const signableHash: Uint8Array
declare const credentialId: Uint8Array // Credential ID for the active account (from prior auth)

const requestOptions: PublicKeyCredentialRequestOptions = {
  challenge: signableHash,
  rpId: window.location.hostname,
  userVerification: "preferred",
  timeout: 60_000,
  allowCredentials: [
    {
      type: "public-key",
      id: credentialId,
    },
  ],
}

const assertion = (await navigator.credentials.get({
  publicKey: requestOptions,
})) as PublicKeyCredential

const { authenticatorData, clientDataJSON, signature } =
  assertion.response as AuthenticatorAssertionResponse
```

:::info

- **Credential selection**: Wallets typically know which credential corresponds to the user's active account (selected during authentication/authorization), so they should pass that credential via `allowCredentials` to scope selection and minimize prompts. For discoverable credentials, you can omit `allowCredentials`, which lets the authenticator surface available credentials. See [WebAuthn specifications] for guidance.
- **RP ID consistency**: The `rpId` used here should match what was used during credential creation. However, Flow does not validate or enforce this (transactions would still pass even if different). For non-browser platforms, use the same app identifier (bundle ID, package name, and so on.) as in registration.

:::

### Convert and attach signature

WebAuthn assertion signatures in this guide are ECDSA P‑256 over SHA‑256 and are typically returned in ASN.1/DER form. Flow expects raw 64‑byte signatures: `r` and `s` each 32 bytes, concatenated (`r || s`).

- Convert the DER `signature` to Flow raw `r||s` (64 bytes) and attach with `addr` and `keyId`.
- Build the transaction signature extension as specified: `extension_data = 0x01 || RLP([authenticatorData, clientDataJSON])`.

Minimal example — convert and attach for submission:

Convert the DER signature to Flow raw `r||s` and build `signatureExtension = 0x01 || RLP([authenticatorData, clientDataJSON])` per the FLIP, then compose the Flow transaction signature object for inclusion in your transaction.

```tsx
import { encode as rlpEncode } from 'rlp'
import { bytesToHex } from '@noble/hashes/utils'

// Inputs from previous steps
declare const address: string       // 0x-prefixed Flow address
declare const keyId: number         // Account key index used for signing
declare const signature: Uint8Array // DER signature from WebAuthn assertion
declare const clientDataJSON: Uint8Array
declare const authenticatorData: Uint8Array

// 1) DER -> raw r||s (64 bytes), implementation below or similar
const rawSig = derToRawRS(signature)

// 2) Build extension_data per FLIP: 0x01 || RLP([authenticatorData, clientDataJSON])
const rlpPayload = rlpEncode([authenticatorData, clientDataJSON]) as Uint8Array | Buffer
const rlpBytes = rlpPayload instanceof Uint8Array ? rlpPayload : new Uint8Array(rlpPayload)
const extension_data = new Uint8Array(1 + rlpBytes.length)
extension_data[0] = 0x01
extension_data.set(rlpBytes, 1)

// 3) Compose Flow signature object
const flowSignature = {
  addr: address,       // e.g., '0x1cf0e2f2f715450'
  keyId,               // integer key index
  signature: '0x' + bytesToHex(rawSig),
  signatureExtension: extension_data,
}
```

#### Submit the signature

Return the signature data to the application that initiated signing. The application should attach it to the user transaction for the signer (`addr`, `keyId`) and submit the transaction to the network.

See [Transactions] for how signatures are attached per signer role (payload vs envelope) and how submissions are finalized.

#### Helper: derToRawRS

```tsx
// Minimal DER ECDSA (r,s) -> raw 64-byte r||s
function derToRawRS(der: Uint8Array): Uint8Array {
  let offset = 0
  if (der[offset++] !== 0x30) throw new Error("Invalid DER sequence")
  const seqLen = der[offset++] // assumes short form
  if (seqLen + 2 !== der.length) throw new Error("Invalid DER length")

  if (der[offset++] !== 0x02) throw new Error("Missing r INTEGER")
  const rLen = der[offset++]
  let r = der.slice(offset, offset + rLen)
  offset += rLen
  if (der[offset++] !== 0x02) throw new Error("Missing s INTEGER")
  const sLen = der[offset++]
  let s = der.slice(offset, offset + sLen)

  // Strip leading zeros and left-pad to 32 bytes
  r = stripLeadingZeros(r)
  s = stripLeadingZeros(s)
  const r32 = leftPad32(r)
  const s32 = leftPad32(s)
  const raw = new Uint8Array(64)
  raw.set(r32, 0)
  raw.set(s32, 32)
  return raw
}

function stripLeadingZeros(bytes: Uint8Array): Uint8Array {
  let i = 0
  while (i < bytes.length - 1 && bytes[i] === 0x00) i++
  return bytes.slice(i)
}

function leftPad32(bytes: Uint8Array): Uint8Array {
  if (bytes.length > 32) throw new Error("Component too long")
  const out = new Uint8Array(32)
  out.set(bytes, 32 - bytes.length)
  return out
}
```
## Notes from the PoC

- The [PoC demo] demonstrates reference flows for passkey creation and assertion, such as:
  - Extract and normalize the ECDSA P‑256 public key for Flow.
  - Build the correct challenge .
  - Convert DER signatures to raw `r||s`.
  - Package WebAuthn fields as signature extension data.

> Align your implementation with the FLIP to ensure your extension payloads and verification logic match network expectations.

## Security and UX considerations

- Use `ES256` or `ES256k` as algorithms to create Flow account compatible keys.
- Clearly communicate platform prompts and recovery paths; passkeys UX can differ across OS/browsers.
- Replay protection: Flow uses on‑chain proposal‑key sequence numbers; see [Replay attacks].
- Optional wallet backend: store short‑lived correlation data or rate‑limits as needed (not required).

## Limitations of passkeys

**Functionality varies by authenticator**  
Some security keys do not support biometric authentication, which requires users to enter a PIN instead. Because WebAuthn does not provide access to private keys, users must either store their passkey securely or turn on cloud synchronization for recovery.

**Cloud synchronization introduces risks**  
Cloud-synced passkeys improve accessibility but also create risks if a cloud provider is compromised or if a user loses access to their cloud account. Users who prefer full self-custody can use hardware-based passkeys that do not rely on cloud synchronization.

**Passkeys cannot be exported**  
Users cannot transfer a passkey between different authenticators. For example, a passkey created on a security key cannot move to another device unless it syncs through a cloud provider. To avoid losing access, users should set up authentication on multiple devices or combine passkeys with [multi-key account configurations] for additional recovery options.

 
## Credential management (wallet responsibilities)

Wallet providers should persist credential metadata to support seamless signing, rotation, and recovery:

- Map `credentialId` ↔ Flow `addr` (and `keyId`) for the active account.
- Store `rpId`, user handle, and (optionally) `aaguid`/attestation info for risk decisions.
- Support multiple credentials per account and revocation/rotation workflows.
- Enforce nonce/sequence semantics and rate limits server-side as needed.

See [WebAuthn Credential Support (FLIP)] for rationale and wallet‑mode guidance.

## Conclusion

In this tutorial, you integrated passkeys (WebAuthn) with Flow for both registration and signing.

Now that you have completed the tutorial, you should be able to:

- Create a WebAuthn credential and derive a Flow‑compatible public key.
- Generate the correct challenge for signing transactions (wallet sets SHA2‑256(signable)).
- Convert a WebAuthn ECDSA DER signature into Flow's raw `r||s` format and attach the transaction signature extension.

### Further reading

- Review signing flows and roles: [Transactions]
- Account keys: [Signature and Hash Algorithms]
- Web Authentication API (MDN): [Web Authentication API]
- Flow Client Library (FCL): [Flow Client Library]
- Wallet Provider Spec: [Wallet Provider Spec]
- Track updates: [FLIP 264: WebAuthn Credential Support]

<!-- Reference-style links, does not render on page -->

[WebAuthn Credential Support (FLIP)]: https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md
[PoC demo]: https://github.com/onflow/passkey-wallet-demo
[FLIP 264: WebAuthn Credential Support]: https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md
[Authentication Services]: https://developer.apple.com/documentation/authenticationservices, 
[Credential Manager]: https://developer.android.com/identity/sign-in/credential-manager
[Web Authentication API]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API
[navigator.credentials.create()]: https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create
[PublicKeyCredentialCreationOptions]: https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions
[PublicKeyCredentialRequestOptions]: https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions
[navigator.credentials.get()]: https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get
[PublicKeyCredential]: https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential
[AuthenticatorAttestationResponse]: https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse
[AuthenticatorAssertionResponse]: https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse
[Replay attacks]: https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md#replay-attacks
[Transactions]: ../basics/transactions.md
[Signature and Hash Algorithms]: ../basics/accounts.md
[Flow Client Library]: ../../tools/clients/fcl-js/index.md
[Wallet Provider Spec]: ../../tools/wallet-provider-spec/index.md
[WebAuthn specifications]: https://www.w3.org/TR/webauthn-3
[Limitations of passkeys]: #limitations-of-passkeys
[multi-key account support]: ../basics/accounts.md#account-keys
[PoC demo]: https://github.com/onflow/passkey-wallet-demo
[multi-key account configurations]: ../basics/accounts.md#account-keys



