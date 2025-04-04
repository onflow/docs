---
title: Eliza Plugin Guide
description: Learn how to build Eliza plugins for your AI Agent on Flow
sidebar_position: 2
keywords:
  - AI  
  - AI Agent
  - Eliza
  - Eliza on Flow
  - Plugin
  - Flow Development
  - Quickstart
---

# Eliza Plugin Development Guide

Plugins are a powerful way to extend the functionality of your Eliza AI agents. This guide will walk you through the process of creating custom plugins that can enhance your agent's capabilities, from simple utilities to complex integrations with external services. You'll learn how to leverage the plugin system to create modular and reusable components for your AI agents.

## Learning Objectives

By the end of this tutorial, you will be able to:

- Create a new plugin repository from the template
- Understand the plugin development workflow
- Implement custom actions and services
- Integrate plugins with your Eliza agent
- Register and publish plugins to the Eliza Plugin Registry
- Use dependency injection for better plugin architecture

## Prerequisites

Before getting started with Eliza, ensure you have:

- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (using [nvm](https://github.com/nvm-sh/nvm) is recommended)
- [pnpm 9+](https://pnpm.io/installation)
- Git for version control
- A code editor ([VS Code](https://code.visualstudio.com/), [Cursor](https://cursor.com/) or [VSCodium](https://vscodium.com) recommended)
- [Flow-cli](https://developers.flow.com/tools/flow-cli) for Flow blockchain interaction.

> **Note for Windows Users:** [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install-manual) is required.

## Quickstart

Please follow the [Quickstart Guide](./index.md) to set up your development environment.

## Plugin Development

### Create a Plugin repository from Template

Visit [Eliza Plugin Template](https://github.com/onflow/eliza-plugin-template) and click on the "Use this template" button to create a new repository.

Or you can create a new empty repository and copy the files from some examples at [Eliza Plugins](https://github.com/elizaos-plugins) organization.

> Note: Flow's Eliza plugin template is using Dependency Injection(`@elizaos-plugins/plugin-di`), you can learn more about the Dependency Injection in the [plugin's README.md](https://github.com/fixes-world/plugin-di).  It allows you can use `Class` instead of `Object` for your `Actions`, `Providers`, `Services`, and etc. **If you don't want to use it, you can follow the other examples in Eliza Plugins organiazation.**

### Add the Plugin repository to your Eliza project

Let's say you created a repository named `username/plugin-foo`.

Use submodules to add the plugin repository to your Eliza project.

```bash
git submodule add https://github.com/username/plugin-foo.git packages/plugin-foo
```

Change the package's name in the plugin's `package.json` to `@elizaos-plugins/plugin-foo`.

```json
{
    "name": "@elizaos-plugins/plugin-foo",
}
```

Add the plugin to agent's `package.json`

```bash
pnpm add @elizaos-plugins/plugin-foo@'workspace:*' --filter ./agent
```

Check the `agent/package.json` to ensure the plugin is added, you should see something like this:

```json
{
    "dependencies": {
        "@elizaos-plugins/plugin-foo": "workspace:*"
    }
}
```

### Build the Plugin

Build the plugin using the following command:

```bash
pnpm build --filter ./packages/plugin-foo

# Or build all packages
pnpm build
```

### Add Plugin to the `character.json` you want to use

Let's say you want to add the plugin to the `sample` character which is `characters/sample.character.json`.

```json
{
    "name": "Sample",
    "plugins": [
        "@elizaos-plugins/plugin-foo"
    ]
}
```

> Note: If you are using Dependency Injection(`@elizaos-plugins/plugin-di`) in your plugin, remember to add it to the `postProcessors` field. And **`clients` field is deprecated** in the latest version of Eliza, so if you want to add clients you also need to use `plugins` field.

```json
{
    "name": "Sample",
    "plugins": [
        "@elizaos-plugins/plugin-foo",
        "@elizaos-plugins/client-discord"
    ],
    "postProcessors": [
        "@elizaos-plugins/plugin-di"
    ]
}
```

### Run the Eliza Agent with your Plugin

Run the Eliza agent to test the plugin.

```bash
pnpm start --character="characters/sample.character.json"

# Or with more debug logs
pnpm start:debug --character="characters/sample.character.json"
```

### Interact with the Agent

Now you're ready to start a conversation with your agent.

Open a new terminal window and run the client's http server.

```bash
pnpm start:client
```

## Plugin Registration

You need to register your plugin in the [Eliza Plugin Registry](https://github.com/elizaos-plugins/registry) to make it available for other users.

Please follow the guide there, modify the [index.json](https://github.com/elizaos-plugins/registry/blob/main/index.json) and submit a PR to the registry repository.
