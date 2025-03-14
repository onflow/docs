---
title: Common errors
sidebar_label: Common errors
sidebar_position: 7
---

This document outlines the possible errors returned from the WebSocket API. Understanding these errors will help properly handle error cases in client implementation.

## Error Structure

All errors returned by the WebSocket API follow this structure:

```json
{
  "subscriptionID": "string",
  "error": {
    "code": number,
    "message": "string"
  },
  "action": "string"
}
```

Where:
- `subscriptionID`: The ID of the subscription related to the error (if applicable)
- `error.code`: HTTP status code indicating the error type
- `error.message`: Human-readable description of the error
- `action`: The action that was being performed when the error occurred (`subscribe`, `unsubscribe`, or `list_subscription`)


### Message Format Errors

**Status Code:** 400 Bad Request

These errors occur when the server cannot parse or validate your incoming message.

| Error Message | Description | When to Expect |
|---------------|-------------|---------------|
| *"error reading message: ..."* | The raw message could not be read from the WebSocket connection | When sending malformed JSON or when the connection is disrupted |
| *"error parsing message: ..."* | The message was read but could not be processed | When the message structure doesn't match the expected format |
| *"error unmarshalling base message: ..."* | The message JSON could not be processed into the expected format | When required fields are missing or of incorrect type |
| *"error unmarshalling subscribe message: ..."* | The message JSON could not be processed into a subscribe request | When sending a malformed subscribe request |
| *"error unmarshalling unsubscribe message: ..."* | The message JSON could not be processed into an unsubscribe request | When sending a malformed unsubscribe request |
| *"error unmarshalling list subscriptions message: ..."* | The message JSON could not be processed into a list subscriptions request | When sending a malformed list subscriptions request |
| *"unknown action type: ..."* | The action specified in the message is not recognized | When specifying an action other than `subscribe`, `unsubscribe`, or `list_subscription` |

## Subscription-Related Errors

### Subscribe Action Errors

**Action:** `subscribe`

| Error Message | Status Code | Description | When to Expect |
|---------------|-------------|-------------|---------------|
| *"error creating new subscription: maximum number of subscriptions reached"* | 429 Too Many Requests | The maximum number of active subscriptions per connection has been reached | When trying to create more subscriptions than allowed by the server |
| *"error parsing subscription id: ..."* | 400 Bad Request | The provided subscription ID is invalid | When providing a malformed subscription ID |
| *"subscription ID is already in use: ..."* | 400 Bad Request | The provided subscription ID is already being used | When trying to reuse an existing subscription ID |
| *"error creating data provider: ..."* | 400 Bad Request | The subscription could not be created | When providing an invalid topic or arguments for your subscription |

### Unsubscribe Action Errors

**Action:** "unsubscribe"

| Error Message | Status Code | Description | When to Expect |
|---------------|-------------|-------------|---------------|
| *"error parsing subscription id: ..."* | 400 Bad Request | The provided subscription ID is invalid | When providing a malformed subscription ID |
| *"subscription not found"* | 404 Not Found | The specified subscription does not exist | When trying to unsubscribe from a non-existent subscription |

### Subscription Runtime Errors

**Action:** "subscribe"

| Error Message | Status Code | Description | When to Expect |
|---------------|-------------|-------------|---------------|
| *"internal error: ..."* | 500 Internal Server Error | An error occurred while processing your subscription | When there's an issue with the subscription after it was successfully created |

## Error Handling Best Practices

1. **Always check for errors in responses**: Every response from the WebSocket API should be checked for the presence of an error object.

2. **Handle subscription limits**: Be prepared to handle the case where the maximum number of subscriptions has been reached.

3. **Log detailed error information**: Log the complete error object for debugging purposes.

4. **Validate messages before sending**: Ensure your messages conform to the expected format to avoid parsing errors.