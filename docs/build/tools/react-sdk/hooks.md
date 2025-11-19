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

#### Parameters

- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns:

- `user: CurrentUser` – The current user object from FCL
- `authenticate: () => Promise<CurrentUser>` – Triggers wallet authentication
- `unauthenticate: () => void` – Logs the user out

:::note WalletConnect Support
To enable WalletConnect as a wallet option, add your registered project ID to the `walletconnectProjectId` field in your `FlowProvider` config.
:::

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

[commit-reveal scheme]: ../../cadence/advanced-concepts/randomness#commit-reveal-scheme

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

### `useFlowNftMetadata`

<PlaygroundButton href="https://react.flow.com/#useflownftmetadata" />

```tsx
import { useFlowNftMetadata } from "@onflow/react-sdk"
```

This hook fetches NFT metadata including display information, traits, rarity, and collection details.

#### Parameters:

- `accountAddress?: string` – Flow address of the account holding the NFT
- `tokenId?: string | number` – The NFT token ID
- `publicPathIdentifier?: string` – Public path identifier for the collection
- `query?: UseQueryOptions<unknown, Error>` – Optional TanStack Query options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<NftViewResult | null, Error>`

Where `NftViewResult` is defined as:

```typescript
interface NftViewResult {
  name: string
  description: string
  thumbnailUrl: string
  externalUrl?: string
  collectionName?: string
  collectionExternalUrl?: string
  tokenID: string
  traits?: Record<string, string>
  rarity?: string
  serialNumber?: string
}
```

```tsx
function NftMetadataExample() {
  const { data: nft, isLoading, error } = useFlowNftMetadata({
    accountAddress: "0x1cf0e2f2f715450",
    tokenId: "123",
    publicPathIdentifier: "exampleNFTCollection",
    query: { staleTime: 60000 },
  })

  if (isLoading) return <p>Loading NFT metadata...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!nft) return <p>NFT not found</p>

  return (
    <div>
      <h2>{nft.name}</h2>
      <img src={nft.thumbnailUrl} alt={nft.name} />
      <p>{nft.description}</p>
      {nft.collectionName && <p>Collection: {nft.collectionName}</p>}
      {nft.rarity && <p>Rarity: {nft.rarity}</p>}
      {nft.traits && (
        <div>
          <h3>Traits:</h3>
          <ul>
            {Object.entries(nft.traits).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

---

### `useFlowAuthz`

```tsx
import { useFlowAuthz } from "@onflow/react-sdk"
```

A React hook that returns an authorization function for Flow transactions. If no custom authorization is provided, it returns the current user's wallet authorization.

#### Parameters:

- `authz?: AuthorizationFunction` – Optional custom authorization function
- `flowClient?: FlowClient` - Optional `FlowClient` instance

Where `AuthorizationFunction` is defined as:

```typescript
type AuthorizationFunction = (
  account: Partial<InteractionAccount>
) => Partial<InteractionAccount> | Promise<Partial<InteractionAccount>>
```

#### Returns: `AuthorizationFunction`

The authorization function is compatible with Flow transactions' authorizations parameter.

```tsx
// Example 1: Using current user authorization
function CurrentUserAuthExample() {
  const authorization = useFlowAuthz()

  const sendTransaction = async () => {
    const txId = await fcl.mutate({
      cadence: `
        transaction {
          prepare(signer: auth(Storage) &Account) {
            log(signer.address)
          }
        }
      `,
      authorizations: [authorization],
      limit: 100,
    })
    console.log("Transaction ID:", txId)
  }

  return <button onClick={sendTransaction}>Send Transaction</button>
}
```

```tsx
// Example 2: Using custom authorization function
function CustomAuthExample() {
  const customAuthz = (account) => ({
    ...account,
    addr: "0xCUSTOMOADDRESS",
    keyId: 0,
    signingFunction: async (signable) => ({
      signature: "0x...",
    }),
  })

  const authorization = useFlowAuthz({ authz: customAuthz })

  const sendTransaction = async () => {
    const txId = await fcl.mutate({
      cadence: `
        transaction {
          prepare(signer: auth(Storage) &Account) {
            log(signer.address)
          }
        }
      `,
      authorizations: [authorization],
      limit: 100,
    })
    console.log("Transaction ID:", txId)
  }

  return <button onClick={sendTransaction}>Send Custom Auth Transaction</button>
}
```

---

### `useFlowScheduledTransaction`

<PlaygroundButton href="https://react.flow.com/#useflowscheduledtransaction" />

```tsx
import { useFlowScheduledTransaction } from "@onflow/react-sdk"
```

Fetches a scheduled transaction by ID.

#### Parameters:

- `txId?: string` – Scheduled transaction ID
- `includeHandlerData?: boolean` – Include handler data (default: false)
- `query?: UseQueryOptions<ScheduledTransaction | null, Error>` – Optional TanStack Query options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<ScheduledTransaction | null, Error>`

Where `ScheduledTransaction` is defined as:

```typescript
interface ScheduledTransaction {
  id: string
  priority: ScheduledTransactionPriority // 0 = Low, 1 = Medium, 2 = High
  executionEffort: bigint
  status: ScheduledTransactionStatus // 0 = Pending, 1 = Processing, 2 = Completed, 3 = Failed, 4 = Cancelled
  fees: {
    value: bigint
    formatted: string
  }
  scheduledTimestamp: number
  handlerTypeIdentifier: string
  handlerAddress: string
  handlerUUID?: string // Only included if includeHandlerData is true
  handlerResolvedViews?: {[viewType: string]: any} // Only included if includeHandlerData is true
}
```

```tsx
function ScheduledTransactionDetails({ txId }: { txId: string }) {
  const { data: transaction, isLoading, error } = useFlowScheduledTransaction({
    txId,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading scheduled transaction...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!transaction) return <p>Transaction not found</p>

  return (
    <div>
      <h2>Scheduled Transaction #{transaction.id}</h2>
      <p>Status: {transaction.status}</p>
      <p>Priority: {transaction.priority}</p>
      <p>Fees: {transaction.fees.formatted} FLOW</p>
      <p>Handler: {transaction.handlerTypeIdentifier}</p>
    </div>
  )
}
```

---

### `useFlowScheduledTransactionList`

<PlaygroundButton href="https://react.flow.com/#useflowscheduledtransaction" />

```tsx
import { useFlowScheduledTransactionList } from "@onflow/react-sdk"
```

Lists all scheduled transactions for an account.

#### Parameters:

- `account?: string` – Flow address to query
- `includeHandlerData?: boolean` – Include handler data (default: false)
- `query?: UseQueryOptions<ScheduledTransaction[], Error>` – Optional TanStack Query options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<ScheduledTransaction[], Error>`

```tsx
function ScheduledTransactionsList({ account }: { account: string }) {
  const { data: transactions, isLoading, error, refetch } = useFlowScheduledTransactionList({
    account,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <p>Loading scheduled transactions...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!transactions || transactions.length === 0) return <p>No scheduled transactions</p>

  return (
    <div>
      <h2>Scheduled Transactions for {account}</h2>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            Transaction #{tx.id} - Status: {tx.status} - Fees: {tx.fees.formatted} FLOW
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

### `useFlowScheduledTransactionCancel`

<PlaygroundButton href="https://react.flow.com/#useflowscheduledtransaction" />

```tsx
import { useFlowScheduledTransactionCancel } from "@onflow/react-sdk"
```

Cancels a scheduled transaction and refunds fees.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, string>` – Optional TanStack Query mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseFlowScheduledTransactionCancelResult`

Where `UseFlowScheduledTransactionCancelResult` is defined as:

```typescript
interface UseFlowScheduledTransactionCancelResult extends Omit<
  UseMutationResult<string, Error>,
  "mutate" | "mutateAsync"
> {
  cancelTransaction: (txId: string) => void
  cancelTransactionAsync: (txId: string) => Promise<string>
}
```

```tsx
function CancelScheduledTransaction() {
  const { cancelTransactionAsync, isPending, error, data: txId } = useFlowScheduledTransactionCancel({
    mutation: {
      onSuccess: (txId) => console.log("Cancel transaction ID:", txId),
    },
  })

  const handleCancel = async (scheduledTxId: string) => {
    try {
      const resultTxId = await cancelTransactionAsync(scheduledTxId)
      console.log("Successfully canceled scheduled transaction:", resultTxId)
    } catch (error) {
      console.error("Failed to cancel:", error)
    }
  }

  return (
    <div>
      <button onClick={() => handleCancel("42")} disabled={isPending}>
        Cancel Scheduled Transaction #42
      </button>
      {isPending && <p>Canceling transaction...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Cancel Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useFlowScheduledTransactionSetup`

<PlaygroundButton href="https://react.flow.com/#useflowscheduledtransaction" />

```tsx
import { useFlowScheduledTransactionSetup } from "@onflow/react-sdk"
```

Sets up the Transaction Scheduler Manager resource.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, void>` – Optional TanStack Query mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseFlowScheduledTransactionSetupResult`

Where `UseFlowScheduledTransactionSetupResult` is defined as:

```typescript
interface UseFlowScheduledTransactionSetupResult extends Omit<
  UseMutationResult<string, Error>,
  "mutate" | "mutateAsync"
> {
  setup: () => void
  setupAsync: () => Promise<string>
}
```

```tsx
function SchedulerSetup() {
  const { setupAsync, isPending, error, data: txId } = useFlowScheduledTransactionSetup({
    mutation: {
      onSuccess: (txId) => console.log("Setup transaction ID:", txId),
    },
  })

  const handleSetup = async () => {
    try {
      const resultTxId = await setupAsync()
      console.log("Scheduler setup successful:", resultTxId)
    } catch (error) {
      console.error("Setup failed:", error)
    }
  }

  return (
    <div>
      <button onClick={handleSetup} disabled={isPending}>
        Setup Transaction Scheduler
      </button>
      {isPending && <p>Setting up scheduler...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Setup Transaction ID: {txId}</p>}
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

---

### `useCrossVmBridgeNftFromEvm`

<PlaygroundButton href="https://react.flow.com/#usecrossvmbridgenftfromevm" />

```tsx
import { useCrossVmBridgeNftFromEvm } from "@onflow/react-sdk"
```

This hook bridges NFTs from Flow EVM to Cadence. It withdraws an NFT from the signer's COA (Cadence Owned Account) in EVM and deposits it into their Cadence collection.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmBridgeNftFromEvmTxMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseCrossVmBridgeNftFromEvmTxResult`

Where `UseCrossVmBridgeNftFromEvmTxResult` is defined as:

```typescript
interface UseCrossVmBridgeNftFromEvmTxResult extends Omit<
  UseMutationResult<string, Error>,
  "mutate" | "mutateAsync"
> {
  crossVmBridgeNftFromEvm: (args: UseCrossVmBridgeNftFromEvmTxMutateArgs) => void
  crossVmBridgeNftFromEvmAsync: (args: UseCrossVmBridgeNftFromEvmTxMutateArgs) => Promise<string>
}
```

Where `UseCrossVmBridgeNftFromEvmTxMutateArgs` is defined as:

```typescript
interface UseCrossVmBridgeNftFromEvmTxMutateArgs {
  nftIdentifier: string // Cadence type identifier (e.g., "A.0x123.MyNFT.NFT")
  nftId: string // EVM NFT ID as string representation of UInt256
}
```

```tsx
function BridgeNftFromEvmExample() {
  const { crossVmBridgeNftFromEvm, isPending, error, data: txId } = useCrossVmBridgeNftFromEvm({
    mutation: {
      onSuccess: (txId) => console.log("Transaction ID:", txId),
    },
  })

  const handleBridge = () => {
    crossVmBridgeNftFromEvm({
      nftIdentifier: "A.0x1cf0e2f2f715450.ExampleNFT.NFT",
      nftId: "123",
    })
  }

  return (
    <div>
      <button onClick={handleBridge} disabled={isPending}>
        Bridge NFT from EVM
      </button>
      {isPending && <p>Bridging NFT...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useCrossVmBridgeNftToEvm`

<PlaygroundButton href="https://react.flow.com/#usecrossvmbridgenfttoevm" />

```tsx
import { useCrossVmBridgeNftToEvm } from "@onflow/react-sdk"
```

This hook bridges NFTs from Cadence to Flow EVM and executes arbitrary EVM transactions atomically. It withdraws NFTs from the signer's Cadence collection and deposits them into their COA in EVM, then executes the provided EVM calls.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmBridgeNftToEvmTxMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseCrossVmBridgeNftToEvmTxResult`

Where `UseCrossVmBridgeNftToEvmTxResult` is defined as:

```typescript
interface UseCrossVmBridgeNftToEvmTxResult extends Omit<
  UseMutationResult<string, Error>,
  "mutate" | "mutateAsync"
> {
  crossVmBridgeNftToEvm: (args: UseCrossVmBridgeNftToEvmTxMutateArgs) => void
  crossVmBridgeNftToEvmAsync: (args: UseCrossVmBridgeNftToEvmTxMutateArgs) => Promise<string>
}
```

Where `UseCrossVmBridgeNftToEvmTxMutateArgs` is defined as:

```typescript
interface UseCrossVmBridgeNftToEvmTxMutateArgs {
  nftIdentifier: string // Cadence NFT type identifier
  nftIds: string[] // Array of NFT IDs to bridge
  calls: EvmBatchCall[] // Array of EVM calls to execute after bridging
}
```

```tsx
function BridgeNftToEvmExample() {
  const { crossVmBridgeNftToEvm, isPending, error, data: txId } = useCrossVmBridgeNftToEvm({
    mutation: {
      onSuccess: (txId) => console.log("Transaction ID:", txId),
    },
  })

  const handleBridge = () => {
    crossVmBridgeNftToEvm({
      nftIdentifier: "A.0x1cf0e2f2f715450.ExampleNFT.NFT",
      nftIds: ["1", "2", "3"],
      calls: [
        {
          address: "0x1234567890abcdef1234567890abcdef12345678",
          abi: myContractAbi,
          functionName: "transferNFT",
          args: ["0xRecipient", 1n],
          gasLimit: 100000n,
        },
      ],
    })
  }

  return (
    <div>
      <button onClick={handleBridge} disabled={isPending}>
        Bridge NFTs to EVM
      </button>
      {isPending && <p>Bridging NFTs...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useCrossVmBridgeTokenFromEvm`

<PlaygroundButton href="https://react.flow.com/#usecrossvmbridgetokenfromevm" />

```tsx
import { useCrossVmBridgeTokenFromEvm } from "@onflow/react-sdk"
```

This hook bridges fungible tokens from Flow EVM to Cadence. It withdraws tokens from the signer's COA in EVM and deposits them into their Cadence vault.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmBridgeTokenFromEvmMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseCrossVmBridgeTokenFromEvmResult`

Where `UseCrossVmBridgeTokenFromEvmResult` is defined as:

```typescript
interface UseCrossVmBridgeTokenFromEvmResult extends Omit<
  UseMutationResult<string, Error>,
  "mutate" | "mutateAsync"
> {
  crossVmBridgeTokenFromEvm: (args: UseCrossVmBridgeTokenFromEvmMutateArgs) => void
  crossVmBridgeTokenFromEvmAsync: (args: UseCrossVmBridgeTokenFromEvmMutateArgs) => Promise<string>
}
```

Where `UseCrossVmBridgeTokenFromEvmMutateArgs` is defined as:

```typescript
interface UseCrossVmBridgeTokenFromEvmMutateArgs {
  vaultIdentifier: string // Cadence vault type identifier (e.g., "A.0x123.FlowToken.Vault")
  amount: string // Amount as UInt256 string representation
}
```

```tsx
function BridgeTokenFromEvmExample() {
  const { crossVmBridgeTokenFromEvm, isPending, error, data: txId } = useCrossVmBridgeTokenFromEvm({
    mutation: {
      onSuccess: (txId) => console.log("Transaction ID:", txId),
    },
  })

  const handleBridge = () => {
    crossVmBridgeTokenFromEvm({
      vaultIdentifier: "A.0x1654653399040a61.FlowToken.Vault",
      amount: "1000000000", // Amount in smallest unit
    })
  }

  return (
    <div>
      <button onClick={handleBridge} disabled={isPending}>
        Bridge Tokens from EVM
      </button>
      {isPending && <p>Bridging tokens...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```

---

### `useCrossVmBridgeTokenToEvm`

<PlaygroundButton href="https://react.flow.com/#usecrossvmbridgetokentoevm" />

```tsx
import { useCrossVmBridgeTokenToEvm } from "@onflow/react-sdk"
```

This hook bridges fungible tokens from Cadence to Flow EVM and executes arbitrary EVM transactions atomically. It withdraws tokens from the signer's Cadence vault and deposits them into their COA in EVM, then executes the provided EVM calls.

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, UseCrossVmBridgeTokenToEvmMutateArgs>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseCrossVmBridgeTokenToEvmResult`

Where `UseCrossVmBridgeTokenToEvmResult` is defined as:

```typescript
interface UseCrossVmBridgeTokenToEvmResult extends Omit<
  UseMutationResult<string, Error>,
  "mutate" | "mutateAsync"
> {
  crossVmBridgeTokenToEvm: (args: UseCrossVmBridgeTokenToEvmMutateArgs) => void
  crossVmBridgeTokenToEvmAsync: (args: UseCrossVmBridgeTokenToEvmMutateArgs) => Promise<string>
}
```

Where `UseCrossVmBridgeTokenToEvmMutateArgs` is defined as:

```typescript
interface UseCrossVmBridgeTokenToEvmMutateArgs {
  vaultIdentifier: string // Cadence vault type identifier
  amount: string // Amount as decimal string (e.g., "1.5")
  calls: EvmBatchCall[] // Array of EVM calls to execute after bridging
}
```

```tsx
function BridgeTokenToEvmExample() {
  const { crossVmBridgeTokenToEvm, isPending, error, data: txId } = useCrossVmBridgeTokenToEvm({
    mutation: {
      onSuccess: (txId) => console.log("Transaction ID:", txId),
    },
  })

  const handleBridge = () => {
    crossVmBridgeTokenToEvm({
      vaultIdentifier: "A.0x1654653399040a61.FlowToken.Vault",
      amount: "10.5",
      calls: [
        {
          address: "0x1234567890abcdef1234567890abcdef12345678",
          abi: erc20Abi,
          functionName: "transfer",
          args: ["0xRecipient", 1000000n],
          gasLimit: 100000n,
        },
      ],
    })
  }

  return (
    <div>
      <button onClick={handleBridge} disabled={isPending}>
        Bridge Tokens to EVM
      </button>
      {isPending && <p>Bridging tokens...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  )
}
```
