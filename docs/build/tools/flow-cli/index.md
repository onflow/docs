---
title: Flow CLI
sidebar_label: Flow CLI
sidebar_position: 3
---

The **Flow Command Line Interface (CLI)** is a powerful tool that enables developers to seamlessly interact with the Flow blockchain across various environments, including testnet, mainnet, and local development using the Flow Emulator. Designed for ease of use, the Flow CLI simplifies common blockchain tasks such as managing accounts and contract dependencies, sending transactions, querying chain state, deploying smart contracts, and much more.

With Flow CLI, developers can:

- **Initialize Projects**: Quickly set up new Flow projects using the `flow init` command, which creates the necessary files and directories, sets up your project configuration, and installs any core contract dependencies.
- **Manage Contract Dependencies**: Use the [Dependency Manager](dependency-manager.md) to install and manage smart contract dependencies effortlessly, simplifying the integration of external contracts into your project.
- **Manage Accounts**: Create and manage Flow accounts, configure keys, and handle account-related operations.
- **Send Transactions**: Build, sign, and submit transactions to the Flow network, allowing for contract interaction and fund transfers.
- **Query Chain State**: Retrieve data from the Flow blockchain, including account balances, event logs, and the status of specific transactions.
- **Deploy Smart Contracts**: Easily deploy and update Cadence smart contracts on any Flow environment (emulator, testnet, or mainnet).
- **Use the Emulator:** Set up a local Flow blockchain instance with the Flow emulator to test and debug smart contracts in a development environment before deploying them on the network.
- **Interact with the [Flow Access API](/http-api)**: Automate complex workflows using configuration files and command-line scripting, which allows for greater flexibility in continuous integration (CI) or custom development tools.
- **Access Flow’s Tooling Ecosystem**: Integrate Flow CLI with other developer tools like the [Cadence Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=onflow.cadence) to enhance your development experience.

The Flow CLI is essential for developers looking to build, test, and maintain decentralized applications on the Flow blockchain efficiently, offering a feature-rich, user-friendly interface for both beginners and experienced blockchain developers.

## Installation

Follow [these steps](../flow-cli/install.md) to install the Flow CLI on
macOS, Linux, and Windows.

## Create Your First Project

Create a new Flow project:

```zsh
flow init
```

The `flow init` command gets you up and running with a new project setup in one command. Choose from scaffolds for scheduled transactions, DeFi actions, stablecoins, and more, or start with a basic Cadence project.

To learn more about Flow CLI commands and how to use them, please refer to the [Commands documentation](./commands.md).
