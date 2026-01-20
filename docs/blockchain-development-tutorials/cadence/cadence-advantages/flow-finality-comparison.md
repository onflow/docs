---
title: Why Flow Transactions Confirm in Seconds
sidebar_label: Fast Finality on Flow
description: Flow reaches hard finality in about 10 seconds, while Ethereum takes 13 minutes and L2s can take a week. Learn why finality matters and how Flow's architecture delivers true, fast settlement.
sidebar_position: 4
keywords:
  - Flow finality
  - transaction finality
  - blockchain finality
  - Flow vs Ethereum
  - transaction speed
  - settlement time
  - hard finality
  - soft finality
  - L2 finality
  - blockchain comparison
  - Flow architecture
---

# Why Flow Transactions Confirm in Seconds

When you submit a transaction on a blockchain, how long until it's truly final? Not "probably included" or "optimistically confirmed" - actually, irreversibly settled?

On Ethereum, you're waiting about **13 minutes**. On most L2s, true finality can take **a day or even a week**. On Flow, you get cryptographically-backed soft finality in **~4 seconds** and irreversible hard finality in **~10 seconds**.

That 4-second soft finality is what most apps should build around. Unlike "optimistic" confirmations on other chains, Flow's soft finality is backed by cryptographic proof from execution nodes - not just a sequencer's promise. For the vast majority of use cases, this is more than enough certainty to update your UI and move on.

This isn't a minor UX improvement. It fundamentally changes what you can build.

## What is Finality?

Finality is the guarantee that a transaction cannot be reversed, reorganized, or rolled back. It's the point at which you can trust the blockchain's answer without reservation.

Think of it like a credit card transaction. The vendor sees "approved" instantly, but chargebacks can occur for weeks. The instant approval is a preliminary result. True settlement happens later. Blockchains work similarly - you might get a quick response, but that doesn't mean the transaction is final.

## The Three Stages of Finality

In Proof-of-Stake blockchains, finality progresses through three stages:

**1. Preliminary Result**

An initial answer with no economic guarantees. If the node providing this result lies or is wrong, there's no penalty. This is what you get from optimistic systems before verification.

**2. Soft Finality (Economic)**

The answer is backed by cryptographic proof from staked nodes. On Flow, this is the "Executed" status - execution nodes have produced and signed the result.

**3. Hard Finality (Economic)**

The answer is either true, or the entire blockchain needs to restart. Verification nodes have checked the result, and any fraud would result in slashing. On Flow, this is the "Sealed" status.

## How Flow Compares

| Chain    | Preliminary | Soft Finality | Hard Finality |
| -------- | ----------- | ------------- | ------------- |
| Solana   | ~100ms      | n/a           | ~13s          |
| Ethereum | ~15s        | n/a           | ~13 min       |
| Flow     | bypassed    | **~4s**       | ~10s          |

Flow is unique in that it **bypasses preliminary results entirely**. When a Flow Access Node tells you a transaction has been executed, that statement is backed by a cryptographically signed execution receipt from staked execution nodes.

**For most applications, the ~4 second soft finality is the number that matters.** This is when you should update your UI, show the user their new balance, or confirm their NFT purchase. The additional ~6 seconds to hard finality is only necessary for extremely high-value operations where you need absolute irreversibility.

### What About L2s?

Layer 2 solutions like Arbitrum, Optimism, and zkSync achieve fast *optimistic* finality, but true settlement depends on the underlying L1.

- **Optimistic rollups** (Arbitrum, Optimism): 7-day challenge period before withdrawals to L1 are final
- **ZK rollups** (zkSync): Typically 1-24 hours for proof generation and L1 settlement

When an L2 shows your transaction as "confirmed," that's a preliminary result. The sequencer says it's included, but the L1 hasn't verified it yet. For most use cases this is fine, but for high-value DeFi operations, you're trusting the sequencer until L1 finality.

Flow doesn't have this two-tier system. Finality on Flow is finality, period.

## Why This Matters

### For DeFi

In DeFi, finality determines when you can trust a swap, a loan, or a liquidation. With 13-minute finality on Ethereum:

- Arbitrageurs face execution risk on cross-protocol strategies
- Lending protocols need larger safety margins for liquidations  
- Users can't be certain their transaction won't be reorged

With 10-second finality on Flow:

- Complex multi-step operations settle quickly
- Lower capital requirements for time-sensitive operations
- What you see is what happened

### For User Experience

When a user completes an action in your app, how long until you can show them the confirmed result?

- **Ethereum**: Wait 13+ minutes for certainty, or show optimistic UI and hope
- **L2s**: Show fast optimistic confirmation, explain the 7-day withdrawal delay later
- **Flow**: Show a cryptographically-backed result in ~4 seconds

This changes how you design interfaces. On Flow, you can wait for soft finality and confidently update your UI - the result is cryptographically attested by execution nodes. There's no need to show spinners for 13 minutes or cross your fingers that an optimistic result won't be reverted.

Build your UI around the 4-second soft finality. Reserve the 10-second hard finality check for settlement of large trades or other operations where you need the absolute strongest guarantee.

### For Cross-Chain Operations

Bridges and cross-chain protocols inherit the finality of their slowest chain. If you're bridging from Ethereum, you're waiting for Ethereum finality regardless of how fast the destination chain is.

Flow's fast finality means bridges *to* Flow can confirm quickly. And with Flow EVM running within the same protocol, moving assets between Cadence and EVM is atomic - no bridge delay at all.

## How Flow Achieves Fast Finality

Flow's speed comes from its multi-role architecture, not from compromising on decentralization:

**1. Separation of Concerns**

Flow splits node responsibilities across specialized roles:
- **Collection Nodes**: Batch transactions into collections
- **Consensus Nodes**: Order transactions and form blocks
- **Execution Nodes**: Compute transaction results
- **Verification Nodes**: Check execution correctness

This parallelization allows the network to process transactions faster without requiring every node to do everything.

**2. Pipelined Execution**

While one block is being executed, the next block is undergoing consensus, and a third is being collected. This assembly-line approach maximizes throughput without sacrificing security.

**3. Deterministic Finality**

Flow doesn't use probabilistic finality like Bitcoin (where you wait for more blocks to be "more sure"). Once a block is sealed, it's final. The protocol guarantees it.

## Finality in Practice

Here's what the developer experience looks like:

```javascript
// Using FCL (Flow Client Library)
import * as fcl from "@onflow/fcl"

// Send a transaction
const txId = await fcl.mutate({
  cadence: `
    transaction {
      execute {
        log("Hello, Flow!")
      }
    }
  `,
})

// Wait for execution (soft finality) - ~4 seconds
// This is what most apps should use!
const executed = await fcl.tx(txId).onceExecuted()
console.log("Executed:", executed.status)

// Update your UI here - the result is cryptographically guaranteed
updateUserBalance()
showSuccessMessage()

// Only wait for sealing if you really need hard finality
// (large value transfers, settlement, etc.)
const sealed = await fcl.tx(txId).onceSealed()
console.log("Sealed:", sealed.status) // ~10 seconds total
```

**Use `onceExecuted()` for your UI.** This is the recommended pattern for most applications. The ~4 second soft finality is backed by cryptographic proof from execution nodes - it's not just an optimistic guess. 

Reserve `onceSealed()` for cases where you need the absolute strongest guarantee: settling large trades, finalizing withdrawals to external systems, or other high-stakes operations where the extra ~6 seconds is worth the additional certainty.

## The Bottom Line

Finality isn't just a number to put in a comparison chart. It determines:

- How quickly users see confirmed results
- How much risk DeFi protocols carry between transactions
- How complex your error handling and reorg protection needs to be
- Whether "optimistic" confirmations are good enough for your use case

Flow gives you cryptographically-attested soft finality in ~4 seconds - that's what you should build your UI around. Hard finality follows in ~10 seconds total, after verification nodes have confirmed the result.

Compare that to Ethereum's 13+ minutes or L2s' week-long settlement delays. On Flow, you can wait for *real* confirmation and still have a snappy user experience. No optimistic assumptions, no challenge periods, no hoping the sequencer was honest.

When a Flow transaction is executed, it's confirmed. When it's sealed, it's settled. Both happen fast enough to build great user experiences around.

---

## Learn More

- [Transaction Lifecycle on Flow](../../../build/cadence/basics/transactions.md) - Deep dive into transaction statuses and signing
- [How Flow EVM Works](../../../build/evm/how-it-works.md) - EVM transactions inherit Flow's finality
