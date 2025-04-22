---
title: Transaction statuses
sidebar_label: Transaction statuses
sidebar_position: 7
---

Provides updates on transaction status changes for already sent transactions.

## Example Request

```json
{
    "subscription_id": "some-id",
    "action": "subscribe",
    "topic": "transaction_statuses",
    "arguments": {
        "tx_id": "fe3784095bc194dca02e4b14e7e6a1e0519d10b7bc907453e5b5dc276259a106"
    }
}
```  

### Request Arguments

| Name    | Type   | Required | Description                                              |
| ------- | ------ | -------- | -------------------------------------------------------- |
| `tx_id` | STRING | YES      | The ID of the transaction to monitor for status changes. |

## Example Response

```json
{
    "subscription_id": "some-id",
    "topic": "transaction_statuses",
    "payload": {
        "transaction_result": {
            "block_id": "b668e472c404e471cba8bab5246ca98f90d8492e80c81aae4cccbfae6e734aad",
            "collection_id": "efdcbf3b2b02b20cdfa7f2669034da05e44232ea68e41d3ed14756472081f9b9",
            "execution": "Success",
            "status": "Sealed",
            "status_code": 0,
            "error_message": "",
            "computation_used": "0",
            "events": [
                {
                    "type": "A.0b2a3299cc857e29.TopShot.Withdraw",
                    "transaction_id": "fe3784095bc194dca02e4b14e7e6a1e0519d10b7bc907453e5b5dc276259a106",
                    "transaction_index": "4",
                    "event_index": "0",
                    "payload": "eyJ2YWx1ZSI6eyJpZCI6IkEuMGIyYTMyOTljYzg1N2UyOS5Ub3BTaG90LldpdGhkcmF3IiwiZmllbGRzIjpbeyJ2YWx1ZSI6eyJ2YWx1ZSI6IjQwOTQ3MzE4IiwidHlwZSI6IlVJbnQ2NCJ9LCJuYW1lIjoiaWQifSx7InZhbHVlIjp7InZhbHVlIjp7InZhbHVlIjoiMHg2N2Q5OTk5MWMxMzRlODQ4IiwidHlwZSI6IkFkZHJlc3MifSwidHlwZSI6Ik9wdGlvbmFsIn0sIm5hbWUiOiJmcm9tIn1dfSwidHlwZSI6IkV2ZW50In0K"
                },
                // Full response is cut down due to its large size; see `_links` for the full response. ...
                {
                    "type": "A.f919ee77447b7497.FlowFees.FeesDeducted",
                    "transaction_id": "fe3784095bc194dca02e4b14e7e6a1e0519d10b7bc907453e5b5dc276259a106",
                    "transaction_index": "4",
                    "event_index": "22",
                    "payload": "eyJ2YWx1ZSI6eyJpZCI6IkEuZjkxOWVlNzc0NDdiNzQ5Ny5GbG93RmVlcy5GZWVzRGVkdWN0ZWQiLCJmaWVsZHMiOlt7InZhbHVlIjp7InZhbHVlIjoiMC4wMDAwNDc5OCIsInR5cGUiOiJVRml4NjQifSwibmFtZSI6ImFtb3VudCJ9LHsidmFsdWUiOnsidmFsdWUiOiIxLjAwMDAwMDAwIiwidHlwZSI6IlVGaXg2NCJ9LCJuYW1lIjoiaW5jbHVzaW9uRWZmb3J0In0seyJ2YWx1ZSI6eyJ2YWx1ZSI6IjAuMDAwMDAxODgiLCJ0eXBlIjoiVUZpeDY0In0sIm5hbWUiOiJleGVjdXRpb25FZmZvcnQifV19LCJ0eXBlIjoiRXZlbnQifQo="
                }
            ],
            "_links": {
                "_self": "/v1/transaction_results/fe3784095bc194dca02e4b14e7e6a1e0519d10b7bc907453e5b5dc276259a106"
            }
        },
        "message_index": 3
    }
}
```