---
sidebar_position: 21
sidebar_label: Emulator Fork Testing
title: Interactive Testing with Forked Emulator
description: Run your dapp, E2E tests, and manual explorations against a forked mainnet or testnet using the Flow Emulator. Test with production state and real contracts without deploying to live networks.
keywords:
  - flow emulator --fork
  - emulator fork mode
  - E2E testing
  - dapp testing
  - frontend testing
  - Cypress testing
  - Playwright testing
  - FCL configuration
  - mainnet fork
  - testnet fork
  - account impersonation
  - interactive testing
  - production state
  - local development
  - forked emulator
  - React testing
  - wallet testing
  - migration testing
  - exploratory testing
  - manual testing
  - fork-height
  - pinned fork
---

# Interactive Testing with Forked Emulator

This tutorial teaches you how to run your dapp, E2E tests, and manual explorations against a snapshot of Flow mainnet using `flow emulator --fork`. You'll learn how to connect your frontend to production-like state, test user flows with real contracts and data, and debug issues interactively—all without deploying to a live network.

The forked emulator creates a local Flow network that mirrors mainnet or testnet state. It's perfect for manual testing, running E2E test suites, and exploring contract interactions in a production-like environment with full control.

## What You'll Learn

After you complete this tutorial, you'll be able to:

- **Start the emulator in fork mode** with `flow emulator --fork`.
- **Connect your dapp frontend** to the forked emulator.
- **Test against real mainnet contracts** and production data interactively.
- **Run E2E tests** (Cypress, Playwright) against forked state.
- **Use account impersonation** to test as any mainnet account.
- **Pin to specific block heights** for reproducible testing.
- **Debug and explore** contract interactions manually.

## What You'll Build

You'll create a complete forked emulator setup that demonstrates:

- Starting the emulator with forked mainnet state.
- A React dapp connected to the forked emulator reading real FlowToken data.
- Manual testing flows using account impersonation.
- Automating tests with E2E frameworks against forked state.
- A reusable pattern for interactive testing and debugging.

## Prerequisites

### Flow CLI

This tutorial requires [Flow CLI] v1.8.0 or later installed. If you haven't installed it yet and have [homebrew] installed, run:

```bash
brew install flow-cli
```

For other operating systems, refer to the [installation guide].

### Node.js and npm

You'll need Node.js (v16+) and npm to run the React frontend examples. Check your installation:

```bash
node --version
npm --version
```

### Frontend development knowledge

Basic familiarity with React and JavaScript is helpful but not required. The examples use the [Flow React SDK] for Flow blockchain integration.

:::tip

This tutorial uses `@onflow/react-sdk` for all React examples. The React SDK provides hooks and components that make Flow development feel native to React. For non-React applications, you can use `@onflow/fcl` directly.

:::

### Network access

You'll need network access to Flow's public access nodes:

- Mainnet: `access.mainnet.nodes.onflow.org:9000`
- Testnet: `access.devnet.nodes.onflow.org:9000`

:::info

This tutorial covers `flow emulator --fork` (interactive testing with a forked emulator), which is different from `flow test --fork` (running Cadence test files against forked state). For testing Cadence contracts with test files, see [Fork Testing with Cadence].

:::

## Understanding Emulator Fork Mode

### What is `flow emulator --fork`?

The emulator's fork mode starts a local Flow blockchain that connects to a real network (mainnet or testnet) and fetches state on-demand. Your dapp, scripts, and transactions run locally but can read from and interact with real network data.

**Key capabilities:**

- Full gRPC and REST API servers running locally
- On-demand fetching of accounts, contracts, and state from the live network
- Disabled signature validation—execute transactions as any mainnet account
- All mutations stay local—never affect the real network
- Perfect for E2E tests, manual exploration, and debugging

### When to Use This

Use `flow emulator --fork` for:

- **E2E and frontend testing**: Run Cypress/Playwright tests against production-like state
- **Manual exploration**: Interact with your dapp connected to forked mainnet
- **Debugging user issues**: Reproduce bugs at specific block heights
- **Migration testing**: Test contract upgrades with real account state
- **Wallet integration**: Test wallet connect flows and transactions
- **Bot and indexer testing**: Run automated tools against forked data

**Don't use this for:**

- Cadence unit/integration tests (use `flow test --fork` instead—see [Fork Testing with Cadence])

### Emulator Fork vs Test Framework Fork

| Feature         | `flow emulator --fork`                  | `flow test --fork`             |
| --------------- | --------------------------------------- | ------------------------------ |
| **Use for**     | Dapp E2E, manual testing, debugging     | Cadence unit/integration tests |
| **Connects to** | Frontend, wallets, bots, E2E tools      | Cadence Testing Framework      |
| **Run with**    | FCL, Cypress, Playwright, manual clicks | `flow test` command            |
| **Best for**    | User flows, UI testing, exploration     | Contract logic validation      |
| **Examples**    | React app, wallet flows, E2E suites     | `*_test.cdc` files             |

Both modes are valuable—use the right tool for the job.

## Quick Start: Run in 60 Seconds

Want to see it work immediately? Here's the fastest path:

```bash
# 1. Initialize a Flow project
flow init --yes

# 2. Configure fork network (add to flow.json)
# Add this under "networks":
#   "mainnet-fork": {
#     "host": "127.0.0.1:3569",
#     "fork": "mainnet"
#   }

# 3. Install FlowToken dependency
flow dependencies install
# Select FlowToken from the list

# 4. Start forked emulator (in a separate terminal)
flow emulator --fork mainnet

# 5. In another terminal, check the forked state
flow scripts execute cadence/scripts/get_flow_supply.cdc --network mainnet-fork
```

Create `cadence/scripts/get_flow_supply.cdc`:

```cadence
import "FlowToken"

access(all) fun main(): UFix64 {
    return FlowToken.totalSupply
}
```

You'll see the real mainnet FlowToken supply! Now let's build a complete example with a frontend.

## Create Your Project

Navigate to your development directory and create a new Flow project:

```bash
mkdir emulator-fork-demo
cd emulator-fork-demo
flow init --yes
```

The `--yes` flag accepts defaults non-interactively.

## Configure Fork Network in flow.json

Before starting the emulator, configure a fork network in your `flow.json`. This enables automatic contract alias inheritance from mainnet, so you don't need to manually duplicate aliases.

Open `flow.json` and add a `mainnet-fork` network:

```json
{
  "networks": {
    "emulator": "127.0.0.1:3569",
    "mainnet": "access.mainnet.nodes.onflow.org:9000",
    "testnet": "access.devnet.nodes.onflow.org:9000",
    "mainnet-fork": {
      "host": "127.0.0.1:3569",
      "fork": "mainnet"
    }
  }
}
```

**What this does:**

- `host`: Points to your local emulator
- `fork`: Tells the CLI to automatically inherit contract aliases from mainnet

Now any contract with a `mainnet` alias will automatically work on `mainnet-fork` without manual configuration!

:::tip

**Why forking is powerful:**

The emulator fork mode gives you access to **real production state**:

- ✅ Test against actual deployed contracts (FT, NFT, DEXs, marketplaces)
- ✅ Read real account balances, storage, and capabilities
- ✅ Query production data without setting up test fixtures
- ✅ Catch integration issues with real-world contract implementations
- ✅ Debug with historical state by pinning block heights

**Plus, fork networks simplify configuration:**

- ✅ No need to duplicate 30+ contract aliases
- ✅ Automatic inheritance from source network
- ✅ Can override specific contracts if needed

**Example of automatic inheritance:**

```json
{
  "dependencies": {
    "FlowToken": {
      "aliases": {
        "mainnet": "0x1654653399040a61"
        // ✅ mainnet-fork automatically inherits this!
        // No need for: "mainnet-fork": "0x1654653399040a61"
      }
    }
  }
}
```

When you run commands with `--network mainnet-fork`, the CLI automatically resolves contract imports to their mainnet addresses.

:::

## Start the Forked Emulator

Start the emulator in fork mode, connected to mainnet:

```bash
flow emulator --fork mainnet
```

You'll see output like:

```
INFO[0000] ⚙️   Using service account 0xf8d6e0586b0a20c7
INFO[0000] 🌱  Starting Flow Emulator in fork mode (mainnet)
INFO[0000] 🛠  GRPC server started on 127.0.0.1:3569
INFO[0000] 📡  REST server started on 127.0.0.1:8888
INFO[0000] 🌐  Forking from access.mainnet.nodes.onflow.org:9000
```

**Leave this terminal running.** The emulator is now serving:

- **REST API**: `http://localhost:8888` (for FCL/frontend)
- **gRPC API**: `localhost:3569` (for Flow CLI)

:::tip

Pin to a specific block height for reproducibility:

```bash
flow emulator --fork mainnet --fork-height <BLOCK_HEIGHT>
```

This ensures the forked state is consistent across runs—essential for E2E tests in CI.

:::

## Mocking Mainnet Contracts

Just like mocking dependencies in unit tests, you can **mock real mainnet contracts** by deploying modified versions—perfect for testing upgrades, bug fixes, or alternative implementations against real production state.

Configure the mock in `flow.json`, then deploy to the forked emulator. Your mock takes precedence while other contracts use real mainnet versions.

### Example

**1. Configure in `flow.json`:**

```json
{
  "accounts": {
    "flow-token-mainnet": {
      "address": "0x1654653399040a61",
      "key": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  },
  "contracts": {
    "FlowToken": {
      "source": "./contracts/FlowTokenModified.cdc",
      "aliases": {
        "mainnet": "0x1654653399040a61"
      }
    }
  },
  "deployments": {
    "mainnet-fork": {
      "flow-token-mainnet": ["FlowToken"]
    }
  }
}
```

**2. Deploy the mock:**

```bash
flow emulator --fork mainnet
flow project deploy --network mainnet-fork --update
```

Your dapp now uses the mocked FlowToken while FungibleToken, USDC, and all other contracts use real mainnet versions.

## Install Dependencies

Use the [Dependency Manager] to install common Flow contracts. This adds them to your `flow.json` with mainnet aliases that will automatically work on the fork:

```bash
flow dependencies install
```

Select `FlowToken` and `FungibleToken` from the list (use space to select, enter to confirm).

Your `flow.json` now includes:

```json
{
  "dependencies": {
    "FlowToken": {
      "source": "mainnet://1654653399040a61.FlowToken",
      "aliases": {
        "emulator": "0x0ae53cb6e3f42a79",
        "mainnet": "0x1654653399040a61",
        "testnet": "0x7e60df042a9c0868"
      }
    },
    "FungibleToken": {
      "source": "mainnet://f233dcee88fe0abe.FungibleToken",
      "aliases": {
        "emulator": "0xee82856bf20e2aa6",
        "mainnet": "0xf233dcee88fe0abe",
        "testnet": "0x9a0766d93b6608b7"
      }
    }
  }
}
```

**Key insight:** Notice there's no `mainnet-fork` alias. That's the beauty—`mainnet-fork` automatically inherits the `mainnet` aliases thanks to the fork configuration!

## Test with Flow CLI Scripts

Before connecting a frontend, verify the fork works with a simple script.

Create a directory for scripts:

```bash
mkdir -p cadence/scripts
```

Create `cadence/scripts/get_flow_supply.cdc`:

```cadence
import "FlowToken"

access(all) fun main(): UFix64 {
    return FlowToken.totalSupply
}
```

Notice we're using the import shorthand `import "FlowToken"` instead of an address. The CLI will automatically resolve this to the mainnet address on the fork.

In a **new terminal** (keep the emulator running), execute the script:

```bash
flow scripts execute cadence/scripts/get_flow_supply.cdc --network mainnet-fork
```

You should see the real mainnet FlowToken supply (e.g., `Result: 1523456789.00000000`).

**What happened:**

1. Your script ran on the local emulator
2. The CLI resolved `"FlowToken"` to the mainnet address (`0x1654653399040a61`)
3. The emulator fetched FlowToken contract state from mainnet on-demand
4. The script returned real production data

Now let's connect a frontend.

## Create a React Dapp

Create a React app with Flow integration:

```bash
npx create-react-app flow-fork-app
cd flow-fork-app
npm install @onflow/react-sdk
```

Copy your project's `flow.json` into the React app's `src` directory:

```bash
# From your flow-fork-app directory
cp ../flow.json src/
```

This allows the `FlowProvider` to resolve contract imports.

Replace `src/index.js` with:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FlowProvider } from '@onflow/react-sdk';
import flowJSON from './flow.json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FlowProvider
      config={{
        accessNodeUrl: 'http://localhost:8888', // Point to forked emulator REST endpoint
        flowNetwork: 'mainnet-fork', // Use fork network (inherits mainnet aliases)
        appDetailTitle: 'Flow Fork Demo',
        discoveryWallet: 'http://localhost:8701/fcl/authn', // Dev wallet
      }}
      flowJson={flowJSON}
    >
      <App />
    </FlowProvider>
  </React.StrictMode>,
);
```

Replace `src/App.js` with:

```javascript
import { useState } from 'react';
import { useFlowCurrentUser, useFlowQuery, Connect } from '@onflow/react-sdk';

function App() {
  const { user } = useFlowCurrentUser();
  const [shouldFetch, setShouldFetch] = useState(false);

  // Query FlowToken supply from forked mainnet
  const {
    data: flowSupply,
    isLoading,
    error,
  } = useFlowQuery({
    cadence: `
      import "FlowToken"

      access(all) fun main(): UFix64 {
        return FlowToken.totalSupply
      }
    `,
    args: (arg, t) => [],
    query: {
      enabled: shouldFetch, // Only run when button is clicked
    },
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌊 Flow Emulator Fork Demo</h1>
      <p>
        Connected to: <strong>Forked Mainnet (localhost:8888)</strong>
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h2>FlowToken Supply (Real Mainnet Data)</h2>
        <button onClick={() => setShouldFetch(true)} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get FlowToken Supply'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {flowSupply && (
          <p style={{ fontSize: '1.5rem', color: 'green' }}>
            Total Supply: {Number(flowSupply).toLocaleString()} FLOW
          </p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Wallet Connection</h2>
        <Connect />
        {user?.loggedIn && (
          <p style={{ marginTop: '1rem' }}>
            Connected: <code>{user.addr}</code>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
```

### Start the dev wallet (optional)

For wallet authentication flows, start the FCL dev wallet in another terminal:

```bash
flow dev-wallet
```

This starts the dev wallet at `http://localhost:8701`.

### Run your dapp

Start the React app:

```bash
npm start
```

Your browser will open to `http://localhost:3000`. Click "Get FlowToken Supply" to see real mainnet data!

**What's happening:**

1. `FlowProvider` receives `flow.json` and configures import resolution
2. The string import `import "FlowToken"` resolves to the mainnet address automatically
3. `useFlowQuery` executes the Cadence script via the local emulator
4. The emulator fetches FlowToken state from mainnet on-demand
5. Your app displays real production data—all running locally!

**Key React SDK features used:**

- `FlowProvider` – Wraps your app, configures the Flow connection, and resolves contract imports from `flow.json`
- `useFlowCurrentUser` – Provides wallet authentication state
- `useFlowQuery` – Executes Cadence scripts with automatic caching and loading states
- `Connect` – Pre-built wallet connection UI component

:::tip Contract Import Resolution

By passing `flowJson` to the `FlowProvider`, string imports like `import "FlowToken"` automatically resolve to the correct network addresses.

**How it works:**

1. SDK looks up contract aliases for the specified `flowNetwork`
2. For fork networks, it checks if the network has a `fork` property and inherits aliases from the parent network
3. Contract imports in your Cadence code are replaced with the resolved addresses

**Example:** With `flowNetwork: 'mainnet-fork'` (which has `fork: 'mainnet'`), `import "FlowToken"` resolves to `0x1654653399040a61` (the mainnet FlowToken address).

:::

## Account Impersonation

The forked emulator's superpower: you can execute transactions as **any mainnet account** because signature validation is disabled.

### Read Account Balance

Create `cadence/scripts/get_balance.cdc`:

```cadence
import "FlowToken"
import "FungibleToken"

access(all) fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.capabilities
        .borrow<&{FungibleToken.Balance}>(/public/flowTokenBalance)
        ?? panic("Could not borrow FlowToken Balance reference")

    return vaultRef.balance
}
```

Check the Flow service account balance (a real mainnet account):

```bash
flow scripts execute cadence/scripts/get_balance.cdc 0x1654653399040a61 --network mainnet-fork
```

You'll see the service account's actual mainnet balance! The imports automatically resolved to mainnet addresses because you're using the `mainnet-fork` network.

### Execute Transaction as Any Account

Create `cadence/transactions/transfer_tokens.cdc`:

```cadence
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64, to: Address) {
    let sentVault: @{FungibleToken.Vault}

    prepare(signer: auth(Storage) &Account) {
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow reference to the owner's Vault")

        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let recipient = getAccount(to)
        let receiverRef = recipient.capabilities
            .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow receiver reference")

        receiverRef.deposit(from: <-self.sentVault)
    }
}
```

The forked emulator disables transaction signature validation, allowing you to send transactions as any address without valid signatures.

Now let's test transferring tokens from a mainnet account using impersonation.

### CLI-Based Impersonation

To use impersonation with the CLI, you need to add the mainnet account to your `flow.json` (signature validation is disabled, so the key value doesn't matter):

```json
{
  "accounts": {
    "mainnet-service": {
      "address": "0x1654653399040a61",
      "key": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
```

Transfer tokens from the mainnet service account to another mainnet account:

```bash
# Transfer from mainnet service account to any mainnet address (impersonation!)
flow transactions send cadence/transactions/transfer_tokens.cdc 100.0 0xRECIPIENT_ADDRESS \
  --signer mainnet-service \
  --network mainnet-fork

# Verify the transfer
flow scripts execute cadence/scripts/get_balance.cdc 0xRECIPIENT_ADDRESS \
  --network mainnet-fork
```

### Dev Wallet Authentication with Impersonation

The most powerful feature: when connecting your dapp to the forked emulator with the dev wallet, **you can authenticate as ANY mainnet account** directly in the UI.

Start the dev wallet:

```bash
flow dev-wallet
```

In your dapp (running against the forked emulator), click the wallet connect button. In the dev wallet UI:

1. **Enter any mainnet address** in the address field (e.g., a whale wallet, NFT collector, or protocol account)
2. Click "Authenticate"
3. Your dapp is now authenticated as that mainnet account with all its real balances, NFTs, and storage!

**Additional dev wallet features in fork mode:**

- **Fund accounts**: The dev wallet can add FLOW tokens to any account, even real mainnet accounts
- **No configuration needed**: The dev wallet handles impersonation automatically when connected to a forked emulator
- **Full account state**: Access all assets, storage, and capabilities from the real mainnet account

This lets you:

- Test your dapp as a user with specific assets or permissions
- Debug issues reported by specific mainnet accounts
- Verify flows work for accounts with large balances or many NFTs
- Test edge cases with real account states
- Add test funds to accounts that need more FLOW for testing

:::tip How "Impersonation" Works

The forked emulator simply skips signature verification. You can specify any mainnet address as the signer, and the emulator will execute the transaction as that account. Empty or invalid signatures are accepted. This lets you test with real account balances, storage, and capabilities without needing private keys. For frontend flows with the dev wallet, it works the same way—the wallet can "sign" as any address because the emulator doesn't validate signatures.

:::

## Automating with E2E Testing

The forked emulator works with any E2E testing framework (Cypress, Playwright, Puppeteer, etc.). This lets you automate your dapp tests against production-like state.

### Quick Example with Cypress

```bash
npm install --save-dev cypress
```

Create `cypress/e2e/flow_fork.cy.js`:

```javascript
describe('Flow Fork Test', () => {
  it('reads real mainnet data', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Get FlowToken Supply').click();
    cy.contains('Total Supply:', { timeout: 10000 }).should('be.visible');
  });
});
```

### Running E2E Tests

Run three terminals:

1. **Terminal 1**: `flow emulator --fork mainnet --fork-height <BLOCK_HEIGHT>`
2. **Terminal 2**: `npm start` (your React app)
3. **Terminal 3**: `npx cypress run`

Your tests now run against forked mainnet—**perfect for CI/CD pipelines** with pinned block heights ensuring deterministic results.

:::tip

Use the same approach with Playwright, Puppeteer, or any browser automation tool. The key is having your dapp connect to the forked emulator (`http://localhost:8888`) while your E2E framework tests the UI.

:::

## Common Use Cases

### Testing Contract Upgrades

Test a contract upgrade against real mainnet state by mocking the contract with your upgraded version:

1. Configure the mock in `flow.json` (see [Mocking Mainnet Contracts](#mocking-mainnet-contracts))
2. Start the forked emulator
3. Deploy your upgraded contract: `flow project deploy --network mainnet-fork --update`
4. Test your dapp against the upgraded contract with all real mainnet state intact
5. Verify existing integrations and users aren't broken by the upgrade

### Debugging User-Reported Issues

Reproduce a bug at the exact block height it occurred:

```bash
flow emulator --fork mainnet --fork-height <BLOCK_HEIGHT>
```

Then manually interact with your dapp or run specific transactions to reproduce the issue.

### Testing Wallet Integrations

Test wallet connect flows, transaction signing, and account creation against production-like state:

1. Start forked emulator and dev wallet
2. Use your dapp to authenticate
3. Sign transactions as real mainnet accounts (via impersonation)
4. Verify balance updates, event emissions, etc.

### Running Bots and Indexers

Test automated tools against forked data by pointing your SDK to the local emulator:

**Any Flow SDK works:**

- **JavaScript/TypeScript**: `@onflow/fcl`
- **Go**: `flow-go-sdk`
- **Python**: `flow-py-sdk`
- **Other languages**: Configure to connect to `http://localhost:8888`

**Example with JavaScript:**

```javascript
// Node.js bot that monitors FlowToken transfers
const fcl = require('@onflow/fcl');

fcl.config({
  'accessNode.api': 'http://localhost:8888', // Point to forked emulator
});

async function monitorTransfers() {
  // Subscribe to blocks and process FlowToken events
  // Bot reads real mainnet data but runs locally
}
```

**Example with Go:**

```go
import "github.com/onflow/flow-go-sdk/client"

// Connect to forked emulator
flowClient, err := client.New("localhost:3569", grpc.WithInsecure())

// Your bot/indexer logic reads from forked mainnet state
```

## Best Practices

### 1. Pin Block Heights for Reproducibility

Always pin heights in E2E tests and CI:

```bash
flow emulator --fork mainnet --fork-height 85432100
```

**Why:** Ensures tests run against identical state every time.

### 2. Keep Emulator Running During Development

Start the forked emulator once and leave it running. Restart only when you need to change the fork height or network.

### 3. Use Testnet Before Mainnet

Test against testnet first to avoid mainnet access node rate limits:

```bash
flow emulator --fork testnet --fork-height <BLOCK_HEIGHT>
```

### 4. Mock External Dependencies

The forked emulator only mirrors Flow blockchain state. External APIs, oracles, and cross-chain data won't work. Mock them in your E2E tests:

```javascript
// In Cypress: Mock external oracle response
cy.intercept('GET', 'https://api.example.com/price', {
  statusCode: 200,
  body: { price: 123.45 },
});
```

In your React app, you can mock API calls during testing while keeping real implementations for production.

### 5. Test Against Real User Accounts

The forked emulator disables signature validation, so you can transact as any mainnet account. Just reference the address—empty or invalid signatures are accepted:

```bash
# Execute a transaction as any mainnet account
flow transactions send my_transaction.cdc \
  --signer 0x1234567890abcdef \
  --network mainnet-fork
```

This lets you test with real NFT collector accounts, whale wallets, or any address that has interesting state on mainnet.

### 6. Document Your Fork Heights

Keep a log of which block heights you use for testing and why:

```bash
# .env.test
FORK_HEIGHT_STABLE=<BLOCK_HEIGHT_1>  # Known stable state
FORK_HEIGHT_LATEST=<BLOCK_HEIGHT_2>  # Latest tested state
```

## Limitations and Considerations

### Network State Fetching

Fork mode fetches state from the access node on-demand. The first access to an account or contract fetches data over the network; subsequent accesses benefit from caching. With pinned block heights, caching is very effective.

### Spork Boundaries

Historical data is only available within the current spork. You cannot fork to block heights from previous sporks via public access nodes.

See: [Network Upgrade (Spork) Process].

### Off-Chain Services

The fork only includes Flow blockchain state. External services don't work:

- **Oracles**: Mock responses
- **IPFS/Arweave**: Mock or run local nodes
- **Cross-chain bridges**: Mock or test separately

## Troubleshooting

### Emulator Won't Start

**Error:** `network "mainnet" not found in flow.json`

**Solution:** Make sure your `flow.json` includes the mainnet network:

```json
{
  "networks": {
    "mainnet": "access.mainnet.nodes.onflow.org:9000"
  }
}
```

Or use `--fork-host` directly:

```bash
flow emulator --fork-host access.mainnet.nodes.onflow.org:9000
```

### Contract Import Fails

**Error:** `import "FlowToken" could not be resolved`

**Solution:** Ensure your fork network is properly configured:

```json
{
  "networks": {
    "mainnet-fork": {
      "host": "127.0.0.1:3569",
      "fork": "mainnet"
    }
  }
}
```

And that you've installed dependencies with the mainnet alias:

```bash
flow dependencies install
```

Verify the contract has a mainnet alias that the fork can inherit.

### Dapp Can't Connect

**Error:** Frontend can't reach the emulator

**Solution:** Verify FlowProvider is configured correctly:

```javascript
<FlowProvider
  config={{
    accessNodeUrl: 'http://localhost:8888', // Must match emulator REST port
    flowNetwork: 'mainnet-fork', // Use your fork network from flow.json
  }}
  flowJson={flowJSON}
>
  <App />
</FlowProvider>
```

Check the emulator is running and serving on port 8888.

**Common mistakes:**

1. **Wrong network:** Using `flowNetwork: 'emulator'` when forking mainnet will use emulator contract addresses (`0x0ae53cb6...`) instead of mainnet addresses. Use your fork network name (`'mainnet-fork'`).

2. **Missing fork network in flow.json:** Make sure your `flow.json` has the fork network configured:

   ```json
   "networks": {
     "mainnet-fork": {
       "host": "127.0.0.1:3569",
       "fork": "mainnet"
     }
   }
   ```

3. **Missing flowJson prop:** The `flowJson` prop is required for contract import resolution. Make sure you're importing and passing your `flow.json` file.

### Script Returns Stale Data

**Issue:** Script returns unexpected/old values

**Solution:** The fork fetches state at the pinned height or latest. Verify:

```bash
# Check which block the emulator is at
flow blocks get latest --network emulator
```

If you need fresher data, restart without `--fork-height`.

### E2E Tests Flaky

**Issue:** Tests pass sometimes but fail randomly

**Solution:**

1. Pin block height for consistency
2. Add longer timeouts for network calls
3. Check for race conditions in async code

## When to Use Emulator Fork vs Test Framework Fork

Choose the right tool:

| Use Case                                      | Tool                   |
| --------------------------------------------- | ---------------------- |
| Cadence unit tests                            | `flow test` (no fork)  |
| Cadence integration tests with real contracts | `flow test --fork`     |
| Manual testing with dapp                      | `flow emulator --fork` |
| E2E testing (Cypress/Playwright)              | `flow emulator --fork` |
| Debugging frontend issues                     | `flow emulator --fork` |
| Testing wallets/bots/indexers                 | `flow emulator --fork` |

Both modes complement each other. See [Testing Strategy] for the full picture.

## Conclusion

In this tutorial, you learned how to use the forked emulator for interactive testing, E2E test automation, and manual exploration. You created a React dapp using the Flow React SDK connected to forked mainnet, used account impersonation to test with real account states, and saw how to automate tests with E2E frameworks—all without deploying to a live network.

Now that you have completed this tutorial, you can:

- **Start the emulator in fork mode** with `flow emulator --fork`.
- **Connect your dapp frontend** to the forked emulator.
- **Test against real mainnet contracts** and production data interactively.
- **Run E2E tests** (Cypress, Playwright) against forked state.
- **Use account impersonation** to test as any mainnet account.
- **Pin to specific block heights** for reproducible testing.
- **Debug and explore** contract interactions manually.

The forked emulator bridges the gap between local development and testnet/mainnet deployments. Use it to catch integration issues early, test against real-world conditions, and validate your dapp before going live.

### Next Steps

- Add E2E tests to your CI/CD pipeline using pinned fork heights
- Test your dapp's upgrade flows against forked mainnet
- Explore [Flow React SDK] hooks and components (events, mutations, Cross-VM features)
- For Cadence contract testing, see [Fork Testing with Cadence]
- Review the [Testing Strategy] for the full testing approach
- Check [Flow Emulator] docs for advanced emulator flags

<!-- Reference-style links -->

[Flow CLI]: ../../../build/tools/flow-cli/index.md
[homebrew]: https://brew.sh
[installation guide]: ../../../build/tools/flow-cli/install.md
[Fork Testing with Cadence]: ../fork-testing/index.md
[Testing Strategy]: ../../../build/cadence/smart-contracts/testing-strategy.md
[Network Upgrade (Spork) Process]: ../../../protocol/node-ops/node-operation/network-upgrade.md
[Flow Emulator]: ../../../build/tools/emulator/index.md
[Dependency Manager]: ../../../build/tools/flow-cli/dependency-manager.md
[Flow React SDK]: ../../../build/tools/react-sdk/index.mdx
