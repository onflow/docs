---
title: Hello Flow Credit Markets: Create and Inspect a Position
description: Learn how to create and inspect Flow Credit Markets positions using the frontend and CLI tools
sidebar_position: 1
keywords:
  - flow credit market
  - flow yield vaults
  - yield farming
  - flow blockchain
  - cadence smart contracts
  - defi strategies
  - position management
  - flow credit market
  - moet
  - yield tokens
  - position health
---

# Hello Flow Credit Markets: Create and Inspect a Position

:::warning

Flow Credit Markets (FCM) is currently in closed beta. This tutorial demonstrates the core concepts using emulator forking to test against real deployed contracts on mainnet. The specific implementation of ALP, MOET, and FYV components may change as development progresses.

These tutorials will be updated, but you may need to refactor your code if the implementation changes.

:::

Flow Credit Markets (FCM) is a next-generation DeFi lending platform built on the Flow blockchain that revolutionizes lending infrastructure by replacing reactive liquidations with proactive rebalancing. FCM consists of three core components: the Flow Active Lending Protocol (ALP) for automatic liquidation protection, MOET (Medium of Exchange Token) as the protocol-native stable asset, and Flow Yield Vaults (FYV) for automated yield strategies.

The platform enables users to deposit tokens into leveraged yield strategies. For example, the mUSDC Strategy creates sophisticated token flows where users deposit FLOW tokens, which are used as collateral to borrow MOET (the overcollateralized stable asset used by FCM), which is then swapped to YieldTokens and managed by AutoBalancers for optimal yield generation.

## Learning Objectives

After completing this tutorial, you will be able to:

- Understand how Flow Credit Markets' three core components (ALP, FYV, and MOET) work together
- Create a position using the Flow CLI
- Inspect position state with Cadence scripts
- Identify how Flow Credit Markets tracks collateral, debt, and health

# Prerequisites

## Cadence Programming Language

This tutorial assumes you have a modest knowledge of [Cadence]. If you don't, you'll be able to follow along, but you'll get more out of it if you complete our series of [Cadence] tutorials. Most developers find it more pleasant than other blockchain languages and it's not hard to pick up.

## Working With Cadence

- [Flow CLI] installed and configured
- Basic understanding of Flow [accounts], [scripts], and [transactions]

## DeFi Principles

Before diving into Flow Credit Markets, it's helpful to understand some key DeFi concepts:

- **Collateralized Lending**: Using assets as collateral to borrow other assets
- **Yield Farming**: Strategies that generate returns on deposited assets
- **Auto-Balancing**: Automated systems that maintain optimal asset ratios
- **Position Health**: A metric that indicates the safety of a lending position, measured by Health Factor (HF)
- **Active Rebalancing**: Proactive position management that prevents liquidations through automated adjustments

## Flow Credit Markets: Three Core Components

Flow Credit Markets (FCM) is composed of three intertwined systems that work together to create a revolutionary lending and yield platform:

1. **Flow Active Lending Protocol (ALP)** - Provides automatic liquidation protection through active rebalancing
2. **MOET (Medium of Exchange Token)** - Serves as the protocol-native stable asset that unifies liquidity
3. **Flow Yield Vaults (FYV)** - Delivers automated yield strategies built on top of ALP

### Flow Active Lending Protocol (ALP)

The Flow Active Lending Protocol (ALP) is the foundational lending infrastructure that handles collateralized borrowing with active rebalancing:

- **Core Lending Infrastructure**: Handles collateralized borrowing with scheduled onchain transactions
- **Position Management**: Tracks collateral, debt, and health factors using Flow's unique scheduled callback architecture
- **Active Rebalancing**: Proactively rebalances positions to maintain target health factors, eliminating liquidation risk
- **100% Onchain Automation**: Leverages Flow's scheduled transactions for autonomous position management without external keepers

### MOET: Medium of Exchange Token

MOET (Medium of Exchange Token) is the core stable asset of Flow Credit Markets, engineered to unify liquidity, streamline treasury management, and provide a robust, composable unit of account for the entire ecosystem:

- **Dual-Backing Model**: Always fully backed—either by a 100% reserve of approved stablecoins or by volatile assets at a minimum 125% collateral ratio
- **Minting Mechanisms**:
  - **Stablecoin Deposits**: Users deposit approved stables (USDC, USDF) to mint MOET 1:1
  - **Collateral Borrowing**: Users open overcollateralized positions (≥125%) in ALP, minting MOET against collateral
- **Redemption**: Always available 1:1 for underlying stablecoin deposits, with dynamic fees that protect the peg
- **Protocol Integration**: Serves as the medium of exchange connecting ALP positions to FYV yield strategies

### Flow Yield Vaults (FYV)

Flow Yield Vaults (FYV) is the yield strategy layer built on top of ALP, enabling leveraged yield strategies:

- **Leveraged Yield Strategies**: Creates three-asset relationships (collateral, MOET debt, yield tokens) with automated management
- **Dual Position Management**: Monitors both protocol-layer (ALP) and vault-layer health factors independently
- **Automated Rebalancing**: Executes yield token sales to maintain healthy debt ratios during market volatility
- **Yield Token Integration**: Supports both cross-chain yield tokens (bridged via LayerZero OFT) and Flow-native tokenized yield products

### How the Components Work Together

The three components of FCM work in harmony:

1. **ALP** provides the lending infrastructure where users deposit collateral and borrow MOET
2. **MOET** serves as the stable medium of exchange, allowing non-stable collateral to access stablecoin yields
3. **FYV** uses ALP positions and MOET to create leveraged yield strategies, automatically managing the three-asset relationship (collateral, MOET debt, yield tokens)

When you create a YieldVault position in FYV:

- Your collateral is deposited into an ALP position
- ALP mints MOET against your collateral
- FYV swaps MOET for yield tokens
- Both ALP and FYV monitor and rebalance the position to maintain health and optimize yield

## Health Factor Framework and Dual Rebalancing System

Flow Credit Markets implements a sophisticated **health factor framework** with three levels of position management. Understanding health factors is crucial for managing leveraged positions safely.

### What is a Health Factor?

A **Health Factor (HF)** is a numerical ratio that represents the safety of a lending position. It's calculated as:

```
Health Factor = Effective Collateral Value / Effective Debt Value
```

**What the numbers mean:**

- **HF > 1.0**: Your collateral value exceeds your debt value - position is safe
- **HF = 1.0**: Your collateral exactly equals your debt - at liquidation threshold
- **HF < 1.0**: Your debt exceeds your collateral value - position is underwater and at risk

**Example Calculation:**

Let's say you have:

- **Collateral**: 100 FLOW tokens at $0.50 each = $50.00
- **Collateral Factor**: 0.8 (80% of value counts)
- **Effective Collateral**: $50.00 × 0.8 = $40.00
- **Debt**: 30 MOET at $1.00 each = $30.00
- **Borrow Factor**: 1.0 (100%)
- **Effective Debt**: $30.00 / 1.0 = $30.00

```
Health Factor = $40.00 / $30.00 = 1.33
```

This means your position has 133% collateralization - you have $1.33 in effective collateral for every $1.00 of debt.

### Health Factor (HF) Framework in FCM

Flow Credit Markets uses a three-tier health management system:

#### 1. Initial Health Factor

- **Definition**: User's starting position health when the position is first created
- **Typical Range**: 1.2 - 1.5 for new positions
- **Purpose**: Establishes the baseline safety level for the position

**Example**: When you deposit 100 FLOW and borrow 30 MOET, your initial health factor might be 1.33 (133% collateralization).

#### 2. Rebalancing Health Factor

- **Default Value**: 1.10 (110% collateralization)
- **Purpose**: The threshold that triggers automated rebalancing before liquidation risk
- **Action**: When health factor drops to 1.10, the system automatically intervenes to restore safety

**Example**: If your position health drops to 1.10, the system will:

- Sell yield tokens to repay MOET debt
- Add proceeds to collateral
- Restore health factor to target level

#### 3. Target Health Factor

- **Default Value**: 1.3 (130% collateralization)
- **Purpose**: The optimal health level the protocol maintains through automatic rebalancing
- **Post-Rebalancing**: After intervention, positions are restored to this target level

**Example**: After rebalancing triggers at 1.10, the system will restore your position to 1.30 health factor.

#### 4. Minimum Health (Liquidation Threshold)

- **Default Value**: 1.1 (110% collateralization)
- **Purpose**: The absolute minimum health before liquidation risk
- **FCM Advantage**: With active rebalancing, positions should never reach this threshold

### Health Factor Comparison: Aave vs Flow Credit Markets

#### Aave (Traditional Liquidation Model)

**Typical Health Factors:**

- **Liquidation Threshold**: 1.0 (100% collateralization)
- **Safe Position**: 1.5 - 2.0+ (150% - 200%+ collateralization)
- **At Risk**: Below 1.5
- **Critical**: Below 1.2

**How it works:**

- Health factor continuously decreases as debt accrues interest
- No automatic intervention - users must manually manage positions
- When HF drops below 1.0, position is liquidated
- Liquidation penalty: 5-10% of debt value
- Forced sale at market bottom during crisis

**Example Aave Position:**

```
Collateral: 100 ETH at $2,000 = $200,000
Debt: 150,000 USDC
Health Factor: $200,000 / $150,000 = 1.33

If ETH price drops to $1,500:
New Collateral Value: $150,000
New Health Factor: $150,000 / $150,000 = 1.0 (AT LIQUIDATION RISK!)

If ETH drops further to $1,400:
New Health Factor: $140,000 / $150,000 = 0.93 (LIQUIDATED!)
```

#### Flow Credit Markets (Active Rebalancing Model)

**Typical Health Factors:**

- **Liquidation Threshold**: 1.1 (110% collateralization) - but positions should never reach this
- **Rebalancing Trigger**: 1.10 (110% collateralization)
- **Target Health**: 1.3 (130% collateralization)
- **Safe Position**: 1.3+ maintained automatically

**How it works:**

- Health factor is continuously monitored via scheduled onchain transactions
- Automatic intervention at 1.10 before liquidation risk
- System sells yield tokens to repay debt and restore health
- Positions maintained at target 1.30 health factor
- No liquidation penalties - gradual cost-effective rebalancing

**Example FCM Position:**

```
Initial State:
Collateral: 100 FLOW at $0.50 = $50.00
Debt: 30 MOET = $30.00
Yield Tokens: 30 tokens at $1.00 = $30.00
Health Factor: ($50.00 × 0.8) / $30.00 = 1.33

If FLOW price drops to $0.40:
New Collateral Value: $40.00
New Health Factor: ($40.00 × 0.8) / $30.00 = 1.07

System automatically intervenes:
- Sells 5 Yield Tokens = $5.00
- Repays 5 MOET debt
- New Debt: 25 MOET = $25.00
- New Health Factor: ($40.00 × 0.8) / $25.00 = 1.28

System continues until health restored to 1.30 target
```

### Key Differences

| Aspect                    | Aave                                | Flow Credit Markets             |
| ------------------------- | ----------------------------------- | ------------------------------- |
| **Liquidation Threshold** | 1.0 (100%)                          | 1.1 (110%) - but never reached  |
| **Safe Position**         | 1.5-2.0+ (manual management)        | 1.3 (automatically maintained)  |
| **Intervention**          | None - user must act manually       | Automatic at 1.10               |
| **Cost of Protection**    | Liquidation penalty (5-10% of debt) | Small rebalancing fees (~$2-15) |
| **Market Stress**         | High liquidation risk               | Automatic protection            |
| **User Action Required**  | Constant monitoring                 | None - fully automated          |

### Why the FCM Approach is Superior

1. **Proactive Protection**: FCM intervenes at 1.10 before reaching critical levels, while Aave only acts at 1.0 (too late)
2. **Cost Efficiency**: FCM rebalancing costs ~$2-15 vs Aave liquidation penalties of $1,500-$50,000+
3. **No Manual Management**: FCM maintains positions automatically, while Aave requires constant user attention
4. **Market Recovery**: FCM positions survive market downturns and participate in recovery, while liquidated Aave positions are permanently closed

This tri-level health management strategy creates an early warning and intervention system that prevents positions from reaching critical liquidation zones.

### Dual Position Management Across ALP and FYV

Flow Yield Vaults implement a sophisticated two-tier health monitoring system that leverages both ALP and FYV components:

#### 1. Protocol Layer (Flow ALP)

- **Purpose**: Monitors collateral-to-MOET debt ratio at the base lending layer
- **Component**: Part of the ALP infrastructure
- **Triggers**: When health factor approaches rebalancing threshold (typically 1.10+)
- **Action**: Provides base layer solvency protection through automated rebalancing
- **Protection**: Uses scheduled onchain transactions to maintain position safety

#### 2. Vault Layer (Flow Yield Vaults)

- **Purpose**: Executes rebalancing through yield token sales to optimize for yield while preserving capital
- **Component**: Part of the FYV infrastructure
- **Triggers**: When yield token value moves outside optimal thresholds or health factors approach limits
- **Action**: Calculates optimal yield token sale quantities, executes trades through concentrated liquidity pools, and applies proceeds to MOET debt repayment
- **Optimization**: Ensures maximum yield generation while maintaining position health

These systems work together across ALP and FYV to provide comprehensive protection against liquidation while optimizing for yield generation. The protocol's proactive approach eliminates liquidation risk through continuous monitoring and automated intervention across both components.

## Setting Up Your Environment

Follow these steps to set up a new Flow project that uses Flow Credit Markets contracts via emulator forking. This approach lets you test against real deployed contracts without cloning the entire FlowYieldVaults repository.

**Step 1: Create a New Flow Project**

Create a new directory and initialize a Flow project. For this tutorial, we'll use an **empty project** for simplicity, but you can also use the **DeFi Actions starter** if you prefer:

```bash
mkdir hello-fcm
cd hello-fcm
flow init --yes
```

The `--yes` flag accepts defaults non-interactively.

Choose the `Basic Cadence project`:

```bash
What type of Flow project would you like to create?

> Basic Cadence project (no dependencies)
  Scheduled Transactions project
  Stablecoin project
  DeFi Actions project (build composable DeFi connectors)
  Custom project (select standard Flow contract dependencies)
```

**Step 2: Review Configuration**

:::warning

If your `flow.json` is missing `"mainnet-fork"` you likely need to update the Flow CLI. Run `brew install flow-cli`.

:::

Open `flow.json` and review the mainnet fork network configuration. This enables automatic contract alias inheritance from mainnet:

```json
{
  "networks": {
    "emulator": "127.0.0.1:3569",
    "mainnet": "access.mainnet.nodes.onflow.org:9000",
    "mainnet-fork": {
      "host": "127.0.0.1:3569",
      "fork": "mainnet"
    },
    "testing": "127.0.0.1:3569",
    "testnet": "access.devnet.nodes.onflow.org:9000"
  }
}
```

**What this does:**

- `host`: Points to your local emulator
- `fork`: Tells the CLI to automatically inherit contract aliases from mainnet

Now any contract with a `mainnet` alias will automatically work on `mainnet-fork` without manual configuration!

**Step 3: Install Flow Credit Markets Dependencies**

Use the Flow CLI dependency manager to install Flow Credit Markets contracts from their mainnet addresses. You need to specify each contract explicitly. Select `none` for contracts that ask you to deploy. Also select `no` when asked if you want to set up deployments for dependencies. These would re-deploy copies on emulator, which can be useful for testing, but you're using the real ones. You should also pick `no` for adding aliases:

```bash
# Install FlowToken (core contract - can use simplified syntax)
flow dependencies install FlowToken

# Install DeFiActions
flow dependencies install mainnet://6d888f175c158410.DeFiActions

# Install FlowCreditMarket (Flow Active Lending Protocol)
flow dependencies install mainnet://6b00ff876c299c61.FlowCreditMarket

# Install MOET
flow dependencies install mainnet://6b00ff876c299c61.MOET

# Install FlowYieldVaults
flow dependencies install mainnet://b1d63873c3cc9f79.FlowYieldVaults

# Install FlowYieldVaultsStrategies
flow dependencies install mainnet://b1d63873c3cc9f79.FlowYieldVaultsStrategies

# Install FlowYieldVaultsClosedBeta (required for beta access)
flow dependencies install mainnet://b1d63873c3cc9f79.FlowYieldVaultsClosedBeta

# Install FlowYieldVaultsScheduler (required for creating YieldVaults)
# Note: The contract on mainnet may be deployed as FlowYieldVaultsSchedulerV1
# Try both if one doesn't work:
flow dependencies install mainnet://b1d63873c3cc9f79.FlowYieldVaultsScheduler
# If the above fails, try:
# flow dependencies install mainnet://b1d63873c3cc9f79.FlowYieldVaultsSchedulerV1
```

Alternatively, you can install all contracts from a specific address at once:

```bash
# Install all contracts from the FlowCreditMarket address (includes FlowCreditMarket and MOET)
flow dependencies install mainnet://6b00ff876c299c61

# Install all contracts from the FlowYieldVaults address (includes FlowYieldVaults, FlowYieldVaultsStrategies, FlowYieldVaultsClosedBeta, FlowYieldVaultsScheduler, and related contracts)
flow dependencies install mainnet://b1d63873c3cc9f79
```

:::important

**When prompted for deployment account, select "none":**

When installing dependencies, the Flow CLI will ask you to choose an account to deploy the contract to on emulator. Since we're using emulator forking, **select "none"** to skip deployment.

**Why skip deployment?**

- With emulator forking, contracts are fetched from mainnet on-demand
- You don't need to deploy contracts locally
- The dependency manager is just installing the contract source code for import resolution
- The fork network automatically resolves imports to mainnet addresses

This adds the contracts to your `flow.json` with mainnet aliases that will automatically work on the fork. The Dependency Manager will also install any sub-dependencies these contracts require.

:::

:::info

**How Dependency Manager Works:**

- **With arguments**: `flow dependencies install <contract>` installs the specified contract(s) from mainnet
- **Without arguments**: `flow dependencies install` only installs/updates dependencies already listed in your `flow.json` (like `npm install`)

For more details, see the [Flow CLI Dependency Manager documentation](https://developers.flow.com/build/tools/flow-cli/dependency-manager).

:::

**Step 4: Start the Forked Emulator**

In a separate terminal, start the emulator in fork mode connected to mainnet:

```bash
flow emulator --fork mainnet
```

You'll see output like:

```
5:07PM INF Signature validation automatically disabled for fork mode
5:07PM INF ⚙️ Using service account 0xe467b9dd11fa00df  serviceAddress=e467b9dd11fa00df serviceHashAlgo=SHA3_256 servicePrivKey=1c031f856109f07f202e7cfa0393ece381ab58394e0db3b6ccdc9e1fab9bb8b1 servicePubKey=058e14ea8205be52de941dd3f504cbc6180895b8f9e4d3d8c3b93d999acda086031803d739233de43ded0c6e3693344ca35b78c9a6eb1e58df093cfe98aeebe4 serviceSigAlgo=ECDSA_P256
5:07PM INF Using fork height                            chainId=flow-mainnet forkHeight=135701980 host=access.mainnet.nodes.onflow.org:9000
5:07PM INF 📦 Committed initial reference block for fork mode blockHeight=135701981 blockID=026717f768c5df61def49703dbf11c41b16505a386793a9781169f85c6121c9c
...contract list omitted for brevity
5:07PM INF 🌱 Starting gRPC server on port 3569          port=3569
5:07PM INF 🌱 Starting REST API on port 8888             port=8888
5:07PM INF 🌱 Starting admin server on port 8080         port=8080
5:07PM INF 🌱 Starting debugger on port 2345             port=2345
```

**Leave this terminal running.** The emulator is now serving:

- **REST API**: `http://localhost:8888` (for FCL/frontend)
- **gRPC API**: `localhost:3569` (for Flow CLI)

:::tip

**Why forking is powerful:**

The emulator fork mode gives you access to **real mainnet state**:

- ✅ Test against actual deployed contracts (FlowCreditMarket, FlowYieldVaults, MOET)
- ✅ Read real account balances, storage, and capabilities
- ✅ Query production data without setting up test fixtures
- ✅ Catch integration issues with real-world contract implementations
- ✅ Debug with historical state by pinning block heights

**Plus, fork networks simplify configuration:**

- ✅ No need to duplicate contract aliases
- ✅ Automatic inheritance from source network
- ✅ Can override specific contracts if needed

:::

**Step 5: Verify Setup**

Check that the forked emulator is working by querying a deployed contract. Generate a verification script:

```bash
flow generate script VerifySetup
```

This creates `cadence/scripts/VerifySetup.cdc`. Replace its contents with:

```cadence
import "FlowToken"

access(all) fun main(): String {
    return "FlowToken total supply: ".concat(FlowToken.totalSupply.toString())
}
```

Then execute it:

```bash
flow scripts execute cadence/scripts/VerifySetup.cdc --network mainnet-fork
```

You should see the real mainnet FlowToken supply, confirming the fork is working correctly.

:::warning

Keep the emulator running in a separate terminal window throughout this tutorial. If you stop the emulator, you'll need to restart it.

:::

## Understanding Position Creation and IDs

Before creating positions, it's important to understand how the system works and the different types of identifiers involved.

### Borrowing Capacity Calculation

When you deposit collateral, the system calculates your maximum borrowing capacity using this formula:

```
Effective Collateral = Collateral Amount × Oracle Price × Collateral Factor
Max Borrowable Value = Effective Collateral / Target Health Factor
Max Borrowable Tokens = Max Borrowable Value / Borrow Token Price
```

**Example with 100 FLOW:**

- FLOW Price: $0.50 (from oracle)
- Collateral Factor: 0.8 (80%)
- Target Health Factor: 1.3 (130% collateralization) - this is the FCM target health
- MOET Price: $1.00

```
Effective Collateral = 100 FLOW × $0.50 × 0.8 = $40.00
Max Borrowable Value = $40.00 / 1.3 = $30.77
Max MOET Borrowable = $30.77 / $1.00 = 30.77 MOET
```

**What this means:**

- If you borrow the maximum (30.77 MOET), your initial health factor will be exactly 1.30
- This is the FCM target health factor - a safe, automatically maintained level
- Compare this to Aave, where safe positions typically need 1.5-2.0+ health factor (requiring more collateral for the same borrowing capacity)

**If you borrow less (e.g., 25 MOET):**

```
Initial Health Factor = $40.00 / $25.00 = 1.60
```

This gives you more safety buffer, but you're using less of your available borrowing capacity.

### Position ID vs YieldVault ID

The system uses two different identifiers:

- **Position ID (pid)**: Flow Active Lending Protocol (ALP) lending position identifier - tracks the actual lending/borrowing position in ALP
- **YieldVault ID**: Flow Yield Vaults (FYV) strategy wrapper identifier - tracks the yield strategy that wraps the ALP position

These are separate identifiers that serve different purposes across the FCM component architecture. Each YieldVault in FYV wraps an underlying ALP position, and both use MOET as the medium of exchange.

## Creating Your First Position

Now let's create a position using the Flow CLI. The process involves sending transactions to create a YieldVault position and then inspecting it with scripts.

### Step 1: Set Up Test Account

First, create a new test account that we'll use for this tutorial:

```bash
flow accounts create
```

Name it `fcm-test` and select `mainnet` for the network.

This will generate a new account with a new key pair. The CLI will output the account address and key information - save this information as you'll need it for signing transactions.

You'll also need funding for this account. The easiest way to accomplish this is to use account impersonation to test with an existing mainnet account. Update the account in `flow.json`:

```json
{
  "accounts": {
    "fcm-test": {
      "address": "YOUR_FUNDED_ADDRESS_NO_0x",
      "key": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
```

:::danger

Never hardcode real keys in `flow.json`. Your assets will be lost if you push the file to GitHub. Use `.pkey` files.

:::

The forked emulator disables signature validation, so you can use any address (the key value doesn't matter).

Run `flow accounts list` and make sure you've selected a funded account.

### Step 2: Get Transaction and Script Files

Since we're working in a new project, you'll need the transaction and script files from the FlowYieldVaults repository before you can run any transactions. You have two options:

**Option 1: Copy files from FlowYieldVaults repository (Recommended)**

From your `hello-fcm` project directory, clone the FlowYieldVaults repository temporarily to copy the files you need:

```bash
git clone https://github.com/onflow/FlowYieldVaults temp-fyv
cp -r temp-fyv/cadence/transactions/flow-yield-vaults cadence/transactions/
cp -r temp-fyv/cadence/scripts/flow-yield-vaults cadence/scripts/
rm -rf temp-fyv
```

**Option 2: Use git submodule**

Add FlowYieldVaults as a submodule to reference the files:

```bash
git submodule add https://github.com/onflow/FlowYieldVaults lib/FlowYieldVaults
```

Then reference the files with their full paths:

```bash
flow transactions send lib/FlowYieldVaults/cadence/transactions/flow-yield-vaults/setup.cdc \
  --network mainnet-fork --signer fcm-test
```

For this tutorial, we'll assume you've copied the files to your project's `cadence/` directory (Option 1).

### Step 3: Grant Beta Access

Before setting up your account, you need to grant beta access to your `fcm-test` account. This is required during the closed beta phase.

The `grant_beta.cdc` transaction requires two signers: an admin account (with AdminHandle) and the user account. With emulator forking, you can impersonate the mainnet admin account.

First, add the mainnet admin account to your `flow.json`. The FlowYieldVaults contract is deployed at `b1d63873c3cc9f79` on mainnet, which should have the AdminHandle.

For emulator forking, you need valid-looking keys (even though signatures won't be validated). Generate a dummy key or use a valid hex key format. Here's an example using a valid-looking dummy key:

```json
{
  "accounts": {
    "fcm-test": {
      "address": "YOUR_FUNDED_ADDRESS_NO_0x",
      "key": "0000000000000000000000000000000000000000000000000000000000000001"
    },
    "fcm-admin": {
      "address": "b1d63873c3cc9f79",
      "key": "0000000000000000000000000000000000000000000000000000000000000001"
    }
  }
}
```

Alternatively, you can generate a valid key pair using:

```bash
flow keys generate
```

Then use the private key from the output (but remember, with emulator forking, the actual key value doesn't matter for validation).

Then run the grant_beta transaction with both authorizers. The transaction requires two authorizers: first the admin account, then the user account:

```bash
# Grant beta access to your account
# The admin account grants beta access to the user account
flow transactions send cadence/transactions/flow-yield-vaults/admin/grant_beta.cdc \
  --network mainnet-fork \
  --authorizer fcm-admin \
  --authorizer fcm-test \
  --proposer fcm-test \
  --payer fcm-test
```

The `--authorizer` flags specify which accounts authorize the transaction (in order: admin, then user). The `--proposer` and `--payer` flags specify which account proposes and pays for the transaction (typically the user account).

:::info

With emulator forking, you can impersonate any mainnet account. The forked emulator disables signature validation, so you can execute transactions as any account. The admin account (`b1d63873c3cc9f79`) has the AdminHandle resource needed to grant beta access.

:::

This transaction grants the necessary beta badge to your `fcm-test` account, storing it at the canonical path, allowing it to create YieldVaults.

### Step 4: Set Up Your Account

Now ensure your account has the necessary setup for Flow Credit Markets. First, you need to fix the `setup.cdc` transaction file. Open `cadence/transactions/flow-yield-vaults/setup.cdc` and make two changes:

1. **Add the missing import** at the top:

```cadence
import "FlowYieldVaultsClosedBeta"
```

2. **Add `CopyValue` to the authorization list** in the `prepare` function. Change:

```cadence
prepare(signer: auth(BorrowValue, SaveValue, StorageCapabilities, PublishCapability) &Account) {
```

To:

```cadence
prepare(signer: auth(BorrowValue, SaveValue, StorageCapabilities, PublishCapability, CopyValue) &Account) {
```

Now run the setup transaction:

```bash
# Setup user account with YieldVaultManager
flow transactions send cadence/transactions/flow-yield-vaults/setup.cdc \
  --network mainnet-fork --signer fcm-test
```

This transaction creates a `YieldVaultManager` resource in your account's storage and publishes the necessary capabilities.

:::tip

**Alternative: Use Account Impersonation**

If you're using account impersonation with a mainnet account that already has beta access set up, you can skip the `grant_beta` step (Step 3) and go directly to setup. The account will already have the beta badge capability stored.

:::

**Note**: During the closed beta phase, beta access is required to create YieldVaults across all networks (emulator, testnet, mainnet). The `grant_beta` transaction grant this access to the selected account on the network it is called on.

### Step 5: Create a Position

Now let's create and manage a YieldVault position. First, let's check what strategies are available:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_supported_strategies.cdc --network mainnet-fork
```

You should see output showing the strategies available on mainnet. For example:

```
Result: [Type<A.b1d63873c3cc9f79.FlowYieldVaultsStrategies.mUSDCStrategy>(), Type<A.b1d63873c3cc9f79.PMStrategies.syWFLOWvStrategy>()]
```

:::important

**Check Available Strategies First**

The strategies available on mainnet may differ from development environments. Always run `get_supported_strategies` first to see what strategies are actually available before attempting to create a position. If you get an error saying a strategy is "unsupported", it means that strategy hasn't been registered on mainnet yet.

**Note:** On mainnet, you will see strategies like `mUSDCStrategy` or `syWFLOWvStrategy`. Use the strategies that are actually returned by this script.

:::

Create a YieldVault position with 100 FLOW tokens as collateral. **Use a strategy from the list returned by `get_supported_strategies`**.

:::important

**Computation Limit Required**

These transactions require higher computation limits due to oracle calls and EVM interactions. Always include `--compute-limit 9999` (or higher) when creating YieldVault positions.

:::

For this tutorial, we'll use `mUSDCStrategy` which is compatible with emulator forking:

```bash
flow transactions send cadence/transactions/flow-yield-vaults/create_yield_vault.cdc \
  --network mainnet-fork --signer fcm-test \
  --compute-limit 9999 \
  --args-json '[
    {"type":"String","value":"A.b1d63873c3cc9f79.FlowYieldVaultsStrategies.mUSDCStrategy"},
    {"type":"String","value":"A.1654653399040a61.FlowToken.Vault"},
    {"type":"UFix64","value":"100.0"}
  ]'
```

:::note

**Strategy Compatibility:**

Not all strategies work with emulator forking. Some strategies (like `syWFLOWvStrategy`) may fail due to:

- Missing liquidity in Uniswap pools on the forked network
- Swap route configuration issues
- EVM contract state differences between mainnet and the fork

If a strategy fails with swap errors, try a different strategy from the `get_supported_strategies` output. `mUSDCStrategy` is recommended for this tutorial as it works reliably with emulator forking.

:::

This transaction orchestrates all three FCM components:

- **ALP**: Creates a lending position with 100 FLOW tokens as collateral
- **MOET**: Mints MOET against the collateral (based on collateral factor)
- **FYV**: Creates a YieldVault using the mUSDC Strategy, swaps MOET for YieldTokens, and sets up the complete DeFi Actions stack including AutoBalancer
- Returns a YieldVault ID for future reference

### Step 6: Verify Position Creation

Check that your position was created successfully by querying your YieldVault IDs:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_yield_vault_ids.cdc \
  --network mainnet-fork \
  --args-json '[{"type":"Address","value":"YOUR_ACCOUNT_ADDRESS"}]'
```

Replace `YOUR_ACCOUNT_ADDRESS` with the address of your `fcm-test` account. You can find this address by running:

```bash
flow accounts list --network mainnet-fork
```

Look for the `fcm-test` account entry to get its address.

After running the script, you should see:

```bash
Result: [28]
```

This is the array of your YieldVault IDs. Your YieldVault position is live and ready for further operations.

### Review of the Core Contracts

Let's examine the main contracts that make Flow Credit Markets work. You can view the full source code in the [FlowYieldVaults repository](https://github.com/onflow/FlowYieldVaults):

#### 1. FlowYieldVaults.cdc - Flow Yield Vaults Main Contract

**Source:** [`cadence/contracts/FlowYieldVaults.cdc`](https://github.com/onflow/FlowYieldVaults/blob/main/cadence/contracts/FlowYieldVaults.cdc)

The main contract orchestrates the entire yield farming system:

- **Strategy Interface**: Defines yield-generating strategies that can deposit/withdraw tokens
- **YieldVault Resource**: Represents a user's position in a specific strategy within Flow Yield Vaults
- **YieldVaultManager**: Manages multiple YieldVault positions for a user account

#### 2. FlowYieldVaultsStrategies.cdc - Strategy Implementations

**Source:** [`cadence/contracts/FlowYieldVaultsStrategies.cdc`](https://github.com/onflow/FlowYieldVaults/blob/main/cadence/contracts/FlowYieldVaultsStrategies.cdc)

Implements the mUSDC Strategy that demonstrates the power of DeFi Actions composition.

#### 3. FlowYieldVaultsAutoBalancers.cdc - Auto-Balancing System

**Source:** [`cadence/contracts/FlowYieldVaultsAutoBalancers.cdc`](https://github.com/onflow/FlowYieldVaults/blob/main/cadence/contracts/FlowYieldVaultsAutoBalancers.cdc)

Manages automated rebalancing of positions:

- Stores AutoBalancer instances in contract storage
- Automatically rebalances positions when they move outside configured thresholds (±5%)
- Cleans up AutoBalancers when strategies are closed

### Understanding the FLOW → MOET → YieldToken Flow Across FCM Components

The mUSDC Strategy demonstrates how the three FCM components work together to create a sophisticated token flow:

```
User Deposit (FLOW)
    ↓
[ALP Component] Flow Active Lending Protocol Position created
    ↓
[MOET Component] MOET minted against collateral
    ↓
[FYV Component] MOET swapped to YieldToken → AutoBalancer
    ↓
[FYV + ALP] YieldToken → Swap to FLOW → Recollateralize ALP Position
```

Here's how the three components interact:

1. **Initial Position Opening**:
   - **ALP**: User deposits FLOW → ALP creates a lending position
   - **MOET**: ALP mints MOET against the collateral (the overcollateralized stable asset)
   - **FYV**: FYV swaps MOET for YieldToken and holds it in AutoBalancer

2. **Auto-Balancing Infrastructure (FYV Component)**:
   - `abaSwapSink`: MOET → YieldToken → AutoBalancer
   - `abaSwapSource`: YieldToken → MOET (from AutoBalancer)
   - `positionSwapSink`: YieldToken → FLOW → ALP Position (recollateralizing)

3. **Rebalancing Triggers (Coordinated Across Components)**:
   - **Over-Collateralized** (YieldToken value > 105%): FYV sells excess YieldToken → Converts to FLOW → Adds to ALP Position Collateral
   - **Under-Collateralized** (YieldToken value < 95%): FYV sells YieldToken → Converts to FLOW → Adds to ALP Position Collateral → Reduces MOET debt risk

## Querying Your YieldVault Further

Check the balance of your YieldVault:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_yield_vault_balance.cdc \
  --network mainnet-fork \
  --args-json '[
    {"type":"Address","value":"YOUR_ACCOUNT_ADDRESS"},
    {"type":"UInt64","value":"YOUR_VAULT_ID"}
  ]'
```

You'll see:

```bash
Result: 100.00000000
```

### Getting Complete Position Information

For a comprehensive view of your position, use the complete position info script:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_complete_user_position_info.cdc \
  --network mainnet-fork \
  --args-json '[{"type":"Address","value":"YOUR_ACCOUNT_ADDRESS"}]'
```

This script returns detailed information including:

- Collateral information (FLOW balance and value)
- YieldToken information (balance, value, price)
- Debt information (estimated MOET debt)
- Health metrics (leverage ratio, health ratio, net worth)
- Portfolio summary across all positions

Your result will be similar to:

```bash
Result: s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.CompleteUserSummary(userAddress: YOUR_ACCOUNT_ADDRESS, totalPositions: 1, portfolioSummary: s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.PortfolioSummary(totalCollateralValue: 0.00000000, totalYieldTokenValue: 0.00000000, totalEstimatedDebtValue: 0.00000000, totalNetWorth: 0.00000000, averageLeverageRatio: 1.00000000, portfolioHealthRatio: 1.00000000), positions: [s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.CompletePositionInfo(yieldVaultId: 28, collateralInfo: s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.CollateralInfo(collateralType: "A.1654653399040a61.FlowToken.Vault", availableBalance: 0.00000000, collateralValue: 0.00000000, collateralPrice: 0.50000000, supportedTypes: ["A.1654653399040a61.FlowToken.Vault"]), yieldTokenInfo: s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.YieldTokenInfo(yieldTokenBalance: 0.00000000, yieldTokenValue: 0.00000000, yieldTokenPrice: 2.00000000, yieldTokenIdentifier: "A.b1d63873c3cc9f79.YieldToken.Vault", isActive: true), debtInfo: s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.DebtInfo(estimatedMoetDebt: 0.00000000, estimatedDebtValue: 0.00000000, moetPrice: 1.00000000, loanTokenIdentifier: "A.6b00ff876c299c61.MOET.Vault"), healthMetrics: s.a5a94f8ebf5823473d08ffc61f6991f0fe163673240c4b786098c709d353e71c.HealthMetrics(realAvailableBalance: 0.00000000, estimatedCollateralValue: 0.00000000, liquidationRiskThreshold: 1.10000000, autoRebalanceThreshold: 1.10000000, optimalHealthRatio: 1.30000000, maxEfficiencyThreshold: 1.50000000, netWorth: 0.00000000, leverageRatio: 1.00000000, yieldTokenRatio: 1.00000000, estimatedHealth: 340282366920938.463463374607431768211455))], timestamp: 1765500058.00000000)
```

### Understanding AutoBalancer Architecture

Each YieldVault gets its own dedicated AutoBalancer with a unique ID:

- **Global Storage**: AutoBalancers are stored in the `FlowYieldVaultsAutoBalancers` contract (not in user accounts)
- **Per-YieldVault**: Each YieldVault gets its own AutoBalancer identified by YieldVault ID (0, 1, 2, etc.)
- **Sequential IDs**: YieldVault IDs are assigned sequentially across all users
- **Multiple YieldVaults**: You can create multiple YieldVaults, each with its own AutoBalancer
- **Automatic Cleanup**: When you close a YieldVault, its AutoBalancer is automatically destroyed

**Example**: If you create YieldVault 0, another user creates YieldVault 1, and you create another YieldVault 2, you'll have AutoBalancers with IDs 0, 1, and 2 respectively. Users may have more than one YieldVault and more than one AutoBalancer.

Let's examine the AutoBalancer configuration. Your AutoBalancer ids match your yield vault ids, so if you want, you can run the script again to find them:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_yield_vault_ids.cdc \
  --network mainnet-fork \
  --args-json '[{"type":"Address","value":"YOUR_ACCOUNT_ADDRESS"}]'
```

Then, run the script to get the **balance** for one of the ids returned:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_auto_balancer_balance_by_id.cdc \
  --network mainnet-fork \
  --args-json '[{"type":"UInt64","value":"YOUR_VAULT_ID"}]'
```

With mainnet forking, you may see:

```bash
Result: 0.000000000
```

:::important

**Expected Behavior with Mainnet Forking:**

When using `mUSDCStrategy` with mainnet forking, you may see a balance of `0.00000000` because:

1. **EVM Swap Requirements**: The mUSDCStrategy swaps MOET to YieldToken via Uniswap V3, which requires EVM contract interactions
2. **Swap May Not Complete**: The swap from MOET to YieldToken may not complete successfully in the forked environment due to:
   - Missing liquidity in Uniswap pools on the fork
   - EVM bridge state differences
   - Pool configuration issues
3. **Position Created, Tokens Not Deposited**: The YieldVault position is created successfully, but if the swap fails, the AutoBalancer won't receive yield tokens

This is expected behavior when using strategies that require EVM interactions with mainnet forking. The position is created, but the yield token acquisition step may not complete.

**To verify your position was created:**

- Check that `get_yield_vault_ids` returns your YieldVault ID (e.g., `[28]`)
- The position exists even if the AutoBalancer balance is 0

**In production or testnet**, the swap would complete and you'd see a non-zero balance.

:::

If you do see a non-zero balance, check the current USD **value** of the AutoBalancer:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_auto_balancer_current_value_by_id.cdc \
  --network mainnet-fork \
  --args-json '[{"type":"UInt64","value":"YOUR_VAULT_ID"}]'
```

:::info

**Balance vs Value:**

- **Balance**: The raw token amount in the AutoBalancer (e.g., `30.76923076` YieldTokens)
- **Value**: The USD value of that balance (balance × token price)

If the token price is $1.00, these values will be identical. The value changes as the token price changes.

:::

## Understanding the Strategy Architecture

The mUSDC Strategy demonstrates sophisticated DeFi Actions composition. Let's examine how it works:

### Strategy Composition

The mUSDC Strategy Composer creates a complex stack of DeFi Actions. Here's a simplified overview of the key components:

**Source:** [`cadence/contracts/FlowYieldVaultsStrategies.cdc`](https://github.com/onflow/FlowYieldVaults/blob/main/cadence/contracts/FlowYieldVaultsStrategies.cdc) (see `mUSDCStrategyComposer.createStrategy` starting at line 339)

```cadence
// 1. Configure AutoBalancer for this stack
let autoBalancer = FlowYieldVaultsAutoBalancers._initNewAutoBalancer(
    oracle: yieldTokenOracle,      // ERC4626 price oracle for NAV calculations
    vaultType: yieldTokenType,      // YieldToken holdings monitored
    lowerThreshold: 0.95,           // Trigger recollateralization at 95%
    upperThreshold: 1.05,            // Trigger rebalancing at 105%
    rebalanceSink: nil,              // Set later after position creation
    rebalanceSource: nil,            // Not used in mUSDCStrategy
    recurringConfig: recurringConfig, // Enables native AutoBalancer self-scheduling
    uniqueID: uniqueID               // Links to specific Strategy
)

// 2. Create MOET -> YieldToken swapper (MultiSwapper with two routes)
//    - Route 1: MOET -> YIELD via Uniswap V3 AMM
//    - Route 2: MOET -> UNDERLYING -> YIELD (via ERC4626 vault)
let moetToYieldSwapper = SwapConnectors.MultiSwapper(
    inVault: moetTokenType,
    outVault: yieldTokenType,
    swappers: [moetToYieldAMMSwapper, moetToYieldSeqSwapper],
    uniqueID: uniqueID
)

// 3. Create YIELD -> MOET swapper (for rebalancing)
let yieldToMOETSwapper = UniswapV3SwapConnectors.Swapper(...)

// 4. SwapSink directing swapped funds to AutoBalancer
let abaSwapSink = SwapConnectors.SwapSink(
    swapper: moetToYieldSwapper,
    sink: abaSink,
    uniqueID: uniqueID
)

// 5. SwapSource sourcing from AutoBalancer
let abaSwapSource = SwapConnectors.SwapSource(
    swapper: yieldToMOETSwapper,
    source: abaSource,
    uniqueID: uniqueID
)

// 6. Create FlowCreditMarket position with MOET borrowing
let position = poolRef.createPosition(
    funds: <-withFunds,
    issuanceSink: abaSwapSink,      // MOET -> YIELD -> AutoBalancer
    repaymentSource: abaSwapSource,  // AutoBalancer -> YIELD -> MOET
    pushToDrawDownSink: true
)

// 7. Create YieldToken -> FLOW swapper for recollateralization
let yieldToFlowSwapper = UniswapV3SwapConnectors.Swapper(...)
let positionSwapSink = SwapConnectors.SwapSink(
    swapper: yieldToFlowSwapper,
    sink: positionSink,
    uniqueID: uniqueID
)

// 8. Set AutoBalancer's rebalance sink (for excess value)
autoBalancer.setSink(positionSwapSink, updateSinkID: true)
```

:::info

**Full Implementation:**

The actual implementation is much more complex, including:

- Multiple Uniswap V3 swappers for different token paths
- ERC4626 vault integration for yield token deposits/withdrawals
- Sequential swapper composition for multi-step swaps
- FlowCreditMarket position creation and management
- Native recurring scheduling for automatic rebalancing

See the complete implementation in [`FlowYieldVaultsStrategies.cdc`](https://github.com/onflow/FlowYieldVaults/blob/main/cadence/contracts/FlowYieldVaultsStrategies.cdc) starting at line 339.

:::

### Auto-Balancing Mechanism

The AutoBalancer monitors the value of deposits vs. current token holdings:

- **Lower Threshold (95%)**: When YieldToken value drops below 95% of expected value, it triggers recollateralization
- **Upper Threshold (105%)**: When YieldToken value exceeds 105% of expected value, excess flows into position recollateralization

### Manual Rebalancing

You can manually trigger rebalancing:

```bash
flow transactions send cadence/transactions/flow-yield-vaults/admin/rebalance_auto_balancer_by_id.cdc \
  --network mainnet-fork --signer fcm-test \
  --args-json '[
    {"type":"UInt64","value":"YOUR_VAULT_ID"},
    {"type":"Bool","value":"true"}
  ]'
```

## Additional Operations

### Depositing Additional Funds

Add more funds to an existing YieldVault:

```bash
flow transactions send cadence/transactions/flow-yield-vaults/deposit_to_yield_vault.cdc \
  --network mainnet-fork --signer fcm-test \
  --args-json '[
    {"type":"UInt64","value":"YOUR_VAULT_ID"},
    {"type":"UFix64","value":"50.0"}
  ]'
```

You should see several events, and you can check that the balance changed in the account with `flow accounts list` and on the YieldVault with:

```bash
flow scripts execute cadence/scripts/flow-yield-vaults/get_yield_vault_balance.cdc \
  --network mainnet-fork \
  --args-json '[{"type":"Address","value":"YOUR_ACCOUNT_ADDRESS"},{"type":"UInt64","value":"YOUR_VAULT_ID"}]'
```

### Withdrawing from a YieldVault

Withdraw funds from your YieldVault:

```bash
flow transactions send cadence/transactions/flow-yield-vaults/withdraw_from_yield_vault.cdc \
  --network mainnet-fork --signer fcm-test \
  --args-json '[
    {"type":"UInt64","value":"YOUR_VAULT_ID"},
    {"type":"UFix64","value":"25.0"}
  ]'
```

### Closing a YieldVault

Close your YieldVault and withdraw all funds:

```bash
flow transactions send cadence/transactions/flow-yield-vaults/close_yield_vault.cdc \
  --network mainnet-fork --signer fcm-test \
  --args-json '[{"type":"UInt64","value":"YOUR_VAULT_ID"}]'
```

## Understanding the Token Flow in Detail Across FCM Components

Let's trace through what happens when you create a YieldVault, showing how ALP, MOET, and FYV work together:

### 1. Initial Deposit Flow

```
User deposits 100 FLOW
    ↓
[ALP Component] Flow Active Lending Protocol Position created
    ↓
[MOET Component] ALP mints MOET against collateral (125% overcollateralized)
    ↓
[FYV Component] MOET → Swap to YieldToken (via MockSwapper)
    ↓
[FYV Component] YieldToken deposited to AutoBalancer
    ↓
[ALP + FYV] Both components monitor value ratios and health factors
```

### 2. Auto-Balancing Flow (Coordinated Across Components)

**When YieldToken value > 105% of expected:**

```
[FYV Component] Excess YieldToken detected
    ↓
[FYV Component] Swap to FLOW (via positionSwapSink)
    ↓
[ALP Component] Add FLOW to Position Collateral
    ↓
[ALP Component] MOET debt ratio improves, position becomes healthier
```

**When YieldToken value < 95% of expected:**

```
[FYV Component] YieldToken value drops below threshold
    ↓
[FYV Component] Swap YieldToken to FLOW (via positionSwapSink)
    ↓
[ALP Component] Add FLOW to Position Collateral
    ↓
[ALP Component] Reduce MOET debt risk, improve health ratio
```

### 3. Value Calculations

The system uses oracle prices to calculate values:

- FLOW Price: $0.50 (set in MockOracle)
- YieldToken Price: $1.00 (set in MockOracle)
- MOET Price: $1.00 (Medium of Exchange Token, always fully backed by stablecoins or 125% overcollateralized positions)

Health calculations:

- Collateral Value = FLOW Amount × FLOW Price
- YieldToken Value = YieldToken Amount × YieldToken Price
- Debt Value = MOET Amount × MOET Price
- Health Ratio = (Collateral Value + YieldToken Value) / Debt Value

## Conclusion

In this tutorial, you learned about Flow Credit Markets (FCM), a next-generation DeFi lending platform built on Flow that revolutionizes lending infrastructure by replacing reactive liquidations with proactive rebalancing. FCM is composed of three core components that work together:

- **Flow Active Lending Protocol (ALP)**: Provides automatic liquidation protection through active rebalancing
- **MOET (Medium of Exchange Token)**: Serves as the protocol-native stable asset that unifies liquidity
- **Flow Yield Vaults (FYV)**: Delivers automated yield strategies built on top of ALP

You explored:

- How to deploy the Flow Credit Markets emulator environment with all three components
- How ALP, MOET, and FYV work together in the FLOW → MOET → YieldToken flow to generate yield
- How to create and manage YieldVault positions that leverage all three FCM components
- How the dual rebalancing system coordinates across ALP and FYV to maintain optimal position ratios automatically
- How to query comprehensive position information including health factors across components
- The sophisticated DeFi Actions composition that powers the platform
- How scheduled onchain transactions enable 100% autonomous position management across ALP and FYV

The mUSDC Strategy demonstrates how the three FCM components work together, with ALP providing the lending infrastructure, MOET serving as the stable medium of exchange, and FYV creating a self-balancing yield farming position that automatically optimizes returns while managing risk through intelligent rebalancing mechanisms. Unlike traditional liquidation-based protocols, the FCM active rebalancing approach eliminates liquidation risk through continuous monitoring and automated intervention across all components.

Flow Credit Markets represents a fundamental advancement in DeFi infrastructure, demonstrating that active rebalancing can eliminate the liquidation risks that have constrained lending protocol adoption. Through the coordinated operation of ALP, MOET, and FYV, along with sophisticated automation, concentrated liquidity optimization, and the Flow blockchain's unique capabilities, FCM delivers superior cost efficiency while preserving user positions during market stress.

<!-- Reference-style links, will not render on page. -->

[Cadence]: https://cadence-lang.org/docs
[DeFi Actions]: https://developers.flow.com/blockchain-development-tutorials/forte/flow-actions
[Flow Active Lending Protocol]: https://github.com/onflow/FlowCreditMarket
[Flow CLI]: https://developers.flow.com/tools/flow-cli
[accounts]: https://developers.flow.com/build/cadence/basics/accounts
[scripts]: https://developers.flow.com/build/cadence/basics/scripts
[transactions]: https://developers.flow.com/build/cadence/basics/transactions
