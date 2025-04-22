---
title: Build a Walletless Mobile App (PWA)
sidebar_label: Build a Walletless Mobile App (PWA)
sidebar_position: 2
description: Learn how to create a Progressive Web App (PWA) on Flow blockchain with walletless onboarding. Build accessible mobile dApps using Magic integration, account linking, and hybrid custody features.
keywords:
  - PWA
  - walletless onboarding
  - Magic integration
  - mobile dApp
  - progressive web app
  - Flow blockchain
  - hybrid custody
  - account linking
  - mobile development
  - web3 onboarding
  - blockchain PWA
  - mobile authentication
  - Magic SDK
  - Flow mobile
  - user experience
---

# Overview

In this tutorial, we delve into the intricacies of crafting an accessible Progressive Web App (PWA) on the Flow blockchain, tackling the challenge of mobile mainstream accessibility in web3. Recognizing the complexity of current onboarding processes, we will guide you through a streamlined approach, featuring a seamless walletless mobile login to alleviate the often daunting task for new users.

### Understanding Progressive Web Apps (PWAs)

Progressive Web Apps (PWAs) have garnered attention recently, with platforms like [friend.tech](http://friend.tech/) leading the way in popularity. PWAs blur the lines between web pages and mobile applications, offering an immersive, app-like experience directly from your browser. You can easily add a shortcut to your home screen, and the PWA operates just like a native application would. Beyond these capabilities, PWAs also boast offline functionality and support for push notifications, among many [other features](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).

### ****Exploring Walletless Onboarding****

Walletless onboarding is a groundbreaking feature that enables users to securely interact with decentralized applications (dApps) in a matter of seconds, all without the traditional necessity of creating a blockchain wallet. This method effectively simplifies the user experience, abstracting the complexities of blockchain technology to facilitate swift and straightforward app access. For a deeper dive into walletless onboarding and its integration with Flow, feel free to explore the following resource: [Flow Magic Integration](https://flow.com/post/flow-magic-integration).

# Detailed Steps

To effectively follow this tutorial, the developer requires a few essential libraries and integrations. Additionally, there is a ready-made flow scaffold called [FCL PWA](https://github.com/bshahid331/flow-pwa-scaffold) that contains the completed tutorial code, providing a solid foundation for you to build your Progressive Web App (PWA)!

## **Dependencies**

1. **Magic Account**: Start by setting up an app on magic.link, during which you will obtain an API key crucial for further steps.
2. **Magic SDK**: Essential for integrating Magic's functionality in your project, and can be found [here](https://www.npmjs.com/package/magic-sdk).
3. **Magic Flow SDK**: This SDK enables Magic's integration with Flow. You can install it from [this link](https://www.npmjs.com/package/@magic-ext/flow/v/13.3.0).
4. **Flow Client Library ([FCL](https://developers.flow.com/tooling/fcl-js))**: As the JavaScript SDK for the Flow blockchain, FCL allows developers to create applications that seamlessly interact with the Flow blockchain and its smart contracts.
5. **React**: Our project will be built using the React framework.

### ****Setting up PWA and Testing Locally****

Initiate the creation of a new React app, opting for the PWA template with the following command:

```bash
npx create-react-app name-of-our-PWA-app --template cra-template-pwa
```

Ensure that **`serviceWorkerRegistration.register()`** in **`index.js`** is appropriately configured to support offline capabilities of your PWA.

Proceed to build your application using your preferred build tool. In this example, we will use Yarn:

```bash
yarn run build
```

Following the build, you can serve your application locally using:

```bash
npx serve -s build
```

To thoroughly test your PWA, especially on a mobile device, it's highly recommended to use a tool like **`ngrok`**. Start **`ngrok`** and point it to the local port your application is running on:

```bash
ngrok http 3000
```

Grab the generated link, and you can now access and test your PWA directly on your mobile device!
 

You can now grab the link and go to it on your mobile device to test the PWA!

### Integrating with Magic

Proceed to install the Magic-related dependencies in your project. Ensure you add your Magic app's key as an environment variable for secure access:

```bash
yarn add magic-sdk @magic-ext/flow @onflow/fcl

```

Let's create a helper file, **`magic.js`**, to manage our Magic extension setup. Ensure that your environment variable with the Magic API key is correctly set before proceeding.

```js
<!-- Import: { Magic } from "magic-sdk" -->
<!-- Import: { FlowExtension } from "@magic-ext/flow" -->

const magic = new Magic(process.env.REACT_APP_MAGIC_KEY, {
  extensions: [
    new FlowExtension({
      rpcUrl: "https://rest-testnet.onflow.org",
      network: "testnet",
    }),
  ],
});

export default magic;
```

Anytime you need to interface with chain you will use this magic instance.

### ****React Context and Provider for User Data****

**`currentUserContext.js`**

This file creates a React context that will be used to share the current user's data across your application.

**React Context**: It is created using **`React.createContext()`** which provides a way to pass data through the component tree without having to pass props down manually at every level.

```js
<!-- Import: React from "react" -->

const CurrentUserContext = React.createContext();

export default CurrentUserContext;
```

**`currentUserProvider.js`**

This file defines a React provider component that uses the context created above. This provider component will wrap around your application's components, allowing them to access the current user's data.

- **useState**: To create state variables for storing the current user's data and the loading status.
- **useEffect**: To fetch the user's data from Magic when the component mounts.
- **magic.user.isLoggedIn**: Checks if a user is logged in.
- **magic.user.getMetadata**: Fetches the user's metadata.

```js
<!-- Import: React, { useState, useEffect } from "react" -->
<!-- Import: CurrentUserContext from "./currentUserContext" -->
<!-- Import: magic from "./magic" --> // You should have this from the previous part of the tutorial

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userStatusLoading, setUserStatusLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserStatusLoading(true);
        const magicIsLoggedIn = await magic.user.isLoggedIn();
        if (magicIsLoggedIn) {
          const metaData = await magic.user.getMetadata();
          setCurrentUser(metaData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserStatusLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, userStatusLoading }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
```

### **Logging in the User**

This part shows how to log in a user using Magic's SMS authentication.

- **magic.auth.loginWithSMS**: A function provided by Magic to authenticate users using their phone number.
- **setCurrentUser**: Updates the user's data in the context.

```js
<!-- Import: magic from "./magic" -->

const login = async (phoneNumber) => {
    if(!phoneNumber) {
      return;
    }
    
    await magic.auth.loginWithSMS({ phoneNumber });
    
    const metaData = await magic.user.getMetadata();
    setCurrentUser(metaData);
};
```

### **Scripts/Transactions with Flow**

This example shows how to interact with the Flow blockchain using FCL and Magic for authorization.

- **fcl.send**: A function provided by FCL to send transactions or scripts to the Flow blockchain.
- **AUTHORIZATION_FUNCTION**: The authorization function provided by Magic for signing transactions.

```js
<!-- Import: * as fcl from "@onflow/fcl" -->
<!-- Import: magic from "./magic" -->

fcl.config({
  "flow.network": "testnet",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": `https://fcl-discovery.onflow.org/testnet/authn`,
})

const AUTHORIZATION_FUNCTION = magic.flow.authorization;

const transactionExample = async (currentUser) => {
  const response = await fcl.send([
    fcl.transaction`
      // Your Cadence code here
    `,
    fcl.args([
      fcl.arg(currentUser.publicAddress, fcl.types.Address),
    ]),
    fcl.proposer(AUTHORIZATION_FUNCTION),
    fcl.authorizations([AUTHORIZATION_FUNCTION]),
    fcl.payer(AUTHORIZATION_FUNCTION),
    fcl.limit(9999),
  ]);
  const transactionData = await fcl.tx(response).onceExecuted();
};
```

### ****Account Linking with Flow****

Now we can unlock the real power of Flow. Lets say you have another Flow account and you want to link the "magic" account as a child account so that you can take full custody of whatever is in the magic account you can do this via Hybird Custody.

You can view the hybrid custody repo and contracts here: https://github.com/onflow/hybrid-custody

We will maintain two accounts within the app. The child(magic) account form earlier and new non custodial FCL flow account. I won't go over how to log in with FCL here and use it but you can do the normal process to obtain the parent account.

One you have the parent account and child(magic) account logged in you can link the account by using the following transaction.

```cadence
#allowAccountLinking

import HybridCustody from 0x294e44e1ec6993c6

import CapabilityFactory from 0x294e44e1ec6993c6
import CapabilityDelegator from 0x294e44e1ec6993c6
import CapabilityFilter from 0x294e44e1ec6993c6

import MetadataViews from 0x631e88ae7f1d7c20

transaction(parentFilterAddress: Address?, childAccountFactoryAddress: Address, childAccountFilterAddress: Address) {
  prepare(childAcct: AuthAccount, parentAcct: AuthAccount) {
      // --------------------- Begin setup of child account ---------------------
      var acctCap = childAcct.getCapability<&AuthAccount>(HybridCustody.LinkedAccountPrivatePath)
      if !acctCap.check() {
          acctCap = childAcct.linkAccount(HybridCustody.LinkedAccountPrivatePath)!
      }

      if childAcct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
          let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
          childAcct.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)
      }

      // check that paths are all configured properly
      childAcct.unlink(HybridCustody.OwnedAccountPrivatePath)
      childAcct.link<&HybridCustody.OwnedAccount{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, MetadataViews.Resolver}>(HybridCustody.OwnedAccountPrivatePath, target: HybridCustody.OwnedAccountStoragePath)

      childAcct.unlink(HybridCustody.OwnedAccountPublicPath)
      childAcct.link<&HybridCustody.OwnedAccount{HybridCustody.OwnedAccountPublic, MetadataViews.Resolver}>(HybridCustody.OwnedAccountPublicPath, target: HybridCustody.OwnedAccountStoragePath)
      // --------------------- End setup of child account ---------------------

      // --------------------- Begin setup of parent account ---------------------
      var filter: Capability<&{CapabilityFilter.Filter}>? = nil
      if parentFilterAddress != nil {
          filter = getAccount(parentFilterAddress!).getCapability<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
      }

      if parentAcct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
          let m <- HybridCustody.createManager(filter: filter)
          parentAcct.save(<- m, to: HybridCustody.ManagerStoragePath)
      }

      parentAcct.unlink(HybridCustody.ManagerPublicPath)
      parentAcct.unlink(HybridCustody.ManagerPrivatePath)

      parentAcct.link<&HybridCustody.Manager{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.OwnedAccountPrivatePath, target: HybridCustody.ManagerStoragePath)
      parentAcct.link<&HybridCustody.Manager{HybridCustody.ManagerPublic}>(HybridCustody.ManagerPublicPath, target: HybridCustody.ManagerStoragePath)
      // --------------------- End setup of parent account ---------------------

      // Publish account to parent
      let owned = childAcct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
          ?? panic("owned account not found")

      let factory = getAccount(childAccountFactoryAddress).getCapability<&CapabilityFactory.Manager{CapabilityFactory.Getter}>(CapabilityFactory.PublicPath)
      assert(factory.check(), message: "factory address is not configured properly")

      let filterForChild = getAccount(childAccountFilterAddress).getCapability<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
      assert(filterForChild.check(), message: "capability filter is not configured properly")

      owned.publishToParent(parentAddress: parentAcct.address, factory: factory, filter: filterForChild)

      // claim the account on the parent
      let inboxName = HybridCustody.getChildAccountIdentifier(parentAcct.address)
      let cap = parentAcct.inbox.claim<&HybridCustody.ChildAccount{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, MetadataViews.Resolver}>(inboxName, provider: childAcct.address)
          ?? panic("child account cap not found")

      let manager = parentAcct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
          ?? panic("manager no found")

      manager.addAccount(cap: cap)
  }
}
```

:::note 
For the sake of this example, well use some pre defined factory and filter implementations. You can find them on the repo but on testnet we can use 0x1055970ee34ef4dc and 0xe2664be06bb0fe62 for the factory and filter address respectively. 0x1055970ee34ef4dc provides NFT capabilities and 0xe2664be06bb0fe62 which is the AllowAllFilter. These generalized implementations likely cover most use cases, but you'll want to weigh the decision to use them according to your risk tolerance and specific scenario
:::

Now, for viewing all parent accounts linked to a child account and removing a linked account, you can follow similar patterns, using Cadence scripts and transactions as required.

```cadence
import HybridCustody from 0x294e44e1ec6993c6

access(all) fun main(child: Address): [Address] {
    let acct = getAuthAccount(child)
    let o = acct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)

    if o == nil {
      return []
    }

    return o!.getParentStatuses().keys
}
```

and finally to remove a linked account you can run the following cadence transaction

```js
await fcl.send([
    fcl.transaction`
    import HybridCustody from 0x294e44e1ec6993c6
    
    transaction(parent: Address) {
        prepare(acct: AuthAccount) {
            let owned = acct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
                ?? panic("owned not found")
    
            owned.removeParent(parent: parent)
    
            let manager = getAccount(parent).getCapability<&HybridCustody.Manager{HybridCustody.ManagerPublic}>(HybridCustody.ManagerPublicPath)
                .borrow() ?? panic("manager not found")
            let children = manager.getChildAddresses()
            assert(!children.contains(acct.address), message: "removed child is still in manager resource")
        }
    }
    `,
    fcl.args([fcl.arg(account, t.Address)]),
    fcl.proposer(AUTHORIZATION_FUNCTION),
    fcl.authorizations([AUTHORIZATION_FUNCTION]),
    fcl.payer(AUTHORIZATION_FUNCTION),
    fcl.limit(9999),
]);
```

# Video Guide

[![Video Title](resources/pwa_youtube_thumbnail.png)](https://www.youtube.com/watch?v=1ZmvfBFdCxY "Video Title")

# **Sample Flow PWA: Balloon Inflation Game**

## **Game Overview**

This PWA game revolves around inflating a virtual balloon, with a twist! The players engage with the balloon, witnessing its growth and color transformation, all while being cautious not to pop it. The ultimate goal is to mint the balloon's state as an NFT to commemorate their achievement.

You can view the game [here](https://flow-inflation.vercel.app/). Visit this on your mobile device(for iOS use Safari). 

The full code for this game can be found here: https://github.com/onflow/inflation

![pwa_prompt](resources/pwa_prompt.jpeg)

[![pwa_mint_balloon_thumbnail](resources/pwa_mint_balloon_thumbnail.png)](https://drive.google.com/file/d/15ojzoRTtTN6gQXVN3STMa3-JOZ0b6frw/view)

[![pwa_link_account_thumbnail](resources/pwa_link_account_thumbnail.png)](https://drive.google.com/file/d/1FZzoLmd5LLGBbO4enzk8LpV1Uwbgc-Ry/view)

### **Key Game Features:**

1. **Balloon Inflation**:
    - As the player inflates the balloon, it expands and changes color.
    - A hidden inflation threshold is set; surpassing this limit will result in the balloon bursting.
2. **NFT Minting**:
    - Satisfied with their balloon's size, players have the option to mint it into an NFT, creating a permanent token of their accomplishment.
3. **Balloon Collection**:
    - Post-minting, players can view and showcase their collection of balloon NFTs.
4. **Account Linking and Custody**:
    - Players initially interact with the game in a walletless fashion via Magic.
    - When ready to claim full ownership of their balloon NFTs, they can link their Magic account to a non-custodial FCL wallet of their choice.

## **Integration with Flow and Magic**

The entire game is crafted upon the previously discussed setup, ensuring a seamless and user-friendly experience.

### **Playing the Game:**

- **Walletless Interaction**: Users can jump right into the game, inflating the balloon and enjoying the gameplay without any blockchain wallet setup.
- **Inflation and Visuals**: The balloon's size and color change in real-time, providing instant visual feedback to the player.

### **Minting and Viewing NFTs:**

- **Magic Login for Minting**: To mint their balloon as an NFT, players log in using Magic, embracing a walletless experience.
- **Viewing NFT Collection**: Post-minting, players can easily access and view their collection of balloon NFTs.

### **Taking Custody with Account Linking:**

- **Secure Custody**: Players wishing to secure their balloon NFTs can utilize Account Linking to connect their Magic account to their personal non-custodial FCL wallet.
- **Full Ownership**: This step ensures that players have complete control and custody over their digital assets.

## **Conclusion**

The balloon inflation game stands as a testament to the seamless integration of Flow, Magic, and PWA technology, creating a user-friendly blockchain game that is accessible, engaging, and secure. Players can enjoy the game, mint NFTs, and take full ownership of their digital assets with ease and convenience.