---
title: Scaling Transactions from a Single Account
description: Learn how to scale transactions from a single account on Flow using multiple proposer keys, enabling concurrent transaction processing for system-level operations.
keywords:
  - scaling
  - transactions
  - proposer keys
  - sequence numbers
  - concurrent transactions
  - system transactions
  - transaction scaling
  - Flow blockchain
  - account scaling
  - transaction workers
  - batch operations
sidebar_label: Scaling Transactions from a Single Account
---

# Scaling Transactions from a Single Account

Flow is designed for consumer-scale internet applications and is one of the fastest blockchains globally. Transaction traffic on deployed contracts can be divided into two main categories:

1. **User Transactions**

    These are transactions initiated by users, such as:

    * Buying or selling NFTs
    * Transferring tokens
    * Swapping tokens on decentralized exchanges (DEXs)
    * Staking or unstaking tokens

    In this category, each transaction originates from a unique account and is sent to the Flow network from a different machine. Developers don't need to take special measures to scale for this category, beyond ensuring their logic is primarily on-chain and their supporting systems (e.g., frontend, backend) can handle scaling if they become bottlenecks. Flow's protocol inherently manages scaling for user transactions.

2. **System Transactions**

    These are transactions initiated by an app's backend or various tools, such as:

    * Minting thousands of tokens from a single minter account
    * Creating transaction workers for custodians
    * Running maintenance jobs and batch operations

    In this category, many transactions originate from the same account and are sent to the Flow network from the same machine, which can make scaling tricky. This guide focuses on strategies for scaling transactions from a single account.

In the following sections, we'll explore how to execute concurrent transactions from a single account on Flow using multiple proposer keys.

:::info

This guide is specific to non-EVM transactions. For EVM-compatible transactions, you can use any EVM-compatible scaling strategy.

:::

## Problem

Blockchains use sequence numbers, also known as nonces, for each transaction to prevent [replay attacks](https://en.wikipedia.org/wiki/Replay_attack) and allow users to specify the order of their transactions. The Flow network requires a specific sequence number for each incoming transaction and will reject any transaction where the sequence number does not exactly match the expected next value.

This behavior presents a challenge for scaling, as sending multiple transactions does not guarantee that they will be executed in the order they were sent. This is a fundamental aspect of Flow's resistance to MEV (Maximal Extractable Value), as transaction ordering is randomized within each block.

If a transaction arrives out of order, the network will reject it and return an error message similar to the following:
```
* checking sequence number failed: [Error Code: 1007] invalid proposal key: public key X on account 123 has sequence number 7, but given 6
```
Our objective is to execute multiple concurrent transactions without encountering the sequence number error described above. While designing a solution, we must consider the following key factors:

- **Reliability**

    Ideally, we want to avoid local sequence number management, as it is error-prone. In a local sequence number implementation, the sender must determine which error types increment the sequence number and which do not. For instance, network issues do not increment the sequence number, but application errors do. Furthermore, if the sender's sequence number becomes unsynchronized with the network, multiple transactions may fail.

    The most reliable approach to managing sequence numbers is to query the network for the latest sequence number before signing and sending each transaction.

- **Scalability**

    Allowing multiple workers to manage the same sequence number can introduce coupling and synchronization challenges. To address this, we aim to decouple workers so that they can operate independently without interfering with one another.

- **Capacity Management**

    To ensure reliability, the system must recognize when it has reached capacity. Additional transactions should be queued and executed once there is sufficient throughput. Fire-and-forget strategies are unreliable for handling arbitrary traffic, as they do not account for system capacity.

## Solution

Flow's transaction model introduces a unique role called the proposer. Each Flow transaction is signed by three roles: authorizer, proposer, and payer. The proposer key determines the sequence number for the transaction, effectively decoupling sequence number management from the authorizer and enabling independent scaling. You can learn more about this concept [here](https://developers.flow.com/build/basics/transactions#proposal-key).

We can leverage this model to design an ideal system transaction architecture as follows:

- **Multiple Proposer Keys**

    Flow accounts can have multiple keys. By assigning a unique proposer key to each worker, each worker can independently manage its own sequence number without interference from others.

- **Sequence Number Management**

    Each worker ensures it uses the correct sequence number by fetching the latest sequence number from the network. Since workers operate with different proposer keys, there are no conflicts or synchronization issues.

- **Queue and Processing Workflow**

    * Each worker picks a transaction request from the incoming requests queue, signs it with its assigned proposer key, and submits it to the network.
    * The worker remains occupied until the transaction is finalized by the network.
    * If all workers are busy, the incoming requests queue holds additional requests until there is enough capacity to process them.

- **Key Reuse for Optimization**

    To simplify the system further, we can reuse the same cryptographic key multiple times within the same account by adding it as a new key. These additional keys can have a weight of 0 since they do not need to authorize transactions.

Here's a visual example of how such an [account configuration](https://www.flowscan.io/account/18eb4ee6b3c026d2?tab=keys) might look:

![Example.Account](scaling-example-account.png "Example Account")

As shown, the account includes additional weightless keys designated for proposals, each with its own independent sequence number. This setup ensures that multiple workers can operate concurrently without conflicts or synchronization issues.

In the next section, we'll demonstrate how to implement this architecture using the [Go SDK](https://github.com/onflow/flow-go-sdk).

## Example Implementation

An example implementation of this architecture can be found in the [Go SDK Example](https://github.com/onflow/flow-go-sdk/blob/master/examples/transaction_scaling/main.go).

This example deploys a simple `Counter` contract:

```cadence
access(all) contract Counter {

    access(self) var count: Int

    init() {
        self.count = 0
    }

    access(all) fun increase() {
        self.count = self.count + 1
    }

    access(all) view fun getCount(): Int {
        return self.count
    }
}
```

The goal is to invoke the `increase()` function 420 times concurrently from a single account. By adding 420 concurrency keys and using 420 workers, all these transactions can be executed almost simultaneously.

### Prerequisites

We're using Testnet to demonstrate real network conditions. To run this example, you need to create a new testnet account. Start by generating a key pair:

```bash
flow keys generate
```

You can use the generated key with the [faucet](https://testnet-faucet.onflow.org/create-account) to create a testnet account. Update the corresponding variables in the `main.go` file:

```go
const PRIVATE_KEY = "123"
const ACCOUNT_ADDRESS = "0x123"
```

### Code Walkthrough

When the example starts, it will deploy the `Counter` contract to the account and add 420 proposer keys with the following transaction:

```cadence
transaction(code: String, numKeys: Int) {

    prepare(signer: auth(AddContract, AddKey) &Account) {
        // deploy the contract
        signer.contracts.add(name: "Counter", code: code.decodeHex())

        // copy the main key with 0 weight multiple times
        // to create the required number of keys
        let key = signer.keys.get(keyIndex: 0)!
        var count: Int = 0
        while count < numKeys {
            signer.keys.add(
                publicKey: key.publicKey,
                hashAlgorithm: key.hashAlgorithm,
                weight: 0.0
            )
            count = count + 1
        }
    }
}
```

Next, the main loop starts. Each worker will process a transaction request from the queue and execute it. Here's the code for the main loop:

```go
// populate the job channel with the number of transactions to execute
txChan := make(chan int, numTxs)
for i := 0; i < numTxs; i++ {
    txChan <- i
}

startTime := time.Now()

var wg sync.WaitGroup
// start the workers
for i := 0; i < numProposalKeys; i++ {
    wg.Add(1)

    // worker code
    // this will run in parallel for each proposal key
    go func(keyIndex int) {
        defer wg.Done()

        // consume the job channel
        for range txChan {
            fmt.Printf("[Worker %d] executing transaction\n", keyIndex)

            // execute the transaction
            err := IncreaseCounter(ctx, flowClient, account, signer, keyIndex)
            if err != nil {
                fmt.Printf("[Worker %d] Error: %v\n", keyIndex, err)
                return
            }
        }
    }(i)
}

close(txChan)

// wait for all workers to finish
wg.Wait()
```

The `IncreaseCounter` function calls the `increase()` function on the `Counter` contract:

```go
// Increase the counter by 1 by running a transaction using the given proposal key
func IncreaseCounter(ctx context.Context, flowClient *grpc.Client, account *flow.Account, signer crypto.Signer, proposalKeyIndex int) error {
	script := []byte(fmt.Sprintf(`
		import Counter from 0x%s

		transaction() {
			prepare(signer: &Account) {
				Counter.increase()
			}
		}

	`, account.Address.String()))

	tx := flow.NewTransaction().
		SetScript(script).
		AddAuthorizer(account.Address)

	// get the latest account state including the sequence number
	account, err := flowClient.GetAccount(ctx, flow.HexToAddress(account.Address.String()))
	if err != nil {
		return err
	}
	tx.SetProposalKey(
		account.Address,
		account.Keys[proposalKeyIndex].Index,
		account.Keys[proposalKeyIndex].SequenceNumber,
	)

	return RunTransaction(ctx, flowClient, account, signer, tx)
}
```

The above code is executed concurrently by each worker. Since each worker operates with a unique proposer key, there are no conflicts or synchronization issues. Each worker independently manages its sequence number, ensuring smooth execution of all transactions.

Finally, the `RunTransaction` function serves as a helper utility to send transactions to the network and wait for them to be finalized. It is important to note that the proposer key sequence number is set within the `IncreaseCounter` function before calling `RunTransaction`.

```go
// Run a transaction and wait for it to be sealed. Note that this function does not set the proposal key.
func RunTransaction(ctx context.Context, flowClient *grpc.Client, account *flow.Account, signer crypto.Signer, tx *flow.Transaction) error {
	latestBlock, err := flowClient.GetLatestBlock(ctx, true)
	if err != nil {
		return err
	}
	tx.SetReferenceBlockID(latestBlock.ID)
	tx.SetPayer(account.Address)

	err = SignTransaction(ctx, flowClient, account, signer, tx)
	if err != nil {
		return err
	}

	err = flowClient.SendTransaction(ctx, *tx)
	if err != nil {
		return err
	}

	txRes := examples.WaitForSeal(ctx, flowClient, tx.ID())
	if txRes.Error != nil {
		return txRes.Error
	}

	return nil
}
```

### Running the Example

Running the example will execute 420 transactions at the same time:

```bash
→ cd ./examples
→ go run ./transaction_scaling/main.go
.
.
.
Final Counter: 420
✅ Done! 420 transactions executed in 11.695372059s
```

It takes roughly the time of 1 transaction to run all 420 without any errors.