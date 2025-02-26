---
title: Cross VM Packages
---

# FCL Cross-VM Packages

These packages enable you to leverage Flow’s Cadence-Owned Account (COA) within Ethereum tooling (e.g., Wagmi, RainbowKit). They provide a unified approach for cross-VM apps on Flow and EVM, letting you perform EVM-like operations using Cadence accounts.

For background and motivation, see the [FCL Ethereum Provider for Cross-VM Apps FLIP #316](https://github.com/onflow/flips/blob/c0fe9b71a9afb85fe70a69cf7c0870b5d327e679/application/20241223-fcl-ethereum-provider.md).

| Package                                        | Purpose                                                                                         |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------|
| [@onflow/fcl-ethereum-provider](#onflowfcl-ethereum-provider)  | Provides an EIP-1193-compliant Ethereum provider backed by an FCL-authenticated COA.            |
| [@onflow/fcl-wagmi-adapter](#onflowfcl-wagmi-adapter)          | Integrates Flow-based COAs with Wagmi, exposing them as Ethereum accounts in your dApp.         |
| [@onflow/fcl-rainbowkit-adapter](#onflowfcl-rainbowkit-adapter)| Enables a Flow-based wallet option in your RainbowKit wallet selection modal.                   |

## @onflow/fcl-ethereum-provider

- **Description**: A drop-in EIP-1193 provider that authenticates users via [FCL](https://developers.flow.com/) and lets them sign transactions/messages with their COA.
- **Use Cases**:
    - Integrate Flow EVM with any generic EVM library or framework.
    - Direct control over JSON-RPC calls (e.g., `provider.request({ method: 'eth_sendTransaction' })`).
- **Link to Docs**: [Read the @onflow/fcl-ethereum-provider Reference »](ethereum-provider.mdx)

## @onflow/fcl-wagmi-adapter

- **Description**: A Wagmi connector that uses `@onflow/fcl-ethereum-provider` under the hood so you can sign in with your COA through standard Wagmi flows.
- **Use Cases**:
    - Add Flow-based COAs to an existing Wagmi-powered dApp as if they were Ethereum wallets.
- **Link to Docs**: [Read the @onflow/fcl-wagmi-adapter Reference »](wagmi-adapter.mdx)

## @onflow/fcl-rainbowkit-adapter

- **Description**: A RainbowKit adapter that surfaces a Flow-based wallet in the wallet selection modal, making it easy to sign transactions via COAs in a RainbowKit environment.
- **Use Cases**:
    - Offer Flow-based wallets (e.g., Flow Wallet) alongside popular Ethereum wallets in RainbowKit.
- **Link to Docs**: [Read the @onflow/fcl-rainbowkit-adapter Reference »](rainbowkit-adapter.mdx)
