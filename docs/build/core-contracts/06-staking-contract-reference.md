---
title: Flow Staking Contract Reference
sidebar_label: Staking Table
---

# Contract

The `FlowIDTableStaking` contract is the central table that manages staked nodes, delegation and rewards.

Source: [FlowIDTableStaking.cdc](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowIDTableStaking.cdc)

| Network           | Contract Address     |
| ----------------- | -------------------- |
| Emulator          | `0xf8d6e0586b0a20c7` |
| PreviewNet        | `0xb6763b4399a888c8` |
| Testnet/Crescendo | `0x9eca2b38b18b5dfe` |
| Mainnet           | `0x8624b52f9ddcd04a` |

# Transactions

## Getting Staking Info

These scripts are read-only and get info about the current state of the staking contract.

| ID        | Name                                       | Source |
|-----------|--------------------------------------------|--------|
|**`SC.01`**| Get Delegation Cut Percentage              | [idTableStaking/get_cut_percentage.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_cut_percentage.cdc) |
|**`SC.02`**| Get Minimum Stake Requirements             | [idTableStaking/get_stake_requirements.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_stake_requirements.cdc) |
|**`SC.03`**| Get Total Weekly Reward Payout             | [idTableStaking/get_weekly_payout.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_weekly_payout.cdc) |
|**`SC.04`**| Get Current Staked Node Table              | [idTableStaking/get_current_table.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_current_table.cdc) |
|**`SC.05`**| Get Proposed Staked Node Table             | [idTableStaking/get_proposed_table.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_proposed_table.cdc) |
|**`SC.06`**| Get Total Flow Staked                      | [idTableStaking/get_total_staked.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_total_staked.cdc) |
|**`SC.07`**| Get Total Flow Staked by Node Type         | [idTableStaking/get_total_staked_by_type.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_total_staked_by_type.cdc) | 
|**`SC.08`**| Get All Info about a single NodeID         | [idTableStaking/get_node_info.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_node_info.cdc) |
|**`SC.09`**| Get a node's total Commitment (delegators) | [idTableStaking/get_node_total_commitment.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_node_total_commitment.cdc) |
|**`SC.10`**| Get All Info about a single Delegator      | [idTableStaking/delegation/get_delegator_info.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/delegation/get_delegator_info.cdc) |
|**`SC.11`**| Get a node's total Commitment              | [idTableStaking/get_node_total_commitment_without_delegators.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_node_total_commitment_without_delegators.cdc) |

## Delegator Transactions

Documentation for delegating with tokens is described in the staking documentation
for [the staking collection](../../networks/staking/14-staking-collection.md)

# Events

The `FlowIDTableStaking` contract emits an event whenever an important action occurs.
See the [staking events Documentation](../../networks/staking/07-staking-scripts-events.md) for more information about each event.

```cadence
    access(all) event NewEpoch(totalStaked: UFix64, totalRewardPayout: UFix64)

    /// Node Events
    access(all) event NewNodeCreated(nodeID: String, role: UInt8, amountCommitted: UFix64)
    access(all) event TokensCommitted(nodeID: String, amount: UFix64)
    access(all) event TokensStaked(nodeID: String, amount: UFix64)
    access(all) event TokensUnstaking(nodeID: String, amount: UFix64)
    access(all) event TokensUnstaked(nodeID: String, amount: UFix64)
    access(all) event NodeRemovedAndRefunded(nodeID: String, amount: UFix64)
    access(all) event RewardsPaid(nodeID: String, amount: UFix64)
    access(all) event UnstakedTokensWithdrawn(nodeID: String, amount: UFix64)
    access(all) event RewardTokensWithdrawn(nodeID: String, amount: UFix64)

    /// Delegator Events
    access(all) event NewDelegatorCreated(nodeID: String, delegatorID: UInt32)
    access(all) event DelegatorTokensCommitted(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensStaked(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensUnstaking(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorTokensUnstaked(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorRewardsPaid(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorUnstakedTokensWithdrawn(nodeID: String, delegatorID: UInt32, amount: UFix64)
    access(all) event DelegatorRewardTokensWithdrawn(nodeID: String, delegatorID: UInt32, amount: UFix64)

    /// Contract Field Change Events
    access(all) event NewDelegatorCutPercentage(newCutPercentage: UFix64)
    access(all) event NewWeeklyPayout(newPayout: UFix64)
    access(all) event NewStakingMinimums(newMinimums: {UInt8: UFix64})
```
