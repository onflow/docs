---
id: cross-chain-swaps
title: Cross-chain swaps on Flow EVM
description: An overview of cross-chain options on Flow EVM
keywords:
  - cross-chain token swap
  - cross-chain bridge
  - intent based bridge
  - liquidity based bridge
  - bridges
  - Flow blockchain
  - Flow EVM
  - EVM
  - Relay.link
  - DeBridge
  - Stargate
  - LayerZero
  - Celer
sidebar_position: 2
sidebar_label: Cross-chain swaps on Flow EVM
---

import Details from '@theme/Details';

The following providers offer cross-chain token bridging for Flow EVM. 

## Liquidity Pool Based Bridges 

### Stargate

[Stargate](https://stargate.finance) employs unified liquidity pools shared across multiple chains to enable native 
asset transfers without wrapped tokens and is based on LayerZero's cross-chain messaging protocol.

### Celer

[Celer](https://cbridge.celer.network) is a hybrid liquidity network bridge that combines multiple bridging models and is based on the Celer 
Inter-Chain Messaging Framework.

1. Token Bridge (xAsset): A canonical mapping bridge using a lock-mint model
2. Liquidity Network (xLiquidity): A pool-based bridge model

## Intent Based Bridges

Intent based bridges do not depend on pre-funded liquidity pools which can improve user experience, transaction speed and capital efficiency.

### Relay

[Relay.link](https://relay.link/bridge/base) allows users to specify desired cross-chain transaction outcomes for orders.

### DeBridge

[DeBridge](https://app.debridge.finance/) achieves efficient cross-chain transfer with minimal slippage in a decentralized environment 
through a peer-to-peer transaction mechanism.
