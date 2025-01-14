---
title: Subscribe request message format
sidebar_label: Subscribing to topic
sidebar_position: 2
---

# Subscribe request format

Subscribe requests must be sent as JSON in text frames, one request per frame.

### Example of subscribe request

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786",
  "action": "subscribe",
  "topic": "block_digests",
  "parameters": {
    "start_block_height": "99,416,580"
  }
}
```

### Example of successful response

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786"
}
```

### Example of failed response

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786",
  "error": {
    "code": 400,
    "message": "invalid message"
  }
}
```

### Example of messages provided by subscription (if successful)

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786",
  "payload": {
    "id": "0x1234...",
    "height:": "123456789",
    "timestamp": "2025-01-02T10:00:00Z"
  }
}
```

### Example of messages provided by subscription (if error)

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786",
  "error": {
    "code": 500,
    "message": "access node is not responsible"
  }
}
```

### Request fields:

| Name              | Type   | Mandatory | Description                                                                                |
|-------------------|--------|-----------|--------------------------------------------------------------------------------------------|
| `subscription_id` | UUID   | NO        | Optional unique identifier for the subscription. Server will generate one if omitted       |
| `action`          | STRING | YES       | Action to perform. Must be `subscribe` to initiate a subscription                          |
| `topic`           | STRING | YES       | The topic to subscribe to, such as `blocks`, `block_digests`, etc.                         |
| `parameters`      | STRING | NO        | Additional parameters for the subscription, such as `start_block_id`, `start_block_height` |

You can use `subscription_id` as a client-generated identifier to track responses asynchronously.
If you don't provide `subscription_id`, the server will generate one and include it in the response.

The order of params is not significant.
