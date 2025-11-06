---
title: Flow Data Sources
sidebar_label: Flow Data Sources
sidebar_position: 1
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
  - comprehensive knowledge base
  - Flow ecosystem
---

# Flow Data Sources

Flow Data Sources is a comprehensive repository that automatically aggregates and formats Flow ecosystem content into Markdown files optimized for AI ingestion. This resource serves as a centralized knowledge base for AI tools, chatbots, and RAG (Retrieval-Augmented Generation) pipelines, containing the most current documentation, examples, and best practices for Flow blockchain development.

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/Lu6KrNvGthI" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
  ></iframe>
</div>

## Overview

The repository contains Python scripts that:

- Crawl Flow-related documentation sites, GitHub repositories, and discussions.
- Convert HTML content to Markdown format.
- Extract code examples from GitHub repositories.
- Capture community discussions and Q&A content.
- Merge all content into consolidated files for easy consumption.

Flow Data Sources automatically pulls content from:

- Official Flow documentation
- Cadence language documentation
- Flow CLI guides
- FCL (Flow Client Library) documentation
- Smart contract examples and tutorials
- Best practices and development patterns
- Community discussions and Q&A content

## Key Features

- **Daily Updates**: Content is automatically refreshed to ensure the latest information.
- **Structured Format**: All content is converted to Markdown for consistent processing.
- **Comprehensive Coverage**: Includes official documentation, code examples, and community discussions.
- **Optimized for AI**: Designed specifically for AI tools, chatbots, and RAG pipelines.

## Available Files

The repository provides several merged documentation files optimized for different use cases:

**Output Options:**

- [All Merged Content]: Complete content
- [Essentials Only]: Streamlined version only including official documentation and sample codes
- [Cadence Only]: Streamlined version only including Cadence related documentation and sample codes

### All Merged Documentation

- **File**: [all_merged.md](https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md).
- **Content**: Complete comprehensive documentation covering all aspects of Flow development.
- **Use Case**: Most comprehensive knowledge base for AI tools and complex development questions.
- **Size**: Very large file - may require powerful systems for processing.

### Essentials Merged Documentation

- **File**: [essentials_merged.md](https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/essentials_merged.md)
- **Content**: Core Flow and Cadence development essentials.
- **Use Case**: Lighter alternative for systems with resource constraints.
- **Size**: Smaller, more focused content for essential development needs.

### Cadence Only Documentation

- **File**: [cadence_docs_merged.md](https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/cadence_docs_merged.md)
- **Content**: Streamlined version only including Cadence related documentation and sample codes.
- **Use Case**: Focused on Cadence language development and smart contracts.
- **Size**: Cadence-specific content for specialized development needs.

## How to Use

You can integrate Flow Data Sources with:

- **ChatGPT Plugins**: Enhance Q&A capabilities with Flow-specific knowledge.
- **Custom Chatbots**: Power Discord/Telegram bots with accurate Flow information.
- **RAG Systems**: Index content in vector databases for semantic search.
- **Development Tools**: Provide context-aware assistance in IDEs like Cursor.

## Integration with AI Tools

Flow Data Sources is specifically designed to work seamlessly with various AI development tools:

### [Cursor Integration]

Add Flow Data Sources to your Cursor documentation by referencing the GitHub URL directly. This provides your AI assistant with up-to-date Flow knowledge. 

### [ChatGPT Custom GPTs]

Upload the merged documentation files to create specialized Flow development assistants that can answer complex questions about Cadence, Flow CLI, and ecosystem tools.

### [Claude Code Integration]

Reference Flow Data Sources in your CLAUDE.md files to ensure persistent, comprehensive Flow knowledge across all development sessions.


## Key Benefits

**Always Current**: Automatically updated to reflect the latest Flow ecosystem changes and documentation updates.

**Comprehensive Coverage**: Includes documentation from all major Flow development tools and resources in one place.

**AI-Optimized Format**: Structured specifically for optimal AI processing and accurate response generation.

**Multiple Formats**: Different file sizes to accommodate various system requirements and use cases.

**Community Driven**: Benefits from contributions across the entire Flow developer ecosystem.

## Best Practices

**Choose the Right File**: Use `all_merged.md` for comprehensive coverage or `essentials_merged.md` for lighter integration.

**Regular Updates**: Since the files are continuously updated, refresh your AI tool's knowledge base periodically.

**Combine with Live Docs**: Use Flow Data Sources alongside live documentation links for the most complete development assistance.

**Verify Critical Information**: While highly accurate, always verify critical implementation details against official sources.

## Accessing the Content

The merged documentation files are available at:

- [All Merged Content](https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md)
- [Essentials Only](https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/essentials_merged.md)
- [Cadence Only](https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/cadence_docs_merged.md)

For integration with AI tools like Cursor or ChatGPT, use the appropriate URL as described in the respective tutorials.

## Getting Started

1. **Identify Your Use Case**: Determine whether you need comprehensive or essential documentation coverage
2. **Choose Your AI Tool**: Select the AI platform you want to integrate with Flow Data Sources  
3. **Follow Integration Guides**: Use the specific tutorial for your chosen AI tool (ChatGPT, Gemini, Cursor, Claude Code, and so on.)
4. **Test and Validate**: Ask Flow-specific development questions to verify that the integration works.

The Flow Data Sources repository represents a powerful resource to enhance AI-assisted Flow development, and provides comprehensive and current knowledge that adapts to the rapidly evolving Flow ecosystem.

<!-- Reference-style links, will not render on page. -->

[Flow Data Sources Repository]: https://github.com/onflow/Flow-Data-Sources
[All Merged Content]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/all_merged.md
[Essentials Only]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/essentials_merged.md
[Cadence Only]: https://github.com/onflow/Flow-Data-Sources/blob/main/merged_docs/cadence_docs_merged.md
[Cursor Integration]: ./indexing-docs.md
[ChatGPT Custom GPTs]: ../llms/chatgpt.md
[Claude Code Integration]: ../llms/claude-code.md