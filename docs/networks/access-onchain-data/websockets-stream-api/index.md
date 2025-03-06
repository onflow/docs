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
    - Mainnet: `wss://rest-mainnet.onflow.org/v1/ws`
    - Testnet: `wss://rest-testnet.onflow.org/v1/ws`
- **Limits**:
    - Each connection supports up to 20 concurrent subscriptions. Exceeding this limit will result in an error.
    - Each subscription may provide up to 20 responses per second. 
    - After 1 minute of inactivity (no data sent or received) the connection is closed. 

- **Supported Topics**:
    - `block_digests`
    - `block_headers`
    - `blocks`  
    - `events`
    - `account_statuses`
    - `transaction_statuses`
    - `send_and_get_transaction_statuses`
    
- **Notes**: Always handle errors gracefully and close unused subscriptions to maintain efficient connections.

---

## Setting Up a WebSocket Connection

Use any WebSocket client library to connect to the endpoint. Below is an example using JavaScript:

```javascript
const ws = new WebSocket('wss://rest-mainnet.onflow.org/ws');

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
  "subscription_id": "some-id-42",
  "action": "subscribe",
  "topic": "blocks",
  "arguments": {
    "block_status": "sealed",
    "start_block_height": "123456789"
  }
}
```

- **`subscription_id`**(optional): A unique identifier for the subscription (a string with maximum length constraint of 20 characters). If omitted, the server generates one.
- **`action`**: The action to perform. Supported actions include: `subscribe`, `unsubscribe`, `list_subscriptions`.
- **`topic`**: The topic to subscribe to. See the supported topics in the Overview.
- **`arguments`**: Additional topic specific arguments for subscriptions, such as `start_block_height`, `start_block_id`, and others.

### Successful Response Format

```json
{
  "subscription_id": "some-id-42",
  "action": "subscribe"
}
```

---

## Unsubscribing from Topics

To stop receiving data from a specific topic, send an unsubscribe request.

### Request Format

```json
{
  "subscription_id": "some-id-42",
  "action": "unsubscribe"
}
```

### Successful Response Format

```json
{
  "subscription_id": "some-id-42",
  "action": "unsubscribe"
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

### Successful Response Format

```json
{
  "subscriptions": [
    {
      "subscription_id": "some-id-1",
      "topic": "blocks",
      "arguments": {
        "block_status": "sealed",
        "start_block_height": "123456789"
      }
    },
    {
      "subscription_id": "some-id-2",
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
  "subscription_id": "some-id-42",
  "topic": "block_digests",
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
  "subscription_id": "some-id-42",
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

If you're working in an asynchronous environment, the Streaming API ensures **first-in first-out** message processing, 
so responses will be returned in the same order the requests were received over the connection.
You can leverage this feature to simplify your code and maintain consistency.

Additionally, you can specify a custom `subscription_id` in the subscribe request to easily identify the correct response. It must not be an empty string and must follow a maximum length constraint of 20 characters.