---
title: Blocks
sidebar_label: Blocks
sidebar_position: 4
---

Provides full block information each time a new block appears on the blockchain.

## Example Request

Started from latest block:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "blocks",
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
    "topic": "blocks",
    "arguments": {
        "block_status": "sealed",
        "start_block_height": "106192109"
    }
}
```

Started from block id `83a8229cbe552f9b10160163394986dc7d99790ad3fedf7db4153d7d7863a3fa`:

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "blocks",
    "arguments": {
        "block_status": "sealed",
        "start_block_id": "83a8229cbe552f9b10160163394986dc7d99790ad3fedf7db4153d7d7863a3fa"
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
    "topic": "blocks",
    "payload": {
        "header": {
            "id": "7a7bc4dc574f67f0dc01a6c96cfbabe73ead23f76ac8130e620996779a500925",
            "parent_id": "70b7f0a8c14e9f374eaf2f37da4dee7815c8639b3f9e67c301e84cf7fb51070c",
            "height": "106195712",
            "timestamp": "2025-03-11T12:25:00.450424315Z",
            "parent_voter_signature": "+GyIAAAAAAAAAACwobZq2GxrWxPUuNJwo5T1pFWvwcAF4/ue8e7j7eFTcRhtReHV+dWnneyGtJdpuaIagLCEfjHvfItzt3J/kXsbdEFeycVBeznP4LIHs0XWWkeRn+yds4NAM8jltmGGBnvgJ68="
        },
        "payload": {
            "collection_guarantees": [
                {
                    "collection_id": "74d146368179f95a49531072cda799d1c0905523fd5a35c224eefbd92fab6a90",
                    "signer_indices": "71d9de679d7ff457a0",
                    "signature": ""
                },
                {
                    "collection_id": "b4b40fa4bd5a98cc5f61924aa63a98c588f56447cec5bcdad538e0a855f1a0f3",
                    "signer_indices": "710746ee7fd5f7a540",
                    "signature": ""
                }
            ],
            "block_seals": [
                {
                    "block_id": "71418383aefda2df4da5fabb03d5ff0e8778f83783c5566c1110ba4a4d6e8de3",
                    "result_id": "35f480934324280f6eebd6016b143bc28cecb8f71fcd8262153320ad93b16c61",
                    "final_state": "\"0cc68829215fb9d69641537a317787b4ff805fe07d2f9ce12534b87d7d0f1335\"",
                    "aggregated_approval_signatures": [
                        {
                            "verifier_signatures": [
                                "rF6XjkIxY8lYD1vZvUycBtT+9DNY4d0U+p1q6WxiA8siYuFawrThkEIkLA3lYPjz"
                            ],
                            "signer_ids": [
                                "80a0eaa9eb5fd541b2abbd1b5ffa79f0ae9a36973322556ebd4bdd3e1d9fe4cd"
                            ]
                        },
                        {
                            "verifier_signatures": [
                                "j2Y94dVrZZT1qNuK1ZbTOxj5HfNZxmV5zVBA3uwTKrQ4FFQ6gN0na1nXhZDJN1po"
                            ],
                            "signer_ids": [
                                "e7e46cd698170b1f86bc9116dded0ac7df6ea0d86c41788c599fa77072059ea1"
                            ]
                        },
                        {
                            "verifier_signatures": [
                                "jp1/x2dr+LVS6Wl3ScaabsxD8745sb1kec3FUrj0SVXGEFnS7AUvG5RTKfsdF6m3"
                            ],
                            "signer_ids": [
                                "49c9f946170d5fb40c2af953b1534fae771905865b142ab6ac9685b8ba5b51c1"
                            ]
                        },
                        {
                            "verifier_signatures": [
                                "rogMdMXwEKJvMUxdHcFqseW9VGVmNzya51kI8yoc8M0kPfuRfENqfgY1NuQBVn3N"
                            ],
                            "signer_ids": [
                                "a1e6a5d9385d549f546803566747463e616e1d02ade2fcadba1b49c492ec8f29"
                            ]
                        },
                        {
                            "verifier_signatures": [
                                "seNSZjDBI7P4730jLcMWp1cq5XjSoSao9KLmrevSz2voQ+92Fcf7HqcSIpiF5CLi"
                            ],
                            "signer_ids": [
                                "8f8d77ba98d1606b19fce8f6d35908bfc29ea171c02879162f6755c05e0ca1ee"
                            ]
                        }
                    ]
                },
                {
                    "block_id": "9735518c51b170372fc3d04a6e360fef8b7f987fdb5f1e0f84d9a065d21a550c",
                    "result_id": "328efa584043b0042b32b5e53c4d3c56988387440d94e9507d0a8d24a0f31e82",
                    "final_state": "\"e1fb1b23de61b1cd83f22ffbcdd14a1844332d2e730e01df519c43ea3565bc3a\"",
                    "aggregated_approval_signatures": [
                        {
                            "verifier_signatures": [
                                "tchbJMwDd92Ui2UXnGPL20rEsTrkHQIYsYPZDAgR7O/9lRZh/u/5Y/7JN9+AiMwP"
                            ],
                            "signer_ids": [
                                "0a29d8eb288d9bb0a0a4f2f9ff180ec83617659998ce363814048ec1683083e0"
                            ]
                        },
                        {
                            "verifier_signatures": [
                                "q07CVWjMP1ocBmShFFZ9K5SYIwBitF8g5gajVkOJ0t+O8twzbtW7SjWPY8NIWKyp"
                            ],
                            "signer_ids": [
                                "446ae6d5ebdf6bc45aee29ed3b8da8dcf155afff87296401a3c0a28206121bcc"
                            ]
                        }
                    ]
                }
            ]
        },
        "_expandable": {},
        "_links": {
            "_self": "/v1/blocks/7a7bc4dc574f67f0dc01a6c96cfbabe73ead23f76ac8130e620996779a500925"
        },
        "block_status": "BLOCK_SEALED"
    }
}
```