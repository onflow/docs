---
title: Flow Project Configuration
description: Learn how to work with Flow project state using the Flowkit Go library
sidebar_position: 3
keywords:
  - Flowkit
  - Go SDK
  - Flow
  - Project State
  - Tutorial
  - Configuration
  - flow.json
---

# Flowkit Go Tutorial: Working with Flow Project State

## Introduction

**Flowkit** is a Go package for interacting with the Flow blockchain in the context of `flow.json` configuration files. It provides APIs for managing Flow projects, including:

- Loading and managing project configuration (`flow.json`)
- Resolving import statements in Cadence contracts, scripts, and transactions
- Deploying contracts to different networks (emulator, testnet, mainnet)
- Managing accounts, networks, and deployments
- Executing scripts and building transactions with proper import resolution

Flowkit is the core package used by the Flow CLI and can be integrated into any Go application that needs to interact with Flow projects.

## Installation

### Prerequisites

- Go 1.25.0 or higher
- A Flow project with a `flow.json` configuration file

### Install the Package

Add Flowkit to your Go module:

```bash
go get github.com/onflow/flowkit/v2
```

This will install Flowkit v2 and all its dependencies.

### Import in Your Code

```go
import (
    "github.com/onflow/flowkit/v2"
    "github.com/onflow/flowkit/v2/config"
    "github.com/onflow/flowkit/v2/project"
    "github.com/spf13/afero"
)
```

## Loading Project State

The first step when working with Flowkit is loading your project's state from `flow.json`.

### Basic Usage

```go
package main

import (
    "log"
    "github.com/onflow/flowkit/v2"
    "github.com/spf13/afero"
)

func main() {
    // Load flow.json from the current directory
    state, err := flowkit.Load([]string{"flow.json"}, afero.Afero{Fs: afero.NewOsFs()})
    if err != nil {
        log.Fatalf("Failed to load project state: %v", err)
    }

    // Now you can work with the project state
    log.Println("Project state loaded successfully!")
}
```

### Creating a New Project State

If you need to create a new project from scratch:

```go
// Initialize an empty state
state, err := flowkit.Init(afero.Afero{Fs: afero.NewOsFs()})
if err != nil {
    log.Fatalf("Failed to initialize state: %v", err)
}
```

### Accessing State Components

The `State` object provides access to all project configuration:

```go
// Get all contracts
contracts := state.Contracts()

// Get all networks
networks := state.Networks()

// Get all accounts
accounts := state.Accounts()

// Get all deployments
deployments := state.Deployments()

// Get the underlying config
config := state.Config()
```

## Working with Contracts

Contracts are Cadence smart contracts defined in your project.

### Getting Contract Information

```go
// Get a contract by name
contract, err := state.Contracts().ByName("MyContract")
if err != nil {
    log.Fatalf("Contract not found: %v", err)
}

log.Printf("Contract: %s\n", contract.Name)
log.Printf("Location: %s\n", contract.Location)

// Get all contract names
names := state.Contracts().Names()
for _, name := range names {
    log.Printf("Available contract: %s\n", name)
}
```

### Getting Deployment Contracts for a Network

When deploying or executing code, you often need contracts with their target addresses:

```go
import "github.com/onflow/flowkit/v2/config"

// Get all contracts configured for deployment on testnet
contracts, err := state.DeploymentContractsByNetwork(config.TestnetNetwork)
if err != nil {
    log.Fatalf("Failed to get deployment contracts: %v", err)
}

// Each contract includes deployment information
for _, contract := range contracts {
    log.Printf("Contract: %s\n", contract.Name)
    log.Printf("  Location: %s\n", contract.Location())
    log.Printf("  Target Account: %s\n", contract.AccountAddress)
    log.Printf("  Account Name: %s\n", contract.AccountName)
    log.Printf("  Code Size: %d bytes\n", len(contract.Code()))
}
```

## Working with Networks

Flowkit supports multiple networks including emulator, testnet, and mainnet.

### Available Networks

```go
import "github.com/onflow/flowkit/v2/config"

// Predefined networks
emulator := config.EmulatorNetwork   // Local emulator
testnet := config.TestnetNetwork     // Flow testnet
mainnet := config.MainnetNetwork     // Flow mainnet

log.Printf("Emulator: %s\n", emulator.Host)
log.Printf("Testnet: %s\n", testnet.Host)
log.Printf("Mainnet: %s\n", mainnet.Host)
```

### Getting Networks from State

```go
// Get all networks defined in flow.json
networks := state.Networks()

// Get a specific network by name
testnet, err := networks.ByName("testnet")
if err != nil {
    log.Fatalf("Network not found: %v", err)
}

log.Printf("Network: %s\n", testnet.Name)
log.Printf("Host: %s\n", testnet.Host)
```

### Adding or Updating Networks

```go
// Add a custom network
networks := state.Networks()
networks.AddOrUpdate(config.Network{
    Name: "custom-network",
    Host: "localhost:3570",
})

// Save the updated configuration
err := state.SaveDefault()
if err != nil {
    log.Fatalf("Failed to save state: %v", err)
}
```

### Getting Network-Specific Aliases

Network aliases map contract names/locations to their deployed addresses on specific networks:

```go
// Get aliases for testnet
aliases := state.AliasesForNetwork(config.TestnetNetwork)

// aliases is a map[string]string of location/name -> address
for location, address := range aliases {
    log.Printf("%s deployed at %s on testnet\n", location, address)
}
```

## Resolving Imports with ImportReplacer

The `ImportReplacer` resolves import statements in Cadence contracts, scripts, and transactions by replacing relative file paths and contract names with their deployed blockchain addresses.

### Basic Usage

When you have a Cadence program with imports like `import "Kibble"`, you need to resolve these to blockchain addresses:

```go
import "github.com/onflow/flowkit/v2/project"

// Get contracts for your target network
contracts, err := state.DeploymentContractsByNetwork(config.TestnetNetwork)
if err != nil {
    log.Fatal(err)
}

// Create an import replacer with your project's contracts
importReplacer := project.NewImportReplacer(contracts, nil)

// Parse your Cadence program
code := []byte(`
import "Kibble"
import "FungibleToken"

transaction {
    prepare(signer: &Account) {
        // ...
    }
}
`)

program := project.NewProgram(code, []string{}, "")

// Replace imports with deployed addresses
resolvedProgram, err := importReplacer.Replace(program)
if err != nil {
    log.Fatalf("Failed to resolve imports: %v", err)
}

// The resolved program now has addresses instead of file paths
log.Printf("Resolved code:\n%s", string(resolvedProgram.Code()))
```

### Integration with Project State

The most common pattern is to use network-specific aliases from your project state:

```go
// Load project state and get network-specific contracts and aliases
state, err := flowkit.Load([]string{"flow.json"}, afero.Afero{Fs: afero.NewOsFs()})
if err != nil {
    log.Fatal(err)
}

// Choose your target network
network := config.TestnetNetwork

// Get contracts for this network
contracts, err := state.DeploymentContractsByNetwork(network)
if err != nil {
    log.Fatal(err)
}

// Use network-specific aliases for address mapping
importReplacer := project.NewImportReplacer(
    contracts,
    state.AliasesForNetwork(network),
)

// Parse and resolve your program
program := project.NewProgram(scriptCode, []string{}, "script.cdc")
resolvedProgram, err := importReplacer.Replace(program)
if err != nil {
    log.Fatalf("Failed to resolve imports: %v", err)
}

// Use the resolved program for execution
log.Printf("Ready to execute:\n%s", string(resolvedProgram.Code()))
```

## Working with Accounts

Accounts represent Flow blockchain accounts used for signing transactions and deploying contracts.

### Getting Account Information

```go
accounts := state.Accounts()

// Get account by name
account, err := accounts.ByName("emulator-account")
if err != nil {
    log.Fatalf("Account not found: %v", err)
}

log.Printf("Account: %s\n", account.Name)
log.Printf("Address: %s\n", account.Address)

// Get all account names
names := accounts.Names()
for _, name := range names {
    log.Printf("Available account: %s\n", name)
}

// Get account by address
addr := flow.HexToAddress("0xf8d6e0586b0a20c7")
account, err = accounts.ByAddress(addr)
```

### Getting the Emulator Service Account

```go
// Get the emulator's default service account
serviceAccount, err := state.EmulatorServiceAccount()
if err != nil {
    log.Fatalf("Failed to get service account: %v", err)
}

log.Printf("Service account address: %s\n", serviceAccount.Address)
```

## Working with Deployments

Deployments define which contracts should be deployed to which accounts on specific networks.

### Getting Deployment Information

```go
deployments := state.Deployments()

// Get all deployments for a network
testnetDeployments := deployments.ByNetwork("testnet")

for _, deployment := range testnetDeployments {
    log.Printf("Account: %s\n", deployment.Account)
    log.Printf("Network: %s\n", deployment.Network)
    log.Printf("Contracts:\n")

    for _, contract := range deployment.Contracts {
        log.Printf("  - %s\n", contract.Name)
    }
}

// Get deployment for specific account and network
deployment := deployments.ByAccountAndNetwork("my-account", "testnet")
if deployment != nil {
    log.Printf("Found deployment: %d contracts\n", len(deployment.Contracts))
}
```

## Complete Example

Here's a complete example that ties everything together:

```go
package main

import (
    "context"
    "log"

    "github.com/onflow/flowkit/v2"
    "github.com/onflow/flowkit/v2/config"
    "github.com/onflow/flowkit/v2/project"
    "github.com/spf13/afero"
)

func main() {
    // 1. Load project state
    state, err := flowkit.Load([]string{"flow.json"}, afero.Afero{Fs: afero.NewOsFs()})
    if err != nil {
        log.Fatalf("Failed to load state: %v", err)
    }

    // 2. Choose target network
    network := config.TestnetNetwork
    log.Printf("Using network: %s\n", network.Name)

    // 3. Get deployment contracts for the network
    contracts, err := state.DeploymentContractsByNetwork(network)
    if err != nil {
        log.Fatalf("Failed to get contracts: %v", err)
    }

    log.Printf("Found %d contracts for deployment\n", len(contracts))
    for _, contract := range contracts {
        log.Printf("  - %s -> %s\n", contract.Name, contract.AccountAddress)
    }

    // 4. Get network aliases
    aliases := state.AliasesForNetwork(network)
    log.Printf("Network has %d aliases\n", len(aliases))

    // 5. Create import replacer
    importReplacer := project.NewImportReplacer(contracts, aliases)

    // 6. Resolve imports in a script
    scriptCode := []byte(`
        import "Kibble"
        import "FungibleToken"

        access(all) fun main(): String {
            return "Hello, Flow!"
        }
    `)

    program := project.NewProgram(scriptCode, []string{}, "script.cdc")
    resolvedProgram, err := importReplacer.Replace(program)
    if err != nil {
        log.Fatalf("Failed to resolve imports: %v", err)
    }

    log.Printf("Resolved script:\n%s\n", string(resolvedProgram.Code()))

    // 7. Get account for signing
    account, err := state.Accounts().ByName("testnet-account")
    if err != nil {
        log.Fatalf("Failed to get account: %v", err)
    }

    log.Printf("Using account: %s (%s)\n", account.Name, account.Address)

    log.Println("Setup complete! Ready to interact with Flow.")
}
```

## Conclusion

Flowkit provides a powerful and flexible API for managing Flow projects in Go. By understanding how to work with project state, contracts, networks, and import resolution, you can build robust applications that interact with the Flow blockchain.

The import replacer is particularly critical for ensuring your Cadence code works correctly across different networks by automatically resolving contract imports to their deployed addresses.
