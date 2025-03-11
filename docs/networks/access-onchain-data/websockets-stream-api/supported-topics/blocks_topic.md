---
title: Blocks topic
sidebar_label: Blocks topic
sidebar_position: 4
---

Provides full block information each time a new block appears on the blockchain.

## Example Request

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
