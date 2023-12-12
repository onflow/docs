---
sidebar_position: 3
sidebar_label: Pt. 3 - Interacting with the Blockchain
---

# Hello World Pt. 3 - Interacting with the Blockchain

Flow Client Library (FCL), is a JavaScript library developed to facilitate interactions with the Flow blockchain. It provides developers with tools to build, integrate, and interact with Flow directly from web applications. This web app quickstart will get you interacting with a contract already deployed to Flow.

For this tutorial, we're going to be making a [React](https://react.dev/learn) app with [Create React App](https://create-react-app.dev/). We'll try and keep the code as simple as possible in case you're coming from another framework.

First, let's create our app and then navigate to it with the following terminal commands:

```
npx create-react-app fcl-app-quickstart
cd fcl-app-quickstart
```

It comes with a default layout, but let's remove it in `src/App.js` with something simple. Copy and paste this:

```
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

Now let's run our app with the following `npm` command:

```
npm start
```

## Setting Up FCL

In order to use FCL, we need to install it. Let's run the following to download the library and set it as a dependency in our project:

```
npm install @onflow/fcl --save
```

Next we'll want to add to our FCL configuration. There's a lot you can do here, but for this simple example, let's configure `accessNode.api` to talk to the Testnet Flow Access Node. An Access Node serves as the primary point of interaction for clients, such as wallets, dapps, and other services, to communicate with the Flow network. It provides a gateway for these clients to submit transactions, query data, and retrieve information without having to connect to the entire network or maintain a full copy of the blockchain.

For our example, we are going to point at a free Access Node provided by Flow. Add the following config code to your `src/App.js`

```
// src/App.js

import * as fcl from '@onflow/fcl'

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org'
})
```

## Querying the Chain

On Flow, you can interact with a contract by reading from the chain with a script or changing its state with a transaction. Reading is free and is done with FCL by passing a Cadence (the smart contract language of Flow) script to `fcl.query`. For our example we are going to read from a `HelloWorld` contract deployed to the account `0x9dca641e9a4b691b` on `testnet` (you can [view the contract here](https://f.dnz.dev/0x9dca641e9a4b691b/HelloWorld) to see what it looks like).

In the same `src/App.js` file, let's create app state to store our greeting and query the chain when the component renders in order to fetch the greeting state from the `HelloWorld` contract.

```
const [greeting, setGreeting] = useState("");

useEffect(() => {
  const queryChain = async () => {
    const res = await fcl.query({
      cadence: `
        import HelloWorld from 0x9dca641e9a4b691b

        pub fun main(): String {
          return HelloWorld.greeting
        }
    `
    });

    console.log(res);
    setGreeting(res);
  }

  queryChain();
}, []);
```

At this point our entire `src/App.js` file should look like this:

```
import { useEffect, useState } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';

fcl.config({
    'accessNode.api': 'https://rest-testnet.onflow.org'
});

function App() {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const queryChain = async () => {
            const res = await fcl.query({
                cadence: `
                    import HelloWorld from 0x9dca641e9a4b691b

                    pub fun main(): String {
                        return HelloWorld.greeting
                    }
                `
            });

            console.log(res);
            setGreeting(res);
        };

        queryChain();
    }, []);

    return (
        <div className="App">
            <div>FCL App Quickstart</div>
            <div>{greeting}</div>
        </div>
    );
}

export default App;
```

You just built an app on Flow!

## Mutating Chain State and More

For a deeper dive into writing an FCL app, such as how to change the chain state with FCL, check out [this guide](../../guides/flow-app-quickstart.md) or the [FCL documentation](../../../tools/clients/fcl-js/index.md).