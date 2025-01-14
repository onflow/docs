---
title: List subscriptions request message format
sidebar_label: Listing subscriptions
sidebar_position: 4
---

# List subscriptions message format

List subscriptions requests must be sent as JSON in text frames, one request per frame.
This message is different from other as it doesn't require you to provide subscription ID.
Thus, the response for this message is different too.

### Example of request

```json
{
  "action": "list_subscriptions"
}
```

### Example of response

```json
{
  "subscriptions": [
    {
      "subscription_id": "uuid-1",
      "topic": "blocks",
      "parameters": {
        "start_block_height": "123456789"
      }
    },
    {
      "subscription_id": "uuid-2",
      "topic": "events",
      "parameters": {}
    }
  ]
}
```

If there are no active subscriptions, `subscriptions` array will be empty.

### Request fields

| Name     | Type   | Mandatory | Description                                                                             |
|----------|--------|-----------|-----------------------------------------------------------------------------------------|
| `action` | STRING | YES       | Action to perform. Must be `list_subscriptions` to initiate a list subscription request |
