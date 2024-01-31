---
title: Off-chain Dapp Infrastructure
sidebar_label: Off-chain Infrastructure
---

In addition to on-chain smart contracts, dapps also rely on off-chain infrastructure. Users often interact with a dapp through a web interface, and some dapps depend on backend servers to query and index data from the blockchain. This section covers best practices for off-chain infrastructure on Flow.

## Writing Data to Flow

All data written to the blockchain occurs in a transaction. For user-facing dapps, transactions originate either from a user account or an admin account. For most dapps, the majority of transactions will be user transactions.

### User Transactions

User transactions are authorized by the users of your dapp and originate from the user’s wallet, as discussed in the [User Accounts & Wallets](./user-accounts-and-wallets.md) section. For example, a user may sign a transaction to purchase an NFT from your dapp.

Your dapp initializes a user transaction (e.g., by a button click) through FCL, which then passes the transaction to the user’s wallet. The wallet signs the transaction and submits it to Flow. This entire process occurs within the dapp client, typically a browser app. Utilizing FCL, your dapp constructs the transaction, passes it to the wallet, and awaits the final result without being involved in the transaction signing.

### Admin Transactions

Admin transactions originate from the backend of your dapp or a separate administration interface that you control. These transactions execute administrative duties required to operate your dapp and are signed by an administrator account controlled by you, the dapp developer.

For example, an admin transaction might mint a batch of NFTs for purchase or add an additional gameplay level to your game.

For one-off administrative actions that don't require automation, such as contract deployment, you can use the [Flow CLI](../tools/flow-cli/).

## Reading Data From Flow

Your dapp also needs to read data from Flow, particularly the state of your smart contracts. There are several ways to query state on Flow.

### Events

Events are data objects emitted at the end of a transaction, describing the state changes that occurred. For example, a transaction transferring FLOW tokens between accounts [will emit events](https://flowdiver.io/transaction/2f50695c3c506b8214d18f49220c986d24d19d8762a2805b3609aee3d529de88) indicating the sender, recipient, and amount of FLOW transferred. Event types are [defined within your Cadence contracts](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowToken.cdc#L8-L27).

Events can notify your off-chain infrastructure of important state changes in your smart contracts. For instance, if a user purchases an NFT from your storefront smart contract, an event will be emitted describing this purchase. Your web application, displaying the NFTs for sale, can capture that event and remove the NFT from the sale list.

Events can be queried through the Flow Access API using the available [Flow SDKs](../tools/clients/index.md). Event data is returned in [JSON-Cadence format](../build/cadence-reference/json-cadence-spec.md).

#### Event Reflection Database

Some applications, especially those with existing backend servers, opt to store application state in an off-chain database that reflects the state of on-chain contracts. A reflection database offers benefits such as unified on and off-chain state and fast, flexible queries.

### Cadence Script Queries

Your dapp can execute a query to read the state of your contracts using Cadence scripts. These scripts are similar to transactions but are read-only and cannot mutate the blockchain state.

While events follow a push model, script queries follow a pull model. Your dapp may need to check the state of your contracts without waiting for an event to be emitted.

You can execute scripts through the Flow Access API using the available [Flow SDKs](../tools/clients/index.md). Like events, script results are returned in [JSON-Cadence format](https://cadencelang.dev/docs/1.0/json-cadence-spec).
