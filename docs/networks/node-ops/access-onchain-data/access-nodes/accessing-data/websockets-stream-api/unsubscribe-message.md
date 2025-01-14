---
title: Unsubscribe request message format
sidebar_label: Unsubscribing from topic
sidebar_position: 3
---

# Unsubscribe message format

Unsubscribe requests must be sent as JSON in text frames, one request per frame.

### Example of unsubscribe request

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786",
  "action": "unsubscribe"
}
```

### Example of successful response

```json
{
  "subscription_id": "fa770c92-a1f1-4375-9a7b-e13d9aac0786"
}
```

### Example of error response

```json
{
  "error": {
    "code": 404,
    "message": "subscription not found"
  }
}
```

### Request fields

| Name              | Type   | Mandatory | Description                                                           |
|-------------------|--------|-----------|-----------------------------------------------------------------------|
| `subscription_id` | UUID   | YES       | Unique identifier of the subscription                                 |
| `action`          | STRING | YES       | Action to perform. Must be `unsubscribe` to initiate a unsubscription |
