---
title: Cron-Based Recurring Transactions
sidebar_position: 9
description: Learn how to schedule recurring transactions on Flow using the FlowCron smart contract.
---

# Cron-Based Recurring Transactions

Sometimes you need blockchain logic to run automatically on a schedule: distributing rewards every day, checking conditions every hour, or processing batches every week. Instead of manually triggering these transactions, you can automate them.

**Cron** is a time-based scheduling system originally from Unix. It lets you define "run this at 9am every Monday" using a simple pattern called a cron expression. The **FlowCron** smart contract brings this same concept onchain, so you can schedule recurring transactions that run automatically without any external triggers.

For example, with the cron expression `0 0 * * *` (daily at midnight), your transaction executes every day at midnight UTC—indefinitely—until you stop it.

:::info

`FlowCron` builds on Flow's Scheduled Transactions. If you haven't worked with scheduled transactions before, check out the [Scheduled Transactions documentation](scheduled-transactions.md) first.

:::

## How It Works

`FlowCron` provides a `CronHandler` resource that wraps your existing [TransactionHandler]. You give it a cron expression (like `*/5 * * * *` for every 5 minutes) and your handler, and `FlowCron` takes care of the rest. Once started, your schedule runs indefinitely without any further action from you.

### Why Two Transactions?

A key challenge with recurring schedules is fault tolerance: what happens if your code has a bug? You don't want one failed execution to break the entire schedule.

`FlowCron` solves this by running two separate transactions each time your cron triggers:

- **Executor**: Runs your code. If your logic fails, only this transaction reverts.
- **Keeper**: Schedules the next cycle. Runs independently, so even if your code throws an error, the schedule continues.

**The benefit**: Your recurring schedule won't break if your `TransactionHandler` execution fails. The keeper always ensures the next execution is scheduled, regardless of whether the current one succeeded or failed.

```
Timeline ─────────────────────────────────────────────────────────>
    T1                      T2                      T3
    │                       │                       │
    ├── Executor ──────────►├── Executor ──────────►├── Executor
    │   (runs user code)    │   (runs user code)    │   (runs user code)
    │                       │                       │
    └── Keeper ────────────►└── Keeper ────────────►└── Keeper
        (schedules T2)          (schedules T3)          (schedules T4)
        (+1s offset)            (+1s offset)            (+1s offset)
```

## Cron Expressions

A cron expression is just five numbers (or wildcards) that define when something should run.

`FlowCron` uses the standard 5-field cron format:

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

**Operators:** `*` (any), `,` (list), `-` (range), `/` (step)

| Pattern | When it runs |
| --- | --- |
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Top of every hour |
| `0 0 * * *` | Daily at midnight |
| `0 0 * * 0` | Weekly on Sunday |
| `0 9-17 * * 1-5` | Hourly, 9am-5pm weekdays |

:::note

When you specify both day-of-month and day-of-week (not `*`), the job runs if **either** matches. So `0 0 15 * 0` fires on the 15th OR on Sundays.

:::

## Setup

Setting up a cron job involves four steps:

1. **Create a handler**: Write the code you want to run on each tick
2. **Wrap it with FlowCron**: Connect your handler to a cron schedule
3. **Start the schedule**: Kick off the first execution
4. **Monitor**: Check that everything is running

All transactions and scripts referenced below are available in the [FlowCron GitHub repository].

### Prerequisites

Before you start, make sure you have:

- **[Flow CLI]** installed: This is the command-line tool you'll use to deploy contracts, send transactions, and run scripts. If you don't have it yet, follow the [installation guide].
- **FLOW tokens** for transaction fees: Every transaction costs a small amount of FLOW. Get free testnet FLOW from the [Faucet].
- A **Flow account**: The CLI will help you create one if you don't have one yet.

### 1. Create Your Handler

First, you need to write the code that will run on each scheduled tick. In Cadence, this is called a `TransactionHandler`. A `TransactionHandler` is a resource that implements the `FlowTransactionScheduler.TransactionHandler` interface.

The key part is the `executeTransaction` function. This is where you put whatever logic you want to run on schedule: updating state, distributing tokens, checking conditions, etc.

For more details on how handlers work, see the [Scheduled Transactions documentation](scheduled-transactions.md#create-a-scheduled-transaction).

Here's a simple example contract:

```cadence
import "FlowTransactionScheduler"

access(all) contract MyRecurringTask {

    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {

        access(FlowTransactionScheduler.Execute)
        fun executeTransaction(id: UInt64, data: AnyStruct?) {
            // Your logic here
            log("Cron fired at ".concat(getCurrentBlock().timestamp.toString()))
        }

        access(all) view fun getViews(): [Type] {
            return [Type<StoragePath>(), Type<PublicPath>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<StoragePath>():
                    return /storage/MyRecurringTaskHandler
                case Type<PublicPath>():
                    return /public/MyRecurringTaskHandler
                default:
                    return nil
            }
        }
    }

    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }
}
```

This example handler simply logs the timestamp when executed. Replace the `log` statement with your own logic.

#### Deploy Your Contract

Use the Flow CLI to deploy your `TransactionHandler` contract:

```bash
flow project deploy --network=testnet
```

This command reads your `flow.json` configuration and deploys all configured contracts. If you're new to deploying, see the [deployment guide] for a complete walkthrough.

#### Create and Store a Handler Instance

After deploying, you need to create an instance of your handler and save it to your account's **storage**. The **storage** is an area in your account where you can save resources (like your handler) that persist between transactions.

See [CounterTransactionHandler.cdc] for a complete working example that includes the storage setup.

### 2. Wrap It with `FlowCron`

Now you need to wrap your handler with a `CronHandler`. This connects your handler to a cron schedule.

The following transaction creates a new `CronHandler` resource that holds your cron expression and a reference to your handler:

```cadence
transaction(
    cronExpression: String,
    wrappedHandlerStoragePath: StoragePath,
    cronHandlerStoragePath: StoragePath
) {
    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, SaveValue) &Account) {
        // Issue capability for wrapped handler
        let wrappedHandlerCap = acct.capabilities.storage.issue<
            auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}
        >(wrappedHandlerStoragePath)

        // Create and save the CronHandler
        let cronHandler <- FlowCron.createCronHandler(
            cronExpression: cronExpression,
            wrappedHandlerCap: wrappedHandlerCap,
            feeProviderCap: feeProviderCap,
            schedulerManagerCap: schedulerManagerCap
        )
        acct.storage.save(<-cronHandler, to: cronHandlerStoragePath)
    }
}
```

See [CreateCronHandler.cdc] for the full transaction.

**Send this transaction using the Flow CLI:**

```bash
flow transactions send CreateCronHandler.cdc \
  "*/5 * * * *" \
  /storage/MyRecurringTaskHandler \
  /storage/MyCronHandler \
  --network=testnet
```

The arguments are: your cron expression, the storage path where your handler lives, and the path where the new `CronHandler` will be stored.

### 3. Start the Schedule

This transaction schedules the first executor and keeper, which kicks off the self-perpetuating loop. After this, your cron job runs automatically:

```cadence
transaction(
    cronHandlerStoragePath: StoragePath,
    wrappedData: AnyStruct?,
    executorPriority: UInt8,
    executorExecutionEffort: UInt64,
    keeperExecutionEffort: UInt64
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue) &Account) {
        // Calculate next cron tick time
        let cronHandler = signer.storage.borrow<&FlowCron.CronHandler>(from: cronHandlerStoragePath)
            ?? panic("CronHandler not found")
        let executorTime = FlowCronUtils.nextTick(spec: cronHandler.getCronSpec(), afterUnix: currentTime)
    }

    execute {
        // Schedule executor (runs your code)
        self.manager.schedule(
            handlerCap: self.cronHandlerCap,
            data: self.executorContext,
            timestamp: UFix64(self.executorTime),
            ...
        )
        // Schedule keeper (schedules next cycle)
        self.manager.schedule(
            handlerCap: self.cronHandlerCap,
            data: self.keeperContext,
            timestamp: UFix64(self.keeperTime),
            ...
        )
    }
}
```

See [ScheduleCronHandler.cdc] for the full transaction.

**Send this transaction using the Flow CLI:**

```bash
flow transactions send ScheduleCronHandler.cdc \
  /storage/MyCronHandler \
  nil \
  2 \
  500 \
  2500 \
  --network=testnet
```

**Parameters:**

| Parameter | Description |
| --- | --- |
| `cronHandlerStoragePath` | Path to your CronHandler |
| `wrappedData` | Optional data passed to handler (`nil` or your data) |
| `executorPriority` | 0 (High), 1 (Medium), or 2 (Low) |
| `executorExecutionEffort` | Computation units for your code (start with `500`) |
| `keeperExecutionEffort` | Computation units for keeper (use `2500`) |

:::warning[Fees]

Starting a cron job requires prepaying fees for the scheduled transactions. FLOW will be deducted from your account to cover the executor and keeper fees. Make sure you have enough FLOW before running this transaction.

:::

Once this transaction succeeds, **your cron job is live**. The first execution will happen at the next cron tick, and the schedule will continue automatically from there. You don't need to do anything else, unless you want to monitor it or stop it.

### 4. Check Status

Use Cadence **scripts** to check your cron job's status. Scripts are read-only queries that inspect blockchain state without submitting a transaction—they're free to run and don't modify anything. Learn more in the [scripts documentation].

#### Query Cron Info

The [GetCronInfo.cdc] script returns metadata about your cron handler:

```cadence
access(all) fun main(handlerAddress: Address, handlerStoragePath: StoragePath): FlowCron.CronInfo? {
    let account = getAuthAccount<auth(BorrowValue) &Account>(handlerAddress)
    if let handler = account.storage.borrow<&FlowCron.CronHandler>(from: handlerStoragePath) {
        return handler.resolveView(Type<FlowCron.CronInfo>()) as? FlowCron.CronInfo
    }
    return nil
}
```

**Run this script using the Flow CLI:**

```bash
flow scripts execute GetCronInfo.cdc 0xYourAddress /storage/MyCronHandler --network=testnet
```

If your cron job is running, you'll see output showing the cron expression, next scheduled execution time, and handler status.

#### Calculate Next Execution Time

The [GetNextExecutionTime.cdc] script calculates when your cron expression will next trigger:

```cadence
access(all) fun main(cronExpression: String, afterUnix: UInt64?): UFix64? {
    let cronSpec = FlowCronUtils.parse(expression: cronExpression)
    if cronSpec == nil { return nil }
    let nextTime = FlowCronUtils.nextTick(
        spec: cronSpec!,
        afterUnix: afterUnix ?? UInt64(getCurrentBlock().timestamp)
    )
    return nextTime != nil ? UFix64(nextTime!) : nil
}
```

**Run this script using the Flow CLI:**

```bash
flow scripts execute GetNextExecutionTime.cdc "*/5 * * * *" nil --network=testnet
```

#### Additional Debugging Scripts

- [GetCronScheduleStatus.cdc] — Returns executor/keeper transaction IDs, timestamps, and current status
- [GetParsedCronExpression.cdc] — Validates and parses a cron expression into a `CronSpec`

## Stopping a Cron Job

You might want to stop a cron job for several reasons:

- **Debugging**: Something isn't working and you need to investigate
- **Updating**: You want to change the schedule or handler logic
- **Cost**: You no longer need the recurring execution
- **Temporary pause**: You want to stop temporarily and restart later

To stop a running cron job, you need to cancel both the pending executor and keeper transactions. This transaction retrieves the scheduled transaction IDs from your `CronHandler` and cancels them:

```cadence
transaction(cronHandlerStoragePath: StoragePath) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue) &Account) {
        let cronHandler = signer.storage.borrow<&FlowCron.CronHandler>(from: cronHandlerStoragePath)
            ?? panic("CronHandler not found")

        self.executorID = cronHandler.getNextScheduledExecutorID()
        self.keeperID = cronHandler.getNextScheduledKeeperID()
    }

    execute {
        // Cancel executor and keeper, receive fee refunds
        if let id = self.executorID {
            let refund <- self.manager.cancel(id: id)
            self.feeReceiver.deposit(from: <-refund)
        }
        if let id = self.keeperID {
            let refund <- self.manager.cancel(id: id)
            self.feeReceiver.deposit(from: <-refund)
        }
    }
}
```

See [CancelCronSchedule.cdc] for the full transaction.

**Send this transaction using the Flow CLI:**

```bash
flow transactions send CancelCronSchedule.cdc /storage/MyCronHandler --network=testnet
```

Cancelling refunds 50% of the prepaid fees back to your account.

## Contract Addresses

`FlowCron` is deployed on both Testnet and Mainnet:

| Contract | Testnet | Mainnet |
| --- | --- | --- |
| `FlowCron` | `0x5cbfdec870ee216d` | `0x6dec6e64a13b881e` |
| `FlowCronUtils` | `0x5cbfdec870ee216d` | `0x6dec6e64a13b881e` |

## Resources

- [FlowCron GitHub repository]
- [Scheduled Transactions Documentation]

<!-- Links -->

[FlowCron GitHub repository]: https://github.com/onflow/flow-cron
[Scheduled Transactions Documentation]: scheduled-transactions.md
[TransactionHandler]: scheduled-transactions.md#create-a-scheduled-transaction
[Flow CLI]: ../../tools/flow-cli/index.md
[installation guide]: ../../tools/flow-cli/install.md
[Faucet]: https://faucet.flow.com/
[deployment guide]: ../smart-contracts/deploying.md
[scripts documentation]: ../basics/scripts.md

<!-- Transactions -->

[CreateCronHandler.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/transactions/CreateCronHandler.cdc
[ScheduleCronHandler.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/transactions/ScheduleCronHandler.cdc
[CancelCronSchedule.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/transactions/CancelCronSchedule.cdc

<!-- Scripts -->

[GetCronInfo.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/scripts/GetCronInfo.cdc
[GetNextExecutionTime.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/scripts/GetNextExecutionTime.cdc
[GetCronScheduleStatus.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/scripts/GetCronScheduleStatus.cdc
[GetParsedCronExpression.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/scripts/GetParsedCronExpression.cdc

<!-- Examples -->

[CounterTransactionHandler.cdc]: https://github.com/onflow/flow-cron/blob/main/cadence/tests/mocks/contracts/CounterTransactionHandler.cdc
