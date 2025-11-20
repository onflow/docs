---
title: Eliza Plugin Guide
description: Learn how to build Eliza plugins for your AI Agent on Flow
sidebar_position: 1
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

## Overview

Plugins are a powerful way to extend the functionality of your Eliza AI agents. This guide will walk you through the process of how to create custom plugins that can enhance your agent's capabilities, from simple utilities to complex integrations with external services. You'll learn how to leverage the plugin system to create modular and reusable components for your AI agents.

## Learning objectives

After you complete this tutorial, you will be able to:

- Create a new plugin repository from the template.
- Understand the plugin development workflow.
- Implement custom actions and services.
- Integrate plugins with your Eliza agent.
- Register and publish plugins to the Eliza Plugin Registry.
- Use dependency injection for better plugin architecture.

## Prerequisites

Before you get started with Eliza, make sure you have:

- [Node.js 23+] (we recommend that you use [nvm])
- [pnpm 9+]
- Git for version control
- A code editor (we recommend [VS Code], [Cursor] or [VSCodium])
- [Flow-cli] for Flow blockchain interaction.

> **Note for Windows users:** [WSL 2] is required.

## Quickstart

Follow the [Quickstart Guide] to set up your development environment.

## Plugin development

### Create a plugin repository from Template

Visit [Eliza Plugin Template] and click "Use this template" to create a new repository.

Or, you can create a new empty repository and copy the files from some examples at the [Eliza Plugins] organization.

:::note

Flow's Eliza plugin template uses Dependency Injection(`@elizaos-plugins/plugin-di`). You can learn more about the Dependency Injection in the [plugin's README.md].  It allows you can use `Class` instead of `Object` for your `Actions`, `Providers`, `Services`, and so on. **If you don't want to use it, you can follow the other examples in Eliza Plugins organiazation.**

:::

### Add the plugin repository to your Eliza project

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

Check the `agent/package.json` to make sure the plugin is added. You'll see something like this:

```json
{
    "dependencies": {
        "@elizaos-plugins/plugin-foo": "workspace:*"
    }
}
```

### Build the plugin

Build the plugin with the following command:

```bash
pnpm build --filter ./packages/plugin-foo

# Or build all packages
pnpm build
```

### Add the plugin to the `character.json` you want to use

Let's say you want to add the plugin to the `sample` character, which is `characters/sample.character.json`.

```json
{
    "name": "Sample",
    "plugins": [
        "@elizaos-plugins/plugin-foo"
    ]
}
```

:::warning

If you use Dependency Injection(`@elizaos-plugins/plugin-di`) in your plugin, remember to add it to the `postProcessors` field. The **`clients` field is deprecated** in the latest version of Eliza, so if you want to add clients, you also need to use `plugins` field.

:::

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

### Run the Eliza agent with your plugin

Run the Eliza agent to test the plugin.

```bash
pnpm start --character="characters/sample.character.json"

# Or with more debug logs
pnpm start:debug --character="characters/sample.character.json"
```

### Interact with the agent

Now, you're ready to start a conversation with your agent.

Open a new terminal window and run the client's http server.

```bash
pnpm start:client
```

## Plugin registration

You need to register your plugin in the [Eliza Plugin Registry] to make it available for other users.

Follow the guide there, modify the [index.json] file, and submit a pull request (PR) to the registry repository.

## Conclusion

In this tutorial, you've learned how to develop custom plugins for Eliza. You've gained experience with creating plugin repositories, implementing custom actions and services, integrating plugins with agents, and using dependency injection for better architecture.

Eliza's plugin system provides a powerful way to extend the functionality of your AI agents. With the knowledge gained from this tutorial, you can now develop more sophisticated plugins, create reusable components, and share your work through the plugin registry.

[Node.js 23+]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[nvm]: https://github.com/nvm-sh/nvm
[pnpm 9+]: https://pnpm.io/installation
[VS Code]: https://code.visualstudio.com/
[Cursor]: https://cursor.com/
[VSCodium]: https://vscodium.com
[Flow-cli]: https://developers.flow.com/tools/flow-cli
[WSL 2]: https://learn.microsoft.com/en-us/windows/wsl/install-manual
[Quickstart Guide]: ./index.md
[Eliza Plugin Template]: https://github.com/onflow/eliza-plugin-template
[Eliza Plugins]: https://github.com/elizaos-plugins
[plugin's README.md]: https://github.com/fixes-world/plugin-di
[Eliza Plugin Registry]: https://github.com/elizaos-plugins/registry
[index.json]: https://github.com/elizaos-plugins/registry/blob/main/index.json
