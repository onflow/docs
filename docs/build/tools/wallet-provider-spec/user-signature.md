# User Signature

## Status

- **Last Updated:** June 1st, 2021
- **Stable:** Yes
- **Risk of Breaking Change:** Low
- **Compatibility:** `>= @onflow/fcl@0.0.71`

# Overview and introduction

**Personally sign data via FCL Compatible Wallets**

**Flow Client Library (FCL)** now incldues **`signUserMessage()`**, which allows you to send unencrypted message data to a connected wallet provider or service to be signed with a user's private key. 

An application or service can verify a signature against a user's public key on the **Flow Blockchain**, which provides proof a user controls the account's private key.   

**Use Cases**

- **Authentication**: Sign a piece of data with a provate key to cryptographically verify the ownership of a **Flow** account.
- **Improved Application Login**
  - **Increased security**: Arguably more secure than proof of ownership by email and password.
  - **Simplified UX**: No application password required.
  - **Increased privacy**: No email or third party authentication service needed.
- **Message Validation**: Assure that a message sent or received wasn't tampered with.
- **Multisig contracts**
- **Decentralised exchanges**
- **Meta transactions**


# Config and authentication

As a prerequisite, **FCL** is configured to point to the Wallet Provider's Authentication Endpoint. No additional configuration is required.

> During development (and on mainnet), you can configure Flow Client Library (FCL) to use the wallet directly. To do this, set the **Wallet Discovery Url** to the wallet provider's **Authentication Endpoint** by configuring FCL like this `config().put("discovery.wallet", "https://my-awesome-wallet-provider.com/fcl/authenticate")`.

For more information about common Configuration Keys, see [How to Configure FCL]

1. A user initiates authentication with the wallet provider via application UI.
2. The wallet confirms a user's identity and sends back information used to configure **FCL** for future user actions in the application.
3. Included in the authentication response should be the provider's [Key Services](#) which includes a **`user-signature`** service for use with **`signUserMessage()`**.

# User signature service

A [user-signature service] is a standard service, with methods for **IFRAME/RPC** or **HTTP/POST**.

The `user-signature` service receives a signable message from **FCL** and returns a standard [PollingResponse] with an array of [CompositeSignatures] or `null` as the data.

A status of **Approved** needs to have an array of composite signatures as data. 

A status of **Declined** needs to include a reason why. 

A **Pending** status needs to include an updates service and can include a local. 
A service that uses the **`IFRAME/RPC`** method can only respond with `approved` or `declined`, as `pending` is not valid for iframes.


When `signUserMessage()` is called by the application, **FCL** uses the service method to decide how to send the signable to the wallet.

The Wallet is responsible for prepending the signable with the correct `UserDomainTag`, hashing, and signing the message.

# Signing sequence

1. Application sends message to signing service. **FCL expects a hexadecimal string**.
3. Wallet and Service tags the message with required `UserDomainTag` (see below), hashes, and signs with the `signatureAlgorithm` specified on account key.
2. Wallet makes available a Composite Signature that consists of `addr`, `keyId`, and `signature` **as a hex string**.

### UserDomainTag
The **`UserDomainTag`** is the prefix of all signed user space payloads.

Before hashing and signing the message, the wallet must add a specified DOMAIN TAG.

> currently **"FLOW-V0.0-user"**

A domain tag is encoded as **UTF-8 bytes, right padded to a total length of 32 bytes**, prepended to the message.

The signature can now be verified on the Flow blockchain. The following illustrates an example with `fcl.verifyUserSignatures`

```javascript
/**
 * Verify a valid signature/s for an account on Flow.
 *
 * @param {string} msg - A message string in hexadecimal format
 * @param {Array} compSigs - An array of Composite Signatures
 * @param {string} compSigs[].addr - The account address
 * @param {number} compSigs[].keyId - The account keyId
 * @param {string} compSigs[].signature - The signature to verify
 * @return {bool}
 *
 * @example
 *
 *  const isValid = await fcl.verifyUserSignatures(
 *    Buffer.from('FOO').toString("hex"),
 *    [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}]
 *  )
 */
```

## TL;DR Wallet Provider

- Register with **FCL** and provide signing service endpoint. No further configuration is needed.
- On receipt of message, prompt user to approve or decline.
- Prepend `UserDomainTag`, hash and sign the message with the signatureAlgorithm specified on user's key.
- Return a standard `PollingResponse` with an array of `CompositeSignatures` as data or `null` and `reason` if declined.

<!-- Relative links, will not render on page -->

[How to Configure FCL]: ../clients/fcl-js/packages-docs/fcl/index.md#common-configuration-keys
[user-signature service]: https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/normalizers/service/user-signature.js
[PollingResponse]: https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/normalizers/service/polling-response.js#L5
[CompositeSignatures]: https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/normalizers/service/composite-signature.js#L4