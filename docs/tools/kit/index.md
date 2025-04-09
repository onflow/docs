---
title: "@onflow/kit"
description: React hooks for interacting with the Flow blockchain.
sidebar_position: 2
---

# @onflow/kit

:::warning

🚧 This library is currently in alpha and is subject to change.

:::

`@onflow/kit` is a lightweight React utility library that simplifies interacting with the Flow blockchain. It provides a collection of hooks, similar to those in other popular web3 libraries, that make it easier to build frontends that understand blockchain interactions.  **In the future**, it will also provided components designed to make authentication, script execution, transactions, event subscriptions, and network configuration seamless in React apps.

## 🔌 Included React Hooks

- [`useCurrentFlowUser`](#usecurrentflowuser) – Authenticate and manage the current Flow user
- [`useFlowAccount`](#useflowaccount) – Fetch Flow account details by address
- [`useFlowBlock`](#useflowblock) – Query latest or specific Flow blocks
- [`useFlowConfig`](#useflowconfig) – Access the current Flow configuration
- [`useFlowEvents`](#useflowevents) – Subscribe to Flow events in real-time
- [`useFlowQuery`](#useflowquery) – Execute Cadence scripts with optional arguments
- [`useFlowMutate`](#useflowmutate) – Send transactions to the Flow blockchain
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
        // include other typed configuration keys as needed...
      }}
      flowJson={flowJSON}
    >
      <App />
    </FlowProvider>
  )
}

export default Root
```

If you're using [Next.js], put this in `layout.tsx`.  Adapt as appropriate for other frontend frameworks.

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

#### Returns: `UseQueryResult<Account | null, Error>`

```tsx
function AccountDetails() {
  const { data: account, isLoading, error, refetch } = useFlowAccount("0x1cf0e2f2f715450")

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

#### Parameters (mutually exclusive):

- `{}` – Latest block (default)
- `{ sealed: true }` – Latest sealed block
- `{ id: string }` – Block by ID
- `{ height: number }` – Block by height

#### Returns: `UseQueryResult<Block | null, Error>`

```tsx
function LatestBlock() {
  const { data: block, isLoading, error } = useFlowBlock()
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

- `eventNameOrFilter`: string | EventFilter
- `options: { onEvent: (event) => void, onError?: (error) => void }`

#### Example:

```tsx
function EventListener() {
  useFlowEvents("A.0xDeaDBeef.SomeContract.SomeEvent", {
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
- `enabled?: boolean` – Defaults to `true`

#### Returns: `UseQueryResult<unknown, Error>`

```tsx
function QueryExample() {
  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: `
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    args: (arg, t) => [arg(1, t.Int), arg(2, t.Int)],
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

#### Returns: `UseMutationResult<string, Error, FCLMutateParams>`

- `mutate`: A function to send the transaction
- `data`: Transaction ID
- `error`: Any error
- `isPending`: Boolean status

```tsx
function CreatePage() {
  const { mutate, isPending, error, data: txId } = useFlowMutate()

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

### `useFlowTransaction`

```tsx
import { useFlowTransaction } from "@onflow/kit"
```

#### Parameters:

- `txId: string` – Transaction ID to subscribe to

#### Returns:

- `transactionStatus: TransactionStatus | null`
- `error: Error | null`

```tsx
function TransactionComponent() {
  const txId = "your-transaction-id-here"
  const { transactionStatus, error } = useFlowTransaction(txId)

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      Status: {transactionStatus?.statusString}
    </div>
  )
}
