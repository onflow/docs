---
title: Block headers
sidebar_label: Block headers
sidebar_position: 3
---

Provides block headers without the payload, each time a new block appears on the blockchain.

## Example Request

Started from latest block:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "block_headers",
    "arguments": {
        "block_status": "finalized"
    }
}
```

Started from block height `106195326`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "block_headers",
    "arguments": {
        "block_status": "finalized",
        "start_block_height": "106195326"
    }
}
```

Started from block id `cb27b014fa105a1e0e64d56cfbe2d7e140f4adf32938e38c3459592d01a72e91`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "block_headers",
    "arguments": {
        "block_status": "finalized",
        "start_block_id": "cb27b014fa105a1e0e64d56cfbe2d7e140f4adf32938e38c3459592d01a72e91"
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
    "subscription_id": "some-id",
    "topic": "block_headers",
    "payload": {
        "id": "5cd0b1d0a0f0017c25647a6e2454a59aafa90682f2329449a610e19673ba07de",
        "parent_id": "72ecd7cf6b18488b3597e677c5fa620d2dfad981fdd81b5cdb1851490b0cff56",
        "height": "106195236",
        "timestamp": "2025-03-11T12:18:39.702990376Z",
        "parent_voter_signature": "+GyIAAAAAAAAAACwsabEiORFcP/ru95TABxwxXsxnUtJNoUbGB1xKKNtpR/LNUqDL5TyIQjL3xBl5KtKgLCFde8F5DHtUSGYSQUzaGhv+IoQgh1wgbXlY/soY5T30/HwmrucwD925EKOJAQUj7s="
    }
}
```
