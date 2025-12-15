---
title: Flow CLI
sidebar_label: Flow CLI
sidebar_position: 3
---

The **Flow Command Line Interface (CLI)** is a powerful tool that allows developers to seamlessly interact with the Flow blockchain across various environments, such as testnet, mainnet, and local development with the Flow Emulator. Designed for ease of use, the Flow CLI simplifies common blockchain tasks such as account and contract dependency management, sending transactions, querying chain state, smart contract deployment, and much more.

With Flow CLI, developers can:

- **Initialize Projects**: Quickly set up new Flow projects using the `flow init` command, which creates the necessary files and directories, sets up your project configuration, and installs any core contract dependencies.
- **Manage Contract Dependencies**: Use the [Dependency Manager] to install and manage smart contract dependencies effortlessly, which simplifies the integration of external contracts into your project.
- **Manage Accounts**: Create and manage Flow accounts, configure keys, and handle account-related operations.
- **Send Transactions**: Build, sign, and submit transactions to the Flow network, which allows for contract interaction and fund transfers.
- **Query Chain State**: Retrieve data from the Flow blockchain, such as account balances, event logs, and the status of specific transactions.
- **Deploy Smart Contracts**: Easily deploy and update Cadence smart contracts on any Flow environment (emulator, testnet, or mainnet).
- **Use the Emulator:** Set up a local Flow blockchain instance with the Flow emulator to test and debug smart contracts in a development environment before you deploy them on the network.
- **Interact with the [Flow Access API]**: Automate complex workflows with configuration files and command-line scripting, which allows for greater flexibility in continuous integration (CI) or custom development tools.
- **Access Flow’s Tooling Ecosystem**: Integrate Flow CLI with other developer tools like the [Cadence Extension for VSCode] to enhance your development experience.

The Flow CLI is essential for developers who want to build, test, and maintain decentralized applications on the Flow blockchain efficiently. It offers a feature-rich, user-friendly interface for both beginners and experienced blockchain developers.

## Installation

Follow [these steps] to install the Flow CLI on
macOS, Linux, and Windows.

## Create your first project

To get started, run:

```zsh
flow init
```

The `flow init` command gets you up and running with a new project setup in one command. Choose from scaffolds for scheduled transactions, DeFi actions, stablecoins, and more, or start with a basic Cadence project.

To learn more about Flow CLI commands and how to use them, see the [Commands documentation].

<!-- Reference-style links, will not render on page. -->

[Dependency Manager]: dependency-manager.md
[Flow Access API]: /http-api
[Cadence Extension for VSCode]: https://marketplace.visualstudio.com/items?itemName=onflow.cadence
[these steps]: ../flow-cli/install.md
[Commands documentation]: ./commands.md