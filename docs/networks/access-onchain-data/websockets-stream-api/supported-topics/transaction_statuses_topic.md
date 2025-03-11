---
title: Transaction statuses topic
sidebar_label: Transaction statuses topic
sidebar_position: 7
---

Provides updates on transaction status changes for already sent transactions.

## Example Request

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

### Request Arguments

| Name    | Type   | Required | Description                                              |
| ------- | ------ | -------- | -------------------------------------------------------- |
| `tx_id` | STRING | YES      | The ID of the transaction to monitor for status changes. |


## Example Response

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

