---
title: FLIX (Flow Interaction Templates)
description: Learn about Flow Interaction Templates (FLIX), a standard for creating, auditing, and verifying Flow scripts and transactions with improved security and metadata.
keywords:
  - FLIX
  - Flow Interaction Templates
  - templates
  - transactions
  - scripts
  - smart contracts
  - FCL
  - interaction templates
  - template service
sidebar_position: 10
---

# FLIX (Flow Interaction Templates)

Flow Interaction Templates is a standard for how contract developers, wallets, users, auditors, and applications can create, audit, and verify the intent, security, and metadata of Flow scripts and transactions, with the goal to improve the understandability and security of authorizing transactions and promote patterns for change resilient composability of applications on Flow.

Interaction Templates provide a way to use and reuse existing scripts and transactions, as well as to provide more metadata such as a human-readable title and description of what the transaction or script will do, which can be used by the developer as well as the user of the application.

By using FLIX transactions and scripts, developers don't have to write their own for common operations!

Read more about the design and purpose of FLIX in the [FLIP](https://github.com/onflow/flips/blob/main/application/20220503-interaction-templates.md)

## Using FLIX

Flow makes FLIX available through an API available at flix.flow.com.

You can query a FLIX API to get an Interaction Template. An example query looks like: https://flix.flow.com/v1/templates?name=transfer-flow

You can read more about how to query a FLIX API in the documentation available here: [https://github.com/onflow/flow-interaction-template-service](https://github.com/onflow/flow-interaction-template-service)

:::info

The FLIX working group is currently working on a protocol to publish FLIX templates onchain.

:::

### Example

How to integrate FLIX across different developer teams? For this example there are two github repositories.

- (smart contracts) [https://github.com/onflow/hello-world-flix](https://github.com/onflow/hello-world-flix)
- (web development) [https://github.com/onflow/hello-world-web](https://github.com/onflow/hello-world-web)

The Smart contract developer creates FLIX templates and makes them available in github, these can be versioned. Example is `v0.1.0` release, the templates are available for a specific version. In this example the templates are located at:

- https://github.com/onflow/hello-world-flix/blob/v0.1.0/cadence/templates/ReadHelloWorld.template.json
- https://github.com/onflow/hello-world-flix/blob/v0.1.0/cadence/templates/UpdateHelloWorld.template.json

Developers can use FLIX templates from the smart contract github to interact with their smart contracts. They simply need the FLIX template URLs to create binding files (TypeScript or JavaScript). One major benefit is the web developers don't need to learn Cadence or copy Cadence to their repository in order to integrate with existing smart contracts.

TypeScript code generated from templates:

- https://github.com/onflow/hello-world-web/blob/main/app/cadence/readHelloWorld.ts
- https://github.com/onflow/hello-world-web/blob/main/app/cadence/updateHelloWorld.ts

:::warning

manually added "@ts-ignore" in generated file because of linting error. 'template' property is typed as "object" when it should also allow strings (url to flix template file). There is current a dev effort that will fix this linting issue.

:::

See the `hello-world-web` [README](https://github.com/onflow/hello-world-web/tree/main) for more information on how to generate and execute FLIX templates here [flow-cli flix](../../../build/tools/flow-cli/flix.md) commands

### Clients

There are currently two clients that have integrated with FLIX that you can use:

**Go client** [https://github.com/onflow/flixkit-go](https://github.com/onflow/flixkit-go)

**FCL client you** read how to get started [tools/clients/fcl-js/interaction-templates](../../../build/tools/clients/fcl-js/interaction-templates.mdx)

## (Advanced) Running a FLIX API

Flow provides an implementation of the Flow interaction template service as an open-source project. If you wish to run your own API, you can find the repository here: [https://github.com/onflow/flow-interaction-template-service](https://github.com/onflow/flow-interaction-template-service)
