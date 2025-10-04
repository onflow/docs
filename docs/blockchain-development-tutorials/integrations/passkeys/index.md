---
title: Passkeys (WebAuthn) on Flow — Registration and Signing
description: Implement passkeys on Flow using WebAuthn, covering key extraction, challenges, signature formatting for Flow, and signature extensions.
sidebar_position: 3
keywords:
  - passkeys
---

# Passkeys (WebAuthn) on Flow — Wallet Implementation Guide

This is a wallet‑centric guide (per the FLIP) that covers end‑to‑end WebAuthn integration for Flow:

1. Create a user passkey wallet
2. Sign a transaction with the user’s passkey
3. Convert and attach the signature
3. Convert and attach the signature (incl. signature extension)

It accompanies the PoC in `fcl-js/packages/passkey-wallet` for reference and cites the FLIP where behavior is normative.

> PoC source: `/Users/jribbink/repos/fcl-js/packages/passkey-wallet`

## What you’ll learn

After completing this guide, you'll be able to:

- Register a WebAuthn credential and derive a Flow‑compatible public key
- Generate the correct challenge for signing transactions (wallet sets SHA2‑256(signable))
- Convert a WebAuthn ECDSA DER signature into Flow’s raw r||s format and attach the FLIP signature extension

## Prerequisites

- Working knowledge of modern frontend (React/Next.js) and basic backend
- Familiarity with WebAuthn/Passkeys concepts and platform constraints
- FCL installed and configured for your app
- A plan for secure backend entropy (32‑byte minimum) and nonce persistence

See also

- Transactions and signatures on Flow: `../../build/cadence/basics/transactions.md`
- Account keys, signature and hash algorithms: `../../build/cadence/basics/accounts.md`

External references

- WebAuthn credential support FLIP: [WebAuthn Credential Support (FLIP)](https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md)
- Web Authentication API (MDN): [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

## 1) Create a user passkey wallet

When a user registers a passkey via `navigator.credentials.create({ publicKey })`, the authenticator returns an attestation containing the new credential’s public key. For Flow, you’ll register that public key on an account as an `ECDSA_P256` key paired with `SHA2_256` hashing.

High‑level steps:

1. On the server, generate `PublicKeyCredentialCreationOptions` and send to the client.
2. On the client, call WebAuthn `create()` and return the credential to the server.
3. Verify attestation if necessary and extract the COSE public key (P‑256). Convert it to the raw uncompressed X9.62 point format if needed and to hex bytes expected by Flow.
4. Submit a transaction to add the key to the Flow account with weight and algorithms:
   - Signature algorithm: `ECDSA_P256`
   - Hash algorithm: `SHA2_256`

Key algorithm references: `../../build/cadence/basics/accounts.md` (Signature and Hash Algorithms).

> Tip: Libraries like SimpleWebAuthn can parse the COSE key and produce the raw public key bytes required for onchain registration. Ensure you normalize into the exact raw byte format Flow expects before writing to the account key.

Minimum example — wallet‑mode registration (challenge can be constant per FLIP):

This builds `PublicKeyCredentialCreationOptions` for a wallet RP with a constant registration challenge and ES256 (P‑256) so the resulting public key can be registered on a Flow account.

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
    { type: "public-key", alg: -7 }, // ES256 (P-256 + SHA-256)
    // Optionally ES256K if you support secp256k1 Flow keys:
    // { type: "public-key", alg: -47 },
  ],
  authenticatorSelection: { userVerification: "preferred" },
  timeout: 60_000,
  attestation: "none",
}

const credential = await navigator.credentials.create({ publicKey: creationOptions })

// Send to wallet-core (or local) to extract COSE P-256 public key (verify attestation if necessary)
// Then register the raw uncompressed key bytes on the Flow account as ECDSA_P256/SHA2_256
```

Client-side example — extract COSE public key (no verification) and derive SEC1 uncompressed hex:

This parses the `attestationObject` to locate the COSE EC2 `credentialPublicKey`, reads the x/y coordinates, and returns SEC1 uncompressed bytes (0x04 || X || Y) suitable for Flow key registration. Attestation verification is intentionally omitted here.

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

function coseEcP256ToSec1UncompressedHex(coseKey: Uint8Array): string {
  // COSE EC2 key is a CBOR map; for P-256, x = -2, y = -3
  const m: Map<number, any> = CBOR.decode(coseKey)
  const x = new Uint8Array(m.get(-2))
  const y = new Uint8Array(m.get(-3))
  if (x.length !== 32 || y.length !== 32) throw new Error('Invalid P-256 coordinate lengths')
  const sec1 = new Uint8Array(65)
  sec1[0] = 0x04
  sec1.set(x, 1)
  sec1.set(y, 33)
  return '0x' + toHex(sec1)
}

// Usage
const cred = (await navigator.credentials.create({ publicKey: creationOptions })) as PublicKeyCredential
const att = cred.response as AuthenticatorAttestationResponse
const attObj = new Uint8Array(att.attestationObject as ArrayBuffer)
const cosePubKey = extractCosePublicKeyFromAttestation(attObj)
const publicKeySec1Hex = coseEcP256ToSec1UncompressedHex(cosePubKey)
```

## 2) Sign a transaction with passkey wallet (WebAuthn)

### Generate the challenge

- Assertion (transaction signing): Wallet sets `challenge` to the SHA2‑256 of the signable transaction message (payload or envelope per signer role). No server‑sent challenge is used. Flow includes a domain‑separation tag in the signable bytes.

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

// 2) Compute SHA2-256(msgHex) -> 32-byte challenge (Flow keys commonly use SHA2_256)
const signableHash: Uint8Array = sha256(hexToBytes(msgHex))

// 3) Call navigator.credentials.get with challenge = signableHash
// (see next subsection for a full getAssertion example)
```

Note: `encodeMessageFromSignable` and `encodeTransactionPayload` are FCL‑specific helpers. If you are not using FCL, construct the Flow signable transaction message yourself (payload for proposer/authorizer, envelope for payer), then compute `SHA2‑256(messageBytes)` for the challenge. The payload encoding shown here applies regardless of wallet implementation; the helper calls are simply conveniences from FCL.

### Sign with the user's passkey

Minimal example — wallet assertion:

Request an assertion using the transaction hash as `challenge`. `rpId` must match the wallet domain; `allowCredentials` may be omitted for discoverable credentials.

```tsx
// signableHash is SHA2-256(signable message: payload or envelope)
declare const signableHash: Uint8Array

const requestOptions: PublicKeyCredentialRequestOptions = {
  challenge: signableHash,
  rpId: window.location.hostname,
  userVerification: "preferred",
  timeout: 60_000,
}

const assertion = (await navigator.credentials.get({
  publicKey: requestOptions,
})) as PublicKeyCredential

const { authenticatorData, clientDataJSON, signature } =
  assertion.response as AuthenticatorAssertionResponse
```

### 3) Convert and attach the signature (incl. signature extension)

WebAuthn assertion signatures are ECDSA P‑256 over SHA‑256 and are typically returned in ASN.1/DER form. Flow expects raw 64‑byte signatures: `r` and `s` each 32 bytes, concatenated (`r || s`).

- Convert the DER `signature` to Flow raw `r||s` (64 bytes) and attach with `addr` and `keyId`.
- Build the signature extension as specified: `extension_data = 0x01 || RLP([authenticatorData, clientDataJSON])`.
- See details below in sections 3 and 4.

Minimal example — convert and attach for submission:

Convert the DER signature to Flow raw r||s and build `signatureExtension = 0x01 || RLP([authenticatorData, clientDataJSON])` per the FLIP, then compose the Flow signature object for inclusion in your transaction.

```tsx
import { encode as rlpEncode } from 'rlp'
import { bytesToHex } from '@noble/hashes/utils'

// Inputs from previous steps
declare const address: string       // 0x-prefixed Flow address
declare const keyId: number         // Account key index used for signing
declare const signature: Uint8Array // DER signature from WebAuthn assertion
declare const clientDataJSON: Uint8Array
declare const authenticatorData: Uint8Array

// 1) DER -> raw r||s (64 bytes)
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

TODO INCLUDE FCL INFO

Helpers used above:

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

Replay protection: Flow uses on‑chain proposal‑key sequence numbers (increment per signed tx) rather than traditional WebAuthn server counters or random challenges. Details and caveats: [Replay attacks](https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md#replay-attacks).

Optional wallet backend: You may store short‑lived correlation data (e.g., request IDs) for telemetry/rate‑limits, however a backend is not explicitly required.

### Allowed algorithms for WebAuthn credentials

Restrict `pubKeyCredParams` to algorithms supported by Flow accounts:

```tsx
// ES256 (P-256 + SHA-256) is recommended and maps to ECDSA_P256/SHA2_256 on Flow
pubKeyCredParams: [
  { type: "public-key", alg: -7 },   // ES256
  // Optionally, if you support secp256k1 keys as Flow account keys:
  // { type: "public-key", alg: -47 }, // ES256K (secp256k1)
]
```

Avoid including `RS256` (`alg: -257`) as it does not map to Flow account keys.

## Appendix: Helpers

> The mapping from Flow’s payload to the authenticator’s signed bytes is defined by the signature extension. Follow the FLIP for exactly how the challenge and additional fields (e.g., `clientDataJSON`, `authenticatorData`) must be constructed and later verified by Flow.

Useful references:

- Transactions/signatures: `../../build/cadence/basics/transactions.md`
- User signatures via FCL: `../../build/tools/clients/fcl-js/user-signatures.md`
- FLIP spec: [WebAuthn Credential Support (FLIP)](https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md)

<!-- Extension payload details are covered inline in step 2 (format/attach). For schema specifics, see the FLIP. -->

## Notes from the PoC

- The PoC in `fcl-js/packages/passkey-wallet` demonstrates end‑to‑end flows for passkey creation and assertion, including:
  - Extracting and normalizing the P‑256 public key for Flow
  - Generating secure nonces and verifying account‑proof
  - Converting DER signatures to raw `r||s`
  - Packaging WebAuthn fields as signature extension data

> Align your implementation with the FLIP to ensure your extension payloads and verification logic match network expectations.

## Security and UX considerations

- Use `ECDSA_P256` with `SHA2_256` for Flow account keys derived from WebAuthn P‑256.
- Enforce nonce expiry, single‑use semantics, and strong server‑side randomness.
- Clearly communicate platform prompts and recovery paths; passkeys UX can differ across OS/browsers.
- Consider fallbacks for non‑WebAuthn environments.

## Where to go next

- Review signing flows and signature roles: `../../build/cadence/basics/transactions.md`
- Review account key registration details: `../../build/cadence/basics/accounts.md`
- Track the FLIP for any updates: [WebAuthn Credential Support (FLIP)](https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md)


