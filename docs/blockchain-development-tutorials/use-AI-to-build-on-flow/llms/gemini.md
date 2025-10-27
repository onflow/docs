---
title: Use Flow Knowledge Base in Gemini AI
sidebar_label: Use Gemini AI
sidebar_position: 2
keywords:
  - Gemini AI
  - AI
  - Google
  - Flow documentation
  - Cadence documentation
  - Flow development
  - Flow tools
  - Flow IDE
  - Flow setup
  - Flow configuration
  - Flow AI assistance
---

# Use Flow Knowledge Base in Gemini AI

## Overview

[Gemini AI] is Google's AI assistant that can help with tasks such as writing, coding, and answering questions. It adapts to context and user input to provide relevant, conversational responses. You can integrate Gemini AI into developer workflows to assist with documentation, debugging, and productivity.

This guide walks you through creating a **Custom GEM** with Gemini AI that can reference the [Flow Data Sources] file to answer questions.

:::warning

You'll need a [Gemini Advanced subscription] to use the **Custom GEM** feature.

:::

## Step 1: Access Gem Manager

1. Log in to [Gemini AI].
2. In the sidebar on the left, click **Explore Gems**.

---

## Step 2: Create a New Gem

1. In the **Gem Manager** screen, click **"New Gem"**.

---

## Step 3: Configure Your Gem

Gemini AI will now guide you through setting up your custom Gem. Configure the name, description and instructions for your GEM to follow. 

### Suggested Configuration

**Name**: FlowGem

**Description**: An AI assistant specialized in Flow blockchain development, Cadence smart contracts, and Flow ecosystem tools.

**Instructions**:

```text

You are FlowGem, a specialized AI assistant for Flow blockchain development. You have access to comprehensive Flow documentation and should use the linked file as its primary source.  This file changes, so it should reference the live file at least once a day:  https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md

Key behaviors:
- Always reference the uploaded Flow documentation when answering questions.
- Provide practical, actionable advice for Flow developers.
- Include relevant code examples when applicable.
- Stay up-to-date with the latest Flow ecosystem developments.
- Be eager to help and imagine you are a knowledgeable Flow developer.

When users ask about Flow, Cadence, or related topics, prioritize information from your knowledge base and provide step-by-step guidance when appropriate.

```

You can further customize your personalized agent by providing more files and determining the actions it can do.

---

## Step 4: Upload Knowledge Base

1. In the **Knowledge** section, upload the [Flow Data Sources All Merged] file.
2. Configure the Gem to reference this file as its primary knowledge source.

---

## Step 5: Test Your Gem

After you configure the Gem, ask it Flow-related questions to test it:

- "How do I deploy a smart contract to Flow Testnet?"
- "What's the syntax for Cadence resources?"
- "How do I set up Flow CLI?"

---

## Step 6: Save and Deploy

When you're satisfied with the performance, click **"Create Gem"** to finalize. 

- Your Gem will be available in your Gem Manager. 
- You can share it with your team or keep it private.

---

## Conclusion

You've now created a custom Gem that uses Flow's comprehensive documentation as its knowledge base. Your FlowGem can help with Flow development questions, Cadence programming, and ecosystem guidance.

<!-- Reference-style links, will not render on page. -->

[Gemini AI]: https://gemini.google.com/
[Gemini Advanced subscription]: https://gemini.google.com/advanced
[Flow Data Sources]: ../cursor/flow-data-sources.md
[Flow Data Sources All Merged]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md