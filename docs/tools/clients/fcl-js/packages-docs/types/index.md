---
title: Type Definitions
description: Type definitions for the Flow Client Library (FCL) packages.
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/typedefs](https://github.com/onflow/fcl-js/tree/master/packages/typedefs). DO NOT EDIT MANUALLY -->

# Type Definitions

Documentation for core types used throughout the Flow Client Library (FCL).

## Interfaces

### Account


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `address` | `string` | The address of the account |
| `balance` | `number` | The FLOW balance of the account in 10^8 |
| `code` | `number` | The code of any Cadence contracts stored in the account |
| `contracts` | `Record<string, string>` | Any contracts deployed to this account |
| `keys` | `AccountKey[]` | The keys associated with the account |

### AccountKey


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | `number` | The index of the key in the account |
| `publicKey` | `string` | The public key of the account key |
| `signAlgo` | `SignatureAlgorithm` | The signature algorithm used by the key |
| `signAlgoString` | `string` | The signature algorithm used by the key as a string |
| `hashAlgo` | `HashAlgorithm` | The hashing algorithm used by the key |
| `hashAlgoString` | `string` | The hashing algorithm used by the key as a string |
| `sequenceNumber` | `number` | The sequence number of the key |
| `weight` | `number` | The weight of the key |
| `revoked` | `boolean` | Whether or not the key has been revoked |

### AccountStatusEvent


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `accountAddress` | `string` | The address of the account which the event is associated with. |

### Block


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `string` | The id of the block |
| `parentId` | `string` | The id of the parent block |
| `height` | `number` | The height of the block |
| `timestamp` | `string` | Time related fields |
| `parentVoterSignature` | `string` | The parent voter signature of the block |
| `collectionGuarantees` | `CollectionGuarantee[]` | Contains the ids of collections included in the block |
| `blockSeals` | `BlockSeal[]` | The details of which nodes executed and sealed the blocks |

### BlockDigest

BlockDigest holds lightweight block information which includes only block id, block height and block timestamp.

**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `string` | The id of the block |
| `height` | `number` | The height of the block |
| `timestamp` | `string` | Timestamp of the block |

### BlockHeader

Header contains all meta-data for a block, as well as a hash representing
the combined payload of the entire block. It is what consensus nodes agree
on after validating the contents against the payload hash.

**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `string` | The id of the block |
| `parentId` | `string` | The id of the parent block |
| `height` | `number` | The height of the block |
| `timestamp` | `string` | The timestamp of the block |
| `parentVoterSignature` | `string` | The parent voter signature of the block |

### BlockHeartbeat


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `blockId` | `string` | The ID of the block |
| `blockHeight` | `number` | The height of the block |
| `timestamp` | `string` | The timestamp of the block |

### BlockSeal


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `blockId` | `string` | The id of the block |
| `executionReceiptId` | `string` | The execution receipt id of the block |

### CollectionGuarantee


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `collectionId` | `string` | The id of the block |
| `signerIds` | `string[]` | The signer ids of the block |

### CompositeSignature


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `f_type` | `string` | A type identifier used internally by FCL |
| `f_vsn` | `string` | FCL protocol version |
| `addr` | `string` | Flow Address (sans prefix) |
| `keyId` | `number` | Key ID |
| `signature` | `string` | Signature as a hex string |

### CurrentUser


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `addr` | `string` | The public address of the current user |
| `cid` | `string` | A wallet specified content identifier for user metadata |
| `expiresAt` | `number` | A wallet specified time-frame for a valid session |
| `f_type` | `string` | A type identifier used internally by FCL |
| `f_vsn` | `string` | FCL protocol version |
| `loggedIn` | `boolean` | Whether or not the current user is logged in |
| `services` | `Service[]` | A list of trusted services that express ways of interacting with the current user's identity |

### Event


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `blockId` | `string` | ID of the block that contains the event. |
| `blockHeight` | `number` | Height of the block that contains the event. |
| `blockTimestamp` | `string` | The timestamp of when the block was sealed in a DateString format. eg. '2021-06-25T13:42:04.227Z' |
| `type` | `string` | A string containing the event name. |
| `transactionId` | `string` | Can be used to query transaction information, eg. via a Flow block explorer. |
| `transactionIndex` | `number` | Used to prevent replay attacks. |
| `eventIndex` | `number` | Used to prevent replay attacks. |
| `data` | `any` | The data emitted from the event. |

### EventFilter


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `eventTypes` | `string[]` | The event types to listen for |
| `addresses` | `string[]` | The addresses to listen for |
| `contracts` | `string[]` | The contracts to listen for |
| `startBlockId` | `string` | The block ID to start listening for events |
| `startHeight` | `number` | The block height to start listening for events |
| `heartbeatInterval` | `number` | The interval in milliseconds to send a heartbeat to the Access Node |

### Interaction


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tag` | `InteractionTag` | The type of interaction |
| `assigns` | `Record<string, any>` | Assigned values for the interaction |
| `status` | `InteractionStatus` | The status of the interaction |
| `reason` | `string` | Reason for the current status |
| `accounts` | `Record<string, InteractionAccount>` | Accounts involved in the interaction |
| `params` | `Record<string, any>` | Parameters for the interaction |
| `arguments` | `Record<string, any>` | Arguments for the interaction |
| `message` | `{ cadence: string; refBlock: string; computeLimit: number; proposer: string; payer: string; authorizations: string[]; params: Record<string, any>[]; arguments: string[]; }` | Message details for the interaction |
| `proposer` | `string` | The proposer of the transaction |
| `authorizations` | `string[]` | The authorizations for the transaction |
| `payer` | `string[]` | The payer(s) of the transaction |
| `events` | `{ eventType: string; start: string \| number; end: string \| number; blockIds: string[]; }` | Event-related information |
| `transaction` | `{ id: string; }` | Transaction-related information |
| `block` | `{ id: string; height: string \| number; isSealed: boolean; }` | Block-related information |
| `account` | `{ addr: string; }` | Account-related information |
| `collection` | `{ id: string; }` | Collection-related information |
| `subscribeEvents` | `{ eventTypes: string[]; addresses: string[]; contracts: string[]; startBlockId: string; startHeight: number; heartbeatInterval: number; }` | Event subscription information |

### InteractionAccount


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `kind` | `InteractionResolverKind.ACCOUNT` | The kind of interaction resolver |
| `tempId` | `string` | Temporary identifier for the account |
| `addr` | `string` | The address of the account |
| `keyId` | `string \| number` | The key ID used for signing |
| `sequenceNum` | `number` | The sequence number for the account key |
| `signature` | `string` | The signature for the account |
| `signingFunction` | `any` | Function used for signing |
| `resolve` | `any` | Resolver function for the account |
| `role` | `{ proposer: boolean; authorizer: boolean; payer: boolean; param?: boolean; }` | Role of the account in the transaction |
| `authorization` | `any` | Authorization details for the account |

### Key


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `sequenceNumber` | `number` | Sequence number of key used by the proposer of this transaction |
| `keyId` | `number` | The ID of the key in the account used by the proposer of this transaction |
| `address` | `string` | The address of the proposer of this transaction |

### NodeVersionInfo


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `semver` | `string` | The semver version of the node. |
| `commit` | `string` | The commit hash of the node. |
| `sporkId` | `string` | The spork id of the node. |
| `protocolVersion` | `number` | The protocol version of the node. |
| `sporkRootBlockHeight` | `number` | The spork root block height of the node. |
| `nodeRootBlockHeight` | `number` | The node root block height of the node. |

### Provider


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `address` | `string` | The blockchain address of the Wallet provider. |
| `name` | `string` | The name of the Wallet provider. |
| `icon` | `string` | The icon of the Wallet provider (may be a URL or a data URI). |
| `description` | `string` | A brief description of the Wallet provider. |
| `color` | `string` | The preferred color to represent the Wallet provider (e.g., for UI styling). |
| `supportEmail` | `string` | The support email address of the Wallet provider. |
| `website` | `string` | The website URL of the Wallet provider. |
| `is_installed` | `boolean` | Indicates whether the Wallet provider is installed (if applicable). |

### Service


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `f_type` | `string` | A type identifier used internally by FCL |
| `f_vsn` | `string` | FCL protocol version |
| `type` | `string` | Service type |
| `method` | `string` | Service method |
| `uid` | `string` | Service uid |
| `endpoint` | `string` | Service endpoint |
| `provider` | `Provider` | Service provider object |
| `params` | `Record<string, string>` | Service parameters as key-value pairs |

### Signature


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `sequenceNumber` | `string` | Sequence number of the key used to perform this signature. |
| `keyId` | `number` | ID of the key in the account used to perform this signature. |
| `signature` | `string` | The signature represented as a hex string. |

### StreamConnection



### Transaction


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `script` | `string` | The Cadence code used to execute this transaction. |
| `args` | `string[]` | The JSON-CDC encoded arguments passed in to the transaction. |
| `referenceBlockId` | `string` | The reference block id for this transaction. |
| `gasLimit` | `number` | The gas limit for the transaction. |
| `proposalKey` | `Key` | The key used by the proposer of this transaction. |
| `sequenceNumber` | `string` | Sequence number of the key used by the proposer of this transaction. |
| `keyId` | `number` | The ID of the key in the account used by the proposer of this transaction. |
| `address` | `string` | The address of the proposer of this transaction. |
| `payer` | `string` | Address of the payer of the transaction. |
| `proposer` | `string` | Address of the proposer of this transaction. |
| `authorizers` | `string[]` | Array of addresses of authorizers of this transaction. |
| `payloadSignatures` | `Signature[]` | The payload signatures for the transaction. |
| `envelopeSignatures` | `Signature[]` | The envelope signatures for the transaction. |

### TransactionStatus


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `blockId` | `string` | The ID of the Block the transaction is included in. |
| `status` | `TransactionExecutionStatus` | The execution status of the transaction |
| `statusString` | `string` | The status as as descriptive text (e.g. "FINALIZED"). |
| `statusCode` | `0 \| 1` | The result of the transaction, if executed (i.e. 0 for success, 1 for failure) |
| `errorMessage` | `string` | The error message of the transaction. |
| `events` | `Event[]` | The events for this result. |


## Types

### EventStream


**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `on` | `{ <C extends "events" \| "heartbeat">(channel: C, listener: (data: { events: Event[]; heartbeat: BlockHeartbeat; }[C]) => void): EventStream; (event: "close", listener: () => void): EventStream; (event: "error", listener: (err: any) => void): EventStream; }` |  |
| `off` | `{ <C extends "events" \| "heartbeat">(event: C, listener: (data: { events: Event[]; heartbeat: BlockHeartbeat; }[C]) => void): EventStream; (event: "close", listener: () => void): EventStream; (event: "error", listener: (err: any) => void): EventStream; }` |  |
| `close` | `() => void` |  |

### RawSubscriptionData

Raw data returned by a subscription, which will vary depending on the topic and is not decoded


### SdkTransport

Transport interface for the Flow SDK that provides methods for sending interactions and subscribing to data

**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `send` | `SendFn` | Function to send an interaction to the Flow blockchain |
| `subscribe` | `SubscribeFn` | Function to subscribe to real-time data from the Flow blockchain |

### Subscription

A subscription object that allows managing the subscription lifecycle

**Properties:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `unsubscribe` | `() => void` | Function to unsubscribe from the subscription |

### SubscriptionArgs

Arguments for a subscription, which will vary depending on the topic


### SubscriptionData

The data returned by a subscription, which will vary depending on the topic



## Enums

### FvmErrorCode

Error codes defined by the Flow Virtual Machine (FVM) for various types of errors that can occur during transaction execution

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `UNKNOWN_ERROR` | -1 |  |
| `TX_VALIDATION_ERROR` | 1000 |  |
| `INVALID_TX_BYTE_SIZE_ERROR` | 1001 |  |
| `INVALID_REFERENCE_BLOCK_ERROR` | 1002 |  |
| `EXPIRED_TRANSACTION_ERROR` | 1003 |  |
| `INVALID_SCRIPT_ERROR` | 1004 |  |
| `INVALID_GAS_LIMIT_ERROR` | 1005 |  |
| `INVALID_PROPOSAL_SIGNATURE_ERROR` | 1006 |  |
| `INVALID_PROPOSAL_SEQ_NUMBER_ERROR` | 1007 |  |
| `INVALID_PAYLOAD_SIGNATURE_ERROR` | 1008 |  |
| `INVALID_ENVELOPE_SIGNATURE_ERROR` | 1009 |  |
| `FVM_INTERNAL_ERROR` | 1050 |  |
| `VALUE_ERROR` | 1051 |  |
| `INVALID_ARGUMENT_ERROR` | 1052 |  |
| `INVALID_ADDRESS_ERROR` | 1053 |  |
| `INVALID_LOCATION_ERROR` | 1054 |  |
| `ACCOUNT_AUTHORIZATION_ERROR` | 1055 |  |
| `OPERATION_AUTHORIZATION_ERROR` | 1056 |  |
| `OPERATION_NOT_SUPPORTED_ERROR` | 1057 |  |
| `BLOCK_HEIGHT_OUT_OF_RANGE_ERROR` | 1058 |  |
| `EXECUTION_ERROR` | 1100 |  |
| `CADENCE_RUNTIME_ERROR` | 1101 |  |
| `ENCODING_UNSUPPORTED_VALUE` | 1102 |  |
| `STORAGE_CAPACITY_EXCEEDED` | 1103 |  |
| `GAS_LIMIT_EXCEEDED_ERROR` | 1104 |  |
| `EVENT_LIMIT_EXCEEDED_ERROR` | 1105 |  |
| `LEDGER_INTERACTION_LIMIT_EXCEEDED_ERROR` | 1106 |  |
| `STATE_KEY_SIZE_LIMIT_ERROR` | 1107 |  |
| `STATE_VALUE_SIZE_LIMIT_ERROR` | 1108 |  |
| `TRANSACTION_FEE_DEDUCTION_FAILED_ERROR` | 1109 |  |
| `COMPUTATION_LIMIT_EXCEEDED_ERROR` | 1110 |  |
| `MEMORY_LIMIT_EXCEEDED_ERROR` | 1111 |  |
| `COULD_NOT_DECODE_EXECUTION_PARAMETER_FROM_STATE` | 1112 |  |
| `SCRIPT_EXECUTION_TIMED_OUT_ERROR` | 1113 |  |
| `SCRIPT_EXECUTION_CANCELLED_ERROR` | 1114 |  |
| `EVENT_ENCODING_ERROR` | 1115 |  |
| `INVALID_INTERNAL_STATE_ACCESS_ERROR` | 1116 |  |
| `INSUFFICIENT_PAYER_BALANCE` | 1118 |  |
| `ACCOUNT_ERROR` | 1200 |  |
| `ACCOUNT_NOT_FOUND_ERROR` | 1201 |  |
| `ACCOUNT_PUBLIC_KEY_NOT_FOUND_ERROR` | 1202 |  |
| `ACCOUNT_ALREADY_EXISTS_ERROR` | 1203 |  |
| `FROZEN_ACCOUNT_ERROR` | 1204 |  |
| `ACCOUNT_STORAGE_NOT_INITIALIZED_ERROR` | 1205 |  |
| `ACCOUNT_PUBLIC_KEY_LIMIT_ERROR` | 1206 |  |
| `CONTRACT_ERROR` | 1250 |  |
| `CONTRACT_NOT_FOUND_ERROR` | 1251 |  |
| `CONTRACT_NAMES_NOT_FOUND_ERROR` | 1252 |  |
| `EVM_EXECUTION_ERROR` | 1300 |  |

### HashAlgorithm


**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `SHA2_256` | 1 |  |
| `SHA2_384` | 2 |  |
| `SHA3_256` | 3 |  |
| `SHA3_384` | 4 |  |
| `KMAC128_BLS_BLS12_381` | 5 |  |

### InteractionResolverKind

Represents different kinds of interaction resolvers

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `ARGUMENT` | "ARGUMENT" |  |
| `ACCOUNT` | "ACCOUNT" |  |

### InteractionStatus

Status of an interaction with the Flow blockchain

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `BAD` | "BAD" |  |
| `OK` | "OK" |  |

### InteractionTag

Represents different types of interactions with the Flow blockchain

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `UNKNOWN` | "UNKNOWN" |  |
| `SCRIPT` | "SCRIPT" |  |
| `TRANSACTION` | "TRANSACTION" |  |
| `GET_TRANSACTION_STATUS` | "GET_TRANSACTION_STATUS" |  |
| `GET_ACCOUNT` | "GET_ACCOUNT" |  |
| `GET_EVENTS` | "GET_EVENTS" |  |
| `PING` | "PING" |  |
| `GET_TRANSACTION` | "GET_TRANSACTION" |  |
| `GET_BLOCK` | "GET_BLOCK" |  |
| `GET_BLOCK_HEADER` | "GET_BLOCK_HEADER" |  |
| `GET_COLLECTION` | "GET_COLLECTION" |  |
| `GET_NETWORK_PARAMETERS` | "GET_NETWORK_PARAMETERS" |  |
| `SUBSCRIBE_EVENTS` | "SUBSCRIBE_EVENTS" |  |
| `GET_NODE_VERSION_INFO` | "GET_NODE_VERSION_INFO" |  |

### SignatureAlgorithm


**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `ECDSA_P256` | 1 |  |
| `ECDSA_secp256k1` | 2 |  |
| `BLS_BLS12_381` | 3 |  |

### SubscriptionTopic

Represents different topics that can be subscribed to for real-time data from the Flow blockchain

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `BLOCKS` | "blocks" |  |
| `BLOCK_HEADERS` | "block_headers" |  |
| `BLOCK_DIGESTS` | "block_digests" |  |
| `ACCOUNT_STATUSES` | "account_statuses" |  |
| `TRANSACTION_STATUSES` | "transaction_statuses" |  |
| `EVENTS` | "events" |  |

### TransactionExecutionStatus

The execution status of the transaction.

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `UNKNOWN` | 0 |  |
| `PENDING` | 1 |  |
| `FINALIZED` | 2 |  |
| `EXECUTED` | 3 |  |
| `SEALED` | 4 |  |
| `EXPIRED` | 5 |  |

### TransactionRole

Represents different roles in a transaction

**Members:**

| Name | Value | Description |
| ---- | ----- | ----------- |
| `AUTHORIZER` | "authorizer" |  |
| `PAYER` | "payer" |  |
| `PROPOSER` | "proposer" |  |


---
_Doc autogenerated from [onflow/typedefs](https://github.com/onflow/fcl-js/tree/master/packages/typedefs)_ 