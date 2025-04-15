---
sidebar_position: 3
sidebar_label: Simple Frontend
title: Building a Simple Frontend with "@onflow/kit"
description: Learn how to build a Next.js frontend application using @onflow/kit to interact with Flow smart contracts. Set up wallet authentication, read contract data, send transactions with kit’s React hooks, and display transaction status updates.
keywords:
  - "@onflow/kit"
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

Building on the `Counter` contract you deployed in [Step 1: Contract Interaction] and [Step 2: Local Development], this tutorial shows you how to create a simple Next.js frontend that interacts with the `Counter` smart contract deployed on your local Flow emulator. Instead of using FCL directly, you'll leverage [**@onflow/kit**](../../tools/kit) to simplify authentication, querying, transactions, and to display real-time transaction status updates using convenient React hooks.

## Objectives

After finishing this guide you will be able to:

- Wrap your Next.js app with a Flow provider using **@onflow/kit**.
- Read data from a Cadence smart contract (`Counter`) using kit’s query hook.
- Send a transaction to update the smart contract’s state using kit’s mutation hook.
- Monitor a transaction’s status in real time using kit’s transaction hook.
- Authenticate with the Flow blockchain using kit’s built-in hooks and the local Dev Wallet.

## Prerequisites

- Completion of [Step 1: Contract Interaction] and [Step 2: Local Development].
- Flow CLI installed.
- Node.js and npm installed.

## Setting Up the Next.js App

Follow these steps to set up your Next.js project and integrate **@onflow/kit**.

### Step 1: Create a New Next.js App

Run the following command in your project directory:

```bash
npx create-next-app@latest kit-app-quickstart
```

During setup, choose the following options:

- **Use TypeScript**: **Yes**
- **Use src directory**: **Yes**
- **Use App Router**: **Yes**

This command creates a new Next.js project named `kit-app-quickstart` inside your current directory. We’re generating the frontend in a subdirectory so we can next move it into our existing project structure from the previous steps.

### Step 2: Move the Next.js App Up a Directory

Move the contents of the `kit-app-quickstart` directory into your project root. For example:

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

You should already have the Flow emulator running from the local development step. If it's not running, you can start it again — but note that restarting the emulator will clear all blockchain state, including any contracts deployed in [Step 2: Local Development].

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

This will start the Dev Wallet on `http://localhost:8701`, which you’ll use for authentication during development.

## Wrapping Your App with FlowProvider

**@onflow/kit** provides a `FlowProvider` component that sets up the Flow Client Library configuration. In Next.js using the App Router, add or update your `src/app/layout.tsx` as follows:

```tsx
// src/app/layout.tsx
"use client";

import { FlowProvider } from "@onflow/kit";
import flowJSON from "../../flow.json";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <FlowProvider
          config={{
            accessNodeUrl: "http://localhost:8888",
            flowNetwork: "emulator",
            discoveryWallet: "https://fcl-discovery.onflow.org/emulator/authn",
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

### Step 1: Querying the Chain

First, use the kit’s `useFlowQuery` hook to read the current counter value from the blockchain.

```jsx
// A snippet demonstrating querying the chain
import { useFlowQuery } from "@onflow/kit";

const { data: count, isLoading, error, refetch } = useFlowQuery({
  cadence: `
    import Counter from 0xf8d6e0586b0a20c7
    import NumberFormatter from 0xf8d6e0586b0a20c7

    access(all)
    fun main(): String {
        // Retrieve the count from the Counter contract
        let count: Int = Counter.getCount()

        // Format the count using NumberFormatter
        let formattedCount = NumberFormatter.formatWithCommas(number: count)

        // Return the formatted count
        return formattedCount
    }
  `,
});

// Use the count data in your component as needed.
```

This script fetches the counter value, formats it via the `NumberFormatter`, and returns the formatted string.

### Step 2: Sending a Transaction

Next, use the kit’s `useFlowMutate` hook to send a transaction that increments the counter.

```jsx
// A snippet demonstrating sending a transaction
import { useFlowMutate } from "@onflow/kit";

const { mutate: increment, isPending, error: txError } = useFlowMutate();

const incrementCount = (user, refetch, setTxId) => {
  const transactionId = increment({
    cadence: `
      import Counter from 0xf8d6e0586b0a20c7

      transaction {
        prepare(acct: AuthAccount) {
          // Authorization handled via the current user
        }
        execute {
          // Increment the counter
          Counter.increment()
          // Retrieve and log the new count
          let newCount = Counter.getCount()
          log("New count after incrementing: ".concat(newCount.toString()))
        }
      }
    `,
  });
  setTxId(transactionId);
  refetch();
};
```

In this snippet, after calling the mutation, the returned transaction ID is stored for subscription.

### Step 3: Subscribing to Transaction Status

Use the kit’s `useFlowTransaction` hook to monitor and display the transaction status in real time.

```jsx
// A snippet demonstrating subscribing to transaction status updates
import { useFlowTransaction } from "@onflow/kit";

const { transactionStatus, error: txStatusError } = useFlowTransaction(txId);

// You can then use transactionStatus (for example, its statusString) to show updates.
```

The hook automatically subscribes to the status updates of the transaction identified by `txId`.

### Step 4: Integrating Authentication and Building the Complete UI

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
  // Authentication: manage user login/logout with kit's useCurrentFlowUser hook.
  const { user, authenticate, unauthenticate } = useCurrentFlowUser();

  // Step 1: Query the current count from the Counter contract.
  const {
    data: count,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = useFlowQuery({
    cadence: `
      import Counter from 0xf8d6e0586b0a20c7
      import NumberFormatter from 0xf8d6e0586b0a20c7

      access(all)
      fun main(): String {
          let count: Int = Counter.getCount()
          let formattedCount = NumberFormatter.formatWithCommas(number: count)
          return formattedCount
      }
    `,
  });

  // State variable to store the transaction ID.
  const [txId, setTxId] = useState(null);

  // Step 3: Subscribe to transaction status using the stored txId.
  const { transactionStatus, error: txStatusError } = useFlowTransaction(txId);

  // Automatically refetch the count when the transaction status indicates it is executed (status === 3).
  useEffect(() => {
    if (txId && transactionStatus?.status === 3) {
      refetch();
    }
  }, [transactionStatus?.status, txId, refetch]);

  // Step 2: Prepare the mutation for incrementing the counter.
  const { mutate: increment, isPending: txPending, error: txError } = useFlowMutate();

  const handleIncrement = () => {
    try {
      // Send a transaction to increment the counter.
      const transactionId = increment({
        cadence: `
          import Counter from 0xf8d6e0586b0a20c7

          transaction {
            prepare(acct: AuthAccount) {
              // Authorization is handled via the current user.
            }
            execute {
              Counter.increment()
              let newCount = Counter.getCount()
              log("New count after incrementing: ".concat(newCount.toString()))
            }
          }
        `,
        proposer: user,
        payer: user,
        authorizations: [user.authorization],
        limit: 50,
      });
      console.log("Transaction Id", transactionId);
      setTxId(transactionId);
    } catch (error) {
      console.error("Transaction Failed", error);
    }
  };

  return (
    <div>
      <h1>@onflow/kit App Quickstart</h1>

      {/* Display the queried count */}
      {queryLoading ? (
        <p>Loading count...</p>
      ) : queryError ? (
        <p>Error fetching count: {queryError.message}</p>
      ) : (
        <div>
          <h2>Count: {count}</h2>
          <button onClick={refetch}>Refetch Count</button>
        </div>
      )}

      {/* Authentication controls and transaction actions */}
      {user.loggedIn ? (
        <div>
          <p>Address: {user.addr}</p>
          <button onClick={unauthenticate}>Log Out</button>
          <button onClick={handleIncrement} disabled={txPending}>
            {txPending ? "Processing..." : "Increment Count"}
          </button>
          {txError && <p>Error sending transaction: {txError.message}</p>}

          {/* Display transaction status updates */}
          {txId && (
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

## Running the App

Start your development server:

```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser. You should see:

- The current counter value displayed (formatted with commas using `NumberFormatter`).
- A **Log In** button that launches the kit Discovery UI with your local Dev Wallet.
- Once logged in, your account address appears with options to **Log Out** and **Increment Count**.
- When you click **Increment Count**, the transaction is sent; its status updates are displayed in real time below the action buttons, and once the transaction is sealed, the updated count is automatically fetched.

## Wrapping Up

By following these steps, you’ve built a simple Next.js dApp that interacts with a Flow smart contract using **@onflow/kit**. In this guide you learned how to:

- Wrap your application in a `FlowProvider` to configure blockchain connectivity.
- Use kit hooks such as `useFlowQuery`, `useFlowMutate`, `useFlowTransaction`, and `useCurrentFlowUser` to manage authentication, query on-chain data, submit transactions, and monitor their status.
- Integrate with the local Flow emulator and Dev Wallet for a fully functional development setup.

For additional details and advanced usage, refer to the [@onflow/kit documentation] and other Flow developer resources.

[Step 1: Contract Interaction]: contract-interaction.md
[Step 2: Local Development]: ./flow-cli.md
[Wallet Discovery Guide]: ../../tools/clients/fcl-js/discovery.md
[@onflow/kit documentation]: ../../tools/kit/index.md
