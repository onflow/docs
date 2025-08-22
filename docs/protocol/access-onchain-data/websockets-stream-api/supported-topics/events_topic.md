---
title: Events
sidebar_label: Events
sidebar_position: 5
---

Provides blockchain events. The response can be configured using additional arguments to filter and retrieve only filtered events instead of all events. 

## Example Request

Started from latest block for event types `flow.AccountKeyAdded` and `flow.AccountKeyRemoved`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "events",
    "arguments": {
        "event_types": [
            "flow.AccountKeyAdded",
            "flow.AccountKeyRemoved"
        ]
    }
}
```

Started from block height `106197172` for contracts `A.f919ee77447b7497.FlowFees` and `A.1654653399040a61.FlowToken` with heartbeat interval equal 10 blocks:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "events",
    "arguments": {
        "start_block_height": "106197172",
        "heartbeat_interval": "10",
        "contracts": [
            "A.f919ee77447b7497.FlowFees",
            "A.1654653399040a61.FlowToken"
        ]
    }
}
```

Started from block id `44774d980c75d9380caaf4c65a2ee6c4bde9a1e6da6aa858fe2dc5e4a7aff773` for account addresses `0xe544175ee0461c4b` and `2d4c3caffbeab845` with heartbeat interval equal 5 blocks:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "events",
    "arguments": {
        "start_block_id": "44774d980c75d9380caaf4c65a2ee6c4bde9a1e6da6aa858fe2dc5e4a7aff773",
        "heartbeat_interval": "5",
        "addresses": [
            "0xe544175ee0461c4b",
            "2d4c3caffbeab845"
        ]
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
| `addresses`          | LIST   | NO       | A comma-separated list of addresses who's events should be included. The format could be `"0xe544175ee0461c4b"` or `"e544175ee0461c4b"`.                                                 |
| `contracts`          | LIST   | NO       | A comma-separated list of contracts who's events should be included. The format is `"A.f919ee77447b7497.FlowFees"`                                                                |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

## Example Response

```json
{
    "subscription_id": "some-id",
    "topic": "events",
    "payload": {
        "block_id": "660ce05ff19193a08c24730cdc0d747da76dfcc39fbab523d970270f2d5c9a3c",
        "block_height": "106197288",
        "block_timestamp": "2025-03-11T12:46:03.588742664Z",
        "events": [
            {
                "type": "flow.AccountKeyAdded",
                "transaction_id": "7d9290e54437b4b9a5de416c04af6d597fcf5bf1cefcf618232ad86e5f71322b",
                "transaction_index": "1",
                "event_index": "14",
                "payload": "2IGChNigg0BpUHVibGljS2V5goJpcHVibGljS2V52IvYiQyCcnNpZ25hdHVyZUFsZ29yaXRobdiIQQLYpINBAW1IYXNoQWxnb3JpdGhtgYJocmF3VmFsdWXYiQzYpINBAnJTaWduYXR1cmVBbGdvcml0aG2BgmhyYXdWYWx1ZdiJDNiig0EDdGZsb3cuQWNjb3VudEtleUFkZGVkhYJnYWRkcmVzc9iJA4JpcHVibGljS2V52IhAgmZ3ZWlnaHTYiReCbWhhc2hBbGdvcml0aG3YiEEBgmhrZXlJbmRleNiJBILYiEEDhUhbvtriVP1Dy4KYQBUYNhhKGHoYZhicGHwYwxgYGKcYqxhqGIcYZxiCGKMXGDgYRRjnGGQYjBieGIIYxhiUGIgY+BjjGM0YlxhBGL0Y2hiyGHUY8hjoGBwYMhiUGC4YIxjtGNkYJhgoGPMYNxgmGF0YqhgjGP0YlRh2GMoYTxihGOIYsBizGEsYVIECGwAAABdCgQcAgQPCQA=="
            },
            {
                "type": "flow.AccountKeyAdded",
                "transaction_id": "7d9290e54437b4b9a5de416c04af6d597fcf5bf1cefcf618232ad86e5f71322b",
                "transaction_index": "1",
                "event_index": "15",
                "payload": "2IGChNigg0BpUHVibGljS2V5goJpcHVibGljS2V52IvYiQyCcnNpZ25hdHVyZUFsZ29yaXRobdiIQQLYpINBAW1IYXNoQWxnb3JpdGhtgYJocmF3VmFsdWXYiQzYpINBAnJTaWduYXR1cmVBbGdvcml0aG2BgmhyYXdWYWx1ZdiJDNiig0EDdGZsb3cuQWNjb3VudEtleUFkZGVkhYJnYWRkcmVzc9iJA4JpcHVibGljS2V52IhAgmZ3ZWlnaHTYiReCbWhhc2hBbGdvcml0aG3YiEEBgmhrZXlJbmRleNiJBILYiEEDhUhbvtriVP1Dy4KYQBg2GMoY4QYYUhiTGNkYjBinGFsYuhiPGEQYcBjrGKoYdRhsGCkYVRivGMIYRxj6GCUYpRj1GJ4YeRipDgoYPBiLGKAYdgkY8RhVGC4YKxhHGDYYVRiqGOcIGGsYOhhwGIgEGKwYyhj4AxgxGLwYpxhuGMQYtxjsGKeBAhsAAAAXSHboAIEDwkEB"
            },
            {
                "type": "flow.AccountKeyAdded",
                "transaction_id": "7d9290e54437b4b9a5de416c04af6d597fcf5bf1cefcf618232ad86e5f71322b",
                "transaction_index": "1",
                "event_index": "16",
                "payload": "2IGChNigg0BpUHVibGljS2V5goJpcHVibGljS2V52IvYiQyCcnNpZ25hdHVyZUFsZ29yaXRobdiIQQLYpINBAW1IYXNoQWxnb3JpdGhtgYJocmF3VmFsdWXYiQzYpINBAnJTaWduYXR1cmVBbGdvcml0aG2BgmhyYXdWYWx1ZdiJDNiig0EDdGZsb3cuQWNjb3VudEtleUFkZGVkhYJnYWRkcmVzc9iJA4JpcHVibGljS2V52IhAgmZ3ZWlnaHTYiReCbWhhc2hBbGdvcml0aG3YiEEBgmhrZXlJbmRleNiJBILYiEEDhUhbvtriVP1Dy4KYQBjTABhfGC8YmBiZGLoYwBjEGI0YwBjJGJwYVRhxGJ0YxRjKCRj6AxhaEBiEGI0YfBj3GM0YPhiDGFIYrBg/GMgYnBh0GFQYNBhAGFEYZxi/GNMIGB8YeRhEGKQYbRhHGHAYShjyGEYYnhjrGCEYZBjBGLYYYxg5GBwYkoECGgX14QCBA8JBAg=="
            }
        ],
        "message_index": 11
    }
}
```
