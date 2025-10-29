---
sidebar_position: 1
sidebar_label: Cadence Environment Setup
title: Cadence Environment Setup
description: Learn how to set up your complete Flow development environment, deploy your first smart contract, and master the fundamentals of blockchain development with Cadence on the Flow emulator.
keywords:
  - Flow development
  - Flow CLI
  - smart contracts
  - local development
  - Flow emulator
  - contract deployment
  - Cadence programming
  - blockchain development
  - Counter contract
  - testing
  - VSCode extension
---

# Cadence Environment Setup

This comprehensive tutorial will guide you through how to set up your complete development environment, deploy your first smart contract, and learn the fundamentals of Flow development. You'll work hands-on with the Flow CLI, local emulator, and a real smart contract to build practical skills from day one.

Flow is a blockchain built for the next generation of apps, games, and digital assets. With its unique multi-role architecture and resource-oriented programming language Cadence, Flow allows developers to create secure, composable, and scalable applications. This tutorial focuses on getting you productive with Flow's developer tools as quickly as possible.

## What You'll Learn

After you complete this tutorial, you'll be able to:

- **Set up a complete Flow development environment** with CLI tools and VSCode integration.
- **Create and manage Flow projects** using the Flow CLI and understand project structure.
- **Deploy and interact with smart contracts** on the local Flow emulator.
- **Execute scripts and transactions** to read from and modify blockchain state.
- **Understand Flow's account model** and how contracts are deployed to account storage.
- **Navigate the Flow ecosystem** and know where to find help and resources.

## What You'll Build

You'll work with a `Counter` contract, a simple but comprehensive example that demonstrates core Flow development patterns. This contract maintains a count value and provides functions to increment, decrement, and read the current count. By the end of this tutorial, you'll have:

- A fully functional local Flow development environment.
- A deployed Counter contract running on your local emulator.
- Scripts to query the contract's state.
- Transactions to modify the contract's state.
- Understanding of how to extend this foundation for more complex applications.

**Time Commitment:** Approximately 30-45 minutes

**Prerequisites:**

- Basic command line familiarity
- Code editor (VSCode recommended)
- `Node.js` installed (for future frontend development)

---

### Install Flow CLI

The [Flow Command Line Interface] (CLI) is a set of tools that developers can use to interact with the Flow blockchain by managing accounts, sending transactions, deploying smart contracts, running the emulator, and more. This quickstart will get you familiar with its main concepts and functionality.

The first thing you'll need to do is install the Flow CLI. If you have [homebrew] installed, run:

```zsh
brew install flow-cli
```

**For other operating systems,** refer to the [installation guide] for detailed instructions.

**Verify Installation:**

```zsh
flow version
```

You will see output showing your Flow CLI version.

### Install VSCode Extension

Install the [Flow Cadence VSCode Extension] from the marketplace. This extension provides:

- Syntax highlighting for Cadence.
- Code completion and IntelliSense.
- Error checking and diagnostics.
- Integrated development tools.

## Create Your First Project

Navigate to your desired development directory and create a new Flow project:

```zsh
flow init
```

When prompted:

1. **Project name:** Enter your preferred project name.
2. Select `Basic Cadence project (no dependencies)`.

The `flow init` command creates:

- **`flow.json`**: Central configuration file containing accounts, contracts, deployments, and network settings.
- **`emulator-account.pkey`**: Private key for the default emulator account.
- **`cadence/`**: Directory structure for your Cadence code:
  - `contracts/`: Smart contract files
  - `scripts/`: Read-only blockchain queries
  - `transactions/`: State-changing operations
  - `tests/`: Contract test files

Navigate into your project directory:

```zsh
cd your-flow-project-name
```

:::info

For additional details on how `flow.json` is configured, review the [configuration docs].

:::

### Start the Flow Emulator

The emulator is a local version of the Flow blockchain that you can use to test your contracts and scripts. It's a great way to develop and test your contracts locally - before you try them on the `testnet` or `mainnet`.

Before we deploy, let's open a new terminal window and run the emulator. From the root of your project directory, where your `emulator-account.pkey` and `flow.json` files are located, run:

```zsh
flow emulator start
```

Keep this terminal running. The emulator provides:

- Local blockchain environment.
- Fast transaction processing.
- No real-world costs.
- Complete Flow feature set.

## Your First Contract

Now let's examine, deploy, and interact with the Counter contract that was created in your project.

### Examine the Counter Contract

Open `cadence/contracts/Counter.cdc` in your editor. Let's break down this contract:

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

**Key Components:**

- **Contract Declaration**: `access(all) contract Counter` creates a public contract named Counter.
- **State Variable**: `access(all) var count: Int` stores the counter value, accessible to everyone.
- **Events**: `CounterIncremented` and `CounterDecremented` notify listeners when changes occur.
- **Initializer**: `init()` sets the initial count to 0 when the contract is deployed.
- **Public Functions**:
  - `increment()`: Increases count by 1 and emits an event
  - `decrement()`: Decreases count by 1 and emits an event
  - `getCount()`: Returns the current count (read-only, marked with `view`)

### Create and Configure Deployment Account

When you create a project, you'll see that a `Counter` contract was added to your [`flow.json` configuration file](../../../build/tools/flow-cli/flow.json/configuration.md), but it's not set up for deployment yet. We could deploy it to the automatically created `emulator-account`, but for this example, lets also create a new account on the emulator to deploy it to.

:::info

**Reminder**: On Flow Cadence, contracts are deployed to the storage of the account that deploys them.

:::

Leave your emulator running, and open a second terminal. Run the following command:

```zsh
flow accounts create
```

When prompted:

1. **Account name:** Enter `test-account`
2. **Network:** Select `Emulator`

This adds the new account to your `flow.json` configuration file.You'll now see this account in your [`flow.json`](../../../build/tools/flow-cli/flow.json/configuration.md).

After you've created you accounts, then you can view all your accounts on the with the Flow CLI with:

```zsh
📋 Account Status Across Networks

This shows which networks your configured accounts are accessible on:
🌐 Network  🟢 Local (running)  🔴 Local (stopped)  ✓ Found  ✗ Error
─────────────────────────────────────────────────────

🟢 emulator
    ✓ default (f3fcd2c1a78f5eee): 0.00100000 FLOW
    ✓ emulator-account (f8d6e0586b0a20c7): 999999999.99300000 FLOW
    ✓ test-account (e03daebed8ca0615): 0.00100000 FLOW

🌐 mainnet
  No accounts found

🌐 testnet
  No accounts found

🟢 testing
    ✓ default (f3fcd2c1a78f5eee): 0.00100000 FLOW
    ✓ emulator-account (f8d6e0586b0a20c7): 999999999.99300000 FLOW
    ✓ test-account (e03daebed8ca0615): 0.00100000 FLOW


💡 Tip: To fund testnet accounts, run: flow accounts fund
```

This is a great tool to visualize your different accounts and balances when you are developing.

### Configure Contract Deployment

To deploy the `Counter` contract to the emulator, you'll need to add it to your project configuration. To do this, run:

```zsh
flow config add deployment
```

Follow the prompts:

1. **Network:** Select `emulator`
2. **Account:** Select `test-account`
3. **Contract:** Select `Counter`
4. **Deploy more contracts:** Select `no`

This configures your `flow.json` to deploy the Counter contract to your test account on the emulator.

### Deploy the Contract

To deploy the `Counter` contract to the emulator, run:

```zsh
flow project deploy
```

You'll see output similar to:

```zsh
Deploying 1 contracts for accounts: test-account

Counter -> 0x179b6b1cb6755e31 (a98c155fe7afc8eb2af5551748759b08a80a0ae85d1b09f92f1afc293c61ca98)

🎉 All contracts deployed successfully
```

That's it! You've just deployed your first contract to the Flow Emulator.

### Verify Deployment with a Script

Scripts are used to read data from the Flow blockchain. There is no state modification. Let's verify the deployment by reading the counter value. Run the included script:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

You should see:

```zsh
Result: 0
```

This confirms your contract is deployed and functional. The counter starts at zero (0), as defined in the contract's `init()` function.

If we wanted to generate a new script, we could run:

```zsh
flow generate script ScriptName
```

:::info

For more information about generating Cadence files, see the [Generating Cadence Boilerplate] documentation.

**You'll usually want to use these commands instead of adding files manually!**

:::

:::tip

To learn more about writing scripts, check out the docs for [basic scripts].

:::

### Executing Transactions

Now let's increment the counter using a transaction:

```zsh
flow transactions send cadence/transactions/IncrementCounter.cdc
```

By default, this uses the `emulator-account` to sign the transaction and the emulator network. If you want to use your `test-account` account, you can specify the `--signer` flag with the account name. The command would look like this:

```zsh
flow transactions send cadence/transactions/IncrementCounter.cdc --signer test-account
```

The transaction output shows detailed information including:

- Transaction ID and block information.
- Status confirmation (`✅ SEALED`).
- Events emitted (including `CounterIncremented`).

```zsh
Transaction ID: 9cc7ac4d3d5239016965aba89b9692d3401a48a090d1ad1a8d9ef9cfca685e6e

Block ID        b8537860b0fc9ca8b3195b121e762502f9a220874b605d6a810998e8b62321a3
Block Height    3
Status          ✅ SEALED
ID              9cc7ac4d3d5239016965aba89b9692d3401a48a090d1ad1a8d9ef9cfca685e6e
Payer           f8d6e0586b0a20c7
Authorizers     [f8d6e0586b0a20c7]

Proposal Key:
    Address     f8d6e0586b0a20c7
    Index       0
    Sequence    1

No Payload Signatures

Envelope Signature 0: f8d6e0586b0a20c7
Signatures (minimized, use --include signatures)

Events:
    Index       0
    Type        A.179b6b1cb6755e31.Counter.CounterIncremented
    Tx ID       9cc7ac4d3d5239016965aba89b9692d3401a48a090d1ad1a8d9ef9cfca685e6e
    Values
                - newCount (Int): 1



Code (hidden, use --include code)

Payload (hidden, use --include payload)

Fee Events (hidden, use --include fee-events)
```

Run the script to check the counter again. You'll see that it has incremented:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

```zsh
Result: 1
```

:::tip

To learn more about writing transactions, read the docs for [basic transactions].

:::

## Conclusion

You've successfully established a solid foundation for building on Flow. Let's recap what you've accomplished and learned. Through this hands-on tutorial, you've successfully built a complete Flow development foundation:

✅ **Complete Flow Development Environment**

- Flow CLI installed and configured for project management.
- Local Flow emulator running and ready for development.
- Project creation and management workflow with `flow init`.

✅ **Smart Contract Deployment Skills**

- Counter contract successfully deployed to your local emulator.
- Account creation and contract deployment configuration mastered.

✅ **Blockchain Interactions**

- Scripts to query contract state (reading blockchain data).
- Transactions to modify contract state (writing to blockchain).
- Real-time interaction with blockchain data through CLI commands.

### Resources for Continued Learning

As you continue your Flow development journey:

- **[Flow Discord Community]**: Connect with other developers, get help, and share your projects.
- **[Cadence Language Reference]**: Deep dive into Flow's programming language features and best practices.
- **[Flow GitHub]**: Explore open source tools, examples, and contribute to the ecosystem.

The foundation you've built today will serve you well as you explore Flow's capabilities and build applications that take advantage of blockchain's unique properties: permanence, transparency, and decentralization.

Welcome to the Flow developer community—you're ready to build the future of digital experiences!

<!-- Links -->

[Flow Command Line Interface]: ../../../build/tools/flow-cli/index.md
[installation guide]: ../../../build/tools/flow-cli/install
[Flow Cadence VSCode Extension]: https://marketplace.visualstudio.com/items?itemName=onflow.cadence
[`flow.json`]: https://developers.flow.com/build/tools/flow-cli/flow.json/configuration
[Generating Cadence Boilerplate]: https://developers.flow.com/build/tools/flow-cli/generate
[basic scripts]: https://developers.flow.com/build/cadence/basics/scripts
[basic transactions]: https://developers.flow.com/build/cadence/basics/transactions
[tests documentation]: https://developers.flow.com/build/tools/flow-cli/tests
[homebrew]: https://brew.sh/
[configuration docs]: ../../../build/tools/flow-cli/flow.json/configuration.md
[Flow Discord Community]: https://discord.com/invite/flow
[Cadence Language Reference]: https://cadence-lang.org
[Flow GitHub]: https://github.com/onflow
