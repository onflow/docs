# **How gas fees work on Flow EVM?**

### ***Revisiting Transaction Fee on Flow***

Transaction Fee on Flow is broken down into [three components](https://developers.flow.com/learn/concepts/variable-transaction-fees) - ‘*Inclusion Fee*’ that accounts for the resources required to process a transaction due to the transaction’s core properties (byte size, number of signatures); ‘Execution Fee’ that accounts for the operational cost of running the transaction script, processing the results, sending results for verification, generating verification receipt, etc; and a *Surge* factor as a multiplicative factor to dynamically account for network pressure and market conditions.

***Transaction fee = {inclusion fee + (execution effort * unit cost)} x surge***

- *Inclusion fee = `1E-6 FLOW` This is currently constant, but [dynamic inclusion fee FLIP](https://forum.onflow.org/t/flip-dynamic-inclusion-fees/3700) was proposed last year.*
- Execution fee is comprised of two components:
    - *Execution Effort (computation) is a variable based on transaction type and functions/operations that are called during the execution of a transaction , as* [explained here](https://github.com/onflow/flow/blob/c05d847adf2f6fb509e42c17020484d7dd3e89bd/flips/20220111-execution-effort.md). The weights allocated to each function type are based on how “costly” (time consuming) they are. *The following specification is used to calculate the execution effort units for a transaction on Flow.*
        
        ```flow
        Execution effort (computation) =
        0.0239 * function_or_loop_call +
        0.0123 * GetValue +
        0.0117 * SetValue +
        43.2994 * CreateAccount
        ```
        
    - *Execution Effort Unit Cost = `4.99E-08 FLOW` (currently constant)*
- *Surge = `1.0` (currently constant)*

### **Transaction fee on Flow EVM**

With Flow coming to EVM, EVM operations would now be called within FVM transactions. These operations need to have an associated cost otherwise the network is susceptible to resource exhaustion attacks. Conveniently EVM operations already have a measure of complexity, called “gas”. The missing piece for pricing EVM operations within FVM is the conversion factor between EVM gas and FVM computation (i.e., execution effort).

With the addition of a new weight `EVMGasUsage`, we would amend the calculation of execution effort for all transactions in the following way-

```flow
Execution Effort =
    0.0239 * function_or_loop_call +
    0.0123 * GetValue +
    0.0117 * SetValue +
		43.2994 * CreateAccount +
	  EVMGasUsageCost * EVMGasUsage
```

We want to avoid changing the weights of the original model, so that we do not change the cost of transactions that do not use the new EVM features. Additionally, no other changes are made to the way the execution effort unit cost, inclusion fee, or surge fee is used to calculate the final transaction fee.

While `EVMGasUsage` is supplied by EVM (for instance 21K gas for a simple send transaction),  `EVMGasUsageCost` is the ratio of converting EVM gas to Flow’s computation units. Looking through past EVM contract deployments (like the ones mentioned [here](https://mirror.xyz/dexyz.eth/XJob_zNpiMnIb9mTLj8Bq6GvP8apzYwjEHPGtYXxuWY)), a robust estimate is that one FVM transaction should be able to fit up to 10M gas. For Cresendo PreviewNet launch therefore, given the current computation limit on Flow being 9999, we would use the conversion ratio of 1000 gas/computation. Thus `EVMGasUsageCost` will initially be fixed at `1/1000`, but will be open for revision prior to the Mainnet launch and in future.

## **Example**

Assume a simple hypothetical transaction that makes 2 cadence loop calls, reads 20 bytes from the storage register, saves 20 bytes to the storage register, and is called to create an account, thus -

`function_or_loop_call` = 2

`GetValue` = 20

`SetValue` = 20

`CreateAccount` = 1

**On Flow (FVM)**

<aside>
Execution Effort = 0.0239 * (2) + 0.0123 * (20) + 0.0117 * (20) + 43.2994 * 1 + EVMGasUsageCost * EVMGasUsage

</aside>

But since EVMGasUsage is 0 for a cadence (Flow) transaction, 

`Execution Effort = 43.8272`

> Transaction fee = {inclusion fee + (execution effort * unit cost)} x surge
> 

Thus Transaction fee = {`1E-6 FLOW` + (`43.8272` * `4.99E-08 FLOW`)} x 1 = `3.19E-06 FLOW`

**On Flow on EVM**

If the EVMGasUsage can be assumed to be 21000 (typical for a simple transfer), 

<aside>
💡 Execution Effort = 0.0239 * (2) + 0.0123 * (20) + 0.0117 * (20) + 43.2994 * 1 + 1/1000 * 21000

</aside>

`Execution Effort = 64.8272`

Thus Transaction fee = {`1E-6 FLOW` + (`64.8272` * `4.99E-08 FLOW`)} x 1 = `4.23E-06 FLOW`
