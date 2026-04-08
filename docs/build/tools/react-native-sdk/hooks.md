---
title: 'Hooks'
description: React hooks for interacting with the Flow blockchain in React Native.
sidebar_position: 2
---

:::info

Many of these hooks are built using [`@tanstack/react-query`](https://tanstack.com/query/latest), which provides powerful caching, revalidation, and background refetching features. As a result, you'll see return types like `UseQueryResult` and `UseMutationResult` throughout this section. Other types—such as `Account`, `Block`, and `CurrentUser`—are from the [Flow Client Library (FCL) TypeDefs](https://github.com/onflow/fcl-js/blob/master/packages/typedefs/src/index.ts). Refer to their respective documentation for full type definitions and usage patterns.

:::

## Cadence Hooks

### `useFlowCurrentUser`

```tsx
import { useFlowCurrentUser } from "@onflow/react-native-sdk"
```

#### Parameters

- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns:

- `user: CurrentUser` – The current user object from FCL
- `authenticate: () => Promise<CurrentUser>` – Triggers wallet authentication
- `unauthenticate: () => void` – Logs the user out

```tsx
import { View, Text, TouchableOpacity } from 'react-native';

function AuthComponent() {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser()

  return (
    <View>
      {user?.loggedIn ? (
        <View>
          <Text>Logged in as {user?.addr}</Text>
          <TouchableOpacity onPress={unauthenticate}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={authenticate}>
          <Text>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
```

---

### `useFlowAccount`

```tsx
import { useFlowAccount } from "@onflow/react-native-sdk"
```

#### Parameters:

- `address?: string` – Flow address (with or without `0x` prefix)
- `query?: UseQueryOptions<Account | null, Error>` – Optional TanStackQuery options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<Account | null, Error>`

```tsx
import { View, Text, TouchableOpacity } from 'react-native';

function AccountDetails() {
  const { data: account, isLoading, error, refetch } = useFlowAccount({
    address: "0x1cf0e2f2f715450",
    query: { staleTime: 5000 },
  })

  if (isLoading) return <Text>Loading account...</Text>
  if (error) return <Text>Error fetching account: {error.message}</Text>
  if (!account) return <Text>No account data</Text>

  return (
    <View>
      <Text>Account: {account.address}</Text>
      <Text>Balance: {account.balance}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Refetch</Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

### `useFlowBlock`

```tsx
import { useFlowBlock } from "@onflow/react-native-sdk"
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
import { View, Text } from 'react-native';

function LatestBlock() {
  const { data: block, isLoading, error } = useFlowBlock({ query: { staleTime: 10000 } })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>
  if (!block) return <Text>No block data.</Text>

  return (
    <View>
      <Text>Block {block.height}</Text>
      <Text>ID: {block.id}</Text>
    </View>
  )
}
```

---

### `useFlowChainId`

```tsx
import { useFlowChainId } from "@onflow/react-native-sdk"
```

This hook retrieves the Flow chain ID, which is useful for identifying the current network.

#### Parameters:

- `query?: Omit<UseQueryOptions<string | null>, "queryKey" | "queryFn">` – Optional TanStack Query options like `staleTime`, `enabled`, etc.
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<string | null, Error>`

Valid chain IDs include: `testnet` (Flow Testnet), `mainnet` (Flow Mainnet), and `emulator` (Flow Emulator). The `flow-` prefix will be stripped from the chain ID returned by the access node (e.g. `flow-testnet` will return `testnet`).

```tsx
import { View, Text } from 'react-native';

function ChainIdExample() {
  const { data: chainId, isLoading, error } = useFlowChainId({
    query: { staleTime: 10000 },
  })

  if (isLoading) return <Text>Loading chain ID...</Text>
  if (error) return <Text>Error fetching chain ID: {error.message}</Text>

  return <Text>Current Flow Chain ID: {chainId}</Text>
}
```

---

### `useFlowClient`

This hook returns the `FlowClient` for the current `<FlowProvider />` context.

#### Parameters:

- `flowClient?: FlowClient` - Optional `FlowClient` instance to override the result

---

### `useFlowConfig`

```tsx
import { useFlowConfig } from "@onflow/react-native-sdk"
```

#### Returns: `FlowConfig`

```tsx
import { View, Text } from 'react-native';

function MyComponent() {
  const config = useFlowConfig()

  return (
    <View>
      <Text>Current network: {config.flowNetwork}</Text>
      <Text>Current access node: {config.accessNodeUrl}</Text>
    </View>
  )
}
```

---

### `useFlowEvents`

```tsx
import { useFlowEvents } from "@onflow/react-native-sdk"
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
import { View, Text } from 'react-native';

function EventListener() {
  useFlowEvents({
    eventTypes: ["A.0xDeaDBeef.SomeContract.SomeEvent"],
    onEvent: (event) => console.log("New event:", event),
    onError: (error) => console.error("Error:", error),
  })

  return <Text>Listening for events...</Text>
}
```

---

### `useFlowQuery`

```tsx
import { useFlowQuery } from "@onflow/react-native-sdk"
```

#### Parameters:

- `cadence: string` – Cadence script to run
- `args?: (arg, t) => unknown[]` – Function returning FCL arguments
- `query?: UseQueryOptions<unknown, Error>` – Optional TanStackQuery options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<unknown, Error>`

```tsx
import { View, Text, TouchableOpacity } from 'react-native';

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

  if (isLoading) return <Text>Loading query...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <View>
      <Text>Result: {data}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Refetch</Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

### `useFlowQueryRaw`

```tsx
import { useFlowQueryRaw } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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

  if (isLoading) return <Text>Loading query...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <View>
      <Text>Raw Result: {JSON.stringify(rawData, null, 2)}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Refetch</Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

### `useFlowMutate`

```tsx
import { useFlowMutate } from "@onflow/react-native-sdk"
```

#### Parameters:

- `mutation?: UseMutationOptions<string, Error, FCLMutateParams>` – Optional TanStackQuery mutation options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseMutationResult<string, Error, FCLMutateParams>`

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import * as fcl from '@onflow/fcl';

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
    <View>
      <TouchableOpacity onPress={sendTransaction} disabled={isPending}>
        <Text>Send Transaction</Text>
      </TouchableOpacity>
      {isPending && <Text>Sending transaction...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

### `useFlowRevertibleRandom`

```tsx
import { useFlowRevertibleRandom } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

function RandomValues() {
  const { data: randoms, isLoading, error, refetch } = useFlowRevertibleRandom({
    min: "0",
    max: "1000000000000000000000000",
    count: 3,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <Text>Loading random numbers...</Text>
  if (error) return <Text>Error fetching random numbers: {error.message}</Text>
  if (!randoms) return <Text>No random values generated.</Text>

  return (
    <View>
      <Text>Generated Random Numbers</Text>
      <FlatList
        data={randoms}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text>Block {item.blockHeight}: {item.value}</Text>
        )}
      />
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Regenerate</Text>
      </TouchableOpacity>
    </View>
  )
}
```

#### Notes:

* Randomness is generated using the **onchain `revertibleRandom`** function on Flow, producing pseudorandom values tied to block and script execution.
* Values are **deterministic**: The values returned for identical calls within the same block will be identical.
* If `count` is larger than one, the returned values are distinct.
* This hook is designed for simple use cases that don't require unpredictability, such as randomized UIs.
  Since the hook uses script executions on existing blocks, the random source is already public and the randoms are predictable.
* For **more advanced use cases** that **do** require onchain randomness logic via transactions, Flow provides built-in support using Cadence's `revertibleRandom` and [commit-reveal scheme].

[commit-reveal scheme]: ../../cadence/advanced-concepts/randomness#commit-reveal-scheme

---

### `useFlowTransaction`

```tsx
import { useFlowTransaction } from "@onflow/react-native-sdk"
```

Fetches a Flow transaction by ID and returns the decoded transaction object.

#### Parameters:

* `txId?: string` – The Flow transaction ID or scheduled transaction ID to fetch.
* `query?: Omit<UseQueryOptions<Transaction | null, Error>, "queryKey" | "queryFn">` – Optional TanStack Query options like `staleTime`, `enabled`, etc.
* `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<Transaction | null, Error>`

```tsx
import { View, Text, TouchableOpacity } from 'react-native';

function TransactionDetails({ txId }: { txId: string }) {
  const { data: transaction, isLoading, error, refetch } = useFlowTransaction({
    txId,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <Text>Loading transaction...</Text>
  if (error) return <Text>Error fetching transaction: {error.message}</Text>
  if (!transaction) return <Text>No transaction data.</Text>

  return (
    <View>
      <Text>Transaction ID: {transaction.id}</Text>
      <Text>Gas Limit: {transaction.gasLimit}</Text>
      <Text>Arguments: {JSON.stringify(transaction.arguments, null, 2)}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Refetch</Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

### `useFlowTransactionStatus`

```tsx
import { useFlowTransactionStatus } from "@onflow/react-native-sdk"
```

#### Parameters:

- `id: string` – Transaction ID or scheduled transaction ID to subscribe to
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns:

- `transactionStatus: TransactionStatus | null`
- `error: Error | null`

```tsx
import { View, Text } from 'react-native';

function TransactionStatusComponent() {
  const txId = "your-transaction-id-here"
  const { transactionStatus, error } = useFlowTransactionStatus({ id: txId })

  if (error) return <Text>Error: {error.message}</Text>

  return <Text>Status: {transactionStatus?.statusString}</Text>
}
```

---

### `useFlowNftMetadata`

```tsx
import { useFlowNftMetadata } from "@onflow/react-native-sdk"
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
import { View, Text, Image, FlatList } from 'react-native';

function NftMetadataExample() {
  const { data: nft, isLoading, error } = useFlowNftMetadata({
    accountAddress: "0x1cf0e2f2f715450",
    tokenId: "123",
    publicPathIdentifier: "exampleNFTCollection",
    query: { staleTime: 60000 },
  })

  if (isLoading) return <Text>Loading NFT metadata...</Text>
  if (error) return <Text>Error: {error.message}</Text>
  if (!nft) return <Text>NFT not found</Text>

  return (
    <View>
      <Text>{nft.name}</Text>
      <Image source={{ uri: nft.thumbnailUrl }} style={{ width: 200, height: 200 }} />
      <Text>{nft.description}</Text>
      {nft.collectionName && <Text>Collection: {nft.collectionName}</Text>}
      {nft.rarity && <Text>Rarity: {nft.rarity}</Text>}
      {nft.traits && (
        <View>
          <Text>Traits:</Text>
          {Object.entries(nft.traits).map(([key, value]) => (
            <Text key={key}>{key}: {value}</Text>
          ))}
        </View>
      )}
    </View>
  )
}
```

---

### `useFlowAuthz`

```tsx
import { useFlowAuthz } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';
import * as fcl from '@onflow/fcl';

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

  return (
    <TouchableOpacity onPress={sendTransaction}>
      <Text>Send Transaction</Text>
    </TouchableOpacity>
  )
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

  return (
    <TouchableOpacity onPress={sendTransaction}>
      <Text>Send Custom Auth Transaction</Text>
    </TouchableOpacity>
  )
}
```

---

### `useFlowScheduledTransaction`

```tsx
import { useFlowScheduledTransaction } from "@onflow/react-native-sdk"
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
import { View, Text } from 'react-native';

function ScheduledTransactionDetails({ txId }: { txId: string }) {
  const { data: transaction, isLoading, error } = useFlowScheduledTransaction({
    txId,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <Text>Loading scheduled transaction...</Text>
  if (error) return <Text>Error: {error.message}</Text>
  if (!transaction) return <Text>Transaction not found</Text>

  return (
    <View>
      <Text>Scheduled Transaction #{transaction.id}</Text>
      <Text>Status: {transaction.status}</Text>
      <Text>Priority: {transaction.priority}</Text>
      <Text>Fees: {transaction.fees.formatted} FLOW</Text>
      <Text>Handler: {transaction.handlerTypeIdentifier}</Text>
    </View>
  )
}
```

---

### `useFlowScheduledTransactionList`

```tsx
import { useFlowScheduledTransactionList } from "@onflow/react-native-sdk"
```

Lists all scheduled transactions for an account.

#### Parameters:

- `account?: string` – Flow address to query
- `includeHandlerData?: boolean` – Include handler data (default: false)
- `query?: UseQueryOptions<ScheduledTransaction[], Error>` – Optional TanStack Query options
- `flowClient?: FlowClient` - Optional `FlowClient` instance

#### Returns: `UseQueryResult<ScheduledTransaction[], Error>`

```tsx
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

function ScheduledTransactionsList({ account }: { account: string }) {
  const { data: transactions, isLoading, error, refetch } = useFlowScheduledTransactionList({
    account,
    query: { staleTime: 10000 },
  })

  if (isLoading) return <Text>Loading scheduled transactions...</Text>
  if (error) return <Text>Error: {error.message}</Text>
  if (!transactions || transactions.length === 0) return <Text>No scheduled transactions</Text>

  return (
    <View>
      <Text>Scheduled Transactions for {account}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Refresh</Text>
      </TouchableOpacity>
      <FlatList
        data={transactions}
        keyExtractor={(tx) => tx.id}
        renderItem={({ item: tx }) => (
          <Text>
            Transaction #{tx.id} - Status: {tx.status} - Fees: {tx.fees.formatted} FLOW
          </Text>
        )}
      />
    </View>
  )
}
```

---

### `useFlowScheduledTransactionCancel`

```tsx
import { useFlowScheduledTransactionCancel } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View>
      <TouchableOpacity onPress={() => handleCancel("42")} disabled={isPending}>
        <Text>Cancel Scheduled Transaction #42</Text>
      </TouchableOpacity>
      {isPending && <Text>Canceling transaction...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Cancel Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

### `useFlowScheduledTransactionSetup`

```tsx
import { useFlowScheduledTransactionSetup } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View>
      <TouchableOpacity onPress={handleSetup} disabled={isPending}>
        <Text>Setup Transaction Scheduler</Text>
      </TouchableOpacity>
      {isPending && <Text>Setting up scheduler...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Setup Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

## Cross-VM Hooks

### `useCrossVmBatchTransaction`

```tsx
import { useCrossVmBatchTransaction } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
        args: ["0xabcdef1234567890", 100n],
        gasLimit: 21000n,
      },
    ]

    sendBatchTransaction({calls})
  }

  return (
    <View>
      <TouchableOpacity onPress={sendTransaction} disabled={isPending}>
        <Text>Send Cross-VM Transaction</Text>
      </TouchableOpacity>
      {isPending && <Text>Sending transaction...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

### `useCrossVmTokenBalance`

```tsx
import { useCrossVmTokenBalance } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

function UseCrossVmTokenBalanceExample() {
  const { data, isLoading, error, refetch } = useCrossVmTokenBalance({
    owner: '0x1e4aa0b87d10b141',
    vaultIdentifier: 'A.1654653399040a61.FlowToken.Vault',
    query: { staleTime: 10000 },
  });

  if (isLoading) return <Text>Loading token balance...</Text>
  if (error) return <Text>Error fetching token balance: {error.message}</Text>

  return (
    <View>
      <Text>Token Balances</Text>
      <Text>Cadence Balance: {data.cadence.formatted} (Value: {data.cadence.value.toString()})</Text>
      <Text>EVM Balance: {data.evm.formatted} (Value: {data.evm.value.toString()})</Text>
      <Text>Combined Balance: {data.combined.formatted} (Value: {data.combined.value.toString()})</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Refetch</Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

### `useCrossVmTransactionStatus`

```tsx
import { useCrossVmTransactionStatus } from "@onflow/react-native-sdk"
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
import { View, Text, FlatList } from 'react-native';

function CrossVmTransactionStatusComponent() {
  const txId = "your-cross-vm-transaction-id-here"
  const { transactionStatus, evmResults, error } = useCrossVmTransactionStatus({ id: txId })

  if (error) return <Text>Error: {error.message}</Text>

  return (
    <View>
      <Text>Flow Status: {transactionStatus?.statusString}</Text>
      {evmResults && evmResults.length > 0 && (
        <View>
          <Text>EVM Call Results:</Text>
          <FlatList
            data={evmResults}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View>
                <Text>Call {index}: {item.status}</Text>
                {item.hash && <Text>Hash: {item.hash}</Text>}
                {item.errorMessage && <Text>Error: {item.errorMessage}</Text>}
              </View>
            )}
          />
        </View>
      )}
    </View>
  )
}
```

---

### `useCrossVmBridgeNftFromEvm`

```tsx
import { useCrossVmBridgeNftFromEvm } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View>
      <TouchableOpacity onPress={handleBridge} disabled={isPending}>
        <Text>Bridge NFT from EVM</Text>
      </TouchableOpacity>
      {isPending && <Text>Bridging NFT...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

### `useCrossVmBridgeNftToEvm`

```tsx
import { useCrossVmBridgeNftToEvm } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View>
      <TouchableOpacity onPress={handleBridge} disabled={isPending}>
        <Text>Bridge NFTs to EVM</Text>
      </TouchableOpacity>
      {isPending && <Text>Bridging NFTs...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

### `useCrossVmBridgeTokenFromEvm`

```tsx
import { useCrossVmBridgeTokenFromEvm } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View>
      <TouchableOpacity onPress={handleBridge} disabled={isPending}>
        <Text>Bridge Tokens from EVM</Text>
      </TouchableOpacity>
      {isPending && <Text>Bridging tokens...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Transaction ID: {txId}</Text>}
    </View>
  )
}
```

---

### `useCrossVmBridgeTokenToEvm`

```tsx
import { useCrossVmBridgeTokenToEvm } from "@onflow/react-native-sdk"
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
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View>
      <TouchableOpacity onPress={handleBridge} disabled={isPending}>
        <Text>Bridge Tokens to EVM</Text>
      </TouchableOpacity>
      {isPending && <Text>Bridging tokens...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {txId && <Text>Transaction ID: {txId}</Text>}
    </View>
  )
}
```
