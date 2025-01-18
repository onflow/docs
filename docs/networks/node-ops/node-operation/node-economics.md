---
title: Node Economics
sidebar_label: Node Economics
description: Node Operator Economics - An illustration
sidebar_position: 8
---

Node operators play a crucial role in securing the Flow network. Here’s a simple example to illustrate what node operators can expect in terms of node economics.

## Node Operator Economics: An illustration


:::warning

This illustration is strictly to serve as an example. Actual numbers will vary based on several factors.

For real-time numbers, please refer to the [block explorer](https://www.flowscan.io/tokenomics).

:::


| # | Parameter  | Value | Explanation  |
| -------- | ------------- | ------------- | ------------- |
| A| Node Operator’s Stake  | 500,000 FLOW  | Assuming minimum staking requirements for a consensus node. Remember there’s no upper cap on how much FLOW can be staked to a Flow node.  |
| B| Delegation to node | 1,000,000 FLOW  | Funds that individual/ institutional delegators delegate to your node. Assuming 1M FLOW for this example.  |
| C | APY | 10%  | Subject to change based on total ecosystem stake in each epoch. Remember APY = R / S, where S = Total FLOW Staked / Total FLOW Supply and R = 5% (”reward rate”) |
| D | Delegation Rate | 8%  | Fee taken by the node operator from delegator rewards to cover their operating expenses, currently set at 8% of the rewards received by delegators. Note that the 8% fee is only applied to the staking reward, not to the tokens delegated. |
| E | Annual Staking Rewards | 50,000 FLOW  | Product of A x C; the number shown is annualized but is paid each epoch (week). |
| F | Annual Delegator Fee | 8,000 FLOW  | Product of B x C x D; ; the number shown is annualized but is paid each epoch (week). |
| G | Annual (Gross) Rewards | 58,000 FLOW  | Sum of E and F |
| H | COGS | 4,190 FLOW  | Assumed costs of running a consensus node in FLOW assuming 1US$/FLOW. The actual cost will vary depending on several factors such as self-hosted vs cloud, bare metal vs VM, the type of node, the FLOW exchange rate. |
| J | Net Annual Rewards | 53,810 FLOW  | G less H |

## Note

1. Each year, 5% of the total Flow supply is distributed as rewards to incentivize validators and delegators. While the total rewards for each epoch are fixed, the rewards for individual stakers vary depending on the amount they stake and the total funds delegated to their node.
2. All Flow node types follow the same economic principles, with the only difference being their minimum staking requirements. For details on the minimum stakes needed for each node type, see [here](https://flow.com/flow-tokenomics/technical-overview).

