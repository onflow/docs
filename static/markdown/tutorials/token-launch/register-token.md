---
title: Register Your Token on Flow
description: 'Register tokens to get listed on Flow Wallet, IncrementFi, and other Flow Apps.'
sidebar_label: Register Token
sidebar_position: 2
---

# Register Your Token on Flow

To make your token visible in Flow ecosystem projects like **Flow Wallet** and **IncrementFi**, you need to register it on the Flow Token List. This process will generate JSON files based on Uniswap TokenList Standard and ensures that wallets, explorers, and onchain apps can recognize and display your token correctly.

There are two ways to register your token: **manually** via a web interface or **programmatically** during token deployment.

---

## Manual Registration (~1 min)

The following works for both fungible tokens on Flow Cadence and ERC20 tokens on Flow EVM.

1. **Go to** [Token List Registration](https://token-list.fixes.world/).
2. **Enter your contract address** in the **"Quick Register"** field and press **Enter**.
3. **Click "Register"** and sign the transaction.
   - If your token is **already registered to VM Bridge**, you're done.
   - Otherwise, the **first transaction** registers the token to **VM Bridge** (costs **1 $FLOW**).
   - After that, click **"Register"** again and sign the **second transaction** to finalize the process.

---

## Programmatic Registration (~1-2 hrs)

For seamless automation, you can integrate token registration into your token deployment workflow.

### Register ERC-20 Tokens automatically on Flow EVM

- Use this **Cadence transaction**: [register-evm-asset.cdc](https://github.com/fixes-world/token-list/blob/main/cadence/transactions/register-evm-asset.cdc)
- This transaction should be executed **right after deploying your ERC-20 contract**.
- **Note:** Similar to manual registration:
  - If the token **is not bridged** to **VM Bridge**, you will need to **send the transaction twice**.
  - The **first transaction** deploys a **VM Bridged Cadence contract** for the ERC-20.
  - The **second transaction** registers it on the Token List.

---

### Next Steps

- Verify your token listing in Flow Wallet.

For any issues, refer to the [Token List GitHub Repository](https://github.com/fixes-world/token-list) or reach out to the [Flow developer community](https://discord.gg/flow).