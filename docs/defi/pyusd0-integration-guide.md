---
id: pyusd0-integration-guide
title: PYUSD0 Integration Guide
description: A developer reference for integrating PYUSD0 on Flow, covering token architecture, contract addresses, bridging mechanics, and migration from USDF.
keywords:
  - PYUSD0
  - PYUSD
  - stablecoins
  - Flow blockchain
  - Flow EVM
  - Flow Cadence
  - Flow EVM Mainnet
  - LayerZero
  - OFT
  - omnichain fungible token
  - bridges
  - stablecoin liquidity
  - USDF migration
  - decentralized exchanges
  - DEX
sidebar_position: 9
sidebar_label: PYUSD0 Integration
---

# PYUSD0 Integration Guide

## Overview

This guide is for developers and protocols integrating PYUSD0 on Flow. PYUSD0 is an OFT (Omnichain Fungible Token) and brings pre-native PayPal USD support to Flow with seamless cross-chain transfers across 140+ chains via Stargate. It replaces USDF as Flow's canonical USD stablecoin. For users please read the [migration guide.][6]

## Contract Addresses

### Flow EVM Mainnet

| Contract                          | Address                                      |
| --------------------------------- | -------------------------------------------- |
| [PYUSD0][2]                       | `0x99af3eea856556646c98c8b9b2548fe815240750` |
| [Migration Pool (USDF/PYUSD0)][3] | `0x6ddDFa511A940cA3fD5Ec7F6a4f23947cA30f030` |

### Flow Cadence Mainnet

| Token Name  | Contract Address     | Contract Name                                                |
| ----------- | -------------------- | ------------------------------------------------------------ |
| [PYUSD0][1] | `0x1e4aa0b87d10b141` | `EVMVMBridgedToken_99af3eea856556646c98c8b9b2548fe815240750` |

### Testnet

There's no official PYUSD0 testnet deployment because of how LayerZero OFT (Omnichain Fungible Token) standards work. PYUSD0 requires actual PYUSD to be issued by Paxos and then locked by LayerZero to create the 1:1 representation for cross-chain flows.
| Contract    | Address                                      |
| ----------- | -------------------------------------------- |
| [PYUSD0][7] | `0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F` |

For local testing, deploy the Paxos PYUSD contract directly:

* [Paxos PYUSD Contract][4]  
* This gives you a functionally equivalent token you can mint/control for testing.
This is a stand-in token for testing purposes only. Mainnet PYUSD0 requires real PYUSD locked via LayerZero. The testnet contract has a [mint function][8] and a [liquidity pool][9] so you can mint or swap tokens for development.

### **Deprecated (USDF)**

| Contract | Address                                      | Status      |
| -------- | -------------------------------------------- | ----------- |
| USDF     | `0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED` | Deprecating |

## **Token Specifications**

```
Name: PYUSD0
Symbol: PYUSD0
Decimals: 6
Standard: ERC-20 + LayerZero OFT
Backing: 1:1 PYUSD (PayPal USD)
```

## About PYUSD0

PYUSD0 is a pre-native token deployed via LayerZero's Asset0 program, alongside other stablecoins like USDG0 (backed by Robinhood, Kraken, Mastercard) and AUSD0. It's fully backed 1:1 by PayPal USD. When Paxos later deploys native PYUSD directly on Flow, PYUSD0 balances will automatically upgrade with no user or developer action required.

## **Code Examples**

Visit [the GitHub Repository][5] for code examples on bridging PYUSD0 via LayerZero OFT.

## **Migration Path for Existing USDF Integrations**

1. **Add PYUSD0 support** alongside USDF
2. **Update defaults** to use PYUSD0 instead of USDF
3. **Communicate to users** about migration timeline
4. **Deprecate USDF** after grace period

[1]: https://www.flowscan.io/contract/A.1e4aa0b87d10b141.EVMVMBridgedToken_99af3eea856556646c98c8b9b2548fe815240750
[2]: https://evm.flowscan.io/token/0x99aF3EeA856556646C98c8B9b2548Fe815240750
[3]: https://evm.flowscan.io/token/0x6ddDFa511A940cA3fD5Ec7F6a4f23947cA30f030?tab=contract
[4]: https://github.com/paxosglobal/paxos-token-contracts/blob/master/contracts/stablecoins/PYUSD.sol
[5]: https://github.com/onflow/flow-bridge-app/tree/main/ethereum-oapp
[6]: https://flow.com/post/pyusd0-migration-guide
[7]: https://evm-testnet.flowscan.io/address/0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F
[8]: https://evm-testnet.flowscan.io/token/0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F?tab=read_write_contract
[9]: https://flowswap.io/swap?chain=flow-testnet&inputCurrency=NATIVE&outputCurrency=0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F
