---
title: Flow User Accounts & Wallets
sidebar_label: User Accounts & Wallets
---

Every Flow blockchain user possesses an account that securely holds their digital assets, including currencies and NFTs. A Flow account is identified by an 8-byte address and is controlled by one or more public/private key pairs. The individual or entity with access to the private key can sign a transaction to access the assets within the account.

## Interacting with User Accounts & Wallets

The majority of blockchain users manage their accounts with the assistance of a crypto wallet, and the same holds true for Flow. In essence, a wallet is a piece of software or hardware that stores the private key associated with an account.

When discussing user accounts and wallets, we use the term _custodian_ to denote the party responsible for storing the private key associated with a user account. Hardware wallets, such as those provided by Ledger, empower users to be their own custodians, while hosted software wallets, like those provided by Dapper Wallet, can act as custodians on behalf of the user.

## Connecting Wallets & Dapps

Decentralized applications (Dapps) enable users to store their data in their own accounts instead of a centralized database. However, for Dapps to function effectively, they still need to securely access a user’s account periodically.

For instance, to purchase an NFT from an artist on the [Versus auction website](https://www.versus-flow.art/), a user must initiate a transaction that transfers funds from their account to the Versus contract account. The Versus application prepares and initializes this transaction before seeking approval from the user.

### Flow Client Library (FCL)

The Flow Client Library (FCL) is a framework that [standardizes and simplifies the interaction between Dapps and wallets](https://www.onflow.org/post/inside-flow-the-power-of-simplicity-with-fcl). Through FCL, a Dapp developer can effortlessly support various wallet providers with just a few lines of code.

FCL offers the following functionalities out of the box:

* User registration and login
* Transaction signing and submission

FCL-powered Dapps can construct transactions, which are then handed over to the user’s wallet for signing, all without gaining access to the user’s private key. Users can seamlessly onboard themselves to any FCL-enabled Dapp in the Flow blockchain ecosystem and use the same wallet provider across different Dapps.

In addition to the above, FCL-powered Dapps bring forth the following benefits:

* **Network effects:** FCL is a dynamic ecosystem that continuously incorporates additional wallets, payment providers, and identity management solutions. Both FCL-powered Dapps and their users directly benefit from this ongoing growth.
* **Reduced technical complexity:** Your Dapp need not secure private keys or sign transactions; it can instead rely on third-party wallet providers to manage this complexity.
* **Fee payments:** In many cases, wallet providers cover storage and account creation fees for their users, eliminating the need for you to do so.

_Sample interaction: A user clicks a button to purchase an NFT from your storefront. Your Dapp submits a transaction request to the user’s wallet. The wallet prompts the user, asking them to approve or deny the transaction. After approval, the wallet signs and submits the transaction, then delivers the result to your Dapp._

### Dapp Custody

For Dapps that do not utilize FCL, you must operate your own wallet infrastructure and act as the custodian for your users, rather than relying on third-party wallets. In this scenario, as the Dapp developer, you are responsible for securing your users’ private keys.

Under this model, the accounts in your control can only be used with your application. Users will need separate accounts for other applications.

_Sample interaction: A user clicks a button to purchase an NFT from your storefront. This triggers an API request to your Dapp’s backend, which holds the user’s private key. Your Dapp backend then signs and submits a transaction on behalf of the user._

Should your Dapp take custody of user accounts? In most cases, no. We hope that you can focus on creating the experience you desire without the complexity, legal responsibility, and limitations associated with being a custodian. We also aim for users to freely explore many Dapps without managing a separate account for each.

However, there are circumstances where you may want to be a custodian:

* You are building a Dapp on a platform not yet supported by FCL wallets (e.g., mobile, game console).
* You have business or product needs that necessitate a custodial approach (e.g., fraud protection, users who prefer a custodial option).

If you do need to build your own wallet, we recommend using the [open-source Wallet API](https://github.com/flow-hydraulics/flow-wallet-api), a service deployable as part of your infrastructure to manage blockchain accounts and keys.

### Recommendation

Unless you have a specific use case requiring you to manage your users’ private keys, we recommend building an FCL-powered Dapp that connects with existing wallet providers:

* [Blocto](https://blocto.portto.io/en/) is a web, iOS, and Android wallet empowering FCL-enabled applications like [Vault by CNN](https://vault.cnn.com/), [MotoGP Ignition](https://motogp-ignition.com/), and [Versus](https://www.versus-flow.art/).
* [Dapper Wallet](https://www.meetdapper.com/) (utilized by [NBA Top Shot](https://nbatopshot.com/)) is an FCL-compatible wallet soon to be available to more Flow developers.
