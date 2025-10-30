---
sidebar_position: 3
sidebar_label: Building a Frontend App
title: Building a Frontend App
description: Learn how to build a Next.js frontend application using @onflow/react-sdk to interact with Flow smart contracts. Set up wallet authentication, read contract data, send transactions with kit's React hooks, and display transaction status updates.
keywords:
  - '@onflow/react-sdk'
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

# Building a Frontend App

This tutorial builds on the `Counter` contract you deployed in [Cadence Environment Setup] and [Smart Contract Interaction]. It shows you how to create a simple `Next.js` frontend that interacts with the `Counter` smart contract deployed on your local Flow emulator. Instead of using FCL directly, you'll leverage [**@onflow/react-sdk**] to simplify authentication, querying, transactions, and to display real-time transaction status updates using convenient React hooks.

## Objectives

After you complete this tutorial, you will be able to:

- Wrap your `Next.js` app with a Flow provider using [**@onflow/react-sdk**].
- Read data from a Cadence smart contract (`Counter`) using kit's query hook.
- Send a transaction to update the smart contract's state using kit's mutation hook.
- Monitor a transaction's status in real time using kit's transaction hook.
- Authenticate with the Flow blockchain using kit's built-in hooks and the local [Dev Wallet].

## Prerequisites

- Completion of [Cadence Environment Setup] and [Smart Contract Interaction].
- [Flow CLI] installed.
- Node.js and npm installed.

## Set Up the Next.js app

Follow these steps to set up your Next.js project and integrate [**@onflow/react-sdk**].

:::tip

You can visit this [React-sdk Demo] to see how the hooks and components are used.

:::

### Step 1: Create a new Next.js app

Run the following command in your project directory:

```bash
npx create-next-app@latest kit-app-quickstart
```

During setup, choose the following options:

- **Use TypeScript**: **Yes**
- **Use src directory**: **Yes**
- **Use App Router**: **Yes**

This command creates a new Next.js project named `kit-app-quickstart` inside your current directory. We're generating the frontend in a subdirectory so we can next move it into our existing project structure from the previous steps (you can't create an app in a non-empty directory).

### Step 2: Move the Next.js app Up a directory

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

:::tip

When moving hidden files (those beginning with a dot) like `.gitignore`, be cautious not to overwrite any important files.

:::

### Step 3: Install @onflow/react-sdk

Install the kit library in your project:

```bash
npm install @onflow/react-sdk
```

This library wraps FCL internally and exposes a set of hooks for authentication, querying, sending transactions, and tracking transaction status.

## Configure the local Flow Emulator and Dev Wallet

:::warning

You should already have the Flow emulator running from the local development step. If it's not running, you can start it again — but when you restart the emulator, it will clear all blockchain state, which includes any contracts deployed in [Step 2: Local Development].

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

## Wrap Your app with FlowProvider

[**@onflow/react-sdk**] provides a `FlowProvider` component that sets up the Flow Client Library configuration. In `Next.js` using the App Router, add or update your `src/app/layout.tsx` as follows:

```tsx
'use client';

import { FlowProvider } from '@onflow/react-sdk';
import flowJson from '../flow.json';

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
          flowJson={flowJson}
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

## Interact With the chain

Now that we've set our provider, lets start interacting with the chain.

### Query the chain

First, use the kit's [`useFlowQuery`] hook to read the current counter value from the blockchain.

```tsx
import { useFlowQuery } from '@onflow/react-sdk';

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

### Send a transaction

Next, use the kit's [`useFlowMutate`] hook to send a transaction that increments the counter.

```tsx
import { useFlowMutate } from '@onflow/react-sdk';

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

This sends a Cadence transaction to the blockchain using the `mutate` function. The transaction imports the `Counter` contract and calls its `increment` function. The connected wallet handles authorization automatically during the `prepare` phase. After it's submitted, you cna use the returned `txId` to track the transaction's status in real time.

### Subscribe to transaction status

Use the kit's [`useFlowTransactionStatus`] hook to monitor and display the transaction status in real time.

```tsx
import { useFlowTransactionStatus } from '@onflow/react-sdk';

const { transactionStatus, error: txStatusError } = useFlowTransactionStatus({
  id: txId || '',
});

useEffect(() => {
  if (txId && transactionStatus?.status === 3) {
    refetch();
  }
}, [transactionStatus?.status, txId, refetch]);

// You can then use transactionStatus (for example, its statusString) to show updates.
```

#### Explanation:

- `useFlowTransactionStatus(txId)` subscribes to real-time updates about a transaction's lifecycle using the transaction ID.
- `transactionStatus.status` is a numeric code representing the state of the transaction:
  - `0`: **Unknown** – The transaction status is not yet known.
  - `1`: **Pending** – The transaction has been submitted and is waiting to be included in a block.
  - `2`: **Finalized** – The transaction has been included in a block, but not yet executed.
  - `3`: **Executed** – The transaction code has run successfully, but the result has not yet been sealed.
  - `4`: **Sealed** – The transaction is fully complete, included in a block, and now immutable onchain.
- We recommend that you call `refetch()` when the status reaches **3 (Executed)** to update your UI more quickly after the transaction runs, rather than waiting for sealing.
- The `statusString` property gives a human-readable version of the current status you can display in the UI.

#### Why we recommend `Executed` for UI Updates:

Waiting for `Sealed` provides full onchain confirmation but can introduce a delay — especially in local or test environments. Since most transactions (like incrementing a counter) don't require strong finality guarantees, you can typically refetch data once the transaction reaches `Executed` for a faster, more responsive user experience.

However:

- If you're dealing with critical state changes (for example, token transfers or contract deployments), prefer waiting for `Sealed`.
- For non-critical UI updates, `Executed` is usually safe and significantly improves perceived performance.

### Integrate authentication and build the complete UI

Finally, integrate the query, mutation, and transaction status hooks with authentication using `useFlowCurrentUser`. Combine all parts to build the complete page.

```tsx
'use client';

import { useState, useEffect } from 'react';
import {
  useFlowQuery,
  useFlowMutate,
  useFlowTransactionStatus,
  useFlowCurrentUser,
} from '@onflow/react-sdk';

export default function Home() {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser();

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

  const { transactionStatus, error: txStatusError } = useFlowTransactionStatus({
    id: txId || '',
  });

  useEffect(() => {
    if (txId && transactionStatus?.status === 3) {
      // Transaction is executed
      refetch(); // Refresh the counter
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
      <h1>Flow Counter dApp</h1>

      {isLoading ? (
        <p>Loading count...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <h2>{(data as string) || '0'}</h2>
          <p>Current Count</p>
        </div>
      )}

      {user?.loggedIn ? (
        <div>
          <p>Connected: {user.addr}</p>

          <button onClick={handleIncrement} disabled={txPending}>
            {txPending ? 'Processing...' : 'Increment Count'}
          </button>

          <button onClick={unauthenticate}>Disconnect</button>

          {transactionStatus?.statusString && transactionStatus?.status && (
            <p>
              Status: {transactionStatus.status >= 3 ? 'Successful' : 'Pending'}
            </p>
          )}

          {txError && <p>Error: {txError.message}</p>}

          {txStatusError && <p>Status Error: {txStatusError.message}</p>}
        </div>
      ) : (
        <button onClick={authenticate}>Connect Wallet</button>
      )}
    </div>
  );
}
```

In this complete page:

- **Step 1** queries the counter value.
- **Step 2** sends a transaction to increment the counter and stores the transaction ID.
- **Step 3** subscribes to transaction status updates using the stored transaction ID and uses a `useEffect` hook to automatically refetch the updated count when the transaction is sealed (status code 4).
- **Step 4** integrates authentication via `useFlowCurrentUser` and combines all the pieces into a single user interface.

:::tip

In this tutorial, we inlined Cadence code for simplicity. For real projects, we recommend storing Cadence in separate `.cdc` files, using the [Cadence VSCode extension], and importing them with the [`flow-cadence-plugin`](https://github.com/chasefleming/flow-cadence-plugin) for Next.js or Webpack projects.

:::

## Run the app

Start your development server:

```bash
npm run dev
```

:::warning

If you have the Flow wallet browser extension installed, you might automatically log into the app. Normally this is desirable for your users, but you don't want to use it here.

Log out, and log back in selecting the Dev Wallet instead of the Flow Wallet.

:::

:::warning

For your app to connect with contracts deployed on the emulator, you need to have completed [Step 1: Contract Interaction] and [Step 2: Local Development].

:::

Then visit [http://localhost:3000](http://localhost:3000) in your browser. You should see:

- The current counter value displayed (formatted with commas using `NumberFormatter`).
- A **Log In** button that launches the kit Discovery UI with your local [Dev Wallet].
- Once logged in, your account address appears with options to **Log Out** and **Increment Count**.
- When you click **Increment Count**, the transaction is sent; its status updates are displayed in real time below the action buttons, and once the transaction is sealed, the updated count is automatically fetched.

## Conclusion

By following these steps, you've built a simple `Next.js` dApp that interacts with a Flow smart contract using [**@onflow/react-sdk**]. In this guide you learned how to:

- Wrap your application in a `FlowProvider` to configure blockchain connectivity.
- Use kit hooks such as `useFlowQuery`, `useFlowMutate`, `useFlowTransactionStatus`, and `useFlowCurrentUser` to manage authentication, query onchain data, submit transactions, and monitor their status.
- Integrate with the local Flow emulator and Dev Wallet for a fully functional development setup.

For additional details and advanced usage, refer to the [@onflow/react-sdk documentation] and other Flow developer resources.

[React-sdk Demo]: https://react-sdk-demo-git-master-onflow.vercel.app/
[Cadence Environment Setup]: ./cadence-environment-setup.md
[Smart Contract Interaction]: ./smart-contract-interaction.md
[Wallet Discovery Guide]: ../../../build/tools/clients/fcl-js/discovery.md
[`useFlowQuery`]: ../../../build/tools/react-sdk#useflowquery
[`useFlowMutate`]: ../../../build/tools/react-sdk#useflowmutate
[Dev Wallet]: ../../../build/tools/flow-dev-wallet
[@onflow/react-sdk documentation]: ../../../build/tools/react-sdk
[**@onflow/react-sdk**]: ../../../build/tools/react-sdk
[Flow CLI]: ../../../build/tools/flow-cli/install.md
[Cadence VSCode extension]: ../../../build/tools/vscode-extension
