---
sidebar_position: 3
---

# FLIX (Flow Interaction Templates)

Flow Interaction Templates is a standard for how contract developers, wallets, users, auditors, and applications can create, audit, and verify the intent, security, and metadata of Flow scripts and transactions, with the goal to improve the understandability and security of authorizing transactions and promote patterns for change resilient composability of applications on Flow.

Interaction Templates provide a way to use and reuse existing scripts and transactions, as well as to provide more metadata such as a human-readable title and description of what the transaction or script will do, which can be used by the developer as well as the user of the application. 

By using FLIX transactions and scripts, develoeprs don’t have to write their own for common operations!

Read more about the design and purpose of FLIX in the [FLIP](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md)

## Using FLIX

Flow makes FLIX available through an API available at flix.flow.com. Other community run APIs are available, such as flix.ecdao.org. 

You can query a FLIX API to get an Interaction Template. An example query looks like: https://flix.flow.com/v1/templates?name=transfer-flow

You can read more about how to query a FLIX API in the documentation available here: [https://github.com/onflow/flow-interaction-template-service](https://github.com/onflow/flow-interaction-template-service)

### Clients

There are currently two clients that have integrated with FLIX that you can use:

**Go client** [https://github.com/onflow/flixkit-go](https://github.com/onflow/flixkit-go)

**FCL client you** read how to get started [tools/clients/fcl-js/interaction-templates](../../tools/clients/fcl-js/interaction-templates.mdx)

## (Advanced) Running a FLIX API

Flow provides an implementation of the Flow interaction template service as an open-source project. If you wish to run your own API like flix.flow.com , you can find the repository here: [https://github.com/onflow/flow-interaction-template-service](https://github.com/onflow/flow-interaction-template-service)
