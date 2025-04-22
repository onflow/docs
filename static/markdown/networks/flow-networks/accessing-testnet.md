---
title: Flow Testnet
sidebar_label: Testnet
sidebar_position: 3
description: Guide to Testnet access
---

## About Flow Testnet

Flow Testnet is Flow's official testing and development network. It is intended to provide a staging and testing environment for dApp developers.
It aims to balance similarity with Mainnet with being a productive development environment, resulting in the following key differences:

- Testnet has significantly fewer validator nodes, resulting in a faster block rate compared to Mainnet
- Testnet is configured with shorter epochs (about 12 hours, compared to 7 days on Mainnet)
- Testnet receives software upgrades up to 2 weeks before Mainnet

## Accessing Flow Testnet

Flow Testnet is available for access at this URL:

```
access.devnet.nodes.onflow.org:9000
```

For example, to access the network using the [Flow Go SDK](https://github.com/onflow/flow-go-sdk):

```go
import "github.com/onflow/flow-go-sdk/client"

func main() {
  flowAccessAddress := "access.devnet.nodes.onflow.org:9000"
  flowClient, _ := client.New(flowAccessAddress, grpc.WithInsecure())
  // ...
}
```

### Generating Testnet Key Pair

You can generate a new key pair with the [Flow CLI](https://github.com/onflow/flow-cli) as follows:

```sh
> flow keys generate

🙏 If you want to create an account on Testnet with the generated keys use this link:
https://testnet-faucet.onflow.org/?key= cc1c3d72...

🔴️ Store private key safely and don't share with anyone!
Private Key      246256f3...
Public Key       cc1c3d72...
```

**Note: By default, this command generates an ECDSA key pair on the P-256 curve. Keep in mind, the CLI is intended for development purposes only and is not recommended for production use. Handling keys using a Key Management Service is the best practice.**

## Account Creation and Token Funding Requests

Accounts and tokens for testing can be obtained through the [testnet faucet](https://testnet-faucet.onflow.org/). If you generated the keypair through the CLI, you can click on the URL provided to create an account and request testnet FLOW tokens.

## Important Smart Contract Addresses

You can review [all available core contracts](../../build/core-contracts/index.md) deployed to the Testnet to identify which ones you want to import.