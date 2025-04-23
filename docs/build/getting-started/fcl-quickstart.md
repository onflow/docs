---
sidebar_position: 3
sidebar_label: Simple Frontend
title: Building a Simple Frontend with "@onflow/kit"
description: Learn how to build a Next.js frontend application using @onflow/kit to interact with Flow smart contracts. Set up wallet authentication, read contract data, send transactions with kit's React hooks, and display transaction status updates.
keywords:
  - '@onflow/kit'
  - Next.js
  - frontend development
  - wallet integration
  - smart contract interaction
  - Flow emulator
  - Dev Wallet
  - authentication
  - transactions
  - blockchain queries
  - React development
  - dApp development
  - Flow development
  - web3 frontend
---

# Simple Frontend with `@onflow/kit`

Building on the `Counter` contract you deployed in [Step 1: Contract Interaction] and [Step 2: Local Development], this tutorial shows you how to create a simple Next.js frontend that interacts with the `Counter` smart contract deployed on your local Flow emulator. Instead of using FCL directly, you'll leverage [**@onflow/kit**] to simplify authentication, querying, transactions, and to display real-time transaction status updates using convenient React hooks.

## Objectives

After finishing this guide, you will be able to:

- Wrap your Next.js app with a Flow provider using [**@onflow/kit**].
- Read data from a Cadence smart contract (`Counter`) using kit's query hook.
- Send a transaction to update the smart contract's state using kit's mutation hook.
- Monitor a transaction's status in real time using kit's transaction hook.
- Authenticate with the Flow blockchain using kit's built-in hooks and the local [Dev Wallet].

## Prerequisites

- Completion of [Step 1: Contract Interaction] and [Step 2: Local Development].
- [Flow CLI] installed.
- Node.js and npm installed.

## Setting Up the Next.js App

Follow these steps to set up your Next.js project and integrate [**@onflow/kit**].

### Step 1: Create a New Next.js App

Run the following command in your project directory:

```bash
npx create-next-app@latest kit-app-quickstart
```

During setup, choose the following options:

- **Use TypeScript**: **Yes**
- **Use src directory**: **Yes**
- **Use App Router**: **Yes**

This command creates a new Next.js project named `kit-app-quickstart` inside your current directory. We're generating the frontend in a subdirectory so we can next move it into our existing project structure from the previous steps (you can't create an app in a non-empty directory).

### Step 2: Move the Next.js App Up a Directory

Move the contents of the `kit-app-quickstart` directory into your project root. You can use the gui in your editor, or the console.

:::warning

You'll want to consolidate both `.gitignore` files, keeping the contents of both in the file that ends up in the root.

:::

On macOS/Linux:

```bash
mv kit-app-quickstart/* .
mv kit-app-quickstart/.* .  # To move hidden files (e.g. .env.local)
rm -r kit-app-quickstart
```

On Windows (PowerShell):

```powershell
Move-Item -Path .\kit-app-quickstart\* -Destination . -Force
Move-Item -Path .\kit-app-quickstart\.* -Destination . -Force
Remove-Item -Recurse -Force .\kit-app-quickstart
```

**Note:** When moving hidden files (those beginning with a dot) like `.gitignore`, be cautious not to overwrite any important files.

### Step 3: Install @onflow/kit

Install the kit library in your project:

```bash
npm install @onflow/kit
```

This library wraps FCL internally and exposes a set of hooks for authentication, querying, sending transactions, and tracking transaction status.

## Configuring the Local Flow Emulator and Dev Wallet

:::warning

You should already have the Flow emulator running from the local development step. If it's not running, you can start it again — but note that restarting the emulator will clear all blockchain state, including any contracts deployed in [Step 2: Local Development].

:::

### Start the Flow Emulator (if not already running)

Open a new terminal window in your project directory and run:

```bash
flow emulator start
```

This will start the Flow emulator on `http://localhost:8888`. Make sure to keep it running in a separate terminal.

### Start the Dev Wallet

In another terminal window, run:

```bash
flow dev-wallet
```

This will start the [Dev Wallet] on `http://localhost:8701`, which you'll use for authentication during development.

## Wrapping Your App with FlowProvider

[**@onflow/kit**] provides a `FlowProvider` component that sets up the Flow Client Library configuration. In Next.js using the App Router, add or update your `src/app/layout.tsx` as follows:

```tsx
// src/app/layout.tsx
'use client';

import { FlowProvider } from '@onflow/kit';
import flowJSON from '../../flow.json';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <FlowProvider
          config={{
            accessNodeUrl: 'http://localhost:8888',
            flowNetwork: 'emulator',
            discoveryWallet: 'https://fcl-discovery.onflow.org/emulator/authn',
          }}
          flowJson={flowJSON}
        >
          {children}
        </FlowProvider>
      </body>
    </html>
  );
}
```

This configuration initializes the kit with your local emulator settings and maps contract addresses based on your `flow.json` file.

For more information on Discovery configurations, refer to the [Wallet Discovery Guide].

## Interacting With the Chain

Now that we've set our provider, lets start interacting with the chain.

### Querying the Chain

First, use the kit's [`useFlowQuery`] hook to read the current counter value from the blockchain.

```jsx
import { useFlowQuery } from '@onflow/kit';

const { data, isLoading, error, refetch } = useFlowQuery({
  cadence: `
    import "Counter"
    import "NumberFormatter"

    access(all)
    fun main(): String {
        let count: Int = Counter.getCount()
        let formattedCount = NumberFormatter.formatWithCommas(number: count)
        return formattedCount
    }
  `,
  query: { enabled: true },
});

// Use the count data in your component as needed.
```

This script fetches the counter value, formats it via the `NumberFormatter`, and returns the formatted string.

:::info

- **Import Syntax:** The imports (`import "Counter"` and `import "NumberFormatter"`) don't include addresses because those are automatically resolved using the `flow.json` file configured in your `FlowProvider`. This keeps your Cadence scripts portable and environment-independent.
- **`enabled` Flag:** This controls whether the query should run automatically. Set it to `true` to run on mount, or pass a condition (e.g. `!!user?.addr`) to delay execution until the user is available. This is useful for queries that depend on authentication or other asynchronous data.

:::

### Sending a Transaction

Next, use the kit's [`useFlowMutate`] hook to send a transaction that increments the counter.

```jsx
import { useFlowMutate } from '@onflow/kit';

const {
  mutate: increment,
  isPending: txPending,
  data: txId,
  error: txError,
} = useFlowMutate();

const handleIncrement = () => {
  increment({
    cadence: `
      import "Counter"

      transaction {
        prepare(acct: &Account) {
          // Authorization handled via wallet
        }
        execute {
          Counter.increment()
          let newCount = Counter.getCount()
          log("New count after incrementing: ".concat(newCount.toString()))
        }
      }
    `,
  });
};
```

#### Explanation

This sends a Cadence transaction to the blockchain using the `mutate` function. The transaction imports the `Counter` contract and calls its `increment` function. Authorization is handled automatically by the connected wallet during the `prepare` phase. Once submitted, the returned `txId` can be used to track the transaction's status in real time.

### Subscribing to Transaction Status

Use the kit's [`useFlowTransaction`] hook to monitor and display the transaction status in real time.

```jsx
const { transactionStatus, error: txStatusError } = useFlowTransaction(
  txId || '',
);

useEffect(() => {
  if (txId && transactionStatus?.status === 3) {
    refetch();
  }
}, [transactionStatus?.status, txId, refetch]);

// You can then use transactionStatus (for example, its statusString) to show updates.
```

#### Explanation:

- `useFlowTransaction(txId)` subscribes to real-time updates about a transaction's lifecycle using the transaction ID.
- `transactionStatus.status` is a numeric code representing the state of the transaction:
  - `0`: **Unknown** – The transaction status is not yet known.
  - `1`: **Pending** – The transaction has been submitted and is waiting to be included in a block.
  - `2`: **Finalized** – The transaction has been included in a block, but not yet executed.
  - `3`: **Executed** – The transaction code has run successfully, but the result has not yet been sealed.
  - `4`: **Sealed** – The transaction is fully complete, included in a block, and now immutable on-chain.
- We recommend calling `refetch()` when the status reaches **3 (Executed)** to update your UI more quickly after the transaction runs, rather than waiting for sealing.
- The `statusString` property gives a human-readable version of the current status you can display in the UI.

#### Why `Executed` is Recommended for UI Updates:

Waiting for `Sealed` provides full on-chain confirmation but can introduce a delay — especially in local or test environments. Since most transactions (like incrementing a counter) don't require strong finality guarantees, you can typically refetch data once the transaction reaches `Executed` for a faster, more responsive user experience.

However:

- If you're dealing with critical state changes (e.g., token transfers or contract deployments), prefer waiting for `Sealed`.
- For non-critical UI updates, `Executed` is usually safe and significantly improves perceived performance.

### Integrating Authentication and Building the Complete UI

Finally, integrate the query, mutation, and transaction status hooks with authentication using `useCurrentFlowUser`. Combine all parts to build the complete page.

```jsx
// src/app/page.js

"use client";

import { useState, useEffect } from "react";
import {
  useFlowQuery,
  useFlowMutate,
  useFlowTransaction,
  useCurrentFlowUser,
} from "@onflow/kit";

export default function Home() {
  const { user, authenticate, unauthenticate } = useCurrentFlowUser();
  const [lastTxId, setLastTxId] = useState<string>();

  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: `
      import "Counter"
      import "NumberFormatter"

      access(all)
      fun main(): String {
          let count: Int = Counter.getCount()
          let formattedCount = NumberFormatter.formatWithCommas(number: count)
          return formattedCount
      }
    `,
    query: { enabled: true },
  });

  const {
    mutate: increment,
    isPending: txPending,
    data: txId,
    error: txError,
  } = useFlowMutate();

  const { transactionStatus, error: txStatusError } = useFlowTransaction(
    txId || "",
  );

  useEffect(() => {
    if (txId && transactionStatus?.status === 4) {
      refetch();
    }
  }, [transactionStatus?.status, txId, refetch]);

  const handleIncrement = () => {
    increment({
      cadence: `
        import "Counter"

        transaction {
          prepare(acct: &Account) {
            // Authorization handled via wallet
          }
          execute {
            Counter.increment()
            let newCount = Counter.getCount()
            log("New count after incrementing: ".concat(newCount.toString()))
          }
        }
      `,
    });
  };

  return (
    <div>
      <h1>@onflow/kit App Quickstart</h1>

      {isLoading ? (
        <p>Loading count...</p>
      ) : error ? (
        <p>Error fetching count: {error.message}</p>
      ) : (
        <div>
          <h2>Count: {data as string}</h2>
        </div>
      )}

      {user.loggedIn ? (
        <div>
          <p>Address: {user.addr}</p>
          <button onClick={unauthenticate}>Log Out</button>
          <button onClick={handleIncrement} disabled={txPending}>
            {txPending ? "Processing..." : "Increment Count"}
          </button>

          <div>
            Latest Transaction Status:{" "}
            {transactionStatus?.statusString || "No transaction yet"}
          </div>

          {txError && <p>Error sending transaction: {txError.message}</p>}

          {lastTxId && (
            <div>
              <h3>Transaction Status</h3>
              {transactionStatus ? (
                <p>Status: {transactionStatus.statusString}</p>
              ) : (
                <p>Waiting for status update...</p>
              )}
              {txStatusError && <p>Error: {txStatusError.message}</p>}
            </div>
          )}
        </div>
      ) : (
        <button onClick={authenticate}>Log In</button>
      )}
    </div>
  );
}
```

In this complete page:

- **Step 1** queries the counter value.
- **Step 2** sends a transaction to increment the counter and stores the transaction ID.
- **Step 3** subscribes to transaction status updates using the stored transaction ID and uses a `useEffect` hook to automatically refetch the updated count when the transaction is sealed (status code 4).
- **Step 4** integrates authentication via `useCurrentFlowUser` and combines all the pieces into a single user interface.

:::tip

In this tutorial, we inlined Cadence code for simplicity. For real projects, we recommend storing Cadence in separate `.cdc` files, using the [Cadence VSCode extension], and importing them with the [`flow-cadence-plugin`](https://github.com/chasefleming/flow-cadence-plugin) for Next.js or Webpack projects.

:::

## Running the App

Start your development server:

```bash
npm run dev
```

:::warning

If you have the Flow wallet browser extension installed, you might automatically log into the app. Normally this is desirable for your users, but you don't want to use it here.

Log out, and log back in selecting the Dev Wallet instead of the Flow Wallet.

:::

Then visit [http://localhost:3000](http://localhost:3000) in your browser. You should see:

- The current counter value displayed (formatted with commas using `NumberFormatter`).
- A **Log In** button that launches the kit Discovery UI with your local [Dev Wallet].
- Once logged in, your account address appears with options to **Log Out** and **Increment Count**.
- When you click **Increment Count**, the transaction is sent; its status updates are displayed in real time below the action buttons, and once the transaction is sealed, the updated count is automatically fetched.

## Wrapping Up

By following these steps, you've built a simple Next.js dApp that interacts with a Flow smart contract using [**@onflow/kit**]. In this guide you learned how to:

- Wrap your application in a `FlowProvider` to configure blockchain connectivity.
- Use kit hooks such as `useFlowQuery`, `useFlowMutate`, `useFlowTransaction`, and `useCurrentFlowUser` to manage authentication, query on-chain data, submit transactions, and monitor their status.
- Integrate with the local Flow emulator and Dev Wallet for a fully functional development setup.

For additional details and advanced usage, refer to the [@onflow/kit documentation] and other Flow developer resources.


[Step 1: Contract Interaction]: contract-interaction.md
[Step 2: Local Development]: ./flow-cli.md
[Wallet Discovery Guide]: ../../tools/clients/fcl-js/discovery.md
[`useFlowQuery`]: ../../tools/kit#useflowquery
[`useFlowMutate`]: ../../tools/kit#useflowmutate
[Dev Wallet]: ../../tools/flow-dev-wallet
[@onflow/kit documentation]: ../../tools/kit/index.md
[**@onflow/kit**]: ../../tools/kit/index.md
[Flow CLI]: ../../tools/flow-cli/install.md
[Cadence VSCode extension]: ../../tools/vscode-extension
