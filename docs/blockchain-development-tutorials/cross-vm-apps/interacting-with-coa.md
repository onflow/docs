---
title: Interacting with COAs from Cadence
sidebar_label: Interacting with COAs
sidebar_position: 5
---

[Cadence Owned Accounts (COAs)](../../build/evm/accounts.md#cadence-owned-accounts) are EVM accounts owned by a Cadence resource and
are used to interact with Flow EVM from Cadence.

COAs expose two interfaces for interaction: one on the Cadence side and one on the EVM side. In this guide, we will
focus on how to interact with COAs with Cadence.

In this guide we will walk through some basic examples creating and interacting with a COA in Cadence. Your specific
usage of the COA resource will depend on your own application's requirements (e.g. the COA resource may not live
directly in `/storage/evm` as in these examples, but may instead be a part of a more complex resource structure).

## COA Interface

To begin, we can take a look at a simplified version of the `EVM` contract, highlighting parts specific to COAs.

You can learn more about the `EVM` contract [here](../../build/cadence/core-contracts/13-evm.md) and the full contract code can
be found on [GitHub](https://github.com/onflow/flow-go/tree/master/fvm/evm/stdlib/contract.cdc).

```cadence EVM.cdc
access(all)
contract EVM {
    //...
    access(all)
    resource CadenceOwnedAccount: Addressable {
        /// The EVM address of the cadence owned account
        /// -> could be used to query balance, code, nonce, etc.
        access(all)
        view fun address(): EVM.EVMAddress

        /// Get balance of the cadence owned account
        /// This balance
        access(all)
        view fun balance(): EVM.Balance

        /// Deposits the given vault into the cadence owned account's balance
        access(all)
        fun deposit(from: @FlowToken.Vault)

        /// The EVM address of the cadence owned account behind an entitlement, acting as proof of access
        access(EVM.Owner | EVM.Validate)
        view fun protectedAddress(): EVM.EVMAddress

        /// Withdraws the balance from the cadence owned account's balance
        /// Note that amounts smaller than 10nF (10e-8) can't be withdrawn
        /// given that Flow Token Vaults use UFix64s to store balances.
        /// If the given balance conversion to UFix64 results in
        /// rounding error, this function would fail.
        access(EVM.Owner | EVM.Withdraw)
        fun withdraw(balance: EVM.Balance): @FlowToken.Vault

        /// Deploys a contract to the EVM environment.
        /// Returns the address of the newly deployed contract
        access(EVM.Owner | EVM.Deploy)
        fun deploy(
            code: [UInt8],
            gasLimit: UInt64,
            value: Balance
        ): EVM.EVMAddress

        /// Calls a function with the given data.
        /// The execution is limited by the given amount of gas
        access(EVM.Owner | EVM.Call)
        fun call(
            to: EVMAddress,
            data: [UInt8],
            gasLimit: UInt64,
            value: Balance
        ): EVM.Result
    }

    // Create a new CadenceOwnedAccount resource
    access(all)
    fun createCadenceOwnedAccount(): @EVM.CadenceOwnedAccount
    // ...
}
```

## Importing the EVM Contract

The `CadenceOwnedAccount` resource is a part of the `EVM` system contract, so to use any of these functions, you will
need to begin by importing the `EVM` contract into your Cadence code.

To import the `EVM` contract into your Cadence code using the simple import syntax, you can use the following format
(learn more about configuring contracts in `flow.json`
[here](../../build/tools/flow-cli/flow.json/configuration.md#contracts)):

```cadence
// This assumes you are working in the in the Flow CLI, FCL, or another tool that supports this syntax
// The contract address should be configured in your project's `flow.json` file
import "EVM"
// ...
```

However, if you wish to use manual address imports instead, you can use the following format:

```cadence
// Must use the correct address based on the network you are interacting with
import EVM from 0x1234
// ...
```

To find the deployment addresses of the `EVM` contract, you can refer to the [EVM contract
documentation](../../build/cadence/core-contracts/13-evm.md).

## Creating a COA

To create a COA, we can use the `createCadenceOwnedAccount` function from the `EVM` contract. This function takes no
arguments and returns a new `CadenceOwnedAccount` resource which represents this newly created EVM account.

For example, we can create this COA in a transaction, saving it to the user's storage and publishing a public capability
to its reference:

```cadence create_coa.cdc
import "EVM"

// Note that this is a simplified example & will not handle cases where the COA already exists
transaction() {
    prepare(signer: auth(SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        let storagePath = /storage/evm
        let publicPath = /public/evm

        // Create account & save to storage
        let coa: @EVM.CadenceOwnedAccount <- EVM.createCadenceOwnedAccount()
        signer.storage.save(<-coa, to: storagePath)

        // Publish a public capability to the COA
        let cap = signer.capabilities.storage.issue<&EVM.CadenceOwnedAccount>(storagePath)
        signer.capabilities.publish(cap, at: publicPath)
    }
}
```

### Creating a Cadence Account and COA together

It is possible to create a new Cadence account and COA within the same transaction. This transaction will need to be signed and paid for by another account, but any account will do. A common process is to set up a backend service to handle this function.

:::info

During the singular transaction in which an account is created, the `AuthAccount` object for the newly created account is present. As a result, the creating account can access and modify the new account's storage **only** during this transaction.

:::

First, you'll need to use the CLI to [generate keys](../../build/tools/flow-cli/keys/generate-keys.md) for the new account. Then, simply run the following transaction to create the Cadence Account and COA at once.

:::warning

This is a very minimal example. You may wish to set up vaults and perform other actions during account creation.

:::

```cadence
import Crypto

transaction(publicKeys: [Crypto.KeyListEntry]) {
    prepare(signer: auth(BorrowValue) &Account) {

        let newAccount = Account(payer: signer)

        for key in publicKeys {
            newAccount.keys.add(publicKey: key.publicKey, hashAlgorithm: key.hashAlgorithm, weight: key.weight)
        }

        let coa <- EVM.createCadenceOwnedAccount()
        let coaPath = /storage/evm
        newAccount.storage.save(<-coa, to: coaPath)
        let coaCapability = newAccount.capabilities.storage.issue<&EVM.CadenceOwnedAccount>(coaPath)
        newAccount.capabilities.publish(coaCapability, at: /public/evm)
    }
}
```

## Getting the EVM Address of a COA

To get the EVM address of a COA, you can use the `address` function from the `EVM` contract. This function returns the
EVM address of the COA as an `EVM.Address` struct. This struct is used to represent addresses within Flow EVM and can
also be used to query the balance, code, nonce, etc. of an account.

For our example, we could query the address of the COA we just created with the following script:

```cadence get_coa_address.cdc
import "EVM"

access(all)
fun main(address: Address): EVM.EVMAddress {
    // Get the desired Flow account holding the COA in storage
    let account = getAuthAccount<auth(Storage) &Account>(address)

    // Borrow a reference to the COA from the storage location we saved it to
    let coa = account.storage.borrow<&EVM.CadenceOwnedAccount>(
        from: /storage/evm
    ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
        .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))

    // Return the EVM address of the COA
    return coa.address()
}
```

If you'd prefer the hex representation of the address, you instead return using the `EVMAddress.toString()` function:

```cadence
return coa.address().toString()
```

The above will return the EVM address as a string; however note that Cadence does not prefix hex strings with `0x`.

## Getting the Flow Balance of a COA

Like any other Flow EVM or Cadence account, COAs possess a balance of FLOW tokens. To get the current balance of our
COA, we can use the COA's `balance` function. It will return a `EVM.Balance` struct for the account - these are used to
represent balances within Flow EVM.

This script will query the current balance of our newly created COA:

```cadence get_coa_balance.cdc
import "EVM"

access(all)
fun main(address: Address): EVM.Balance {
    // Get the desired Flow account holding the COA in storage
    let account = getAuthAccount<auth(Storage) &Account>(address)

    // Borrow a reference to the COA from the storage location we saved it to
    let coa = account.storage.borrow<&EVM.CadenceOwnedAccount>(
        from: /storage/evm
    ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
        .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))

    // Get the current balance of this COA
    return coa.balance()
}
```

You can also easily get the `UFix64` FLOW balance of any EVM address with this script:

```cadence get_coa_balance_as_ufix64.cdc
import "EVM"

access(all)
fun main(addressHex: String): UFix64 {
    let addr = EVM.addressFromString(addressHex)
    return addr.balance().inFLOW()
}
```

The above script is helpful if you already know the COA address and can provide the hex representation directly.

## Depositing and Withdrawing Flow Tokens

Tokens can be seamlessly transferred between the Flow EVM and Cadence environment using the `deposit` and `withdraw`
functions provided by the COA resource. Anybody with a valid reference to a COA may deposit Flow tokens into a it,
however only someone with the `Owner` or `Withdraw` entitlements can withdraw tokens.

### Depositing Flow Tokens

The `deposit` function takes a `FlowToken.Vault` resource as an argument, representing the tokens to deposit. It will
transfer the tokens from the vault into the COA's balance.

This transaction will withdraw Flow tokens from a user's Cadence vault and deposit them into their COA:

```cadence deposit_to_coa.cdc
import "EVM"
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64) {
    let coa: &EVM.CadenceOwnedAccount
    let sentVault: @FlowToken.Vault

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow the public capability to the COA from the desired account
        // This script could be modified to deposit into any account with a `EVM.CadenceOwnedAccount` capability
        self.coa = signer.capabilities.borrow<&EVM.CadenceOwnedAccount>(/public/evm)
            ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
                .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))

        // Withdraw the balance from the COA, we will use this later to deposit into the receiving account
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
                from: /storage/flowTokenVault
            ) ?? panic("Could not borrow reference to the owner's FlowToken Vault")
        self.sentVault <- vaultRef.withdraw(amount: amount) as! @FlowToken.Vault
    }

    execute {
        // Deposit the withdrawn tokens into the COA
        self.coa.deposit(from: <-self.sentVault)
    }
}
```

:::info

This is a basic example which only transfers tokens between a single user's COA & Flow account. It can be easily
modified to transfer these tokens between any arbitrary accounts.

You can also deposit tokens directly into other types of EVM accounts using the `EVM.EVMAddress.deposit` function. See
the [EVM contract documentation](../../build/cadence/core-contracts/13-evm.md) for more information.

:::

### Withdrawing Flow Tokens

The `withdraw` function takes a `EVM.Balance` struct as an argument, representing the amount of Flow tokens to withdraw,
and returns a `FlowToken.Vault` resource with the withdrawn tokens.

We can run the following transaction to withdraw Flow tokens from a user's COA and deposit them into their Flow vault:

```cadence withdraw_from_coa.cdc
import "EVM"
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64) {
    let sentVault: @FlowToken.Vault
    let receiver: &{FungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow a reference to the COA from the storage location we saved it to with the `EVM.Withdraw` entitlement
        let coa = signer.storage.borrow<auth(EVM.Withdraw) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))

        // We must create a `EVM.Balance` struct to represent the amount of Flow tokens to withdraw
        let withdrawBalance = EVM.Balance(attoflow: 0)
        withdrawBalance.setFLOW(flow: amount)

        // Withdraw the balance from the COA, we will use this later to deposit into the receiving account
        self.sentVault <- coa.withdraw(balance: withdrawBalance) as! @FlowToken.Vault

        // Borrow the public capability to the receiving account (in this case the signer's own Vault)
        // This script could be modified to deposit into any account with a `FungibleToken.Receiver` capability
        self.receiver = signer.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
    }

    execute {
        // Deposit the withdrawn tokens into the receiving vault
        self.receiver.deposit(from: <-self.sentVault)
    }
}
```

:::info

This is a basic example which only transfers tokens between a single user's COA & Flow account. It can be easily
modified to transfer these tokens between any arbitrary accounts.

:::

## Direct Calls to Flow EVM

To interact with smart contracts on the EVM, you can use the `call` function provided by the COA resource. This function
takes the EVM address of the contract you want to call, the data you want to send, the gas limit, and the value you want
to send. It will return a `EVM.Result` struct with the result of the call - you will need to handle this result in your
Cadence code.

This transaction will use the signer's COA to call a contract method with the defined signature and args at a given EVM
address, executing with the provided gas limit and value:

```cadence call.cdc
import "EVM"

/// Calls the function with the provided signature and args at the target contract address using
/// the defined gas limit and transmitting the provided value.
transaction(evmContractHex: String, signature: String, args: [AnyStruct], gasLimit: UInt64, flowValue: UInt) {
    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow an entitled reference to the COA from the storage location we saved it to
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
    }

    execute {
        // Deserialize the EVM address from the hex string
        let contractAddress = EVM.addressFromString(evmContractHex)
        // Construct the calldata from the signature and arguments
        let calldata = EVM.encodeABIWithSignature(
            signature,
            args
        )
        // Define the value as EVM.Balance struct
        let value = EVM.Balance(attoflow: flowValue)
        // Call the contract at the given EVM address with the given data, gas limit, and value
        // These values could be configured through the transaction arguments or other means
        // however, for simplicity, we will hardcode them here
        let result: EVM.Result = self.coa.call(
            to: contractAddress,
            data: calldata,
            gasLimit: gasLimit,
            value: value
        )

        // Revert the transaction if the call was not successful
        // Note: a failing EVM call will not automatically revert the Cadence transaction
        // and it is up to the developer to use this result however it suits their application
        assert(
            result.status == EVM.Status.successful,
            message: "EVM call to ".concat(evmContractHex)
                .concat(" and signature ").concat(signature)
                .concat(" failed with error code ").concat(result.errorCode.toString())
                .concat(": ").concat(result.errorMessage)
        )
    }
}
```

:::info

Notice that the calldata is encoded in the scope of the transaction. While developers can encode the calldata
outside the scope of the transaction and pass the encoded data as an argument, doing so compromises the
human-readability of Cadence transactions.

It's encouraged to either define transactions for each COA call and encoded the hardcoded EVM signature and arguments,
or to pass in the human-readable arguments and signature and encode the calldata within the transaction. This ensures a
more interpretable and therefore transparent transaction.

:::

### Transferring FLOW in EVM

Similar to transferring ETH and other native value in other EVMs, you'll want to call to the target EVM address with
empty calldata and providing the transfer value.

```cadence transfer_evm_flow.cdc
import "EVM"

/// Transfers FLOW to another EVM address from the signer's COA
///
/// @param to: the serialized EVM address of the recipient
/// @param amount: the amount of FLOW to send
transaction(to: String, amount: UInt) {

    let recipient: EVM.EVMAddress
    let recipientPreBalance: UInt
    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) &Account) {
        self.recipient = EVM.addressFromString(to)
        self.recipientPreBalance = self.recipient.balance().attoflow
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
                .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
    }

    execute {
        let res = self.coa.call(
            to: self.recipient,
            data: [],
            gasLimit: 100_000,
            value: EVM.Balance(attoflow: amount)
        )

        assert(
            res.status == EVM.Status.successful,
            message: "Failed to transfer FLOW to EVM address with error code ".concat(res.errorCode.toString())
                .concat(": ").concat(res.errorMessage)
        )
    }

    post {
        self.recipient.balance().attoflow == self.recipientPreBalance + amount:
            "Expected final balance ".concat((self.recipientPreBalance + amount).toString())
            .concat(" but found actual balance ").concat(self.recipient.balance().attoflow.toString())
            .concat(" after deposit of ").concat(amount.toString())
    }
}
```

### Transfer ERC20

Below is an example transaction demonstrating the common ERC20 transfer. A similar pattern can be used for other
arbitrary EVM calls.

```cadence erc20_transfer_from.cdc
import "EVM"

/// Transfers ERC20 tokens from the signer's COA to the named recipient in the amount provided
///
/// @param erc20AddressHex: the serialized EVM address of the ERC20 contract
/// @param to: the serialized EVM address of the recipient
/// @param amount: the amount of tokens to send
transaction(erc20AddressHex: String, to: String, amount: UInt256) {
    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow an entitled reference to the COA from the canonical storage location
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
    }

    execute {
        // Encode the calldata for the ERC20 transfer
        let calldata = EVM.encodeABIWithSignature(
            "transfer(address,uint256)", // function signature
            [EVM.addressFromString(to), amount] // function args
        )
        // Call the contract at the given ERC20 address with encoded calldata and 0 value
        let result: EVM.Result = self.coa.call(
            to: EVM.addressFromString(erc20AddressHex), // deserialized address
            data: calldata, // encoded calldata
            gasLimit: 100_000, // 100k gas should cover most erc20 transfers
            value: EVM.Balance(attoflow: UInt(0)) // no value required in most cases
        )

        // Revert the transaction if the call was not successful
        // Note: a failing EVM call will not automatically revert the Cadence transaction
        // and it is up to the developer to use this result however it suits their application
        assert(
            result.status == EVM.Status.successful,
            message: "ERC20.transfer call failed with error code: ".concat(result.errorCode.toString())
                .concat(": ").concat(result.errorMessage)
        )
    }
}
```

### Transfer ERC721

Following on from above, the example transaction below demonstrates a common ERC721 transfer.

```cadence erc721_transfer.cdc
import "EVM"

/// Transfers an ERC721 token from the signer's COA to the named recipient
///
/// @param erc721AddressHex: the serialized EVM address of the ERC721 contract
/// @param to: the serialized EVM address of the recipient
/// @param id: the token ID to send from the signer's COA to the recipient
transaction(erc721AddressHex: String, to: String, id: UInt256) {
    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow an entitled reference to the COA from the canonical storage location
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
    }

    execute {
        let calldata = EVM.encodeABIWithSignature(
                "safeTransferFrom(address,address,uint256)",
                [self.coa.address(), EVM.addressFromString(to), id]
            )
        // Call the contract at the given ERC721 address with encoded calldata and 0 value
        let result: EVM.Result = self.coa.call(
            to: EVM.addressFromString(erc721AddressHex), // deserialized address
            data: calldata // previously encoded calldata
            gasLimit: 100_000, // 100k gas should cover most erc721 transfers
            value: EVM.Balance(attoflow: UInt(0)) // no value required in most cases
        )

        // Revert the transaction if the call was not successful
        // Note: a failing EVM call will not automatically revert the Cadence transaction
        // and it is up to the developer to use this result however it suits their application
        assert(
            result.status == EVM.Status.successful,
            message: "ERC721.safeTransferFrom call failed with error code: ".concat(result.errorCode.toString())
                .concat(": ").concat(result.errorMessage)
        )
    }
}
```

#### Bulk Transfer ERC721

As covered in the [Batched EVM transactions walkthrough](./batched-evm-transactions.md), you can script multiple EVM
calls in a single Cadence transaction. Compared to the single ERC721 transfer, bulk sending multiple tokens isn't much
more code and allows for greater utility out of a single transaction. Below is an example of a bulk ERC721 token
transfer.

```cadence erc721_bulk_transfer.cdc
import "EVM"

/// Bulk transfers ERC721 tokens from the signer's COA to the named recipient. All tokens must be from
/// the same collection and sent to the same recipient.
///
/// @param erc721AddressHex: the serialized EVM address of the ERC721 contract
/// @param to: the serialized EVM address of the recipient
/// @param ids: an array of IDs to send from the signer's COA to the recipient
transaction(erc721AddressHex: String, to: String, ids: [UInt256]) {
    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow an entitled reference to the COA from the canonical storage location
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
    }

    execute {
        // Iterate over provided IDs. Note the whole transaction fails if a single transfer fails,
        // so ownership validation is recommended before executing. Alternatively, you could remove
        // the assertion on success below and continue iteration on call failure.
        for id in ids {
            let calldata = EVM.encodeABIWithSignature(
                    "safeTransferFrom(address,address,uint256)",
                    [self.coa.address(), EVM.addressFromString(to), id]
                )
            // Call the contract at the given ERC721 address with encoded calldata and 0 value
            let result: EVM.Result = self.coa.call(
                to: EVM.addressFromString(erc721AddressHex), // deserialized address
                data: calldata // previously encoded calldata
                gasLimit: 100_000, // 100k gas should cover most erc721 transfers
                value: EVM.Balance(attoflow: UInt(0)) // no value required in most cases
            )

            // Revert the transaction if the transfer was not successful
            // Note: a failing EVM call will not automatically revert the Cadence transaction
            // and it is up to the developer to use this result however it suits their application
            assert(
                result.status == EVM.Status.successful,
                message: "ERC721.safeTransferFrom call failed on id ".concat(id.toString())
                    .concat(" with error code: ").concat(result.errorCode.toString())
                    .concat(": ").concat(result.errorMessage)
            )
        }
    }
}
```

## Deploying a Contract to Flow EVM

To deploy a contract to the EVM, you can use the `deploy` function provided by the COA resource. This function takes the
contract code, gas limit, and value you want to send. It will return the EVM address of the newly deployed contract.

This transaction will deploy a contract with the given code using the signer's COA:

```cadence deploy_evm_contract.cdc
import "EVM"

transaction(bytecode: String) {
    let coa: auth(EVM.Deploy) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow an entitled reference to the COA from the storage location we saved it to
        self.coa = signer.storage.borrow<auth(EVM.Deploy) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
    }

    execute {
        // Deploy the contract with the given compiled bytecode, gas limit, and value
        self.coa.deploy(
            code: bytecode.decodeHex(),
            gasLimit: 15_000_000, // can be adjusted as needed, hard coded here for simplicity
            value: EVM.Balance(attoflow: 0)
        )
    }
}
```

## More Information

For more information about Cadence Owned Accounts, see [Flow EVM Accounts](../../build/evm/accounts.md).

Other useful snippets for interacting with COAs can be found [here](https://fw-internal-doc.gitbook.io/evm).

Check out the [Batched EVM Transactions walkthrough](./batched-evm-transactions.md) for details on transaction batching
using Cadence.
