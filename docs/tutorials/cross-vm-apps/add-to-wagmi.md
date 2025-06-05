---
title: Update Existing wagmi App
description: Learn how to integrate Flow Cadence with your existing wagmi/RainbowKit app to enable batch transactions and other Cadence features.
sidebar_position: 1
keywords:
  - hybrid apps
  - cross-vm apps
  - FCL
  - wagmi
  - RainbowKit
  - Flow EVM
  - Flow Cadence
  - cross-VM
  - multi-call
  - batch transactions
  - web3
  - dapp development
  - wallet integration
  - smart contracts
  - blockchain development
  - supercharge your EVM app with Cadence
---

# Add Flow Cadence to Your wagmi App

This tutorial demonstrates how to enhance your existing wagmi/RainbowKit application with Flow Cadence capabilities. By integrating the Flow Client Library (FCL) with your EVM stack, you can unlock powerful features like batch transactions with a single signature.

## Video Overview

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/T2IqfrsKvZA" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
  ></iframe>
</div>

## Objectives

After completing this guide, you'll be able to:

- Add FCL to your existing wagmi/RainbowKit application
- Configure FCL to work alongside your EVM wallet connections
- Implement batch transactions that execute multiple EVM calls in a single Cadence transaction
- Display both Cadence and EVM addresses in your application

## Prerequisites

### Next.js and Modern Frontend Development

This tutorial uses [Next.js]. You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework. You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks. If you don't have your own preference, you can just follow along with us and use [npm].

### Solidity and Cadence Smart Contract Development

Apps using the hybrid approach can interact with both [Cadence] and [Solidity] smart contracts. You don't need to be an expert in either of these, but it's helpful to be familiar with how smart contracts work in at least one of these languages.

### Onchain App Frontends

We're assuming you're familiar with [wagmi], [viem], and [RainbowKit]. If you're coming from the Cadence, you might want to take a quick look at the getting started guides for these platforms. They're all excellent and will rapidly get you up to speed on how the EVM world commonly connects their apps to their contracts.

## Create an App

Start by creating an app using [RainbowKit]'s scaffold:

```bash
npm init @rainbow-me/rainbowkit@latest
```

## Install Required Dependencies

Continue by adding the necessary Flow dependencies to your project:

```bash
npm install @onflow/fcl @onflow/fcl-rainbowkit-adapter
```

These packages provide:

- `@onflow/fcl`: The Flow Client Library for interacting with the Cadence VM
- `@onflow/fcl-rainbowkit-adapter`: An adapter that allows RainbowKit to work with FCL-compatible wallets

## Step 2: Configure FCL in Your wagmi Setup

Update your wagmi configuration (`src/wagmi.ts`) to include FCL:

```typescript
'use client';

import {
  flowWallet,
  walletConnectWallet,
} from '@onflow/fcl-rainbowkit-adapter';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { flowTestnet } from 'wagmi/chains';
import * as fcl from '@onflow/fcl';
import { createConfig, http } from 'wagmi';

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/mainnet/authn',
  'walletconnect.projectId': '9b70cfa398b2355a5eb9b1cf99f4a981',
});

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [flowWallet(), walletConnectWallet],
    },
  ],
  {
    appName: 'RainbowKit demo',
    projectId: '9b70cfa398b2355a5eb9b1cf99f4a981',
  },
);

export const config = createConfig({
  chains: [flowTestnet],
  connectors,
  ssr: true,
  transports: {
    [flowTestnet.id]: http(),
  },
});
```

## Step 3: Add the Batch Transaction Utility

Create a custom hook in `src/hooks/useBatchTransactions.ts` to handle batch transactions. This utility allows you to execute multiple EVM transactions in a single Cadence transaction:

```typescript
import * as fcl from '@onflow/fcl';
import { Abi, bytesToHex, encodeFunctionData, toBytes } from 'viem';
import { useState } from 'react';
import { useAccount } from 'wagmi';

// Define the interface for each EVM call.
export interface EVMBatchCall {
  address: string; // The target EVM contract address (as a string)
  abi: Abi; // The contract ABI fragment (as JSON)
  functionName: string; // The name of the function to call
  args?: readonly unknown[]; // The function arguments
  gasLimit?: bigint; // The gas limit for the call
  value?: bigint; // The value to send with the call
}

export interface CallOutcome {
  status: 'passed' | 'failed' | 'skipped';
  hash?: string;
  errorMessage?: string;
}

export type EvmTransactionExecutedData = {
  hash: string[];
  index: string;
  type: string;
  payload: string[];
  errorCode: string;
  errorMessage: string;
  gasConsumed: string;
  contractAddress: string;
  logs: string[];
  blockHeight: string;
  returnedData: string[];
  precompiledCalls: string[];
  stateUpdateChecksum: string;
};

// Helper to encode our ca lls using viem.
// Returns an array of objects with keys "address" and "data" (hex-encoded string without the "0x" prefix).
export function encodeCalls(
  calls: EVMBatchCall[],
): Array<Array<{ key: string; value: string }>> {
  return calls.map((call) => {
    const encodedData = encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args,
    });

    return [
      { key: 'to', value: call.address },
      { key: 'data', value: fcl.sansPrefix(encodedData) ?? '' },
      { key: 'gasLimit', value: call.gasLimit?.toString() ?? '15000000' },
      { key: 'value', value: call.value?.toString() ?? '0' },
    ];
  }) as any;
}

const EVM_CONTRACT_ADDRESSES = {
  testnet: '0x8c5303eaa26202d6',
  mainnet: '0xe467b9dd11fa00df',
};

// Takes a chain id and returns the cadence tx with addresses set
const getCadenceBatchTransaction = (chainId: number) => {
  const isMainnet = chainId === 0x747;
  const evmAddress = isMainnet
    ? EVM_CONTRACT_ADDRESSES.mainnet
    : EVM_CONTRACT_ADDRESSES.testnet;

  return `
import EVM from ${evmAddress}

transaction(calls: [{String: AnyStruct}], mustPass: Bool) {

    let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue) & Account) {
        let storagePath = /storage/evm
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(from: storagePath)
            ?? panic("No CadenceOwnedAccount (COA) found at ".concat(storagePath.toString()))
    }

    execute {
        for i, call in calls {
            let to = call["to"] as! String
            let data = call["data"] as! String
            let gasLimit = call["gasLimit"] as! UInt64
            let value = call["value"] as! UInt

            let result = self.coa.call(
                to: EVM.addressFromString(to),
                data: data.decodeHex(),
                gasLimit: gasLimit,
                value: EVM.Balance(attoflow: value)
            )
            
            if mustPass {
                assert(
                  result.status == EVM.Status.successful,
                  message: "Call index ".concat(i.toString()).concat(" to ").concat(to)
                    .concat(" with calldata ").concat(data).concat(" failed: ")
                    .concat(result.errorMessage)
                )
            }
        }
    }
}
`;
};

// Custom hook that returns a function to send a batch transaction
export function useBatchTransaction() {
  const { chain } = useAccount();

  const cadenceTx = chain?.id ? getCadenceBatchTransaction(chain.id) : null;

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>('');
  const [results, setResults] = useState<CallOutcome[]>([]);

  async function sendBatchTransaction(
    calls: EVMBatchCall[],
    mustPass: boolean = true,
  ) {
    // Reset state
    setIsPending(true);
    setIsError(false);
    setTxId('');
    setResults([]);

    try {
      if (!cadenceTx) {
        throw new Error('No current chain found');
      }

      const encodedCalls = encodeCalls(calls);

      const txId = await fcl.mutate({
        cadence: cadenceTx,
        args: (arg, t) => [
          // Pass encodedCalls as an array of dictionaries with keys (String, String)
          arg(
            encodedCalls,
            t.Array(
              t.Dictionary([
                { key: t.String, value: t.String },
                { key: t.String, value: t.String },
                { key: t.String, value: t.UInt64 },
                { key: t.String, value: t.UInt },
              ] as any),
            ),
          ),
          // Pass mustPass=true to revert the entire transaction if any call fails
          arg(true, t.Bool),
        ],
        limit: 9999,
      });

      setTxId(txId);

      // The transaction may revert if mustPass=true and one of the calls fails,
      // so we catch that error specifically.
      let txResult;
      try {
        txResult = await fcl.tx(txId).onceExecuted();
      } catch (txError) {
        // If we land here, the transaction likely reverted.
        // We can return partial or "failed" outcomes for all calls.
        setIsError(true);
        setResults(
          calls.map(() => ({
            status: 'failed' as const,
            hash: undefined,
            errorMessage: 'Transaction reverted',
          })),
        );
        setIsPending(false);
        return;
      }

      // Filter for TransactionExecuted events
      const executedEvents = txResult.events.filter((e: any) =>
        e.type.includes('TransactionExecuted'),
      );

      // Build a full outcomes array for every call.
      // For any call index where no event exists, mark it as "skipped".
      const outcomes: CallOutcome[] = calls.map((_, index) => {
        const eventData = executedEvents[index]
          ?.data as EvmTransactionExecutedData;
        if (eventData) {
          return {
            hash: bytesToHex(
              Uint8Array.from(
                eventData.hash.map((x: string) => parseInt(x, 10)),
              ),
            ),
            status: eventData.errorCode === '0' ? 'passed' : 'failed',
            errorMessage: eventData.errorMessage,
          };
        } else {
          return {
            status: 'skipped',
          };
        }
      });

      setResults(outcomes);
      setIsPending(false);
    } catch (error: any) {
      setIsError(true);
      setIsPending(false);
    }
  }

  return { sendBatchTransaction, isPending, isError, txId, results };
}
```

## Step 4: Implement the UI

Now, update your application's `page.tsx` to use the batch transaction utility. Update

```tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import CodeEvaluator from './code-evaluator';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { CurrentUser } from '@onflow/typedefs';
import {
  EVMBatchCall,
  useBatchTransaction,
} from '../hooks/useBatchTransaction';

function Page() {
  const coa = useAccount();
  const [flowAddress, setFlowAddress] = useState<string | null>(null);
  const { sendBatchTransaction, isPending, isError, txId, results } =
    useBatchTransaction();

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe((user: CurrentUser) => {
      setFlowAddress(user.addr ?? null);
    });
    return () => unsub();
  }, []);

  // Define a "real" calls array to demonstrate a batch transaction.
  // In this example, we call two functions on a token contract:
  // 1. deposit() to wrap FLOW (e.g., WFLOW)
  // 2. approve() to allow a spender to spend tokens.
  const calls: EVMBatchCall[] = [
    {
      // Call deposit() function (wrap FLOW) on the token contract.
      address: '0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e', // Replace with your actual token contract address.
      abi: [
        {
          inputs: [],
          name: 'deposit',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ],
      functionName: 'deposit',
      args: [], // deposit takes no arguments; value is passed with the call.
    },
    {
      // Call approve() function (ERC20 style) on the same token contract.
      address: '0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e', // Replace with your actual token contract address if needed.
      abi: [
        {
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'approve',
      args: [
        '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2', // Spender address.
        BigInt('1000000000000000000'), // Approve 1 token (assuming 18 decimals).
      ],
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 12 }}>
        <ConnectButton />
      </div>
      <h3>Flow Address: {flowAddress}</h3>
      <h3>EVM Address: {coa?.address}</h3>
      <br />
      <button onClick={() => sendBatchTransaction(calls)}>
        Send Batch Transaction Example
      </button>
      {<p>{JSON.stringify({ isPending, isError, txId, results })}</p>}
      <CodeEvaluator />
    </>
  );
}

export default Page;
```

## Step 5: Test Your Application

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Connect your wallet using the RainbowKit `ConnectButton`

   - Make sure to use a Cadence-compatible wallet like Flow Wallet

3. Click the "Send Batch Transaction" button

   - You'll be prompted to approve the Cadence transaction
   - This transaction will execute multiple EVM calls in a single atomic operation

4. Observe the results
   - The Cadence transaction ID will be displayed
   - The results of each EVM transaction will be shown

## How It Works

When you call `sendBatchTransaction`, the following happens:

1. A Cadence transaction is created that includes all your EVM calls
2. The transaction is executed using FCL's `mutate` function
3. The Cadence transaction calls each EVM transaction in sequence
4. If any transaction fails and `mustPass` is true, the entire batch is rolled back
5. The results of each EVM transaction are returned

This approach gives you several advantages:

- **Atomic Operations**: All transactions succeed or fail together
- **Single Signature**: Users only need to sign one transaction
- **Gas Efficiency**: Reduced gas costs compared to separate transactions
- **Simplified UX**: Users don't need to approve multiple transactions

## Conclusion

You've successfully integrated Flow Cadence with your wagmi/rainbowkit application! This integration allows you to leverage the power of Cadence while maintaining the familiar EVM development experience.

## Reference Implementation

For a complete reference implementation, check out the [FCL + RainbowKit + wagmi Integration Demo] repository.

[Cadence]: https://cadence-lang.org/docs
[Next.js]: https://nextjs.org/docs/app/getting-started/installation
[npm]: https://www.npmjs.com/
[create an issue]: https://github.com/onflow/docs/issues/new/choose
[Cadence]: https://cadence-lang.org
[Solidity]: https://soliditylang.org/
[structure and call EVM transactions]: ./batched-evm-transactions.md
[FLIP 316]: https://github.com/onflow/flips/pull/317
[Flow Client Library (FCL)]: ../../tools/clients/fcl-js
[wagmi]: https://wagmi.sh/
[viem]: https://viem.sh/
[RainbowKit]: https://www.rainbowkit.com/
[wallet]: ../../ecosystem/wallets.md
[Discord]: https://discord.com/channels/613813861610684416/1162086721471647874
[FCL + RainbowKit + wagmi Integration Demo]: https://github.com/jribbink/cross-vm-app
[FCL-JS]: https://github.com/onflow/fcl-js
[Testnet Cadence Flowscan]: https://testnet.flowscan.io
[Cadence Owned Accounts]: ../../build/basics/accounts.md
[Testnet EVM Flowscan]: https://evm-testnet.flowscan.io
