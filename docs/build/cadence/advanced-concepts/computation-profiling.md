---
title: Cadence Computation Profiling
description: This guide provides comprehensive instructions for using the computation profiling and reporting features in the Flow Emulator. These tools help Cadence developers analyze and optimize their smart contracts by understanding computational costs and identifying performance bottlenecks.
keywords:
  - computation profiling
  - Flow Emulator
  - smart contract optimization
  - performance analysis
  - computational costs
  - Cadence
  - profiling
  - performance bottlenecks
sidebar_position: 1
---

# Cadence Computation Profiling

This guide provides comprehensive instructions for using the computation profiling and reporting features in the Flow Emulator. These tools help Cadence developers analyze and optimize their smart contracts by understanding computational costs and identifying performance bottlenecks.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Computation Reporting](#computation-reporting)
  - [Enabling Computation Reporting](#enabling-computation-reporting)
  - [Viewing Computation Reports](#viewing-computation-reports)
- [Computation Profiling (pprof)](#computation-profiling-pprof)
  - [Enabling Computation Profiling](#enabling-computation-profiling)
  - [Downloading the Profile](#downloading-the-profile)
  - [Viewing Profiles with pprof](#viewing-profiles-with-pprof)
  - [Viewing Source Code in pprof](#viewing-source-code-in-pprof)
  - [Resetting Computation Profiles](#resetting-computation-profiles)
- [Using Source File Pragmas](#using-source-file-pragmas)
- [Practical Examples](#practical-examples)
  - [Profiling a Simple Transaction](#profiling-a-simple-transaction)
  - [Identifying Performance Bottlenecks](#identifying-performance-bottlenecks)
  - [Comparing Computation Costs](#comparing-computation-costs)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Related Features](#related-features)

## Introduction

When developing smart contracts on Flow, understanding computational costs is essential for:

- **Performance Optimization**: Identify slow operations and optimize your code
- **Cost Awareness**: Understand how much computation your transactions and scripts consume
- **Bottleneck Identification**: Pinpoint exactly where your code spends the most resources

The Flow Emulator provides two complementary tools for this purpose:

| Feature | Output | Best For |
|---------|--------|----------|
| **Computation Reporting** | JSON report with detailed intensities | Quick numerical analysis, CI/CD integration, automated testing |
| **Computation Profiling** | pprof-compatible flame graphs | Visual analysis, deep-dive debugging, call stack exploration |

## Prerequisites

1. **Flow CLI** installed ([installation guide](../../tools/flow-cli/install.md))

2. **[pprof tool](https://github.com/google/pprof)** (for computation profiling):

   ```bash
   go install github.com/google/pprof@latest
   ```

## Computation Reporting

Computation reporting provides a JSON-based view of computational costs for all executed transactions and scripts.

### Enabling Computation Reporting

Start the emulator with the `--computation-reporting` flag:

```bash
flow emulator --computation-reporting
```

:::info

For more accurate computation numbers that reflect real network conditions, consider using [emulator fork testing](../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md). Forking allows you to profile against actual Mainnet or Testnet state without requiring a full emulator environment setup.

:::

### Viewing Computation Reports

Once enabled, access the computation report at:

```
http://localhost:8080/emulator/computationReport
```

The report returns a JSON object with the following structure:

```json
{
  "scripts": {
    "<script-id>": {
      "path": "scripts/myScript.cdc",
      "computation": 1250,
      "intensities": {
        "Statement": 45,
        "FunctionInvocation": 12,
        "GetValue": 8
      },
      "memory": 2048,
      "source": "access(all) fun main(): Int { ... }",
      "arguments": ["0x1"]
    }
  },
  "transactions": {
    "<transaction-id>": {
      "path": "transactions/myTransaction.cdc",
      "computation": 3500,
      "intensities": {
        "Statement": 120,
        "EmitEvent": 5,
        "SetValue": 15
      },
      "memory": 8192,
      "source": "transaction { ... }",
      "arguments": ["100.0"]
    }
  }
}
```

#### Report Fields

| Field | Description |
|-------|-------------|
| `path` | Source file path (set via `#sourceFile` pragma) |
| `computation` | Total computation units used |
| `intensities` | Count of each operation type performed |
| `memory` | Estimated memory usage |
| `source` | Original Cadence source code |
| `arguments` | Arguments passed to the transaction/script |

### Understanding Computation Intensities

The `intensities` map shows how many times each operation type was performed. The keys are human-readable names like `Statement`, `Loop`, `FunctionInvocation`, `GetValue`, `SetValue`, `EmitEvent`, etc.

The total `computation` value is calculated by multiplying each intensity by its corresponding weight (defined by the network) and summing the results. When optimizing, look for operations with high counts - reducing these will lower your total computation cost.

## Computation Profiling (pprof)

Computation profiling generates pprof-compatible profiles that can be visualized as flame graphs, providing a powerful way to understand your code's execution patterns.

### Enabling Computation Profiling

Start the emulator with the `--computation-profiling` flag:

```bash
flow emulator --computation-profiling
```

> **Note**: You can enable both `--computation-reporting` and `--computation-profiling` simultaneously if you need both types of analysis.

### Downloading the Profile

After executing transactions and scripts, download the profile from:

```
http://localhost:8080/emulator/computationProfile
```

This downloads a `profile.pprof` file containing the aggregated computation profile.

Using curl:

```bash
curl -o profile.pprof http://localhost:8080/emulator/computationProfile
```

### Viewing Profiles with pprof

Open the profile in an interactive web interface:

```bash
pprof -http=:8081 profile.pprof
```

Then navigate to `http://localhost:8081` in your browser.

#### Available Views

The pprof web interface provides several visualization options:

| View | Description |
|------|-------------|
| **Flame Graph** | Visual representation of call stacks with computation costs |
| **Graph** | Directed graph showing call relationships |
| **Top** | List of functions sorted by computation usage |
| **Source** | Source code annotated with computation costs |
| **Peek** | Callers and callees of selected functions |

### Viewing Source Code in pprof

To see Cadence source code annotated with computation costs:

1. **Download all deployed contracts**:

   ```bash
   curl -o contracts.zip http://localhost:8080/emulator/allContracts
   ```

2. **Extract the ZIP file into a `contracts` folder**:

   ```bash
   mkdir -p contracts
   unzip contracts.zip -d contracts
   ```

3. **Run pprof with the source path**:

   ```bash
   pprof -source_path=contracts -http=:8081 profile.pprof
   ```

Now when you view the "Source" tab in pprof, you'll see your Cadence code with line-by-line computation annotations.

### Resetting Computation Profiles

To clear the accumulated profile data (useful between test runs):

```bash
curl -X PUT http://localhost:8080/emulator/computationProfile/reset
```

## Using Source File Pragmas

The `#sourceFile` pragma improves report readability by associating your code with meaningful file paths. Without it, reports show generic identifiers.

### Usage

Add the pragma at the beginning of your transaction or script:

```cadence
#sourceFile("transactions/transfer_tokens.cdc")

transaction(amount: UFix64, recipient: Address) {
    prepare(signer: auth(Storage) &Account) {
        // Transfer logic
    }
}
```

For scripts:

```cadence
#sourceFile("scripts/get_balance.cdc")

access(all) fun main(address: Address): UFix64 {
    return getAccount(address).balance
}
```

### Benefits

- Reports show file paths instead of generic IDs
- Easier to correlate computation costs with source files
- Better integration with pprof source views
- Useful for tracking costs across multiple files in a project

## Practical Examples

### Profiling a Simple Transaction

Let's profile a simple NFT minting transaction.

**1. Start the emulator with profiling enabled:**

```bash
flow emulator --computation-profiling --computation-reporting
```

**2. Create a transaction file (`transactions/mint_nft.cdc`):**

```cadence
#sourceFile("transactions/mint_nft.cdc")

import NonFungibleToken from 0xf8d6e0586b0a20c7
import ExampleNFT from 0xf8d6e0586b0a20c7

transaction {
    prepare(signer: auth(Storage) &Account) {
        let collection = signer.storage.borrow<&ExampleNFT.Collection>(
            from: ExampleNFT.CollectionStoragePath
        ) ?? panic("Could not borrow collection")
        
        collection.deposit(token: <- ExampleNFT.mintNFT())
    }
}
```

**3. Execute the transaction:**

```bash
flow transactions send transactions/mint_nft.cdc
```

**4. View the computation report:**

```bash
curl http://localhost:8080/emulator/computationReport | jq
```

**5. Analyze with pprof:**

```bash
curl -o profile.pprof http://localhost:8080/emulator/computationProfile
pprof -http=:8081 profile.pprof
```

### Identifying Performance Bottlenecks

Consider a script that iterates over a large collection:

```cadence
#sourceFile("scripts/find_expensive.cdc")

access(all) fun main(address: Address): [UInt64] {
    let account = getAccount(address)
    let collection = account.capabilities.borrow<&{NonFungibleToken.Collection}>(
        /public/NFTCollection
    ) ?? panic("Could not borrow collection")
    
    let ids = collection.getIDs()
    var result: [UInt64] = []
    
    // Potentially expensive loop
    for id in ids {
        let nft = collection.borrowNFT(id)
        if nft != nil {
            result.append(id)
        }
    }
    
    return result
}
```

After profiling, you might see high values for:
- `Loop`: Many iterations
- `FunctionInvocation`: Repeated `borrowNFT` calls
- `GetValue`: Multiple storage reads

**Optimization strategies:**
- Use pagination to limit iterations per call
- Cache results when possible
- Consider restructuring data for more efficient access

### Comparing Computation Costs

You can compare two implementation approaches by:

**1. Reset the report between tests:**

```bash
curl -X PUT http://localhost:8080/emulator/computationProfile/reset
```

**2. Run implementation A and record the computation:**

```bash
flow transactions send approach_a.cdc
curl http://localhost:8080/emulator/computationReport > report_a.json
```

**3. Reset and test implementation B:**

```bash
curl -X PUT http://localhost:8080/emulator/computationProfile/reset
flow transactions send approach_b.cdc
curl http://localhost:8080/emulator/computationReport > report_b.json
```

**4. Compare the `computation` values in both reports.**

## Best Practices

1. **Profile early and often**: Don't wait until production to understand your computation costs.

2. **Use the right tool for the job**:
   - **Computation Reporting**: Quick checks, automated tests, CI/CD pipelines
   - **Computation Profiling**: Deep analysis, visual exploration, optimization work

3. **Reset between isolated tests**: Always reset profiles when comparing different implementations or testing in isolation.

4. **Use `#sourceFile` consistently**: Add pragmas to all your transactions and scripts for better debugging and reporting.

5. **Consider compute limits**: Be aware of the emulator's compute limits:
   - `--transaction-max-compute-limit` (default: 9999)
   - `--script-compute-limit` (default: 100000)

6. **Profile realistic scenarios**: Test with realistic data volumes and usage patterns.

7. **Monitor expensive operations**: Pay attention to high-cost operations like:
   - Large loops
   - Frequent storage reads/writes (`GetValue`, `SetValue`)
   - Cryptographic operations (`Hash`, `VerifySignature`)
   - Event emissions (`EmitEvent`)

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/emulator/computationReport` | GET | View computation report (JSON) |
| `/emulator/computationProfile` | GET | Download pprof profile |
| `/emulator/computationProfile/reset` | PUT | Reset computation profile |
| `/emulator/allContracts` | GET | Download all deployed contracts (ZIP) |

### Example API Calls

```bash
# Get computation report
curl http://localhost:8080/emulator/computationReport

# Download pprof profile
curl -o profile.pprof http://localhost:8080/emulator/computationProfile

# Reset computation profile
curl -X PUT http://localhost:8080/emulator/computationProfile/reset

# Download all contracts
curl -o contracts.zip http://localhost:8080/emulator/allContracts
```

## Troubleshooting

### Profile endpoint returns 404

**Problem**: Accessing `/emulator/computationProfile` returns a 404 error.

**Solution**: Make sure you started the emulator with `--computation-profiling`:

```bash
flow emulator --computation-profiling
```

### Empty profile

**Problem**: The downloaded profile is empty or has no useful data.

**Solution**: Make sure you've executed at least one transaction or script after starting the emulator. The profile only contains data for executed code.

### Source code not showing in pprof

**Problem**: The pprof source view doesn't display your Cadence code.

**Solution**:
1. Download the contracts ZIP: `curl -o contracts.zip http://localhost:8080/emulator/allContracts`
2. Extract to a `contracts` folder in your working directory
3. Run pprof with the source path: `pprof -source_path=contracts -http=:8081 profile.pprof`

### High memory usage

**Problem**: The emulator uses increasing memory over time.

**Solution**: Periodically reset computation profiles to free accumulated data:

```bash
curl -X PUT http://localhost:8080/emulator/computationProfile/reset
```

### Reports not showing file paths

**Problem**: The `path` field in reports is empty.

**Solution**: Add the `#sourceFile` pragma to your transactions and scripts:

```cadence
#sourceFile("path/to/your/file.cdc")
```

## Related Features

### Code Coverage Reporting

The emulator also supports Cadence code coverage reporting, which complements computation profiling:

```bash
flow emulator --coverage-reporting
```

View coverage at: `http://localhost:8080/emulator/codeCoverage`

Learn more in the [README](../README.md#cadence-code-coverage).

### Debugger

For step-through debugging of Cadence code, use the `#debug()` pragma:

```cadence
#debug()

transaction {
    prepare(signer: &Account) {
        // Execution pauses here for debugging
    }
}
```

This works with VSCode and Flow CLI debugging tools.
