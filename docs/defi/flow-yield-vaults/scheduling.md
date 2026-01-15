---
title: Scheduling System
sidebar_position: 7
---

# Scheduling System

FYV implements a sophisticated self-scheduling mechanism that enables perpetual automated rebalancing without relying on external bots or keepers. This document explains how the scheduling system works and ensures continuous vault optimization.

## Overview

The scheduling system consists of three main components:

1. **FlowTransactionScheduler** - Flow's native transaction scheduling infrastructure
2. **SchedulerRegistry** - Tracks all vaults and their scheduling state
3. **Supervisor** - Recovery mechanism for stuck vaults

Together, these components create a self-sustaining automation system where vaults schedule their own rebalancing indefinitely.

## Self-Scheduling Mechanism

### How It Works

Each AutoBalancer implements a self-perpetuating scheduling loop:

**Initial Schedule** (vault creation):
```cadence
// During vault creation
autoBalancer.scheduleFirstRebalance()
  ↓
FlowTransactionScheduler.schedule(
    functionCall: "rebalance()",
    executeAt: currentTime + 60 seconds
)
```

**Execution** (scheduled time arrives):
```cadence
// Scheduler calls
autoBalancer.rebalance()
  ↓
// Perform rebalancing logic
checkRatio()
executeIfNeeded()
  ↓
// Reschedule next execution
scheduleNextRebalance()
  ↓
FlowTransactionScheduler.schedule(
    functionCall: "rebalance()",
    executeAt: currentTime + 60 seconds
)
```

**Perpetual Loop**:
```
Execute → Rebalance → Schedule Next → Wait 60s → Execute → ...
```

This creates an infinite loop where each rebalance execution schedules the next one, requiring no external coordination.

### Atomic Registration

Vault creation and scheduling registration happen atomically to prevent orphaned vaults:

```cadence
transaction createVault() {
    prepare(signer: AuthAccount) {
        // Create all components
        let vault <- createYieldVault(...)
        let autoBalancer <- createAutoBalancer(...)
        let position <- createPosition(...)

        // Register (all steps must succeed)
        registerInRegistry(autoBalancer)     // Step 1
        scheduleFirstRebalance(autoBalancer) // Step 2
        linkComponents(...)                   // Step 3

        // If ANY step fails → entire transaction reverts
        // No partial vaults created
    }
}
```

**Atomicity guarantee**: Either vault is fully created with working schedule, OR transaction fails and nothing is created.

## SchedulerRegistry

The SchedulerRegistry maintains a global record of all active vaults and their scheduling state.

### Registry Structure

```cadence
pub contract FlowYieldVaultsSchedulerRegistry {
    // Maps vault ID → scheduling info
    access(contract) var registry: {UInt64: ScheduleInfo}

    pub struct ScheduleInfo {
        pub let vaultID: UInt64
        pub let autoBalancerCap: Capability<&AutoBalancer>
        pub let nextScheduledTime: UFix64
        pub let status: ScheduleStatus  // Active, Pending, Stuck
    }

    pub enum ScheduleStatus: UInt8 {
        pub case Active    // Scheduling working normally
        pub case Pending   // Awaiting schedule
        pub case Stuck     // Failed to reschedule
    }
}
```

### Registration Lifecycle

**On vault creation:**
```cadence
registry.register(
    vaultID: 42,
    autoBalancerCap: capability,
    status: ScheduleStatus.Pending
)
```

**After first successful schedule:**
```cadence
registry.updateStatus(
    vaultID: 42,
    status: ScheduleStatus.Active,
    nextScheduledTime: currentTime + 60
)
```

**If schedule fails:**
```cadence
registry.updateStatus(
    vaultID: 42,
    status: ScheduleStatus.Stuck
)
// Supervisor will attempt recovery
```

**On vault liquidation:**
```cadence
registry.unregister(vaultID: 42)
// Vault removed from tracking
```

## Supervisor Recovery System

The Supervisor handles vaults that become stuck or fail to self-schedule.

### What Can Go Wrong?

Despite atomicity guarantees, vaults can become stuck for several reasons:

1. **Transaction failure** during reschedule due to gas issues or network congestion
2. **Capability revocation** if user accidentally breaks autoBalancer capability
3. **Scheduler overload** if too many transactions scheduled simultaneously
4. **Network issues** during schedule transaction propagation

### Supervisor Implementation

```cadence
pub resource Supervisor {
    // Scan registry and recover stuck vaults
    pub fun recover() {
        let pending = registry.getPendingVaults(limit: 50)

        for vaultID in pending {
            let scheduleInfo = registry.getScheduleInfo(vaultID)

            // Attempt to reschedule
            if let autoBalancer = scheduleInfo.autoBalancerCap.borrow() {
                autoBalancer.scheduleNextRebalance()

                registry.updateStatus(
                    vaultID: vaultID,
                    status: ScheduleStatus.Active
                )
            }
        }

        // If more work remains, schedule next supervisor run
        if registry.hasPendingVaults() {
            self.scheduleSelf()
        }
    }

    access(self) fun scheduleSelf() {
        FlowTransactionScheduler.schedule(
            functionCall: "recover()",
            executeAt: currentTime + 120 seconds
        )
    }
}
```

### Bounded Processing

The Supervisor processes a maximum of 50 vaults per execution to prevent timeout:

```
Iteration 1: Process vaults 1-50   → Reschedule supervisor
Iteration 2: Process vaults 51-100 → Reschedule supervisor
Iteration 3: Process vaults 101-120 → No more pending, stop
```

This ensures the recovery process can handle any number of stuck vaults without failing due to gas limits.

### Recovery Triggers

The Supervisor runs in two scenarios:

**1. Scheduled Recovery** (proactive):
```
Every 10 minutes:
  → Check for pending vaults
  → Attempt recovery
  → Reschedule if more work exists
```

**2. Manual Recovery** (reactive):
```cadence
transaction triggerSupervisor() {
    prepare(admin: AuthAccount) {
        let supervisor = admin.borrow<&Supervisor>(...)
        supervisor.recover()
    }
}
```

## Scheduling Parameters

Key configuration parameters control scheduling behavior:

```cadence
pub struct SchedulingConfig {
    // Rebalancing frequency
    pub let rebalanceIntervalSeconds: UInt64  // Default: 60

    // Supervisor recovery frequency
    pub let supervisorIntervalSeconds: UInt64 // Default: 600 (10 min)

    // Max vaults per supervisor run
    pub let maxSupervisorBatchSize: UInt64    // Default: 50

    // Stale threshold (mark as stuck)
    pub let staleThresholdSeconds: UInt64     // Default: 300 (5 min)
}
```

### Tuning Considerations

**Rebalance Interval:**
- **Shorter** (30s): More responsive, higher gas costs, better optimization
- **Longer** (120s): Less responsive, lower gas costs, acceptable for stable vaults

**Supervisor Interval:**
- **Shorter** (300s): Faster recovery, more frequent checks, higher overhead
- **Longer** (1200s): Slower recovery, less overhead, acceptable for stable network

**Batch Size:**
- **Smaller** (25): Lower gas per execution, more supervisor runs needed
- **Larger** (100): Higher gas per execution, fewer runs needed, risk of timeout

## Monitoring Scheduling Health

Users and administrators can monitor the scheduling system's health:

### Check Vault Schedule Status

```cadence
import FlowYieldVaultsSchedulerRegistry from 0xFYV

pub fun main(vaultID: UInt64): ScheduleStatus {
    let registry = FlowYieldVaultsSchedulerRegistry.getRegistry()
    let info = registry.getScheduleInfo(vaultID)

    return info.status
}
// Returns: Active, Pending, or Stuck
```

### Get Next Scheduled Time

```cadence
pub fun main(vaultID: UInt64): UFix64 {
    let registry = FlowYieldVaultsSchedulerRegistry.getRegistry()
    let info = registry.getScheduleInfo(vaultID)

    return info.nextScheduledTime
}
// Returns: Unix timestamp of next rebalance
```

### Count Pending Vaults

```cadence
pub fun main(): UInt64 {
    let registry = FlowYieldVaultsSchedulerRegistry.getRegistry()
    return registry.countPendingVaults()
}
// Returns: Number of vaults awaiting schedule
```

## Failure Modes and Recovery

### Scenario 1: Single Vault Fails to Reschedule

**What happens:**
1. Vault executes rebalance successfully
2. Reschedule transaction fails (network issue)
3. Vault marked as "Stuck" in registry
4. Supervisor detects stuck vault on next run
5. Supervisor reschedules the vault
6. Vault returns to "Active" status

**User impact:** Minor delay (up to 10 minutes) before next rebalance

### Scenario 2: Scheduler Overload

**What happens:**
1. Many vaults scheduled at same time
2. Scheduler queue fills up
3. Some reschedule transactions timeout
4. Multiple vaults marked "Stuck"
5. Supervisor processes in batches of 50
6. All vaults eventually recovered

**User impact:** Temporary scheduling delays, no loss of funds

### Scenario 3: Capability Revocation

**What happens:**
1. User accidentally unlinks AutoBalancer capability
2. Vault can no longer be scheduled
3. Vault marked "Stuck" permanently
4. User must manually fix capability
5. Call forceRebalance() to restart scheduling

**User impact:** Vault stops rebalancing until fixed

### Scenario 4: Supervisor Failure

**What happens:**
1. Supervisor itself fails to reschedule
2. Stuck vaults accumulate
3. Admin manually triggers supervisor
4. Supervisor recovers all pending vaults
5. Supervisor returns to normal operation

**User impact:** Longer delays (requires admin intervention)

## Best Practices

**Monitor Your Vault**: Check scheduling status periodically to ensure "Active" state.

**Don't Revoke Capabilities**: Avoid unlinking or destroying AutoBalancer capabilities as this breaks scheduling.

**Use forceRebalance() Sparingly**: Manual rebalancing bypasses scheduling logic; only use if truly stuck.

**Track Rebalance History**: Monitor rebalance frequency to detect scheduling issues early.

**Report Stuck Vaults**: If your vault becomes stuck, report it so admins can investigate root cause.

## Advanced: Custom Scheduling

Developers can implement custom scheduling logic for specialized use cases:

```cadence
pub resource CustomAutoBalancer: AutoBalancerInterface {
    // Custom interval based on conditions
    pub fun getNextInterval(): UInt64 {
        let ratio = self.getCurrentRatio()

        if ratio > 1.10 || ratio < 0.90 {
            return 30  // More frequent when far from target
        } else {
            return 120 // Less frequent when stable
        }
    }

    pub fun scheduleNextRebalance() {
        let interval = self.getNextInterval()

        FlowTransactionScheduler.schedule(
            functionCall: "rebalance()",
            executeAt: currentTime + interval
        )
    }
}
```

This enables dynamic scheduling based on vault state, optimizing gas costs vs. responsiveness.

## Summary

FYV's scheduling system achieves truly automated yield farming through self-scheduling where vaults schedule their own rebalancing, atomic registration preventing orphaned vaults, Supervisor recovery for stuck vaults, and bounded processing handling any scale.

**Key guarantees:**
- Every vault has either working schedule OR doesn't exist (atomicity)
- Stuck vaults automatically recovered (within 10 minutes)
- No external dependencies (no bot infrastructure needed)
- Scales to thousands of vaults (batched processing)

---

:::tip Key Takeaway
The self-scheduling mechanism is what makes FYV truly "set and forget." Vaults perpetually schedule themselves, the Supervisor recovers failures, and users never need to manually trigger rebalancing. It's automation all the way down.
:::
