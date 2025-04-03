---
title: Build Custom AI Agents on Flow with Agentkit
description: Learn how to configure and deploy AI agents on the Flow testnet using Agentkit, Langchain, and the EVM-compatible Flow environment.
sidebar_label: Using Agentkit on Flow
sidebar_position: 1
---

# Getting Started with Agentkit on Flow

Agentkit is an ecosystem-agnostic modular developer toolkit that lets you rapidly build, deploy, and iterate on AI agents using pre-configured environments and ready-to-use templates.

In this guide, you'll set up your own custom agent running on **Flow’s EVM-compatible testnet**, powered by **Langchain** and **Anthropic’s Claude** LLM.

---

## 🚀 Quickstart

Open your terminal and run:

```bash
npm create onchain-agent@latest
```

Follow the interactive setup:

1. Type `y` to proceed, then press **Enter**.
2. Select your framework: **Langchain**
3. Choose your network: **EVM**
4. Set the custom Chain ID:
   - `545` for **Flow Testnet**
   - `747` for **Flow Mainnet**
5. JSON-RPC endpoint:  
   ```txt
   https://testnet.evm.nodes.onflow.org
   ```

---

## 🔧 Project Setup

Once your scaffold is ready:

```bash
cd onchain-agent
npm install
```

Now open the project in your preferred IDE (e.g. Cursor).

### Environment Configuration

1. Create a `.env.local` file (or edit the one generated).
2. Add your API keys (we’ll use **Anthropic** here).

> 💡 You can also use OpenAI, DeepSeek, or any other supported LLM.

### Get Your Anthropic API Key

- Head to [Anthropic Console](https://console.anthropic.com/dashboard)
- Create an account and **purchase credits**
- Click **Create Key**, name it, and copy the API key
- Add this to your `.env.local`:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Wallet Setup with MetaMask

1. Add [Flow Testnet](https://developers.flow.com/evm/using) to MetaMask
2. Use the [Faucet](https://faucet.flow.com/fund-account) to fund your wallet
3. Get your private key:
   - Click the `...` menu in MetaMask > **Account Details**
   - Enter your password, copy the private key
4. Add it to `.env.local`:

```env
PRIVATE_KEY=your_private_key_here
```

Your `.env.local` should look something like this:

```env
PRIVATE_KEY=...
ANTHROPIC_API_KEY=...
```

Now run:

```bash
mv .env.local .env
npm run dev
```

Visit your local server:

```
http://localhost:3000
```

---

## 🧠 Configure Your LLM

If your agent doesn't respond yet — no worries! You still need to configure your **LLM and client libraries**.

### Choose a Model

Langchain supports many LLMs ([full list here](https://python.langchain.com/docs/integrations/llms/)).

For this example, we’ll use **Anthropic's `claude-3-5-haiku-20241022`**, a lightweight and affordable model. Alternatively, [DeepSeek](https://deepseek.com/) is highly recommended for budget-friendly usage.

### Update `create-agent.ts`

Change the default model from OpenAI:

```ts
const llm = new ChatOpenAI({ model: "gpt-4o-mini" });
```

To Anthropic:

```ts
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({ model: "claude-3-5-haiku-20241022" });
```

Install the package:

```bash
npm install @langchain/anthropic
```

---

## 🌊 Configure Flow and Viem Wallet

### Update the Faucet Provider Logic

Change this:

```ts
const canUseFaucet = walletProvider.getNetwork().networkId == "base-sepolia";
```

To:

```ts
const canUseFaucet = walletProvider.getNetwork().networkId == "flow-testnet";
```

### Add Flow Context Message to Agent

This gives your agent context about the Flow testnet:

```ts
const flowContextMessage = canUseFaucet ? `
  You are now operating on the Flow blockchain testnet using a Viem wallet. Flow is a fast, decentralized, and
  developer-friendly blockchain designed for NFTs, games, and apps. 

  Key facts about Flow:
  - Flow uses a proof-of-stake consensus mechanism
  - The native token is FLOW
  - Flow has a unique multi-role architecture for high throughput
  - The testnet is EVM-compatible (works with MetaMask + Viem)
  - RPC URL: https://testnet.evm.nodes.onflow.org
  - Chain ID: 545

  Your wallet address is \${await walletProvider.getAddress()}.
` : '';
```

Then inject it into the agent message modifier:

```ts
agent = createReactAgent({
  llm,
  tools,
  checkpointSaver: memory,
  messageModifier: `
    You are a helpful agent interacting with the Flow blockchain testnet using a Viem wallet.
    Flow testnet supports EVM, so you can use Ethereum-compatible tools.
    \${flowContextMessage}

    Before your first action, check the wallet details. If you see a 5XX error, ask the user to try again later.
    If a task is unsupported, let the user know and point them to CDP SDK + Agentkit at:
    https://docs.cdp.coinbase.com or https://developers.flow.com.

    Be concise, helpful, and avoid repeating tool descriptions unless asked.
  `,
});
```

---

## ✅ You’re Done!

You now have a working AI agent connected to Flow testnet using Agentkit!

You can send faucet tokens to your wallet and start testing smart contract interactions or on-chain workflows.

---

## 🧪 Starter Project

Want to skip the setup?

> 🔗 [Fork the Flow Agentkit Starter](https://github.com/Aliserag/flow-agentkit-starter)

This starter includes all necessary config to start building immediately on Flow.

---

## 📚 Resources

- [Agentkit Docs](https://docs.cdp.coinbase.com/agentkit)
- [Flow EVM Guide](https://developers.flow.com/evm/using)
- [Langchain LLM Integrations](https://python.langchain.com/docs/integrations/llms/)
- [Anthropic Model Comparison](https://docs.anthropic.com/en/docs/about-claude/models/all-models#model-comparison-table)

---

Happy hacking on Flow! 💧
