---
title: Block digests topic
sidebar_label: Block digests topic
sidebar_position: 2
---

Provides a summarized version of block information, including only the block ID, height, and timestamp, each time a new block appears on the blockchain. 

## Example Request

```json
{
  "subscription_id": "some-id-1",
  "action": "subscribe",
  "topic": "block_digests",
  "arguments": {
    "block_status": "sealed",
    "start_block_height": "10530102"
  }
}
```  

### Request Arguments

| Name                 | Type   | Required | Description                                                                                                                          |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `block_status`       | STRING | YES      | The status of blocks to subscribe to. Supported values are: `sealed`, `finalized`. |
| `start_block_id`     | STRING | NO       | The ID of the block from which the subscription starts. If this argument is set, `start_block_height` MUST be empty. |  |
| `start_block_height` | STRING | NO       | The height of the block from which the subscription starts. If this argument is set, `start_block_id` MUST be empty. |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

## Example Response

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