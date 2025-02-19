---
title: Supported topics
sidebar_label: Supported topics
sidebar_position: 2
---

# Supported Topics  

Below is a list of topics that can be subscribed to in order to receive updates about different states of the Flow blockchain. It is possible to subscribe to each topic multiple times with different configurations based on input arguments. The responses for all topics are aligned with [Flow REST API](/http-api) responses.

## `block_digests` topic

Provides a summarized version of block information, including only the block ID, height, and timestamp, each time a new block appears on the blockchain. 

### Example Request

```json
{
  "subscription_id": "some-id-1",
  "action": "subscribe",
  "topic": "block_digests",
  "arguments": {
    "block_status": "sealed",
    "start_block_height": "10,530,102"
  }
}
```  

#### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `block_status`       | STRING | YES      | The status of blocks to subscribe to.                                                                                                |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

### Example Responce

```json
{
  "subscription_id": "some-id-1",
  "topic": "block_digests",
  "payload": {
        "id": "910b...",
        "height": "10530103",
        "timestamp": "2024-03-19T15:22:12.600529133Z",
    }
}
```

## `block_headers` topic

Provides block headers without the payload, each time a new block appears on the blockchain.

### Example Request

```json
{
  "subscription_id": "some-id-2",
  "action": "subscribe",
  "topic": "block_headers",
  "arguments": {
    "block_status": "sealed",
    "start_block_height": "10,530,102"
  }
}
```  

#### Request Arguments  

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `block_status`       | STRING | YES      | The status of blocks to subscribe to.                                                                                                |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

### Example Responce

```json
{
  "subscription_id": "some-id-2",
  "topic": "block_headers",
  "payload": {
        "id": "910b...",
        "parent_id": "1f5b...",
        "height": "10530103",
        "timestamp": "2024-03-19T15:22:12.600529133Z",
        "parent_voter_signature": "+GyIA..."
    }
}
```

## `blocks` topic

Provides full block information each time a new block appears on the blockchain.

### Example Request

```json
{
  "subscription_id": "some-id-3",
  "action": "subscribe",
  "topic": "blocks",
  "arguments": {
    "block_status": "sealed",
    "start_block_height": "10,530,102"
  }
}
```  

#### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `block_status`       | STRING | YES      | The status of blocks to subscribe to.                                                                                                |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

### Example Responce

```json
{
  "subscription_id": "some-id-3",
  "topic": "blocks",
  "payload": {
        "header": {
            //...
        },
        "payload": {
            //...
        },
        "_expandable": {
            //...
        },
        "_links": {
            //...
        },
        "block_status": "BLOCK_SEALED"
    }
}
```

## `events` topic

Provides blockchain events. The response can be configured using additional arguments to filter and retrieve only filtered events instead of all events. 

### Example Request

```json
{
  "subscription_id": "some-id-4",
  "action": "subscribe",
  "topic": "events",
  "arguments": {
    "start_block_height": "10530103",
    "event_types": ["flow.AccountKeyAdded"]
  }
}
```  

#### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |
| `heartbeat_interval` | STRING | NO       | Interval in block heights at which the server should return a heartbeat message to the client.                                       |
| `event_types`        | LIST   | NO       | A comma-separated list of events type to include.                                                                                    |
| `addresses`          | LIST   | NO       | A comma-separated list of addresses who's events should be included.                                                                 |
| `contracts`          | LIST   | NO       | A comma-separated list of contracts who's events should be included.                                                                 |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

### Example Responce

```json
{
  "subscription_id": "some-id-4",
  "topic": "events",
  "payload":  {
        "block_id": "0385...",
        "block_height": "10530103",
        "block_timestamp": "2024-03-19T15:22:12.600529133Z",
        "events": [
            {
                "type": "flow.AccountKeyAdded",
                "transaction_id": "3dfe...",
                "transaction_index": "0",
                "event_index": "0",
                "payload": "2IGC..."
            },
            //...
        ],
        "message_index": 1
    }
}
```

## `account_statuses` topic

Provides accounts statuses updates. The response can be configured using additional arguments to filter and retrieve only filtered account statuses instead of all core account events.

### Example Request

```json
{
  "subscription_id": "some-id-5",
  "action": "subscribe",
  "topic": "account_statuses",
  "arguments": {
    "start_block_height": "10530103",
    "event_types": ["flow.AccountCreated"]
  }
}
```  

#### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |
| `heartbeat_interval` | STRING | NO       | Interval in block heights at which the server should return a heartbeat message to the client.                                       |
| `event_types`        | LIST   | NO       | A comma-separated list of events type to include.                                                                                    |
| `account_addresses`  | LIST   | NO       | A comma-separated list of addresses who's events should be included.                                                                 |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

### Example Responce

```json
{
  "subscription_id": "some-id-5",
  "topic": "events",
  "payload": {
        "block_id": "3a414...",
        "height": "10530103",
        "account_events": {
            "0xe521...": [
                {
                    "type": "flow.AccountCreated",
                    "transaction_id": "eb6e...",
                    "transaction_index": "1",
                    "event_index": "13",
                    "payload": "2IGCgd..."
                },
                //...
            ]
        },
        "message_index": 1
    }
}
```

## `transaction_statuses` topic

Provides updates on transaction status changes for already sent transactions.

### Example Request

```json
{
  "subscription_id": "some-id-6",
  "action": "subscribe",
  "topic": "transaction_statuses",
  "arguments": {
    "tx_id": "7b028..."
  }
}
```  

#### Request Arguments

| Name    | Type   | Required | Description                                              |
| ------- | ------ | -------- | -------------------------------------------------------- |
| `tx_id` | STRING | YES      | The ID of the transaction to monitor for status changes. |


### Example Responce

```json
{
  "subscription_id": "some-id-6",
  "topic": "transaction_statuses",
  "payload": {
      "transaction_result": {
          "block_id": "",
          "collection_id": "",
          "execution": "Pending",
          "status": "Pending",
          "status_code": 0,
          "error_message": "",
          "computation_used": "0",
          "events": [],
          "_links": {
              "_self": "/v1/transaction_results/7b02..."
          }
      },
      "message_index": 0
   }
}
```


## `send_and_get_transaction_statuses` topic

Sends a transaction and provides updates on its status changes.

### Example Request

```json
{
  "subscription_id": "some-id-7",
  "action": "subscribe",
  "topic": "send_and_get_transaction_statuses",
  "arguments": {
    "script": "access(all) fun main() {}",
    "arguments": [],
    "reference_block_id": "a3f1c4d5...",
    "gas_limit": "1000",
    "payer": "01cf...",
    "proposal_key": {
      "address": "01cf...",
      "key_index": 0,
      "sequence_number": 42
    },
    "authorizers": [
      "01cf...",
      "179b..."
    ],
    "payload_signatures": [
        //...
    ],
    "envelope_signatures": [
      //...
    ]
  }
}
```  

| Name                  | Type   | REQUIRED | Description                                                               |
| --------------------- | ------ | -------- | ------------------------------------------------------------------------- |
| `script`              | STRING | YES      | Base64-encoded content of the Cadence script.                             |
| `arguments`           | LIST   | YES      | A list of arguments, each encoded as Base64.                              |
| `reference_block_id`  | STRING | YES      | A 32-byte unique identifier for an entity.                                |
| `gas_limit`           | STRING | YES      | The limit on the amount of computation a transaction can perform.         |
| `payer`               | STRING | YES      | The 8-byte address of an account.                                         |
| `proposal_key`        | OBJECT | YES      | A required object representing the proposal key.                          |
| `authorizers`         | LIST   | YES      | A list of authorizers, each represented as a hexadecimal-encoded address. |
| `payload_signatures`  | LIST   | YES      | A list of Base64-encoded signatures.                                      |
| `envelope_signatures` | LIST   | YES      | A list of Base64-encoded signatures.                                      |

### Example Responce

```json
{
  "subscription_id": "some-id-7",
    "topic": "send_and_get_transaction_statuses",
    "payload": {
        "transaction_result": {
            "block_id": "e613...",
            "collection_id": "3c48...",
            "execution": "Success",
            "status": "Sealed",
            "status_code": 0,
            "error_message": "",
            "computation_used": "0",
            "events": [
                {
                    "type": "A.4eb8a10cb9f87357.NFTStorefront.ListingAvailable",
                    "transaction_id": "7b02878855772537176dbf3c48c44bc93c4a55be2a5e7b7fb3641e4295343473",
                    "transaction_index": "1",
                    "event_index": "0",
                    "payload": "eyJ2...."
                },
                //...
            ],
            "_links": {
                "_self": "/v1/transaction_results/7b02..."
            }
        },
        "message_index": 3
    }
}
```