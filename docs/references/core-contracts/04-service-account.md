---
title: Service Account Contracts
sidebar_label: Service Account
---

The service account is the account that manages the core protocol requirements of Flow.
There are two contracts deployed to the service account:

- `FlowServiceAccount` tracks transaction fees, deployment permissions, and provides 
some convenience methods for Flow Token operations.

Source: [FlowServiceAccount.cdc](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowServiceAccount.cdc)

| Network         | Contract Address     |
| --------------- | -------------------- |
| Emulator/Canary | `0xf8d6e0586b0a20c7` |
| Testnet         | `0x8c5303eaa26202d6` |
| Mainnet         | `0xe467b9dd11fa00df` |
