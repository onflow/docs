---
title: Account statuses
sidebar_label: Account statuses
sidebar_position: 6
---

Provides accounts statuses updates. The response can be configured using additional arguments to filter and retrieve only filtered account statuses instead of all core account events.

## Example Request

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

### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |
| `heartbeat_interval` | STRING | NO       | Maximum number of blocks between messages after which a response with no events is returned. This helps the client track progress for sparse event filters. |
| `event_types`        | LIST   | NO       | A comma-separated list of event types to include.                                                                                    |
| `account_addresses`  | LIST   | NO       | A comma-separated list of addresses who's events should be included.                                                                 |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

## Example Response

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
