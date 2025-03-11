---
title: Block digests
sidebar_label: Block digests
sidebar_position: 2
---

Provides a summarized version of block information, including only the block ID, height, and timestamp, each time a new block appears on the blockchain. 

## Example Request

Started from latest block:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "block_digests",
    "arguments": {
        "block_status": "sealed"
    }
}
```

Started from block height `106192109`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "block_digests",
    "arguments": {
        "block_status": "sealed",
        "start_block_height": "106192109"
    }
}
```

Started from block id `37193c008576c5f9e3fb9738d4cc53c9ca021ca593e437eb79107c13ec5a1758`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "block_digests",
    "arguments": {
        "block_status": "sealed",
        "start_block_id": "37193c008576c5f9e3fb9738d4cc53c9ca021ca593e437eb79107c13ec5a1758"
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
    "subscription_id": "some-id",
    "topic": "block_digests",
    "payload": {
        "block_id": "311ca4b8530fad041356ace3ba27cd6ca8bed53d166b4cefdde4c3ae414940d5",
        "height": "106190012",
        "timestamp": "2025-03-11T11:08:58.504803374Z"
    }
}
```