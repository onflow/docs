---
title: Send and get transaction statuses
sidebar_label: Send and get transaction statuses
sidebar_position: 8
---

Sends a transaction and provides updates on its status changes.

## Example Request

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
| `reference_block_id`  | STRING | YES      | BlockID for the transaction's reference block |
| `gas_limit`           | STRING | YES      | The limit on the amount of computation a transaction can perform.         |
| `payer`               | STRING | YES      | The 8-byte address of an account.                                         |
| `proposal_key`        | OBJECT | YES      | A required object representing the proposal key.                          |
| `authorizers`         | LIST   | YES      | A list of authorizers, each represented as a hexadecimal-encoded address. |
| `payload_signatures`  | LIST   | NO       | A list of Base64-encoded signatures.                                      |
| `envelope_signatures` | LIST   | YES      | A list of Base64-encoded signatures.                                      |

## Example Response

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