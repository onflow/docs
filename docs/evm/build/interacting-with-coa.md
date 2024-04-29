---
title: Accounts
sidebar_label: Accounts
sidebar_position: 4
---

# Interacting with COAs

[Cadence Owned Accounts (COAs)](./accounts.md#cadence-owned-accounts) are EVM accounts owned by a Cadence resource and are used to interact with the Flow EVM from Cadence.

COAs expose two interfaces for interaction: one on the Cadence side and one on the EVM side.

## Interacting with COAs from Cadence

COAs can be conveniently created, queried, and controlled from Cadence. This can be done with interacting with the methods exposed on the `CadenceOwnedAccount` resource from the [`EVM` contract](../../build/core-contracts/13-evm.md).

We will walk through some simple examples of how to interact with COAs in Cadence. However, your specific use case of the COA resource will depend on your application's requirements (e.g. the COA resource may not live directly in storage as in these examples, but may instead be a part of a more complex resource structure).

### COA Interface

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

You can learn more about the contract [here](../../build/core-contracts/13-evm.md) and the full contract code can be found on GitHub [here](https://github.com/onflow/flow-go/tree/master/fvm/evm/stdlib/contract.cdc).

This interface exists in the `EVM` system contract, so to use these functions, you will need to begin by importing the `EVM` contract into your Cadence code.

### Importing the EVM Contract

To interact with COAs, you will need to import the `EVM` contract into your Cadence code - this contract is deployed to the service account of whichever network you are using.

```cadence
import "EVM"
// ...
```

The import syntax used in this guide assumes that you are using the Flow CLI or another tool that supports the simple import syntax. These contracts must be configured in your project's `flow.json` file with the correct addresses for each network. For more information on how to do this, see the [Flow CLI documentation](../../tools/flow-cli/flow.json/configuration.md).

However, if you wish to use manual address imports, you can use the following syntax:

```cadence
// Must use the correct address based on the network you are using
import EVM from 0x1234
// ...
```

### Creating a COA

To create a COA, we can use the `createCadenceOwnedAccount` function from the `EVM` contract. This function takes no arguments and returns a new `CadenceOwnedAccount` resource which represents this EVM account.

For example, we can create this COA in a transaction, saving it to the user's storage and publishing a public capability to it:

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

### Getting the EVM Address of a COA

To get the EVM address of a COA, you can use the `address` function from the `EVM` contract. This function returns the EVM address of the COA as a `EVM.Address` - this is a struct used to represent and interact with 20-byte EVM addresses in Flow.

For our example, we could query the address of the COA we just created with the following script:

```cadence
import "EVM"

access(all)
fun main(address: Address): EVM.EVMAddress {
    // Get the desired account holding the COA in storage
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

Like any other Flow EVM or Cadence account, COAs possess a balance of FLOW tokens. To get the current balance of our COA, we can use the COA's `balance` function. It will return a `EVM.Balance` struct for the account - this is used to represent balances within Flow EVM.

This script will query the current balance of our newly created COA:

```cadence
import "EVM"

access(all)
fun main(address: Address): EVM.Balance {
    // Get the desired account holding the COA in storage
    let acct: &Account = getAccount(address)

    // Borrow a reference to the COA from the storage location we saved it to
    let coa = acct.storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/coa)

    // Get the current balance of this COA
    return coa.balance()
}
```

### Depositing and Withdrawing Flow Tokens

Tokens can be seamlessly transferred between COAs and other Flow accounts using the `deposit` and `withdraw` functions provided by the COA resource. Anybody with a reference to a COA may deposit Flow tokens into a it, but only someone with the `Owner` or `Withdraw` entitlements can withdraw them

#### Depositing Flow Tokens

The `deposit` function takes a `FlowToken.Vault` resource as an argument, representing the tokens to deposit. It will transfer the tokens from the vault into the COA's balance.

This transaction will withdraw Flow tokens from a user's vault and deposit them into a COA (for a given amount and target address):

```cadence
import "EVM"

transaction(amount: UFix64, address: Address) {
    let coa: &EVM.CadenceOwnedAccount
    let sentVault: @FlowToken.Vault

    prepare(signer: auth(Capabilities, Storage) &Account) {
        // Borrow the public capability to the COA from the desired account
        self.coa = acct.capabilities.borrow<&EVM.CadenceOwnedAccount>(
            from: /public/coa
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

#### Withdrawing Flow Tokens

The `withdraw` function takes a `EVM.Balance` struct as an argument, representing the amount of Flow tokens to withdraw and returns a `FlowToken.Vault` resource with the withdrawn tokens.

We can run the following transaction to withdraw Flow tokens from a COA and deposit them into an arbitrary Flow account.

```cadence
import "FungibleToken"
import "FlowToken"
import "EVM"

transaction(amount: UFix64, address: Address) {
    let sentVault: @FlowToken.Vault

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
    }

    execute {
        // Get the target account & deposit the withdrawn tokens
        // (you could use these tokens for any purpose in your own application)
        let account = getAccount(address)
        let receiver = account.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        receiver.deposit(from: <-self.sentVault)
    }
}
```

### Direct Calls to Flow EVM

To interact with smart contracts on the EVM, you can use the `call` function provided by the COA resource. This function takes the EVM address of the contract you want to call, the data you want to send, the gas limit, and the value you want to send. It will return a `EVM.Result` struct with the result of the call.

```cadence
import "EVM"

transaction() {
    prepare(signer: auth(Capabilities, Storage) &Account) {
        // Get the desired account holding the COA in storage


        // Borrow a reference to the COA from the storage location we saved it to
        let coa = acct.storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/coa)

        // Call the contract at the given EVM address with the given data, gas limit, and value
        let result: EVM.Result = coa.call(
            to: 0x1234567890123456789012345678901234567890, // INSERT EVM ADDRESS HERE
            data: [0x01, 0x02, 0x03], // INSERT DATA HERE
            gasLimit: 100000, // INSERT GAS LIMIT HERE
            value: 0.0 // INSERT VALUE HERE
        )

        // You may use the result of this call if your transaction logic depends on it
        // for
    }
}
```

### Deploying a Contract to Flow EVM

To deploy a contract to the EVM, you can use the `deploy` function provided by the COA resource. This function takes the contract code, gas limit, and value you want to send. It will return the EVM address of the newly deployed contract.

## More Information

For more information on Cadence Owned Accounts, see the [Flow EVM Accounts](./accounts.md) or the [Flow EVM Support FLIP](https://github.com/onflow/flips/pull/225/files).

Other useful snippets for interacting with COAs can be found [here](https://fw-internal-doc.gitbook.io/evm).
