---
title: Why Flow - The Best Blockchain for Consumer Apps and Web3 Development
sidebar_label: Why Flow
sidebar_position: 1
description: Flow is the best blockchain for onchain consumer apps and Web3 apps. It's scalable, EVM-equivalent, with native account abstraction and a unique multi-role architecture supporting both Cadence and Solidity development.
keywords:
  - Flow blockchain
  - Best Web3 Apps
  - Best Consumer Apps
  - blockchain scaling
  - multi-role architecture
  - Cadence language
  - Solidity language
  - EVM equivalence
  - Flow Virtual Machine
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
  - VM bridge
  - cross-vm development
---

# Why Flow is the best for consumer apps and Web3 development

Flow is the blockchain designed to be the [best platform for consumer apps] and Web3 as a whole. Built by consumer-facing, onchain app developers to solve the problem of building consumer-facing, onchain apps, Flow supports two powerful programming languages: **Cadence** and **Solidity**.

Dieter Shirley, Chief Architect of Flow and co-author of the [ERC-721 NFT standard], calls Flow:

> **_A computer that anyone can use, everyone can trust, and no one can shut down_**

Much of the protocol design is based on lessons learned from building Web3 applications while working at [Dapper Labs], particularly [CryptoKitties] — the first onchain game to reach [widespread popularity]. The game went viral, then [struggled under its own success] when it caused so much traffic that the Ethereum network itself was overwhelmed by the load.

The design of Flow was guided by the need to alleviate this burden while creating the best experience possible for both developers and users. The blockchain network of the future must be able to handle millions of users while upholding the key pillars of decentralization:

1. Verifiability
1. Predictability/Reliability
1. Equitable Access for All
1. Permissionless Composability
1. Interoperability
1. Security

Flow solves the [blockchain trilemma] and represents the next generation of blockchain technology. It's built to enable seamless consumer-scale apps without compromising decentralization or user experience, and is the chosen blockchain network for [NBA Top Shot], [NFL All Day], [Mattel Creations], and [Disney Pinnacle].

## What makes Flow unique

Flow is a fast, decentralized, and developer-friendly blockchain designed to be the foundation for a new generation of games, apps, and the [digital assets] that power them. It is based on a unique [multi-role architecture] and designed to [scale without sharding], allowing for massive improvements in speed and throughput while preserving a developer-friendly, ACID-compliant environment.

### Dual language architecture

Flow is unique in supporting two powerful programming languages for smart contract development:

- **Cadence**: A modern programming language developed by smart contract application builders.
- **Solidity**: The industry-standard language for EVM development, fully supported on Flow with full EVM equivalence.

EVM and Cadence environments both use FLOW as gas for transactions and are connected by a native bridge that allows seamless and cheap communication between them. Fungible and non-fungible tokens can also be seamlessly transferred between environments using the native VM token bridge, taking place instantly in a single atomic transaction.

This means developers can choose the language that best fits their needs while maintaining full interoperability between both environments.

### Cadence development on Flow

[Cadence] is a modern programming language developed by smart contract application builders for smart contract developers:

- **Advanced Transactions**: [Transactions] in Cadence smart contracts are not simply calls to existing functions on already deploy contracts. Instead, transactions are code written in Cadence that can **call any function (with appropriate access) on any smart contract by any author**, all in a single, atomic transaction with a single user signature.
- **AI Ready**: Cadence transactions have [pre- and post-conditions] that clearly define the inputs to a transactions, such as the tokens that may be withdrawn, and outcomes, such as collectibles that must be purchased. With these definitions, Cadence transactions of immense complexity can be written safely. Regardless of code in the actual execution, the user can be sure that they will get what they expected and only pay the price they authorized.
- **Data Availability**: Similarly, any author can construct a **view** function to access any public data on any smart contract without needing the author of that smart contract to have anticipated the need to view that data or reliance a provider to cache it and make it available.
- **Native account abstraction**: Cadence transactions have protocol-native [account abstraction]. All accounts are smart accounts, supporting scripting, multiple keys, multi-signature transactions, and walletless onboarding with social logins.
- **Gasless transactions**: Cadence transactions have multiple [signing roles] for each transaction. Most notably, the payer can be set independently of the authorizer. In other words, having one account sign a transaction and another pay for that transaction is a built-in feature.
- **Security**: Smart contracts on Flow are natively written in , an easier, safer, and more secure programming language for crypto assets and apps. It's the first high-level, [resource-oriented] programming language.
- **Developer ergonomics**: The Flow network is designed to maximize developer productivity. Examples range from upgradeable smart contracts to built-in logging support to the Flow Emulator.

### Solidity development on Flow EVM

Flow EVM provides the best EVM experience available anywhere:

- **Speed, cost, and compatibility**: Flow EVM can already run all of your audited Solidity contracts at an average of less than 1 cent per transaction ([usually way less!]). Unlike L2 solutions, Flow EVM reaches true finality in seconds — not in [a week].
- **Bridge from Other EVM networks**: You can [bridge] hundreds of assets from dozens of chains to Flow.
- **VM token bridge**: Assets can be bridged between Flow Cadence and Flow EVM easily and atomically with the VM token bridge. Assets can even be bridged **and used** in a **single** transaction, allowing full composability between the EVM and Cadence environments.
- **Access to Cadence features**: Access Cadence features and contracts from Flow EVM to take advantage of native [VRF], higher computation for lower cost, and any asset on Cadence Flow. You can also build [cross-vm apps] on top of the _wagmi/viem/RainbowKit_ stack, enabling batched transactions and more.
- **EVM equivalence:** Flow EVM is truly _EVM Equivalent_, not just _EVM Compatible_. It runs exactly the same as EVM mainnet, which means builders won't run into _minor_ variances or endless 'quirks' when they try to integrate. If it works on Ethereum Mainnet, it will work with Flow EVM.

### Seamless integration for Ethereum developers

Flow EVM is designed to work out-of-the-box with the Ethereum toolchain or other clients. Native EVM transactions continue to be supported when using Metamask and other EVM-compatible clients.

EVM-equivalency on Flow works behind-the-scenes by implementing a minimal transaction script in Cadence to integrate Flow features with EVM. This is made possible because EVM transactions are composed and executed within Cadence transactions, enabling novel use-cases and patterns for integration.

### Flow blockchain core features

- **MEV resistance**: Flow is designed to [ensure equitable access] by resisting MEV. Maximum Extractable Value, also know as Miner-Extractable Value (MEV), is a practice common in other blockchains in which the builder of a block can profit at your expense by manipulating where and how your transaction is included.
- **Native VRF**: Flow provides [onchain randomness] at the protocol level. Instead of implementing a complex setup and [paying $10+ USD per number], simply call the built-in function.
- **Multi-role architecture**: The [multi-role architecture] of Flow allows the network to [scale without sharding] to serve billions of users without reducing the decentralization of consensus and verification.
- **True, fast finality**: For most other networks, it takes minutes, [a day], or even [a week] to reach hard finality — the point at which a transaction cannot be reversed. On Flow, the median time for finality is [under 10 seconds], without compromising security.
- **Consumer onboarding**: Flow was designed for mainstream consumers, with payment onramps catalyzing a safe and low-friction path from fiat to crypto.
- **Efficient gas costs**: The Flow blockchain is extremely efficient, allowing apps to do more computation at lower costs.

### MEV resilience

The [MEV Resilient] design on Flow offers DeFi builders improved market efficiency, fairness, trust, and long-term viability for their apps. Since Flow EVM transactions are composed and executed within a Cadence transaction, block production is handled by the [multi-role architecture] on Flow.

This robust MEV resilience is a significant difference from other EVM-compatible networks and results in reasonably priced and predictable gas fees. The impracticality of frontrunning or other attacks improves the user experience by eliminating failed transactions and invisible fees.

### Scalability, performance, and low gas fees

For sustainable user adoption, apps require the network they build on to be secure, efficient, affordable, and fast. Gas fees are ultra-low cost on the network, but Flow goes a step further allowing for gasless experiences through sponsored transactions.

The state space on Flow is extensible to the petabyte scale, making it easy to store application data on-chain. This means contracts can maintain a full working dataset — including metadata — together with contract logic.

Transaction throughput on the Flow network has reaches as many as 2 million daily transactions, a similar average transaction volume as Ethereum. Unlike Ethereum, Flow has always operated well under its maximum throughput ceiling, and that ceiling is scalable to even greater performance when it becomes necessary.

## Getting started

Whether you're ready to dive into the advantages of building with [Cadence], or are starting with Flow [EVM], we've got paths to get you up and running as quickly as possible.

### Getting started with Cadence app development

The [Getting Started] tutorial covers everything you need to know to build a Flow Cadence application:

- Setting up your local development environment (it's fast and easy!).
- Deploying and interacting with Flow Cadence contracts.
- Building a frontend that can interact with smart contracts written by you or other developers.

### Learn Cadence

[Cadence] is a modern smart contract programming language designed to work with Flow. Learning a new language is an investment, but you'll find that Cadence is safer, more explicit, and less dangerous than other blockchain languages. Plus, it unlocks the full power of the Flow protocol!

:::tip

If you're already comfortable with Solidity, be sure to check out how [Cadence] works in our [Guide for Solidity Developers]!

:::

### Build with Solidity on Flow EVM

Not ready to take the plunge and learn [Cadence]? Try out **EVM++** by deploying existing [EVM] contracts to see that Flow EVM is faster and cheaper than nearly every other EVM solution without compromising on security.

Deploying on Flow EVM also gives your Solidity contracts access to many Flow Cadence features, such as native [VRF].

## FLOW token

The [FLOW] (or $FLOW) token is the native currency for the Flow network. Developers and users can use FLOW to transact on the network. Developers can integrate FLOW directly into their apps for peer-to-peer payments, service charges, or consumer rewards. FLOW can be held, transferred, or transacted peer-to-peer.

- To understand more about Flow Token Economics and the FLOW token, read the [Flow Token Economics] guide.
- FLOW tokens are the native Fungible Token on Flow. To learn more about how to work with them in your applications, review the [FLOW] article.

## Technical background

- The [Flow Technical Primer] is a great place to start to understand how Flow works.
- The [Three technical whitepapers] cover the unique innovation behind the Flow blockchain network in-depth.

## Flow Improvement Proposals (FLIPs)

Those wishing to understand the technical specifics of how Flow EVM works, we recommend reviewing the following improvement proposals:

- Understanding [EVM Support on Flow]
- Exploring the [Flow VM Bridge]
- Insights into the [Flow EVM Gateway]
- Integration of the [Cadence Interface]

## Build with Flow

Whether you're building with Cadence or Solidity, porting an existing Solidity dApp or building from scratch, Flow offers a **fast, scalable blockchain with low fees** and the tooling you already know. As a **scalable platform for apps**, Flow combines familiar development workflows with performance and UX enhancements you can't get elsewhere.

## Join the community

Are you interested in launching a project on Flow or partnering with us? Visit our weekly Flow [office hours] for discussions on project development and other opportunities for collaboration. You can also connect with us in our developers-chat in the Flow [Discord].

<!-- Reference-style links, does not render on page -->

[a day]: https://docs.zksync.io/zk-stack/concepts/finality#finality-on-zksync-era
[a week]: https://docs.optimism.io/stack/rollup/overview#fault-proofs
[account abstraction]: https://flow.com/account-abstraction
[best platform for consumer apps]: https://flow.com/
[blockchain trilemma]: https://coinmarketcap.com/academy/glossary/blockchain-trilemma
[bridge]: ../ecosystem/bridges.md
[Cadence Interface]: https://github.com/onflow/flips/blob/f646491ec895442dcccdb24d80080bab1c56188e/protocol/20231116-evm-support.md
[Cadence]: https://cadence-lang.org/
[Transactions]: https://cadence-lang.org/docs/language/transactions
[pre- and post-conditions]: https://cadence-lang.org/docs/language/pre-and-post-conditions
[core contracts]: ./core-contracts/index.md
[cross-vm apps]: ../blockchain-development-tutorials/cross-vm-apps/index.md
[CryptoKitties]: https://www.cryptokitties.co/
[Dapper Labs]: https://www.dapperlabs.com/
[digital assets]: https://www.flow.com/post/flow-blockchain-cadence-programming-language-resources-assets
[Discord]: https://discord.gg/flow
[Disney Pinnacle]: https://disneypinnacle.com/
[ensure equitable access]: ./basics/mev-resistance.md
[ERC-721 NFT standard]: https://github.com/ethereum/eips/issues/721
[Ethereum Virtual Machine (EVM)]: https://flow.com/upgrade/crescendo/evm.md
[EVM Support on Flow]: https://github.com/onflow/flips/pull/225
[EVM]: https://flow.com/upgrade/crescendo/evm.md
[Flow EVM Gateway]: https://github.com/onflow/flips/pull/235/files
[Flow Technical Primer]: https://www.flow.com/primer
[Flow Token Economics]: https://www.flow.com/flow-token-economics
[Flow VM Bridge]: https://github.com/onflow/flips/pull/233/files/d5bc46c4b13f0b9b168a94f994c77a5a689f6b24..122e938b7acae7e774246b1b66aaf5979ca21444
[FLOW]: ./core-contracts/03-flow-token.md
[Getting Started]: ./getting-started/contract-interaction.md
[Guide for Solidity Developers]: https://cadence-lang.org/docs/solidity-to-cadence
[Mattel Creations]: https://creations.mattel.com/pages/virtual
[MEV Resilient]: ../build/basics/mev-resistance.md
[multi-role architecture]: https://flow.com/post/flow-blockchain-multi-node-architecture-advantages
[multi-role architecture]: https://www.flow.com/primer
[NBA Top Shot]: https://nbatopshot.com/
[NFL All Day]: https://nflallday.com/
[office hours]: https://calendar.google.com/calendar/ical/c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0%40group.calendar.google.com/public/basic.ics
[onchain randomness]: ./advanced-concepts/randomness.md
[paying $10+ USD per number]: https://docs.chain.link/vrf/v2-5/billing
[resource-oriented]: https://flow.com/post/resources-programming-ownership
[scale without sharding]: https://www.flow.com/post/flow-blockchain-multi-node-architecture-advantages
[signing roles]: ./basics/transactions.md#signer-roles
[struggled under its own success]: https://spectrum.ieee.org/cryptokitties
[Three technical whitepapers]: https://www.flow.com/technical-paper
[under 10 seconds]: ./basics/transactions.md#flow
[usually way less!]: https://evm.flowscan.io/stats
[VRF]: ../blockchain-development-tutorials/native-vrf/vrf-in-solidity.md
[widespread popularity]: https://www.cnn.com/style/article/cryptokitty-blockchain/index.html
