---
title: React Native Development
sidebar_label: React Native Development
sidebar_position: 2
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

# React Negative Development

**Last Updated:** January 11th 2022

:::info

This page will walk you through a very bare bones project to get started building a web3 dapp with the Flow Client Library (FCL). If you want a clonable repo, Flow community members created quickstart templates for different JavaScript frameworks (for example, [Next.js], [SvelteKit], [Nuxt]. You can consult the complete list [here].

:::

FCL-JS is the easiest way to start to build decentralized applications. Flow Client Library (FCL) wraps much of the logic you'd have to write yourself on other blockchains. Follow this quick start and you'll have a solid overview of how to build a shippable dapp on Flow.

We're going to make an assumption that you know or understand React; however, the concepts should be easy to understand and transfer to another framework. While this tutorial uses Cadence (Flow's smart contract language), you do not need to know it. Instead, we recommend that you later [learn the Cadence language] after you've gotten the core FCL concepts down.

In this tutorial, we are going to interact with an current smart contract on Flow's testnet known as the [Profile Contract]. With this contract, we will create a new profile and edit the profile information, both via a wallet. To do this, the FCL concepts we'll cover are:

- [Installation]
- [Configuration]
- [Authentication]
- [Query the Blockchain]
- [Initialize an Account]
- [Mutate the Blockchain]

If you ever have any questions, we're always happy to help on [Discord](https://discord.gg/flowblockchain). There are also links at the end of this article for diving deeper into how to build on Flow.

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

Now run the app with the following command in your terminal.

```sh
npm run start
```

Your app is now running.

## Configuration

Now that your app is running, you can configure FCL. Within the main project directory, create a folder called `flow` and create a file called `config.js`. This file contains configuration information for FCL, such as what Access Node and wallet discovery endpoint to use (such as testnet or a local emulator). Add the following contents to the file:

:::info 

These values are required to use FCL with your app.

:::

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

📣 **Tip**: We recommend that you replace these values with environment variables for easy deployments across different environments like development/production or Testnet/Mainnet.

- The `accessNode.api` key specifies the address of a Flow access node. Flow provides these, but in the future, third parties ay provide access to Flow through their own access nodes.
- `discovery.wallet` and `discovery.authn.endpoint` are addresses that point to a service that lists FCL compatible wallets. Flow's FCL Discovery service is a service that FCL wallet providers can be added to, and be made 'discoverable' to any application that uses the `discovery.wallet` and `discovery.authn.endpoint`.

> Learn more about [how to configure Discovery] or [how to set configuration values].

> If you run a Wallet Discovery locally and want to use it in the React Native app, change `https://fcl-discovery.onflow.org/` to `http://<LOCAL_IP_ADDRESS>:<PORT>/`
> For Example:
> use local [Wallet Discovery] and local [Dev Wallet]:
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

The main screen for React Native apps is located in `./App.js` or in `./App.tsx`. So, to finish configuring our dApp, let's go into the root directory and import the config file into the top of our `App.js` file. We'll then swap out the default component in `App.js` to look like this:

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

Now we're ready to talk to Flow!

## Authentication

To authenticate a user, you'll need to render a `ServiceDiscovery` component provided by `fcl-react-native`. Alternatively, you can build your own component with `useServiceDiscovery`.

To unauthenticate, you can simply call `fcl.unauthenticate()`. After you're authenticated, FCL sets an object called `fcl.currentUser` which exposes methods to watch for changes in user data, signing transactions, and more.

Let's add in a few components and buttons for sign up, login, and to subscribe to changes on the `currentUser`. When the user updates (which happens after authentication), we'll set the user state in our component to reflect this. To demonstrate user authenticated sessions, we'll conditionally render a component based on if the user is or is not logged in.

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

You can now log in or sign up a user and unauthenticate them. After your users log in or sign up, they'll see a popup where they can choose between wallet providers. Let's select the [Blocto wallet] for this example to create an account. After you authenticate, you'll see the component change and the user's wallet address appear if you've completed this properly.

## Query the blockchain

One of the main things you'll often need to do when you build a dApp is query the Flow blockchain and the smart contracts deployed on it for data. Since smart contracts will live on both testnet and mainnet, let's put the account address where the smart contract lives into the configuration (remember, we recommend that you change this later to use environment variables). Let's also give it a key of `Profile` and prefix it with `0x` so that the final key is `0xProfile`. The prefix is important because it tells FCL to pull the corresponding addresses needed from the configuration value.

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

If you want to see the on chain smart contract that we'll speak with next, you can view the [Profile Contract] source code but again, for this tutorial, it's not necessary you understand it.

**First, lets query the contract to see what the user's profile name is.**

A few things need to happen to do that:

1. We need to import the contract and pass it the user's account address as an argument.
2. Execute the script with `fcl.query`.
3. Set the result of the script to the app state in React so we can display the profile name in our browser.
4. Display "No Profile" if one wasn't found.

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

A few things happened. In our `AuthedState` component, we added a button to send a query for the user's profile name and a `Text` to display the result above it. The corresponding `useState` initialization appears at the top of the component.

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

Inside the query, you'll see we set two things: `cadence` and `args`. Cadence is Flow's smart contract language we mentioned. For this tutorial, when you look at it, you just need to notice that it imports the `Profile` contract from the account we named `0xProfile` earlier in our config file, then also takies an account address, and reads it. That's it until you're ready to [learn more Cadence].

In the `args` section, we simply pass it our user's account address from the user we set in state after authentication and give it a type of `Address`. For more possible types, [see this reference].

Go ahead and click "Send Query". You will see "No Profile." That's because we haven't initialized the account yet.

## Initialize an account

For the Profile contract to store a Profile in a user's account, it initializes what is called a "resource." A resource is an ownable piece of data and functionality that can live in the user's account storage. This paradigm is known is as "resource-oriented-programming", a principle that is core to Cadence and differentiates its ownership model from other smart contract languages, [read more here]. Cadence makes it so that resources can only exist in one place at any time, they must be deliberately created, cannot be copied, and if desired, must be deliberately destroyed.

> There's a lot more to resources in Cadence than we'll cover in this guide, so if you'd like to know more, check out [this Cadence intro].

To do this resource initialization on an account, we'll add another function called `initAccount`. Inside of that function, we'll add some Cadence code which says, _"Hey, does this account have a profile? If it doesn't, let's add one."_ We do that with something called a "transaction." Transactions occur when you want to change the state of the blockchain, in this case, some data in a resource, in a specific account. And there is a cost (transaction fee) in order to do that; unlike a query.

That's where we jump back into FCL code. Instead of `query`, we use `mutate` for transactions. And because there is a cost, we need to add a few fields that tell Flow who proposes the transaction, who authorizes it, who pays for it, and how much they want to pay for it. Those fields — not surprisingly — are called: `proposer`, `authorizer`, `payer`, and `limit`. For more information on these signatory roles, check out this [signer roles] doc. 

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

You can see the new fields we talked about. You'll also notice `fcl.authz`. That's shorthand for "use the current user to authorize this transaction", (you could also write it as `fcl.currentUser.authorization`). If you want to learn more about transactions and signing transactions, you can [view the docs here]. For this example, we'll keep it simple with the user as each of these roles.

You'll also notice that we await a response with our transaction data with the syntax `fcl.tx(transactionId).onceExecuted()`. This returns when an execution node completes the transaction ("soft-finality"). If you want to wait until the transaction is sealed ("hard-finality"), you can use `onceSealed()` instead.

To learn more about the transaction lifecycle, check out [this doc].

Now your `index.js` file looks like this (we also added a button to call the `initAccount` function in the `AuthedState`):

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

Press "Init Account," and the wallet asks you to approve a transaction. After you approve it, you will see a transaction response appear in your console (make sure to have that open). It may take a few moments. With the transaction result printed, you can use the `transactionId` to look up the details of the transaction with a [block explorer].

## Mutate the blockchain

Now that we have the profile initialized, we are going to want to mutate it some more. In this example, we'll use the same smart contract provided to change the profile name.

To do that, we will write another transaction that adds some Cadence code which lets us set the name. Everything else looks the same in the following code except for one thing: we'll subscribe to the status changes instead of waiting for it to be sealed after the mutate function returns.

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

Now if you click "Execute Transaction," you'll see the statuses update next to "Transaction Status." When you see "4" that means it's sealed! Status code meanings [can be found here].

If you query the account profile again, "Profile Name:" will now display "Flow Developer".

That's it! You now have a shippable Flow dapp that can auth, query, init accounts, and mutate the chain. This is just the beginning. There is so much more to know. We have a lot more resources to help you build. To dive deeper, here are a few good places to take the next steps:

**Cadence**

- [Cadence Playground Tutorials]
- [Cadence Hello World Video]
- [Why Cadence?]

**Full Stack NFT Marketplace Example**

- [Beginner Example: CryptoDappy]

**More FCL**

- [More on Scripts]
- [More on Transactions]
- [User Signatures]
- [Proving Account Ownership]


<!-- Reference-style links, will not render on page -->

[Next.js]: https://github.com/muttoni/fcl-nextjs-quickstart
[SvelteKit]: https://github.com/muttoni/fcl-sveltekit-quickstart 
[Nuxt]: https://github.com/bluesign/nuxt3-fcl. 
[here]: https://github.com/ph0ph0/Get-The-Flow-Down#fcl
[Cadence Playground Tutorials]: https://cadence-lang.org/docs/tutorial/first-steps
[Cadence Hello World Video]: https://www.youtube.com/watch?v=pRz7EzrWchs
[Why Cadence?]: https://www.flow.com/post/flow-blockchain-cadence-programming-language-resources-assets
[Beginner Example: CryptoDappy]: https://github.com/bebner/crypto-dappy
[More on Scripts]: ../../../build/tools/clients/fcl-js/scripts.md
[More on Transactions]: ../../../build/tools/clients/fcl-js/transactions.md
[User Signatures]: ../../../build/tools/clients/fcl-js/user-signatures.md
[Proving Account Ownership]: ../../../build/tools/clients/fcl-js/proving-authentication.mdx
[can be found here]: ../../../build/tools/clients/fcl-js/packages-docs/types/index.md
[block explorer]: https://testnet.flowscan.io/
[this doc]: ../../../build/cadence/basics/transactions.md#transaction-lifecycle
[view the docs here]: ../../../build/cadence/basics/transactions.md
[signer roles]: ../../../build/cadence/basics/transactions.md#signer-roles
[this Cadence intro]: https://cadence-lang.org/docs
[read more here]: https://cadence-lang.org/docs/#intuiting-ownership-with-resources
[learn more Cadence]: https://cadence-lang.org/docs
[see this reference]: ../../../build/tools/clients/fcl-js/packages-docs/types/index.md
[Profile Contract]: https://testnet.flowdiver.io/contract/A.ba1132bc08f82fe2.Profile
[Blocto wallet]: https://blocto.portto.io/
[Wallet Discovery]: ../../../build/tools/clients/fcl-js/discovery.md
[Dev Wallet]: ../../../build/tools/flow-dev-wallet/index.md
[how to configure Discovery]: ../../../build/tools/clients/fcl-js/discovery.md
[how to set configuration values]: ../../../build/tools/clients/fcl-js/packages-docs/fcl/index.md#setting-configuration-values
[learn the Cadence language]: https://cadence-lang.org/docs/language/
[Profile Contract]: https://testnet.flowdiver.io/contract/A.ba1132bc08f82fe2.Profile 
[Installation]: #installation
[Configuration]: #configuration
[Authentication]: #authentication
[Query the Blockchain]: #query-the-blockchain
[Initialize an Account]: #initialize-an-account
[Mutate the Blockchain]: #mutate-the-blockchain
[Discord]: https://discord.gg/flowblockchain 
[create-expo-app]: https://docs.expo.dev/get-started/create-a-project/
