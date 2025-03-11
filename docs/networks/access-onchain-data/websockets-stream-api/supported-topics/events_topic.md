---
title: Events topic
sidebar_label: Events topic
sidebar_position: 5
---

Provides blockchain events. The response can be configured using additional arguments to filter and retrieve only filtered events instead of all events. 

## Example Request

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

### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |
| `heartbeat_interval` | STRING | NO       | Maximum number of blocks between messages after which a response with no events is returned. This helps the client track progress for sparse event filters. |
| `event_types`        | LIST   | NO       | A comma-separated list of event types to include.                                                                                    |
| `addresses`          | LIST   | NO       | A comma-separated list of addresses who's events should be included.                                                                 |
| `contracts`          | LIST   | NO       | A comma-separated list of contracts who's events should be included.                                                                 |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

## Example Response

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
