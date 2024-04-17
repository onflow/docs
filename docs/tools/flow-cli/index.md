---
sidebar_position: 2
title: Flow CLI
sidebar_label: Flow CLI
---

## Installation

Follow [these steps](../flow-cli/install.md) to install the Flow CLI on 
macOS, Linux, and Windows.

## Create your first project
The Flow CLI is Flow’s primary development and testing environment, similar to Hardhat and Foundry for developers familiar with writing in Solidity. With the Flow CLI super commands, initiating your new project becomes effortless. Execute the `flow setup` command and make a selection from a variety of accessible scaffolds.

```
> flow setup hello-world --scaffold

🔨 General Scaffolds
   [1] Empty Cadence Project - Empty project containing only basic folder structure and flow.json configuration.
   [2] Simple Cadence Project - Scaffold contains required folder structure as well as some example Cadence code.
   [3] Cadence NFT Project - Scaffold contains the ExampleNFT sample NFT contract.
   [4] Hybrid Custody Project - Starter for exploring & implementing Hybrid Custody.

💻 Web Scaffolds
   [5] FCL Web Dapp - Simple TypeScript web application using next.js, FCL, and Cadence.

📱 Mobile Scaffolds
   [6] Swift iOS simple example - iOS example demonstrating usage of FCL and Flow interactions.
   [7] Android simple example - Android example demonstrating usage of FCL and Flow interactions.
   [8] FCL React Native Mobile Dapp - React Native (Expo) mobile dapp example demonstrating FCL and Flow interactions.

🏀 Unity Scaffolds
   [9] Simple Unity - Simple example demonstrating how to interact with the Flow network using Unity SDK.
   [10] Mobile Unity Game - Example words game built on Flow using the Unity SDK.
```

After you have created your new project you can proceed writing contracts and by running `dev` 
command the CLI will make sure they are deployed to the Flow emulator for you. Flow emulator is 
a simplified version of Flow network you can use locally to develop. 

So proceed by starting the emulator: 

```
> flow emulator
```

After creating your new project you are ready to start writing contracts. The Flow emulator is a simplified local simulation of the Flow network. Running the dev command in the CLI ensures that the contracts are deployed to the Flow emulator for you.

And then the flow dev:
```
> flow dev
```

### Next steps

As part of the next steps you can read more about [flow dev command](super-commands.md).

