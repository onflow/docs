---
title: Register Your Assets on Flow
description: 'Register your Fungible Token or Non-Fungible Token on Flow so it appears in Flow Wallet, IncrementFi, and other ecosystem apps.'
sidebar_label: Register Cadence Assets
sidebar_position: 2
---

# Register Your Assets on Flow

To make your fungible token or non-fungible token visible in Flow ecosystem projects like **Flow Wallet** and **IncrementFi**, you need to register it on the Flow Token List. This process will generate JSON files based on Uniswap TokenList Standard and ensures that wallets, explorers, and onchain apps can recognize and display your token correctly.

There are two ways to register your token: **manually** via a web interface or **programmatically** during token deployment.

---

## Manual Registration (~1 min)

The following works for both fungible and non-fungible tokens on Flow Cadence or Flow EVM.

1. **Go to** [Token List Registration].
2. **Enter your contract address** in the **"Quick Register"** field and press **Enter**.
   - Both Fungible and Non-Fungible tokens are supported.
   - Both EVM and Cadence contracts are supported.
3. **Click "Register"** and sign the transaction.
   - If your token is **already registered to VM Bridge**, you're done.
   - Otherwise, the **first transaction** registers the token to **VM Bridge** (costs **1 $FLOW**).
   - After that, click **"Register"** again and sign the **second transaction** to finalize the process.

Note: the ERC-20 token registered with this method will use the default logo of Flow Official Assets.  
If you want to register your ERC-20 token on Flow EVM with your customized logo, you should follow the [Register ERC-20 Token on Flow EVM] guide.

---

## Programmatic Registration

For seamless automation, you can integrate token registration into your token deployment workflow.

You can use the following Cadence transaction to register your Fungible or Non-Fungible token on Flow Cadence or Flow EVM.

### Register Fungible Token or Non-Fungible Token automatically on Flow Cadence

Use a standalone Cadence transaction to register your Fungible Token or Non-Fungible Token on Flow Cadence.

- Use this **Cadence transaction**: [register-standard-asset.cdc].
- This transaction should be executed **right after deploying your Fungible Token or Non-Fungible Token contract**.

Or you can also pick up some code from the [register-standard-asset.cdc] file to make your own Cadence transaction with the same logic for more seamless integration. Here is an example:

```cadence
import "TokenList"
import "NFTList"

transaction(
  address: Address,
  contractName: String,
) {
  execute {
    if TokenList.isValidToRegister(address, contractName) {
        TokenList.ensureFungibleTokenRegistered(address, contractName)
    } else if NFTList.isValidToRegister(address, contractName) {
        NFTList.ensureNFTCollectionRegistered(address, contractName)
    }
  }
}
```

### Register ERC-20 or ERC-721 Tokens automatically on Flow EVM

- Use this **Cadence transaction**: [register-evm-asset.cdc]
- This transaction should be executed **right after deploying your ERC-20 or ERC-721 contract**.
- **Note:** Similar to manual registration:
  - If the token **is not bridged** to **VM Bridge**, you will need to **send the transaction twice**.
  - The **first transaction** deploys a **VM Bridged Cadence contract** for the ERC-20.
  - The **second transaction** registers it on the Token List.

---

### Next Steps

- Verify your token listing in Flow Wallet.

For any issues, refer to the [Token List GitHub Repository] or reach out to the [Flow developer community].

[Token List Registration]: https://token-list.fixes.world/
[Register ERC-20 Token on Flow EVM]: ./register-erc20-token.md
[register-standard-asset.cdc]: https://github.com/fixes-world/token-list/blob/main/cadence/transactions/register-standard-asset.cdc
[register-evm-asset.cdc]: https://github.com/fixes-world/token-list/blob/main/cadence/transactions/register-evm-asset.cdc
[Token List GitHub Repository]: https://github.com/fixes-world/token-list
[Flow developer community]: https://discord.gg/flow
