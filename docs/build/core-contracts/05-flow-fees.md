---
title: Flow Fees Contract
sidebar_position: 5
sidebar_label: Flow Fees
---

# FlowFees

The `FlowFees` contract is where all the collected flow fees are gathered.

Source: [FlowFees.cdc](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowFees.cdc)

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0xe5a8b7f23e8b548f` |
| Cadence Testing Framework | `0x0000000000000004` |
| Testnet                   | `0x912d5440f7e3769e` |
| Mainnet                   | `0xf919ee77447b7497` |

## Events

Important events for `FlowFees` are:

```cadence
// Event that is emitted when tokens are deposited to the fee vault
access(all) event TokensDeposited(amount: UFix64)

// Event that is emitted when tokens are withdrawn from the fee vault
access(all) event TokensWithdrawn(amount: UFix64)

// Event that is emitted when fees are deducted
access(all) event FeesDeducted(amount: UFix64, inclusionEffort: UFix64, executionEffort: UFix64)

// Event that is emitted when fee parameters change
access(all) event FeeParametersChanged(surgeFactor: UFix64, inclusionEffortCost: UFix64, executionEffortCost: UFix64)
```

# FlowStorageFees

The `FlowStorageFees` contract defines the parameters and utility methods for storage fees.

Source: [FlowStorageFees.cdc](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowStorageFees.cdc)

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0xf8d6e0586b0a20c7` |
| Cadence Testing Framework | `0x0000000000000001` |
| Testnet                   | `0x8c5303eaa26202d6` |
| Mainnet                   | `0xe467b9dd11fa00df` |

## Events

Important events for `FlowStorageFees` are:

```cadence
// Emitted when the amount of storage capacity an account has per reserved Flow token changes
access(all) event StorageMegaBytesPerReservedFLOWChanged(_ storageMegaBytesPerReservedFLOW: UFix64)

// Emitted when the minimum amount of Flow tokens that an account needs to have reserved for storage capacity changes.
access(all) event MinimumStorageReservationChanged(_ minimumStorageReservation: UFix64)
```
