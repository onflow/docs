---
title: '@onflow/kit'
description: React hooks for interacting with the Flow blockchain.
sidebar_position: 1
---

# @onflow/kit

`@onflow/kit` is a lightweight React utility library that simplifies interacting with the Flow blockchain. It provides a collection of hooks, similar to those in other popular web3 libraries, that make it easier to build frontends that understand blockchain interactions. **In the future**, it will also provide components designed to make authentication, script execution, transactions, event subscriptions, and network configuration seamless in React apps.

## 🔌 Included React Hooks

- [`useCurrentFlowUser`](#usecurrentflowuser) – Authenticate and manage the current Flow user
- [`useFlowAccount`](#useflowaccount) – Fetch Flow account details by address
- [`useFlowBlock`](#useflowblock) – Query latest or specific Flow blocks
- [`useFlowConfig`](#useflowconfig) – Access the current Flow configuration
- [`useFlowEvents`](#useflowevents) – Subscribe to Flow events in real-time
- [`useFlowQuery`](#useflowquery) – Execute Cadence scripts with optional arguments
- [`useFlowMutate`](#useflowmutate) – Send transactions to the Flow blockchain
- [`useFlowRevertibleRandom`](#useflowrevertiblerandom) – Generate pseudorandom values tied to block height
- [`useFlowTransaction`](#useflowtransaction) – Track transaction status updates

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

If you're using Next.js, put this in `layout.tsx`. Adapt as appropriate for other frontend frameworks.

👉 Learn more about configuring `flow.json` in the [Configuration Guide].

---

## Hooks

:::info

Many of these hooks are built using [`@tanstack/react-query`](https://tanstack.com/query/latest), which provides powerful caching, revalidation, and background refetching features. As a result, you’ll see return types like `UseQueryResult` and `UseMutationResult` throughout this section. Other types—such as `Account`, `Block`, and `CurrentUser`—are from the [Flow Client Library (FCL) TypeDefs](https://github.com/onflow/fcl-js/blob/master/packages/typedefs/src/index.ts). Refer to their respective documentation for full type definitions and usage patterns.

:::

### `useCurrentFlowUser`

```tsx
import { useCurrentFlowUser } from "@onflow/kit"
```

#### Returns:

- `user: CurrentUser` – The current user object from FCL
- `authenticate: () => Promise<CurrentUser>` – Triggers wallet authentication
- `unauthenticate: () => void` – Logs the user out

```tsx
function AuthComponent() {
  const { user, authenticate, unauthenticate } = useCurrentFlowUser()

  return (
    <div>
      {user.loggedIn ? (
        <>
          <p>Logged in as {user.addr}</p>
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

* Randomness is generated using Flow’s **on-chain `revertibleRandom`**, producing pseudorandom values tied to block and transaction execution.
* The value returned for identical calls within the same block will be identical.
* This hook is designed for simple use cases that **don’t require a [commit-reveal scheme]**, such as randomized UIs, loot crates, and temporary rewards.
* For **more advanced use cases** that **do** require a [commit-reveal scheme], Flow provides built-in support for that pattern.
* Values are **deterministic**: if a transaction fails and retries, the same random value will be regenerated.

---

### `useFlowTransaction`

```tsx
import { useFlowTransaction } from "@onflow/kit"
```

#### Parameters:

- `id: string` – Transaction ID to subscribe to

#### Returns:

- `transactionStatus: TransactionStatus | null`
- `error: Error | null`

```tsx
function TransactionComponent() {
  const txId = "your-transaction-id-here"
  const { transactionStatus, error } = useFlowTransaction({ id: txId })

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      Status: {transactionStatus?.statusString}
    </div>
  )
}
```

[commit-reveal scheme]: ../../build/advanced-concepts/randomness#commit-reveal-scheme
[Configuration Guide]: ../flow-cli/flow.json/configuration.md
