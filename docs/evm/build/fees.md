---
title: Fees
sidebar_label: Fees
sidebar_position: 2
---

:::info

Are you a Cadence developer looking for information about Accounts on Cadence? If so, check out the Cadence specific documentation [here](../../build/basics/fees.md)

:::

# Fees

Transactions on FlowEVM use the FLOW token as the gas currency. For [Externally Owned Accounts (EOAs)](./accounts.md), the interface for paying gas on FlowEVM functions the same as other EVM networks.

## Technical Details

Transactions on FlowEVM are executed through Cadence, which uses FLOW token for gas. Therefore, each transaction on FlowEVM has its gas cost paid by the payer of the Cadence transaction that executes it. The account signing as the payer of the Cadence transaction therefore pays for gas of underlying FlowEVM transactions.

For transactions that are submitted to a FlowEVM RPC node, the RPC node wraps the EVM transaction in a Cadence transaction and signs that transaction as the Payer. The coinbase of the EVM transaction is set by the RPC node to an address it maintains, therefore billing the cost of the transaction to the address executing it.

![FlowEVM-RPC-Payer](flow-rpc-payer.drawio.png)

# How gas fees work on FlowEVM?

## Revisiting Transaction Fee on Flow

Transaction fees on Flow are described [here](https://developers.flow.com/build/basics/fees#fee-structure) in detail, but essentially, the fee is broken down into three components - 
1. `Inclusion Fee` - The fee that accounts for the resources required to process a transaction due to the transaction’s core properties (byte size, number of signatures)
2. `Execution Fee` - The fee that accounts for the operational cost of running the transaction script, processing the results, sending results for verification, generating verification receipts, etc.
3. `Surge' factor` - A multiplicative factor to dynamically account for network pressure and market conditions.

`Transaction fee = [inclusion fee + (execution effort * unit cost)] x surge`

where,
- Inclusion fee = 1E-6 FLOW This is currently constant.
- Execution fee is comprised of two components:
    - Execution Effort (computation) is a variable based on transaction type and functions/operations that are called during the execution of a transaction. The weights allocated to each function type are based on how “costly” (time consuming) they are. The following specification is used to calculate the execution effort units for a transaction on Flow.

    ```
    Execution effort (computation) =
            0.0239 * function_or_loop_call +
            0.0123 * GetValue +
            0.0117 * SetValue +
            43.2994 * CreateAccount
    ```

    - Unit cost

    ```
    Execution Effort Unit Cost = 4.99E-08 FLOW (currently constant)
    ```
- Surge = 1.0 (currently constant)

## Transaction fee on FlowEVM

With EVM on Flow, EVM operations can now be called within Flow Cadence transactions. EVM operations also have an associated effort measured in [gas](https://ethereum.org/developers/docs/gas) which needs to be factored into the execution effort calculation in addition to the Flow computation for any FlowEVM transaction.

The revised execution effort formula is,

```
Execution Effort =
    0.0239 * function_or_loop_call +
    0.0123 * GetValue +
    0.0117 * SetValue +
    43.2994 * CreateAccount +
    EVMGasUsageCost * EVMGasUsage
```
where,
- `EVMGasUsage` is reported by EVM as the cost in gas for executing the transaction within the EVM, for instance, 21K gas for a simple send transaction.
- `EVMGasUsageCost` -  To price EVM operations within Flow Cadence, a conversion factor between EVM gas and Flow computation (i.e., execution effort) needs to be defined. `EVMGasUsageCost` is that ratio.

We want to avoid changing the weights of the original model, so that we do not change the cost of transactions that do not use the new EVM features. Additionally, no other changes are made to the way the execution effort unit cost, inclusion fee, or surge fee is used to calculate the final transaction fee.

### EVMGasUsageCost

Looking through past EVM contract deployments, a robust estimate is that one Flow Cadence transaction should be able to fit up to 10M gas. For Cresendo PreviewNet launch therefore, given the current computation limit on Flow being 9999, we would use the conversion ratio of 1000 gas/computation. Thus EVMGasUsageCost will initially be fixed at 1/1000, but will be open for revision prior to the Mainnet launch and in future.

## Example

Assume a simple NFT transfer transaction that makes 31 cadence loop calls, reads 5668 bytes from the storage register, and saves 1668 bytes to the storage register.

- function_or_loop_call = 31

- GetValue = 5688

- SetValue = 1668

- CreateAccount = 0

**On Flow Cadence**

```
Execution Effort = 0.0239 * (31) + 0.0123 * (5668) + 0.0117 *(1668)  + 43.2994 *(0) + EVMGasUsageCost * EVMGasUsage
```

But since EVMGasUsage is 0 for a cadence (Flow) transaction, 

```
Execution Effort = 89.97
```

since
```
Transaction fee = [inclusion fee + (execution effort * unit cost)] x surge
```

thus
```
Transaction fee = [1E-6 FLOW + (89.97 * 4.99E-08 FLOW)] x 1 = 5.5E-06 FLOW
```

**On FlowEVM**

If the EVMGasUsage can be assumed to be 21,000 (typical for a simple transfer), 

```
Execution Effort = 0.0239 * (31) + 0.0123 * (5668) + 0.0117 *(1668)  + 43.2994 *(0) + 1/1000 * 21000 = 110.97
```

thus
```
Transaction fee = [1E-6 FLOW + (110.97 * 4.99E-08 FLOW)] x 1 = 6.54E-06 FLOW
```

Note: Please be aware that this example serves solely for illustrative purposes to elucidate the calculations. Actual transaction fees may differ due to various factors, including the byte size of the NFT. Updates will be made as additional FlowEVM mainnet data becomes available post-launch.
