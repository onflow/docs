---
title: Why Flow
sidebar_label: Why Flow
sidebar_position: 1
---

# Why Flow

Flow is a fast, decentralized, and developer-friendly blockchain designed to be the foundation for a new generation of games, apps, and [digital assets] that power them. It is based on a unique, [multi-role architecture], and designed to [scale without sharding], allowing for massive improvements in speed and throughput while preserving a developer-friendly, ACID-compliant environment.  It natively allows development of smart contracts in the powerful [Cadence] language, and also supports full [EVM] equivalence with contracts written in Solidity.

## What Makes Flow Unique

### Flow Blockchain

- **Multi-role architecture:** Flow's [multi-role architecture] allows the network to [scale without sharding] to serve billions of users without reducing the decentralization of consensus.
- **True Fast Finality**: For most other networks, it takes minutes, [a day], or even [a week] to reach hard finality - the point in which a transaction cannot be reversed.  On Flow, this [happens in 20 seconds], without compromising security.
- **Native VRF**: Flow provides [onchain randomness] at the protocol level.  Instead of implementing complex setup and [paying $10+ USD per number], simply call the built-in function.
- **Native Account Abstraction**: Flow has protocol-native [account abstraction].  All accounts are smart accounts, supporting scripting, multiple keys, multi-signature transactions, and walletless onboarding with social logins.
- **Gasless Transactions**: One of the three built-in [signer roles] for a Flow transaction is the _signer_.  In other words, having one account sign a transaction and another pay for that transaction is simple.
- **EVM Equivalence**: The [Cadence] VM is powerful enough to allow other VMs to run inside of it, almost like a Docker Container.  The first one integrated in this way is [EVM], because of the comfort of many builders with Solidity and the EVM RPC API.

### Flow Cadence

- **Resource-oriented programming:** Smart contracts on Flow are natively written in [Cadence], an easier and safer programming language for crypto assets and apps.
- **Developer ergonomics:** This network is designed to maximize developer productivity. Examples range from upgradeable smart contracts and built-in logging support to the Flow Emulator.
- **Consumer onboarding:** Flow was designed for mainstream consumers, with payment onramps catalyzing a safe and low-friction path from fiat to crypto.

### Flow EVM

- **Speed, Cost, and Compatibility**: Flow EVM can **already** run all of your audited Solidity contracts at **less than 1 second, less than 1 cent per transaction** (for transfers, etc.).
- **Bridge from Other EVM Networks**: You can [bridge] hundreds of assets from dozens of chains to Flow.
- **VM Token Bridge**: Assets can be bridged between Flow Cadence and Flow EVM easily with the VM token bridge.
- **Access to Cadence**: You can access Cadence features and contracts from Flow EVM to take advantage of features such as native VRF, higher computation for lower cost, and any asset on Cadence Flow.

:::tip

If you're already comfortable with Solidity, be sure to check out how [Cadence] works in our [Guide for Solidity Developers]!

:::

The following chapters summarize the content in this section. Read on more for details.

## App Development

The [Flow App Quickstart](./guides/flow-app-quickstart.md) covers the Flow core concepts, including:

- **App Client:** The app client is the interface through which users interact with your app. Web and mobile applications are typical examples of app clients.
- **Smart Contract:** A smart contract is a collection of code deployed to a permanent location on the blockchain that defines the core logic for a dApp.
- **User Account:** A user account is a record on the blockchain that stores the digital assets owned by a single user.
- **Transaction:** A transaction is a code submitted to the blockchain that mutates the state of one or more user accounts and smart contracts.
- **User Wallet:** A user wallet is software or hardware that controls access to a user's account on the blockchain.
- **Script:** A script is a request made to the blockchain that returns information about the state of your dApp's smart contracts.
- **Flow Client Library (FCL):** The Flow Client Library is a framework that provides a standard interface to connect client applications and user wallets.

## Core Contracts

The Flow blockchain implements core functionality using its own smart contract language, [Cadence](https://cadence-lang.org/docs/language/). The core functionality is split into a set of contracts, so-called [core contracts](../build/core-contracts/index.md):

- **Fungible Token:** The FungibleToken contract implements the Fungible Token Standard. It is the second contract ever deployed on Flow.
- **Flow Token:** The FlowToken contract defines the FLOW network token.
- **Flow Fees:** The FlowFees contract is where all the collected flow fees are gathered.
- **Service Account:** tracks transaction fees and deployment permissions and provides convenient methods for Flow Token operations.
- **Staking Table:** The FlowIDTableStaking contract is the central table that manages staked nodes, delegation, and rewards.
- **Epoch Contract:** The FlowEpoch contract is the state machine that manages Epoch phases and emits service events.

## FLOW Token

The [FLOW](../build/core-contracts/03-flow-token.md) token is the native currency for the Flow network. Developers and users can use FLOW to transact on the network. Developers can integrate FLOW directly into their apps for peer-to-peer payments, service charges, or consumer rewards. FLOW can be held, transferred, or transacted peer-to-peer.

## Technical Background

- The [Flow Technical Primer](https://www.onflow.org/primer) is a great place to start to understand how Flow works.
- The [Three technical whitepapers](https://www.onflow.org/technical-paper) cover the unique innovation behind the Flow blockchain network in-depth.

## Tokenomics

- To understand more about Flow's Token Economics, and the **FLOW token**, you can read the [Flow Token Economics](https://www.onflow.org/flow-token-economics) guide.
- FLOW tokens are Flow's native Fungible Token. To learn more about how to work with them in your applications, go [here](../build/core-contracts/03-flow-token.md).

## More Concepts

If you're a developer, looking to get a better understanding of working with Flow in your applications, use the 👈 left-hand navigation to explore the concepts pages.

[digital assets]: https://www.onflow.org/post/flow-blockchain-cadence-programming-language-resources-assets
[multi-role architecture]: https://www.onflow.org/primer
[onchain randomness]: https://developers.flow.com/build/advanced-concepts/randomness
[paying $10+ USD per number]: https://docs.chain.link/vrf/v2-5/billing
[scale without sharding]: https://www.onflow.org/post/flow-blockchain-multi-node-architecture-advantages
[a day]: https://docs.zksync.io/zk-stack/concepts/finality#finality-on-zksync-era
[a week]: https://docs.optimism.io/stack/rollup/overview#fault-proofs
[happens in 20 seconds]: https://developers.flow.com/build/basics/transactions#flow
[signer roles]: https://developers.flow.com/build/basics/transactions#signer-roles
[Cadence]: https://cadence-lang.org/
[EVM]: https://flow.com/upgrade/crescendo/evm
[Guide for Solidity Developers]: https://cadence-lang.org/docs/solidity-to-cadence
[account abstraction]: https://flow.com/account-abstraction
[bridge]: https://developers.flow.com/ecosystem/bridges
