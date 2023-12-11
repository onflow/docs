---
title: Mainnet Account Setup Guidelines
sidebar_label: Mainnet Account Setup
sidebar_position: 5
---

To deploy your smart contracts to the mainnet, follow the steps below to register, fund, and set up a new account.

> **Note**: This account will be used for production purposes. Ensure proper key management. Using a Key Management Service (KMS) is the best practice. By default, this command generates an ECDSA key pair on the P-256 curve. Keep in mind that the Flow CLI is intended for development purposes only and is not recommended for production use. Handling keys using a Key Management Service is the best practice.

## Create an account
You can easily create a new funded account on the mainnet using the Flow CLI. Execute the following command `flow accounts create` and choose a name for the account and the network, which in this case is `mainnet`. After that, the account private key is saved into a separate file called `{name}.pkey`. We advise switching to a KMS system for production use; you can [read more about it here](../tools/flow-cli/flow.json/configuration.md#advanced-format-1).

```bash
flow accounts create

Enter an account name: mike
✔ Testnet

🎉 New account created with address 0x77e6ae4c8c2f1dd6 and the name 'mike' on the Testnet network.

Here’s a summary of all the actions that were taken:
 - Added the new account to flow.json.
 - Saved the private key to 'mike.pkey'.
 - Added 'mike.pkey' to .gitignore.
```

Read more about the command in the [CLI account creation documentation](../tools/flow-cli/accounts/create-accounts.md#interactive-mode).
