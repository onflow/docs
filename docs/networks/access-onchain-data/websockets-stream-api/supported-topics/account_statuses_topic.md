---
title: Account statuses
sidebar_label: Account statuses
sidebar_position: 6
---

Provides accounts statuses updates. The response can be configured using additional arguments to filter and retrieve only filtered account statuses instead of all core account events.

## Example Request

Started from latest block for event types `flow.AccountKeyAdded` and `flow.AccountKeyRemoved`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "account_statuses",
    "arguments": {
        "event_types": [
            "flow.AccountKeyAdded",
            "flow.AccountKeyRemoved"
        ]
    }
}
```

Started from block height `106219488` for all accounts events with heartbeat interval equal 10 blocks:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "account_statuses",
    "arguments": {
        "start_block_height": "106219488",
        "heartbeat_interval": "10"
    }
}
```

Started from block id `f1ba2fb02daf02c7a213b6b0f75774aaf54180ae67fb62bdf22ae37295fe1120` for account addresses `0xe544175ee0461c4b` and `2d4c3caffbeab845` with heartbeat interval equal 5 blocks:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "account_statuses",
    "arguments": {
        "start_block_id": "f1ba2fb02daf02c7a213b6b0f75774aaf54180ae67fb62bdf22ae37295fe1120",
        "heartbeat_interval": "5",
        "account_addresses": [
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
| `event_types`        | LIST   | NO       | A comma-separated list of event types to include. See the list of possible event types value [below](#the-list-of-possible-core-event-types).                                                                                  |
| `account_addresses`  | LIST   | NO       | A comma-separated list of addresses who's events should be included. The format could be `"0xe544175ee0461c4b"` or `"e544175ee0461c4b"`.                                                                 |

If neither `start_block_id` nor `start_block_height` is set, the subscription will start from the latest block based on its status.

#### The list of possible core event types

- `flow.AccountCreated` emitted when a new account gets created.
- `flow.AccountKeyAdded` emitted when a key gets added to an account.
- `flow.AccountKeyRemoved` emitted when a key gets removed from an account.
- `flow.AccountContractAdded` emitted when a contract gets deployed to an account.
- `flow.AccountContractUpdated` emitted when a contract gets updated on an account.
- `flow.AccountContractRemoved` emitted when a contract gets removed from an account.
- `flow.InboxValuePublished` emitted when a Capability is published from an account.
- `flow.InboxValueUnpublished` emitted when a Capability is unpublished from an account.
- `flow.InboxValueClaimed` emitted when a Capability is claimed by an account.

## Example Response

```json
{
    "subscription_id": "some-id",
    "topic": "account_statuses",
    "payload": {
        "block_id": "ab20d1a3574177e69636eea73e7db4e74cffb2754cb14ca0bf18c2b96e8b68b9",
        "height": "106219247",
        "account_events": {
            "0x37d2b958f6970c48": [
                {
                    "type": "flow.AccountKeyAdded",
                    "transaction_id": "19af79cf2fe081491f1e7b0bf490869c8baece742c6606b4a51383515131b5f0",
                    "transaction_index": "1",
                    "event_index": "14",
                    "payload": "2IGChNigg0BpUHVibGljS2V5goJpcHVibGljS2V52IvYiQyCcnNpZ25hdHVyZUFsZ29yaXRobdiIQQLYpINBAW1IYXNoQWxnb3JpdGhtgYJocmF3VmFsdWXYiQzYpINBAnJTaWduYXR1cmVBbGdvcml0aG2BgmhyYXdWYWx1ZdiJDNiig0EDdGZsb3cuQWNjb3VudEtleUFkZGVkhYJnYWRkcmVzc9iJA4JpcHVibGljS2V52IhAgmZ3ZWlnaHTYiReCbWhhc2hBbGdvcml0aG3YiEEBgmhrZXlJbmRleNiJBILYiEEDhUg30rlY9pcMSIKYQBjBGFoYKhg8GLoAGEIHGHAYYREYoBirGKsYiRhrGDAY3xiTGLkUGJYYdRixGOwYjxjNGCkAExhRGCoY/xgfEBh/GJ0YtxjBGH8YLxiqGD4JGKIY6xgmDhiUGDEYqRhvGCYY8hitGMEWGKwY6RiEGF4YQRhBGKGBAhsAAAAXSHboAIEBwkA="
                }
            ]
        },
        "message_index": 4
    }
}
```
