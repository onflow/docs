---
title: Flow EVM
sidebar_position: 13
sidebar_label: EVM
description: Learn about Flow's EVM contract that enables Ethereum Virtual Machine compatibility on Flow. Understand how to interact with EVM from Cadence and access Flow's EVM equivalence features.
keywords:
  - Flow EVM
  - EVM compatibility
  - Ethereum Virtual Machine
  - EVM tooling
  - Cadence EVM
  - EVM contract
  - EVM integration
  - blockchain interop
  - smart contracts
  - EVM equivalence
  - contract deployment
  - Flow protocol
  - cross-chain
  - EVM support
  - FLIP 223
---

# Contract

The `EVM` contract is the entrypoint from Cadence to Flow EVM. While many developers may choose to interact with EVM
via [EVM-equivalent tooling paths](../../evm/using.mdx), all access to Flow EVM ultimately interfaces via Cadence at
some level.

If you would like to interact with EVM directly from Cadence, you can use the `EVM` contract and it's constructs. Read
more about the EVM contract and its role in Flow's EVM equivalence in [FLIP
#223](https://github.com/onflow/flips/blob/main/protocol/20231116-evm-support.md).

Mainnet/Testnet Source: [`EVM.cdc`](https://github.com/onflow/flow-go/blob/master/fvm/evm/stdlib/contract.cdc)

| Network                   | Contract Address                                                           |
| ------------------------- | -------------------------------------------------------------------------- |
| Emulator                  | `0xf8d6e0586b0a20c7`                                                       |
| Cadence Testing Framework | `0x0000000000000001`                                                       |
| Testnet                   | [`0x8c5303eaa26202d6`](https://contractbrowser.com/A.8c5303eaa26202d6.EVM) |
| Mainnet                   | [`0xe467b9dd11fa00df`](https://contractbrowser.com/A.e467b9dd11fa00df.EVM) |