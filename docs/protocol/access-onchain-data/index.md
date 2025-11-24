---
title: Flow Access API Specification
sidebar_label: Access API
sidebar_position: 1
---

The Access API is implemented as a [gRPC service](https://grpc.io/).

A language-agnostic specification for this API is defined using [Protocol Buffers](https://developers.google.com/protocol-buffers), which can be used to generate client libraries in a variety of programming languages.

- [Flow Access API protobuf source files](https://github.com/onflow/flow/tree/master/protobuf)

## Flow Access Node Endpoints

| Network | GRPC                                   | Web GRPC             | REST                      |
| ------- | -------------------------------------- | -------------------- | ------------------------- |
| Mainnet | `access.mainnet.nodes.onflow.org:9000` | `mainnet.onflow.org` | `rest-mainnet.onflow.org` |
| Testnet | `access.devnet.nodes.onflow.org:9000`  | `testnet.onflow.org` | `rest-testnet.onflow.org` |

---

## Ping

`Ping` will return a successful response if the Access API is ready and available.

```proto
rpc Ping(PingRequest) returns (PingResponse)
```

If a ping request returns an error or times out, it can be assumed that the Access API is unavailable.

#### Request

```proto
message PingRequest {}
```

#### Response

```proto
message PingResponse {}
```

---

## Block Headers

The following methods query information about [block headers](#block-header).

### GetLatestBlockHeader

`GetLatestBlockHeader` gets the latest sealed or unsealed [block header](#block-header).

```proto
rpc GetLatestBlockHeader (GetLatestBlockHeaderRequest) returns (BlockHeaderResponse)
```

#### Request

```proto
message GetLatestBlockHeaderRequest {
  bool is_sealed = 1;
}
```

#### Response

```proto
message BlockHeaderResponse {
  entities.BlockHeader block = 1;
  entities.BlockStatus block_status = 2;
  entities.Metadata metadata = 3;
}
```

### GetBlockHeaderByID

`GetBlockHeaderByID` gets a [block header](#block-header) by ID.

```proto
rpc GetBlockHeaderByID (GetBlockHeaderByIDRequest) returns (BlockHeaderResponse)
```

#### Request

```proto
message GetBlockHeaderByIDRequest {
  bytes id = 1;
}
```

#### Response

```proto
message BlockHeaderResponse {
  entities.BlockHeader block = 1;
  entities.BlockStatus block_status = 2;
  entities.Metadata metadata = 3;
}
```

### GetBlockHeaderByHeight

`GetBlockHeaderByHeight` gets a [block header](#block-header) by height.

```proto
rpc GetBlockHeaderByHeight (GetBlockHeaderByHeightRequest) returns (BlockHeaderResponse)
```

#### Request

```proto
message GetBlockHeaderByHeightRequest {
  uint64 height = 1;
}
```

#### Response

```proto
message BlockHeaderResponse {
  entities.BlockHeader block = 1;
  entities.BlockStatus block_status = 2;
  entities.Metadata metadata = 3;
}
```

---

## Blocks

The following methods query information about [full blocks](#block).

### GetLatestBlock

`GetLatestBlock` gets the full payload of the latest sealed or unsealed [block](#block).

```proto
rpc GetLatestBlock (GetLatestBlockRequest) returns (BlockResponse)
```

#### Request

```proto
message GetLatestBlockRequest {
  bool is_sealed = 1;
  bool full_block_response = 2;
}
```

#### Response

```proto
message BlockResponse {
  entities.Block block = 1;
  entities.BlockStatus block_status = 2;
  entities.Metadata metadata = 3;
}
```

### GetBlockByID

`GetBlockByID` gets a [full block](#block) by ID.

```proto
rpc GetBlockByID (GetBlockByIDRequest) returns (BlockResponse)
```

#### Request

```proto
message GetBlockByIDRequest {
  bytes id = 1;
  bool full_block_response = 2;
}
```

#### Response

```proto
message BlockResponse {
  entities.Block block = 1;
  entities.BlockStatus block_status = 2;
  entities.Metadata metadata = 3;
}
```

### GetBlockByHeight

`GetBlockByHeight` gets a [full block](#block) by height.

```proto
rpc GetBlockByHeight (GetBlockByHeightRequest) returns (BlockResponse)
```

#### Request

```proto
message GetBlockByHeightRequest {
  uint64 height = 1;
  bool full_block_response = 2;
}
```

#### Response

```proto
message BlockResponse {
  entities.Block block = 1;
  entities.BlockStatus block_status = 2;
  entities.Metadata metadata = 3;
}
```

---

## Collections

The following methods query information about [collections](#collection).

### GetCollectionByID

`GetCollectionByID` gets a [collection](#collection) by ID.

```proto
rpc GetCollectionByID (GetCollectionByIDRequest) returns (CollectionResponse)
```

#### Request

```proto
message GetCollectionByIDRequest {
  bytes id = 1;
}
```

#### Response

```proto
message CollectionResponse {
  entities.Collection collection = 1;
  entities.Metadata metadata = 2;
}
```

---

### GetFullCollectionByID

`GetFullCollectionByID` gets a collection by ID, which contains a set of [transactions](#transaction).

```proto
rpc GetFullCollectionByID(GetFullCollectionByIDRequest) returns (FullCollectionResponse);
```

#### Request

```proto
message GetFullCollectionByIDRequest {
  bytes id = 1;
}
```

#### Response

```proto
message FullCollectionResponse {
  repeated entities.Transaction transactions = 1;
  entities.Metadata metadata = 2;
}
```

---

## Transactions

The following methods can be used to submit [transactions](#transaction) and fetch their results.

### SendTransaction

`SendTransaction` submits a transaction to the network.

```proto
rpc SendTransaction (SendTransactionRequest) returns (SendTransactionResponse)
```

`SendTransaction` determines the correct cluster of collection nodes that is responsible for collecting the transaction based on the hash of the transaction and forwards the transaction to that cluster.

#### Request

`SendTransactionRequest` message contains the transaction that is being request to be executed.

```proto
message SendTransactionRequest {
  entities.Transaction transaction = 1;
}
```

#### Response

`SendTransactionResponse` message contains the ID of the submitted transaction.

```proto
message SendTransactionResponse {
  bytes id = 1;
  entities.Metadata metadata = 2;
}
```

### GetTransaction

`GetTransaction` gets a [transaction](#transaction) by ID.

Any type of transaction - user submitted, scheduled transaction or a system transaction can be queried.

If the transaction is not found in the access node cache, the request is forwarded to a collection node.

_Currently, only transactions within the current network upgrade can be queried._

```proto
rpc GetTransaction (GetTransactionRequest) returns (TransactionResponse)
```

#### Request

`GetTransactionRequest` contains the ID of the transaction that is being queried.

```proto
message GetTransactionRequest {
  bytes id = 1;
  bytes block_id = 2;
  bytes collection_id = 3;
  entities.EventEncodingVersion event_encoding_version = 4;
}
```

#### Response

`TransactionResponse` contains the basic information about a transaction, but does not include post-execution results.

```proto
message TransactionResponse {
  entities.Transaction transaction = 1;
  entities.Metadata metadata = 2;
}
```

### GetTransactionsByBlockID

`GetTransactionsByBlockID` gets all the [transactions](#transaction) for a specified block.

The response includes user transactions, scheduled transactions, and system transactions.

```proto
rpc GetTransactionsByBlockID(GetTransactionsByBlockIDRequest) returns (TransactionsResponse);
```

#### Request

```proto
message GetTransactionsByBlockIDRequest {
  bytes block_id = 1;
  entities.EventEncodingVersion event_encoding_version = 2;
}
```

#### Response

```proto
message TransactionsResponse {
  repeated entities.Transaction transactions = 1;
  entities.Metadata metadata = 2;
}
```

### GetTransactionResult

`GetTransactionResult` gets the execution result of a transaction.

Any type of transaction - user submitted, scheduled transaction or a system transaction can be queried.

```proto
rpc GetTransactionResult (GetTransactionRequest) returns (TransactionResultResponse)
```

#### Request

```proto
message GetTransactionRequest {
  bytes id = 1;
  bytes block_id = 2;
  bytes collection_id = 3;
  entities.EventEncodingVersion event_encoding_version = 4;
}
```

#### Response

```proto
message TransactionResultResponse {
  entities.TransactionStatus status = 1;
  uint32 status_code = 2;
  string error_message = 3;
  repeated entities.Event events = 4;
  bytes block_id = 5;
  bytes transaction_id = 6;
  bytes collection_id = 7;
  uint64 block_height = 8;
  entities.Metadata metadata = 9;
  uint64 computation_usage = 10;
}
```

### GetTransactionResultByIndex

`GetTransactionResultByIndex` gets a transaction's result at a specified block and index.

Any type of transaction - user submitted, scheduled transaction or a system transaction can be queried.

```proto
rpc GetTransactionResultByIndex(GetTransactionByIndexRequest) returns (TransactionResultResponse);
```

#### Request

```proto
message GetTransactionByIndexRequest {
  bytes block_id = 1;
  uint32 index = 2;
  entities.EventEncodingVersion event_encoding_version = 3;
}
```

#### Response

```proto
message TransactionResultResponse {
  entities.TransactionStatus status = 1;
  uint32 status_code = 2;
  string error_message = 3;
  repeated entities.Event events = 4;
  bytes block_id = 5;
  bytes transaction_id = 6;
  bytes collection_id = 7;
  uint64 block_height = 8;
  entities.Metadata metadata = 9;
  uint64 computation_usage = 10;
}
```

### GetTransactionResultsByBlockID

`GetTransactionResultsByBlockID` gets all the transaction results for a specified block.

The response includes results for user transactions, scheduled transactions, and system transactions.

```proto
rpc GetTransactionResultsByBlockID(GetTransactionsByBlockIDRequest) returns (TransactionResultsResponse);
```

#### Request

```proto
message GetTransactionsByBlockIDRequest {
  bytes block_id = 1;
  entities.EventEncodingVersion event_encoding_version = 2;
}
```

#### Response

```proto
message TransactionResultsResponse {
  repeated TransactionResultResponse transaction_results = 1;
  entities.Metadata metadata = 2;
}
```

### GetSystemTransaction

`GetSystemTransaction` gets the system transaction for a block.

_Scheduled Transactions will not be included in the response_

```proto
rpc GetSystemTransaction(GetSystemTransactionRequest) returns (TransactionResponse);
```

#### Request

```proto
message GetSystemTransactionRequest {
  bytes block_id = 1;
}
```

#### Response

```proto
message TransactionResponse {
  entities.Transaction transaction = 1;
  entities.Metadata metadata = 2;
}
```

### GetSystemTransactionResult

`GetSystemTransactionResult` gets the system transaction result for a block.

_Scheduled Transactions will not be included in the response_

```proto
rpc GetSystemTransactionResult(GetSystemTransactionResultRequest) returns (TransactionResultResponse);
```

#### Request

```proto
message GetSystemTransactionResultRequest {
  bytes block_id = 1;
  entities.EventEncodingVersion event_encoding_version = 2;
}
```

#### Response

```proto
message TransactionResultResponse {
  entities.TransactionStatus status = 1;
  uint32 status_code = 2;
  string error_message = 3;
  repeated entities.Event events = 4;
  bytes block_id = 5;
  bytes transaction_id = 6;
  bytes collection_id = 7;
  uint64 block_height = 8;
  entities.Metadata metadata = 9;
  uint64 computation_usage = 10;
}
```

---

## Accounts

### GetAccount

`GetAccount` gets an [account](#account) by address at the latest sealed block.

⚠️ Warning: this function is deprecated. It behaves identically to `GetAccountAtLatestBlock` and will be removed in a future version.

```proto
rpc GetAccount(GetAccountRequest) returns (GetAccountResponse)
```

#### Request

```proto
message GetAccountRequest {
  bytes address = 1;
}
```

#### Response

```proto
message GetAccountResponse {
  entities.Account account = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountAtLatestBlock

`GetAccountAtLatestBlock` gets an [account](#account) by address.

The access node queries an execution node for the account details, which are stored as part of the sealed execution state.

```proto
rpc GetAccountAtLatestBlock(GetAccountAtLatestBlockRequest) returns (AccountResponse)
```

#### Request

```proto
message GetAccountAtLatestBlockRequest {
  bytes address = 1;
}
```

#### Response

```proto
message AccountResponse {
  entities.Account account = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountAtBlockHeight

`GetAccountAtBlockHeight` gets an [account](#accounts) by address at the given block height.

The access node queries an execution node for the account details, which are stored as part of the execution state.

```proto
rpc GetAccountAtBlockHeight(GetAccountAtBlockHeightRequest) returns (AccountResponse)
```

#### Request

```proto
message GetAccountAtBlockHeightRequest {
  bytes address = 1;
  uint64 block_height = 2;
}
```

#### Response

```proto
message AccountResponse {
  entities.Account account = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountBalanceAtLatestBlock

`GetAccountBalanceAtLatestBlock` gets an account's balance by address from the latest sealed block.

```proto
rpc GetAccountBalanceAtLatestBlock(GetAccountBalanceAtLatestBlockRequest) returns (AccountBalanceResponse);
```

#### Request

```proto
message GetAccountBalanceAtLatestBlockRequest {
  bytes address = 1
}
```

#### Response

```proto
message AccountBalanceResponse {
  uint64 balance = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountBalanceAtBlockHeight

`GetAccountBalanceAtBlockHeight` gets an account's balance by address at the given block height.

```proto
rpc GetAccountBalanceAtBlockHeight(GetAccountBalanceAtBlockHeightRequest) returns (AccountBalanceResponse);
```

#### Request

```proto
message GetAccountBalanceAtBlockHeightRequest {
  bytes address = 1;
  uint64 block_height = 2;
}
```

#### Response

```proto
message AccountBalanceResponse {
  uint64 balance = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountKeyAtLatestBlock

`GetAccountKeyAtLatestBlock` gets an account's public key by address and key index from the latest sealed block.

```proto
rpc GetAccountKeyAtLatestBlock(GetAccountKeyAtLatestBlockRequest) returns (AccountKeyResponse);
```

#### Request

```proto
message GetAccountKeyAtLatestBlockRequest {
  // address of account
  bytes address = 1;
  // index of key to return
  uint32 index = 2;
}
```

#### Response

```proto
message AccountKeyResponse {
  entities.AccountKey account_key = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountKeyAtBlockHeight

`GetAccountKeyAtBlockHeight` gets an account's public key by address and key index at the given block height.

```proto
rpc GetAccountKeyAtBlockHeight(GetAccountKeyAtBlockHeightRequest) returns (AccountKeyResponse);
```

#### Request

```proto
message GetAccountKeyAtBlockHeightRequest {
  // address of account
  bytes address = 1;
  // height of the block
  uint64 block_height = 2;
  // index of key to return
  uint32 index = 3;
}
```

#### Response

```proto
message AccountKeyResponse {
  entities.AccountKey account_key = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountKeysAtLatestBlock

`GetAccountKeysAtLatestBlock` gets an account's public keys by address from the latest sealed block.

```proto
rpc GetAccountKeysAtLatestBlock(GetAccountKeysAtLatestBlockRequest) returns (AccountKeysResponse);
```

#### Request

```proto
message GetAccountKeysAtLatestBlockRequest {
  // address of account
  bytes address = 1;
}
```

#### Response

```proto
message AccountKeysResponse {
  repeated entities.AccountKey account_keys = 1;
  entities.Metadata metadata = 2;
}
```

### GetAccountKeysAtBlockHeight

`GetAccountKeysAtBlockHeight` gets an account's public keys by address at the given block height.

```proto
rpc GetAccountKeysAtBlockHeight(GetAccountKeysAtBlockHeightRequest) returns (AccountKeysResponse);
```

#### Request

```proto
message GetAccountKeysAtBlockHeightRequest {
  // address of account
  bytes address = 1;
  uint64 block_height = 2;
}
```

#### Response

```proto
message AccountKeysResponse {
  repeated entities.AccountKey account_keys = 1;
  entities.Metadata metadata = 2;
}
```

##

## Scripts

### ExecuteScriptAtLatestBlock

`ExecuteScriptAtLatestBlock` executes a read-only Cadence script against the latest sealed execution state.

This method can be used to read execution state from the blockchain. The script is executed on an execution node and the return value is encoded using the [JSON-Cadence data interchange format](https://cadencelang.dev/docs/1.0/json-cadence-spec).

```proto
rpc ExecuteScriptAtLatestBlock (ExecuteScriptAtLatestBlockRequest) returns (ExecuteScriptResponse)
```

This method is a shortcut for the following:

```
header = GetLatestBlockHeader()
value = ExecuteScriptAtBlockID(header.ID, script)
```

#### Request

```proto
message ExecuteScriptAtLatestBlockRequest {
  bytes script = 1;
  repeated bytes arguments = 2;
}
```

#### Response

```proto
message ExecuteScriptResponse {
  bytes value = 1;
  entities.Metadata metadata = 2;
  uint64 computation_usage = 3;
}
```

### ExecuteScriptAtBlockID

`ExecuteScriptAtBlockID` executes a ready-only Cadence script against the execution state at the block with the given ID.

This method can be used to read account state from the blockchain. The script is executed on an execution node and the return value is encoded using the [JSON-Cadence data interchange format](https://cadencelang.dev/docs/1.0/json-cadence-spec).

```proto
rpc ExecuteScriptAtBlockID (ExecuteScriptAtBlockIDRequest) returns (ExecuteScriptResponse)
```

#### Request

```proto
message ExecuteScriptAtBlockIDRequest {
  bytes block_id = 1;
  bytes script = 2;
  repeated bytes arguments = 3;
}
```

#### Response

```proto
message ExecuteScriptResponse {
  bytes value = 1;
  entities.Metadata metadata = 2;
  uint64 computation_usage = 3;
}
```

### ExecuteScriptAtBlockHeight

`ExecuteScriptAtBlockHeight` executes a ready-only Cadence script against the execution state at the given block height.

This method can be used to read account state from the blockchain. The script is executed on an execution node and the return value is encoded using the [JSON-Cadence data interchange format](https://cadencelang.dev/docs/1.0/json-cadence-spec).

```proto
rpc ExecuteScriptAtBlockHeight (ExecuteScriptAtBlockHeightRequest) returns (ExecuteScriptResponse)
```

#### Request

```proto
message ExecuteScriptAtBlockHeightRequest {
  uint64 block_height = 1;
  bytes script = 2;
  repeated bytes arguments = 3;
}
```

#### Response

```proto
message ExecuteScriptResponse {
  bytes value = 1;
  entities.Metadata metadata = 2;
  uint64 computation_usage = 3;
}
```

---

## Events

The following methods can be used to query for onchain [events](#event).

### GetEventsForHeightRange

`GetEventsForHeightRange` retrieves [events](#event) emitted within the specified block range.

```proto
rpc GetEventsForHeightRange(GetEventsForHeightRangeRequest) returns (GetEventsForHeightRangeResponse)
```

Events can be requested for a specific sealed block range via the `start_height` and `end_height` (inclusive) fields and further filtered by event type via the `type` field.

If `start_height` is greater than the current sealed chain height, then this method will return an error.

If `end_height` is greater than the current sealed chain height, then this method will return events up to and including the latest sealed block.

The event results are grouped by block, with each group specifying a block ID, height and block timestamp.

Event types are name-spaced with the address of the account and contract in which they are declared.

#### Request

```proto
message GetEventsForHeightRangeRequest {
  string type
  uint64 start_height = 2;
  uint64 end_height = 3;
  entities.EventEncodingVersion event_encoding_version = 4;
}
```

#### Response

```proto
message EventsResponse {
  message Result {
    bytes block_id = 1;
    uint64 block_height = 2;
    repeated entities.Event events = 3;
    google.protobuf.Timestamp block_timestamp = 4;
  }
  repeated Result results = 1;
  entities.Metadata metadata = 2;
}
```

### GetEventsForBlockIDs

`GetEventsForBlockIDs` retrieves [events](#event) for the specified block IDs and event type.

```proto
rpc GetEventsForBlockIDs(GetEventsForBlockIDsRequest) returns (GetEventsForBlockIDsResponse)
```

Events can be requested for a list of block IDs via the `block_ids` field and further filtered by event type via the `type` field.

The event results are grouped by block, with each group specifying a block ID, height and block timestamp.

#### Request

```proto
message GetEventsForBlockIDsRequest {
  string type = 1;
  repeated bytes block_ids = 2;
  entities.EventEncodingVersion event_encoding_version = 3;
}
```

#### Response

```proto
message EventsResponse {
  message Result {
    bytes block_id = 1;
    uint64 block_height = 2;
    repeated entities.Event events = 3;
    google.protobuf.Timestamp block_timestamp = 4;
  }
  repeated Result results = 1;
  entities.Metadata metadata = 2;
}
```

---

## Network Parameters

Network parameters provide information about the Flow network. Currently, it only includes the chain ID.
The following method can be used to query for network parameters.

### GetNetworkParameters

`GetNetworkParameters` retrieves the network parameters.

```proto
rpc GetNetworkParameters (GetNetworkParametersRequest) returns (GetNetworkParametersResponse)
```

#### Request

```proto
message GetNetworkParametersRequest {}
```

#### Response

```proto
message GetNetworkParametersResponse {
  string chain_id = 1;
}
```

| Field    | Description                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| chain_id | Chain ID helps identify the Flow network. It can be one of `flow-mainnet`, `flow-testnet` or `flow-emulator` |

---

### GetNodeVersionInfo

`GetNodeVersionInfo` gets information about a node's current versions.

```proto
rpc GetNodeVersionInfo (GetNodeVersionInfoRequest) returns (GetNodeVersionInfoResponse);
```

#### Request

```proto
message GetNodeVersionInfoRequest {}
```

#### Response

```proto
message GetNodeVersionInfoResponse {
  entities.NodeVersionInfo info = 1;
}
```

---

## Protocol state snapshot

The following method can be used to query the latest protocol state [snapshot](https://github.com/onflow/flow-go/blob/master/state/protocol/snapshot.go).

### GetLatestProtocolStateSnapshot

`GetLatestProtocolStateSnapshot` retrieves the latest Protocol state snapshot serialized as a byte array.
It is used by Flow nodes joining the network to bootstrap a space-efficient local state.

```proto
rpc GetLatestProtocolStateSnapshot (GetLatestProtocolStateSnapshotRequest) returns (ProtocolStateSnapshotResponse);
```

#### Request

```proto
message GetLatestProtocolStateSnapshotRequest {}
```

#### Response

```proto
message ProtocolStateSnapshotResponse {
  bytes serializedSnapshot = 1;
  entities.Metadata metadata = 2;
}
```

### GetProtocolStateSnapshotByBlockID

`GetProtocolStateSnapshotByBlockID` retrieves the latest sealed protocol state snapshot by block ID.
Used by Flow nodes joining the network to bootstrap a space-efficient local state.

```proto
rpc GetProtocolStateSnapshotByBlockID(GetProtocolStateSnapshotByBlockIDRequest) returns (ProtocolStateSnapshotResponse);
```

#### Request

```proto
message GetProtocolStateSnapshotByBlockIDRequest {
    bytes block_id = 1;
}
```

#### Response

```proto
message ProtocolStateSnapshotResponse {
  bytes serializedSnapshot = 1;
  entities.Metadata metadata = 2;
}
```

### GetProtocolStateSnapshotByHeight

`GetProtocolStateSnapshotByHeight` retrieves the latest sealed protocol state snapshot by block height.
Used by Flow nodes joining the network to bootstrap a space-efficient local state.

```proto
rpc GetProtocolStateSnapshotByHeight(GetProtocolStateSnapshotByHeightRequest) returns (ProtocolStateSnapshotResponse);
```

#### Request

```proto
message GetProtocolStateSnapshotByHeightRequest {
    uint64 block_height = 1;
}
```

#### Response

```proto
message ProtocolStateSnapshotResponse {
  bytes serializedSnapshot = 1;
  entities.Metadata metadata = 2;
}
```

## Execution results

The following method can be used to query the for [execution results](https://github.com/onflow/flow-go/blob/master/model/flow/execution_result.go) for a given block.

### GetExecutionResultForBlockID

`GetExecutionResultForBlockID` retrieves execution result for given block. It is different from Transaction Results,
and contain data about chunks/collection level execution results rather than particular transactions.
Particularly, it contains `EventsCollection` hash for every chunk which can be used to verify the events for a block.

```proto
rpc GetExecutionResultForBlockID(GetExecutionResultForBlockIDRequest) returns (ExecutionResultForBlockIDResponse);
```

#### Request

```proto
message GetExecutionResultForBlockIDRequest {
  bytes block_id = 1;
}
```

#### Response

```proto
message ExecutionResultForBlockIDResponse {
  flow.ExecutionResult execution_result = 1;
  entities.Metadata metadata = 2;
}
```

### GetExecutionResultByID

`GetExecutionResultByID` returns Execution Result by its ID. It is different from Transaction Results,
and contain data about chunks/collection level execution results rather than particular transactions.
Particularly, it contains `EventsCollection` hash for every chunk which can be used to verify the events for a block.

```proto
rpc GetExecutionResultByID(GetExecutionResultByIDRequest) returns (ExecutionResultByIDResponse);
```

#### Request

```proto
message GetExecutionResultByIDRequest {
  bytes id = 1;
}
```

#### Response

```proto
message ExecutionResultByIDResponse {
  flow.ExecutionResult execution_result = 1;
  entities.Metadata metadata = 2;
}
```

## Entities

Below are in-depth descriptions of each of the data entities returned or accepted by the Access API.

### Block

```proto
message Block {
  bytes id = 1;
  bytes parent_id = 2;
  uint64 height = 3;
  google.protobuf.Timestamp timestamp = 4;
  repeated CollectionGuarantee collection_guarantees = 5;
  repeated BlockSeal block_seals = 6;
  repeated bytes signatures = 7;
  repeated ExecutionReceiptMeta execution_receipt_metaList = 8;
  repeated ExecutionResult execution_result_list = 9;
  BlockHeader block_header = 10;
  bytes protocol_state_id = 11;
}
```

| Field                      | Description                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                         | SHA3-256 hash of the entire block payload                                                                                                                                                                                                                                                                        |
| height                     | Height of the block in the chain                                                                                                                                                                                                                                                                                 |
| parent_id                  | ID of the previous block in the chain                                                                                                                                                                                                                                                                            |
| timestamp                  | Timestamp of when the proposer claims it constructed the block. <br/> **NOTE**: It is included by the proposer, there are no guarantees on how much the time stamp can deviate from the true time the block was published. <br/> Consider observing blocks' status changes yourself to get a more reliable value |
| collection_guarantees      | List of [collection guarantees](#collection-guarantee)                                                                                                                                                                                                                                                           |
| block_seals                | List of [block seals](#block-seal)                                                                                                                                                                                                                                                                               |
| signatures                 | BLS signatures of consensus nodes                                                                                                                                                                                                                                                                                |
| execution_receipt_metaList | List of [execution-receipt-meta](#execution-receipt-meta)                                                                                                                                                                                                                                                        |
| execution_result_list      | List of [execution results](#execution-result)                                                                                                                                                                                                                                                                   |
| block_header               | A summary of a [block](#block-header)                                                                                                                                                                                                                                                                            |
| protocol_state_id          | The root hash of protocol state.                                                                                                                                                                                                                                                                                 |

The detailed semantics of block formation are covered in the [block formation guide](../../build/cadence/basics/blocks.md).

### Block Header

A block header is a summary of a [block](#block) and contains only the block ID, height, and parent block ID.

```proto
message BlockHeader {
  bytes id = 1;
  bytes parent_id = 2;
  uint64 height = 3;
  google.protobuf.Timestamp timestamp = 4;
  bytes payload_hash = 5;
  uint64 view = 6;
  repeated bytes parent_voter_ids = 7;
  bytes parent_voter_sig_data = 8;
  bytes proposer_id = 9;
  bytes proposer_sig_data = 10;
  string chain_id = 11;
  bytes parent_voter_indices = 12;
  TimeoutCertificate last_view_tc = 13;
  uint64 parent_view = 14;
}
```

| Field                 | Description                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| id                    | SHA3-256 hash of the entire block payload                                                                         |
| parent_id             | ID of the previous block in the chain                                                                             |
| height                | Height of the block in the chain                                                                                  |
| timestamp             | The time at which this block was proposed                                                                         |
| payload_hash          | A hash of the payload of this block                                                                               |
| view                  | View number during which this block was proposed.                                                                 |
| parent_voter_ids      | An array that represents all the voters ids for the parent block                                                  |
| parent_voter_sig_data | An aggregated signature over the parent block                                                                     |
| chain_id              | Chain ID helps identify the Flow network. It can be one of `flow-mainnet`, `flow-testnet` or `flow-emulator`      |
| parent_voter_indices  | A bitvector that represents all the voters for the parent block                                                   |
| last_view_tc          | A timeout certificate for previous view, it can be nil. It has to be present if previous round ended with timeout |
| parent_view           | A number at which parent block was proposed                                                                       |

### Block Seal

A block seal is an attestation that the execution result of a specific [block](#block) has been verified and approved by a quorum of verification nodes.

```proto
message BlockSeal {
  bytes block_id = 1;
  bytes execution_receipt_id = 2;
  repeated bytes execution_receipt_signatures = 3;
  repeated bytes result_approval_signatures = 4;
}
```

| Field                        | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| block_id                     | ID of the block being sealed                                           |
| execution_receipt_id         | ID execution receipt being sealed                                      |
| execution_receipt_signatures | BLS signatures of verification nodes on the execution receipt contents |
| result_approval_signatures   | BLS signatures of verification nodes on the result approval contents   |

### Block Status

```proto
enum BlockStatus {
  UNKNOWN = 0;
  FINALIZED = 1;
  SEALED = 2;
}
```

| Value     | Description                                    |
| --------- | ---------------------------------------------- |
| UNKNOWN   | The block status is not known                  |
| FINALIZED | The consensus nodes have finalized the block   |
| SEALED    | The verification nodes have verified the block |

### Collection

A collection is a batch of [transactions](#transaction) that have been included in a block. Collections are used to improve consensus throughput by increasing the number of transactions per block.

```proto
message Collection {
  bytes id = 1;
  repeated bytes transaction_ids = 2;
}
```

| Field           | Description                                       |
| --------------- | ------------------------------------------------- |
| id              | SHA3-256 hash of the collection contents          |
| transaction_ids | Ordered list of transaction IDs in the collection |

### Collection Guarantee

A collection guarantee is a signed attestation that specifies the collection nodes that have guaranteed to store and respond to queries about a collection.

```proto
message CollectionGuarantee {
  bytes collection_id = 1;
  repeated bytes signatures = 2;
  bytes reference_block_id = 3;
  bytes signature = 4;
  repeated bytes signer_ids = 5; // deprecated!! value will be empty. replaced by signer_indices
  bytes signer_indices = 6;
}
```

| Field              | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| collection_id      | SHA3-256 hash of the collection contents                           |
| signatures         | BLS signatures of the collection nodes guaranteeing the collection |
| reference_block_id | Defines expiry of the collection                                   |
| signature          | Guarantor signatures                                               |
| signer_ids         | An array that represents all the signer ids                        |
| signer_indices     | Encoded indices of the signers                                     |

### Transaction

A transaction represents a unit of computation that is submitted to the Flow network.

```proto
message Transaction {
  bytes script = 1;
  repeated bytes arguments = 2;
  bytes reference_block_id = 3;
  uint64 gas_limit = 4;
  ProposalKey proposal_key = 5;
  bytes payer = 6;
  repeated bytes authorizers = 7;
  repeated Signature payload_signatures = 8;
  repeated Signature envelope_signatures = 9;
}

message TransactionProposalKey {
  bytes address = 1;
  uint32 key_id = 2;
  uint64 sequence_number = 3;
}

message TransactionSignature {
  bytes address = 1;
  uint32 key_id = 2;
  bytes signature = 3;
}
```

| Field                         | Description                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| script                        | Raw source code for a Cadence script, encoded as UTF-8 bytes                                                                |
| arguments                     | Arguments passed to the Cadence script, encoded as [JSON-Cadence](https://cadencelang.dev/docs/1.0/json-cadence-spec) bytes |
| reference_block_id            | Block ID used to determine transaction expiry                                                                               |
| [proposal_key](#proposal-key) | Account key used to propose the transaction                                                                                 |
| payer                         | Address of the payer account                                                                                                |
| authorizers                   | Addresses of the transaction authorizers                                                                                    |
| signatures                    | [Signatures](#transaction-signature) from all signer accounts                                                               |

The detailed semantics of transaction creation, signing and submission are covered in the [transaction submission guide](../../build/cadence/basics/transactions.md#signing-a-transaction).

#### Proposal Key

The proposal key is used to specify a sequence number for the transaction. Sequence numbers are covered in more detail [here](../../build/cadence/basics/transactions.md#sequence-numbers).

| Field           | Description                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------- |
| address         | Address of proposer account                                                                         |
| key_id          | ID of proposal key on the proposal account                                                          |
| sequence_number | [Sequence number](../../build/cadence/basics/transactions.md#sequence-numbers) for the proposal key |

#### Transaction Signature

| Field     | Description                               |
| --------- | ----------------------------------------- |
| address   | Address of the account for this signature |
| key_id    | ID of the account key                     |
| signature | Raw signature byte data                   |

#### Transaction Status

```proto
enum TransactionStatus {
  UNKNOWN = 0;
  PENDING = 1;
  FINALIZED = 2;
  EXECUTED = 3;
  SEALED = 4;
  EXPIRED = 5;
}
```

| Value     | Description                                                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| UNKNOWN   | The transaction status is not known.                                                                                                      |
| PENDING   | The transaction has been received by a collector but not yet finalized in a block.                                                        |
| FINALIZED | The consensus nodes have finalized the block that the transaction is included in                                                          |
| EXECUTED  | The execution nodes have produced a result for the transaction                                                                            |
| SEALED    | The verification nodes have verified the transaction (the block in which the transaction is) and the seal is included in the latest block |
| EXPIRED   | The transaction was submitted past its expiration block height.                                                                           |

### Account

An account is a user's identity on Flow. It contains a unique address, a balance, a list of public keys and the code that has been deployed to the account.

```proto
message Account {
  bytes address = 1;
  uint64 balance = 2;
  bytes code = 3;
  repeated AccountKey keys = 4;
  map<string, bytes> contracts = 5;
}
```

| Field     | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| address   | A unique account identifier                                                 |
| balance   | The account balance                                                         |
| code      | The code deployed to this account (**deprecated**, use `contracts` instead) |
| keys      | A list of keys configured on this account                                   |
| contracts | A map of contracts or contract interfaces deployed on this account          |

The `code` and `contracts` fields contain the raw Cadence source code, encoded as UTF-8 bytes.

More information on accounts can be found [here](../../build/cadence/basics/accounts.md).

#### Account Key

An account key is a reference to a public key associated with a Flow account. Accounts can be configured with zero or more public keys, each of which can be used for signature verification when authorizing a transaction.

```proto
message AccountKey {
  uint32 index = 1;
  bytes public_key = 2;
  uint32 sign_algo = 3;
  uint32 hash_algo = 4;
  uint32 weight = 5;
  uint32 sequence_number = 6;
  bool revoked = 7;
}
```

| Field           | Description                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| id              | Index of the key within the account, used as a unique identifier                            |
| public_key      | Public key encoded as bytes                                                                 |
| sign_algo       | [Signature algorithm](../../build/cadence/basics/accounts.md#signature-and-hash-algorithms) |
| hash_algo       | [Hash algorithm](../../build/cadence/basics/accounts.md#signature-and-hash-algorithms)      |
| weight          | [Weight assigned to the key](../../build/cadence/basics/accounts.md#account-keys)           |
| sequence_number | [Sequence number for the key](../../build/cadence/basics/transactions.md#sequence-numbers)  |
| revoked         | Flag indicating whether or not the key has been revoked                                     |

More information on account keys, key weights and sequence numbers can be found [here](../../build/cadence/basics/accounts.md).

### Event

An event is emitted as the result of a [transaction](#transaction) execution. Events are either user-defined events originating from a Cadence smart contract, or built-in Flow system events.

```proto
message Event {
  string type = 1;
  bytes transaction_id = 2;
  uint32 transaction_index = 3;
  uint32 event_index = 4;
  bytes payload = 5;
}
```

| Field             | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| type              | Fully-qualified unique type identifier for the event                                              |
| transaction_id    | ID of the transaction the event was emitted from                                                  |
| transaction_index | Zero-based index of the transaction within the block                                              |
| event_index       | Zero-based index of the event within the transaction                                              |
| payload           | Event fields encoded as [JSON-Cadence values](https://cadencelang.dev/docs/1.0/json-cadence-spec) |

### Execution Result

Execution result for a particular block.

```proto
message ExecutionResult {
  bytes previous_result_id = 1;
  bytes block_id = 2;
  repeated Chunk chunks = 3;
  repeated ServiceEvent service_events = 4;
}
```

| Field              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| previous_result_id | Identifier of parent block execution result          |
| block_id           | ID of the block this execution result corresponds to |
| chunks             | Zero or more chunks                                  |
| service_events     | Zero or more service events                          |

### Execution Receipt Meta

ExecutionReceiptMeta contains the fields from the Execution Receipts that vary from one executor to another

```proto
message ExecutionReceiptMeta {
  bytes executor_id = 1;
  bytes result_id = 2;
  repeated bytes spocks = 3;
  bytes executor_signature = 4;
}
```

| Field              | Description                          |
| ------------------ | ------------------------------------ |
| executor_id        | Identifier of the executor node      |
| result_id          | Identifier of block execution result |
| spocks             | SPoCK                                |
| executor_signature | Signature of the executor            |

#### Chunk

Chunk described execution information for given collection in a block

```proto
message Chunk {
  uint32 CollectionIndex = 1;
  bytes start_state = 2;
  bytes event_collection = 3;
  bytes block_id = 4;
  uint64 total_computation_used = 5;
  uint32 number_of_transactions = 6;
  uint64 index = 7;
  bytes end_state = 8;
  bytes execution_data_id = 9;
  bytes state_delta_commitment = 10;
}
```

| Field                  | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| CollectionIndex        | Identifier of a collection                           |
| start_state            | State commitment at start of the chunk               |
| event_collection       | Hash of events emitted by transactions in this chunk |
| block_id               | Identifier of a block                                |
| total_computation_used | Total computation used by transactions in this chunk |
| number_of_transactions | Number of transactions in a chunk                    |
| index                  | Index of chunk inside a block (zero-based)           |
| end_state              | State commitment after executing chunk               |
| execution_data_id      | Identifier of a execution data                       |
| state_delta_commitment | A commitment over sorted list of register changes    |

#### Service Event

Special type of events emitted in system chunk used for controlling Flow system.

```proto
message ServiceEvent {
  string type = 1;
  bytes payload = 2;
}
```

| Field   | Description                         |
| ------- | ----------------------------------- |
| type    | Type of an event                    |
| payload | JSON-serialized content of an event |

## Subscriptions

### SubscribeEvents

`SubscribeEvents` streams events for all blocks starting at the requested start block, up until the latest available block. Once the latest is
reached, the stream will remain open and responses are sent for each new block as it becomes available.

Events within each block are filtered by the provided [EventFilter](#eventfilter), and only those events that match the filter are returned. If no filter is provided,
all events are returned.

Responses are returned for each block containing at least one event that matches the filter. Additionally, heatbeat responses (SubscribeEventsResponse
with no events) are returned periodically to allow clients to track which blocks were searched. Clients can use this information to determine
which block to start from when reconnecting.

```proto
rpc SubscribeEvents(SubscribeEventsRequest) returns (stream SubscribeEventsResponse)
```

#### Request

```proto
message SubscribeEventsRequest {
  bytes start_block_id = 1;
  uint64 start_block_height = 2;
  EventFilter filter = 3;
  uint64 heartbeat_interval = 4;
  entities.EventEncodingVersion event_encoding_version = 5;
}
```

| Field                  | Description                                                                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_block_id         | The first block to search for events. Only one of start_block_id and start_block_height may be provided, otherwise an InvalidArgument error is returned. If neither are provided, the latest sealed block is used                 |
| start_block_height     | Block height of the first block to search for events. Only one of start_block_id and start_block_height may be provided, otherwise an InvalidArgument error is returned. If neither are provided, the latest sealed block is used |
| filter                 | Filter to apply to events for each block searched. If no filter is provided, all events are returned                                                                                                                              |
| heartbeat_interval     | Interval in block heights at which the server should return a heartbeat message to the client                                                                                                                                     |
| event_encoding_version | Preferred event encoding version of the block events payload. Possible variants: CCF, JSON-CDC                                                                                                                                    |

#### Response

```proto
message SubscribeEventsResponse {
  bytes block_id = 1;
  uint64 block_height = 2;
  repeated entities.Event events = 3;
  google.protobuf.Timestamp block_timestamp = 4;
  uint64 message_index = 5;
}
```

### SubscribeExecutionData

`SubscribeExecutionData` streams execution data for all blocks starting at the requested start block, up until the latest available block. Once the latest is reached, the stream will remain open and responses are sent for each new execution data as it becomes available.

```proto
rpc SubscribeExecutionData(SubscribeExecutionDataRequest) returns (stream SubscribeExecutionDataResponse)
```

#### Request

```proto
message SubscribeExecutionDataRequest {
  bytes start_block_id = 1;
  uint64 start_block_height = 2;
  entities.EventEncodingVersion event_encoding_version = 3;
}
```

| Field                  | Description                                                                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_block_id         | The first block to get execution data for. Only one of start_block_id and start_block_height may be provided, otherwise an InvalidArgument error is returned. If neither are provided, the latest sealed block is used                 |
| start_block_height     | Block height of the first block to get execution data for. Only one of start_block_id and start_block_height may be provided, otherwise an InvalidArgument error is returned. If neither are provided, the latest sealed block is used |
| event_encoding_version | Preferred event encoding version of the block events payload. Possible variants: CCF, JSON-CDC                                                                                                                                         |

#### Response

```proto
message SubscribeExecutionDataResponse {
  uint64 block_height = 1;
  entities.BlockExecutionData block_execution_data = 2;
  google.protobuf.Timestamp block_timestamp = 3;
}
```

## Execution data

### EventFilter

`EventFilter` defines the filter to apply to block events. Filters are applied as an OR operation, i.e. any event matching any of the filters is returned.
If no filters are provided, all events are returned. If there are any invalid filters, the API will return an InvalidArgument error.

```proto
message EventFilter {
  repeated string event_type = 1;
  repeated string contract = 2;
  repeated string address = 3;
}
```

| Field      | Description                                                                                                                                                                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event_type | A list of full event types to include. <br/> Event types have 2 formats:<br/> _ Protocol events: `flow.[event name]`<br/> _ Smart contract events: `A.[contract address].[contract name].[event name]`                                                                                                |
| contract   | A list of contracts who's events should be included. Contracts have the following name formats:<br/> _ Protocol events: `flow`<br/> _ Smart contract events: `A.[contract address].[contract name]`<br/> This filter matches on the full contract including its address, not just the contract's name |
| address    | A list of addresses who's events should be included. Addresses must be Flow account addresses in hex format and valid for the network the node is connected to. i.e. only a mainnet address is valid for a mainnet node. Addresses may optionally include the `0x` prefix                             |

## Execution data streaming API

### Execution Data API

The `ExecutionDataAPI` provides access to block execution data over gRPC, including transactions, events, and register data (account state). It’s an optional API, which makes use of the Execution Sync protocol to trustlessly download data from peers on the network.

[execution data protobuf file](https://github.com/onflow/flow/blob/master/protobuf/flow/executiondata/executiondata.proto)

> The API is disabled by default. To enable it, specify a listener address with the cli flag `--state-stream-addr`.

<aside>
ℹ️ Currently, the api must be started on a separate port from the regular gRPC endpoint. There is work underway to add support for using the same port.

</aside>

Below is a list of the available CLI flags to control the behavior of the API

| Flag                             | Type     | Description                                                                                                                                                                                                                                                                               |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| state-stream-addr                | string   | Listener address for API. e.g. 0.0.0.0:9003. If no value is provided, the API is disabled. Default is disabled.                                                                                                                                                                           |
| execution-data-cache-size        | uint32   | Number of block execution data objects to store in the cache. Default is 100.                                                                                                                                                                                                             |
| state-stream-global-max-streams  | uint32   | Global maximum number of concurrent streams. Default is 1000.                                                                                                                                                                                                                             |
| state-stream-max-message-size    | uint     | Maximum size for a gRPC response message containing block execution data. Default is 20*1024*1024 (20MB).                                                                                                                                                                                 |
| state-stream-event-filter-limits | string   | Event filter limits for ExecutionData SubscribeEvents API. These define the max number of filters for each type. e.g. EventTypes=100,Addresses=20,Contracts=50. Default is 1000 for each.                                                                                                 |
| state-stream-send-timeout        | duration | Maximum wait before timing out while sending a response to a streaming client. Default is 30s.                                                                                                                                                                                            |
| state-stream-send-buffer-size    | uint     | Maximum number of unsent responses to buffer for a stream. Default is 10.                                                                                                                                                                                                                 |
| state-stream-response-limit      | float64  | Max number of responses per second to send over streaming endpoints. This effectively applies a rate limit to responses to help manage resources consumed by each client. This is mostly used when clients are querying data past data. e.g. 3 or 0.5. Default is 0 which means no limit. |

<aside>
ℹ️ This API provides access to Execution Data, which can be very large (100s of MB) for a given block. Given the large amount of data, operators should consider their expected usage patters and tune the available settings to limit the resources a single client can use. It may also be useful to use other means of managing traffic, such as reverse proxies or QoS tools.

</aside>
