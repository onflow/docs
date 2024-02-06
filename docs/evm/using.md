---
title: Using FlowEVM
sidebar_label: Using FlowEVM
sidebar_position: 2
---

# Using FlowEVM

## [Flow Wallet](https://wallet.flow.com)

Flow Wallet is available as [Android](https://play.google.com/store/apps/details?id=io.outblock.lilico&hl=en_US&gl=US) and [iOS](https://apps.apple.com/ca/app/flow-core/id1644169603) apps, with desktop support using the Flow Wallet [Chrome extension](https://chromewebstore.google.com/detail/flow-reference-wallet/hpclkefagolihohboafpheddmmgdffjm) supporting both Flow and FlowEVM by default. In addition to being able to transact in both FLowEVM and Cadence environments, Flow Wallet also allows you to view and move assets between EVM and Cadence making it possible to manage all your assets in one place.

To use Flow Wallet Chrome extension:

1. Open the Flow Wallet browser extension and create your account.
2. Connect to an app using Flow Wallet.

## EVM Wallets

Applications deployed to FlowEVM will work with popular EVM-compatible wallets such as [MetaMask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn), all you need to do is add FlowEVM as a custom network.

### [MetaMask](https://metamask.io)

To add FlowEVM as a custom network to MetaMask:

1. Open the MetaMask browser extension
2. Open the network selection dropdown menu by clicking the dropdown button at the top of the extension
3. Click the `**Add network**` button
4. Click `**Add a network manually**`
5. In the `**Add a network manually**` dialog that appears, enter the following information for FlowEVM mainnet:
    
    | Name            | Value                           |
    |---------------------------------------------------|
    | Network Name    | FlowEVM Mainnet                 |
    | Description     | The public mainnet for FlowEVM  |
    | RPC Endpoint    | TBD                             |
    | Chain ID        | TBD                             |
    | Currency Symbol | FLOW                            |
    | Block Explorer  | TBD                             |

6. Tap the Save button to save FlowEVM as a network.

You should now be able to connect to the FlowEVM by selecting it from the network selection dropdown menu

### Flow Native Wallets

Flow native wallets which have added support for FlowEVM will also be able to interact with both Flow and FlowEVM. 