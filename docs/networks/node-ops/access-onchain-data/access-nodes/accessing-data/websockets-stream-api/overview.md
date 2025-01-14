---
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Websockets Stream API

## Overview

The Stream API allows clients to receive real-time updates from the Flow blockchain via WebSocket connections. It
supports subscribing to various topics, such as blocks, events, and transactions, enabling low-latency access to live
data.

### Important Information

- **Endpoint**: The WebSocket server is available at:
  ```
  wss://api.flow.com/ws
  ```
- **Limits**:
    - Each connection supports up to 50 concurrent subscriptions. Exceeding this limit will result in an error.
    - TODO: list all limits here
- **Supported Topics**:
    - `blocks`
    - `block_headers`
    - `block_digests`
    - `events`
    - `transaction_statuses`
    - `account_statuses`
- **Notes**: Always handle errors gracefully and close unused subscriptions to maintain efficient connections.

---

## Setting Up a WebSocket Connection

Use any WebSocket client library to connect to the endpoint. Below is an example using JavaScript:

```javascript
const ws = new WebSocket('wss://api.flow.com/ws');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};
```

---

## Subscribing to Topics

To receive data from a specific topic, send a subscription request in JSON format over the WebSocket connection.

### Request Format

```json
{
  "subscription_id": "some-uuid-42",
  "action": "subscribe",
  "topic": "blocks",
  "arguments": {
    "start_block_height": "123456789"
  }
}
```

- **`subscription_id`**: A unique identifier for the subscription (UUID string). If omitted, the server generates one.
- **`action`**: The action to perform. Supported actions include: `subscribe`, `unsubscribe`, `list_subscriptions`.
- **`topic`**: The topic to subscribe to. See the supported topics in the Overview.
- **`arguments`**: Additional arguments for subscriptions, such as `start_block_height`, `start_block_id`, and others.

### Response Format

```json
{
  "subscription_id": "some-uuid-42"
}
```

---

## Unsubscribing from Topics

To stop receiving data from a specific topic, send an unsubscribe request.

### Request Format

```json
{
  "subscription_id": "some-uuid-42",
  "action": "unsubscribe"
}
```

### Response Format

```json
{
  "subscription_id": "some-uuid-42"
}
```

---

## Listing Active Subscriptions

You can retrieve a list of all active subscriptions for the current WebSocket connection.

### Request Format

```json
{
  "action": "list_subscriptions"
}
```

### Response Format

```json
{
  "subscriptions": [
    {
      "subscription_id": "uuid-1",
      "topic": "blocks",
      "arguments": {
        "start_block_height": "123456789"
      }
    },
    {
      "subscription_id": "uuid-2",
      "topic": "events",
      "arguments": {}
    }
  ]
}
```

---

## Errors Example

If a request is invalid or cannot be processed, the server responds with an error message.

### OK Response

```json
{
  "subscription_id": "some-uuid-42",
  "payload": {
    "id": "0x1234...",
    "height:": "123456789",
    "timestamp": "2025-01-02T10:00:00Z"
  }
}
```

### Error Response

```json
{
  "subscription_id": "some-uuid-42",
  "error": {
    "code": 500,
    "message": "Access Node failed"
  }
}
```

### Common Error Codes

- **400**: Invalid message format or arguments
- **404**: Subscription not found
- **500**: Internal server error

### Asynchronous environments

If you're working in an asynchronous environment, our Stream API ensures **in-order message delivery**.
You can leverage this feature to simplify your code and maintain consistency.

Additionally, you can use the `subscription_id` as a message identifier to manage subscriptions effectively.
