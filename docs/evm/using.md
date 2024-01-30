---
title: Using FlowEVM
sidebar_label: Using FlowEVM
sidebar_position: 2
---

# Using FlowEVM

## [Flow Wallet](https://docs.base.org/using-base#coinbase-wallet)

The [Flow Wallet](https://chromewebstore.google.com/detail/flow-reference-wallet/hpclkefagolihohboafpheddmmgdffjm) is light weight and robust web web browser extension that supports EVM on Flow by default. Swap assets, access EVM and Cadence apps and keep all your favourite assets in once place.

To use Flow Wallet on Cadence and EVM:

1. Open the Flow Wallet browser extension and create your account.
2. Connect to an app using Flow Wallet.

## EVM Wallets

Applications deployed to Flow’s EVM  support popular EVM-compatible wallets such as [MetaMask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn), all you need to do is add Flow as a custom network.

### [MetaMask](https://docs.base.org/using-base#metamask)

To add Flow as a custom network to MetaMask:

1. Open the MetaMask browser extension.
2. Open the network selection dropdown menu by clicking the dropdown button at the top of the extension.
3. Click the **Add network** button.
4. Click **Add a network manually**.
5. In the **Add a network manually** dialog that appears, enter the following information for Flow mainnet:
    
    
    | Name | Value |
    | --- | --- |
    | Network Name | Flow Mainnet |
    | Description | The public mainnet for Flow. |
    | RPC Endpoint | https://mainnet.base.org/ |
    | Chain ID | TBD |
    | Currency Symbol | FLOW |
    | Block Explorer | TBD |
6. Tap the Save button to save Base as a network.

You should now be able to connect to the Base by selecting it from the network selection dropdown menu.

### Flow Native Wallets

Flow native wallets will also be able to interact with EVM but will require the use of the Cadence EVM bridge. The bridge creates Cadence Owned Accounts, which are special Ethereum addresses that allow users to transfer assets between EVM-compatible wallets and Flow native wallets.