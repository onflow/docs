---
title: How to Create a Fungible Token on Flow
sidebar_label: Create a Fungible Token
description: Guide to creating a fungible token on Flow with the Flow CLI and Cadence.
sidebar_position: 4
------

This article will guide you through the steps to create, deploy, mint, and transfer fungible tokens on Flow.

## What are Fungible Tokens?

Fungible tokens are digital assets that are interchangeable and indistinguishable with other tokens of the same type. This means that each token is identical in specification to every other token in circulation. Think of them like traditional money; every dollar bill has the same value as every other dollar bill. Fungible tokens play a crucial role in web3 ecosystems, serving as both a means of payment and an incentive for network participation. They can take on various roles including currencies, structured financial instruments, shares of index funds, and even voting rights in decentralized autonomous organizations.

## Vaults on Flow

On the Flow blockchain, fungible tokens are stored in structures called vaults. Think of a vault as a digital piggy bank. When you transfer tokens from one vault to another:

1. A temporary vault (or a temporary piggy bank) is created holding the transfer amount.
2. The original vault's balance decreases by the transfer amount.
3. The recipient's vault receives the tokens from the temporary vault.
4. The temporary vault is then deleted.

This process ensures secure and accurate token transfers on the Flow blockchain.

## Fungible Token Standard

The [Fungible Token Standard](https://github.com/onflow/flow-ft) defines what a fungible token should look like on Flow. Wallets and other platforms need to recognize these tokens, so they adhere to a specific interface, which defines fields like balance, totalSupply, withdraw functionality, and more. This interface ensures that all fungible tokens on Flow have a consistent structure and behavior. [Learn more about interfaces here](https://developers.flow.com/cadence/language/interfaces).

## Creating Our Project

To get started making our fungible token, let's first create a project directory in our terminal and go to it. We'll call it FooToken.

```
mkdir FooToken
cd FooToken
```

Next, we'll initialize a project using the Flow CLI, which will create a configuration file named **`flow.json`**. This file configures the Flow CLI for the Flow blockchain, handling settings such as network details, accounts, and contracts. 

If you haven't installed the Flow CLI yet and have [homebrew](https://brew.sh/) installed you can run `brew install flow-cli`. If you don’t have homebrew, please follow [the installation guide here](https://developers.flow.com/tools/flow-cli/install).

```
flow init
```

In our `flow.json` for the network we want to use, we are going to state the address the Fungible Token is deployed to via `aliases` in a new `contracts` section. Since it is a standard contract, it has already been deployed to the emulator, a tool that runs and emulates a local development version of the Flow Blockchain, for us. You can find addresses for other networks, like Testnet and Mainnet, on the [Fungible Token Standard repo](https://github.com/onflow/flow-ft).

```
"contracts": {
  "FungibleToken": {
    "aliases": {
      "emulator": "0xee82856bf20e2aa6"
    }
  }
},
```

## Writing Our Token Contract

Next let's create a directory and a file for our new FooToken contract.

```
mkdir cadence
mkdir cadence/contracts
touch cadence/contracts/FooToken.cdc
```

In this contract file, we want to import our `FungibleToken` contract that we've defined in `flow.json`.

```
import "FungibleToken"
```

In this same file, let's create our contract which implements the `FungibleToken` contract Interface (it does so by setting it following the `FooToken:`). In our `init` — which runs on the contracts first deployment and is used to set initial values — let’s set an starting total supply of 1,000 tokens for this example.

```
// ...previous code

pub contract FooToken: FungibleToken {
  pub var totalSupply: UFix64

  init() {
    self.totalSupply = 1000.0
  }
}
```

### Creating a Vault

Inside of this contract, we'll need to create a resource for a Vault. A resource is a special type to Cadence (our smart contract language) which represents a unique value. We also want to have it implement the Provider, Receiver, and Balance sections of the FungibleToken contract, as well as allow us to set the initial balance of the vault.

```
import "FungibleToken"

pub contract FooToken: FungibleToken {
    // ...totalSupply code

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }
    }

    // ...init code
}
```

In order to give an account a vault, we need to create a function that creates a vault of our FooToken type and returns it to the account.

```
import "FungibleToken"

pub contract FooToken: FungibleToken {
    // ...other code

    pub fun createEmptyVault(): @FooToken.Vault {
        return <- create Vault(balance: 0.0)
    }

    // ...init code
}
```

The standard also wants us to implement the events required for creating a token. These will tell us when a token has been initialized, withdrawn, or deposited. Let's add these to the top of the contract.

```
import "FungibleToken"

pub contract FooToken: FungibleToken {
    
    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)

    // ...all other code
}
```

Inside our `Vault` resource, we also need a way to withdraw balances. To do that, we need to create a new vault with the transfer amount and decrement the existing balance. Let’s also emit an event for this action:

```
import "FungibleToken"

pub contract FooToken: FungibleToken {

    // ...previous code

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        // ...other vault code

        pub fun withdraw(amount: UFix64): @Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <- create Vault(balance: amount)
        }

        // ...vault init code

    }

    // ...additional code
}
```

In addition to withdrawing, the vault also needs a way to deposit. We'll again emit the appropriate event, as well as [typecast](https://developers.flow.com/cadence/language/operators#casting-operators) to make sure we are dealing with the correct token, update the vault balance, and destroy the vault. We also need to set the balance to 0 in the current vault so that the destroy method is not triggered. Add this code to your resource:

```
import "FungibleToken"

pub contract FooToken: FungibleToken {

    // ...previous code

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        // ...other vault code

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @FooToken.Vault // typecast to make sure we are using the correct token type

            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)

            self.balance = self.balance + vault.balance
            vault.balance = 0.0 // Before the vault is destroyed, set the balance to zero so the totalSupply isn't affected in the destroy method
            destroy vault
        }

        // ...vault init

    }

    // ...additional code
}
```

The destroy call is an important thing to handle though since if anyone ever does destroy their vault, we'll want to change the total supply of the token. You can add this inside of your `Vault` resource as well.

```
import "FungibleToken"

pub contract FooToken: FungibleToken {

    // ...previous code

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        // ...other vault code

        destroy() {
            FooToken.totalSupply = FooToken.totalSupply - self.balance
        }

    }

    // ...additional code
}
```

### Creating a Minter

Let's create a minter resource which is used to mint vaults that have tokens in them. We can keep track of tokens we are minting with totalSupply

If we want the ability to create new tokens, we'll need a way to mint them. To do that, let's create another resource on the `FooToken` contract.  This will have a `mintToken`function which can increase the total supply of the token.

```
import "FungibleToken"

pub contract FooToken: FungibleToken {

    // ...additional contract code

    pub resource Minter {
        pub fun mintToken(amount: UFix64): @FungibleToken.Vault {
            FooToken.totalSupply = FooToken.totalSupply + amount
            return <- create Vault(balance: amount)
        }

        init() {}
    }

    // ...additional contract code
}
```

We also want to decide which account/s we want to give this ability to. In our example, we'll give it to the account where the contract is deployed. We can set this in the contract init function below the setting of total supply so that when the contract is created the minter is stored on the same account.

```
import "FungibleToken"

pub contract FooToken: FungibleToken {

    // ...additional contract code

    init() {
        self.totalSupply = 1000.0 // existed before
        self.account.save(<- create Minter(), to: /storage/Minter)
    }
}
```

After each of these steps, your `FooToken.cdc` contract file should now look like this:

```
import "FungibleToken"

pub contract FooToken: FungibleToken {

    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)
    pub var totalSupply: UFix64

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @FooToken.Vault
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            self.balance = self.balance + vault.balance
            vault.balance = 0.0
            destroy vault
        }

        pub fun withdraw(amount: UFix64): @Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <- create Vault(balance: amount)
        }

        destroy() {
            FooToken.totalSupply = FooToken.totalSupply - self.balance
        }

        init(balance: UFix64) {
            self.balance = balance
        }
    }

    pub resource Minter {
        pub fun mintToken(amount: UFix64): @FungibleToken.Vault {
            FooToken.totalSupply = FooToken.totalSupply + amount
            return <- create Vault(balance: amount)
        }

        init(){}
    }

    pub fun createEmptyVault(): @FooToken.Vault {
        return <- create Vault(balance: 0.0)
    }

    init() {
        self.totalSupply = 1000.0
        self.account.save(<- create Minter(), to: /storage/Minter)
    }
}
```

## Deploying the Contract

In order to use the contract, we need to deploy it to the network we want to use it on. In our case we are going to deploy it to emulator while developing.

Back in our `flow.json`, let's add our `FooToken` to the `contracts` after `FungibleToken` with the path of the source code:

```
"FooToken": "cadence/contracts/FooToken.cdc"
```

Let's also add a new `deployments` section to `flow.json` with the network we want to deploy it to, `emulator`, the account we want it deployed to `emulator-account`, and the list of contracts we want deployed in the array.

```
"deployments": {
  "emulator": {
    "emulator-account": ["FooToken"]
  }
}
```

Next, using the Flow CLI, we will start the emulator. As mentioned, this will give us a local development environment for the Flow Blockchain.

```
flow emulator start
```

Open a new terminal and run the following to deploy your project:

```
flow project deploy
```

Congrats, you've deployed your contract to the Flow Blockchain emulator. To read more about deploying your project to other environments, see the [CLI docs](https://developers.flow.com/tools/flow-cli/deployment/deploy-project-contracts).

## Reading the Token’s Total Supply

Let's now check that our total supply was initialized with 1,000 FooTokens. Go ahead and create a new directory and script file called `TotalSupply.cdc`.

```
mkdir cadence/scripts
touch cadence/scripts/TotalSupply.cdc
```

In `TotalSupply.cdc`, let's add this code which will log the `totalSupply` value from the `FooToken` contract:

```
import "FooToken"

pub fun main() {
  log(FooToken.totalSupply)
}
```

To run this using the CLI, enter this in your terminal:

```
flow scripts execute cadence/scripts/TotalSupply.cdc
```

In the terminal where you started the emulator, you should see `1000.0`

To learn more about running scripts using Flow CLI, [see the docs](https://developers.flow.com/tools/flow-cli/scripts/execute-scripts).

## Giving Accounts the Ability to Receive Tokens

On Flow, newly created accounts cannot receive arbitrary assets. They need to be initialized to receive resources. In our case, we want to give accounts tokens and we’ll need to create a `Vault` (which acts as a receiver) on each account that we want to have the ability to receive tokens. To do this, we'll need to run a transaction which will create the vault and set it in their storage using the `createEmptyVault` function we created earlier on the contract.

Let's first create the file for this transaction called `CreateVault.cdc`:

```
mkdir cadence/transactions
touch cadence/transactions/CreateVault.cdc
```

Then add this code to it. This will call the `createEmptyVault` function, save it in storage, and create a capability for the vault which will later allow us to read from it (To learn more about capabilities, see [the Cadence docs here](https://developers.flow.com/cadence/language/capabilities)).

```
import "FooToken"
import "FungibleToken"

transaction {
	prepare(acct: AuthAccount) {
	  acct.save(<- FooToken.createEmptyVault(), to: /storage/Vault)
	  acct.link<&FooToken.Vault{FungibleToken.Balance, FungibleToken.Receiver}>(/public/Vault, target: /storage/Vault)
	}

	execute {
		log("Created")
	}
}
```

Next let's create a new emulator account using the CLI. We'll use this account to create a new vault and mint tokens into it. Run:

```
flow accounts create
```

Let's call it `test-acct` and select "Emulator" for the network:

```
test-acct
```

This will have added a new account, called `test-acct` to your `flow.json`.

To call our create vault transaction from the CLI, we'll run the following:

```
flow transactions send ./cadence/transactions/CreateVault.cdc --signer test-acct --network emulator
```

To learn more about running transactions using CLI, [see the docs](https://developers.flow.com/tools/flow-cli/transactions/send-transactions).

## Reading a Vault’s Balance

Let's now read the balance of the newly created account (`test-acct`) to check it's zero.

Create this new script file `ReadVaultBalance.cdc`:

```
touch cadence/scripts/ReadVaultBalance.cdc
```

Add this code which attempts to borrow the capability from the account requested and logs the vault balance if permitted:

```
import "FooToken"
import "FungibleToken"

pub fun main(account: Address) {
  let vault = getAccount(account).getCapability(/public/Vault)
	  .borrow<&FooToken.Vault{FungibleToken.Balance}>()
	  ?? panic("Can't borrow public Vault")

  log(vault.balance)
}
```

To run this script using the CLI, enter the following in your terminal. Note: you'll need to replace `123` with the address created by CLI in your `flow.json` for the `test-acct` address.

```
flow scripts execute cadence/scripts/ReadVaultBalance.cdc 123 // change "123" to test-acct address
```

You should see a balance of zero logged.

## Minting More Tokens

Now that we have an account with a vault, let's mint some tokens into it using the Minter we created on the contract account.

To do this, let's create a new transaction file called `Minter.cdc`:

```
touch cadence/transactions/Minter.cdc
```

Next, let's add the following code to the `Minter.cdc` file. This code will attempt to borrow the minting capability and mint 20 new tokens into the receivers account.

```
import "FooToken"
import "FungibleToken"

transaction(receiverAccount: Address) {
	prepare(acct: AuthAccount) {
	  let minter = acct.borrow<&FooToken.Minter>(from: /storage/Minter)
		  ?? panic("Can't borrow Minter")

		let newVault <- minter.mintToken(amount: 20.0)

		let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
			.borrow<&FooToken.Vault{FungibleToken.Receiver}>()
			?? panic("Could not get public Vault")

		receiverVault.deposit(from: <- newVault)
	}

	execute {}
}
```

To run this transaction, enter this in your terminal. Note: `123` should be replaced with address of `test-acct` found in your `flow.json`. This command also states to sign with our `emulator-account` on the Emulator network.

```
flow transactions send ./cadence/transactions/Minter.cdc 123 --signer emulator-account --network emulator
```

Let's go ahead and read the vault again. Remember to replace `123` with the correct address.

```
flow scripts execute cadence/scripts/ReadVaultBalance.cdc 123
```

It should now say 20 tokens are in the vault.

## Transferring Tokens Between Accounts

The final functionality we'll add is the ability to transfer tokens from one account to another.

To do that, create a new `Transfer.cdc` transaction file:

```
touch cadence/transactions/Transfer.cdc
```

Let's add the code which states that the signer of the transaction will withdraw from their vault and put it into the receiver's vault which will be passed as a transaction argument.

```
import "FooToken"
import "FungibleToken"

transaction(receiverAccount: Address, amount: UFix64) {
	prepare(acct: AuthAccount) {
	  let signerVault = acct.borrow<&FooToken.Vault>(from: /storage/Vault)
		  ?? panic("Couldn't get signer's Vault")

	let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
			.borrow<&FooToken.Vault{FungibleToken.Receiver}>()
			?? panic("Could not get public Vault")

	  receiverVault.deposit(from: <- signerVault.withdraw(amount: amount))
	}

	execute {
		log("Transferred")
	}
}
```

To send our tokens, we'll need to create a new account to send them to. Let's make one more account on emulator. Run:

```
flow accounts create
```

And pick the name:

```
test-acct-2
```

Make sure to select Emulator as the network.

Don't forget the new account will need a vault added, so let's run the following transaction to add one:

```
flow transactions send ./cadence/transactions/CreateVault.cdc --signer test-acct-2 --network emulator
```

Now, let's send 1 token from our earlier account to the new account. Remember to replace `123` with account address of `test-acct-2`.

```
flow transactions send ./cadence/transactions/Transfer.cdc 123 "1.0" --signer test-acct --network emulator
```

After that, read the balance of `test-acct-2` (replace the address `123`).

```
flow scripts execute cadence/scripts/ReadVaultBalance.cdc 123
```

You should now see 1 token in `test-acct-2` account!

## More

- [View a repo of this example code](https://github.com/chasefleming/FooToken)
- [Watch a video on how to create a fungible token on Playground](https://www.youtube.com/watch?v=Yq_sUARMQ4E)
- [Review an `ExampleToken` contract implementing all of the remaining FungibleToken interface](https://github.com/onflow/flow-ft/blob/master/contracts/ExampleToken.cdc)
- [View the Flow Token Standard](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc)