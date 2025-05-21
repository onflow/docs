---
title: Sponsor Transactions RPC Node
description: Learn how to set up an EVM RPC endpoint for your app and use it to sponsor all transactions for your users.
sidebar_position: 2
keywords:
  - Backend
  - Flow
  - Flow EVM
  - Flow Node
  - Gas Free
  - EVM Gateway
  - RPC Endpoint
---

# Gas Free EVM Endpoint

In this tutorial, we will learn how to set up a gas free EVM endpoint for your backend service, all transactions sent through this endpoint will not be charged for gas fees from the transaction sender's account.

## Context

In [Using Flow EVM], we know that we can use the RPC endpoint to send EVM transactions to the Flow EVM. The default RPC endpoint is actually the [EVM Gateway].

### How does the EVM Gateway work?

EVM transactions sent through the EVM Gateway are wrapped in a Flow Cadence transaction and sent to the Flow network. The Flow EVM Gateway's service account is the payer of that Cadence transaction.

:::info

In Cadence, the proposer, payer, and signer of a transaction are separate, natively.

:::

For EVM transactions inside this Cadence transaction, the transaction fees of the EVM transaction sent from the sender's account and applied to the EVM Gateway's service account.  The EVM Gateway pays the Cadence transaction fee, but is reimbursed via the EVM transaction's gas fee, which is directed to its own EVM address as the "coinbase".

Here is the key points of the Flow EVM Gateway:

- The EVM Gateway works as a proxy to send the EVM transactions.
- The EVM Gateway wraps the EVM transactions into native Flow Cadence transactions.
- The EVM Gateway has a service account, which is the payer and sender of all native transactions sent through the EVM Gateway.
- The sender of the EVM transaction is the fee payer of its EVM transaction to the EVM Gateway's service account.

### Why we need a gas free EVM endpoint?

From the Flow [transaction model], we know that there is actually a Fee Payer role in native Flow transactions. When the transaction is executed, the fees for the transaction are entirely borne by the Fee Payer role.  However, for EVM, the transaction model doesn't separate the signer from the payer. Therefore, when we execute transactions on the EVM, the transaction fees **must** be covered by the sender of the transaction.

So here is the problem - if we want to send a EVM transaction through the default EVM Gateway,  the sender's account has enough balance to cover the transaction fees. However, in some scenarios, developers may prefer to sponsor the transaction fees to create a more user-friendly experience, just can be done in native Cadence transactions, or paymaster solutions on other networks.

Here we provide a solution - you can set up a sponsored transaction EVM endpoint for your backend service and all transactions sent through this endpoint will be sponsored by your account.

### Who needs the gas free EVM endpoint?

Here are several typical business scenarios suitable for its use:

- Apps with embedded wallets using social login that don't want to require users to deposit money in a new wallet before they're able to interact with the app.
- Games needing to complete onchain tasks to onboard new players who wish to try the game.
- Centralized or decentralized exchanges that wish to improve user experience for a competitive edge
- Businesses that wish to provide sponsored transactions as a service.

As long as you can ensure that all your users' transactions are sent through a custom RPC endpoint, you can set up a Gas Free EVM Gateway to enable gas-free transactions for your users.

## How to set up a gas free EVM endpoint?

Mosts of the tasks you need to complete are in the guide to set up your own [Custom EVM Gateway].  A few highlights:

1. You need to prepare a Service Account for the EVM Gateway to cover all transaction fees. Please refer to [Account Creation] for more details.

2. You need to add enough identical keys to the Service Account to support the concurrent signing of EVM transactions.

That's very important, because the EVM Gateway will use the Service Account to pay for the gas fees of the EVM transactions, so the Service Account needs to have enough keys to support the concurrent signing of EVM transactions.

Please refer to [Account and Key Management] for more details.

3. You need to set the correct environment variables for the EVM Gateway to archive the gas-free feature.

In the [Run the gateway] section, you need to set couple of environment variables, and here are the notes:

- `COINBASE`: The address is used to accept EVM transaction fees, but in this case, it cannot to accept fees because all fees will be covered by the service account. But you need to set it with a valid address to ensure the EVM Gateway can start.
- `COA_ADDRESS`: This is the service account address, which will be used to pay for the gas fees of the EVM transactions. Please input the address of the Service Account you created in step 1, but without the `0x` prefix.
- `COA_KEY`: You need to set the private key of the Service Account you created in step 1.
- `GAS_PRICE`: That is the most important part, you need to set it to `0` to ensure the linked service account will pay for transactions on users behalf.

4. Please follow the full guide of [Custom EVM Gateway] to complete the EVM gateway setup, then you will get a custom RPC endpoint which is 100% gas-free for any EVM transaction sent through it.

## Conclusion

In this tutorial, we've explored how to set up a gas-free EVM endpoint for your backend service. This solution provides several significant benefits:

1. **Enhanced User Experience**: Users can execute EVM transactions without worrying about gas fees, making the platform more accessible and user-friendly.
2. **Business Flexibility**: Service providers can cover transaction costs on behalf of their users.
3. **Cost Management**: By centralizing gas fee payments through a service account, businesses can better manage and control their transaction costs.

The implementation requires careful setup of a service account with sufficient keys for concurrent transactions and proper configuration of the EVM Gateway environment variables. While this solution requires more initial setup compared to using the default EVM Gateway, the benefits of providing a gas-free experience to users can significantly enhance your platform's usability and adoption.

Remember that this solution is most effective when you can ensure all user transactions are routed through your custom RPC endpoint. This makes it particularly suitable for centralized services and applications where you have control over the transaction routing.

[Using Flow EVM]: ../../evm/using.mdx
[EVM Gateway]: https://github.com/onflow/flow-evm-gateway
[transaction model]: ../../build/basics/transactions.md#Payer
[Custom EVM Gateway]: ../../networks/node-ops/evm-gateway/evm-gateway-setup.md
[Account Creation]: ../../networks/node-ops/evm-gateway/evm-gateway-setup.md#step-1---account-creation
[Account and Key Management]: ../../networks/node-ops/evm-gateway/evm-gateway-setup.md#account-and-key-management
[Run the gateway]: ../../networks/node-ops/evm-gateway/evm-gateway-setup.md#run-the-gateway
