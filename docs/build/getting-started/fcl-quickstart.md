---
sidebar_position: 3
sidebar_label: Simple Frontend
---

# Simple Frontend

Building upon the `Counter` contract you interacted with in [Step 1: Contract Interaction](hello-world.md) and deployed locally in [Step 2: Local Development](./flow-cli.md), this tutorial will guide you through creating a simple frontend application using [Next.js] to interact with the `Counter` smart contract on the Flow blockchain. Using the [Flow Client Library] (FCL), you'll learn how to read and modify the contract's state from a React web application and set up wallet authentication using FCL's Discovery UI.

## Objectives

After completing this guide, you'll be able to:

- Display data from a [Cadence] smart contract (`Counter`) on a Next.js frontend using the [Flow Client Library].
- Mutate the state of a smart contract by sending transactions using FCL and a wallet.
- Set up the Discovery UI to use a wallet for authentication.

## Creating the App

First, let's create our Next.js app and navigate to it with the following terminal commands. From the root of where you keep your source code:

```bash
npx create-next-app@latest fcl-app-quickstart
cd fcl-app-quickstart
```

This command sets up a new Next.js project named `fcl-app-quickstart`. Then, we navigate into the project directory.

Open the new project in your editor.

The default layout includes some boilerplate code that we don't need. Let's simplify `pages/index.js` to start with a clean slate. Replace the contents of `pages/index.js` with:

```jsx
// pages/index.js

export default function Home() {
  return (
    <div>
      <h1>FCL App Quickstart</h1>
    </div>
  );
}
```

This code defines a simple `Home` component that displays the text "FCL App Quickstart".

Now, let's run our app with the following `npm` command:

```bash
npm run dev
```

This will start the development server and open your app in the browser at `http://localhost:3000`. You will see a page displaying `FCL App Quickstart`.

## Setting Up FCL

To interact with the Flow blockchain, we need to install the [Flow Client Library] (FCL). In your terminal, run the following command to install FCL:

```bash
npm install @onflow/fcl
```

This command installs FCL and adds it to your project's dependencies.

Next, we'll configure FCL to connect to the [Flow Testnet]. An [Access Node] serves as the primary point of interaction for clients to communicate with the Flow network. It provides a gateway for submitting transactions, querying data, and retrieving information.

Create a new file `flow/config.js` (you may need to create the `flow` directory inside your project root) and add the following configuration code:

```jsx
// flow/config.js

import * as fcl from "@onflow/fcl";

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});
```

Then, in your `pages/_app.js` file, import the configuration:

```jsx
// pages/_app.js

import "../styles/globals.css";
import "../flow/config"; // Import the FCL configuration

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

## Querying the Chain

Now, let's read data from the `Counter` smart contract deployed on the Flow Testnet. We'll use the `Counter` contract deployed to the account `0x8a4dce54554b225d` (the same contract we used in previous steps).

This contract has a public function `getCount()` that we can call to retrieve the current count.

First, we'll set up state in our app to store the count and manage component updates. We'll use React's `useState` and `useEffect` hooks.

Update your imports in `pages/index.js` to include `useState`, `useEffect`, and `fcl`:

```jsx
// pages/index.js

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
```

Next, initialize the `count` state variable inside your `Home` component:

```jsx
const [count, setCount] = useState(0);
```

Now, let's create a function to query the count from the blockchain:

```jsx
const queryCount = async () => {
  try {
    const res = await fcl.query({
      cadence: `
        import Counter from 0x8a4dce54554b225d

        access(all)
        fun main(): Int {
          return Counter.getCount()
        }
      `,
    });
    setCount(res);
  } catch (error) {
    console.error("Error querying count:", error);
  }
};
```

- **Explanation**:
  - We use `fcl.query` to send a script to the Flow blockchain.
  - The Cadence script imports the `Counter` contract and defines a `main` function that returns the `count` variable via the `getCount()` function.
  - The result of the query is stored in `res`, and we update the `count` state with `setCount(res)`.

Next, use the `useEffect` hook to call `queryCount` when the component mounts:

```jsx
useEffect(() => {
  queryCount();
}, []);
```

The empty array `[]` ensures that `queryCount` is called only once when the component first renders.

Finally, update the `return` statement to display the count:

```jsx
return (
  <div>
    <h1>FCL App Quickstart</h1>
    <div>Count: {count}</div>
  </div>
);
```

At this point, your `pages/index.js` file should look like this:

```jsx
// pages/index.js

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {
  const [count, setCount] = useState(0);

  const queryCount = async () => {
    try {
      const res = await fcl.query({
        cadence: `
          import Counter from 0x8a4dce54554b225d

          access(all)
          fun main(): Int {
            return Counter.getCount()
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

Now, run `npm run dev` again. After a moment, the count from the `Counter` contract should appear on your page!

## Mutating the Chain State

Now that we've successfully read data from the Flow blockchain, let's modify the state by incrementing the `count` in the `Counter` contract. To do this, we'll need to send a transaction to the blockchain, which requires user authentication through a wallet.

### Creating a Flow Wallet and Funding Your Testnet Account

Before sending transactions, you need a Flow wallet to authenticate and interact with the blockchain. You can create a wallet by visiting the [Flow Testnet Wallet](https://testnet-faucet.onflow.org/authn) website. Follow the on-screen instructions to set up your wallet.

Once you have a wallet, make sure that your account has enough FLOW tokens to cover transaction fees on the Flow Testnet. You can fund your testnet account using the [Flow Testnet Faucet](https://testnet-faucet.onflow.org/fund-account). Simply enter your account address and submit to receive testnet FLOW tokens.

### Setting Up Wallet Authentication with Discovery

Before we can send a transaction, we need to set up wallet authentication. We'll use FCL's Discovery UI to allow users to connect their wallet with minimal setup.

Add the following line to your FCL configuration in `src/App.js`:

```jsx
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});
```

**One-Line Discovery UI Setup**:

- By adding the `'discovery.wallet'` line to the FCL configuration, we enable the Discovery UI.
- This provides an interface for users to select and authenticate with a wallet.
- This is all it takes—just one line—to integrate wallet selection into your app.

### Adding Authentication Buttons

Let's add a simple authentication flow to our app. We'll allow users to log in and log out, and display their account address when they're logged in.

First, add new state variables to manage the user's authentication state:

```jsx
const [user, setUser] = useState({ loggedIn: false });
```

Then, use `useEffect` to subscribe to the current user's authentication state:

```jsx
useEffect(() => {
  fcl.currentUser.subscribe(setUser);
  queryCount();
}, []);
```

- **Explanation**:
  - `fcl.currentUser.subscribe(setUser)` sets up a listener that updates the `user` state whenever the authentication state changes.
  - We also call `queryCount()` to fetch the count when the component mounts.

Next, define the `logIn` and `logOut` functions:

```jsx
const logIn = () => {
  fcl.authenticate();
};

const logOut = () => {
  fcl.unauthenticate();
};
```

- **Explanation**:
  - `fcl.authenticate()` triggers the authentication process using the Discovery UI.
  - `fcl.unauthenticate()` logs the user out.

Now, update the `return` statement to include authentication buttons and display the user's address when they're logged in:

```jsx
return (
  <div>
    <h1>FCL App Quickstart</h1>
    <div>Count: {count}</div>
    {user.loggedIn ? (
      <div>
        <p>Address: {user.addr}</p>
        <button onClick={logOut}>Log Out</button>
        {/* We'll add the transaction button here later */}
      </div>
    ) : (
      <button onClick={logIn}>Log In</button>
    )}
  </div>
);
```

### Sending a Transaction to Increment the Counter

Next, we'll add a button to allow the user to increment the count by sending a transaction to the blockchain.

First, define the `incrementCount` function:

```jsx
const incrementCount = async () => {
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import Counter from 0x8a4dce54554b225d

        transaction {
          prepare(acct: AuthAccount) {}
          execute {
            Counter.increment()
          }
        }
      `,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser.authorization],
      limit: 50,
    });

    console.log("Transaction Id", transactionId);

    await fcl.tx(transactionId).onceSealed();
    console.log("Transaction Sealed");

    queryCount();
  } catch (error) {
    console.error("Transaction Failed", error);
  }
};
```

- **Explanation**:
  - `fcl.mutate` is used to send a transaction to the Flow blockchain.
  - The Cadence transaction imports the `Counter` contract and calls `increment()`.
  - `proposer`, `payer`, and `authorizations` are set to `fcl.currentUser`, meaning the authenticated user will sign and pay for the transaction.
  - We wait for the transaction to be sealed (completed and finalized on the blockchain) using `fcl.tx(transactionId).onceSealed()`.
  - After the transaction is sealed, we call `queryCount()` to fetch the updated count.

Next, update the `return` statement to include the button for incrementing the count:

```jsx
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
```

- **Explanation**:
  - When the user is logged in, we display a button: "Increment Count".
  - Clicking this button triggers the `incrementCount` function to send a transaction to increment the count.

## Full Code

Your `pages/index.js` should now look like this:

```jsx
// pages/index.js

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ loggedIn: false });

  const queryCount = async () => {
    try {
      const res = await fcl.query({
        cadence: `
          import Counter from 0x8a4dce54554b225d

          access(all)
          fun main(): Int {
            return Counter.getCount()
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
          import Counter from 0x8a4dce54554b225d

          transaction {
            prepare(acct: AuthAccount) {}
            execute {
              Counter.increment()
            }
          }
        `,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser.authorization],
        limit: 50,
      });

      console.log("Transaction Id", transactionId);

      await fcl.tx(transactionId).onceSealed();
      console.log("Transaction Sealed");

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

## Running the App

Now, run your app with `npm run dev` and open it in your browser at `http://localhost:3000`.

- **Log In**:
  - Click the "Log In" button.
  - The Discovery UI will appear, presenting you with a list of wallets to authenticate with (e.g., Flow Testnet Wallet).
  - Select a wallet and follow the prompts to log in.

- **Increment Count**:
  - Once logged in, you'll see your account address displayed.
  - Click the "Increment Count" button.
  - Your wallet will prompt you to approve the transaction.
  - After approving, the transaction will be sent to the Flow blockchain.

- **View Updated Count**:
  - After the transaction is sealed, the app will automatically fetch and display the updated count.
  - You should see the count updated on the page.

---

By following these steps, you've successfully created a simple frontend application using Next.js that interacts with the `Counter` smart contract on the Flow blockchain. You've learned how to read data from the blockchain, authenticate users, and send transactions to mutate the state of a smart contract.

<!-- Relative-style links. Does not render on the page -->

[Flow Client Library]: https://github.com/onflow/fcl-js
[Cadence]: https://developers.flow.com/cadence
[React]: https://reactjs.org/docs/getting-started.html
[Next.js]: https://nextjs.org/docs/getting-started
[Flow Testnet]: https://developers.flow.com/tools/access-api#testnet-access-node
[Access Node]: https://developers.flow.com/tools/access-api
[FCL documentation]: ../../tools/clients/fcl-js/index.md