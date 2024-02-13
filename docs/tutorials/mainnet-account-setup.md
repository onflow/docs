---
title: Mainnet Account Setup Guidelines
sidebar_label: Mainnet Account Setup
sidebar_position: 5
---

To deploy your smart contracts on the mainnet, follow these steps to register, fund, and set up a new account.

> **Note**: This account is designated for production purposes. Ensure proper key management by using a Key Management Service (KMS), which is considered best practice. The Flow CLI, by default, generates an ECDSA key pair on the P-256 curve. Keep in mind that the Flow CLI is intended for development purposes only and is not recommended for production use. Leveraging a Key Management Service for handling keys is the recommended approach.

## Create an Account
Easily create a newly funded account on the mainnet using the Flow CLI. Execute the command `flow accounts create` and choose a name for the account and the network, in this case, `mainnet`. The account's private key is then saved into a separate file named `{name}.pkey`. For production use, we strongly advise transitioning to a KMS system; you can [find more information here](../tools/flow-cli/flow.json/configuration.md#advanced-format-1).

```bash
flow accounts create

Enter an account name: mike
✔ Testnet

🎉 New account created with the address 0x77e6ae4c8c2f1dd6 and the name 'mike' on the Testnet network.

Here's a summary of all the actions that were taken:
 - Added the new account to `flow.json`.
 - Saved the private key to 'mike.pkey'.
 - Added 'mike.pkey' to `.gitignore`.
```
Read more about the command in the [CLI account creation documentation](../tools/flow-cli/accounts/create-accounts.md#interactive-mode).
