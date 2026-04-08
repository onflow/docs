---
title: Cross VM Packages
description: FCL packages for cross-VM (Flow + EVM) applications.
---

# FCL Cross-VM Packages

These packages allow you to leverage Flow’s Cadence-Owned Account (COA) within Ethereum tooling (for example, Wagmi, RainbowKit). They provide a unified approach for cross-VM apps on Flow and EVM, which lets you perform EVM-like operations will Cadence accounts.

For background and motivation, see the [FCL Ethereum Provider for Cross-VM Apps FLIP #316].

| Package                                        | Purpose                                                                                         |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------|
| [@onflow/fcl-ethereum-provider]  | Provides an EIP-1193-compliant Ethereum provider backed by an FCL-authenticated COA.            |
| [@onflow/fcl-wagmi-adapter]          | Integrates Flow-based COAs with Wagmi, and exposes them as Ethereum accounts in your dApp.         |
| [@onflow/fcl-rainbowkit-adapter]| Allows a Flow-based wallet option in your RainbowKit wallet selection modal.                   |

## `@onflow/fcl-ethereum-provider`

- **Description**: A drop-in EIP-1193 provider that authenticates users via [Flow Client Library (FCL)] and lets them sign transactions and messages with their COA.
- **Use Cases**:
    - Integrate Flow EVM with any generic EVM library or framework.
    - Direct control over JSON-RPC calls (for example, `provider.request({ method: 'eth_sendTransaction' })`).
- **Link to Docs**: [Read the @onflow/fcl-ethereum-provider Reference »]

## `@onflow/fcl-wagmi-adapter`

- **Description**: A Wagmi connector that uses `@onflow/fcl-ethereum-provider` under the hood so you can sign in with your COA through standard Wagmi flows.
- **Use Cases**:
    - Add Flow-based COAs to a current Wagmi-powered dApp as if they were Ethereum wallets.
- **Link to Docs**: [Read the @onflow/fcl-wagmi-adapter Reference »]

## `@onflow/fcl-rainbowkit-adapter`

- **Description**: A RainbowKit adapter that surfaces a Flow-based wallet in the wallet selection modal, wheich makes it easy to sign transactions via COAs in a RainbowKit environment.
- **Use Cases**:
    - Offer Flow-based wallets (such as Flow Wallet) alongside popular Ethereum wallets in RainbowKit.
- **Link to Docs**: [Read the @onflow/fcl-rainbowkit-adapter Reference »]

<!-- Relative links, will not render on page -->

[FCL Ethereum Provider for Cross-VM Apps FLIP #316]: https://github.com/onflow/flips/blob/c0fe9b71a9afb85fe70a69cf7c0870b5d327e679/application/20241223-fcl-ethereum-provider.md
[@onflow/fcl-ethereum-provider]: #onflowfcl-ethereum-provider
[@onflow/fcl-wagmi-adapter]: #onflowfcl-wagmi-adapter
[@onflow/fcl-rainbowkit-adapter]: #onflowfcl-rainbowkit-adapter
[Flow Client Library (FCL)]: https://developers.flow.com/
[Read the @onflow/fcl-ethereum-provider Reference »]: ethereum-provider.mdx
[Read the @onflow/fcl-wagmi-adapter Reference »]: wagmi-adapter.mdx
[Read the @onflow/fcl-rainbowkit-adapter Reference »]: rainbowkit-adapter.mdx