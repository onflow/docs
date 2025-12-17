---
title: 'Components'
description: Reusable UI components for Flow interactions in React Native.
sidebar_position: 3
---

## Connect

A drop-in wallet connection component that handles the entire authentication flow. When disconnected, it displays a "Connect Wallet" button. When connected, it shows the user's address and opens a Profile modal on press.

**Props:**

- `onConnect?: () => void` – Callback triggered after successful authentication
- `onDisconnect?: () => void` – Callback triggered after logout
- `balanceType?: "cadence" | "evm" | "combined"` – Specifies which balance to display (default: `"cadence"`)
  - `"cadence"`: Shows the token balance from the Cadence side
  - `"evm"`: Shows the token balance from the Flow EVM side
  - `"combined"`: Shows the total combined token balance from both sides
- `balanceTokens?: TokenConfig[]` – Optional array of token configurations to display in the balance selector
- `modalEnabled?: boolean` – Whether to show the profile modal on press when connected (default: `true`)

**Basic Usage:**

The simplest way to add wallet connection to your app:

```tsx
import { View, Text } from "react-native";
import { Connect } from "@onflow/react-native-sdk";

function WalletSection() {
  return (
    <View>
      <Text>Connect Wallet</Text>
      <Text>Connect your Flow wallet to interact with the blockchain.</Text>
      <Connect />
    </View>
  );
}
```

**With Callbacks:**

```tsx
import { Connect } from "@onflow/react-native-sdk";

<Connect
  onConnect={() => console.log("Wallet connected!")}
  onDisconnect={() => console.log("Wallet disconnected")}
/>
```

**With Balance Display:**

```tsx
import { Connect } from "@onflow/react-native-sdk";

<Connect
  balanceType="combined"
  balanceTokens={[
    {
      symbol: "FLOW",
      name: "Flow",
      vaultIdentifier: "A.1654653399040a61.FlowToken.Vault",
    },
  ]}
/>
```

---

## Profile

A standalone component for displaying wallet information including account address and balance. Use this when you want to show user details separately from the Connect button.

**Props:**

- `onDisconnect?: () => void` – Callback triggered when the user presses the disconnect button
- `balanceType?: "cadence" | "evm" | "combined"` – Specifies which balance to display (default: `"cadence"`)
  - `"cadence"`: Shows the token balance from the Cadence side
  - `"evm"`: Shows the token balance from the Flow EVM side
  - `"combined"`: Shows the total combined token balance from both sides
- `balanceTokens?: TokenConfig[]` – Optional array of token configurations to display in the balance selector

**Usage:**

```tsx
import { View } from "react-native";
import { Profile, useFlowCurrentUser } from "@onflow/react-native-sdk";

function UserProfile() {
  const { user } = useFlowCurrentUser();

  if (!user?.loggedIn) {
    return null;
  }

  return (
    <View>
      <Profile
        balanceType="combined"
        onDisconnect={() => console.log("User disconnected")}
      />
    </View>
  );
}
```
