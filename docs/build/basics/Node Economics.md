# Node Operator Economics: An Illustration

| # | Parameter  | Value | Explanation  |
| -------- | ------------- | ------------- | ------------- |
| A| Node Operator’s Stake  | 500,000 FLOW  | Assuming minimum staking requirements for a consensus node. Remember there’s no upper cap on how much FLOW can be staked to a Flow node  |
| B| Delegation to node | 1,000,000 FLOW  | Funds that individual/ institutional delegators delegate to your node. Assuming 1M FLOW for this example.  |
| C | APY | 10%  | Subject to change based on total ecosystem stake in each epoch. Remember APY = R / S, where S = Total FLOW Staked / Total FLOW Supply and R = 5% (”reward rate”) |
| D | Delegation Rate | 8%  | Fee taken by the node operator from delegator rewards to cover their operating expenses, currently set at 8% of the rewards received by delegators. Note that the 8% fee is only applied to the staking reward, not to the tokens delegated. |
| E | Annual Staking Rewards | 50,000 FLOW  | Product of A x C; the number shown is annualized but is paid each epoch (week) |
| F | Annual Delegator Fee | 8,000 FLOW  | Product of B x C x D; ; the number shown is annualized but is paid each epoch (week) |
| G | Annual (Gross) Rewards | 58,000 FLOW  | Sum of E and F |
| H | COGS | 4,190 FLOW  | Assumed costs of running a consensus node in FLOW assuming 1US$/FLOW. The actual cost will vary depending on several factors such as self-hosted vs cloud, bare metal vs VM, the type of node, the FLOW exchange rate |
| J | Net Annual Rewards | 53,810 FLOW  | G less H |

## Things to Remember

1. Each year, 5% of the total Flow supply is distributed as rewards to incentivize validators and delegators. While the total rewards for each epoch are fixed, the rewards for individual stakers vary depending on the amount they stake and the total funds delegated to their node.
2. The node type you choose to operate or delegate to doesn’t impact your weekly rewards, except for the difference in minimum staking requirements among various node types. Your primary influence over your rewards is the number of tokens that are staked by you or are delegated to your node by others. The more the total stake, the greater your rewards.
3. Due to the variability in multiple factors, it’s impossible to provide a precise expected return for individual stakers on a weekly or yearly basis. To estimate your returns, you can use the provided sample table and calculate profitability by mainly altering the values of A and B.
4. Precise estimation of FLOW rewards is only possible at the start of an epoch in which you participate. The APY for an epoch depends on the total ecosystem stake relative to the total Flow supply (stake%). Since this is determined by the collective stake of thousands of stakers and delegators across the ecosystem, exact figures cannot be known in advance.
