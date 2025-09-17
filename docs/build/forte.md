---
title: Why Forte?
sidebar_label: Why Forte?
sidebar_position: 2
description: Forte is Flow's network upgrade that introduces native automation, AI-powered development, and protocol composability. Build autonomous apps with scheduled transactions, high-precision DeFi with 128-bit types, and smart wallets with WebAuthn support.
keywords:
  - Forte upgrade
  - Flow Actions
  - Flow Agents
  - scheduled transactions
  - autonomous apps
  - AI agents
  - protocol composability
  - WebAuthn support
  - passkey authentication
  - 128-bit fixed-point
  - high-precision DeFi
  - smart wallets
  - native automation
  - cron jobs blockchain
  - PebbleDB
  - AI-friendly errors
  - protocol autonomy
  - data integrity
  - real-time results
  - account abstraction
  - self-custody
---

# Forte: Unlocking the Next Era of Flow

**Forte** is Flow's most significant network upgrade that enhances developers and AI agents building on Flow, unlocking protocol composability and native automation directly on the network.

Forte advances Flow across three critical pillars: **developer experience**, **efficiency and scalability**, and **protocol autonomy**. It provides the tools and performance to make Flow a best-in-class option for building with AI, tapping into Cadence's developer friendliness, and introducing a reusable component library alongside core protocol improvements.

> **_ERC-20 and ERC-721 unlocked nouns. Actions and Agents unlock verbs._**

## What makes Forte revolutionary

Forte transforms Flow from a reactive blockchain into an autonomous, intelligent network capable of executing complex workflows without external dependencies. The upgrade introduces native time scheduling, protocol-level composability, and AI-optimized development tools that enable entirely new categories of applications.

### Flow Actions: Protocol-native composability

**Flow Actions** are protocol-native, composable operations that enable developers to create multi-step workflows across protocols in a single atomic transaction. Actions include [fundamental DeFi primitives] like swap, source, sink, flasher, and price oracle operations.

This means developers can:

- **Compose complex operations**: Build sophisticated DeFi strategies by combining multiple Actions in one transaction
- **Eliminate integration complexity**: Use standardized interfaces instead of custom contract integrations
- **Ensure atomicity**: All operations succeed together or fail together, eliminating partial execution risks
- **Reduce gas costs**: Execute multiple protocol interactions more efficiently than separate transactions

### Flow Agents: Autonomous onchain execution

**Flow Agents** are onchain resources that run entirely within a Flow account, enabling fully autonomous, secure transaction execution. Agents can schedule future transactions, self-trigger based on conditions, and operate without external keepers.

Key capabilities:

- **Autonomous operation**: Execute transactions automatically based on programmed logic
- **Self-contained**: Run entirely onchain without external dependencies
- **Trigger-based**: React to onchain events, time schedules, or custom conditions

## Developer Experience Alpha

### Build autonomous apps with scheduled transactions

[**Scheduled Transactions**] are the first native time scheduler that lets onchain apps run tasks automatically, like *cron jobs for blockchains*. Applications are no longer restricted to being reactive only to user transactions.

**Use cases enabled:**

- **DeFi protocols** that automatically rebalance portfolios on schedule
- **AI-driven agents** that proactively settle, sweep, or optimize positions
- **Subscription services** with automatic recurring payments
- **Gaming mechanics** with time-based events and rewards

Scheduled Transactions run natively on the network, simplifying operations, reducing off-chain dependencies, and making behavior auditable and predictable in code. This implements [FLIP 330: Scheduled Transaction].

### High-precision DeFi with 128-bit fixed-point types

Cadence now supports **Fix128** and **UFix128** - 128-bit fixed-point types enabling precision up to **24 decimal places** for advanced DeFi, risk engines, and interest accrual workloads.

**Advantages over traditional approaches:**

Forte's native precision with built-in 128-bit fixed-point support eliminates the need for bespoke arithmetic scaffolding while minimizing rounding-related errors common in integer-based math. This ensures lossless conversion where all existing Fix64 and UFix64 values convert seamlessly, providing financial-grade accuracy that supports sophisticated financial calculations requiring extreme precision.

This implements [FLIP 341: Add 128-bit Fixed-point Types to Cadence].

### Build smart wallets with WebAuthn and passkey support

Flow adds **native WebAuthn support** including passkeys, enabling wallets to use device-backed credentials on iOS, Android, and popular password managers to sign transactions.

Flow's native WebAuthn support eliminates seed phrases by enabling biometric authentication while preserving self-custody, with cross-device portability that securely syncs credentials across devices. The native integration requires no additional smart contract layers like ERC-4337, providing a seamless UX where users can sign transactions with Touch ID, Face ID, or hardware keys.

Combined with Flow's native account abstraction, developers can build [smart wallets without relying on complex contract architectures]. This implements [FLIP 264: WebAuthn Credential Support].

### AI-friendly Cadence errors

Cadence compiler and linter errors are now **designed for AI assistance**, making it easier for agents and IDE copilots to fix issues automatically. Error messages:

- **Explain the cause** with context-aware descriptions
- **Suggest concrete fixes** with actionable recommendations
- **Link directly** to reference docs and migration notes
- **Surface through language server** for AI-powered editors like Cursor

This enables faster feedback, fewer documentation round trips, and smoother AI agent workflows for code refactoring and migration.

## Boosting Efficiency and Scalability

### Enhanced node performance with PebbleDB

Forte upgrades node storage from BadgerDB to **PebbleDB**, delivering up to 80% memory usage reduction depending on node type and up to 60% CPU usage improvement for typical operations. The upgrade provides up to 30% annual disk usage reduction through effective pruning, higher stability under load by eliminating memory spikes, and improved ROI for operators through better resource efficiency.

### Optimized state storage with account key de-duplication

Public key de-duplication eliminates redundancy while preserving multi-key account flexibility, consolidating 53% of all keys that were duplicates. This optimization delivers a 6% reduction in Flow's execution state (saving 21 GB from 349 GB), removes 0.29 billion entries from the storage trie, and provides a 6-18% reduction in Execution Node memory usage, resulting in faster state access through leaner data structures.

### Adaptive collection rate limiting for overload resilience

Flow's [assembly line architecture] gains intelligent rate limiting to prevent pipeline bottlenecks through automatic throttling when execution or sealing lags behind collection. The system maintains steady pipeline flow even at several hundred TPS while providing priority handling for governance and protocol transactions, creating a self-regulating system that disengages once the backlog clears.

### Near real-time transaction results

Building on Flow's [data availability vision], Access Nodes will soon ingest account data and transaction results **before finalization**, enabling soft finality access for high-frequency DeFi applications with early state reads that include graceful rollback handling. This approach provides reduced latency for real-time applications and direct data serving without third-party dependencies.

## Protocol Autonomy

### Hardened data integrity across the network

A major milestone on the [protocol autonomy roadmap] ensures every data structure has a **canonical, verifiable identity** through collision-resistant hashing for all inter-node communications and immediate tampering detection by message recipients. The system provides protected data structures with custom linter validation and immutable message semantics for simplified development.

This provides developers and AI agents with a simpler mental model where network messages are treated as immutable objects with stable identities.

## Join the Forte ecosystem

The Forte upgrade represents the next evolution of Flow, enabling autonomous applications, AI-powered development, and unprecedented protocol composability. Whether you're building DeFi protocols, AI agents, or consumer applications, Forte provides the tools and performance needed for the next generation of blockchain applications.

Connect with the Flow community in our developers-chat on [Discord] or join our weekly [office hours] to discuss Forte development opportunities.

<!-- Reference links -->

[fundamental DeFi primitives]: https://developers.flow.com/blockchain-development-tutorials/flow-actions/intro-to-flow-actions
[**Scheduled Transactions**]: https://developers.flow.com/blockchain-development-tutorials/flow-actions/scheduled-transactions-introduction
[FLIP 330: Scheduled Transaction]: https://github.com/onflow/flips/blob/main/protocol/20250609-scheduled-callbacks.md
[FLIP 341: Add 128-bit Fixed-point Types to Cadence]: https://github.com/onflow/flips/blob/main/cadence/20250815-128-bit-fixed-point-types.md
[FLIP 264: WebAuthn Credential Support]: https://github.com/onflow/flips/blob/cfaaf5f6b7c752e8db770e61ec9c180dc0eb6543/protocol/20250203-webauthn-credential-support.md
[smart wallets without relying on complex contract architectures]: https://flow.com/post/transforming-smartphones-into-hardware-wallets-how-secure-enclave-support-on-flow-is-ushering-in-the-next-wave-of-web3-applications
[Flow Actions Developer Docs]: https://developers.flow.com/blockchain-development-tutorials/defi
[assembly line architecture]: https://flow.com/why-flow
[data availability vision]: https://flow.com/data-availability-vision
[protocol autonomy roadmap]: https://flow.com/protocol-autonomy-roadmap
[Discord]: https://discord.gg/flow
[office hours]: https://calendar.google.com/calendar/ical/c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0%40group.calendar.google.com/public/basic.ics