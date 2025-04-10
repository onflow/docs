sidebar_position: 3
sidebar_label: Simple Frontend
title: Building a Simple Frontend with @onflow/kit
description: Learn how to build a Next.js frontend application using @onflow/kit to interact with Flow smart contracts. Set up wallet authentication, read contract data, and send transactions with kit’s React hooks.
keywords:
  - @onflow/kit
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

# Simple Frontend with @onflow/kit

Building on the `Counter` contract you deployed in [Step 1: Contract Interaction](contract-interaction.md) and [Step 2: Local Development](./flow-cli.md), this tutorial shows you how to create a simple Next.js frontend that interacts with the `Counter` smart contract deployed on your local Flow emulator. Instead of using FCL directly, you'll leverage **@onflow/kit** to simplify authentication, querying, and transactions with a set of convenient React hooks.

## Objectives

After finishing this guide you will be able to:

- Wrap your Next.js app with a Flow provider using **@onflow/kit**.
- Read data from a Cadence smart contract (`Counter`) using kit’s query hook.
- Send a transaction to update the smart contract’s state using kit’s mutation hook.
- Authenticate with the Flow blockchain using kit’s built-in hooks and the local Dev Wallet.

## Prerequisites

- Completion of [Step 1: Contract Interaction](contract-interaction.md) and [Step 2: Local Development](./flow-cli.md).
- Flow CLI installed.
- Node.js and npm installed.

## Setting Up the Next.js App

Assuming you’re in the project directory from Steps 1 and 2, follow these instructions to create your Next.js frontend and integrate **@onflow/kit**.

### Step 1: Create a New Next.js App

Run the following command in your project directory:

```bash
npx create-next-app@latest kit-app-quickstart
```

During setup, choose the following options:

- **TypeScript**: **No**
- **Use src directory**: **Yes**
- **Use App Router**: **Yes**

This creates a new Next.js project named `kit-app-quickstart` inside your current directory.

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

This library wraps FCL internally and exposes a set of hooks for authentication, querying, and sending transactions.

## Configuring the Local Flow Emulator and Dev Wallet

Before moving on, ensure that both the Flow emulator and the Dev Wallet are running.

### Step 1: Start the Flow Emulator

Open a new terminal window in your project directory and run:

```bash
flow emulator start
```

This will start the Flow emulator on `http://localhost:8888`.

### Step 2: Start the Dev Wallet

In another terminal window, run:

```bash
flow dev-wallet
```

This will start the Dev Wallet on `http://localhost:8701`, which you’ll use for authentication during development.

## Wrapping Your App with FlowProvider

**@onflow/kit** provides a `FlowProvider` component that sets up the Flow Client Library configuration. In Next.js using the App Router, you can add this in your `layout.tsx` (or `_app.js` if you’re using the pages directory).

Create or update `src/app/layout.tsx` as follows:

```tsx
// src/app/layout.tsx

import { FlowProvider } from "@onflow/kit";
import flowJSON from "../flow.json"; // Ensure your flow.json exists and includes contract aliases

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <FlowProvider
          config={{
            accessNodeUrl: "http://localhost:8888",
            flowNetwork: "emulator",
            discoveryWallet: "http://localhost:8701/fcl/authn",
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

## Creating the Home Page

Next, create a frontend page that reads the current `Counter` value and allows authenticated users to increment the count.

### Step 1: Querying the Chain

Replace your existing `src/app/page.js` (or `page.tsx`) with the following code that uses kit’s hooks:

```jsx
// src/app/page.js

"use client";

import { useFlowQuery, useFlowMutate, useCurrentFlowUser } from "@onflow/kit";

export default function Home() {
  // Use kit hook to access the current user object and authentication methods
  const { user, authenticate, unauthenticate } = useCurrentFlowUser();

  // Query the Counter contract's count using kit's useFlowQuery hook
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
      pub fun main(): String {
          // Retrieve the count from the Counter contract
          let count: Int = Counter.getCount()

          // Format the count using NumberFormatter
          let formattedCount = NumberFormatter.formatWithCommas(number: count)

          // Return the formatted count
          return formattedCount
      }
    `,
  });

  // Use kit hook to send transactions to the blockchain
  const { mutate: increment, isPending: txPending, error: txError } = useFlowMutate();

  const incrementCount = async () => {
    try {
      // Send a transaction to increment the counter
      const transactionId = await increment({
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
        proposer: user,
        payer: user,
        authorizations: [user.authorization],
        limit: 50,
      });

      console.log("Transaction Id", transactionId);

      // Optionally, you can subscribe to transaction status using useFlowTransaction
      // For this guide, we simply refetch the count after the transaction completes
      await new Promise((resolve) => setTimeout(resolve, 2000)); // brief delay
      refetch();
    } catch (error) {
      console.error("Transaction Failed", error);
    }
  };

  return (
    <div>
      <h1>@onflow/kit App Quickstart</h1>

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

      {user.loggedIn ? (
        <div>
          <p>Address: {user.addr}</p>
          <button onClick={unauthenticate}>Log Out</button>
          <button onClick={incrementCount} disabled={txPending}>
            {txPending ? "Processing..." : "Increment Count"}
          </button>
          {txError && <p>Error: {txError.message}</p>}
        </div>
      ) : (
        <button onClick={authenticate}>Log In</button>
      )}
    </div>
  );
}
```

In this code:

- **Authentication:** The `useCurrentFlowUser` hook provides the `user` object along with `authenticate` and `unauthenticate` methods to manage user login/logout.
- **Querying:** The `useFlowQuery` hook sends a Cadence script to fetch and format the current counter value.
- **Transactions:** The `useFlowMutate` hook is used to send a transaction that increments the counter in the smart contract.
- **State Updates:** After a transaction, the counter is re-queried to display the updated count.

### Step 2: Run the App

Start your development server:

```bash
npm run dev
```

Then, visit [http://localhost:3000](http://localhost:3000) in your browser. You should see:

- The current count (formatted with commas using the `NumberFormatter`).
- A **Log In** button. When clicked, the kit Discovery UI will open with your local Dev Wallet at `http://localhost:8701/fcl/authn`.
- Once logged in, your account address appears with options to **Log Out** and **Increment Count**.
- Clicking **Increment Count** will send a transaction to the Flow emulator. After a brief delay, the new count will be fetched and displayed.

## Conclusion

By following these steps, you’ve built a simple Next.js dApp that interacts with a Flow smart contract using **@onflow/kit**. In this guide you learned how to:

- Wrap your application in a `FlowProvider` to configure blockchain connectivity.
- Use kit hooks such as `useCurrentFlowUser`, `useFlowQuery`, and `useFlowMutate` to manage authentication, query on-chain data, and submit transactions.
- Integrate with the local Flow emulator and Dev Wallet for a fully functional development setup.

For additional details and advanced usage, refer to the [@onflow/kit documentation](https://github.com/onflow/kit) and related Flow developer resources.

Happy building!
