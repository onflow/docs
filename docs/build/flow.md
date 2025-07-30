---
title: Why Flow
sidebar_label: Why Flow
sidebar_position: 1
description: Flow is the best blockchain for consumer apps & web3 apps. It's scalable, EVM-equivalent, with native account abstraction and a unique multi-role architecture.
keywords:
  - Flow blockchain
  - Best Web3 Apps
  - Best Cosnumer Apps
  - blockchain scaling
  - multi-role architecture
  - Cadence language
  - EVM equivalence
  - account abstraction
  - blockchain security
  - Flow features
  - blockchain trilemma
  - Flow EVM
  - smart contracts
  - Flow token
  - blockchain architecture
  - decentralization
  - consumer apps
  - MEV
  - miner-extractable value
  - maximum extractable value
---

# Why Flow is the Best for Consumer Apps

Flow was designed to be the best blockchain for consumer apps and Web3 as a whole. Flow was built by consumer-facing, onchain app developers to solve the problem of building consumer-facing, onchain apps. Dieter Shirley, Chief Architect of Flow and co-author of the [ERC-721 NFT standard] calls it:

> **A computer that anyone can use, everyone can trust, and no one can shut down.**

Much of the protocol design is based on lessons learned from building web3 applications while working at [Dapper Labs], particularly [CryptoKitties] - the first onchain game to reach [widespread popularity]. The game went viral, then [struggled under its own success] when it caused so much traffic that Ethereum network itself was overwhelmed by the load.

The design of Flow was guided by the need to alleviate this burden while creating the best experience possible for both developers and users. The blockchain network of the future must be able to handle millions of users while upholding the key pillars of decentralization:

1. Verifiability
1. Predictability/Reliability
1. Equitable Access for All
1. Permissionless Composability
1. Interoperability
1. Security

Flow solves the [blockchain trilemma] and represents the next generation of blockchain technology. It's built to enable seamless consumer-scale apps without compromising decentralization or user experience and is the chosen blockchain network for [NBA Top Shot], [NFL All Day], [Mattel Creations], and [Disney Pinnacle].

## What Makes Flow Unique

Flow is a fast, decentralized, and developer-friendly blockchain designed to be the foundation for a new generation of games, apps, and the [digital assets] that power them. It is based on a unique [multi-role architecture], and designed to [scale without sharding], allowing for massive improvements in speed and throughput while preserving a developer-friendly, ACID-compliant environment. It natively allows development of smart contracts in the powerful [Cadence] language, and also supports full [Ethereum Virtual Machine (EVM)] equivalence with contracts written in Solidity.

### Flow Blockchain

- **Multi-role architecture:** The [multi-role architecture] of Flow allows the network to [scale without sharding] to serve billions of users without reducing the decentralization of consensus and verification.
- **True Fast Finality**: For most other networks, it takes minutes, [a day], or even [a week] to reach hard finality - the point in which a transaction cannot be reversed. On Flow, the median time for finality is [under 10 seconds], without compromising security.
- **Native VRF**: Flow provides [onchain randomness] at the protocol level. Instead of implementing a complex setup and [paying $10+ USD per number], simply call the built-in function.
- **MEV Resistance**: Flow is designed to [ensure equitable access] by resisting MEV. Maximum Extractable Value, also know as Miner-Extractable Value (MEV), is a practice common in other blockchains in which the builder of a block can profit at your expense by manipulating where and how your transaction is included.
- **Consumer Onboarding:** Flow was designed for mainstream consumers, with payment onramps catalyzing a safe and low-friction path from fiat to crypto.
- **EVM Equivalence**: The [Cadence] Virtual Machine (VM) is powerful enough to allow other VMs to run inside of it, almost like a Docker Container. The first one integrated in this way is [EVM] and the EVM RPC API.
- **Efficient Gas Costs**: The Flow blockchain is extremely efficient, allowing apps to do more computation at lower costs.

### Flow Cadence

- **Native Account Abstraction**: Flow has protocol-native [account abstraction]. All accounts are smart accounts, supporting scripting, multiple keys, multi-signature transactions, and walletless onboarding with social logins.
- **Gasless Transactions**: Flow has multiple [signing roles] for each transaction. Most notably, the payer can be set independently of the authorizer. In other words, having one account sign a transaction and another pay for that transaction is a built-in feature.
- **Security:** Smart contracts on Flow are natively written in [Cadence], an easier, safer, and more secure programming language for crypto assets and apps. It's the first high-level, [resource-oriented] programming language.
- **Developer Ergonomics:** The Flow network is designed to maximize developer productivity. Examples range from upgradeable smart contracts to built-in logging support to the Flow Emulator.

### Flow EVM

- **Speed, Cost, and Compatibility**: Flow EVM can already run all of your audited Solidity contracts at an average of less than 1 cent per transaction ([usually way less!]). Unlike L2 solutions, Flow EVM reaches true finality in seconds - not in [a week]. 😳
- **Bridge from Other EVM Networks**: You can [bridge] hundreds of assets from dozens of chains to Flow.
- **VM Token Bridge**: Assets can be bridged between Flow Cadence and Flow EVM easily and atomically with the VM token bridge. Assets can even be bridged **and used** in a **single** transaction, allowing full composability between the EVM and Cadence environments.
- **Access to Cadence**: Access Cadence features and contracts from Flow EVM to take advantage of native [VRF], higher computation for lower cost, and any asset on Cadence Flow. You can also build [cross-vm apps] on top of the wagmi/viem/RainbowKit stack, enabling batched transactions and more.
- **EVM Equivalence:** Flow EVM is truly _EVM Equivalent_, not just _EVM Compatible_. It runs exactly the same as EVM mainnet, which means builders won't run into "minor" variances or endless "quirks" when they try to integrate. If it works on Ethereum Mainnet, it will work with Flow EVM.

## Learning Shortcuts

To get a complete picture on how to build on Flow, follow the 👈 sidebar top to bottom. This path will give you the most thorough onboarding experience.

If you like to jump right into the deep end of the pool, take a look below for direct links to advanced topics!

### Learn Cadence

[Cadence] is a modern smart contract programming language designed to work with Flow. Learning a new language is an investment, but you'll find that Cadence is safer, more explicit, and less dangerous than other blockchain languages. Plus, it unlocks the full power of the Flow protocol!

:::tip

If you're already comfortable with Solidity, be sure to check out how [Cadence] works in our [Guide for Solidity Developers]!

:::

### Build with the EVM

Not ready to take the plunge and learn [Cadence]? Try out "EVM++" by deploying existing [EVM] contracts to see that Flow EVM is faster and cheaper than nearly every other EVM solution without compromising on security.

Deploying on Flow EVM also gives your Solidity contracts access to many Flow Cadence features, such as native [VRF].

### Getting Started with App Development

The [Getting Started] tutorial covers everything you need to know to build a Flow Cadence application:

- Setting up your local development environment (it's fast and easy!)
- Deploying and interacting with Flow Cadence contracts
- Building a frontend that can interact with smart contracts written by you, or other developers

### Core Contracts

The Flow blockchain implements core functionality using its own smart contract language, [Cadence]. The core functionality is split into a set of contracts, called the [core contracts]:

- **Fungible Token:** The FungibleToken contract implements the Fungible Token Standard. It is the second contract ever deployed on Flow.
- **Flow Token:** The FlowToken contract defines the FLOW network token.
- **Flow Fees:** The FlowFees contract is where all the collected Flow fees are gathered.
- **Service Account:** The FlowServiceAccount contract tracks transaction fees and deployment permissions and provides convenient methods for Flow Token operations.
- **Staking Table:** The FlowIDTableStaking contract is the central table that manages staked nodes, delegation, and rewards.
- **Epoch Contract:** The FlowEpoch contract is the state machine that manages Epoch phases and emits service events.

### FLOW Token

The [FLOW] (or $FLOW) token is the native currency for the Flow network. Developers and users can use FLOW to transact on the network. Developers can integrate FLOW directly into their apps for peer-to-peer payments, service charges, or consumer rewards. FLOW can be held, transferred, or transacted peer-to-peer.

- To understand more about Flow Token Economics and the FLOW token, read the [Flow Token Economics] guide.
- FLOW tokens are the native Fungible Token on Flow. To learn more about how to work with them in your applications, review the [FLOW] article.

### Technical Background

- The [Flow Technical Primer] is a great place to start to understand how Flow works.
- The [Three technical whitepapers] cover the unique innovation behind the Flow blockchain network in-depth.

<!-- Reference-style links, does not render on page -->

[ERC-721 NFT standard]: https://github.com/ethereum/eips/issues/721
[CryptoKitties]: https://www.cryptokitties.co/
[Dapper Labs]: https://www.dapperlabs.com/
[struggled under its own success]: https://spectrum.ieee.org/cryptokitties
[blockchain trilemma]: https://coinmarketcap.com/academy/glossary/blockchain-trilemma
[NBA Top Shot]: https://nbatopshot.com/
[NFL All Day]: https://nflallday.com/
[Mattel Creations]: https://creations.mattel.com/pages/virtual
[Disney Pinnacle]: https://disneypinnacle.com/
[digital assets]: https://www.flow.com/post/flow-blockchain-cadence-programming-language-resources-assets
[widespread popularity]: https://www.cnn.com/style/article/cryptokitty-blockchain/index.html
[multi-role architecture]: https://www.flow.com/primer
[onchain randomness]: ./advanced-concepts/randomness.md
[paying $10+ USD per number]: https://docs.chain.link/vrf/v2-5/billing
[ensure equitable access]: ./basics/mev-resistance.md
[scale without sharding]: https://www.flow.com/post/flow-blockchain-multi-node-architecture-advantages
[a day]: https://docs.zksync.io/zk-stack/concepts/finality#finality-on-zksync-era
[a week]: https://docs.optimism.io/stack/rollup/overview#fault-proofs
[usually way less!]: https://evm.flowscan.io/stats
[under 10 seconds]: ./basics/transactions.md#flow
[signing roles]: ./basics/transactions.md#signer-roles
[Cadence]: https://cadence-lang.org/
[resource-oriented]: https://flow.com/post/resources-programming-ownership
[Ethereum Virtual Machine (EVM)]: https://flow.com/upgrade/crescendo/evm.md
[EVM]: https://flow.com/upgrade/crescendo/evm.md
[Guide for Solidity Developers]: https://cadence-lang.org/docs/solidity-to-cadence
[account abstraction]: https://flow.com/account-abstraction
[bridge]: ../ecosystem/bridges.md
[cross-vm apps]: ../tutorials/cross-vm-apps/index.md
[Getting Started]: ./getting-started/contract-interaction.md
[core contracts]: ./core-contracts/index.md
[FLOW]: ./core-contracts/03-flow-token.md
[Flow Technical Primer]: https://www.flow.com/primer
[Three technical whitepapers]: https://www.flow.com/technical-paper
[Flow Token Economics]: https://www.flow.com/flow-token-economics
[VRF]: ../tutorials/native-vrf/vrf-in-solidity.md
