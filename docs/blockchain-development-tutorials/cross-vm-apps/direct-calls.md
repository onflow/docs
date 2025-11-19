---
title: Direct Calls from Cadence to Flow EVM
sidebar_label: Direct Calls to Flow EVM
sidebar_position: 4
---

# Direct Calls from Cadence to Flow EVM

Direct calls from Cadence to Flow EVM are essential to allow Cadence smart contracts to interact seamlessly with the EVM environment hosted on the Flow blockchain. These calls facilitate a range of functionalities including state queries and transaction initiations, allowing Cadence contracts to leverage EVM-based tools and assets.

## Make direct calls

### Access Flow EVM

To interact with Flow EVM, Cadence contracts must first import `EVM` from its service address:

```js
import EVM from <ServiceAddress>
```

Next, create an `EVMAddress` with a sequence of 20 bytes that represents the EVM address:

```js
let addr = EVM.EVMAddress(bytes: bytes)
```

After you can access an `EVMAddress`, you can query various pieces of state information such as:

- `balance() EVM.Balance` provides the balance of the address. It returns a balance object rather than a basic type to avoid errors when it converts from flow to atto-flow.
- `nonce() UInt64` retrieves the nonce associated with the address.
- `code(): [UInt8]` fetches the code at the address; it returns the smart contract code if applicable, and is empty otherwise.

```cadence
import EVM from <ServiceAddress>

access(all)
fun main(bytes: [UInt8; 20]): EVM.Balance {
    let addr = EVM.EVMAddress(bytes: bytes)
    let bal = addr.balance()
    return bal
}
```

Alternatively, you can use the EVM contract's native deserialization to access the balance provided a hex string representing the address:

```cadence
import EVM from <ServiceAddress>

access(all)
fun main(addressHex: String): UFix64 {
    let addr = EVM.addressFromString(addressHex)
    return addr.balance().inFLOW()
}
```

### Send transactions to Flow EVM

To send transactions to Flow EVM, use the `run` function which executes RLP-encoded transactions. RLP (Recursive Length Prefix) encoding is used to efficiently encode data into a byte-array format, suitable for Ethereum-based environments. Here's an example of how to wrap and send a transaction:

```cadence
import EVM from <ServiceAddress>

transaction(rlpEncodedTransaction: [UInt8], coinbaseBytes: [UInt8; 20]) {

    prepare(signer: &Account) {
        let coinbase = EVM.EVMAddress(bytes: coinbaseBytes)
        let result = EVM.run(tx: rlpEncodedTransaction, coinbase: coinbase)
        assert(
            runResult.status == EVM.Status.successful,
            message: "tx was not executed successfully."
        )
    }
}
```

When you `run`, it restricts an EVM block to a single EVM transaction, while a future `batchRun` will offer the capability to execute multiple EVM transactions in a batch.

### Handle transaction responses

It's crucial that your function handles responses correctly to manage the state changes or errors that occur during `EVM` transactions:

When you call `EVM.run`, it's important to understand that this method does not revert the outer Flow transaction. Developers must therefore carefully handle the response based on the `result.Status` of the EVM transaction execution. There are three main outcomes to consider:

- `Status.invalid`: This status indicates that the transaction or call failed at the validation step, such as due to a nonce mismatch. Transactions with this status are not executed or included in a block, which means no state change occurs.
- `Status.failed`: This status is assigned when the transaction has technically succeeded in terms of being processable, but the EVM reports an error as the outcome, such as running out of gas. Importantly, a failed transaction or call is still included in a block. Any attempt to resubmit a failed transaction results in an `invalid` status on the second try due to a now incorrect nonce.
- `Status.successful`: This status appears when the transaction or call is successfully executed and the EVM doesn't report errors.

For scenarios where transaction validity is critical, developers may choose to use the `mustRun` variation, which reverts the transaction in the case of a validation failure. This provides an added layer of error handling.

### Understanding gas usage in EVM transactions

Direct calls to Flow EVM require gas. It's important to understand how gas usage is calculated and billed. During the execution of methods that interact with the EVM:

- **Gas Aggregation**: The gas that each call uses is aggregated throughout the transaction.
- **Gas Adjustment**: The total gas used is then adjusted based on a multiplier. This multiplier is determined by the network and the service account can adjust it to reflect operational costs and network conditions.
- **Payment of Gas Fees**: The adjusted total gas amount is added to the overall computation fees of the Flow transaction. The transaction initiator, commonly referred to as the payer, pays these fees.

## Keep learning

For more information and a deeper dive into the `EVMAddress`, `Result`, and `Status` objects, see [the contract here](https://github.com/onflow/flow-go/blob/master/fvm/evm/stdlib/contract.cdc).
