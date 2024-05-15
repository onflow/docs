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

<Callout type="information">

Full EVM equivalence is only available on PreviewNet at the moment. Deployments on Testnet and Mainnet currently only
support ABI encoding and decoding.

</Callout>

Mainnet/Testnet Source: [`EVM.cdc`](https://github.com/onflow/flow-go/blob/master/fvm/evm/stdlib/abiOnlyContract.cdc)

PreviewNet Source: [`EVM.cdc`](https://github.com/onflow/flow-go/blob/master/fvm/evm/stdlib/contract.cdc)

| Network           | Contract Address     |
| ----------------- | -------------------- |
| Emulator          | `0xf8d6e0586b0a20c7` |
| Cadence Testing Framework | `0x0000000000000001` |
| PreviewNet        | [`0xb6763b4399a888c8`](https://previewnet.flowdiver.io/contract/A.b6763b4399a888c8.EVM?tab=deployments) |
| Testnet | [`0x8c5303eaa26202d6`](https://contractbrowser.com/A.8c5303eaa26202d6.EVM) |
| Mainnet           | [`0xe467b9dd11fa00df`](https://contractbrowser.com/A.e467b9dd11fa00df.EVM) |