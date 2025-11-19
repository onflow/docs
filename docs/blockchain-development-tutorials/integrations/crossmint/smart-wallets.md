---
sidebar_position: 4
title: Crossmint Smart Wallets
description: Learn how to integrate Crossmint Smart Wallets to create seamless Web3 experiences with email-based authentication on Flow.
keywords:
  - tutorials
  - guides
  - flow
  - smart wallets
  - crossmint
  - authentication
  - wallet infrastructure
  - web3
  - email authentication
  - gasless transactions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Crossmint Smart Wallets Integration Guide

Traditional blockchain wallets create significant friction for mainstream users. Managing seed phrases, understanding gas fees, and connecting multiple wallets are barriers that prevent widespread Web3 adoption. Crossmint Smart Wallets solves these problems by providing **enterprise-grade wallet infrastructure** that enables Web2-like user experiences without compromising on security or decentralization.

With Crossmint Smart Wallets, you can:
- **Eliminate wallet complexity** with email and social login authentication.
- **Remove onboarding friction** with automatic user wallet creation.
- **Support multiple authentication methods** such as email, Google, passkeys, and external wallets.
- **Enable gasless transactions** to improve user experience.
- **Build on Flow** with full support for both mainnet and testnet environments.
- **Scale with confidence** using infrastructure trusted by Fortune 500 companies.

This tutorial will guide you through how to integrate Crossmint Smart Wallets into your Flow application. You'll learn how to set up authentication, automatically create wallets, check balances, transfer tokens, and display transaction historyall with a familiar Web2-style developer experience.

:::info

Crossmint provides flexible wallet solutions across more than 50 blockchains, such as Flow. This tutorial focuses on the **React implementation** for web applications, but Crossmint also supports Node.js, React Native, Swift (iOS), and Kotlin (Android) platforms.

:::

## Objectives

After you complete this guide, you'll be able to:

- Configure a Crossmint account with proper API keys and permissions.
- Implement email and social authentication for automatic wallet creation.
- Display wallet information including address, balance, and ownership details.
- Execute token transfers on Flow using Crossmint's SDK.
- Build an activity feed showing transaction history.
- Handle authentication states and error scenarios properly.
- Deploy your Crossmint-powered application to production.

## Prerequisites

Before you start this tutorial, you should have:

- **Development Environment**: Node.js and npm/yarn/pnpm installed.
- **React Knowledge**: Familiarity with React hooks and component patterns.
- **Next.js or Create-React-App**: A React application ready for integration.
- **Basic Blockchain Concepts**: Knowledge of wallet addresses and token transfers (helpful but not required).

## Set up your crossmint account

You need to create a Crossmint account and configure API access before you implement wallet functionality.

### Step 1. Create your Crossmint account

Sign up on the [Crossmint Console] to establish an account. For development and testing, use the [Staging Console] instead.

:::tip

Always use the staging environment during development. Staging supports testnet blockchains only, while production supports mainnet deployments.

:::

### Step 2. Create a new project

After you log in to the console:

1. Click **Create New Project**.
2. Enter a project name (such as "Flow DApp").
3. Select your project type (Web Application recommended).
4. Save your project settings.

### Step 3. Generate API keys

Navigate to your project dashboard to create a client-side API key:

1. Go to the **API Keys** section
2. Click **Create New API Key**
3. Select **Client API Key** (not server key)
4. Activate the following scopes:
   - `users.create` - Create new users
   - `users.read` - Read user information
   - `wallets.read` - Read wallet data
   - `wallets.create` - Create new wallets
   - `wallets:transactions.create` - Create transactions
   - `wallets:transactions.sign` - Sign transactions
   - `wallets:balance.read` - Read balance information
   - `wallets.fund` - Fund wallets (staging and development only)

5. Copy the generated API key to your clipboard

:::warning

Keep your API keys secure! Never commit them to version control. Use environment variables to store sensitive credentials.

:::

### Step 4. Configure environment variables

Create a `.env` or `.env.local` file in your project root:

```bash
NEXT_PUBLIC_CROSSMINT_API_KEY=your_api_key_here
NEXT_PUBLIC_CHAIN=flow-testnet
```

For production deployments, update to:

```bash
NEXT_PUBLIC_CROSSMINT_API_KEY=your_production_api_key
NEXT_PUBLIC_CHAIN=flow
```

## Implement Crossmint Smart Wallets

With your Crossmint account configured, you can now integrate wallet functionality into your React application.

### Step 1. Install dependencies

Install the Crossmint React SDK:

<Tabs>
  <TabItem value="pnpm" label="pnpm" default>
    ```bash
    pnpm add @crossmint/client-sdk-react-ui
    ```
  </TabItem>
  <TabItem value="bun" label="bun">
    ```bash
    bun add @crossmint/client-sdk-react-ui
    ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
    ```bash
    yarn add @crossmint/client-sdk-react-ui
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    npm install @crossmint/client-sdk-react-ui
    ```
  </TabItem>
</Tabs>

### Step 2. Configure Crossmint providers

Crossmint requires three providers to be set up in a specific hierarchy. These providers handle API configuration, authentication, and wallet management.

<Tabs>
  <TabItem value="nextjs" label="Next.js App Router" default>
    Create a new file `app/providers.tsx`:

    ```tsx
    "use client";

    import {
      CrossmintProvider,
      CrossmintAuthProvider,
      CrossmintWalletProvider,
    } from "@crossmint/client-sdk-react-ui";

    if (!process.env.NEXT_PUBLIC_CROSSMINT_API_KEY) {
      throw new Error("NEXT_PUBLIC_CROSSMINT_API_KEY is not set");
    }

    const chain = (process.env.NEXT_PUBLIC_CHAIN ?? "flow-testnet") as any;

    export function Providers({ children }: { children: React.ReactNode }) {
      return (
        <CrossmintProvider apiKey={process.env.NEXT_PUBLIC_CROSSMINT_API_KEY}>
          <CrossmintAuthProvider
            authModalTitle="Welcome to Flow"
            loginMethods={["google", "email"]}
            appearance={{
              colors: {
                accent: "#00EF8B", // Flow brand color
              },
            }}
          >
            <CrossmintWalletProvider
              createOnLogin={{
                chain: chain,
                signer: {
                  type: "email",
                },
              }}
            >
              {children}
            </CrossmintWalletProvider>
          </CrossmintAuthProvider>
        </CrossmintProvider>
      );
    }
    ```

    Then wrap your app in `app/layout.tsx`:

    ```tsx
    import { Providers } from "./providers";

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
    ```
  </TabItem>
  <TabItem value="cra" label="Create-React-App">
    Update your `src/index.tsx` or `src/index.jsx`:

    ```tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App';
    import {
      CrossmintProvider,
      CrossmintAuthProvider,
      CrossmintWalletProvider,
    } from "@crossmint/client-sdk-react-ui";

    const chain = process.env.REACT_APP_CHAIN ?? "flow-testnet";
    const apiKey = process.env.REACT_APP_CROSSMINT_API_KEY;

    if (!apiKey) {
      throw new Error("REACT_APP_CROSSMINT_API_KEY is not set");
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <CrossmintProvider apiKey={apiKey}>
          <CrossmintAuthProvider
            authModalTitle="Welcome to Flow"
            loginMethods={["google", "email"]}
            appearance={{
              colors: {
                accent: "#00EF8B",
              },
            }}
          >
            <CrossmintWalletProvider
              createOnLogin={{
                chain: chain,
                signer: { type: "email" },
              }}
            >
              <App />
            </CrossmintWalletProvider>
          </CrossmintAuthProvider>
        </CrossmintProvider>
      </React.StrictMode>
    );
    ```
  </TabItem>
</Tabs>

**Provider configuration cptions:**

- **CrossmintProvider**: Top-level provider that requires only your API key.
- **CrossmintAuthProvider**: Manages authentication with configurable options:
  - `authModalTitle`: Title displayed in the authentication modal.
  - `loginMethods`: Array of active authentication methods (`"email"`, `"google"`, `"apple"`, `"twitter"`, `"farcaster"`).
  - `appearance`: Customize UI colors and style.
- **CrossmintWalletProvider**: Handles wallet creation and management:
  - `createOnLogin.chain`: Target blockchain (such as `"flow"`, `"flow-testnet"`)
  - `createOnLogin.signer.type`: Authentication method for wallet signing (`"email"`, `"passkey"`).

:::info

The `createOnLogin` configuration enables **automatic wallet creation**. When a user logs in for the first time, Crossmint automatically provisions a wallet on the specified chain. No additional setup required!

:::

### Step 3. Implement authentication

Create login and logout components with Crossmint's `useAuth` hook.

**LoginButton.tsx:**

```tsx
"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";

export function LoginButton() {
  const { login } = useAuth();

  return (
    <button
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      onClick={login}
    >
      Sign In
    </button>
  );
}
```

**LogoutButton.tsx:**

```tsx
"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      onClick={logout}
    >
      Sign Out
    </button>
  );
}
```

**Header.tsx (Conditional rendering):**

```tsx
"use client";

import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

export function Header() {
  const { status: authStatus } = useAuth();
  const { wallet } = useWallet();

  const isLoggedIn = wallet != null && authStatus === "logged-in";

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Flow DApp</h1>
        {isLoggedIn ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  );
}
```

### Step 4. Display wallet information

Create a component to show wallet details with the `useWallet` hook.

**WalletInfo.tsx:**

```tsx
"use client";

import { useState } from "react";
import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";

export function WalletInfo() {
  const { wallet, status } = useWallet();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (status === "in-progress") {
    return (
      <div className="bg-white rounded-lg p-6 border">
        <div className="animate-pulse">Loading wallet...</div>
      </div>
    );
  }

  if (!wallet) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Wallet Details</h2>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-500 mb-1">Address</div>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-gray-100 px-3 py-2 rounded">
              {formatAddress(wallet.address)}
            </code>
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Chain</div>
          <div className="font-medium">{wallet.chain}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Owner</div>
          <div className="font-medium">{user?.email || wallet.owner}</div>
        </div>
      </div>
    </div>
  );
}
```

### Step 5. Display wallet balance

Fetch and display the wallet's token balance with the `wallet.balances()` method.

**WalletBalance.tsx:**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Balances, useWallet } from "@crossmint/client-sdk-react-ui";

export function WalletBalance() {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<Balances | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBalances() {
      if (!wallet) return;

      try {
        setIsLoading(true);
        const balances = await wallet.balances();
        setBalances(balances);
      } catch (error) {
        console.error("Error fetching wallet balances:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalances();
  }, [wallet]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 border">
        <div className="animate-pulse">Loading balance...</div>
      </div>
    );
  }

  const nativeBalance = balances?.nativeToken?.amount
    ? Number(balances.nativeToken.amount).toFixed(4)
    : "0.0000";

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Balance</h2>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">
            {balances?.nativeToken?.symbol || "FLOW"}
          </div>
          <div className="text-3xl font-bold">{nativeBalance}</div>
        </div>

        {balances?.tokens && balances.tokens.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Tokens</div>
            {balances.tokens.map((token, index) => (
              <div key={index} className="flex justify-between py-2">
                <span className="text-gray-600">{token.symbol}</span>
                <span className="font-medium">
                  {Number(token.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 6. Implement token transfers

Create a component to transfer tokens with the `wallet.send()` method.

**TransferTokens.tsx:**

```tsx
"use client";

import { useState } from "react";
import { useWallet } from "@crossmint/client-sdk-react-ui";

export function TransferTokens() {
  const { wallet } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explorerLink, setExplorerLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTransfer() {
    if (!wallet || !recipient || !amount) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setExplorerLink(null);

      const txn = await wallet.send(
        recipient,
        "flow", // Token symbol - use native FLOW token
        amount
      );

      setExplorerLink(txn.explorerLink);

      // Reset form
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error("Transfer error:", err);

      if (err instanceof Error && err.name === "AuthRejectedError") {
        // User cancelled the transaction - don't show error
        return;
      }

      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Transfer Tokens</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {explorerLink && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-700 text-sm mb-2">
              Transaction successful!
            </div>
            <a
              href={explorerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              View on Explorer �
            </a>
          </div>
        )}

        <button
          onClick={handleTransfer}
          disabled={isLoading || !recipient || !amount}
          className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Transferring..." : "Transfer"}
        </button>
      </div>
    </div>
  );
}
```

:::tip

The `wallet.send()` method throws an `AuthRejectedError` when users cancel the transaction. Handle this separately to avoid a display of unnecessary error messages.

:::

### Step 7. Build activity feed

Display transaction history with the `wallet.experimental_activity()` method with polling for real-time updates.

**ActivityFeed.tsx:**

```tsx
"use client";

import { useEffect, useState } from "react";
import { type Activity, useWallet } from "@crossmint/client-sdk-react-ui";

export function ActivityFeed() {
  const { wallet } = useWallet();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!wallet) return;

    const fetchActivity = async () => {
      try {
        const activity = await wallet.experimental_activity();
        setActivity(activity);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchActivity();

    // Poll every 8 seconds for updates
    const interval = setInterval(fetchActivity, 8000);

    return () => clearInterval(interval);
  }, [wallet]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    // Handle both seconds and milliseconds
    const date = new Date(
      timestamp < 10000000000 ? timestamp * 1000 : timestamp
    );
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    if (diffInMs < 0) return "just now";

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "just now";
    else if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    else if (diffInHours < 24) return `${diffInHours}h ago`;
    else return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 border">
        <div className="animate-pulse">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      {activity?.events && activity.events.length > 0 ? (
        <div className="space-y-3">
          {activity.events.map((event, index) => {
            const isIncoming =
              event.to_address?.toLowerCase() === wallet?.address.toLowerCase();

            return (
              <div
                key={event.transaction_hash || index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${isIncoming ? "text-green-600" : "text-blue-600"}`}>
                      {isIncoming ? "Received" : "Sent"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {isIncoming
                      ? `From ${formatAddress(event.from_address)}`
                      : `To ${formatAddress(event.to_address)}`
                    }
                  </div>
                </div>
                <div className={`text-right ${isIncoming ? "text-green-600" : "text-blue-600"}`}>
                  <div className="font-semibold">
                    {isIncoming ? "+" : "-"}{event.amount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {event.token_symbol || "FLOW"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions yet</p>
          <p className="text-sm mt-2">Your activity will appear here</p>
        </div>
      )}
    </div>
  );
}
```

:::warning

The `experimental_activity()` method is experimental and may change in future SDK versions. Always handle errors gracefully and provide fallback UI.

:::

### Step 8. Create main dashboard

Combine all components into a cohesive dashboard with proper state management.

**Dashboard.tsx:**

```tsx
"use client";

import { WalletInfo } from "./WalletInfo";
import { WalletBalance } from "./WalletBalance";
import { TransferTokens } from "./TransferTokens";
import { ActivityFeed } from "./ActivityFeed";

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WalletInfo />
          <WalletBalance />
        </div>

        <div className="space-y-6">
          <TransferTokens />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
```

**page.tsx (Main application):**

```tsx
"use client";

import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { LoginButton } from "@/components/LoginButton";

export default function Home() {
  const { wallet, status: walletStatus } = useWallet();
  const { status: authStatus } = useAuth();

  const isLoggedIn = wallet != null && authStatus === "logged-in";
  const isLoading = walletStatus === "in-progress" || authStatus === "initializing";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing wallet...</p>
            </div>
          </div>
        ) : isLoggedIn ? (
          <Dashboard />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <h1 className="text-4xl font-bold mb-4">Welcome to Flow</h1>
              <p className="text-gray-600 mb-8">
                Sign in to access your wallet and start transacting on Flow blockchain
              </p>
              <LoginButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## Additional Platform Support

While this tutorial focuses on React for web applications, Crossmint provides SDKs for multiple platforms:

### Node.js (Backend)
For server-side wallet creation and management, use the Node.js SDK:
- [Node.js Quickstart Documentation]

### React Native (Mobile)
For iOS and Android mobile applications:
- [React Native Quickstart Documentation]

### Swift (iOS Native)
For native iOS development:
- Contact [Crossmint Sales] for access

### Kotlin (Android Native)
For native Android development:
- Contact [Crossmint Sales] for access

---

## Conclusion

In this tutorial, you successfully integrated Crossmint Smart Wallets to enable seamless blockchain experiences on Flow. You learned how to implement email-based authentication, automatically create wallets for users, display balances, execute token transfers, and show transaction historyall without requiring users to understand complex blockchain concepts like seed phrases or gas fees.

Now that you have completed the tutorial, you should be able to:

- Configure Crossmint accounts with proper API keys and permissions
- Implement multiple authentication methods including email and social login
- Automatically create and manage wallets for users
- Display wallet information, balances, and transaction history
- Execute token transfers with proper error handling
- Build production-ready applications with enterprise-grade wallet infrastructure

Crossmint's wallet infrastructure, combined with Flow's high-performance blockchain, provides a powerful foundation for building user-friendly Web3 applications. By eliminating wallet complexity and onboarding friction, you can create experiences that attract mainstream users while maintaining the security and transparency benefits of blockchain technology.

## Next Steps

- Explore [Crossmint's NFT Minting Platform]to add NFT functionality
- Learn about [Payment Checkout] for credit card and crypto payments
- Implement [Passkey Authentication] for enhanced security
- Review [Flow Smart Contract Development] to build custom on-chain logic
- Join the [Flow Discord] to connect with other developers

<!-- Relative links, will not render on page -->

[Crossmint Console]: https://www.crossmint.com/console
[Staging Console]: https://staging.crossmint.com/console
[Crossmint Documentation]: https://docs.crossmint.com/
[Crossmint Wallets SDK]: https://github.com/Crossmint/crossmint-sdk
[Crossmint Sales]: https://www.crossmint.com/contact/sales 
[Flow Discord]: https://discord.gg/flow
[Crossmint's NFT Minting Platform]: https://docs.crossmint.com/nft-minting/overview
[Payment Checkout]: https://docs.crossmint.com/payments/overview
[Passkey Authentication]: https://docs.crossmint.com/wallets/signers/passkey
[Flow Smart Contract Development]: ../../cadence/
[Node.js Quickstart Documentation]: https://docs.crossmint.com/wallets/quickstarts/nodejs
[React Native Quickstart Documentation]: https://docs.crossmint.com/wallets/quickstarts/react-native