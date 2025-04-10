---
sidebar_position: 3
sidebar_label: Simple Frontend
title: Building a Simple Frontend with FCL
description: Learn how to build a frontend application using Next.js and Flow Client Library (FCL) to interact with Flow smart contracts. Set up wallet authentication, read contract data, and send transactions.
keywords:
  - FCL
  - Flow Client Library
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

# Simple Frontend

Building upon the `Counter` contract you interacted with in [Step 1: Contract Interaction](contract-interaction.md) and deployed locally in [Step 2: Local Development](./flow-cli.md), this tutorial will guide you through creating a simple frontend application using [Next.js] to interact with the `Counter` smart contract on the local Flow emulator. Using the [Flow Client Library] (FCL), you'll learn how to read and modify the contract's state from a React web application, set up wallet authentication using FCL's Discovery UI connected to the local emulator, and query the chain to read data from smart contracts.

## Objectives

After completing this guide, you'll be able to:

- Display data from a [Cadence] smart contract (`Counter`) on a Next.js frontend using the [Flow Client Library].
- Query the chain to read data from smart contracts on the local emulator.
- Mutate the state of a smart contract by sending transactions using FCL and a wallet connected to the local emulator.
- Set up the Discovery UI to use a wallet for authentication with the local emulator.

## Prerequisites

- Completion of [Step 1: Contract Interaction](contract-interaction.md) and [Step 2: Local Development](./flow-cli.md).
- Flow CLI installed.
- Node.js and npm installed.

## Setting Up the Next.js App

Assuming you're in your project directory from Steps 1 and 2, we'll create a Next.js frontend application to interact with your smart contract deployed on the local Flow emulator.

### Step 1: Create a New Next.js App

First, we'll create a new Next.js application using `npx create-next-app`. We'll create it inside your existing project directory and then move it up to the root directory.

**Assumption**: You are already in your project directory.

Run the following command:

```bash
npx create-next-app@latest fcl-app-quickstart
```

During the setup process, you'll be prompted with several options. Choose the following:

- **TypeScript**: **No**
- **Use src directory**: **Yes**
- **Use App Router**: **Yes**

This command will create a new Next.js project named `fcl-app-quickstart` inside your current directory.

### Step 2: Move the Next.js App Up a Directory

Now, we'll move the contents of the `fcl-app-quickstart` directory up to your project root directory.

**Note**: Moving the Next.js app into your existing project may overwrite existing files such as `package.json`, `package-lock.json`, `.gitignore`, etc. **Make sure to back up any important files before proceeding.** You may need to merge configurations manually.

#### Remove the README File

Before moving the files, let's remove the `README.md` file from the `fcl-app-quickstart` directory to avoid conflicts:

```bash
rm fcl-app-quickstart/README.md
```

#### Merge `.gitignore` Files and Move Contents

To merge the `.gitignore` files, you can use the `cat` command to concatenate them and then remove duplicates:

```bash
cat .gitignore fcl-app-quickstart/.gitignore | sort | uniq > temp_gitignore
mv temp_gitignore .gitignore
```

Now, move the contents of the `fcl-app-quickstart` directory to your project root:

On macOS/Linux:

```bash
mv fcl-app-quickstart/* .
mv fcl-app-quickstart/.* .  # This moves hidden files like .env.local if any
rm -r fcl-app-quickstart
```

On Windows (PowerShell):

```powershell
Move-Item -Path .\fcl-app-quickstart\* -Destination . -Force
Move-Item -Path .\fcl-app-quickstart\.* -Destination . -Force
Remove-Item -Recurse -Force .\fcl-app-quickstart
```

**Note**: When moving hidden files (those starting with a dot, like `.gitignore`), ensure you don't overwrite important files in your root directory.

### Step 3: Install FCL

Now, install the Flow Client Library (FCL) in your project. FCL is a JavaScript library that simplifies interaction with the Flow blockchain:

```bash
npm install @onflow/fcl
```

## Setting Up the Local Flow Emulator and Dev Wallet

Before proceeding, ensure that both the Flow emulator and the Dev Wallet are running.

### Step 1: Start the Flow Emulator

In a new terminal window, navigate to your project directory and run:

```bash
flow emulator start
```

This starts the Flow emulator on `http://localhost:8888`.

### Step 2: Start the FCL Dev Wallet

In another terminal window, run:

```bash
flow dev-wallet
```

This starts the Dev Wallet, which listens on `http://localhost:8701`. The Dev Wallet is a local wallet that allows you to authenticate with the Flow blockchain and sign transactions on the local emulator. This is the wallet we'll select in Discovery UI when authenticating.

## Querying the Chain

Now, let's read data from the `Counter` smart contract deployed on the local Flow emulator.

Since you've already deployed the `Counter` contract in [Step 2: Local Development](./flow-cli.md), we can proceed to query it.

### Step 1: Update the Home Page

Open `src/app/page.js` in your editor.

#### Adding the FCL Configuration Before the Rest

At the top of your `page.js` file, before the rest of the code, we'll add the FCL configuration. This ensures that FCL is properly configured before we use it.

Add the following code:

```jsx
import * as fcl from "@onflow/fcl";

// FCL Configuration
fcl.config({
  ...fcl.flowEmulator
});
```

This configuration code sets up FCL to work with the local Flow emulator and Dev Wallet. The `flowEmulator` object provides a default FCL configuration that simplifies development by automatically setting the necessary parameters. You can learn more about default configurations [here](../../tools/clients/fcl-js/api.md#using-default-configurations).

For more information on Discovery configurations, refer to the [Wallet Discovery Guide](../../tools/clients/fcl-js/discovery.md).

#### Implementing the Component

Now, we'll implement the component to query the count from the `Counter` contract.

Update your `page.js` file to the following:

```jsx
// src/app/page.js

"use client"; // This directive is necessary when using useState and useEffect in Next.js App Router

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

// FCL Configuration
fcl.config({
  ...fcl.flowEmulator
});

export default function Home() {
  const [count, setCount] = useState(0);

  const queryCount = async () => {
    try {
      const res = await fcl.query({
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
      setCount(res);
    } catch (error) {
      console.error("Error querying count:", error);
    }
  };

  useEffect(() => {
    queryCount();
  }, []);

  return (
    <div>
      <h1>FCL App Quickstart</h1>
      <div>Count: {count}</div>
    </div>
  );
}
```

In the above code:

- We import the necessary React hooks (`useState` and `useEffect`) and the FCL library.
- We define the `Home` component, which is the main page of our app.
- We set up a state variable `count` using the `useState` hook to store the count value.
- We define an `async` function `queryCount` to query the count from the `Counter` contract.
- We use the `useEffect` hook to call `queryCount` when the component mounts.
- We return a simple JSX structure that displays the count value on the page.
- If an error occurs during the query, we log it to the console.
- We use the script from Step 2 to query the count from the `Counter` contract and format it using the `NumberFormatter` contract.

:::info

In this tutorial, we've shown you hardcoding addresses directly for simplicity and brevity. However, it's **recommended** to use the `import "ContractName"` syntax, as demonstrated in [Step 2: Local Development](./flow-cli.md). This approach is supported by the Flow Client Library (FCL) and allows you to use aliases for contract addresses in your `flow.json` file. It makes your code more flexible, maintainable, and easier to adapt across different environments (e.g., `testnet`, `mainnet`).

Learn more about this best practice in the [FCL Documentation](../../tools/clients/fcl-js/api.md#using-flowjson-for-contract-imports).

:::

### Step 2: Run the App

Start your development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser. You should see the current count displayed on the page, formatted according to the `NumberFormatter` contract.

## Mutating the Chain State

Now that we've successfully read data from the Flow blockchain emulator, let's modify the state by incrementing the `count` in the `Counter` contract. We'll set up wallet authentication and send a transaction to the blockchain emulator.

### Adding Authentication and Transaction Functionality

#### Step 1: Manage Authentication State

In `src/app/page.js`, add new state variables to manage the user's authentication state:

```jsx
const [user, setUser] = useState({ loggedIn: false });
```

#### Step 2: Subscribe to Authentication Changes

Update the `useEffect` hook to subscribe to the current user's authentication state:

```jsx
useEffect(() => {
  fcl.currentUser.subscribe(setUser);
  queryCount();
}, []);
```

The `currentUser.subscribe` method listens for changes to the current user's authentication state and updates the `user` state accordingly.

#### Step 3: Define Log In and Log Out Functions

Define the `logIn` and `logOut` functions:

```jsx
const logIn = () => {
  fcl.authenticate();
};

const logOut = () => {
  fcl.unauthenticate();
};
```

The `authenticate` method opens the Discovery UI for the user to log in, while `unauthenticate` logs the user out.

#### Step 4: Define the `incrementCount` Function

Add the `incrementCount` function:

```jsx
const incrementCount = async () => {
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import Counter from 0xf8d6e0586b0a20c7

        transaction {

          prepare(acct: &Account) {
              // Authorizes the transaction
          }
      
          execute {
              // Increment the counter
              Counter.increment()
      
              // Retrieve the new count and log it
              let newCount = Counter.getCount()
              log("New count after incrementing: ".concat(newCount.toString()))
          }
      }
      `,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser.authorization],
      limit: 50,
    });

    console.log("Transaction Id", transactionId);

    await fcl.tx(transactionId).onceExecuted();
    console.log("Transaction Executed");

    queryCount();
  } catch (error) {
    console.error("Transaction Failed", error);
  }
};
```

In the above code:

- We define an `async` function `incrementCount` to send a transaction to increment the count in the `Counter` contract.
- We use the `mutate` method to send a transaction to the blockchain emulator.
- The transaction increments the count in the `Counter` contract and logs the new count.
- We use the `proposer`, `payer`, and `authorizations` properties to set the transaction's proposer, payer, and authorizations to the current user.
- The `limit` property sets the gas limit for the transaction.
- We log the transaction ID and wait for the transaction to be sealed before querying the updated count.
- If an error occurs during the transaction, we log it to the console.
- After the transaction is sealed, we call `queryCount` to fetch and display the updated count.
- We use the transaction from Step 2 to increment the count in the `Counter` contract.

#### Step 5: Update the Return Statement

Update the `return` statement to include authentication buttons and display the user's address when they're logged in:

```jsx
return (
  <div>
    <h1>FCL App Quickstart</h1>
    <div>Count: {count}</div>
    {user.loggedIn ? (
      <div>
        <p>Address: {user.addr}</p>
        <button onClick={logOut}>Log Out</button>
        <div>
          <button onClick={incrementCount}>Increment Count</button>
        </div>
      </div>
    ) : (
      <button onClick={logIn}>Log In</button>
    )}
  </div>
);
```

#### Full `page.js` Code

Your `src/app/page.js` should now look like this:

```jsx
// src/app/page.js

"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

// FCL Configuration
fcl.config({
  ...fcl.flowEmulator
});

export default function Home() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ loggedIn: false });

  const queryCount = async () => {
    try {
      const res = await fcl.query({
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
      setCount(res);
    } catch (error) {
      console.error("Error querying count:", error);
    }
  };

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    queryCount();
  }, []);

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };

  const incrementCount = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import Counter from 0xf8d6e0586b0a20c7

          transaction {

            prepare(acct: &Account) {
                // Authorizes the transaction
            }
        
            execute {
                // Increment the counter
                Counter.increment()
        
                // Retrieve the new count and log it
                let newCount = Counter.getCount()
                log("New count after incrementing: ".concat(newCount.toString()))
            }
        }
        `,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser.authorization],
        limit: 50,
      });

      console.log("Transaction Id", transactionId);

      await fcl.tx(transactionId).onceExecuted();
      console.log("Transaction Executed");

      queryCount();
    } catch (error) {
      console.error("Transaction Failed", error);
    }
  };

  return (
    <div>
      <h1>FCL App Quickstart</h1>
      <div>Count: {count}</div>
      {user.loggedIn ? (
        <div>
          <p>Address: {user.addr}</p>
          <button onClick={logOut}>Log Out</button>
          <div>
            <button onClick={incrementCount}>Increment Count</button>
          </div>
        </div>
      ) : (
        <button onClick={logIn}>Log In</button>
      )}
    </div>
  );
}
```

Visit `http://localhost:3000` in your browser.

- **Log In**:
  - Click the "Log In" button.
  - The Discovery UI will appear, showing the available wallets. Select the "Dev Wallet" option.
  - Select the account to log in with.
  - If prompted, create a new account or use an existing one.

- **Increment Count**:
  - After logging in, you'll see your account address displayed.
  - Click the "Increment Count" button.
  - Your wallet will prompt you to approve the transaction.
  - Approve the transaction to send it to the Flow emulator.

- **View Updated Count**:
  - Once the transaction is sealed, the app will automatically fetch and display the updated count.
  - You should see the count incremented on the page, formatted using the `NumberFormatter` contract.

## Conclusion

By following these steps, you've successfully created a simple frontend application using Next.js that interacts with the `Counter` smart contract on the Flow blockchain emulator. You've learned how to:

- Add the FCL configuration before the rest of your code within the `page.js` file.
- Configure FCL to work with the local Flow emulator and Dev Wallet.
- Start the Dev Wallet using `flow dev-wallet` to enable local authentication.
- Read data from the local blockchain emulator, utilizing multiple contracts (`Counter` and `NumberFormatter`).
- Authenticate users using the local Dev Wallet.
- Send transactions to mutate the state of a smart contract on the local emulator.

## Additional Resources

[Flow Client Library]: https://github.com/onflow/fcl-js
[Cadence]: https://developers.flow.com/cadence
[Next.js]: https://nextjs.org/docs/getting-started
[Flow Emulator]: https://developers.flow.com/tools/emulator
[Flow Dev Wallet]: https://github.com/onflow/fcl-dev-wallet