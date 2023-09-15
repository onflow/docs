---
title: Proposals
sidebar_position: 3
---

# FLIX (FLIP 934)

This FLIP (Flow Improvement Proposal) proposes a new standard for how contract developers, wallets, users, auditors, and applications can create, audit, and verify the intent, security, and metadata of Flow scripts and transactions, with the goal to improve the understandability and security of authorizing transactions and promote patterns for change resilient composability of applications on Flow.

FLIX provides a way to reuse scripts and transactions as well as to provide more metadata about the scripts themselves, such as a human-readable description of what the transaction or script will do, which can be used by the developer as well as the user of the dApp. 

By using FLIX transactions and scripts we don’t have to write our own for common operations. Many interactions aim to achieve the same class of action according to how that action must be performed with a certain project. Classes of interactions may be things like: "Transfer", "Mint", "Bid", "List", "Destroy" etc.

[**FLIX was defined as part of the FLIP 934**](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md)

## Running FLIX

Flow provides an implementation of the Flow interaction template service as an open-source project. This gives developers a way to obtain current transactions and scripts as well as extend on the collection. You can find the repository here: https://github.com/onflow/flow-interaction-template-service

### Clients

There are currently two clients integrating FLIX APIs you can use in your code. 
**Go client** [https://github.com/onflow/flixkit-go](https://github.com/onflow/flixkit-go)

**FCL client you** read how to get started [tools/clients/fcl-js/interaction-templates](../../tools/clients/fcl-js/interaction-templates.mdx)
