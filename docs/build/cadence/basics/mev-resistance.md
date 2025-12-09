---
title: MEV Resistance
description: How Flow’s unique architecture minimizes Maximal Extractable Value (MEV) to ensure fair and equitable access.
sidebar_position: 5
keywords:
  - MEV
  - Maximal Extractable Value
  - Flow Blockchain
  - Equitable Access
  - Transaction Ordering
  - Blockchain Security
---

# How Flow Suppresses MEV to Ensure Equitable Access

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/9hyPqORY1vI?si=sNn0Y4ECmjaBXPGN" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
  ></iframe>
</div>

## The hidden cost of MEV in decentralized systems

One of the most under-discussed benefits of decentralization is **equitable access**. Ideally, the value and quality-of-service you receive from a decentralized platform should not depend on your identity, computing power, or personal connections. However, **Maximal Extractable Value (MEV)** poses a significant threat to this principle.

MEV allows block producers to manipulate transaction ordering for profit—often at the direct expense of users. The ability to front-run, back-run, or sandwich transactions can extract value from ordinary users, which reinforces inequalities instead of eliminating them. In most blockchain networks, MEV is not just an unfortunate side effect; it is structurally embedded in how transactions are processed.

## Why MEV persists on most blockchains

MEV is difficult to prevent on most blockchains because **each block has a single builder**. This builder must have:

- A full copy of the blockchain state.
- The ability to simulate transactions before they are finalized.
- Absolute control over transaction selection and ordering.

In practice, this means that **the entity who adds your transaction to the blockchain can first simulate it to identify profit opportunities**. They can test hundreds or thousands of ways to rearrange transactions, and insert their own to extract MEV—often at **your** expense.

For example, if a block builder can sandwich your transaction and earn $10, it means **you** likely lose $10 in value. This is functionally theft, and the worst part? If your transaction is airtight and offers no MEV opportunities, the block builder has no obligation to include it at all. Pay the toll, or get locked out.

## How Flow accomplishes MEV resilience

Unlike many blockchains, **Flow was designed from the ground up to minimize MEV** through a unique multi-role architecture. Flow introduces key design choices that break the typical MEV-enabling structure:

### 1. **Separate transaction selection from execution**

On Flow, **Collection Nodes** select transactions, but they do not have access to the execution state or computing power to simulate them. Meanwhile, **Execution Nodes** run transactions but cannot choose or reorder them.

This separation significantly reduces the ability of block builders to test transactions before execution. Even if an attacker controls both a Collection Node and an Execution Node, they cannot easily extract MEV.

### 2. **Separate transaction ordering from execution**

Flow further decentralizes control by introducing **Consensus Nodes** that determine transaction order. These nodes are separate from both Collection Nodes and Execution Nodes.

For an attacker to perform MEV, they would need to:

- Control a **Collection Node** to insert a transaction.
- Control a **Consensus Node** to place it in the desired order.
- Have execution state access to predict its effects.

This makes it vastly more difficult to extract MEV compared to traditional blockchains, where a single entity often controls all three functions.

### 3. **Strict transaction execution rules**

Execution Nodes on Flow have a **simple, enforceable rule**: They **must** execute transactions exactly as ordered by Consensus Nodes, or they get slashed.

Unlike traditional blockchains, where the same party both orders and executes transactions, Flow ensures that Execution Nodes cannot manipulate transaction order for profit.

### 4. **Parallel processing for extra MEV resistance**

Flow’s unique **pipelined execution model** adds another layer of complexity for potential attackers.

While one block is executed, the next block undergoes consensus, and a third block continues to collect transactions. This means that **to front-run or sandwich attack on Flow, an attacker must successfully predict the outcome of at least two unexecuted blocks—one of which hasn’t even been built yet**.

Even with significant resources, this makes profitable MEV attacks incredibly difficult.

## The end result: a fairer blockchain

Flow’s architecture ensures that:

- The nodes that select transactions **don’t know** their order.
- The nodes that order transactions **don’t know** the blockchain state.
- The nodes that execute transactions **can’t** modify the order.

By **intentionally separating powers**, Flow eliminates MEV at its root rather than merely mitigate its effects.

This level of protection against MEV is not an afterthought—it has been a fundamental design goal of Flow since day one. If equitable access matters, **why settle for anything less?**
