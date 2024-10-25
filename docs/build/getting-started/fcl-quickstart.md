---
sidebar_position: 3
sidebar_label: Simple Frontend
---

# Simple Frontend

[Flow Client Library] (FCL) is a JavaScript library developed to facilitate interactions with the Flow blockchain. It provides developers with tools to build, integrate, and interact with Flow directly from web applications. This quickstart will guide you through interacting with a contract already deployed on Flow, reading and mutating its state, and setting up wallet authentication using FCL's Discovery UI.

For this tutorial, we're going to create a [React] app using [Create React App]. We'll keep the code as simple as possible, so even if you're coming from another framework, you can follow along.

## Objectives

After completing this guide, you'll be able to:

- Display data from a [Cadence] smart contract on a React frontend using the [Flow Client Library].
- Mutate the state of a smart contract by sending transactions using FCL and a wallet.
- Set up the Discovery UI to use a wallet for authentication.

## Creating the App

First, let's create our app and navigate to it with the following terminal commands. From the root of where you keep your source code:

```bash
npx create-react-app fcl-app-quickstart
cd fcl-app-quickstart
```

This command uses sets up a new React project named `fcl-app-quickstart`. Then, we navigate into the project directory.

Open the new project in your editor.

The default layout includes some boilerplate code that we don't need. Let's simplify `src/App.js` to start with a clean slate. Replace the contents of `src/App.js` with:

```jsx
// src/App.js

import './App.css';

function App() {
  return (
    <div className="App">
      <div>FCL App Quickstart</div>
    </div>
  );
}

export default App;
```

This code defines a simple `App` component that displays the text "FCL App Quickstart".

Now, let's run our app with the following `npm` command:

```bash
npm start
```

This will start the development server and open your app in the browser. You will see a page displaying `FCL App Quickstart`.

## Setting Up FCL

To interact with the Flow blockchain, we need to install the [Flow Client Library] (FCL). Stop the development server by pressing `Ctrl+C` in the terminal, and then run the following command to install FCL:

```bash
npm install @onflow/fcl --save
```

This command installs FCL and adds it to your project's dependencies.

Next, we'll configure FCL to connect to the [Flow Testnet](../../networks/flow-networks/accessing-testnet.md). An [Access Node](../../networks/node-ops/access-onchain-data/access-nodes/accessing-data/access-api.md) serves as the primary point of interaction for clients to communicate with the Flow network. It provides a gateway for submitting transactions, querying data, and retrieving information.

In `src/App.js`, import FCL and add the configuration code:

```jsx
// src/App.js

import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
});
```

This configuration sets the access node endpoint to the Flow Testnet.

Your `src/App.js` should now look like this:

```jsx
import './App.css';
import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
});

function App() {
  return (
    <div className="App">
      <div>FCL App Quickstart</div>
    </div>
  );
}

export default App;
```

## Querying the Chain

Now, let's read data from a smart contract deployed on the Flow Testnet. We'll use a `HelloWorld` contract deployed to the account `0xa1296b1e2e90ca5b` (you can [view the contract here] to see what it looks like).

This contract has a public variable `greeting` that we can read.

First, we'll set up state in our app to store the greeting and manage component updates. We'll use React's `useState` and `useEffect` hooks.

Update your imports in `src/App.js` to include `useState` and `useEffect`:

```jsx
import { useEffect, useState } from 'react';
```

Next, initialize the `greeting` state variable inside your `App` component:

```jsx
const [greeting, setGreeting] = useState('');
```

Now, let's create a function to query the greeting from the blockchain:

```jsx
const queryGreeting = async () => {
  const res = await fcl.query({
    cadence: `
      import HelloWorld from 0xa1296b1e2e90ca5b

      access(all)
      fun main(): String {
        return HelloWorld.greeting
      }
    `,
  });
  setGreeting(res);
};
```

- **Explanation**:
    - We use `fcl.query` to send a script to the Flow blockchain.
    - The Cadence script imports the `HelloWorld` contract and defines a `main` function that returns the `greeting` variable.
    - The result of the query is stored in `res`, and we update the `greeting` state with `setGreeting(res)`.

Next, use the `useEffect` hook to call `queryGreeting` when the component mounts:

```jsx
useEffect(() => {
  queryGreeting();
}, []);
```

The empty array `[]` ensures that `queryGreeting` is called only once when the component first renders.

Finally, update the `return` statement to display the greeting:

```jsx
return (
  <div className="App">
    <div>FCL App Quickstart</div>
    <div>Greeting: {greeting}</div>
  </div>
);
```

At this point, your `src/App.js` file should look like this:

```jsx
import { useEffect, useState } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
});

function App() {
  const [greeting, setGreeting] = useState('');

  const queryGreeting = async () => {
    const res = await fcl.query({
      cadence: `
        import HelloWorld from 0xa1296b1e2e90ca5b

        access(all)
        fun main(): String {
          return HelloWorld.greeting
        }
      `,
    });
    setGreeting(res);
  };

  useEffect(() => {
    queryGreeting();
  }, []);

  return (
    <div className="App">
      <div>FCL App Quickstart</div>
      <div>Greeting: {greeting}</div>
    </div>
  );
}

export default App;
```

Now, run `npm start` again. After a moment, the greeting from the `HelloWorld` contract should appear on your page!

## Mutating the Chain State

Now that we've successfully read data from the Flow blockchain, let's modify the state by changing the `greeting` in the `HelloWorld` contract. To do this, we'll need to send a transaction to the blockchain, which requires user authentication through a wallet.

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

First, add a new state variable to manage the user's authentication state:

```jsx
const [user, setUser] = useState({ loggedIn: false });
```

Then, use `useEffect` to subscribe to the current user's authentication state:

```jsx
useEffect(() => {
  fcl.currentUser.subscribe(setUser);
  queryGreeting();
}, []);
```

- **Explanation**:
    - `fcl.currentUser.subscribe(setUser)` sets up a listener that updates the `user` state whenever the authentication state changes.
    - We also call `queryGreeting()` to fetch the greeting when the component mounts.

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
  <div className="App">
    <div>FCL App Quickstart</div>
    <div>Greeting: {greeting}</div>
    {user.loggedIn ? (
      <div>
        <p>Address: {user.addr}</p>
        <button onClick={logOut}>Log Out</button>
        {/* We'll add the transaction form here later */}
      </div>
    ) : (
      <button onClick={logIn}>Log In</button>
    )}
  </div>
);
```

Now, when the user clicks the "Log In" button, they'll be presented with the Discovery UI to select a wallet for authentication.

### Sending a Transaction to Change the Greeting

Next, we'll add a form to allow the user to change the greeting by sending a transaction to the blockchain.

First, add a state variable to hold the new greeting:

```jsx
const [newGreeting, setNewGreeting] = useState('');
```

Now, define the `sendTransaction` function:

```jsx
const sendTransaction = async () => {
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import HelloWorld from 0xa1296b1e2e90ca5b

        transaction(greeting: String) {
            prepare(acct: &Account) {
              log(acct.address)
            }
          
            execute {
              HelloWorld.changeGreeting(newGreeting: greeting)
            }
          }
      `,
      args: (arg, t) => [arg(newGreeting, t.String)],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser.authorization],
      limit: 50,
    });

    console.log('Transaction Id', transactionId);

    await fcl.tx(transactionId).onceSealed();
    console.log('Transaction Sealed');

    queryGreeting();
    setNewGreeting('');
  } catch (error) {
    console.error('Transaction Failed', error);
  }
};
```

- **Explanation**:
    - `fcl.mutate` is used to send a transaction to the Flow blockchain.
    - The Cadence transaction imports the `HelloWorld` contract and calls `changeGreeting` with the new greeting.
    - We pass the `newGreeting` as an argument to the transaction.
    - `proposer`, `payer`, and `authorizations` are set to `fcl.currentUser`, meaning the authenticated user will sign and pay for the transaction.
    - We wait for the transaction to be sealed (completed and finalized on the blockchain) using `fcl.tx(transactionId).onceSealed()`.
    - After the transaction is sealed, we call `queryGreeting()` to fetch the updated greeting.

Next, update the `return` statement to include the input field and button for changing the greeting:

```jsx
{user.loggedIn ? (
  <div>
    <p>Address: {user.addr}</p>
    <button onClick={logOut}>Log Out</button>
    <div>
      <input
        type="text"
        placeholder="Enter new greeting"
        value={newGreeting}
        onChange={(e) => setNewGreeting(e.target.value)}
      />
      <button onClick={sendTransaction}>Change Greeting</button>
    </div>
  </div>
) : (
  <button onClick={logIn}>Log In</button>
)}
```

- **Explanation**:
    - When the user is logged in, we display an input field for the new greeting and a button to submit it.
    - The input field is controlled by the `newGreeting` state.
    - Clicking the "Change Greeting" button triggers the `sendTransaction` function.

## Full Code

Your `src/App.js` should now look like this:

```jsx
import { useEffect, useState } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});

function App() {
  const [greeting, setGreeting] = useState('');
  const [user, setUser] = useState({ loggedIn: false });
  const [newGreeting, setNewGreeting] = useState('');

  const queryGreeting = async () => {
    const res = await fcl.query({
      cadence: `
        import HelloWorld from 0xa1296b1e2e90ca5b

        access(all)
        fun main(): String {
          return HelloWorld.greeting
        }
      `,
    });
    setGreeting(res);
  };

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    queryGreeting();
  }, []);

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };

  const sendTransaction = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import HelloWorld from 0xa1296b1e2e90ca5b

          transaction(greeting: String) {
            prepare(acct: &Account) {
              log(acct.address)
            }
          
            execute {
              HelloWorld.changeGreeting(newGreeting: greeting)
            }
          }
        `,
        args: (arg, t) => [arg(newGreeting, t.String)],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser.authorization],
        limit: 50,
      });

      console.log('Transaction Id', transactionId);

      await fcl.tx(transactionId).onceSealed();
      console.log('Transaction Sealed');

      queryGreeting();
      setNewGreeting('');
    } catch (error) {
      console.error('Transaction Failed', error);
    }
  };

  return (
    <div className="App">
      <div>FCL App Quickstart</div>
      <div>Greeting: {greeting}</div>
      {user.loggedIn ? (
        <div>
          <p>Address: {user.addr}</p>
          <button onClick={logOut}>Log Out</button>
          <div>
            <input
              type="text"
              placeholder="Enter new greeting"
              value={newGreeting}
              onChange={(e) => setNewGreeting(e.target.value)}
            />
            <button onClick={sendTransaction}>Change Greeting</button>
          </div>
        </div>
      ) : (
        <button onClick={logIn}>Log In</button>
      )}
    </div>
  );
}

export default App;
```

## Running the App

Now, run your app with `npm start` and open it in your browser.

- **Log In**:
    - Click the "Log In" button.
    - The Discovery UI will appear, presenting you with a list of wallets to authenticate with (e.g., Flow Wallet).
    - Select a wallet and follow the prompts to log in.

- **Change Greeting**:
    - Once logged in, you'll see your account address displayed.
    - Enter a new greeting in the input field.
    - Click the "Change Greeting" button.
    - Your wallet will prompt you to approve the transaction.
    - After approving, the transaction will be sent to the Flow blockchain.

- **View Updated Greeting**:
    - After the transaction is sealed, the app will automatically fetch and display the updated greeting.
    - You should see your new greeting displayed on the page.

<!-- Relative-style links.  Does not render on the page -->

[Flow Client Library]: ../../tools/clients/fcl-js/index.md
[Cadence]: https://cadence-lang.org
[React]: https://react.dev/learn
[Create React App]: https://create-react-app.dev
[view the contract here]: https://f.dnz.dev/0xa1296b1e2e90ca5b/HelloWorld
[FCL documentation]: ../../tools/clients/fcl-js/index.md