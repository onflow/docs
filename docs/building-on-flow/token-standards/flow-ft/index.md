---
title: Fungible Token (FT) Standard
sidebar_position: 5
---

## FLOW as a Native Token

FLOW is the default token for the Flow protocol, meaning it is used for all protocol-level fee payments,
rewards and staking transactions. FLOW implements the standard [Flow Fungible Token interface](https://github.com/onflow/flow-ft),
which all other on-chain fungible tokens also conform to. This interface is defined in Cadence,
Flow's native smart-contract programming language, which makes it easy to write applications that
interact with FLOW.

## How to Get FLOW

There are two ways to acquire FLOW tokens as yield:

1. [Earn FLOW as a Validator or Delegator](../../building-on-flow/run-and-secure/staking/06-technical-overview.mdx): Receive newly-minted FLOW as a reward for running a node.
1. [Earn FLOW as a Community Contributor](https://github.com/onflow/developer-grants): Flow offers grants for selected proposals as well as RFPs for teams to submit proposals for funded development

## How to Use FLOW

With FLOW, you can:

- Spend
- Stake
- Delegate
- Hold
- Vote
- Send and share
- Create, develop, and grow your dapp

### Spending FLOW

All you need to spend Flow is an account and a tool for signing transactions
(a wallet, custodian, or other signing service).
The FCL (Flow Client Library) makes it super duper easy to go to any dapp,
login with your account, have a great time,
and then sign with the wallet of your choice only once you decide to make a purchase.

### Staking FLOW

[You can use FLOW to operate a staked node.](../../building-on-flow/run-and-secure/staking/06-technical-overview.mdx) Node operators receive newly-minted FLOW
as a reward for helping to secure the network.

### Delegating FLOW

[You can use FLOW for stake delegation.](../../building-on-flow/run-and-secure/staking/06-technical-overview.mdx) Delegators receive newly-minted FLOW
as a reward for helping to secure the network.

### Holding FLOW

If you have already purchased FLOW and wish to hold it, you have a couple of options:

- For relatively small, short term holdings - most people use a wallet.
  Wallets are used to help you sign transactions (verify your actions) when using your FLOW tokens.

- For larger, long term holdings - you may want to use a custody provider to keep your funds safe.

You can find wallets and custodians supporting Flow in the [Flow Port](https://port.onflow.org/)

### Voting with FLOW

Participating in the Flow community is more than just running a node or building a dapp.
It's also about engaging in discussion, debate, and decision making about the protocol,
the content on it, and the people impacted by it.
You can use your Flow account to submit votes to community polls and other governance related activities.

### Sending and Sharing FLOW

If you simply want to share the love and bring your friends to Flow, it's easier than an edible arrangement.

It is possible to use the Flow blockchain without holding any FLOW tokens yourself.
Free to play games, trials, community polls,
and other community activities can all take place with only an account
(which may be created on a person's behalf)
and a small fixed fee which may be paid by a user agent.

The protocol requires some FLOW tokens to process these transactions,
but (and this is the cool part!) a product can support users who do not themselves hold FLOW
while still providing that user with all the underlying security guarantees the Flow protocol provides.

Transferring FLOW, creating accounts, and updating keys are all actions made easy on [Flow Port](https://port.onflow.org/)

### Submitting Transactions and Updating Users

Transactions are submitted using a Flow SDK via the Access API.

On Flow, a transaction is identified by its hash - the hash that exists as soon as that transaction is signed and submitted to an Access or Collection node.
Results of transactions can be queried by transaction hash through the Access API.
A user can check the status of a transaction at any time via the [Flow Block Explorer](https://flow.bigdipper.live/).

To expose these results natively in your app, you can use a Flow SDK to fetch transaction results,
[for example using the Flow Go SDK](https://github.com/onflow/flow-go-sdk#querying-transaction-results).

Using a Flow SDK you can also fetch account state by address from a Flow Access API,
[for example using the Flow Go SDK](https://github.com/onflow/flow-go-sdk#querying-accounts).

Once the transaction is sealed, an event is emitted and you will be able to read transaction events and update the user.

The Flow SDKs also allow polling for events using the Flow Access API,
[for example using the Flow Go SDK](https://github.com/onflow/flow-go-sdk#querying-events).


## Basics of the Standard:

The code for the standard is in `contracts/FungibleToken.cdc`. An example implementation of the standard that simulates what a simple token would be like is in `contracts/ExampleToken.cdc`. 

The exact smart contract that is used for the official Flow Network Token is in `contracts/FlowToken.cdc`

Example transactions that users could use to interact with fungible tokens are located in the `transactions/` directory. These templates are mostly generic and can be used with any fungible token implementation by providing the correct addresses, names, and values.

The standard consists of a contract interface called `FungibleToken` that requires implementing contracts to define a `Vault` resource that represents the tokens that an account owns. Each account that owns tokens will have a `Vault` stored in its account storage.  Users call functions on each other's `Vault`s to send and receive tokens.  

Right now we are using unsigned 64-bit fixed point numbers `UFix64` as the type to represent token balance information. This type has 8 decimal places and cannot represent negative numbers.

## Core Features (All contained in the main FungibleToken interface)

1- Getting metadata for the token smart contract via the fields of the contract:

- `pub var totalSupply: UFix64`
    - The only required field of the contract.  It would be incremented when new tokens are minted and decremented when they are destroyed.
- Event that gets emitted when the contract is initialized
    - `pub event TokensInitialized(initialSupply: UFix64)`

2- Retrieving the token fields of a `Vault` in an account that owns tokens.

- Balance interface
    - `pub var balance: UFix64`
        - The only required field of the `Vault` type

3- Withdrawing a specific amount of tokens *amount* using the *withdraw* function of the owner's `Vault`

- Provider interface
    - `pub fun withdraw(amount: UFix64): @FungibleToken.Vault`
        - Conditions
            - the returned Vault's balance must equal the amount withdrawn
            - The amount withdrawn must be less than or equal to the balance
            - The resulting balance must equal the initial balance - amount
    - Users can give other accounts a reference to their `Vault` cast as a `Provider` to allow them to withdraw and send tokens for them.  A contract can define any custom logic to govern the amount of tokens that can be withdrawn at a time with a `Provider`.  This can mimic the `approve`, `transferFrom` functionality of ERC20.
- withdraw event
    - Indicates how much was withdrawn and from what account the `Vault` is stored in.
      If the `Vault` is not in account storage when the event is emitted,
      `from` will be `nil`.
    - `pub event TokensWithdrawn(amount: UFix64, from: Address?)`

4 - Depositing a specific amount of tokens *from* using the *deposit* function of the recipient's `Vault`

- `Receiver` interface
    - `pub fun deposit(from: @FungibleToken.Vault)`
    - Conditions
        - `from` balance must be non-zero
        - The resulting balance must be equal to the initial balance + the balance of `from`
- deposit event
    - Indicates how much was deposited and to what account the `Vault` is stored in.
      If the `Vault` is not in account storage when the event is emitted,
      `to` will be `nil`.
    - `pub event TokensDeposited(amount: UFix64, to: Address?)`
- Users could create custom `Receiver`s to trigger special code when transfers to them happen, like forwarding the tokens
  to another account, splitting them up, and much more.

- It is important that if you are making your own implementation of the fungible token interface that
  you cast the input to `deposit` as the type of your token.
  `let vault <- from as! @ExampleToken.Vault`
  The interface specifies the argument as `@FungibleToken.Vault`, any resource that satisfies this can be sent to the deposit function. The interface checks that the concrete types match, but you'll still need to cast the `Vault` before storing it.

5 - Creating an empty Vault resource

- `pub fun createEmptyVault(): @FungibleToken.Vault`
- Defined in the contract 
  To create an empty `Vault`, the caller calls the function in the contract and stores the Vault in their storage.
- Conditions:
    - the balance of the returned Vault must be 0

6 - Destroying a Vault

If a `Vault` is explicitly destroyed using Cadence's `destroy` keyword, the balance of the destroyed vault must be subracted from the total supply.

7 - Standard for Token Metadata

- not sure what this should be yet
- Could be a dictionary, could be an IPFS hash, could be json, etc.
- need suggestions!


## Comparison to Similar Standards in Ethereum

This spec covers much of the same ground that a spec like ERC-20 covers, but without most of the downsides.  

- Tokens cannot be sent to accounts or contracts that don't have owners or don't understand how to use them, because an account has to have a `Vault` in its storage to receive tokens.  No `safetransfer` is needed.
- If the recipient is a contract that has a stored `Vault`, the tokens can just be deposited to that Vault without having to do a clunky `approve`, `transferFrom`
- Events are defined in the contract for withdrawing and depositing, so a recipient will always be notified that someone has sent them tokens with the deposit event.
- The `approve`, `transferFrom` pattern is not included, so double spends are not permitted
- Transfers can trigger actions because users can define custom `Receivers` to execute certain code when a token is sent.
- Cadence integer types protect against overflow and underflow, so a `SafeMath`-equivalent library is not needed.

### Metadata

A standard for token metadata is still an unsolved problem in the general blockchain world and we are still thinking about ways to solve it in Cadence. We hope to be able to store all metadata on-chain and are open to any ideas or feedback on how this could be implemented.


## Bonus Features

**Minting and Burning are not included in the standard but are included in the FlowToken example contract to illustrate what minting and burning might look like for a token in Flow.**

8 - Minting or Burning a specific amount of tokens using a specific minter resource that an owner can control

- `MintandBurn` Resource
    - function to mintTokens
    - tokens minted event
    - Each minter has a set amount of tokens that they are allowed to mint. This cannot be changed and a new minter needs to be created to add more allowance.
    - function to burnTokens
    - tokens Burnt event
    - Each time tokens are minted or burnt, that value is added or subtracted to or from the total supply.


**The following features could each be defined as a separate interface. It would be good to make standards for these, but not necessary to include in the main standard interface and are not currently defined in this example.**

9 - Withdrawing a specific amount of tokens from someone else's `Vault` by using their `provider` reference.

- approved withdraw event
- Providing a resource that only approves an account to send a specific amount per transaction or per day/month/etc.
- Returning the amount of tokens that an account can send for another account.
- Reading the balance of the account that you have permission to send tokens for
- Owner is able to increase and decrease the approval at will, or revoke it completely
    - This is much harder than anticipated

11 - Pausing Token transfers (maybe a way to prevent the contract from being imported)

12 - Cloning the token to create a new token with the same distribution

13 - Restricted ownership (For accredited investors and such)
- allowlisting
- denylisting

# How to use the Fungible Token contract

To use the Flow Token contract as is, you need to follow these steps:

1. If you are using the Playground, you need to deploy the `FungibleToken` definition to account 1 yourself and import it in `ExampleToken`. It is a predeployed interface in the emulator, testnet, and mainnet and you can import definition from those accounts:
    - `0xee82856bf20e2aa6` on emulator
    - `0x9a0766d93b6608b7` on testnet
    - `0xf233dcee88fe0abe` on mainnet
2. Deploy the `ExampleToken` definition
3. You can use the `get_balance.cdc` or `get_supply.cdc` scripts to read the 
   balance of a user's `Vault` or the total supply of all tokens, respectively.
4. Use the `setupAccount.cdc` on any account to set up the account to be able to
   use `FlowTokens`.
5. Use the `transfer_tokens.cdc` transaction file to send tokens from one user with
   a `Vault` in their account storage to another user with a `Vault` in their account storage.
6. Use the `mint_tokens.cdc` transaction with the admin account to mint new tokens.
7. Use the `burn_tokens.cdc` transaction with the admin account to burn tokens.
8. Use the `create_minter.cdc` transaction to create a new MintandBurn resource
   and store it in a new Admin's account.


# Running Automated Tests

You can find automated tests in the `lib/go/test/token_test.go` file. It uses the transaction templates that are contained in the `lib/go/templates/transaction_templates.go` file. Currently, these rely on a dependency from a private dapper labs repository to run, so external users will not be able to run them. We are working on making all of this public so anyone can run tests, but haven't completed this work yet.

## License 

The works in these folders are under the [Unlicense](https://github.com/onflow/flow-ft/blob/master/LICENSE):

- [/contracts](https://github.com/onflow/flow-ft/blob/master/contracts/)
