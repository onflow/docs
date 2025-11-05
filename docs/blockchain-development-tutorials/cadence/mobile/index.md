---
title: Mobile Development on Flow
sidebar_position: 4
description: Discover Flow's mobile development capabilities for building native blockchain applications. Learn about Flow's unique features for mobile apps, including secure key management, wallet integration, and progressive onboarding.
keywords:
  - Flow mobile
  - mobile development
  - blockchain apps
  - native applications
  - mobile SDK
  - secure enclave
  - wallet integration
  - WalletConnect
  - account linking
  - mobile security
  - Flow features
  - mobile wallets
  - Cadence mobile
  - user experience
  - blockchain mobile
---

Building mobile native applications that interact with the blockchain allows a much richer end user experience and provides access to OS capabilities. With Flow Mobile, developers can build native applications for iOS and Android with SDKs and mobile wallets.

## Why Flow

Millions of users with Flow accounts explore the ecosystem and look for applications. Most of these users purchased Flow NFTs and are comfortable with web3 principles.

In addition to the existing user base, developers can tap into smart contracts deployed on the Flow blockchain. These contracts, including their onchain state, provide unique possibilities to build experiences that enrich currently-used applications.

The following key capabilities make Flow a standout choice for mobile applications:

- On-device key encryption via Secure Enclave & Keychain.
- Mobile wallet compatibility and support for WalletConnect 2.0.
- Simple, progressive onboarding experience with postponed account linking.
- Seamless in-app experience with onchain interactions without constant signing requests.
- Account flexibility enabling secure account recovery and sharing.

## Why Flow Mobile

### Proven

Flow is built with mainstream adoption in mind. Mobile applications can leverage the best-in-class user experiences millions of users have enjoyed on the web, through applications like NBA TopShot or NFL AllDay.

### Best-in-class UX

Flow's Client Library makes it very intuitive to sign up and sign in with their wallet of choice. For transaction signing, Flow offers human readable security, so users get a clear understanding of what they are approving. An increased sense of trust for Flow applications is the outcome.

Furthermore, Flow's powerful account model allows for seamless user flows of onchain operations. Apps can perform transactions on behalf of the users (with their approval) in the background, without the need to switch between apps. The account model also allows apps to pay for transactions to postpone fiat on-ramps to get them to experience the value of an application before they commit to buy tokens.

Last, but not least, developers can leverage progressive web3 onboarding, in which you can use any identity provider authenticate users, but don't have to deal with keys. Developers can create Flow accounts for the users and link them to a wallet at a later point in time.

### Security first

Flow's mobile SDKs use on-device key encryption via Apple's Secure Enclave and Android's Keystore. The flexible account model makes it possible for an account to have multiple keys with different weights, which enables secure social recovery, account sharing, and much more.

## Smart contract language inspired by mobile languages

Cadence, Flow's smart contract language, will look and feel very familiar to mobile languages developers are already familiar with. Cadence was inspired by Move, Swift, and Kotlin. This reduces the ramp-up period to develop mobile applications leveraging onchain logic.

## What is available

Developers can leverage the following features to get productive quickly:

- Swift & Kotlin FCL SDKs to authenticate and interact with the Flow blockchain (query + execute scripts).
- FCL-compatible mobile wallets.
- User authentication with WalletConnect 2.0.
- Basic mobile sample application (MonsterMaker).

## Guides

**[iOS Development]** - Learn native iOS development on Flow through the Monster Maker sample project, which demonstrates wallet integration, transaction signing, and NFT management. The tutorial covers FCL Swift SDK integration, WalletConnect 2.0 for wallet connectivity, and essential blockchain interactions like querying and mutating data.

**[React Native Development]** - Build cross-platform mobile dApps using React Native and Flow Client Library (FCL). This guide walks through how to set up authentication, query the blockchain, and execute transactions while interacting with the Profile Contract on Flow's testnet to create and edit user profiles.

**[Build a Walletless Mobile App (PWA)]** - Create an accessible Progressive Web App with seamless onboarding with Magic integration for walletless authentication. The tutorial covers how to build a balloon inflation game that demonstrates Magic SDK integration, hybrid custody features, and account linking to transition from custodial to non-custodial ownership.

## Conclusion

Flow Mobile empowers developers to create native blockchain applications that deliver best-in-class user experiences while maintaining the security and flexibility that mainstream adoption demands. Whether building with native SDKs or creating Progressive Web Apps, Flow's mobile development capabilities provide the tools needed to bring web3 to millions of users through intuitive, secure, and feature-rich mobile experiences.

<!-- Reference-style links, will not render on page. -->

[iOS Development]: ./ios-quickstart.md
[React Native Development]: ./react-native-quickstart.md
[Build a Walletless Mobile App (PWA)]: ./walletless-pwa.md
