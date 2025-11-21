---
title: Use AI To Build On Flow
description: Learn how to use AI to build on the Flow Blockchain
sidebar_position: 4
keywords:
  - AI
  - ChatGPT
  - Cursor
  - Cursor Rules
  - Claude
  - AgentKit
  - Flow documentation
  - Cadence documentation
  - Flow development
  - Flow tools
  - Flow IDE
  - Flow setup
  - Flow configuration
  - Flow AI assistance
---

# Use AI To Build On Flow

Artificial Intelligence (AI) tools can significantly enhance your Flow development experience with intelligent assistance, code generation, and documentation access. This tutorial series will guide you through how to integrate various AI tools with Flow development to boost your productivity and code quality.

## What You'll Learn

In this tutorial series, you'll discover how to:

- Configure AI-powered development environments for Flow.
- Access Flow documentation directly from AI assistants.
- Generate Cadence and Solidity code with AI assistance.
- Debug and troubleshoot Flow applications with AI support.
- Leverage AI for testing and optimization.
- Build AI agents that interact with Flow using AgentKit.

# AI tutorials for Flow

## Use Claude Code with Flow

Master systematic AI-powered Flow development with Claude Code, a terminal-integrated coding assistant designed for iterative blockchain development. This comprehensive guide teaches you to implement a four-stage development methodology (Idea → Visualization → Planning → Build) while you leverage unlimited context windows, subagent capabilities, and persistent project memory. Learn to configure `CLAUDE.md` files for Flow-specific instructions, integrate MCP servers for blockchain interactions, and implement checkpoint-based workflows that ensure reliable smart contract development from emulator to mainnet deployment.

Tutorial: [Claude Code for Flow Development]

## Use Cursor with Flow

This guide details how you can set up the Cursor AI code editor with custom Flow knowledge bases, which transforms it into a specialized assistant to build powerful applications on the Flow network. When you provide the AI with direct access to the official Flow documentation, Cadence language references, and best-practice examples, you unlock a new tier of intelligent assistance that goes far beyond simple autocompletion

Tutorial: [Use Flow Knowledge Base in Cursor]

## Use ChatGPT with Flow

Build your own expert AI assistant and create a custom GPT specifically engineered to master the Flow blockchain and its Cadence smart contract language. This specialized tool will act as your personal pair programmer and provide highly accurate and context-aware answers to your most challenging development questions. By doing this, you don't just use a generic AI, you create a specialist trained on the exact documentation, code patterns, and best practices relevant to your work.

Tutorial: [Use Flow Knowledge Base in ChatGPT]

## Flow Data Sources

Learn about Flow Data Sources, a meticulously curated library designed to autonomously gather and structure information from the entire Flow ecosystem. This project systematically transforms a wide array of content into clean, AI-ready Markdown files, which establishes a unified source of truth. This collection acts as a foundational knowledge base, perfectly suited to power advanced applications such as custom chatbots and sophisticated Retrieval-Augmented Generation (RAG) systems.

Tutorial: [Data Sources]

## Eliza integration

Learn about how to use Eliza on Flow, a versatile framework you can use to construct sophisticated AI agents that communicate with users through natural language. This guide walks you through how to configure and launch an AI agent built with Eliza directly onto the Flow blockchain. You'll discover how to engineer intelligent agents that can comprehend and address user prompts, all while you harness the power of Flow's inherently secure and scalable onchain infrastructure.

Tutorial: [Eliza on Flow]

## Build AI agents with AgentKit

Learn how to build AI agents on Flow with AgentKit, a versatile and modular developer toolkit that is not tied to any single platform. It's engineered to dramatically accelerate the process of building, deploying, and refining AI agents by supplying pre-configured environments and a library of ready-to-use templates. This guide walks you through how to launch your own custom agent on Flow's EVM-compatible testnet, which lets you leverage the powerful combination of the Langchain framework and Anthropic's Claude large language model.

Tutorial: [Build AI Agents with AgentKit]

## MCP guides

Learn how to construct a custom Flow MCP (Model Context Protocol) server or use a current one to empower your AI tools. These tutorials guide you through how to equip your AI applications with the unique capability to directly interact with the Flow blockchain, which allows them to perform onchain operations and access real-time data.

Tutorial: [Flow MCP]

## Cadence rules

Learn how to establish and use Cursor Rules to transform your AI assistant into a dedicated Flow development expert. This process embeds your AI with persistent, foundational knowledge of essential topics, such as proper Cadence syntax, official NFT standards, project-specific configurations, and established development methodologies.

Tutorial: [Cadence Rules]

## Best practices

When you use AI tools with Flow development:

- Always verify AI-generated code against Flow documentation.
- Use specific prompts that reference Flow concepts and terminology.
- Combine AI assistance with your own knowledge of Flow architecture.
- Keep your AI tools updated with the latest Flow documentation.
- Test AI-generated code thoroughly before you deploy to production.
- Consider the security implications of AI agents that interact with your contracts.

## Next steps

After you complete these tutorials, you'll be equipped to leverage AI tools effectively in your Flow development workflow. We recommend that you explore our other tutorial series to deepen your knowledge of Flow development:

- [Cross-VM Apps][cross-vm-apps] - Build applications that integrate Flow EVM and Cadence.
- [Native VRF][native-vrf] - Implement verifiable random functions in your applications.
- [Token Launch][token-launch] - Create and launch tokens on Flow.

## Conclusion

Flow is the ideal platform for AI-enhanced blockchain development. The combination of Cadence's resource-oriented programming model, comprehensive AI ingestable documentation, and growing AI tooling support creates an unparalleled development experience. With tools like AgentKit, MCP servers, and AI-powered development environments, developers can build consumer applications faster than ever. This is why many believe that Flow is the best Blockchain to build on with AI.

<!-- Relative links. Will not render on the page -->

[Claude Code for Flow Development]: ./llms/claude-code.md
[Use Flow Knowledge Base in Cursor]: ./cursor/index.md
[Use Flow Knowledge Base in ChatGPT]: ./llms/chatgpt.md
[Data Sources]: ./cursor/flow-data-sources.md
[Eliza on Flow]: ./agents/eliza/index.md
[Build AI Agents with AgentKit]: ./agents/agentkit-flow-guide.md
[cross-vm-apps]: ../cross-vm-apps/introduction.md
[native-vrf]: ../native-vrf/index.md
[token-launch]: ../tokens/index.md
[Flow MCP]: ./mcp/index.md
[Cadence Rules]: ./cursor/cadence-rules.md
