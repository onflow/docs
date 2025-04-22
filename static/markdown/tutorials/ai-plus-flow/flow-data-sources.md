---
title: Flow Data Sources
sidebar_label: Flow Data Sources
sidebar_position: 3
keywords:
  - Flow Data Sources
  - AI knowledge base
  - Flow documentation
  - Cadence documentation
  - Flow development
  - Flow tools
  - Flow AI assistance
  - RAG
  - Retrieval-Augmented Generation
---

# Flow Data Sources

Flow Data Sources is a comprehensive repository that automatically aggregates and formats Flow ecosystem content into Markdown files optimized for AI ingestion. This resource serves as a centralized knowledge base for AI tools, chatbots, and RAG (Retrieval-Augmented Generation) pipelines.

## Overview

The repository contains Python scripts that:

- Crawl Flow-related documentation sites, GitHub repositories, and discussions
- Convert HTML content to Markdown format
- Extract code examples from GitHub repositories
- Capture community discussions and Q&A content
- Merge all content into consolidated files for easy consumption

## Key Features

- **Daily Updates**: Content is automatically refreshed to ensure the latest information
- **Structured Format**: All content is converted to Markdown for consistent processing
- **Comprehensive Coverage**: Includes official documentation, code examples, and community discussions
- **Optimized for AI**: Designed specifically for AI tools, chatbots, and RAG pipelines
- **Output Options**:
  - `all_merged.md`: Complete content
  - `essentials_merged.md`: Streamlined version only including official documentation and sample codes.
  - `cadence_docs_merged.md`: Streamlined version only including Cadence related documentation and sample codes.

## How to Use

Flow Data Sources can be integrated with:

- **ChatGPT Plugins**: Enhance Q&A capabilities with Flow-specific knowledge
- **Custom Chatbots**: Power Discord/Telegram bots with accurate Flow information
- **RAG Systems**: Index content in vector databases for semantic search
- **Development Tools**: Provide context-aware assistance in IDEs like Cursor

## Accessing the Content

The merged documentation files are available at:

- [All Merged Content][all-merged]
- [Essentials Only][essentials-merged]
- [Cadence Only][cadence-merged]

For integration with AI tools like Cursor or ChatGPT, use the appropriate URL as described in the respective tutorials:

- [Use Flow Knowledge Base in Cursor][cursor] - Learn how to set up Cursor with Flow knowledge bases
- [Use Flow Knowledge Base in ChatGPT][chatgpt] - Create a custom GPT that understands Flow and Cadence

[all-merged]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md
[essentials-merged]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/essentials_merged.md
[cadence-merged]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/cadence_docs_merged.md
[cursor]: ./cursor/index.md
[chatgpt]: ./chatgpt/index.md