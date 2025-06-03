---
title: Send and get transaction statuses
sidebar_label: Send and get transaction statuses
sidebar_position: 8
---

Sends a transaction and provides updates on its status changes.

## Example Request

```json
{
  "subscription_id": "some-id-7",
  "action": "subscribe",  
  "topic": "send_and_get_transaction_statuses"
  "arguments": {
    "arguments": [],
    "authorizers": ["dba05362251g43g4"],
    "envelope_signatures": [
      {
        "address": "dba05362251g43g4",
        "key_index": "0",
        "signature": "PJPVEOCtPKubTEpPqd4zrrSXo1RhpABAMDuzIchgBje8gyh04XuWY4f/tu+c0llDhOU/5sQBokeOTdygaS6eTQ=="
      }
    ],
    "gas_limit": "1000",
    "payer": "dba05362251g43g4",
    "proposal_key": {
      "address": "dba05362251g43g4",
      "key_index": "0",
      "sequence_number": "0"
    },
    "reference_block_id": "817d7c1d2c13a4bd37c182747a4116b45cd175c0ba4878071c33f0f278b37dd7",
    "script": "CgkJCXRyYW5zYWN0aW9uIHsKCQkJCXByZXBhcmUoYWNjOiAmQWNjb3VudCkge30KCQkJCWV4ZWN1dGUgewoJCQkJCWxvZygidGVzdCIpCgkJCQl9CgkJCX0KCQk="
  }
}
```  

| Name                  | Type   | REQUIRED | Description                                                               |
| --------------------- | ------ | -------- | ------------------------------------------------------------------------- |
| `script`              | STRING | YES      | Base64-encoded content of the Cadence script.                             |
| `arguments`           | LIST   | YES      | A list of arguments, each encoded as Base64.                              |
| `reference_block_id`  | STRING | YES      | BlockID for the transaction's reference block |
| `gas_limit`           | STRING | YES      | The limit on the amount of computation a transaction can perform.         |
| `payer`               | STRING | YES      | The 8-byte address of an account.                                         |
| `proposal_key`        | OBJECT | YES      | A required object representing the proposal key.                          |
| `authorizers`         | LIST   | YES      | A list of authorizers, each represented as a hexadecimal-encoded address. |
| `payload_signatures`  | LIST   | NO       | A list of Base64-encoded signatures.                                      |
| `envelope_signatures` | LIST   | YES      | A list of Base64-encoded signatures.                                      |

## Example Response

```json
{
  "subscription_id": "some-id",
  "topic": "send_and_get_transaction_statuses",
  "payload": {
    "transaction_result": {
      "block_id": "7ad167602487665db095f7cb0b95139e5dcaf3ad2479ee4d14cade35b7d4bbdc",
      "collection_id": "d0855ed45c16be2831ab9892ec8a9ddfd10a0e01e683466971cfd87c759bf7d1",
      "execution": "Failure",
      "status": "Sealed",
      "status_code": 1,
      "error_message": "[Error Code: 1009] error caused by: 1 error occurred:\n\t* transaction verification failed: [Error Code: 1006] invalid proposal key: public key 0 on account dba05362251g43g4 does not have a valid signature: [Error Code: 1009] invalid envelope key: public key 0 on account dba05362251g43g4 does not have a valid signature: signature is not valid\n\n",
      "computation_used": "0",
      "events": [],
      "_links": {
        "_self": "/v1/transaction_results/92014de98466a6304ecd821c95ee2612e248c22419d243e6e3ff4d138dffde04"
      }
    },
    "message_index": 3
  }
}
```