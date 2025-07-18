---
title: '@onflow/kit'
description: React hooks for interacting with the Flow blockchain.
sidebar_position: 1
---

# @onflow/kit

`@onflow/kit` is a lightweight React utility library that simplifies interacting with the Flow blockchain. It provides a collection of hooks, similar to those in other popular web3 libraries, that make it easier to build frontends that understand blockchain interactions. **In the future**, it will also provide components designed to make authentication, script execution, transactions, event subscriptions, and network configuration seamless in React apps.

## 🔌 Included React Hooks

- [`useFlowCurrentUser`](#useflowcurrentuser) – Authenticate and manage the current Flow user
- [`useFlowAccount`](#useflowaccount) – Fetch Flow account details by address
- [`useFlowBlock`](#useflowblock) – Query latest or specific Flow blocks
- [`useFlowChainId`](#useflowchainid) – Retrieve the current Flow chain ID
- [`useFlowConfig`](#useflowconfig) – Access the current Flow configuration
- [`useFlowEvents`](#useflowevents) – Subscribe to Flow events in real-time
- [`useFlowQuery`](#useflowquery) – Execute Cadence scripts with optional arguments
- [`useFlowQueryRaw`](#useflowqueryraw) – Execute Cadence scripts with optional arguments returning non-decoded data
- [`useFlowMutate`](#useflowmutate) – Send transactions to the Flow blockchain
- [`useFlowRevertibleRandom`](#useflowrevertiblerandom) – Generate pseudorandom values tied to block height
- [`useFlowTransaction`](#useflowtransaction) – Fetch a Flow transaction by ID
- [`useFlowTransactionStatus`](#useflowtransactionstatus) – Track transaction status updates

### Cross-VM (Flow EVM ↔ Cadence) Hooks

- [`useCrossVmBatchTransaction`](#usecrossvmbatchtransaction) – Execute mutliple EVM transactions in a single atomic Cadence transaction
- [`useCrossVmTokenBalance`](#usecrossvmtokenbalance) – Query fungible token balances across Cadence and Flow EVM
- [`useCrossVmSpendNft`](#usecrossvmspendnft) – Bridge NFTs from Cadence to Flow EVM and execute arbitrary EVM transactions to atomically spend them
- [`useCrossVmSpendToken`](#usecrossvmspendtoken) – Bridge fungible tokens from Cadence to Flow EVM and execute arbitrary EVM transactions
- [`useCrossVmTransactionStatus`](#usecrossvmtransactionstatus) – Track Cross-VM transaction status and EVM call results

## Installation

```bash
npm install @onflow/kit
```

## Usage

### Wrapping Your App With `FlowProvider`

Begin by wrapping your application with the `FlowProvider` to initialize FCL configuration. This sets up FCL and maps its configuration keys to a strictly typed format for your hooks.

```tsx
import React from "react"
import App from "./App"
import { FlowProvider } from "@onflow/kit"
import flowJSON from "../flow.json"

function Root() {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "https://access-mainnet.onflow.org",
        flowNetwork: "mainnet",
        appDetailTitle: "My On Chain App",
        appDetailIcon: "https://example.com/icon.png",
        appDetailDescription: "A decentralized app on Flow",
        appDetailUrl: "https://myonchainapp.com",
      }}
      flowJson={flowJSON}
    >
      <App />
    </FlowProvider>
  )
}

export default Root
```

If you're using **Next.js**, place the `FlowProvider` inside your `layout.tsx`. Since React hooks must run on the client, you may need to wrap the provider in a separate file that begins with `'use client'` to avoid issues with server-side rendering. Adjust this setup as needed for other frontend frameworks.

👉 Learn more about configuring `flow.json` in the [Configuration Guide].

---

## Hooks

:::info

Many of these hooks are built using [`@tanstack/react-query`](https://tanstack.com/query/latest), which provides powerful caching, revalidation, and background refetching features. As a result, you’ll see return types like `UseQueryResult` and `UseMutationResult` throughout this section. Other types—such as `Account`, `Block`, and `CurrentUser`—are from the [Flow Client Library (FCL) TypeDefs](https://github.com/onflow/fcl-js/blob/master/packages/typedefs/src/index.ts). Refer to their respective documentation for full type definitions and usage patterns.

:::

### `useFlowCurrentUser`

```tsx
import { useFlowCurrentUser } from "@onflow/kit"
```

#### Returns:

- `user: CurrentUser` – The current user object from FCL
- `authenticate: () => Promise<CurrentUser>` – Triggers wallet authentication
- `unauthenticate: () => void` – Logs the user out

```tsx
function AuthComponent() {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser()

  return (
    <div>
      {user?.loggedIn ? (
        <>
          <p>Logged in as {user?.addr}</p>
          <button onClick={unauthenticate}>Logout</button>
        </>
      ) : (
        <button onClick={authenticate}>Login</button>
      )}
    </div>
  )
}
```

---

### `useFlowAccount`

```tsx
import { useFlowAccount } from "@onflow/kit"
```

#### Parameters:

- `address?: string` – Flow address (with or without `0x` prefix)
- `query?: UseQueryOptions<Account | null, Error>` – Optional TanStackQuery options

#### Returns: `UseQueryResult<Account | null, Error>`

```tsx
function AccountDetails() {
  const { data: account, isLoading, error, refetch } = useFlowAccount({
    address: "0x1cf0e2f2f715450",
    query: { staleTime: 5000 },
  })

  if (isLoading) return <p>Loading account...</p>
  if (error) return <p>Error fetching account: {error.message}</p>
  if (!account) return <p>No account data</p>

  return (
    <div>
      <h2>Account: {account.address}</h2>
      <p>Balance: {account.balance}</p>
      <pre>{account.code}</pre>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}
```

---

### `useFlowBlock`

```tsx
import { useFlowBlock } from "@onflow/kit"
```

#### Parameters:

- `sealed?: boolean` – If `true`, fetch latest sealed block
- `id?: string` – Block by ID
- `height?: number` – Block by height
- `query?: UseQueryOptions<Block | null, Error>` – Optional TanStackQuery options

Only one of `sealed`, `id`, or `height` should be provided.

#### Returns: `UseQueryResult<Block | null, Error>`

```tsx
function LatestBlock() {
  const { data: block, isLoading, error } = useFlowBlock({ query: { staleTime: 10000 } })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!block) return <p>No block data.</p>

  return (
    <div>
      <h2>Block {block.height}</h2>
      <p>ID: {block.id}</p>
    </div>
  )
}
```

---

### `useFlowChainId`

```tsx
import { useFlowChainId } from "@onflow/kit"
```

This hook retrieves the Flow chain ID, which is useful for identifying the current network.

#### Parameters:
- `queryOptions?: Omit<UseQueryOptions<string | null>, "queryKey" | "queryFn">` – Optional TanStack Query options like `staleTime`, `enabled`, etc.

#### Returns: `UseQueryResult<string | null, Error>`

Valid chain IDs include: `testnet` (Flow Testnet), `mainnet` (Flow Mainnet), and `emulator` (Flow Emulator).  The `flow-` prefix will be stripped from the chain ID returned by the access node (e.g. `flow-testnet` will return `testnet`).

```tsx
function ChainIdExample() {
  const { data: chainId, isLoading, error } = useFlowChainId({
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading chain ID...</p>
  if (error) return <p>Error fetching chain ID: {error.message}</p>

  return <div>Current Flow Chain ID: {chainId}</div>
}
```

---

### `useFlowConfig`

```tsx
import { useFlowConfig } from "@onflow/kit"
```

#### Returns: `FlowConfig`

```tsx
function MyComponent() {
  const config = useFlowConfig()

  return (
    <div>
      <p>Current network: {config.flowNetwork}</p>
      <p>Current access node: {config.accessNodeUrl}</p>
    </div>
  )
}
```

---

### `useFlowEvents`

```tsx
import { useFlowEvents } from "@onflow/kit"
```

#### Parameters:

- `startBlockId?: string` – Optional ID of the block to start listening from
- `startHeight?: number` – Optional block height to start listening from
- `eventTypes?: string[]` – Array of event type strings (e.g., `A.0xDeaDBeef.Contract.EventName`)
- `addresses?: string[]` – Filter by Flow addresses
- `contracts?: string[]` – Filter by contract identifiers
- `opts?: { heartbeatInterval?: number }` – Options for subscription heartbeat
- `onEvent: (event: Event) => void` – Callback for each event received
- `onError?: (error: Error) => void` – Optional error handler

#### Example:

```tsx
function EventListener() {
  useFlowEvents({
    eventTypes: ["A.0xDeaDBeef.SomeContract.SomeEvent"],
    onEvent: (event) => console.log("New event:", event),
    onError: (error) => console.error("Error:", error),
  })

  return <div>Listening for events...</div>
}
```

---

### `useFlowQuery`

```tsx
import { useFlowQuery } from "@onflow/kit"
```

#### Parameters:

- `cadence: string` – Cadence script to run
- `args?: (arg, t) => unknown[]` – Function returning FCL arguments
- `query?: UseQueryOptions<unknown, Error>` – Optional TanStackQuery options

#### Returns: `UseQueryResult<unknown, Error>`

```tsx
function QueryExample() {
  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: `
      access(all)
      fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    args: (arg, t) => [arg(1, t.Int), arg(2, t.Int)],
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading query...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <p>Result: {data}</p>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}
```

---

### `useFlowQueryRaw`

```tsx
import { useFlowQueryRaw } from "@onflow/kit"
```

This hook is identical to `useFlowQuery` but returns the raw, non-decoded response data from the Flow blockchain. This is useful when you need access to the original response structure or want to handle decoding manually.

#### Parameters:

- `cadence: string` – Cadence script to run
- `args?: (arg, t) => unknown[]` – Function returning FCL arguments
- `query?: UseQueryOptions<unknown, Error>` – Optional TanStackQuery options

#### Returns: `UseQueryResult<unknown, Error>`

The returned data will be in its raw, non-decoded format as received from the Flow access node.

```tsx
function QueryRawExample() {
  const { data: rawData, isLoading, error, refetch } = useFlowQueryRaw({
    cadence: `
      access(all)
      fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    args: (arg, t) => [arg(1, t.Int), arg(2, t.Int)],
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading query...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <p>Raw Result: {JSON.stringify(rawData, null, 2)}</p>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}
```

---

### `useFlowMutate`

```tsx
import { useFlowMutate } from "@onflow/kit"
```

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, FCLMutateParams>` – Optional TanStackQuery mutation options

#### Returns: `UseMutationResult<string, Error, FCLMutateParams>`

```tsx
function CreatePage() {
  const { mutate, isPending, error, data: txId } = useFlowMutate({
    mutation: {
      onSuccess: (txId) => console.log("TX ID:", txId),
    },
  })

  const sendTransaction = () => {
    mutate({
      cadence: `transaction() {
        prepare(acct: &Account) {
          log(acct.address)
        }
      }`,
      args: (arg, t) => [],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [],
      limit: 100,
    })
  }

  return (
    <div>
      <button onClick={sendTransaction} disabled={isPending}>
        Send Transaction
      </button>
      {isPending && <p>Sending transaction...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useFlowRevertibleRandom`

```tsx
import { useFlowRevertibleRandom } from "@onflow/kit"
```

#### Parameters:

- `min?: string` – Minimum random value (inclusive), as a UInt256 decimal string. Defaults to `"0"`.
- `max: string` – Maximum random value (inclusive), as a UInt256 decimal string. **Required**.
- `count?: number` – Number of random values to fetch (must be at least 1). Defaults to `1`.
- `query?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">` – Optional TanStack Query settings like `staleTime`, `enabled`, `retry`, etc.

#### Returns: `UseQueryResult<RevertibleRandomResult[], Error>`

Each `RevertibleRandomResult` includes:

- `blockHeight: string` — The block height from which the random value was generated.
- `value: string` — The random UInt256 value, returned as a decimal string.

```tsx
function RandomValues() {
  const { data: randoms, isLoading, error, refetch } = useFlowRevertibleRandom({
    min: "0",
    max: "1000000000000000000000000", // Example large max
    count: 3,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading random numbers...</p>
  if (error) return <p>Error fetching random numbers: {error.message}</p>
  if (!randoms) return <p>No random values generated.</p>

  return (
    <div>
      <h2>Generated Random Numbers</h2>
      <ul>
        {randoms.map((rand, idx) => (
          <li key={idx}>
            Block {rand.blockHeight}: {rand.value}
          </li>
        ))}
      </ul>
      <button onClick={refetch}>Regenerate</button>
    </div>
  )
}
```

#### Notes:

* Randomness is generated using the **on-chain `revertibleRandom`** function on Flow, producing pseudorandom values tied to block and script execution.
* Values are **deterministic**: The values returned for identical calls within the same block will be identical.
* If `count ` is larger than one, the returned values are distinct.
* This hook is designed for simple use cases that don't require unpredictability, such as randomized UIs.
  Since the hook uses script executions on existing blocks, the random source is already public and the randoms are predictable.
* For **more advanced use cases** that **do** require on-chain randomness logic via transactions, Flow provides built-in support using Cadence's `revertibleRandom` and [commit-reveal scheme].

---

### `useFlowTransaction`

```tsx
import { useFlowTransaction } from "@onflow/kit"
```

Fetches a Flow transaction by ID and returns the decoded transaction object.

#### Parameters:

* `txId?: string` – The Flow transaction ID to fetch.
* `query?: Omit<UseQueryOptions<Transaction | null, Error>, "queryKey" | "queryFn">` – Optional TanStack Query options like `staleTime`, `enabled`, etc.

#### Returns: `UseQueryResult<Transaction | null, Error>`

```tsx
function TransactionDetails({ txId }: { txId: string }) {
  const { data: transaction, isLoading, error, refetch } = useFlowTransaction({
    txId,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading transaction...</p>
  if (error) return <p>Error fetching transaction: {error.message}</p>
  if (!transaction) return <p>No transaction data.</p>

  return (
    <div>
      <h2>Transaction ID: {transaction.id}</h2>
      <p>Gas Limit: {transaction.gasLimit}</p>
      <pre>Arguments: {JSON.stringify(transaction.arguments, null, 2)}</pre>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}
```

---

### `useFlowTransactionStatus`

```tsx
import { useFlowTransactionStatus } from "@onflow/kit"
```

#### Parameters:

- `id: string` – Transaction ID to subscribe to

#### Returns:

- `transactionStatus: TransactionStatus | null`
- `error: Error | null`

```tsx
function TransactionStatusComponent() {
  const txId = "your-transaction-id-here"
  const { transactionStatus, error } = useFlowTransactionStatus({ id: txId })

  if (error) return <div>Error: {error.message}</div>;

  return <div>Status: {transactionStatus?.statusString}</div>;
}
```

---

## Cross-VM Hooks

### `useCrossVmBatchTransaction`

```tsx
import { useCrossVmBatchTransaction } from "@onflow/kit"
```

This hook allows you to execute multiple EVM transactions in a single atomic Cadence transaction. It is useful for batch processing EVM calls while ensuring they are executed together, either all succeeding or allowing for some to fail without affecting the others.

#### Parameters:
- `mutation?: UseMutationOptions<string, Error, UseCrossVmBatchTransactionMutateArgs>` – Optional TanStackQuery mutation options

#### Returns: `UseCrossVmBatchTransactionResult`

Where `UseCrossVmBatchTransactionResult` is defined as:

```typescript
interface UseCrossVmBatchTransactionResult extends Omit<
  UseMutationResult<string, Error, UseCrossVmBatchTransactionMutateArgs>,
  "mutate" | "mutateAsync"
> {
  mutate: (calls: UseCrossVmBatchTransactionMutateArgs) => void
  mutateAsync: (calls: UseCrossVmBatchTransactionMutateArgs) => Promise<string>
}
```

Where `UseCrossVmBatchTransactionMutateArgs` is defined as:

```typescript
interface UseCrossVmBatchTransactionMutateArgs {
  calls: EvmBatchCall[]
  mustPass?: boolean
}
```

Where `EvmBatchCall` is defined as:

```typescript
interface EvmBatchCall {
  // The target EVM contract address (as a string)
  address: string
  // The contract ABI fragment
  abi: Abi
  // The name of the function to call
  functionName: string
  // The function arguments
  args?: readonly unknown[]
  // The gas limit for the call
  gasLimit?: bigint
  // The value to send with the call
  value?: bigint
}
```

```tsx
function CrossVmBatchTransactionExample() {
  const { sendBatchTransaction, isPending, error, data: txId } = useCrossVmBatchTransaction({
    mutation: {
      onSuccess: (txId) => console.log("TX ID:", txId),
    },
  })

  const sendTransaction = () => {
    const calls = [
      {
        address: "0x1234567890abcdef",
        abi: {
          // ABI definition for the contract
        },
        functionName: "transfer",
        args: ["0xabcdef1234567890", 100n], // Example arguments
        gasLimit: 21000n, // Example gas limit
      },
      // Add more calls as needed
    ]

    sendBatchTransaction({calls})
  }

  return (
    <div>
      <button onClick={sendTransaction} disabled={isPending}>
        Send Cross-VM Transaction
      </button>
      {isPending && <p>Sending transaction...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useCrossVmTokenBalance`

```tsx
import { useCrossVmTokenBalance } from "@onflow/kit"
```

Fetch the balance of a token balance for a given user across both Cadence and EVM environments.

#### Parameters:

- `owner: string` – Cadence address of the account whose token balances you want.
- `vaultIdentifier?: string` – Optional Cadence resource identifier (e.g. "0x1cf0e2f2f715450.FlowToken.Vault") for on-chain balance
- `erc20AddressHexArg?: string` – Optional bridged ERC-20 contract address (hex) for EVM/COA balance
- `query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">` – Optional TanStack Query config (e.g. staleTime, enabled)

> **Note:** You must pass `owner`, and one of `vaultIdentifier` or `erc20AddressHexArg`.

#### Returns: `UseQueryResult<UseCrossVmTokenBalanceData | null, Error>`

Where `UseCrossVmTokenBalanceData` is defined as:

```typescript
interface UseCrossVmTokenBalanceData {
  cadence: TokenBalance // Token balance of Cadence vault
  evm: TokenBalance // Token balance of EVM (COA stored in /storage/coa)
  combined: TokenBalance // Combined balance of both Cadence and EVM
}
```

Where `TokenBalance` is defined as:

```typescript
interface TokenBalance {
  value: bigint // Balance value in smallest unit
  formatted: string // Formatted balance string (e.g. "123.45")
  precision: number // Number of decimal places for the token
}
```

```tsx
function UseCrossVmTokenBalanceExample() {
  const { data, isLoading, error, refetch } = useCrossVmTokenBalance({
    owner: '0x1e4aa0b87d10b141',
    vaultIdentifier: 'A.1654653399040a61.FlowToken.Vault',
    query: { staleTime: 10000 },
  });

  if (isLoading) return <p>Loading token balance...</p>;
  if (error) return <p>Error fetching token balance: {error.message}</p>;

  return (
    <div>
      <h2>Token Balances</h2>
      <p>Cadence Balance: {data.cadence.formatted} (Value: {data.cadence.value})</p>
      <p>EVM Balance: {data.evm.formatted} (Value: {data.evm.value})</p>
      <p>Combined Balance: {data.combined.formatted} (Value: {data.combined.value})</p>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}
```

---

### `useCrossVmSpendNft`

```tsx
import { useCrossVmSpendNft } from "@onflow/kit"
```

Bridge NFTs from Cadence to Flow EVM and execute arbitrary EVM transactions to atomically spend them.

#### Parameters:
- `mutation?: UseMutationOptions<string, Error, UseCrossVmSpendFtMutateArgs>` – Optional TanStackQuery mutation options

Where `UseCrossVmSpendFtMutateArgs` is defined as:

```typescript
interface UseCrossVmSpendFtMutateArgs {
  nftIdentifier: string // Cadence NFT identifier (e.g. "0x1cf0e2f2f715450.FlowNFT")
  nftIds: string[] // Array of NFT IDs to bridge
  calls: EVMBatchCall[] // Array of EVM calls to execute atomically
}
```

#### Returns: `UseCrossVmSpendNftResult`

Where `UseCrossVmSpendNftResult` is defined as:

```typescript
interface UseCrossVmSpendNftResult extends Omit<
  UseMutationResult<string, Error, CrossVmSpendNftParams>,
  "mutate" | "mutateAsync"
> {
  spendNft: (params: CrossVmSpendNftParams) => Promise<string>
  spendNftAsync: (params: CrossVmSpendNftParams) => Promise<string>
}
```

```tsx
function CrossVmSpendNftExample() {
  const { spendNft, isPending, error, data: txId } = useCrossVmSpendNft()

  const handleSpendNft = () => {
    spendNft({
      nftIdentifier: "0x1cf0e2f2f715450.FlowNFT", // Cadence NFT identifier
      nftIds: ["1"], // Array of NFT IDs to bridge
      calls: [
        {
          abi: contractAbi, // ABI of the EVM contract
          contractAddress: "0x1234567890abcdef1234567890abcdef12345678", // EVM contract address
          functionName: "transferNFT",
          args: ["123"], // Example args
          value: "1000000000000000000", // Amount in wei (if applicable)
          gasLimit: "21000", // Gas limit for the EVM call
        },
      ],
    })
  }

  return (
    <div>
      <button onClick={handleSpendNft} disabled={isPending}>
        Bridge and Spend NFT
      </button>
      {isPending && <p>Sending transaction...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useCrossVmSpendToken`

```tsx
import { useCrossVmSpendToken } from "@onflow/kit"
```

Bridge FTs from Cadence to Flow EVM and execute arbitrary EVM transactions to atomically spend them.

#### Parameters:
- `mutation?: UseMutationOptions<string, Error, UseCrossVmSpendTokenMutateArgs>` – Optional TanStackQuery mutation options

Where `UseCrossVmSpendTokenMutateArgs` is defined as:

```typescript
interface UseCrossVmSpendTokenMutateArgs {
  vaultIdentifier: string; // Cadence vault identifier (e.g. "0x1cf0e2f2f715450.ExampleToken.Vault")
  amount: string; // Amount of tokens to bridge, as a decimal string (e.g. "1.23")
  calls: EVMBatchCall[]; // Array of EVM calls to execute after bridging
}
```

#### Returns: `UseCrossVmSpendTokenResult`

Where `UseCrossVmSpendTokenResult` is defined as:

```typescript
interface UseCrossVmSpendTokenResult extends Omit<
  UseMutationResult<string, Error, UseCrossVmSpendTokenMutateArgs>,
  "mutate" | "mutateAsync"
> {
  spendToken: (args: UseCrossVmSpendTokenMutateArgs) => void; // Function to trigger the FT bridging and EVM calls
  spendTokenAsync: (args: UseCrossVmSpendTokenMutateArgs) => Promise<string>; // Async version of spendToken
}
```

```tsx
function CrossVmSpendTokenExample() {
  const { spendToken, isPending, error, data: txId } = useCrossVmSpendToken()

  const handleSpendToken = () => {
    spendToken({
      vaultIdentifier: "0x1cf0e2f2f715450.ExampleToken.Vault", // Cadence vault identifier
      amount: "1.23", // Amount of tokens to bridge to EVM
      calls: [
        {
          abi: myEvmContractAbi, // EVM contract ABI
          address: "0x01234567890abcdef01234567890abcdef", // EVM contract address
          function: "transfer", // EVM function to call
          args: [
            "0xabcdef01234567890abcdef01234567890abcdef", // Recipient address
          ],
        },
      ],
    })
  }

  return (
    <div>
      <button onClick={handleSpendToken} disabled={isPending}>
        Bridge and Spend FTs
      </button>
      {isPending && <p>Sending transaction...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Cadence Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useCrossVmTransactionStatus`

```tsx
import { useCrossVmTransactionStatus } from "@onflow/kit"
```

Subscribes to status updates for a given Cross-VM Flow transaction ID that executes EVM calls. This hook monitors the transaction status and extracts EVM call results if available.

#### Parameters:

- `id?: string` – Optional Flow transaction ID to monitor

#### Returns: `UseCrossVmTransactionStatusResult`

Where `UseCrossVmTransactionStatusResult` is defined as:

```typescript
interface UseCrossVmTransactionStatusResult {
  transactionStatus: TransactionStatus | null // Latest transaction status, or null before any update
  evmResults?: CallOutcome[] // EVM transaction results, if available
  error: Error | null // Any error encountered during status updates
}
```

Where `CallOutcome` is defined as:

```typescript
interface CallOutcome {
  status: "passed" | "failed" | "skipped" // Status of the EVM call
  hash?: string // EVM transaction hash if available
  errorMessage?: string // Error message if the call failed
}
```

```tsx
function CrossVmTransactionStatusComponent() {
  const txId = "your-cross-vm-transaction-id-here"
  const { transactionStatus, evmResults, error } = useCrossVmTransactionStatus({ id: txId })

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div>Flow Status: {transactionStatus?.statusString}</div>
      {evmResults && evmResults.length > 0 && (
        <div>
          <h3>EVM Call Results:</h3>
          <ul>
            {evmResults.map((result, idx) => (
              <li key={idx}>
                Status: {result.status}
                {result.hash && <span> | Hash: {result.hash}</span>}
                {result.errorMessage && <span> | Error: {result.errorMessage}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

[commit-reveal scheme]: ../../build/advanced-concepts/randomness#commit-reveal-scheme
[Configuration Guide]: ../flow-cli/flow.json/configuration.md
