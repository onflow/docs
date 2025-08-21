---
title: Fees
sidebar_label: Fees
sidebar_position: 6
---

:::info

Are you a Cadence developer looking for information about Fees on Cadence? If so, check out the Cadence specific documentation [here](../build/cadence/basics/fees.md)

:::

EVM transactions are ultra low-cost and use the native FLOW token as gas. [Externally Owned Accounts (EOAs)](https://developers.flow.com/evm/build/cadence/accounts) function the same on Flow as other EVM networks like Ethereum.

<details>
<summary><h2>How Transaction Fees are Computed on EVM</h2></summary>

With Flow EVM, EVM operations can now be called within Cadence transactions. EVM operations also have an associated effort measured in gas which needs to be factored into the execution effort calculation in addition to the Flow computation for any EVM transaction.

```
Transaction fee on EVM = surge x [inclusion fee + (execution effort * unit cost)]
```

- `Surge' factor` dynamically accounts for network pressure and market conditions. This is currently constant at 1.0 but subject to change with community approval.
- `Inclusion fee` accounts for the resources required to process a transaction due to its core properties (byte size, signatures). This is currently constant at 1E-6 FLOW, but subject to change with community approval.
- `Execution fee` The fee that accounts for the operational cost of running the transaction script, processing the results, sending results for verification, generating verification receipts, etc. and is calculated as a product of `execution effort units` and the `cost per unit`.
  - `Execution Effort (computation)` is based on transaction type and operations that are called during the execution of a transaction. The weights determine how “costly” (time consuming) each operation is.
  - `Execution Effort Unit Cost` = `2.49E-07 FLOW` (currently constant, but subject to change with community approval)

<h3>Calculation of Execution Effort</h3>

```
Execution Effort (computation) =
    0.00478 * function_or_loop_call +
    0.00246 * GetValue +
    0.00234 * SetValue +
    8.65988 * CreateAccount +
    EVMGasUsageCost * EVMGasUsage
```

where

```
`EVMGasUsage` is reported by EVM as the cost in gas for executing the transaction within the EVM, for instance, 21K gas for a simple send transaction.
```

```
`EVMGasUsageCost` - The ratio that converts EVM gas into Flow computation units (execution effort) is currently set at `1/5000` but subject to revision by community approval
```

**Note**: The weights and unit cost mentioned above have been updated recently to accommodate an increased computation limit on Flow, which now supports the deployment of larger EVM contracts. For detailed information, refer to the relevant [FLIP](https://github.com/onflow/flips/blob/main/governance/20240508-computation-limit-hike.md) and join the ongoing discussion on the community [forum post](https://forum.flow.com/t/proposing-transaction-fee-changes-and-flow-evm-gas-charges-for-flow-crescendo-launch/5817). These values may be adjusted in the future based on community feedback and evolving requirements.

</details>

<details>
  <summary><h2>Demonstration of Transaction Fees on EVM</h2></summary>
  
Assume a simple NFT transfer transaction that makes 31 cadence loop calls, reads 5668 bytes from the storage register, and saves 1668 bytes to the storage register.

- 'function_or_loop_call' = 31
- 'GetValue' = 5688
- 'SetValue' = 1668
- 'CreateAccount' = 0

**Scenario 1 - Cadence-only Transaction**

```
Execution Effort = 0.00478 * (31) + 0.00246 * (5668) + 0.00234 *(1668)  + 8.65988 *(0) + EVMGasUsageCost * EVMGasUsage
```

But since `EVMGasUsage` is 0 for a Cadence transaction,

```
Execution Effort = 18.04378
```

Thus

```
Transaction fee = [1E-6 FLOW + (18.04378 * 2.49E-07 FLOW)] x 1 = 5.5E-06 FLOW
```

**Scenario 2 - EVM Transaction**
If the EVMGasUsage can be assumed to be 21,000 gas (typical for a simple transfer),

```
Execution Effort = 0.00478 * (31) + 0.00246 * (5668) + 0.00234 *(1668)  + 8.65988 *(0) + 1/5000 * 21000 = 22.24378
```

Thus

```
Transaction fee = [1E-6 FLOW + (110.97 * 2.49E-07 FLOW)] x 1 = 6.55E-06 FLOW
```

**Note**: Please be aware that this example serves solely for illustrative purposes to elucidate the calculations. Actual transaction fees may differ due to various factors, including the byte size of the transaction.

</details>

## Gasless Transactions

Fees needed to execute transactions on a Web3 app are often a major challenge for new users and can be a barrier to adoption. Builders can easily extend their apps with Cadence to create ‘gasless’ experiences by specifying their app as the [sponsor](../build/cadence/advanced-concepts/account-abstraction.md#sponsored-transactions) instead of the user.

To learn more about storage fee and transaction fee, visit [Flow Tokenomics page](https://flow.com/flow-tokenomics/technical-overview).
