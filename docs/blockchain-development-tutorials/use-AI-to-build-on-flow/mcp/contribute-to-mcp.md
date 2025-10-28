---
title: Contribute to Flow MCP
sidebar_label: Contribute to Flow MCP
sidebar_position: 2
keywords:
  - AI
  - MCP
  - MCP server
  - Flow MCP
  - Model Context Protocol
  - Flow AI assistance
  - Build MCP server
---

# Contribute to Flow MCP

## Overview

This tutorial will guide you through the process of contributing to the Flow MCP server. The [Model Context Protocol (MCP)] is an open standard developed by Anthropic that allows AI applications to interact seamlessly with external tools, systems, and data sources.  

## Learning Objectives

After you complete this tutorial, you should be able to:

- Set up and build the Flow MCP server development environment.
- Create and register a new Action Tool, including schema, handler, and tests.
- Test and validate the functionality of a new Action Tool within the MCP system.
- Submit a complete pull request that follows Flow MCP contribution guidelines.

## Prerequisites

- [Bun] - the JavaScript runtime.
- [Flow MCP server] - the Flow MCP server repository.

## Installation

1. Fork the [Flow MCP server] repository.

2. Clone the repository:

    ```bash
    git clone https://github.com/your-username/flow-mcp.git
    ```

3. Install the dependencies:

    ```bash
    bun install
    ```

4. Build the project:

    ```bash
    bun build
    ```

## Create new Action Tool for Flow MCP

1. Create a new folder in the `src/tools` directory:

    ```bash
    mkdir src/tools/your-tool-name
    ```

2. Create and implement the `index.ts`, `schema.ts`, and `your-tool.test.ts` files, which is the entry point, schema, and test file for the new tool respectively.

    The `export` of `index.ts` file should be a `ToolRegistration` object, which is the registration of the new tool.

    ```ts
    type ToolRegistration<T> = {
      name: string;
      description: string;
      inputSchema: z.ZodSchema;
      handler: (args: T) => CallToolResult | Promise<CallToolResult>;
    };
    ```

    If you want to add new Cadence files for your new tool, you can add them in the `src/cadence` directory. The `bun` will compile the Cadence files into `String`, so the dedicated Cadence files will help the project to be more organized.

    And we recommended that you add a test for your new tool in the `src/tools/your-tool-name/your-tool.test.ts` file.

3. Add a prompt export in the `src/prompts` directory which is used to confirm that MCP clients can understand the new tool. You can refer to the existing tools for examples.

4. Add your new tool to the `src/tools/index.ts` file.

    ```ts
    export const createTools = (): ToolRegistration<any>[] => {
      return [
        // ... other tools
        yourTool,
      ];
    };
    ```

5. Run the test to confirm your new tool works as expected:

    ```bash
    bun test
    ```

6. Commit and push your changes to your forked repository, and create a pull request.

We will review your pull request and merge it if it's ready.

[Flow MCP server]: https://github.com/outblock/flow-mcp
[Bun]: https://bun.sh/
[Model Context Protocol (MCP)]: https://modelcontextprotocol.io/introduction
