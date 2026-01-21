---
title: Fees
sidebar_label: Fees
sidebar_position: 6
---

:::info

Are you a Cadence developer who wants information about Fees on Cadence? If so, check out the Cadence specific documentation [here](../cadence/basics/fees.md)

:::

# Fees

EVM transactions are ultra low-cost and use the native FLOW token as gas. [Externally Owned Accounts (EOAs)] function the same on Flow as other EVM networks like Ethereum.

<details>
<summary><h2>How Transaction Fees are Computed on EVM</h2></summary>

With Flow EVM, EVM operations can now be called within Cadence transactions. EVM operations also have an associated effort measured in gas which needs to be factored into the execution effort calculation in addition to the Flow computation for any EVM transaction.

```
Transaction fee on EVM = surge x [inclusion fee + (execution effort * unit cost)]
```

- `Surge' factor` dynamically accounts for network pressure and market conditions.
- `Inclusion fee` accounts for the resources required to process a transaction due to its core properties (byte size, signatures). This is currently constant at 1E-6 FLOW, but subject to change with community approval.
- `Execution fee` The fee that accounts for the operational cost of running the transaction script, processing the results, sending results for verification, generating verification receipts, and so on, and is calculated as a product of `execution effort units` and the `cost per unit`.
  - `Execution Effort (computation)` is based on transaction type and operations that are called during the execution of a transaction. The weights determine how costly (time consuming) each operation is.
  - `Execution Effort Unit Cost` = `4E-05 FLOW` (currently constant, but subject to change with community approval)

<h3>Calculation of Execution Effort</h3>

```
Execution Effort (computation) =
    3.271E+01 * create_account +
    2.348E+01 * blsverify_pop +
    7.408E+00 * get_account_balance +
    6.145E+00 * blsaggregate_public_keys +
    6.059E+00 * get_storage_capacity +
    5.726E+00 * get_account_available_balance +
    5.637E+00 * update_account_contract_code +
    4.964E+00 * blsaggregate_signatures +
    1.152E+00 * generate_account_local_id +
    5.000E-01 * get_account_contract_names +
    3.878E-01 * get_storage_used +
    3.770E-01 * account_keys_count +
    2.346E-01 * allocate_slab_index +
    1.348E-01 * atree_map_get +
    1.125E-01 * atree_map_remove +
    6.659E-02 * create_array_value +
    5.826E-02 * create_dictionary_value +
    5.579E-02 * atree_map_set +
    5.573E-02 * atree_array_insert +
    5.074E-02 * atree_map_read_iteration +
    4.442E-02 * encode_event +
    3.598E-02 * transfer_composite_value +
    2.910E-02 * atree_array_append +
    2.701E-02 * statement +
    2.650E-02 * atree_array_set +
    2.135E-02 * function_invocation +
    1.846E-02 * atree_map_pop_iteration +
    1.123E-02 * atree_array_pop_iteration +
    7.874E-03 * rlpdecoding +
    4.242E-03 * graphemes_iteration +
    3.922E-03 * ufix_parse +
    3.403E-03 * fix_parse +
    2.731E-03 * loop +
    2.701E-03 * atree_array_batch_construction +
    1.907E-03 * transfer_dictionary_value +
    1.053E-03 * big_int_parse +
    7.324E-04 * transfer_array_value +
    7.324E-04 * set_value +
    4.730E-04 * uint_parse +
    4.272E-04 * int_parse +
    3.510E-04 * get_value +
    7.629E-05 * string_to_lower +
    4.578E-05 * evmgas_usage
```

where

```
`evmgas_usage` is reported by EVM as the cost in gas for executing the transaction within the EVM, for instance, 21K gas for a simple send transaction.
```

</details>

<details>
  <summary><h2>Demonstration of Transaction Fees on EVM</h2></summary>
  
Assume a simple Token transfer transaction:

**Scenario 1 - Cadence-only Transaction**

The token transfer transaction: 

- makes 76 atree_map_get calls,
- reads 9431 bytes (get_value),
- sets 2448 bytes (set_value),
- invokes 55 cadence statements,
- makes 2 get_storage_used calls,
- makes 28 cadence function_invocation calls,
- makes 8	transfer_composite_value calls,
- makes 5	atree_map_set calls,
- makes 4	encode_event calls,
- makes 2	create_array_value calls,
- makes 2	atree_array_append calls,
- makes 4	atree_array_batch_construction calls,
- makes 2	loop calls,
- makes 2	transfer_array_value calls


```
Compute Units = 
    76 * 0.135 +
    9431 * 0.000 +
    2448 * 0.001 +
    55 * 0.027 +
    2 * 0.388 +
    28 * 0.021 +
    8 * 0.036 +
    5 * 0.056 +
    4 * 0.044 +
    2 * 0.067 +
    2 * 0.029 +
    4 * 0.003 +
    2 * 0.003 +
    2 * 0.001
```

But since `EVMGasUsage` is 0 for a Cadence transaction,

```
Compute Units = 19.2
```

Thus

```
Transaction fee = [1E-4 FLOW + (19.2 * 4E-05 FLOW)] x 1 = 8.68E-04
```

**Scenario 2 - EVM Transaction**
If the EVMGasUsage can be assumed to be 21,000 gas (typical for a simple transfer):

- uses 377806 evm gas (evmgas_usage),
- reads 22840 bytes (get_value),
- makes 1676 atree_array_batch_construction calls,
- makes 30 atree_map_get calls,
- makes 325 atree_array_pop_iteration calls,
- sets 3182 bytes (set_value),
- makes 273 rlpdecoding calls,
- makes 20 atree_map_read_iteration calls,
- makes 1329 transfer_array_value calls,
- invokes 25 cadence statements,
- makes 12 atree_map_set calls,
- makes 17 transfer_composite_value calls,
- makes 8 create_array_value calls,
- makes 19 function_invocation calls,
- makes 1 get_storage_used calls,
- makes 87 graphemes_iteration calls,
- makes 2 encode_event calls,
- makes 2 atree_array_append calls,
- makes 1 atree_map_pop_iteration calls,
- makes 2 loop calls,
- makes 40 string_to_lower calls


```
Compute Units =
    377806 * 0.00005 +
    22840 * 0.00035 +
    1676 * 0.00270 +
    30 * 0.13484 +
    325 * 0.01123 +
    3182 * 0.00073 +
    273 * 0.00787 +
    20 * 0.05074 +
    1329 * 0.00073 +
    25 * 0.02701 +
    12 * 0.05579 +
    17 * 0.03598 +
    8 * 0.06659 +
    19 * 0.02135 +
    1 * 0.38782 +
    87 * 0.00424 +
    2 * 0.04442 +
    2 * 0.02910 +
    1 * 0.01846 +
    2 * 0.00273 +
    40 * 0.00008
    = 47.8

```

Thus

```
Transaction fee = [1E-4 FLOW + (47.8 * 4E-05 FLOW)] x 1 = 2.012E-03 FLOW
```

:::info

Be aware that this example serves solely for illustrative purposes to elucidate the calculations. Actual transaction fees may differ due to various factors, such as the byte size of the transaction.

:::

</details>

## Gasless Transactions

Fees needed to execute transactions on a Web3 app are often a major challenge for new users and can be a barrier to adoption. To easily extend their apps with Cadence to create ‘gasless’ experiences, builders can specify their app as the [sponsor] instead of the user.

To learn more about storage fee and transaction fee, visit [Flow Tokenomics page].

<!-- Reference-style links, will not render on page. -->

[Externally Owned Accounts (EOAs)]: ./accounts.md
[sponsor]: ../cadence/advanced-concepts/account-abstraction.md#sponsored-transactions
[Flow Tokenomics page]: https://flow.com/flow-tokenomics/technical-overview).