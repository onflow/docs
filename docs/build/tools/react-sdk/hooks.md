---
title: 'Hooks'
description: React hooks for interacting with the Flow blockchain.
sidebar_position: 2
---

import PlaygroundButton from '@site/src/components/PlaygroundButton';

# React SDK Hooks

:::info

Many of these hooks are built using [`@tanstack/react-query`](https://tanstack.com/query/latest), which provides powerful caching, revalidation, and background refetching features. As a result, you'll see return types like `UseQueryResult` and `UseMutationResult` throughout this section. Other types—such as `Account`, `Block`, and `CurrentUser`—are from the [Flow Client Library (FCL) TypeDefs](https://github.com/onflow/fcl-js/blob/master/packages/typedefs/src/index.ts). Refer to their respective documentation for full type definitions and usage patterns.

:::

## Cadence Hooks

### `useFlowCurrentUser`

<PlaygroundButton href="https://react.flow.com/#useflowcurrentuser" />

```tsx
import { useFlowCurrentUser } from "@onflow/react-sdk"
```

### Parameters

- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowaccount" />

```tsx
import { useFlowAccount } from "@onflow/react-sdk"
```

#### Parameters:

- `address?: string` – Flow address (with or without `0x` prefix)
- `query?: UseQueryOptions<Account | null, Error>` – Optional TanStackQuery options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowblock" />

```tsx
import { useFlowBlock } from "@onflow/react-sdk"
```

#### Parameters:

- `sealed?: boolean` – If `true`, fetch latest sealed block
- `id?: string` – Block by ID
- `height?: number` – Block by height
- `query?: UseQueryOptions<Block | null, Error>` – Optional TanStackQuery options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowchainid" />

```tsx
import { useFlowChainId } from "@onflow/react-sdk"
```

This hook retrieves the Flow chain ID, which is useful for identifying the current network.

#### Parameters:

- `query?: Omit<UseQueryOptions<string | null>, "queryKey" | "queryFn">` – Optional TanStack Query options like `staleTime`, `enabled`, etc.
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

### `useFlowClient`

<PlaygroundButton href="https://react.flow.com/#useflowclient" />

This hook returns the `FlowClient` for the current `<FlowProvider />` context.

#### Parameters:

- `flowClient?: FlowClient` - Optional `FlowClient` instance to override the result

---

### `useFlowConfig`

<PlaygroundButton href="https://react.flow.com/#useflowconfig" />

```tsx
import { useFlowConfig } from "@onflow/react-sdk"
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

<PlaygroundButton href="https://react.flow.com/#useflowevents" />

```tsx
import { useFlowEvents } from "@onflow/react-sdk"
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
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowquery" />

```tsx
import { useFlowQuery } from "@onflow/react-sdk"
```

#### Parameters:

- `cadence: string` – Cadence script to run
- `args?: (arg, t) => unknown[]` – Function returning FCL arguments
- `query?: UseQueryOptions<unknown, Error>` – Optional TanStackQuery options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowqueryraw" />

```tsx
import { useFlowQueryRaw } from "@onflow/react-sdk"
```

This hook is identical to `useFlowQuery` but returns the raw, non-decoded response data from the Flow blockchain. This is useful when you need access to the original response structure or want to handle decoding manually.

#### Parameters:

- `cadence: string` – Cadence script to run
- `args?: (arg, t) => unknown[]` – Function returning FCL arguments
- `query?: UseQueryOptions<unknown, Error>` – Optional TanStackQuery options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowmutate" />

```tsx
import { useFlowMutate } from "@onflow/react-sdk"
```

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, FCLMutateParams>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowrevertiblerandom" />

```tsx
import { useFlowRevertibleRandom } from "@onflow/react-sdk"
```

#### Parameters:

- `min?: string` – Minimum random value (inclusive), as a UInt256 decimal string. Defaults to `"0"`.
- `max: string` – Maximum random value (inclusive), as a UInt256 decimal string. **Required**.
- `count?: number` – Number of random values to fetch (must be at least 1). Defaults to `1`.
- `query?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">` – Optional TanStack Query settings like `staleTime`, `enabled`, `retry`, etc.
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

* Randomness is generated using the **onchain `revertibleRandom`** function on Flow, producing pseudorandom values tied to block and script execution.
* Values are **deterministic**: The values returned for identical calls within the same block will be identical.
* If `count ` is larger than one, the returned values are distinct.
* This hook is designed for simple use cases that don't require unpredictability, such as randomized UIs.
  Since the hook uses script executions on existing blocks, the random source is already public and the randoms are predictable.
* For **more advanced use cases** that **do** require onchain randomness logic via transactions, Flow provides built-in support using Cadence's `revertibleRandom` and [commit-reveal scheme].

---

### `useFlowTransaction`

<PlaygroundButton href="https://react.flow.com/#useflowtransaction" />

```tsx
import { useFlowTransaction } from "@onflow/react-sdk"
```

Fetches a Flow transaction by ID and returns the decoded transaction object.

#### Parameters:

* `txId?: string` – The Flow transaction ID to fetch.
* `query?: Omit<UseQueryOptions<Transaction | null, Error>, "queryKey" | "queryFn">` – Optional TanStack Query options like `staleTime`, `enabled`, etc.
* `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#useflowtransactionstatus" />

```tsx
import { useFlowTransactionStatus } from "@onflow/react-sdk"
```

#### Parameters:

- `id: string` – Transaction ID to subscribe to
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

### `useDarkMode`

<PlaygroundButton href="https://react.flow.com/#usedarkmode" />

```tsx
import { useDarkMode } from "@onflow/react-sdk"
```

This hook provides access to the current dark mode state from the `FlowProvider`. It's useful for conditionally rendering content or applying custom styling based on the current theme.

#### Returns:

- `isDark: boolean` – Whether dark mode is currently enabled

```tsx
function ThemeAwareComponent() {
  const { isDark } = useDarkMode()

  return (
    <div className={isDark ? "bg-gray-900 text-white" : "bg-white text-black"}>
      <h2>Current Theme: {isDark ? "Dark" : "Light"}</h2>
      <p>This component adapts to the current theme!</p>
    </div>
  )
}
```

---

## Cross-VM Hooks

### `useCrossVmBatchTransaction`

<PlaygroundButton href="https://react.flow.com/#usecrossvmbatchtransaction" />

```tsx
import { useCrossVmBatchTransaction } from "@onflow/react-sdk"
```

This hook allows you to execute multiple EVM transactions in a single atomic Cadence transaction. It is useful for batch processing EVM calls while ensuring they are executed together, either all succeeding or allowing for some to fail without affecting the others.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmBatchTransactionMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#usecrossvmtokenbalance" />

```tsx
import { useCrossVmTokenBalance } from "@onflow/react-sdk"
```

Fetch the balance of a token balance for a given user across both Cadence and EVM environments.

#### Parameters:

- `owner: string` – Cadence address of the account whose token balances you want.
- `vaultIdentifier?: string` – Optional Cadence resource identifier (e.g. "0x1cf0e2f2f715450.FlowToken.Vault") for onchain balance
- `erc20AddressHexArg?: string` – Optional bridged ERC-20 contract address (hex) for EVM/COA balance
- `query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">` – Optional TanStack Query config (e.g. staleTime, enabled)
- `flowClient?: FlowClient` - Optional `FlowClient` instance

> **Note:** You must pass `owner`, and one of `vaultIdentifier` or `erc20AddressHexArg`.
#### Returns: `UseQueryResult<UseCrossVmTokenBalanceData | null, Error>`

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

<PlaygroundButton href="https://react.flow.com/#usecrossvmspendnft" />

```tsx
import { useCrossVmSpendNft } from "@onflow/react-sdk"
```

Bridge NFTs from Cadence to Flow EVM and execute arbitrary EVM transactions to atomically spend them.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmSpendFtMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#usecrossvmspendtoken" />

```tsx
import { useCrossVmSpendToken } from "@onflow/react-sdk"
```

Bridge FTs from Cadence to Flow EVM and execute arbitrary EVM transactions to atomically spend them.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmSpendTokenMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

<PlaygroundButton href="https://react.flow.com/#usecrossvmtransactionstatus" />

```tsx
import { useCrossVmTransactionStatus } from "@onflow/react-sdk"
```

Subscribes to status updates for a given Cross-VM Flow transaction ID that executes EVM calls. This hook monitors the transaction status and extracts EVM call results if available.

#### Parameters:

- `id?: string` – Optional Flow transaction ID to monitor
- `flowClient?: FlowClient` - Optional `FlowClient` instance

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

[commit-reveal scheme]: ../../cadence/advanced-concepts/randomness#commit-reveal-scheme