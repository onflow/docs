---
title: Upgrading Cadence Contracts
description: Learn how to upgrade already deployed Cadence contracts by adding new functionality while preserving existing state. Deploy a Counter contract, modify it to add even/odd counting functionality, and update it on testnet using Flow CLI.
sidebar_position: 2
keywords:
  - Cadence contract upgrades
  - contract updates
  - Flow CLI
  - contract deployment
  - testnet deployment
  - contract modification
  - state preservation
  - contract versioning
  - Flow CLI commands
  - account update contract
  - contract evolution
---

# Upgrading Cadence Contracts

In Cadence, you can upgrade deployed contracts by adding new functionality while preserving existing state and maintaining the same contract address. Unlike other blockchain platforms that require complex proxy patterns or complete redeployment, Cadence allows you to seamlessly extend your contracts with new functions and events through multiple incremental upgrades.

This tutorial demonstrates how to upgrade a deployed contract through two scenarios: first adding an event to notify users when the counter reaches an even number, then extending the contract with additional functionality like incrementing by 2 and checking if numbers are even.

## Objectives

After completing this guide, you will be able to:

- **Deploy a contract** to Flow testnet using Flow CLI
- **Perform incremental contract upgrades** by adding new events and functions
- **Update deployed contracts multiple times** using the `flow accounts update-contract` command
- **Test upgraded functionality** with Cadence transactions and scripts
- **Understand what can and cannot be changed** during contract upgrades
- **Apply realistic upgrade scenarios** based on user feedback and requirements

## Prerequisites

- [Flow CLI installed] and configured
- Basic familiarity with [Cadence] and [Flow accounts]
- A **funded testnet account** to deploy and update contracts
  - See [Create accounts] and [Fund accounts] in the Flow CLI commands

## Contract Upgrade Overview

Cadence provides a sophisticated contract upgrade system that allows you to modify deployed contracts while ensuring data consistency and preventing runtime crashes. Understanding what you can and cannot change is crucial for successful upgrades.

### What You CAN Upgrade

- **Add new functions** - Extend contract functionality with new methods
- **Add new events** - Emit additional events for monitoring and indexing
- **Modify function implementations** - Change how existing functions work
- **Change function signatures** - Update parameters and return types
- **Remove functions** - Delete functions that are no longer needed
- **Change access modifiers** - Update visibility of functions and fields
- **Reorder existing fields** - Field order doesn't affect storage

### What You CANNOT Upgrade

- **Add new fields** - Would cause runtime crashes when loading existing data
- **Change field types** - Would cause deserialization errors
- **Remove existing fields** - Fields become inaccessible but data remains
- **Change enum structures** - Raw values must remain consistent
- **Change contract name** - Contract address must remain the same

### Why These Restrictions Exist

The [Cadence Contract Updatability documentation](https://cadence-lang.org/docs/language/contract-updatability) explains that these restrictions prevent:

- **Runtime crashes** from missing or garbage field values
- **Data corruption** from type mismatches
- **Storage inconsistencies** from structural changes
- **Type confusion** from enum value changes

The validation system ensures that existing stored data remains valid and accessible after upgrades.

## Getting Started

Create a new Flow project for this tutorial:

```bash
# Create a new Flow project
flow init upgrading-contracts-tutorial
```

Follow the prompts and create a `Basic Cadence project (no dependencies)` then open the new project in your editor.

### Create and Fund Testnet Account

You'll need a funded testnet account to deploy and update contracts. In a terminal in the root of your project folder:

```bash
# Create a testnet account
flow accounts create --network testnet
```

When prompted:

1. **Account name**: Enter `testnet-account`
2. Select `testnet` as the network when prompted

Fund your account with testnet FLOW tokens:

```bash
# Fund the account
flow accounts fund testnet-account
```

This will open the faucet in your browser where you can request 100,000 testnet FLOW tokens.

:::info

The faucet provides free testnet tokens for development and testing purposes. These tokens have no real value and are only used on the testnet network.

:::

---

## Deploy the Initial Counter Contract

Let's start by deploying a simple Counter contract to testnet.

Open and review `cadence/contracts/Counter.cdc`. This is a simple contract created with all projects:

```cadence
access(all) contract Counter {

    access(all) var count: Int

    // Event to be emitted when the counter is incremented
    access(all) event CounterIncremented(newCount: Int)

    // Event to be emitted when the counter is decremented
    access(all) event CounterDecremented(newCount: Int)

    init() {
        self.count = 0
    }

    // Public function to increment the counter
    access(all) fun increment() {
        self.count = self.count + 1
        emit CounterIncremented(newCount: self.count)

        // NEW: Also emit event if the result is even
        if self.count % 2 == 0 {
            emit CounterIncrementedToEven(newCount: self.count)
        }
    }

    // Public function to decrement the counter
    access(all) fun decrement() {
        self.count = self.count - 1
        emit CounterDecremented(newCount: self.count)
    }

    // Public function to get the current count
    view access(all) fun getCount(): Int {
        return self.count
    }
}
```

### Configure Deployment

Add testnet deployment configuration to your `flow.json`:

```bash
flow config add deployment
```

Follow the prompts:

1. **Network**: `testnet`
2. **Account**: `testnet-account`
3. **Contract**: `Counter`
4. **Deploy more contracts**: `no`

Your `flow.json` will now include a testnet deployment section:

```json
{
  "deployments": {
    "testnet": {
      "testnet-account": ["Counter"]
    }
  }
}
```

### Deploy to Testnet

Deploy your Counter contract to testnet:

```bash
flow project deploy --network testnet
```

You should see output similar to:

```bash
Deploying 1 contracts for accounts: testnet-account

Counter -> 0x9942a81bc6c3c5b7 (contract deployed successfully)

🎉 All contracts deployed successfully
```

### Test the Initial Contract

Use the provided transaction to test initial functionality:

Review `cadence/transactions/TestCounter.cdc`. This transaction simply increments the counter:

```cadence
import "Counter"

transaction {

    prepare(acct: &Account) {
        // Authorizes the transaction
    }

    execute {
        // Increment the counter
        Counter.increment()

        // Retrieve the new count and log it
        let newCount = Counter.getCount()
        log("New count after incrementing: ".concat(newCount.toString()))
    }
}
```

:::info

Cadence transactions are written in Cadence and can call one or more functions on one or more contracts, all with a single user signature. Check out our tutorial to learn how to [Compose with Cadence Transactions] to learn more!

:::

Run the test transaction:

```bash
flow transactions send cadence/transactions/IncrementCounter.cdc --signer testnet-account --network testnet
```

You should see logs showing the counter incrementing and decrementing as expected.

```bash
Transaction ID: 251ee40a050b8c7298d33f1b73ed94996a9d99deae8559526d9dddae182f7752

Block ID        25cdb14fcbaf47b3fb13e6ec43bdef0ede85a6a580caea758220c53d48493e17
Block Height    284173579
Status          ✅ SEALED
ID              251ee40a050b8c7298d33f1b73ed94996a9d99deae8559526d9dddae182f7752
Payer           adb1efc5826d3768
Authorizers     [adb1efc5826d3768]

Proposal Key:
    Address     adb1efc5826d3768
    Index       0
    Sequence    1

No Payload Signatures

Envelope Signature 0: adb1efc5826d3768
Signatures (minimized, use --include signatures)

Events:
    Index       0
    Type        A.adb1efc5826d3768.Counter.CounterIncremented
    Tx ID       251ee40a050b8c7298d33f1b73ed94996a9d99deae8559526d9dddae182f7752
    Values
                - newCount (Int): 1
```

---

## Upgrade the Contract - Part 1: Adding Event for Even Numbers

Let's start with a realistic scenario: What if we've realized it's very important to our users that they know when the counter reaches an even number, but we forgot to add an event for that case? Let's add that functionality first.

### Modify the Counter Contract - First Upgrade

Update `cadence/contracts/Counter.cdc` to add the new event and enhance the existing `increment()` function:

```cadence
access(all) contract Counter {

    access(all) var count: Int

    // Event to be emitted when the counter is incremented
    access(all) event CounterIncremented(newCount: Int)

    // Event to be emitted when the counter is decremented
    access(all) event CounterDecremented(newCount: Int)

    // NEW: Event to be emitted when the counter is incremented and the result is even
    access(all) event CounterIncrementedToEven(newCount: Int)

    init() {
        self.count = 0
    }

    // Public function to increment the counter
    access(all) fun increment() {
        self.count = self.count + 1
        emit CounterIncremented(newCount: self.count)

        // NEW: Also emit event if the result is even
        if self.count % 2 == 0 {
            emit CounterIncrementedToEven(newCount: self.count)
        }
    }

    // Public function to decrement the counter
    access(all) fun decrement() {
        self.count = self.count - 1
        emit CounterDecremented(newCount: self.count)
    }

    // Public function to get the current count
    view access(all) fun getCount(): Int {
        return self.count
    }
}
```

### Key Changes Made - Part 1

This first upgrade adds:

1. **New event**: `CounterIncrementedToEven` to notify when incrementing results in an even number
2. **Enhanced existing function**: The `increment()` function now also emits the new event when appropriate
3. **No new fields**: We only use the existing `count` field to avoid validation errors

:::info

This demonstrates how you can enhance existing functionality by adding new events and modifying existing function behavior. The original `CounterIncremented` event still works as before, ensuring backward compatibility.

:::

---

## Update the Deployed Contract - Part 1

Now let's update the deployed contract on testnet using the Flow CLI update command with our first upgrade.

### Update the Contract

Use the [Flow CLI update contract command] to upgrade your deployed contract:

```bash
flow accounts update-contract ./cadence/contracts/Counter.cdc --signer testnet-account --network testnet
```

You should see output similar to:

```bash
Contract 'Counter' updated on account '0x9942a81bc6c3c5b7'

Address	 0x9942a81bc6c3c5b7
Balance	 99999999999.70000000
Keys	 1

Key 0	Public Key		 [your public key]
	Weight			 1000
	Signature Algorithm	 ECDSA_P256
	Hash Algorithm		 SHA3_256
	Revoked 		 false
	Sequence Number	 2
	Index			 0

Contracts Deployed: 1
Contract: 'Counter'
```

:::success

The contract has been successfully updated! Notice that:

- The contract address remains the same (`0x9942a81bc6c3c5b7`)
- The existing state (`count`) is preserved
- New functionality is now available

:::

### Test the First Upgrade

Let's test the new event functionality. Create a simple transaction to test the enhanced `increment()` function:

```bash
flow generate transaction TestEvenEvent
```

Replace the contents of `cadence/scripts/CheckCounter.cdc` with:

```cadence
import "Counter"

access(all) fun main(): {String: AnyStruct} {
    return {
        "count": Counter.getCount(),
        "isEven": Counter.isEven()
    }
}
```

Run the script to check the current state:

```bash
flow scripts execute cadence/scripts/CheckCounter.cdc --network testnet
```

You should see output showing the counter state:

```bash
Result: {"count": 1, "isEven": false}
```

Notice that:

- The original `count` value is preserved (showing the increment from our earlier test)
- The new `isEven()` function works correctly (1 is odd, so it returns false)

---

## Upgrade the Contract - Part 2: Adding More Functionality

Now that we've successfully added the even number event, let's add more functionality to our contract. This demonstrates how you can make multiple incremental upgrades to extend your contract's capabilities.

### Modify the Counter Contract - Second Upgrade

Update `cadence/contracts/Counter.cdc` to add the additional functionality:

```cadence
access(all) contract Counter {

    access(all) var count: Int

    // Event to be emitted when the counter is incremented
    access(all) event CounterIncremented(newCount: Int)

    // Event to be emitted when the counter is decremented
    access(all) event CounterDecremented(newCount: Int)

    // Event to be emitted when the counter is incremented and the result is even
    access(all) event CounterIncrementedToEven(newCount: Int)

    // NEW: Event to be emitted when the counter is incremented by 2
    access(all) event CounterIncrementedByTwo(newCount: Int)

    // NEW: Event to be emitted when the counter is decremented by 2
    access(all) event CounterDecrementedByTwo(newCount: Int)

    init() {
        self.count = 0
    }

    // Public function to increment the counter
    access(all) fun increment() {
        self.count = self.count + 1
        emit CounterIncremented(newCount: self.count)

        // Also emit event if the result is even
        if self.count % 2 == 0 {
            emit CounterIncrementedToEven(newCount: self.count)
        }
    }

    // Public function to decrement the counter
    access(all) fun decrement() {
        self.count = self.count - 1
        emit CounterDecremented(newCount: self.count)
    }

    // Public function to get the current count
    view access(all) fun getCount(): Int {
        return self.count
    }

    // NEW: Public function to increment the counter by 2
    access(all) fun incrementByTwo() {
        self.count = self.count + 2
        emit CounterIncrementedByTwo(newCount: self.count)
    }

    // NEW: Public function to decrement the counter by 2
    access(all) fun decrementByTwo() {
        self.count = self.count - 2
        emit CounterDecrementedByTwo(newCount: self.count)
    }

    // NEW: Public function to check if the current count is even
    view access(all) fun isEven(): Bool {
        return self.count % 2 == 0
    }
}
```

### Key Changes Made - Part 2

This second upgrade adds:

1. **New functions**: `incrementByTwo()` and `decrementByTwo()` that modify the existing counter by 2
2. **New events**: `CounterIncrementedByTwo` and `CounterDecrementedByTwo` for the new functionality
3. **New view function**: `isEven()` to check if the current count is even
4. **Preserved existing functionality**: All previous functionality remains intact

---

## Update the Deployed Contract - Part 2

Now let's update the deployed contract with our second upgrade.

### Update the Contract Again

Use the [Flow CLI update contract command] to upgrade your deployed contract with the additional functionality:

```bash
flow accounts update-contract ./cadence/contracts/Counter.cdc --signer testnet-account --network testnet
```

You should see output similar to:

```bash
Contract 'Counter' updated on account '0x9942a81bc6c3c5b7'

Address	 0x9942a81bc6c3c5b7
Balance	 99999999999.70000000
Keys	 1

Key 0	Public Key		 [your public key]
	Weight			 1000
	Signature Algorithm	 ECDSA_P256
	Hash Algorithm		 SHA3_256
	Revoked 		 false
	Sequence Number	 3
	Index			 0

Contracts Deployed: 1
Contract: 'Counter'
```

:::success

The contract has been successfully updated again! Notice that:

- The contract address remains the same (`0x9942a81bc6c3c5b7`)
- The existing state (`count`) is preserved
- All previous functionality is still available
- New functionality is now available

:::

### Verify the Update

Let's verify that the existing functionality still works and the new functionality is available.

Create a script to check the current state:

```bash
flow generate script CheckCounter
```

Replace the contents of `cadence/scripts/CheckCounter.cdc` with:

```cadence
import "Counter"

access(all) fun main(): {String: AnyStruct} {
    return {
        "count": Counter.getCount(),
        "isEven": Counter.isEven()
    }
}
```

Run the script to check the current state:

```bash
flow scripts execute cadence/scripts/CheckCounter.cdc --network testnet
```

You should see output showing the counter state:

```bash
Result: {"count": 2, "isEven": true}
```

Notice that:

- The original `count` value is preserved (showing the increments from our earlier tests)
- The new `isEven()` function works correctly (2 is even, so it returns true)

---

## Test the New Functionality

Now let's create a transaction to test the new even counter functionality.

### Create Test Transaction

Create a new transaction to test the upgraded functionality:

```bash
flow generate transaction TestNewCounter
```

Replace the contents of `cadence/transactions/TestNewCounter.cdc` with:

```cadence
import "Counter"

transaction {
    prepare(acct: &Account) {
        // Authorizes the transaction
    }

    execute {
        // Test the new functionality
        log("Current count: ".concat(Counter.getCount().toString()))
        log("Is even: ".concat(Counter.isEven().toString()))

        // Test the new incrementByTwo function
        Counter.incrementByTwo()
        log("After incrementByTwo: ".concat(Counter.getCount().toString()))
        log("Is even now: ".concat(Counter.isEven().toString()))

        Counter.incrementByTwo()
        log("After second incrementByTwo: ".concat(Counter.getCount().toString()))

        // Test the new decrementByTwo function
        Counter.decrementByTwo()
        log("After decrementByTwo: ".concat(Counter.getCount().toString()))

        // Verify original functionality still works and test the new event
        Counter.increment()
        log("After regular increment: ".concat(Counter.getCount().toString()))
        log("Is even now: ".concat(Counter.isEven().toString()))

        // Increment again to trigger the CounterIncrementedToEven event
        Counter.increment()
        log("After second increment: ".concat(Counter.getCount().toString()))
        log("Is even now: ".concat(Counter.isEven().toString()))
    }
}
```

### Run the Test Transaction

Execute the transaction to test the new functionality:

```bash
flow transactions send cadence/transactions/TestNewCounter.cdc --signer testnet-account --network testnet
```

You should see logs showing:

- The counter incrementing by 2 each time with `incrementByTwo()`
- The counter decrementing by 2 with `decrementByTwo()`
- The `isEven()` function working correctly
- The original `increment()` function still working normally
- The new `CounterIncrementedToEven` event being emitted when incrementing results in an even number

### Verify Final State

Run the check script again to see the final state:

```bash
flow scripts execute cadence/scripts/CheckCounter.cdc --network testnet
```

You should see output similar to:

```bash
Result: {"count": 6, "isEven": true}
```

This confirms that:

- The new functions work correctly with the existing counter
- The original state was preserved during the upgrade
- The new functionality is fully operational

---

## Understanding Contract Upgrades in Cadence

Cadence provides a sophisticated contract upgrade system that ensures data consistency while allowing controlled modifications. The [Cadence Contract Updatability documentation] provides comprehensive details about the validation rules and restrictions.

### What You Can Upgrade

When upgrading Cadence contracts, you can:

- **Add new state variables** (like `countEven`)
- **Add new functions** (like `incrementEven()` and `decrementEven()`)
- **Add new events** (like `EvenCounterIncremented`)
- **Add new interfaces** and resource types
- **Modify function implementations** (with careful consideration)
- **Remove existing functions** (they are not stored as data)
- **Change function signatures** (parameters, return types)
- **Change access modifiers** of fields and functions
- **Reorder existing fields** (order doesn't affect storage)

### What You Cannot Change

There are important limitations to contract upgrades:

- **Cannot add new fields** to existing structs, resources, or contracts
  - This would cause runtime crashes when loading existing data
  - The initializer only runs once during deployment, not on updates
- **Cannot change the type** of existing state variables
  - Would cause deserialization errors with stored data
- **Cannot remove existing state variables** (though they become inaccessible)
- **Cannot change enum structures** (raw values must remain consistent)
- **Cannot change the contract name** or address

### Validation Goals

The contract update validation ensures that:

- **Stored data doesn't change its meaning** when a contract is updated
- **Decoding and using stored data** does not lead to runtime crashes
- **Type safety is maintained** across all stored values

:::warning

The validation system focuses on preventing runtime inconsistencies with stored data. It does not ensure that programs importing the updated contract remain valid - you may need to update dependent code if you change function signatures or remove functions.

:::

### Advanced Upgrade Patterns

#### The `#removedType` Pragma

For cases where you need to remove a type declaration (which is normally invalid), Cadence provides the `#removedType` pragma. This allows you to "tombstone" a type, preventing it from being re-added with the same name:

```cadence
access(all) contract Foo {
    // Remove the resource R permanently
    #removedType(R)

    // Other contract code...
}
```

This pragma:

- **Prevents security issues** from type confusion
- **Cannot be removed** once added (prevents circumventing restrictions)
- **Only works with composite types**, not interfaces

#### Enum Upgrade Restrictions

Enums have special restrictions due to their raw value representation:

- **Can only add enum cases at the end** of existing cases
- **Cannot reorder, rename, or remove** existing enum cases
- **Cannot change the raw type** of an enum
- **Cannot change enum case names** (would change stored values' meaning)

### Best Practices

When upgrading contracts:

1. **Plan upgrades carefully** - Consider future extensibility and avoid breaking changes
2. **Test thoroughly** - Verify both old and new functionality work correctly
3. **Use events** - Emit events for new functionality to enable monitoring and indexing
4. **Document changes** - Keep track of what was added, removed, or modified in each upgrade
5. **Consider dependent code** - Update any programs that import your contract if you change function signatures
6. **Use the `#removedType` pragma** - When you need to permanently remove types
7. **Validate enum changes** - Ensure enum modifications follow the strict rules
8. **Test with existing data** - Verify upgrades work with real stored state, not just empty contracts

---

## Why This Matters

Cadence's contract upgrade model provides several advantages:

- **No proxy patterns needed** - Unlike Ethereum, you don't need complex proxy contracts
- **State preservation** - Existing data and functionality remain intact
- **Address stability** - Contract addresses don't change during upgrades
- **Gas efficiency** - Upgrades are more efficient than redeployment
- **User experience** - Applications continue working without interruption

This approach allows you to evolve your contracts over time, adding new features and capabilities while maintaining backward compatibility and preserving user data.

## Conclusion

In this tutorial, you learned how to upgrade deployed Cadence contracts through multiple incremental upgrades by:

- **Deploying an initial contract** to Flow testnet
- **Performing a first upgrade** to add an event for even numbers based on user feedback
- **Testing the first upgrade** to verify the new event functionality works correctly
- **Performing a second upgrade** to add additional functions and events
- **Testing the complete upgraded functionality** with comprehensive transactions
- **Verifying state preservation** and backward compatibility across multiple upgrades

Now that you have completed the tutorial, you should be able to:

- Deploy contracts to Flow testnet using Flow CLI
- Perform incremental contract upgrades by adding new functions and events
- Update deployed contracts multiple times while preserving existing state
- Test upgraded functionality with Cadence transactions and scripts
- Understand what can and cannot be changed during contract upgrades
- Apply realistic upgrade scenarios based on user feedback and requirements
- Plan and execute multiple contract upgrades over time

This incremental upgrade model makes Cadence contracts more flexible and maintainable than traditional smart contract platforms, allowing you to evolve your applications over time based on real user needs without complex migration patterns or breaking changes. The ability to make multiple upgrades while preserving state and maintaining the same contract address provides a powerful foundation for long-term application development.

<!-- Reference-style links -->

[Flow CLI installed]: ../../../build/tools/flow-cli/install.md
[Cadence]: https://cadence-lang.org/docs/tutorial/first-steps
[Flow accounts]: ../../../build/cadence/basics/accounts.md
[Create accounts]: ../../../build/tools/flow-cli/commands.md#create-accounts
[Fund accounts]: ../../../build/tools/flow-cli/commands.md#fund-accounts
[Flow CLI update contract command]: ../../../build/tools/flow-cli/accounts/account-update-contract.md
[Cadence Contract Updatability documentation]: https://cadence-lang.org/docs/language/contract-updatability
[Compose with Cadence Transactions]: ./compose-with-cadence-transactions.md
