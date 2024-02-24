# How gas fees work on Flow EVM?**

### ***Revisiting Transaction Fee on Flow***

Transaction Fee on Flow is broken down into three components - 
1. `Inclusion Fee` - The fee that accounts for the resources required to process a transaction due to the transaction’s core properties (byte size, number of signatures)
2. `Execution Fee` - The fee that accounts for the operational cost of running the transaction script, processing the results, sending results for verification, generating verification receipts, etc.
3. `Surge' factor` - A multiplicative factor to dynamically account for network pressure and market conditions.

`Transaction fee = [inclusion fee + (execution effort * unit cost)] x surge`

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
And
```
Execution Effort Unit Cost = 4.99E-08 FLOW (currently constant)
```
And
```
Surge = 1.0 (currently constant)
```

### Transaction fee on Flow EVM

With EVM on Flow, EVM operations can now be called within FVM transactions. EVM operations also have an associated effort measured in [gas](https://ethereum.org/developers/docs/gas) which needs to be factored into the execution effort calculation in addition to the Flow computation for any FlowEVM transaction.

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
- `EVMGasUsageCost` -  To price EVM operations within FVM, a conversion factor between EVM gas and FVM computation (i.e., execution effort) needs to be defined. `EVMGasUsageCost` is that ratio.

We want to avoid changing the weights of the original model, so that we do not change the cost of transactions that do not use the new EVM features. Additionally, no other changes are made to the way the execution effort unit cost, inclusion fee, or surge fee is used to calculate the final transaction fee.

### EVMGasUsageCost

Looking through past EVM contract deployments, a robust estimate is that one FVM transaction should be able to fit up to 10M gas. For Cresendo PreviewNet launch therefore, given the current computation limit on Flow being 9999, we would use the conversion ratio of 1000 gas/computation. Thus EVMGasUsageCost will initially be fixed at 1/1000, but will be open for revision prior to the Mainnet launch and in future.

## **Example**

Assume a simple hypothetical transaction that makes 2 cadence loop calls, reads 20 bytes from the storage register, saves 20 bytes to the storage register, and is called to create an account, thus -

function_or_loop_call = 2

GetValue = 20

SetValue = 20

CreateAccount = 1

**On Flow (FVM)**

Execution Effort = 0.0239 * (2) + 0.0123 * (20) + 0.0117 * (20) + 43.2994 * 1 + EVMGasUsageCost * EVMGasUsage

But since EVMGasUsage is 0 for a cadence (Flow) transaction, 

Execution Effort = 43.8272

***Transaction fee = [inclusion fee + (execution effort * unit cost)] x surge*** 

Thus Transaction fee = [1E-6 FLOW + (43.8272 * 4.99E-08 FLOW)] x 1 = 3.19E-06 FLOW

**On FlowEVM**

If the EVMGasUsage can be assumed to be 21,000 (typical for a simple transfer), 

Execution Effort = 0.0239 * (2) + 0.0123 * (20) + 0.0117 * (20) + 43.2994 * 1 + 1/1000 * 21000 = 64.8272

Thus Transaction fee = [1E-6 FLOW + (64.8272 * 4.99E-08 FLOW)] x 1 = 4.23E-06 FLOW
