---
sidebar_position: 1
---

# Introduction to Flow

Flow is a fast, decentralized, and developer-friendly blockchain designed to be the foundation for a new generation of games, apps, and the [digital assets](https://www.onflow.org/post/flow-blockchain-cadence-programming-language-resources-assets) that power them. It is based on a unique, [multi-role architecture](https://www.onflow.org/primer), and designed to [scale without sharding](https://www.onflow.org/post/flow-blockchain-multi-node-architecture-advantages), allowing for massive improvements in speed and throughput while preserving a developer-friendly, ACID-compliant environment.

## What makes Flow unique

- **Multi-role architecture:** Flow's node architecture allows the network to scale to serve billions of users without sharding or reducing the decentralization of consensus.
- **Resource-oriented programming:** Smart contracts on Flow are written in Cadence, an easier and safer programming language for crypto assets and apps.
- **Developer ergonomics:** This network is designed to maximize developer productivity. Examples range from upgradeable smart contracts and built-in logging support to the Flow Emulator.
- **Consumer onboarding:** Flow was designed for mainstream consumers, with payment onramps catalyzing a safe and low-friction path from fiat to crypto.

The following chapters summarize the content in this section. Read on more for details.

## App Development

The [development guide](../tutorials/intro.md) covers the Flow core concepts, including:

- **App Client:** The app client is the interface through which users interact with your app. Web and mobile applications are typical examples of app clients.
- **Smart Contract:** A smart contract is a collection of code deployed to a permanent location on the blockchain that defines the core logic for a dApp.
- **User Account:** A user account is a record on the blockchain that stores the digital assets owned by a single user.
- **Transaction:** A transaction is a code submitted to the blockchain that mutates the state of one or more user accounts and smart contracts.
- **User Wallet:** A user wallet is software or hardware that controls access to a user's account on the blockchain.
- **State Query:** A state query is a request made to the blockchain that returns information about the state of your dApp's smart contracts.
- **Flow Client Library (FCL):** The Flow Client Library is a framework that provides a standard interface to connect client applications and user wallets.

## Core Contracts

The Flow blockchain implements core functionality using its own smart contract language, Cadence. The core functionality is split into a set of contracts, so-called [core contracts](../build/core-contracts/index.md):

- **Fungible Token:** The FungibleToken contract implements the Fungible Token Standard. It is the second contract ever deployed on Flow.
- **Flow Token:** The FlowToken contract defines the FLOW network token.
- **Flow Fees:** The FlowFees contract is where all the collected flow fees are gathered.
- **Service Account:** tracks transaction fees and deployment permissions and provides convenient methods for Flow Token operations.
- **Staking Table:** The FlowIDTableStaking contract is the central table that manages staked nodes, delegation, and rewards.
- **Epoch Contract:** The FlowEpoch contract is the state machine that manages Epoch phases and emits service events.

## FLOW Token

The [FLOW](../build/core-contracts/03-flow-token.md) token is the native currency for the Flow network. Developers and users can use FLOW to transact on the network. Developers can integrate FLOW directly into their apps for peer-to-peer payments, service charges, or consumer rewards. FLOW can be held, transferred, or transacted peer-to-peer.


## Technical Background

- The Flow [Technical Primer](https://www.onflow.org/primer) is a great place to start to understand how Flow works.
- The [3 technical whitepapers](https://www.onflow.org/technical-paper) are covering the unique innovation behind the Flow blockchain network in-depth.

## Tokenomics

- To understand more about Flow's Token Economics, and the **FLOW token**, you can read the [Flow Token Economics](https://www.onflow.org/flow-token-economics) guide.
- FLOW tokens are Flow's native Fungible Token. To learn more about how to work with them in your applications, go [here](../build/core-contracts/03-flow-token.md)

## More Concepts

If you're a developer, looking to get a better understanding of working with Flow in your applications,
use the 👈 left-hand navigation to explore the concepts pages.