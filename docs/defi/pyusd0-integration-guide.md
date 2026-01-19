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

This guide is for developers and protocols integrating PYUSD0 on Flow EVM. PYUSD0 is an OFT (Omnichain Fungible Token) deployed via LayerZero, replacing USDF as the canonical USD stablecoin on Flow.

## Contract Addresses

### Flow EVM Mainnet

| Contract | Address |
| ----- | ----- |
| [PYUSD0][2] | `0x99af3eea856556646c98c8b9b2548fe815240750` |
| [Migration Pool (USDF/PYUSD0)][3] | `0x6ddDFa511A940cA3fD5Ec7F6a4f23947cA30f030` |

### Flow Cadence Mainnet

| Token Name | Contract Address | Contract Name |
| ----- | ----- | ----- |
| [PYUSD0][1] | `0x1e4aa0b87d10b141` | `EVMVMBridgedToken_99af3eea856556646c98c8b9b2548fe815240750` |

### Testnet

**No official PYUSD0 testnet deployment.** For local testing, deploy the PYUSD contract directly:

* [Paxos PYUSD Contract][4]  
* This gives you a functionally equivalent token you can mint/control for testing.

### **Deprecated (USDF)**

| Contract | Address | Status |
| ----- | ----- | ----- |
| USDF | `0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED` | Deprecating |

## **Token Specifications**

```
Name: PYUSD0
Symbol: PYUSD0
Decimals: 6
Standard: ERC-20 + LayerZero OFT
Backing: 1:1 PYUSD (PayPal USD)
```

---

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