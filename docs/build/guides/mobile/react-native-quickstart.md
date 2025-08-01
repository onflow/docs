---
title: React Native Development
sidebar_label: React Native Development
sidebar_position: 4
description: Learn how to build decentralized applications using React Native and Flow Client Library (FCL). Follow this guide to set up authentication, query the blockchain, and execute transactions in a React Native app.
keywords:
  - React Native
  - Flow FCL
  - mobile dApp
  - blockchain development
  - FCL integration
  - React Native Flow
  - mobile blockchain
  - smart contracts
  - wallet integration
  - transaction signing
  - blockchain queries
  - dApp development
  - Flow mobile
  - React Native tutorial
  - mobile development
---

**Last Updated:** January 11th 2022

> **Note**: This page will walk you through a very bare bones project to get started building a web3 dapp using the Flow Client Library (FCL). If you are looking for a clonable repo, Flow community members have created quickstart templates for different JavaScript frameworks (e.g. [Next.js](https://github.com/muttoni/fcl-nextjs-quickstart), [SvelteKit](https://github.com/muttoni/fcl-sveltekit-quickstart), [Nuxt](https://github.com/bluesign/nuxt3-fcl)). You can consult the complete list [here](https://github.com/ph0ph0/Get-The-Flow-Down#fcl).

## Introduction

FCL-JS is the easiest way to start building decentralized applications. FCL (aka Flow Client Library) wraps much of the logic you'd have to write yourself on other blockchains. Follow this quick start and you'll have a solid overview of how to build a shippable dapp on Flow.

We're going to make an assumption that you know or understand React; however, the concepts should be easy to understand and transfer to another framework. While this tutorial will make use of Cadence (Flow's smart contract language), you do not need to know it. Instead, we recommend later diving into [learning the Cadence language](https://cadence-lang.org/docs/language/) once you've gotten the core FCL concepts down.

In this tutorial, we are going to interact with an existing smart contract on Flow's testnet known as the [Profile Contract](https://testnet.flowdiver.io/contract/A.ba1132bc08f82fe2.Profile). Using this contract, we will create a new profile and edit the profile information, both via a wallet. In order to do this, the FCL concepts we'll cover are:

- [Installation](#installation)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Querying the Blockchain](#querying-the-blockchain)
- [Initializing an Account](#initializing-an-account)
- [Mutating the Blockchain](#mutating-the-blockchain)

And if you ever have any questions we're always happy to help on [Discord](https://discord.gg/flowblockchain). There are also links at the end of this article for diving deeper into building on Flow.

## Installation

The first step is to generate a React app using Next.js and [create-expo-app](https://docs.expo.dev/get-started/create-a-project/). From your terminal, run the following:

```sh
npx create-expo-app flow-react-native
cd flow-react-native
```

Next, install FCL so we can use it in our app.

```sh
npm install @onflow/fcl@alpha @react-native-async-storage/async-storage expo-web-browser --save
```

Now run the app using the following command in your terminal.

```sh
npm run start
```

You should now see your app running.

## Configuration

Now that your app is running, you can configure FCL. Within the main project directory, create a folder called `flow` and create a file called `config.js`. This file will contain configuration information for FCL, such as what Access Node and wallet discovery endpoint to use (e.g. testnet or a local emulator). Add the following contents to the file:

**Note**: These values are required to use FCL with your app.

> **Create file:** `./flow/config.js`

```javascript ./flow/config.js
import { config } from '@onflow/fcl';

config({
  'accessNode.api': 'https://rest-testnet.onflow.org', // Mainnet: "https://rest-mainnet.onflow.org"
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Mainnet: "https://fcl-discovery.onflow.org/authn"
  'discovery.authn.endpoint':
    'https://fcl-discovery.onflow.org/api/testnet/authn', // Mainnet: "https://fcl-discovery.onflow.org/api/authn"
});
```

📣 **Tip**: It's recommend to replace these values with environment variables for easy deployments across different environments like development/production or Testnet/Mainnet.

- The `accessNode.api` key specifies the address of a Flow access node. Flow provides these, but in the future access to Flow may be provided by other 3rd parties, through their own access nodes.
- `discovery.wallet` and `discovery.authn.endpoint` are addresses that point to a service that lists FCL compatible wallets. Flow's FCL Discovery service is a service that FCL wallet providers can be added to, and be made 'discoverable' to any application that uses the `discovery.wallet` and `discovery.authn.endpoint`.

> Learn more about [configuring Discovery](../../../tools/clients/fcl-js/discovery.md) or [setting configuration values](../../../tools/clients/fcl-js/packages-docs/fcl/index.md#setting-configuration-values).

> If you are running a Wallet Discovery locally and want to use it in the React Native app, change `https://fcl-discovery.onflow.org/` to `http://<LOCAL_IP_ADDRESS>:<PORT>/`
> For Example:
> using local [Wallet Discovery](../../../tools/clients/fcl-js/discovery.md) and local [Dev Wallet](../../../tools/flow-dev-wallet/index.md):
>
> ```javascript ./flow/config.js
> import { config } from "@onflow/fcl";
>
> config({
>   ...
>   "discovery.wallet": "http://10.0.0.1:3002/local/authn",
>   "discovery.authn.endpoint": "http://10.0.0.1:3002/api/local/authn",
>   ...
> })
> ```

The main screen for React Native apps is located in `./App.js` or in `./App.tsx`. So let's finish configuring our dapp by going in the root directory and importing the config file into the top of our `App.js` file. We'll then swap out the default component in `App.js` to look like this:

> **Replace file:** `./App.js`

```jsx ./App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './flow/config';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Now we're ready to start talking to Flow!

## Authentication

To authenticate a user, you'll need to render a `ServiceDiscovery` component provided by `fcl-react-native`. Alternatively you can build your own component using `useServiceDiscovery`.

Unauthenticate is as simple as calling `fcl.unauthenticate()`. Once authenticated, FCL sets an object called `fcl.currentUser` which exposes methods for watching changes in user data, signing transactions, and more.

Let's add in a few components and buttons buttons for sign up/login and also subscribe to changes on the `currentUser`. When the user is updated (which it will be after authentication), we'll set the user state in our component to reflect this. To demonstrate user authenticated sessions, we'll conditionally render a component based on if the user is or is not logged in.

This is what your file should look like now:

> **Replace file:** `./App.js`

```jsx ./App.js
import { Text, View, Button } from 'react-native';
import './flow/config';

import { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl/dist/fcl-react-native';

export default function App() {
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const AuthedState = () => {
    return (
      <View>
        <Text>Address: {user?.addr ?? 'No Address'}</Text>
        <Button onPress={fcl.unauthenticate} title="Log Out" />
      </View>
    );
  };

  if (user.loggedIn) {
    return (
      <View style={styles.container}>
        <Text>Flow App</Text>
        <AuthedState />
        <StatusBar style="auto" />
      </View>
    );
  }

  return <fcl.ServiceDiscovery fcl={fcl} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

You should now be able to log in or sign up a user and unauthenticate them. Upon logging in or signing up your users will see a popup where they can choose between wallet providers. Let's select the [Blocto wallet](https://blocto.portto.io/) for this example to create an account. Upon completing authentication, you'll see the component change and the user's wallet address appear on the screen if you've completed this properly.

## Querying the Blockchain

One of the main things you'll often need to do when building a dapp is query the Flow blockchain and the smart contracts deployed on it for data. Since smart contracts will live on both Testnet and Mainnet, let's put the account address where the smart contract lives into the configuration (remember, it's recommended that you change this later to use environment variables). Let's also give it a key of `Profile` and prefix it with `0x` so that the final key is `0xProfile`. The prefix is important because it tells FCL to pull the corresponding addresses needed from the configuration value.

> **Replace file:** `./flow/config.js`

```javascript ./flow/config.js
import { config } from '@onflow/fcl';

config({
  'accessNode.api': 'https://rest-testnet.onflow.org', // Mainnet: "https://rest-mainnet.onflow.org"
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Mainnet: "https://fcl-discovery.onflow.org/authn"
  'discovery.authn.endpoint':
    'https://fcl-discovery.onflow.org/api/testnet/authn',
  '0xProfile': '0xba1132bc08f82fe2', // The account address where the Profile smart contract lives on Testnet
});
```

If you want to see the on chain smart contract we'll be speaking with next, you can view the [Profile Contract](https://testnet.flowdiver.io/contract/A.ba1132bc08f82fe2.Profile) source code but again for this tutorial it's not necessary you understand it.

**First, lets query the contract to see what the user's profile name is.**

A few things need to happen in order to do that:

1. We need to import the contract and pass it the user's account address as an argument.
2. Execute the script using `fcl.query`.
3. Set the result of the script to the app state in React so we can display the profile name in our browser.
4. Display "No Profile" if one was not found.

Take a look at the new code. We'll explain each new piece as we go. Remember, the cadence code is a separate language from JavaScript used to write smart contracts, so you don't need to spend too much time trying to understand it. (Of course, you're more than welcome to, if you want to!)

> **Replace file:** `./App.js`

```jsx ./App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import './flow/config';

import * as fcl from '@onflow/fcl/dist/fcl-react-native';

export default function App() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState(''); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  // NEW
  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        access(all) fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    setName(profile?.name ?? 'No Profile');
  };

  const AuthedState = () => {
    return (
      <View>
        <Text>Address: {user?.addr ?? 'No Address'}</Text>
        {/* NEW */}
        <Text>Profile Name: {name ?? '--'}</Text>
        {/* NEW */}
        <Button onPress={sendQuery} title="Send Query" />
        {/* NEW */}
        <Button onPress={fcl.unauthenticate} title="Log Out" />
      </View>
    );
  };

  if (user.loggedIn) {
    return (
      <View style={styles.container}>
        <Text>Flow App</Text>
        <AuthedState />
        <StatusBar style="auto" />
      </View>
    );
  }

  return <fcl.ServiceDiscovery fcl={fcl} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

A few things happened. In our `AuthedState` component, we added a button to send a query for the user's profile name and a `Text` to display the result above it. The corresponding `useState` initialization can be seen at the top of the component.

The other thing we did is build out the actual query inside of `sendQuery` method. Let's take a look at it more closely:

```javascript
await fcl.query({
  cadence: `
    import Profile from 0xProfile

    access(all) fun main(address: Address): Profile.ReadOnly? {
      return Profile.read(address)
    }
  `,
  args: (arg, t) => [arg(user.addr, t.Address)],
});
```

Inside the query you'll see we set two things: `cadence` and `args`. Cadence is Flow's smart contract language we mentioned. For this tutorial, when you look at it you just need to notice that it's importing the `Profile` contract from the account we named `0xProfile` earlier in our config file, then also taking an account address, and reading it. That's it until you're ready to [learn more Cadence](https://cadence-lang.org/docs).

In the `args` section, we are simply passing it our user's account address from the user we set in state after authentication and giving it a type of `Address`. For more possible types, [see this reference](../../../tools/clients/fcl-js/packages-docs/types/index.md).

Go ahead and click the "Send Query" button. You should see "No Profile." That's because we haven't initialized the account yet.

## Initializing an Account

For the Profile contract to store a Profile in a user's account, it does so by initializing what is called a "resource." A resource is an ownable piece of data and functionality that can live in the user's account storage. This paradigm is known is as "resource-oriented-programming", a principle that is core to Cadence and differentiates its ownership model from other smart contract languages, [read more here](https://cadence-lang.org/docs/#intuiting-ownership-with-resources). Cadence makes it so that resources can only exist in one place at any time, they must be deliberately created, cannot be copied, and if desired, must be deliberately destroyed.

> There's a lot more to resources in Cadence than we'll cover in this guide, so if you'd like to know more, check out [this Cadence intro](https://cadence-lang.org/docs).

To do this resource initialization on an account, we're going to add another function called `initAccount`. Inside of that function, we're going to add some Cadence code which says, _"Hey, does this account have a profile? If it doesn't, let's add one."_ We do that using something called a "transaction." Transactions occur when you want to change the state of the blockchain, in this case, some data in a resource, in a specific account. And there is a cost (transaction fee) in order to do that; unlike a query.

That's where we jump back into FCL code. Instead of `query`, we use `mutate` for transactions. And because there is a cost, we need to add a few fields that tell Flow who is proposing the transaction, who is authorizing it, who is paying for it, and how much they're willing to pay for it. Those fields — not surprisingly — are called: `proposer`, `authorizer`, `payer`, and `limit`. For more information on these signatory roles, check out [this doc](../../basics/transactions.md#signer-roles).

Let's take a look at what our account initialization function looks like:

```javascript
const initAccount = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
      import Profile from 0xProfile

      transaction {
        prepare(account: auth(Storage, Capabilities) &Account) {
          // Only initialize the account if it hasn't already been initialized
          if (!Profile.check(account.address)) {
            // This creates and stores the profile in the user's account
            account.storage.save(<- Profile.new(), to: Profile.privatePath)

            // This creates the public capability that lets applications read the profile's info
            let newCap = account.capabilities.storage.issue<&Profile.Base>(Profile.privatePath)

            account.capabilities.publish(newCap, at: Profile.publicPath)
          }
        }
      }
    `,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });

  const transaction = await fcl.tx(transactionId).onceExecuted();
  console.log(transaction);
};
```

You can see the new fields we talked about. You'll also notice `fcl.authz`. That's shorthand for "use the current user to authorize this transaction", (you could also write it as `fcl.currentUser.authorization`). If you want to learn more about transactions and signing transactions, you can [view the docs here](../../basics/transactions.md). For this example, we'll keep it simple with the user being each of these roles.

You'll also notice we are awaiting a response with our transaction data by using the syntax `fcl.tx(transactionId).onceExecuted()`. This will return when the transaction has been executed by an execution node ("soft-finality"). If you want to wait until the transaction is sealed ("hard-finality"), you can use `onceSealed()` instead.

To learn more about the transaction lifecycle, check out [this doc](../../basics/transactions.md#transaction-lifecycle).

Now your `index.js` file should look like this (we also added a button for calling the `initAccount` function in the `AuthedState`):

> **Replace file:** `./App.js`

```jsx ./App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import './flow/config';

import * as fcl from '@onflow/fcl/dist/fcl-react-native';

export default function App() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState('');

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        access(all) fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    setName(profile?.name ?? 'No Profile');
  };

  // NEW
  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
  
        transaction {
          prepare(account: auth(Storage, Capabilities) &Account) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.storage.save(<- Profile.new(), to: Profile.privatePath)
  
              // This creates the public capability that lets applications read the profile's info
              let newCap = account.capabilities.storage.issue<&Profile.Base>(Profile.privatePath)

              account.capabilities.publish(newCap, at: Profile.publicPath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    const transaction = await fcl.tx(transactionId).onceExecuted();
    console.log(transaction);
  };

  const AuthedState = () => {
    return (
      <View>
        <Text>Address: {user?.addr ?? 'No Address'}</Text>
        <Text>Profile Name: {name ?? '--'}</Text>
        <Button onPress={sendQuery} title="Send Query" />
        <Button onPress={initAccount} title="Init Account" />
        {/* NEW */}
        <Button onPress={fcl.unauthenticate} title="Log Out" />
      </View>
    );
  };

  if (user.loggedIn) {
    return (
      <View style={styles.container}>
        <Text>Flow App</Text>
        <AuthedState />
        <StatusBar style="auto" />
      </View>
    );
  }

  return <fcl.ServiceDiscovery fcl={fcl} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Press the "Init Account" button you should see the wallet ask you to approve a transaction. After approving, you will see a transaction response appear in your console (make sure to have that open). It may take a few moments. With the transaction result printed, you can use the `transactionId` to look up the details of the transaction using a [block explorer](https://testnet.flowscan.io/).

## Mutating the Blockchain

Now that we have the profile initialized, we are going to want to mutate it some more. In this example, we'll use the same smart contract provided to change the profile name.

To do that, we are going to write another transaction that adds some Cadence code which lets us set the name. Everything else looks the same in the following code except for one thing: we'll subscribe to the status changes instead of waiting for it to be sealed after the mutate function returns.

It looks like this:

```javascript
const executeTransaction = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
      import Profile from 0xProfile

      transaction(name: String) {
        prepare(account: auth(BorrowValue) &Account) {
            let profileRef = account.borrow<&Profile.Base>(from: Profile.privatePath)
                ?? panic("The signer does not store a Profile.Base object at the path "
                        .concat(Profile.privatePath.toString())
                        .concat(". The signer must initialize their account with this object first!"))

            profileRef.setName(name)
        }
      }
    `,
    args: (arg, t) => [arg('Flow Developer', t.String)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });

  fcl.tx(transactionId).subscribe((res) => setTransactionStatus(res.status));
};
```

Here you can see our argument is "Flow Developer" and at the bottom we've called the `subscribe` method instead of `onceExecuted`.

Let's see how that works inside our whole `index.js` file. But, let's also set the statuses to our React component's state so we can see on screen what state we're in.

> **Replace file:** `./App.js`

```jsx ./App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import './flow/config';

import * as fcl from '@onflow/fcl/dist/fcl-react-native';

export default function App() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        access(all) fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    setName(profile?.name ?? 'No Profile');
  };

  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
  
        transaction {
          prepare(account: auth(Storage, Capabilities) &Account) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.storage.save(<- Profile.new(), to: Profile.storagePath)
  
              // This creates the public capability that lets applications read the profile's info
              let newCap = account.capabilities.storage.issue<&Profile.Base>(Profile.privatePath)

              account.capabilities.publish(newCap, at: Profile.publicPath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    const transaction = await fcl.tx(transactionId).onceExecuted();
    console.log(transaction);
  };

  // NEW
  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
  
        transaction(name: String) {
          prepare(account: auth(BorrowValue) &Account) {
            let profileRef = account.storage.borrow<&Profile.Base>(from: Profile.privatePath)
                ?? panic("The signer does not store a Profile.Base object at the path "
                        .concat(Profile.privatePath.toString())
                        .concat(". The signer must initialize their account with this object first!"))
                        
            profileRef.setName(name)
          }
        }
      `,
      args: (arg, t) => [arg('Flow Developer', t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    fcl.tx(transactionId).subscribe((res) => setTransactionStatus(res.status));
  };

  const AuthedState = () => {
    return (
      <View>
        <Text>Address: {user?.addr ?? 'No Address'}</Text>
        <Text>Profile Name: {name ?? '--'}</Text>
        <Text>Transaction Status: {transactionStatus ?? '--'}</Text>
        {/* NEW */}
        <Button onPress={sendQuery} title="Send Query" />
        <Button onPress={initAccount} title="Init Account" />
        {/* NEW */}
        <Button onPress={executeTransaction} title="Execute Transaction" />
        {/* NEW */}
        <Button onPress={fcl.unauthenticate} title="Log Out" />
      </View>
    );
  };

  if (user.loggedIn) {
    return (
      <View style={styles.container}>
        <Text>Flow App</Text>
        <AuthedState />
        <StatusBar style="auto" />
      </View>
    );
  }

  return <fcl.ServiceDiscovery fcl={fcl} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Now if you click the "Execute Transaction" button you'll see the statuses update next to "Transaction Status." When you see "4" that means it's sealed! Status code meanings [can be found here](../../../tools/clients/fcl-js/packages-docs/types/index.md).
If you query the account profile again, "Profile Name:" should now display "Flow Developer".

That's it! You now have a shippable Flow dapp that can auth, query, init accounts, and mutate the chain. This is just the beginning. There is so much more to know. We have a lot more resources to help you build. To dive deeper, here are a few good places for taking the next steps:

**Cadence**

- [Cadence Playground Tutorials](https://cadence-lang.org/docs/tutorial/first-steps)
- [Cadence Hello World Video](https://www.youtube.com/watch?v=pRz7EzrWchs)
- [Why Cadence?](https://www.flow.com/post/flow-blockchain-cadence-programming-language-resources-assets)

**Full Stack NFT Marketplace Example**

- [Beginner Example: CryptoDappy](https://github.com/bebner/crypto-dappy)

**More FCL**

- [More on Scripts](../../../tools/clients/fcl-js/scripts.md)
- [More on Transactions](../../../tools/clients/fcl-js/transactions.md)
- [User Signatures](../../../tools/clients/fcl-js/user-signatures.md)
- [Proving Account Ownership](../../../tools/clients/fcl-js/proving-authentication.mdx)
