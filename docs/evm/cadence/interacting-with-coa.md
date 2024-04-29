---
title: Interacting with COAs from Cadence
sidebar_label: Interacting with COAs
sidebar_position: 4
---

# Interacting with COAs

[Cadence Owned Accounts (COAs)](../build/accounts.md#cadence-owned-accounts) are EVM accounts owned by a Cadence resource and are used to interact with the Flow EVM from Cadence.

COAs expose two interfaces for interaction: one on the Cadence side and one on the EVM side. In this guide, we will focus on how to interact with COAs from Cadence.

We will walk through some basic examples of how to create and interact with COAs in Cadnece. Your specific use case of the COA resource will depend on your own application's requirements (e.g. the COA resource may not live directly in `/storage/evm` as in these examples, but may instead be a part of a more complex resource structure).

## COA Interface

To begin, we can take a look at a simplified version of the Cadence EVM contract interface related to interacting with COAs:

```cadence
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

You can learn more about the contract [here](../../build/core-contracts/13-evm.md) and the full contract code can be found on [GitHub](https://github.com/onflow/flow-go/tree/master/fvm/evm/stdlib/contract.cdc).

This resource is a part of the `EVM` system contract, so to use these functions, you will need to begin by importing the `EVM` contract into your Cadence code.

## Importing the EVM Contract

To import the `EVM` contract into your Cadence code using the simple import syntax, you can use the following format:

```cadence
// This assumes you are working in the in the Flow CLI, FCL, or another tool that supports the simple import syntax
// The contract address should be configured in your project's `flow.json` file
import "EVM"
// ...
```

However, if you wish to use manual address imports, you can use the following format:

```cadence
// Must use the correct address based on the network you are interacting with
import EVM from 0x1234
// ...
```

To find the correct address for the `EVM` contract on the network you are interacting with, you can refer to the [EVM contract documentation](../../build/core-contracts/13-evm.md).

## Creating a COA

To create a COA, we can use the `createCadenceOwnedAccount` function from the `EVM` contract. This function takes no arguments and returns a new `CadenceOwnedAccount` resource which represents this newly created EVM account.

For example, we can create this COA in a transaction, saving it to the user's storage and publishing a public capability to its reference:

```cadence
import "EVM"

// Note that this is a simplified example & will not handle cases where the COA already exists
transaction() {
    prepare(signer: auth(SaveValue) &Account) {
        let storagePath = /storage/evm
        let publicPath = /public/evm

        // Create account & save to storage
        let coa: @EVM.CadenceOwnedAccount <- EVM.createCadenceOwnedAccount()
        signer.storage.save(<-coa, to: storagePath)

        // Publish a public capability to the COA
        let cap = signer.capabilities.storage.issue<&EVM.CadenceOwnedAccount>(storagePath)
        signer.capabilities.link<&EVM.CadenceOwnedAccount>(cap, at: publicPath)
    }
}
```

## Getting the EVM Address of a COA

To get the EVM address of a COA, you can use the `address` function from the `EVM` contract. This function returns the EVM address of the COA as an `EVM.Address` struct. This struct is used to represent addresses within Flow EVM and can also be used to query the balance, code, nonce, etc. of an account.

For our example, we could query the address of the COA we just created with the following script:

```cadence
import "EVM"

access(all)
fun main(address: Address): EVM.EVMAddress {
    // Get the desired Flow account holding the COA in storage
    let account: = getAuthAccount<auth(Storage) &Account>(address)

    // Borrow a reference to the COA from the storage location we saved it to
    let coa = account.storage.borrow<&EVM.CadenceOwnedAccount>(
        from: /storage/evm
    ) ?? panic("Could not borrow reference to the COA!")

    // Return the EVM address of the COA
    return coa.address()
}
```

## Getting the Flow Balance of a COA

Like any other Flow EVM or Cadence account, COAs possess a balance of FLOW tokens. To get the current balance of our COA, we can use the COA's `balance` function. It will return a `EVM.Balance` struct for the account - these are used to represent balances within Flow EVM.

This script will query the current balance of our newly created COA:

```cadence
import "EVM"

access(all)
fun main(address: Address): EVM.Balance {
    // Get the desired Flow account holding the COA in storage
    let acct: &Account = getAccount(address)

    // Borrow a reference to the COA from the storage location we saved it to
    let coa = acct.storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm)

    // Get the current balance of this COA
    return coa.balance()
}
```

## Depositing and Withdrawing Flow Tokens

Tokens can be seamlessly transferred between the Flow EVM and Cadence environment using the `deposit` and `withdraw` functions provided by the COA resource. Anybody with a valid reference to a COA may deposit Flow tokens into a it, however only someone with the `Owner` or `Withdraw` entitlements can withdraw tokens.

### Depositing Flow Tokens

The `deposit` function takes a `FlowToken.Vault` resource as an argument, representing the tokens to deposit. It will transfer the tokens from the vault into the COA's balance.

This transaction will withdraw Flow tokens from a user's Cadence vault and deposit them into their COA:

```cadence
import "EVM"
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64) {
    let coa: &EVM.CadenceOwnedAccount
    let sentVault: @FlowToken.Vault

    prepare(signer: auth(Capabilities, Storage) &Account) {
        // Borrow the public capability to the COA from the desired account
        // This script could be modified to deposit into any account with a `EVM.CadenceOwnedAccount` capability
        self.coa = signer.capabilities.borrow<&EVM.CadenceOwnedAccount>(
            from: /public/evm
        ) ?? panic("Could not borrow reference to the COA!")

        // Withdraw the balance from the COA, we will use this later to deposit into the receiving account
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
                from: /storage/flowTokenVault
            ) ?? panic("Could not borrow reference to the owner's Vault!")
        self.sentVault <- vaultRef.withdraw(amount: amount) as! @FlowToken.Vault
    }

    execute {
        // Deposit the withdrawn tokens into the COA
        coa.deposit(from: <-self.sentVault)
    }
}
```

:::info
This is a basic example which only transfers tokens between a single user's COA & Flow account. It can be easily modified to transfer these tokens between any arbitrary accounts.

You can also deposit tokens directly into other types of EVM accounts using the `EVM.EVMAddress.deposit` function. See the [EVM contract documentation](../../build/core-contracts/13-evm.md) for more information.
:::

### Withdrawing Flow Tokens

The `withdraw` function takes a `EVM.Balance` struct as an argument, representing the amount of Flow tokens to withdraw, and returns a `FlowToken.Vault` resource with the withdrawn tokens.

We can run the following transaction to withdraw Flow tokens from a user's COA and deposit them into their Flow vault:

```cadence
import "EVM"
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64) {
    let sentVault: @FlowToken.Vault
    let receiver: &{FungibleToken.Receiver}

    prepare(signer: auth(Storage, EVM.Withdraw) &Account) {
        // Borrow a reference to the COA from the storage location we saved it to with the `EVM.Withdraw` entitlement
        let coa = signer.storage.borrow<auth(EVM.Withdraw) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the COA!")

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
        receiver.deposit(from: <-self.sentVault)
    }
}
```

:::info
This is a basic example which only transfers tokens between a single user's COA & Flow account. It can be easily modified to transfer these tokens between any arbitrary accounts.
:::

## Direct Calls to Flow EVM

To interact with smart contracts on the EVM, you can use the `call` function provided by the COA resource. This function takes the EVM address of the contract you want to call, the data you want to send, the gas limit, and the value you want to send. It will return a `EVM.Result` struct with the result of the call - you will need to handle this result in your Cadence code.

This transaction will call a contract at a given EVM address with a hardcoded data payload, gas limit, and value using the signer's COA:

```cadence
import "EVM"

transaction() {
    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(Storage) &Account) {
        // Borrow an entitled reference to the COA from the storage location we saved it to
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the COA!")
    }

    execute {
        // Call the contract at the given EVM address with the given data, gas limit, and value
        // These values could be configured through the transaction arguments or other means
        // however, for simplicity, we will hardcode them here
        let result: EVM.Result = coa.call(
            to: 0x1234567890123456789012345678901234567890, // INSERT EVM ADDRESS HERE
            data: [0x01, 0x02, 0x03], // INSERT DATA HERE
            gasLimit: 15000000, // INSERT GAS LIMIT HERE (attoflow)
            value: 0.0 // INSERT VALUE HERE
        )

        // Revert the transaction if the call was not successful
        // Note: a failing EVM call will not automatically revert the Cadence transaction
        // and it is up to the developer to use this result however it suits their application
        if result.status != EVM.Status.successful {
            panic("EVM call failed with status: " + result.status)
        }
    }
}
```

### Deploying a Contract to Flow EVM

To deploy a contract to the EVM, you can use the `deploy` function provided by the COA resource. This function takes the contract code, gas limit, and value you want to send. It will return the EVM address of the newly deployed contract.

This transaction will deploy a contract with the given code using the signer's COA:

```cadence
import "EVM"

transaction(code: String) {
    let coa: auth(EVM.Deploy) &EVM.CadenceOwnedAccount

    prepare(signer: auth(Storage) &Account) {
        // Borrow an entitled reference to the COA from the storage location we saved it to
        self.coa = signer.storage.borrow<auth(EVM.Deploy) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the COA")
    }

    execute {
        // Deploy the contract with the given code, gas limit, and value
        self.coa.deploy(
            code: code.decodeHex(),
            gasLimit: 15000000, // can be adjusted as needed, maxed for simplicity
            value: EVM.Balance(attoflow: 0)
        )
    }
}
```

## More Information

For more information on Cadence Owned Accounts, see the [Flow EVM Accounts](../build/accounts.md) or the [Flow EVM Support FLIP](https://github.com/onflow/flips/pull/225/files).

Other useful snippets for interacting with COAs can be found [here](https://fw-internal-doc.gitbook.io/evm).
