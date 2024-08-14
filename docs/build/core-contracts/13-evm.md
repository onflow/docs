---
title: Flow EVM
sidebar_position: 13
sidebar_label: EVM
---

# Contract

The `EVM` contract is the entrypoint from Cadence to EVM on Flow. While many developers may choose to interact with EVM
via [EVM-equivalent tooling paths](../../evm/using.mdx), all access to Flow EVM ultimately interfaces via Cadence at
some level.

If you would like to interact with EVM directly from Cadence, you can use the `EVM` contract and it's constructs. Read
more about the EVM contract and its role in Flow's EVM equivalence in [FLIP
#223](https://github.com/onflow/flips/pull/225/files).

Mainnet/Testnet Source: [`EVM.cdc`](https://github.com/onflow/flow-go/blob/master/fvm/evm/stdlib/abiOnlyContract.cdc)

| Network                   | Contract Address                                                           |
| ------------------------- | -------------------------------------------------------------------------- |
| Emulator                  | `0xf8d6e0586b0a20c7`                                                       |
| Cadence Testing Framework | `0x0000000000000001`                                                       |
| Testnet                   | [`0x8c5303eaa26202d6`](https://contractbrowser.com/A.8c5303eaa26202d6.EVM) |
| Mainnet                   | [`0xe467b9dd11fa00df`](https://contractbrowser.com/A.e467b9dd11fa00df.EVM) |
