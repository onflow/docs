---
title: Cron-Based Recurring Transactions
sidebar_position: 9
description: Learn how to schedule recurring transactions on Flow using the FlowCron smart contract.
---

# Cron-based Recurring Transactions

On traditional systems, cron jobs handle recurring executions. On Flow, the **FlowCron** smart contract brings the same familiar cron syntax onchain. You define a schedule like `0 0 * * *` (daily at midnight) using a cron expression, and your transaction runs countinously based on the schedule.

:::info

FlowCron builds on Flow's Scheduled Transactions. If you haven't worked with scheduled transactions before, check out the [Scheduled Transactions documentation](scheduled-transactions.md) first.

:::

## How It Works

FlowCron provides a `CronHandler` resource that wraps any existing [TransactionHandler]. You give it a cron expression and your handler, and it takes care of scheduling and perpetuating the execution cycle. Once started, the schedule runs indefinitely without further intervention.

Under the hood, the `CronHandler` runs two types of transactions per tick to ensure fault tolerance:

- **Executor**: Runs your code. If your logic fails, only this transaction reverts.
- **Keeper**: Schedules the next cycle. Runs independently so the schedule survives even if your code throws an error.

This separation keeps the recurring loop alive regardless of what happens in your handler.

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

FlowCron uses the standard 5-field cron format that you may already know from Unix systems:

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

Setting up a cron job involves creating a handler for your logic, wrapping it with `FlowCron` and scheduling the first tick. All transactions and scripts referenced below are available in the [FlowCron GitHub repository].

Before you start, make sure you have:

- Flow CLI installed
- Some FLOW for transaction fees
- A [TransactionHandler] containing your recurring logic

### 1. Create Your Handler

Create a contract that implements the `TransactionHandler` interface:

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

Deploy this and save a handler instance to storage. See [CounterTransactionHandler.cdc] for a working example.

### 2. Wrap It with `FlowCron`

Create a CronHandler that wraps your handler with a cron expression:

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

See [CreateCronHandler.cdc] for the full transaction. Run it with:

```bash
flow transactions send CreateCronHandler.cdc \
  "*/5 * * * *" \
  /storage/MyRecurringTaskHandler \
  /storage/MyCronHandler
```

### 3. Start the Schedule

Schedule the first executor and keeper to kick off the perpetual loop:

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

See [ScheduleCronHandler.cdc] for the full transaction. Run it with:

```bash
flow transactions send ScheduleCronHandler.cdc \
  /storage/MyCronHandler \
  nil \
  2 \
  500 \
  2500
```

**Parameters:**

| Parameter | Description |
| --- | --- |
| `cronHandlerStoragePath` | Path to your CronHandler |
| `wrappedData` | Optional data passed to handler (`nil` or your data) |
| `executorPriority` | 0 (High), 1 (Medium), or 2 (Low) |
| `executorExecutionEffort` | Computation units for your code (start with `500`) |
| `keeperExecutionEffort` | Computation units for keeper (use `2500`) |

### 4. Check Status

Query your cron job's metadata with [GetCronInfo.cdc]:

```cadence
access(all) fun main(handlerAddress: Address, handlerStoragePath: StoragePath): FlowCron.CronInfo? {
    let account = getAuthAccount<auth(BorrowValue) &Account>(handlerAddress)
    if let handler = account.storage.borrow<&FlowCron.CronHandler>(from: handlerStoragePath) {
        return handler.resolveView(Type<FlowCron.CronInfo>()) as? FlowCron.CronInfo
    }
    return nil
}
```

```bash
flow scripts execute GetCronInfo.cdc 0xYourAddress /storage/MyCronHandler
```

Calculate when the next tick will occur with [GetNextExecutionTime.cdc]:

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

```bash
flow scripts execute GetNextExecutionTime.cdc "*/5 * * * *" nil
```

Additional scripts for debugging:

- [GetCronScheduleStatus.cdc] — Returns executor/keeper IDs, timestamps, and status
- [GetParsedCronExpression.cdc] — Validates and parses a cron expression into a `CronSpec`

## Stopping a Cron Job

To stop a running cron job, cancel both the executor and keeper transactions:

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

See [CancelCronSchedule.cdc] for the full transaction. Run it with:

```bash
flow transactions send CancelCronSchedule.cdc /storage/MyCronHandler
```

Cancelling refunds 50% of the prepaid fees back to your account.

## Contract Addresses

FlowCron is deployed on both Testnet and Mainnet:

| Contract | Testnet | Mainnet |
| --- | --- | --- |
| FlowCron | `0x5cbfdec870ee216d` | `0x6dec6e64a13b881e` |
| FlowCronUtils | `0x5cbfdec870ee216d` | `0x6dec6e64a13b881e` |

## Resources

- [FlowCron GitHub repository]
- [Scheduled Transactions Documentation]

<!-- Links -->

[FlowCron GitHub repository]: https://github.com/onflow/flow-cron
[Scheduled Transactions Documentation]: scheduled-transactions.md
[TransactionHandler]: scheduled-transactions.md#create-a-scheduled-transaction

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
