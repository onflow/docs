---
title: Flow Staking Contract Reference
sidebar_position: 6
sidebar_label: Staking Table
description: Learn about Flow's staking contract (FlowIDTableStaking) that manages staked nodes, delegation, and rewards. Understand how to interact with staking functionality through transactions and scripts.
keywords:
  - staking contract
  - Flow staking
  - node staking
  - delegation
  - staking rewards
  - FlowIDTableStaking
  - staking scripts
  - staking events
  - node management
  - token delegation
  - staking table
  - epoch events
  - staking transactions
  - Flow protocol
  - staking requirements
---

## Contract

The `FlowIDTableStaking` contract is the central table that manages staked nodes, delegation and rewards.

Source: [FlowIDTableStaking.cdc](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowIDTableStaking.cdc)

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0xf8d6e0586b0a20c7` |
| Cadence Testing Framework | `0x0000000000000001` |
| Testnet                   | `0x9eca2b38b18b5dfe` |
| Mainnet                   | `0x8624b52f9ddcd04a` |

## Transactions and Scripts

Transactions for the staking contract are in the `flow-core-contracts` repo.
Developers and users are advised to use [the staking collection transactions](../../networks/staking/14-staking-collection.md)
to stake tokens instead of the basic transactions that are used for tests.

### Getting Staking Info with Scripts

These scripts are read-only and get info about the current state of the staking contract.

| ID          | Name                                       | Source                                                                                                                                                                                                            |
| ----------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`SC.01`** | Get Delegation Cut Percentage              | [idTableStaking/get_cut_percentage.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_cut_percentage.cdc)                                                     |
| **`SC.02`** | Get Minimum Stake Requirements             | [idTableStaking/get_stake_requirements.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_stake_requirements.cdc)                                             |
| **`SC.03`** | Get Total Weekly Reward Payout             | [idTableStaking/get_weekly_payout.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_weekly_payout.cdc)                                                       |
| **`SC.04`** | Get Current Staked Node Table              | [idTableStaking/get_current_table.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_current_table.cdc)                                                       |
| **`SC.05`** | Get Proposed Staked Node Table             | [idTableStaking/get_proposed_table.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_proposed_table.cdc)                                                     |
| **`SC.06`** | Get Total Flow Staked                      | [idTableStaking/get_total_staked.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_total_staked.cdc)                                                         |
| **`SC.07`** | Get Total Flow Staked by Node Type         | [idTableStaking/get_total_staked_by_type.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_total_staked_by_type.cdc)                                         |
| **`SC.08`** | Get All Info about a single NodeID         | [idTableStaking/get_node_info.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_node_info.cdc)                                                               |
| **`SC.09`** | Get a node's total Commitment (delegators) | [idTableStaking/get_node_total_commitment.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_node_total_commitment.cdc)                                       |
| **`SC.10`** | Get All Info about a single Delegator      | [idTableStaking/delegation/get_delegator_info.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/delegation/get_delegator_info.cdc)                                       |
| **`SC.11`** | Get a node's total Commitment              | [idTableStaking/get_node_total_commitment_without_delegators.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_node_total_commitment_without_delegators.cdc) |

### Delegator Transactions

Documentation for delegating with tokens is described in the staking documentation
for [the staking collection](../../networks/staking/14-staking-collection.md)

## Events

The `FlowIDTableStaking` contract emits an event whenever an important action occurs.
See the [staking events Documentation](../../networks/staking/07-staking-scripts-events.md) for more information about each event.

```cadence
    /// Epoch
    access(all) event NewEpoch(
        totalStaked: UFix64,
        totalRewardPayout: UFix64,
        newEpochCounter: UInt64
    )
    access(all) event EpochTotalRewardsPaid(
        total: UFix64,
        fromFees: UFix64,
        minted: UFix64,
        feesBurned: UFix64,
        epochCounterForRewards: UInt64
    )

    /// Node
    access(all) event NewNodeCreated(nodeID: String, role: UInt8, amountCommitted: UFix64)
    access(all) event TokensCommitted(nodeID: String, amount: UFix64)
    access(all) event TokensStaked(nodeID: String, amount: UFix64)
    access(all) event NodeTokensRequestedToUnstake(nodeID: String, amount: UFix64)
    access(all) event TokensUnstaking(nodeID: String, amount: UFix64)
    access(all) event TokensUnstaked(nodeID: String, amount: UFix64)
    access(all) event NodeRemovedAndRefunded(nodeID: String, amount: UFix64)
    access(all) event RewardsPaid(nodeID: String, amount: UFix64, epochCounter:  UInt64)
    access(all) event UnstakedTokensWithdrawn(nodeID: String, amount: UFix64)
    access(all) event RewardTokensWithdrawn(nodeID: String, amount: UFix64)
    access(all) event NetworkingAddressUpdated(nodeID: String, newAddress: String)
    access(all) event NodeWeightChanged(nodeID: String, newWeight: UInt64)

    /// Delegator
    access(all) event NewDelegatorCreated(nodeID: String, delegatorID: UInt32)
    access(all) event DelegatorTokensCommitted(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensStaked(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensRequestedToUnstake(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensUnstaking(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensUnstaked(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorRewardsPaid(nodeID: String, delegatorID: UInt32, amount: UFix64, epochCounter:  UInt64)
    access(all) event DelegatorUnstakedTokensWithdrawn(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorRewardTokensWithdrawn(nodeID: String, delegatorID: UInt32, amount: UFix64)

    /// Contract Fields
    access(all) event NewDelegatorCutPercentage(newCutPercentage: UFix64)
    access(all) event NewWeeklyPayout(newPayout: UFix64)
    access(all) event NewStakingMinimums(newMinimums: {UInt8: UFix64})
    access(all) event NewDelegatorStakingMinimum(newMinimum: UFix64)
```
