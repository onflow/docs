---
title: Register Your ERC20 Token on Flow EVM
description: 'Register your ERC20 token on Flow EVM so it appears in Flow Wallet, MetaMask, and other ecosystem apps.'
sidebar_label: Register ERC20 Token
sidebar_position: 4
keywords:
  - ERC20
  - Fungible Token
  - Flow EVM
  - Flow Wallet
  - MetaMask
  - Token List
  - Register ERC20 Token
  - Flow Official Assets
---

# Register Your ERC20 Token on Flow EVM

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/zU8xspQMGbU" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
  ></iframe>
</div>

## Overview

This section covers how to register your ERC20 token on Flow EVM via a Github Pull Request process so it appears in Flow standard Token List, which Flow Wallet, MetaMask, and other ecosystem apps use.

We will use the [Flow Official Assets] repository as the standard token list repository to update the token list for the whole Flow ecosystem. The repository is open to the public and you can submit your PRs to add your token to the list.

:::info

The logic of the registration is based on the [Register Assets in Cadence] backend process.

:::

## Guides for how to submit your PRs

Steps to submit your PRs:

1. **Fork the [Flow Official Assets] repository**
   - Click `Fork` in the top right corner of the repository.
   - Create a new fork of the repository in your own Github account.
2. **Create a new branch**
   - Clone your forked repository to your local development environment by `git clone https://github.com/your-github-username/assets`
   - Create a new branch for your token by `git checkout -b new-token-branch`
3. **Add or update your token to the list**
   - For new Tokens:
     - Create the token folders in the `tokens/registry` directory.
     - The name of the token folders must be the same as the token's contract address.
       - For example, `tokens/registry/0x1234567890123456789012345678901234567890`
       - for Testnet tokens, the folder should be `tokens/registry/testnet:0x1234567890123456789012345678901234567890`
     - Put the required metadata file in the token folder, include at least one of the following files:
       - `logo.png`: PNG format token logo (256x256px recommended)
       - `logo.svg`: SVG format token logo, optimized and viewboxed
     - You can also add extra optional metadata file:
       - `mods.json`: Mods JSON file for token metadata, you can adjust the `symbol`, `name`, `description` for the final output in the `token.json` file.
   - For current Tokens:
     - Identify the token folder in the `tokens/registry` directory by the token's contract address.
     - Update the token metadata in the `tokens/registry/${token_address}` directory.
4. **Submit a Pull Request**
   - Commit your changes and push to your forked repository.
   - Create a new Pull Request (PR) for your changes in the [Flow Official Assets] repository.
   - A Github Action will be triggered to verify the onchain status of the token and update the report in the PR's comment.
     - If there is any issue, you will see some warnings and suggestions in the PR's comment. Check the report and update the token metadata if needed.
     - You may see a comment from the Github Action that you need to send 1 $FLOW to the registry address for the token registration because there is a VM Bridge onboarding fee.

Learn more about the registration process in the [Assets Registry] README.md file of the repository.

## What's next?

After you submit your PR, you just need to wait for the Flow team to review your token and merge your PR.  

After the PR is merged, your token will be registered by the Github Actions in the [Flow Official Assets] repository automatically and Github Actions automatically creates a new PR to update the token list. The Flow team will regularly merge the token list updates PR to the main branch.

## How to verify the token is registered

As Github Actions executes the registration and token list generation, you can check the status of the PRs and the token list JSON files in the [Flow Official Assets] repository.  
Here are the URLs for the token list JSON files:

- Mainnet: `https://raw.githubusercontent.com/onflow/assets/refs/heads/main/tokens/outputs/mainnet/token-list.json`
- Testnet: `https://raw.githubusercontent.com/onflow/assets/refs/heads/main/tokens/outputs/testnet/token-list.json`

You can check the token list JSON files to verify the token is registered in the `token-list.json` file.

[Flow Official Assets]: https://github.com/onflow/assets
[Register Assets in Cadence]: ./register-cadence-assets.md
[Assets Registry]: https://github.com/onflow/assets/tree/main/tokens
