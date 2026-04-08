---
title: 'Components'
description: Reusable UI components for Flow interactions.
sidebar_position: 3
---

import { Connect, TransactionDialog, TransactionLink, TransactionButton } from "@onflow/react-sdk"
import { FlowProvider } from "@onflow/react-sdk"
import FlowProviderDemo from '@site/src/components/FlowProviderDemo';
import TransactionDialogDemo from '@site/src/components/TransactionDialogDemo';
import PlaygroundButton from '@site/src/components/PlaygroundButton';

# React SDK Components

## Components

### `Connect`

A drop-in wallet connection component with UI for copy address, logout, and balance display. Displays user scheduled transactions within its profile modal with support for multiple tokens.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#connect" /></div>

**Props:**

- `variant?: ButtonProps["variant"]` – Optional button style variant (default: `"primary"`).
- `onConnect?: () => void` – Callback triggered after successful authentication.
- `onDisconnect?: () => void` – Callback triggered after logout.
- `balanceType?: "cadence" | "evm" | "combined"` – Specifies which balance to display (default: `"cadence"`). Options:
  - `"cadence"`: Shows the token balance from the Cadence side.
  - `"evm"`: Shows the token balance from the Flow EVM side.
  - `"combined"`: Shows the total combined token balance from both sides.
- `balanceTokens?: TokenConfig[]` – Optional array of token configurations to display in the balance selector. Each `TokenConfig` requires:
  - `symbol: string` – Token symbol (for example, "FLOW", "USDC")
  - `name: string` – Full token name.
  - Either `vaultIdentifier: string` (for Cadence tokens) or `erc20Address: string` (for EVM tokens).
- `modalConfig?: ConnectModalConfig` – Optional configuration for the profile modal:
  - `scheduledTransactions.show?: boolean` – Whether to show the scheduled transactions tab (default: `false`).
  - `scheduledTransactions.filterHandlerTypes?: string[]` – Optional array of handler type identifiers to filter displayed transactions.
- `modalEnabled?: boolean` – Whether to show the profile modal on click when connected (default: `true`). When `false`, click the button when connected to disconnect.

:::note WalletConnect Support

To turn on WalletConnect as a wallet option, add your registered project ID to the `walletconnectProjectId` field in your `FlowProvider` config.

:::

```tsx
import { Connect } from "@onflow/react-sdk"

<Connect
  onConnect={() => console.log("Connected!")}
  onDisconnect={() => console.log("Logged out")}
/>
```

#### Live Demo

<FlowProviderDemo>
  <Connect
    onConnect={() => console.log("Connected!")}
    onDisconnect={() => console.log("Logged out")}
  />
</FlowProviderDemo>

---

### `Profile`

A standalone component used to display wallet information, such as account address, balance and optional scheduled transactions.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#profile" /></div>

**Props:**

- `onDisconnect?: () => void` – Callback triggered when the user disconnects.
- `balanceType?: "cadence" | "evm" | "combined"` – Specifies which balance to display (default: `"cadence"`). Options:
  - `"cadence"`: Shows the token balance from the Cadence side.
  - `"evm"`: Shows the token balance from the Flow EVM side.
  - `"combined"`: Shows the total combined token balance from both sides.
- `balanceTokens?: TokenConfig[]` – Optional array of token configurations to display in the balance selector. Each `TokenConfig` requires:
  - `symbol: string` – Token symbol (for example, "FLOW", "USDC").
  - `name: string` – Full token name.
  - Either `vaultIdentifier: string` (for Cadence tokens) or `erc20Address: string` (for EVM tokens).
- `profileConfig?: ProfileConfig` – Optional configuration for the profile display:
  - `scheduledTransactions.show?: boolean` – Whether to show the scheduled transactions tab (default: `false`).
  - `scheduledTransactions.filterHandlerTypes?: string[]` – Optional array of handler type identifiers to filter displayed transactions.
- `className?: string` – Optional custom CSS class.
- `style?: React.CSSProperties` – Optional inline styles.

:::note WalletConnect Support

To turn on WalletConnect as a wallet option, add your registered project ID to the `walletconnectProjectId` field in your `FlowProvider` config.

:::

```tsx
import { Profile } from "@onflow/react-sdk"

<Profile
  balanceType="combined"
  onDisconnect={() => console.log("User disconnected")}
/>
```

---

### `TransactionButton`

Button component used to execute Flow transactions with built-in loading states and global transaction management.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#transactionbutton" /></div>

**Props:**

- `transaction: Parameters<typeof mutate>[0]` – Flow transaction object to execute when clicked.
- `label?: string` – Optional custom button label (default: `"Execute Transaction"`).
- `mutation?: UseMutationOptions<string, Error, Parameters<typeof mutate>[0]>` – Optional TanStack React Query mutation options.
- `...buttonProps` – All other `ButtonProps` except `onClick` and `children` (includes `variant`, `disabled`, `className`, and so on).

```tsx
import { TransactionButton } from "@onflow/react-sdk"

const myTransaction = {
  cadence: `
    transaction() {
      prepare(acct: &Account) {
        log("Hello from ", acct.address)
      }
    }
  `,
  args: (arg, t) => [],
  limit: 100,
}

<TransactionButton
  transaction={myTransaction}
  label="Say Hello"
  variant="primary"
  mutation={{
    onSuccess: (txId) => console.log("Transaction sent:", txId),
    onError: (error) => console.error("Transaction failed:", error),
  }}
/>
```

#### Live Demo

<FlowProviderDemo>
  <TransactionButton
    transaction={{
      cadence: `transaction() { prepare(acct: &Account) { log("Demo transaction") } }`,
      args: (arg, t) => [],
      limit: 100,
    }}
    label="Demo Transaction"
  />
</FlowProviderDemo>

---

### `TransactionDialog`

Dialog component for real-time transaction status updates.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#transactiondialog" /></div>

**Props:**

- `open: boolean` – Whether the dialog is open.
- `onOpenChange: (open: boolean) => void` – Callback to open and close dialog
- `txId?: string` – Optional Flow transaction ID or scheduled transaction ID to track.
- `onSuccess?: () => void` – Optional callback when transaction is successful.
- `pendingTitle?: string` – Optional custom pending state title.
- `pendingDescription?: string` – Optional custom pending state description.
- `successTitle?: string` – Optional custom success state title.
- `successDescription?: string` – Optional custom success state description.
- `closeOnSuccess?: boolean` – If `true`, closes the dialog automatically after success.

```tsx
import { TransactionDialog } from "@onflow/react-sdk"


<TransactionDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  txId="6afa38b7bd1a23c6cc01a4ea2e51ed376f16761f9d06eca0577f674a9edc0716"
  pendingTitle="Sending..."
  successTitle="All done!"
  closeOnSuccess
/>
```

#### Live Demo

<TransactionDialogDemo />

---

### `TransactionLink`

Link to the block explorer with the appropriate network scoped to transaction ID or scheduled transaction ID.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#transactionlink" /></div>

**Props:**

- `txId: string` – The transaction ID or scheduled transaction ID to link to.
- `variant?: ButtonProps["variant"]` – Optional button variant (defaults to `"link"`).

```tsx
import { TransactionLink } from "@onflow/react-sdk"

<TransactionLink txId="your-tx-id" />
```

#### Live Demo

<FlowProviderDemo>
  <TransactionLink
    txId="0x1234567890abcdef"
    variant="primary"
  />
</FlowProviderDemo>

---

### `NftCard`

A component used to render a NFT with image, name, description, collection details, traits and external links. Features include loading states, error handling, dark mode support and optional custom actions.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#nftcard" /></div>

**Props:**

- `accountAddress: string` – The Flow account address that owns the NFT.
- `tokenId: string | number` – The ID of the NFT.
- `publicPathIdentifier: string` – The public path identifier for the NFT collection (for example, "A.0b2a3299cc857e29.TopShot.Collection").
- `showTraits?: boolean` – Whether to display NFT traits or attributes (default: `false`). Shows up to four traits with a button to view all.
- `showExtra?: boolean` – Whether to display additional information like serial number, rarity, and external links (default: `false`).
- `actions?: NftCardAction[]` – Optional array of custom action buttons displayed in a dropdown menu. Each action requires:
  - `title: string` – Display text for the action.
  - `onClick: () => Promise<void> | void` – Handler function called when action is clicked.
- `className?: string` – Optional custom CSS class.
- `style?: React.CSSProperties` – Optional inline styles.

```tsx
import { NftCard } from "@onflow/react-sdk"

<NftCard
  accountAddress="0x1234567890abcdef"
  tokenId="12345"
  publicPathIdentifier="A.0b2a3299cc857e29.TopShot.Collection"
  showTraits={true}
  showExtra={true}
  actions={[
    {
      title: "Transfer NFT",
      onClick: async () => {
        // Handle transfer logic
      }
    },
    {
      title: "List for Sale",
      onClick: async () => {
        // Handle listing logic
      }
    }
  ]}
/>
```

---

### `ScheduledTransactionList`

A component used to display scheduled transactions for a Flow account. Shows transaction metadata such as thumbnails, descriptions, priority, scheduled time, execution effort, fees and provides an optional transaction cancellation functionality.

<div style={{marginBottom: "1.5rem"}}><PlaygroundButton href="https://react.flow.com/#scheduledtransactionlist" /></div>

**Props:**

- `address: string` – The Flow account address to fetch scheduled transactions for.
- `filterHandlerTypes?: string[]` – Optional array of handler type identifiers to filter which transactions are displayed. Only transactions with matching `handlerTypeIdentifier` will be shown.
- `cancelEnabled?: boolean` – Whether to show the cancel button for transactions (default: `true`).
- `className?: string` – Optional custom CSS class.
- `style?: React.CSSProperties` – Optional inline styles.
- `flowClient?: UseFlowScheduledTransactionListArgs["flowClient"]` – Optional custom Flow client instance.

```tsx
import { ScheduledTransactionList } from "@onflow/react-sdk"

<ScheduledTransactionList
  address="0x1234567890abcdef"
  filterHandlerTypes={[
    "A.1234.MyContract.Handler",
    "A.5678.OtherContract.Handler"
  ]}
  cancelEnabled={true}
/>
```

---

## Theming

### How theming works

All UI components in `@onflow/react-sdk` are styled with [Tailwind CSS] utility classes. The kit supports both light and dark themes out of the box, and uses Tailwind's `dark:` variant for dark mode styling.

To customize the look and feel of the kit, you can provide a custom theme to the `FlowProvider` via the `theme` prop. This allows you to override default colors and styles to better match your app's branding.

### Theme Colors

The theme object accepts a `colors` property with the following options:

| Property | Description | Default |
|----------|-------------|---------|
| `primary` | Primary action color (CTAs, main buttons) | `flow-bg-slate-900 dark:flow-bg-white` |
| `primaryForeground` | Text color on primary backgrounds | `flow-text-white dark:flow-text-slate-900` |
| `secondary` | Secondary action color (secondary buttons) | `flow-bg-slate-100 dark:flow-bg-slate-800` |
| `secondaryForeground` | Text color on secondary backgrounds | `flow-text-slate-900 dark:flow-text-slate-100` |
| `accent` | Accent color for highlights, selected states | `flow-bg-slate-800 dark:flow-bg-slate-200` |
| `background` | Default background color (cards, modals) | `flow-bg-white dark:flow-bg-slate-800` |
| `foreground` | Default text color | `flow-text-slate-900 dark:flow-text-slate-100` |
| `muted` | Muted/subtle background color | `flow-bg-slate-100 dark:flow-bg-slate-700` |
| `mutedForeground` | Muted text color | `flow-text-slate-500 dark:flow-text-slate-400` |
| `border` | Border color | `flow-border-slate-200 dark:flow-border-slate-700` |
| `success` | Success state color | `flow-text-green-600 dark:flow-text-green-400` |
| `error` | Error state color | `flow-text-red-600 dark:flow-text-red-400` |
| `link` | Link text color | `flow-text-slate-900 dark:flow-text-slate-100` |

### Example

```tsx
import { FlowProvider } from "@onflow/react-sdk"

const customTheme = {
  colors: {
    primary: "flow-bg-purple-600 dark:flow-bg-purple-400",
    primaryForeground: "flow-text-white dark:flow-text-purple-900",
    secondary: "flow-bg-emerald-500 dark:flow-bg-emerald-400",
    secondaryForeground: "flow-text-white dark:flow-text-emerald-900",
    accent: "flow-bg-purple-700 dark:flow-bg-purple-300",
    border: "flow-border-purple-200 dark:flow-border-purple-700",
  }
}

function App() {
  return (
    <FlowProvider config={...} theme={customTheme}>
      <MyApp />
    </FlowProvider>
  )
}
```

You only need to specify the colors you want to override—any unspecified colors will use the default values.

---

## Dark mode

### How dark mode works

Dark mode is **fully controlled by the parent app** with the `darkMode` prop on `FlowProvider`. The kit does not manage dark mode state internally—this gives you full control and ensures the kit always matches your app's theme.

- `darkMode={false}` (default): Forces all kit components to use light mode styles.
- `darkMode={true}`: Forces all kit components to use dark mode styles.
- You can dynamically change the `darkMode` prop to switch themes at runtime.

**Example:**

```tsx
function App() {
  // Parent app manages dark mode state
  const [isDark, setIsDark] = useState(false)

  return (
    <FlowProvider config={...} darkMode={isDark}>
      <MyFlowComponents />
    </FlowProvider>
  )
}
```

**Access dark mode in components:**

You can use the `useDarkMode` hook to check the current mode inside your components:

```tsx
import { useDarkMode } from "@onflow/react-sdk"

function MyComponent() {
  // useDarkMode only returns the current state, no setter
  const { isDark } = useDarkMode()
  return <div>{isDark ? "Dark mode" : "Light mode"}</div>
}
```

#### Notes

- The kit does **not** automatically follow system preferences or save user choices. It's your responsibility to manage and pass the correct `darkMode` value.
- All kit components will automatically apply the correct Tailwind `dark:` classes based on the `darkMode` prop.
- For best results, ensure your app's global theme and the kit's `darkMode` prop are always in sync.

<!-- Relative links, will not render on page -->

[Tailwind CSS]: https://tailwindcss.com/