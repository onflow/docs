---
title: Connecting to WebSockets via Postman UI
sidebar_label: Connecting to WebSockets via Postman UI
sidebar_position: 6
---

This tutorial will guide you through connecting to a WebSocket using Postman and sending a subscription message.

## Step 1: Open Postman

Ensure you have Postman installed and opened on your system. If you don’t have it yet, download it from [Postman’s official website](https://www.postman.com/downloads/).

## Step 2: Create a New WebSocket Request

1. In Postman, click on **File** > **New...** > **WebSocket**.
![pe_1](<assets/pe_1.png>)
2. Enter the WebSocket URL in **Enter URL** field : `wss://rest-mainnet.onflow.org/v1/ws` or `wss://rest-testnet.onflow.org/v1/ws`
3. Click **Connect** button to establish the WebSocket connection.
![pe_2](<assets/pe_2.png>)

## Step 3: Send a Subscription Message

1. Once connected, go to the **Messages** tab.
2. Enter the JSON message into the text box. In this example the [digests block subscription](./supported-topics/block_digests_topic.md) will be established. For other available topics check [Supported topics page](./supported-topics/index.md).
3. Click **Send** to subscribe to the WebSocket topic.
![pe_3](<assets/pe_3.png>)

## Step 4: View Responses

- After sending the message, you should start receiving responses in the **Response** bottom tab.
- Each message received from the server will be displayed in real-time.

![pe_4](<assets/pe_4.png>)

## Step 5: Disconnect

- When you are done, click **Disconnect** to close the WebSocket connection.

## Troubleshooting

- Ensure WebSocket URL is correct and active.
- In case of an error validate your JSON message for any syntax errors before sending and check correctness of all arguments on [Supported topics page](./supported-topics/index.md). 

Congratulations! You have successfully connected to a WebSocket server using Postman and sent a subscription message.