---
title: Unsubscribe request message format
sidebar_label: Unsubscribing from topic
sidebar_position: 4
---

# Unsubscribe message format

Unsubscribe requests must be sent as JSON in text frames, one request per frame.

### Example of unsubscribe request

```json
{
  "subscription_id": "some-id-1",
  "action": "unsubscribe"
}
```

### Example of successful response

```json
{
  "subscription_id": "some-id-1",
  "action": "unsubscribe"
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

| Name              | Type   | Required | Description                                                           |
|-------------------|--------|----------|-----------------------------------------------------------------------|
| `subscription_id` | STRING | YES      | Unique identifier of the subscription                                 |
| `action`          | STRING | YES      | Action to perform. Must be `unsubscribe` to initiate a unsubscription |
