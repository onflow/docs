---
sidebar_position: 2
title: Authentication Integration Guide
description: Set up user authentication for your Flow application using Crossmint's integrated authentication system with email, social logins, and wallet connections.
keywords:
  - authentication
  - user management
  - email otp
  - social login
  - wallet auth
  - farcaster
  - jwt
  - flow
  - crossmint
---

# Authentication Integration Guide

Crossmint provides a comprehensive user management solution tightly integrated with all other Crossmint products. Authenticate users with Web3 or traditional sign-in methods, with seamless wallet creation and unified identity management.

**Why this matters:**

- **Unified identity system**: Single user account across your backend and Web3 app.
- **Multiple auth methods**: Email OTP, social logins, wallet connections, and Farcaster.
- **Automatic wallet creation**: Optionally create or link wallets with user accounts.
- **Drag and drop integration**: Setup in under five minutes.

## 🎯 Available authentication methods

### 1. Email OTP authentication

Passwordless sign-in with one-time codes delivered to the user's email.
- No passwords required
- Secure and user-friendly
- Automatic account creation

### 2. Social account authentication

Sign in with popular social platforms:

- Google
- Apple
- X (Twitter)
- And more

### 3. Farcaster integration

Use the [Sign In With Farcaster (SIWF) standard]

- Web3-native authentication
- Decentralized identity support

### 4. External wallet authentication

Connect with crypto wallets for Web3 authentication:

- MetaMask
- WalletConnect
- Flow wallets
- And other Web3 wallets

## Prerequisites

Make sure you have:

**Crossmint account:**

- [Crossmint Console](https://staging.crossmint.com) account
- Client API key with authentication scopes

**React/Next.js project:**

- React 16.8+ or Next.js 13+
- TypeScript support (recommended)

**Technical knowledge:**

- Basic React hooks and state management
- Understanding of authentication flows

## Quick start (five minutes)

### Step 1: install the SDK

```bash
npm i @crossmint/client-sdk-react-ui
```

### Step 2: add crossmint providers

```tsx
"use client";

import {
    CrossmintProvider,
    CrossmintAuthProvider,
    CrossmintWalletProvider
} from "@crossmint/client-sdk-react-ui";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CrossmintProvider apiKey="<crossmint-client-api-key>">
            <CrossmintAuthProvider>
                {children}
            </CrossmintAuthProvider>
        </CrossmintProvider>
    );
}
```

### Step 3: create authentication component

```tsx
"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";

export function AuthButton() {
  const { login, logout, user, jwt } = useAuth();

  return (
    <div className="flex gap-4">
      {user == null ? (
        <button
          type="button"
          onClick={login}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      ) : (
        <button
          type="button"
          onClick={logout}
          className="bg-black text-white font-bold py-2 px-4 rounded border-2 border-blue-500"
        >
          Logout
        </button>
      )}
      
      {/* Display user information */}
      <div className="user-info">
        <p>User ID: {user?.userId}</p>
        <p>Email: {user?.email ?? "None"}</p>
        <p>Phone: {user?.phoneNumber ?? "None"}</p>
        <p>Farcaster: {user?.farcaster?.username ?? "None"}</p>
        <p>Google: {user?.google?.displayName ?? "None"}</p>
        <p>JWT: {jwt}</p>
      </div>
    </div>
  );
}
```

### Environment configuration

```typescript
// Use environment-specific API keys
const crossmintConfig = {
  apiKey: process.env.NODE_ENV === 'production' 
    ? process.env.CROSSMINT_PROD_API_KEY
    : process.env.CROSSMINT_STAGING_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'staging'
};
```

## Production deployment

### 1. Create production account

1. Create a developer account on the [Production Console].
![Production Console Login](./imgs/staging.png)

2. Complete account verification and KYB process.

### 2. Configure production API keys

1. Create a production client API key.

Navigate to **Integrate > API Keys**

![API Keys](./imgs/api_keys.png)

2. Activate required scopes:
   - `users.create`
   - `users.read`
   - `wallets.read`
   - `wallets.create`

### 3. Update environment variables

```bash
# Production
CROSSMINT_API_KEY=your_production_client_api_key
CROSSMINT_ENVIRONMENT=production

# Staging (for testing)
CROSSMINT_API_KEY=your_staging_client_api_key
CROSSMINT_ENVIRONMENT=staging
```

### 4. Test authentication flow

```typescript
// Test authentication in staging first
const testAuth = async () => {
  const { login, user } = useAuth();
  
  await login();
  
  if (user) {
    console.log('Authentication successful:', user);
    // Test wallet creation
    await createUserWallet();
  }
};
```

## 🔧 Troubleshooting

### Common issues

**Authentication fails:**

- Verify API key is correct.
- Check authentication scopes are activated.
- Make sure you're using the right environment (staging vs. production)

**Wallet creation fails:**

- Verify user is authenticated.
- Check wallet creation scopes.
- Ensure proper wallet configuration for Flow.

### Get Help

- **[Crossmint Authentication Docs](https://docs.crossmint.com/authentication/introduction)**
- **[Flow Developer Portal](https://developers.flow.com/)** 


<!-- Reference-style links, does not render on page -->

[Crossmint Console]: https://staging.crossmint.com
[Sign In With Farcaster (SIWF) standard]: https://github.com/farcasterxyz/protocol/discussions/110
[Production Console]: https://www.crossmint.com/signin?callbackUrl=/console