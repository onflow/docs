---
title: Query Staking Info with Scripts or Events
sidebar_label: Staking Scripts and Events
---

# Introduction

The staking contract stores a lot of different state, and the state is constantly changing.
As an external party, there are two ways to keep track of these state changes.
You can either use Cadence scripts to query the state of the contract at any given time,
or you can monitor events that are emitted by the staking contract to be notified of any important occurances.

# Query Information with Scripts

## Get the list of proposed nodes for the next epoch:

`FlowIDTableStaking.getProposedNodeIDs()`: Returns an array of node IDs for proposed nodes.
Proposed nodes are nodes that have enough staked and committed for the next epoch
to be above the minimum requirement and have been selected to participate in the next epoch.
This means that new access nodes that have not been selected with the random slot selection algorithm
will not be included in this list.

You can use the **Get Proposed Table**([SC.05](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script for retrieving this info.

This script requires no arguments.

## Get the list of all nodes that are currently staked:

`FlowIDTableStaking.getStakedNodeIDs()` and ``FlowIDTableStaking.getParticipantNodeList()`:
Returns an array of nodeIDs that are currently staked.
Staked nodes are nodes that are staked and participating in the current epoch.

You can use the **Get Current Table**([SC.04](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script for retrieving this info.

This script requires no arguments.

## Get the list of all Candidate Nodes

`getCandidateNodeList(): {UInt8: {String: Bool}}`:
Returns a dictionary of nodes that are candidates to stake in the next epoch
but are not staked in the current epoch.

You can use the [**Get Candidate Node List**](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowIDTableStaking.cdc#L1762) script for retrieving this info.

This script requires no arguments.

## Get all of the info associated with a single node staker:

`FlowIDTableStaking.NodeInfo(nodeID: String)`: Returns a `NodeInfo` struct with all of the metadata
associated with the specified node ID. You can see the `NodeInfo` definition in the [FlowIDTableStaking
smart contract.](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowIDTableStaking.cdc#L254)

You can use the **Get Node Info**([SC.08](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script
with the following arguments:

| Argument   | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| **nodeID** | `String` | The node ID of the node to search for. |

You can also query the info from an address that uses the staking collection by using the **Get Node Info From Address**([SCO.15](../../build/cadence/core-contracts/11-staking-collection.md#scripts)) script
with the following arguments:

| Argument    | Type      | Description                                        |
| ----------- | --------- | -------------------------------------------------- |
| **address** | `Address` | The address of the account that manages the nodes. |

## Get the total committed balance of a node (with delegators):

`FlowIDTableStaking.NodeInfo(_ nodeID: String).totalCommittedWithDelegators()`: Returns the total committed balance for a node,
which is their total tokens staked + committed, plus all of the staked + committed tokens of all their delegators.

You can use the **Get Node Total Commitment**([SC.09](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script
with the following argument:

| Argument   | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| **nodeID** | `String` | The node ID of the node to search for. |

## Get the total committed balance of a node (without delegators):

`FlowIDTableStaking.NodeInfo(_ nodeID: String).totalCommittedWithoutDelegators()`: Returns the total committed balance for a node,
which is their total tokens staked + committed, plus all of the staked + committed tokens of all their delegators.

You can use the **Get Only Node Total Commitment**([SC.11](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script
with the following argument:

| Argument   | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| **nodeID** | `String` | The node ID of the node to search for. |

## Get all the info associated with a single delegator:

`FlowIDTableStaking.DelegatorInfo(nodeID: String, delegatorID: UInt32)`: Returns a `DelegatorInfo` struct with all of the metadata
associated with the specified node ID and delegator ID. You can see the `DelegatorInfo` definition in the [FlowIDTableStaking
smart contract.](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowIDTableStaking.cdc#L375)

You can use the **Get Delegator Info**([SC.10](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts))
script with the following arguments:

| Argument        | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| **nodeID**      | `String` | The node ID that the delegator delegates to. |
| **delegatorID** | `String` | The ID of the delegator to search for.       |

You can also query the info from an address by using the **Get Delegator Info From Address**([SCO.16](../../build/cadence/core-contracts/11-staking-collection.md#scripts)) script
with the following arguments:

| Argument    | Type      | Description                                            |
| ----------- | --------- | ------------------------------------------------------ |
| **address** | `Address` | The address of the account that manages the delegator. |

## Get the delegation cut percentage:

`FlowIDTableStaking.getRewardCutPercentage(): UFix64`: Returns a `UFix64` number for the cut of delegator rewards that each node operator takes.

You can use the **Get Cut Percentage**([SC.01](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script to retrieve this info.

This script requires no arguments.

## Get the minimum stake requirements:

`FlowIDTableStaking.getMinimumStakeRequirements(): {UInt8: UFix64}`: Returns a mapping
for the stake requirements for each node type.

You can use the **Get stake requirements**([SC.02](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script to retrieve this info.

This script requires no arguments.

## Get the total weekly reward payout:

`FlowIDTableStaking.getEpochTokenPayout(): UFix64`: Returns a `UFix64` value for the total number of FLOW paid out each epoch (week).

You can use the **Get weekly payout**([SC.03](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script to retrieve this info.

This script requires no arguments.

## Get the total FLOW staked:

You can use the **Get total FLOW staked**([SC.06](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script to retrieve this info.

This script requires no arguments.

## Get the total FLOW staked by all the nodes of a single node role:

You can use the **Get total FLOW staked by node type**([SC.07](../../build/cadence/core-contracts/06-staking-contract-reference.md#getting-staking-info-with-scripts)) script
with the following arguments:

| Argument     | Type    | Description                     |
| ------------ | ------- | ------------------------------- |
| **nodeType** | `UInt8` | The type of node to search for. |

# Staking Events

Staking events can be queried using the Go or JavaScript SDKs to extract useful notifications and information about the
state of the staking process.

## Global Staking and Epoch Events

### NewEpoch

```cadence
access(all) event NewEpoch(totalStaked: UFix64, totalRewardPayout: UFix64, newEpochCounter: UInt64)
```

| Field             | Type   | Description                                                            |
| ----------------- | ------ | ---------------------------------------------------------------------- |
| totalStaked       | UFix64 | The total number of tokens staked for the new Epoch                    |
| totalRewardPayout | UFix64 | The total number of tokens that will be paid as rewards for this epoch |
| newEpochCounter   | UInt64 | The epoch counter for this new epoch                                   |

Emitted by `FlowIDTableStaking.Admin.moveTokens()` when the tokens are moved between pools, which signals a new epoch.

### NewWeeklyPayout

```cadence
access(all) event NewWeeklyPayout(newPayout: UFix64)
```

| Field     | Type   | Description                                                        |
| --------- | ------ | ------------------------------------------------------------------ |
| newPayout | UFix64 | The new number of tokens that will be paid at the end of the epoch |

Emitted by `FlowIDTableStaking.Admin.setEpochTokenPayout()` when the Admin changes the total tokens paid at the end of the epoch.

After this event the `epochTokenPayout` is equal to the new value.

## Node Events

These are events that concern the operation of a node.

### NewNodeCreated

```cadence
access(all) event NewNodeCreated(nodeID: String, role: UInt8, amountCommitted: UFix64)
```

| Field           | Type   | Description                                                                              |
| --------------- | ------ | ---------------------------------------------------------------------------------------- |
| nodeID          | String | The unique ID string for the node. 32 bytes. Usually the hash of the node's public key.  |
| role            | UInt8  | The node's role type. From 1 to 5 inclusive.                                             |
| amountCommitted | UFix64 | The amount of FLOW tokens staked to register the node. This is determined by the `role`. |

Emitted by `FlowIDTableStaking.NodeRecord.init()` when a new node is successfully created.

After this event is emitted for your node, you can begin to perform staking transactions using it.

### NodeRemovedAndRefunded

```cadence
access(all) event NodeRemovedAndRefunded(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of FLOW tokens returned to the node.                                                                 |

Emitted by `FlowIDTableStaking.Admin.endStakingAuction()` if the node is being removed from the next epoch
due to a failure to meet the minimum requirements of committed tokens for the next epoch.

After this event, the refunded FLOW tokens will be part of the node's `tokensUnstaked` balance.

## Token Events

These are events that concern the direct usage of FLOW tokens - staking or unstaking locked tokens, withdrawing rewards, etc.

Events emitted when using delegation are described in the next section.

### TokensCommitted

```cadence
access(all) event TokensCommitted(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of additional FLOW tokens committed to the node.                                                     |

Emitted whenever additional tokens are staked on the node for the following epoch. Specifically:

1. By `FlowIDTableStaking.NodeStaker.stakeNewTokens()` when new tokens (tokens that have not previously been staked) are added to the system
   to stake on the node during the next epoch.
2. By `FlowIDTableStaking.NodeStaker.stakeUnstakedTokens()` when unstaked tokens (tokens that were previously staked and then unstaked)
   are staked again with the node for the next epoch.
3. By `FlowIDTableStaking.NodeStaker.stakeRewardedTokens()` when reward tokens (tokens paid in return for previous staking)
   are staked with the node for the next epoch.

After this event, the FLOW tokens will be part of the node's `tokensCommitted` balance.

### TokensStaked

```cadence
access(all) event TokensStaked(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of FLOW tokens staked to the node.                                                                   |

Emitted by `FlowIDTableStaking.Admin.moveTokens()` at the end of an epoch if committed tokens are being added to the node's tokensStaked balance.

After this event, the tokens will be part of the node's staked balance.

### TokensUnstaking

```cadence
access(all) event TokensUnstaking(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of FLOW tokens unstaked from the node.                                                               |

Emitted by `FlowIDTableStaking.Admin.moveTokens()` at the end of an epoch if
a node operator's staked tokens are being unstaked in response to a request from the node operator.
After this event, the tokens will be a part of the node operator's `tokensUnstaking` balance, where they are held for a whole epoch "unstaking period" with no rewards.

### TokensUnstaked

```cadence
access(all) event TokensUnstaked(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of FLOW tokens unstaked from the node.                                                               |

Emitted by `FlowIDTableStaking.NodeStaker.requestUnstaking()` and `FlowIDTableStaking.Admin.moveTokens()`
when tokens are deposited into the `tokensUnstaked` pool:

### RewardsPaid

```cadence
access(all) event RewardsPaid(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of FLOW tokens paid to the node this epoch as a reward.                                              |

Emitted by `FlowIDTableStaking.Admin.payRewards()` at the end of the epoch to pay rewards to node operators based on the tokens that they have staked.

After this event, the reward tokens will be part of the node's tokensRewarded balance.

The Delegator rewards are paid at the same time, see `DelegatorRewardsPaid` below.

### UnstakedTokensWithdrawn

```cadence
access(all) event UnstakedTokensWithdrawn(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of unstaked FLOW tokens that the node operator is withdrawing.                                       |

Emitted by `FlowIDTableStaking.NodeStaker.withdrawUnstakedTokens()` when the node operator calls that function to withdraw part or all of their
unstaked tokens balance.

After this event, the FLOW tokens will be withdrawn to a newly created `FungibleToken.Vault` which the caller can deposit to the vault of their choice.

### RewardTokensWithdrawn

```cadence
access(all) event RewardTokensWithdrawn(nodeID: String, amount: UFix64)
```

| Field  | Type   | Description                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| amount | UFix64 | The amount of rewarded FLOW tokens that the node operator is withdrawing.                                       |

Emitted by `FlowIDTableStaking.NodeStaker.withdrawRewardedTokens()` when the node operator calls that function to withdraw part or all of their
reward tokens balance.

After this event, the FLOW tokens will be withdrawn to a newly created `FungibleToken.Vault` which the caller can deposit to the vault of their choice.

## Delegator Events

These are events that concern FLOW token delegation.

### NewDelegatorCreated

```cadence
access(all) event NewDelegatorCreated(nodeID: String, delegatorID: UInt32)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UFix64 | The ID for the new delegator. Unique within the node but not globally.                                          |

Emitted by `FlowIDTableStaking.Admin.registerNewDelegator()` when the node operator registers a new delegator for the node.

Note that the delegatorID is unique within the node but is not globally unique.

After this event, the new delegator is registered with the node.

### DelegatorTokensCommitted

```cadence
access(all) event DelegatorTokensCommitted(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UInt32 | The ID for the delegator.                                                                                       |
| amount      | UFix64 | The amount of additional FLOW tokens committed to the node.                                                     |

Emitted whenever additional tokens are committed for a delegator for the following epoch. Specifically:

1. By `FlowIDTableStaking.NodeDelegator.delegateNewTokens()` when new tokens (tokens that have not previously been staked) are added to the system
   to stake with the delegator during the next epoch.
2. By `FlowIDTableStaking.NodeDelegator.delegateUnstakedTokens()` when unstaked tokens (tokens that were previously staked and then unstaked)
   are staked again with the delegator for the next epoch.
3. By `FlowIDTableStaking.NodeDelegator.delegateRewardedTokens()` when reward tokens (tokens paid in return for previous staking)
   are staked with the delegator for the next epoch.

After this event, the FLOW tokens will be part of the delegator's `tokensCommitted` balance.

### DelegatorTokensStaked

```cadence
access(all) event DelegatorTokensStaked(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UInt32 | The ID for the delegator.                                                                                       |
| amount      | UFix64 | The amount of FLOW tokens staked to the node.                                                                   |

Emitted by `FlowIDTableStaking.Admin.moveTokens()` at the end of an epoch if committed tokens are being added to the delegator's tokensStaked balance.

After this event, the tokens will be part of the delegator's staked balance.

### DelegatorTokensUnstaking

```cadence
access(all) event DelegatorTokensUnstaking(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UInt32 | The ID for the delegator.                                                                                       |
| amount      | UFix64 | The amount of FLOW tokens unstaked from the node.                                                               |

Emitted by `FlowIDTableStaking.Admin.moveTokens()` at the end of an epoch if
a delegator's staked tokens are being unstaked in response to a request from the delegator.
After this event, the tokens will be a part of the delegator's `tokensUnstaking` balance, where they are held for a whole epoch "unstaking period" with no rewards.

### DelegatorTokensUnstaked

```cadence
access(all) event DelegatorTokensUnstaked(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UInt32 | The ID for the delegator.                                                                                       |
| amount      | UFix64 | The amount of FLOW tokens unstaked from the node.                                                               |

Emitted by `FlowIDTableStaking.NodeDelegator.requestUnstaking()` and `FlowIDTableStaking.Admin.moveTokens()`
when tokens are deposited into the delegator's `tokensUnstaked` pool:

### DelegatorRewardsPaid

```cadence
access(all) event DelegatorRewardsPaid(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UFix64 | The ID for the delegator. Unique within the node but not globally.                                              |
| amount      | UFix64 | The amount of rewarded FLOW tokens that the delegator is paid.                                                  |

Emitted by `FlowIDTableStaking.Admin.payRewards()` at the end of an epoch when rewards are being paid.

After this event is emitted, the reward tokens will be part of the delegator's tokensRewarded balance.

The Node rewards are paid at the same time, see `RewardsPaid` above.

### DelegatorUnstakedTokensWithdrawn

```cadence
access(all) event DelegatorUnstakedTokensWithdrawn(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UFix64 | The ID for the delegator. Unique within the node but not globally.                                              |
| amount      | UFix64 | The amount of unstaked FLOW tokens that the delegator is withdrawing.                                           |

Emitted by `FlowIDTableStaking.NodeDelegator.withdrawUnstakedTokens()` when the delegator calls that function to withdraw part or all of their
unstaked tokens balance.

After this event, the FLOW tokens will be withdrawn to a newly created `FungibleToken.Vault` which the caller can deposit to the vault of their choice.

### DelegatorRewardTokensWithdrawn

```cadence
access(all) event DelegatorRewardTokensWithdrawn(nodeID: String, delegatorID: UInt32, amount: UFix64)
```

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| nodeID      | String | The unique ID string for the node. 32 bytes. The same value emitted in the `NewNodeCreated` event for the node. |
| delegatorID | UFix64 | The ID for the delegator. Unique within the node but not globally.                                              |
| amount      | UFix64 | The amount of rewarded FLOW tokens that the delegator is withdrawing.                                           |

Emitted by `FlowIDTableStaking.NodeDelegator.withdrawRewardedTokens()` when the delegator calls that function to withdraw part or all of their
unstaked tokens balance.

After this event, the FLOW tokens will be withdrawn to a newly created `FungibleToken.Vault` which the caller can deposit to the vault of their choice.
