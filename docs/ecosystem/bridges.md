---
sidebar_position: 6
description: Mechanisms that connect different blockchain networks, allowing secure and decentralized transfer of assets and data across platforms.
sidebar_custom_props:
  icon: ⛓️
---

# Bridges

Bridges are mechanisms that connect different blockchain networks, enabling secure and decentralized transfers of assets and data across various platforms.

<div id="cards" className="cards">

## Stargate Bridge

[Stargate Bridge][1] is a cross-chain liquidity transfer protocol powered by LayerZero that enables seamless bridging of assets between Flow and major blockchain networks like Ethereum, BNB Chain, and Base. It uses LayerZero's omnichain messaging capabilities which allow Stargate to provide deep liquidity pools, low slippage, and cost-efficient transfers for stablecoins and cryptocurrencies such as USDC, USDT, USDF, and ETH.

## Flow Bridge

[Flow Bridge][2] is a user-friendly, decentralized bridge designed to facilitate secure transfers of stablecoins like USDC, USDT, and USDF to and from Flow blockchain. Powered by Superbridge, it leverages native bridge contracts for official Superchain rollups, ensuring users receive the canonical asset on Flow with minimal trust assumptions. Flow Bridge supports transfers from 24+ chains, with ultra-low transaction fees and fast settlement times.

## LayerZero

[LayerZero][3] is a decentralized omnichain interoperability protocol that enables direct cross-chain messaging and asset transfers. It uses a unique Ultra Light Node (ULN) architecture combined with decentralized verifiers to ensure secure message delivery across chains. LayerZero supports multiple EVM-compatible chains and provides developers with tools to build cross-chain applications through its EndpointV2 contracts.

## Hyperlane

[Hyperlane][4] is a modular interoperability framework that enables secure cross-chain communication. It allows developers to build applications that can seamlessly interact across different blockchain networks. Hyperlane's architecture emphasizes security and flexibility, providing customizable security models and permissionless interoperability between any blockchain networks.

## Celer cBridge

[Celer cBridge][5] is a decentralized and non-custodial asset bridge that supports more than 150 tokens across over 40 blockchains and layer-2 rollups. It is built on top of the [Celer][6] Inter-chain Message Framework. cBridge has facilitated over $13 billion in cross-chain asset transfer volume across 40+ blockchains for more than 350,000 unique users. It is rapidly growing and expanding to support more blockchains and layer-2 solutions.

## Axelar

[Axelar][7] is a decentralized cross-chain network connecting over 55 blockchains, facilitating asset transfers and smart contract programmability. It features a proof-of-stake consensus for security and supports cross-chain applications through General Message Passing (GMP). Integrations with platforms like [Squid][8] enable easy token swaps across networks like Ethereum and Polygon.

## DeBridge

[DeBridge][9] is a decentralized cross-chain network supporting hundreds of tokens over 75 blockchains. DeBridge runs on its generic messaging protocol and operates cross-chain validator infrastructure to achieve a high level cross-chain interoperability for quick, low-cost bridging. DeBridge's architecture emphasizes security and fault tolerance with robust handling of forks or blockchain outages to mitigate bridging issues.

## Relay
[Relay][10] is an intent-based bridge enabling high-speed bridging and connecting over 30 blockchains. Unlike consensus validator based decentralized bridges, Relay's permissioned relayer model stores outbound tokens on the origin chain and issues tokens on the destination chain allowing for low-cost, fast bridging of assets.

</div>

[1]: https://stargate.finance/bridge
[2]: https://bridge.flow.com/
[3]: https://docs.layerzero.network/
[4]: https://www.usenexus.org/
[5]: https://cbridge.celer.network/
[6]: https://celer.network/
[7]: https://www.axelar.network/
[8]: https://www.squidrouter.com/
[9]: https://app.debridge.finance/
[10]: https://relay.link/bridge