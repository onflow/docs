---
title: Native VRF (Built-in Randomness) Tutorials
description: Build on a blockchain with built-in randomness. Flow's native VRF enables verifiable, low-cost randomness for gaming, NFTs, and DeFi. WIth no third-party dependencies.
sidebar_position: 8
keywords:
  - VRF
  - randomness
  - Cadence
  - Solidity
  - Flow EVM
  - smart contracts
  - commit-reveal
  - secure randomness
  - Random Beacon
  - blockchain
  - gaming
  - NFTs
  - DeFi
---

# Native VRF (Built-in Randomness) Tutorials

Flow is a **blockchain with built-in randomness**, powered by its native **VRF (Verifiable Random Function)** capabilities. Unlike other blockchains that require external oracles, Flow's **Random Beacon** provides cryptographically secure randomness **at the protocol level**. This elimiates extra costs, reduces latency, and improves reliability for decentralized applications.

These tutorials cover how to implement secure randomness directly in both **Cadence** and **Solidity** smart contracts on Flow. Whether you build on Flow's native environment or Flow EVM, you can generate unbiased, verifiable random values without third-party dependencies.

## Tutorials

### [Secure Randomness with Commit-Reveal in Cadence]

Learn how to implement secure randomness in Cadence with Flow's commit-reveal scheme, which ensures fairness and resistance to manipulation.

### [VRF (Randomness) in Solidity]

Learn how to use Flow's **native verifiable randomness** in Consumer Decentralized Finance (DeFi) contracts on Flow EVM, which includes best practices, security considerations, and complete code examples.

## Why Flow for randomness?

- Protocol-level randomness: no need for external oracles or APIs.

- Lower costs: built-in randomness means no extra transaction fees.

- Enhanced security: cryptographically secure and verifiable onchain.

- Cross-language support: Wwrks seamlessly in both Cadence and Consumer DeFi.

- Speed: Flow is a [fast blockchain] with the design goal of 1,000,000 transactions per second.

<!-- Relative links, will not render on page -->

[Secure Randomness with Commit-Reveal in Cadence]: ./commit-reveal-cadence.md
[VRF (Randomness) in Solidity]: ./vrf-in-solidity.md
[VRF (Randomness) in Solidity]: ./vrf-in-solidity.md
[fast blockchain]: https://flow.com/core-protocol-vision
