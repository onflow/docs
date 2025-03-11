---
title: Block headers topic
sidebar_label: Block headers topic
sidebar_position: 3
---

Provides block headers without the payload, each time a new block appears on the blockchain.

## Example Request

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

### Request Arguments  

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `block_status`       | STRING | YES      | The status of blocks to subscribe to. Supported values are: `sealed`, `finalized`. |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_height`. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, it is **not** possible to set `start_block_id`  |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

## Example Response

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
