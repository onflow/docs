---
sidebar_position: 1
title: Secure Randomness with Commit-Reveal in Cadence
description: Guide on implementing secure randomness in Cadence using a commit-reveal scheme on Flow
keywords:
  - blockchain
  - randomness
  - Cadence
  - Flow blockchain
  - commit-reveal
  - secure randomness
  - Random Beacon
  - smart contracts
  - Coin Toss
  - decentralization
  - fairness
  - cryptography
---

# Secure Randomness with Commit-Reveal in Cadence

Randomness is a critical component in blockchain applications, enabling fair and unpredictable outcomes for use cases like gaming, lotteries, and cryptographic protocols. The most basic approach to generating a random number on EVM chains is to utilize block hashes, which combines the block hash with a user-provided seed and hashes them together. The resulting hash can be used as a pseudo-random generator seed. However, this approach has limitations. The block hash can be manipulated by a validator influencing the random source used to compute transactions. The block proposer has the freedom to decide what to include into a block and can through different combinations till they find a favorable random source.

[Chainlink VRF][chainlink-vrf] is a popular tool that improves on this by providing another approach for generating provably random values on Ethereum and other blockchains by relying on a decentralized oracle network to deliver cryptographically secure randomness from off-chain sources. However, this dependence on external oracles introduces several weaknesses, such as cost, latency, and scalability concerns.

In contrast, Flow offers a simpler and more integrated approach with its native on-chain Randomness Beacon at the protocol level, eliminating reliance on external oracles and sidestepping their associated risks.

In addition to instant randomness that is available to any transaction (via `revertibleRandom` function), Flow provides a solution to reverted transaction. Commit-Reveal schemes on Flow also rely on protocol-native secure randomness and they fix the issue of post-selection by trustless users. Commit-Reveal tools on Flow can be used within both Cadence and Solidity smart contracts. This tutorial will focus on the Cadence case.

## Objectives

By the end of this guide, you will be able to:

- Deploy a Cadence smart contract on the Flow blockchain
- Implement commit-reveal pattern for randomness to ensure fairness
- Interact with on-chain randomness features on Flow
- Build and test the Coin Toss game using the Flow Testnet

## Prerequisites

You'll need the following:

- Flow Testnet Account: An account on the Flow Testnet with test FLOW tokens for deploying contracts and executing transactions (e.g., via [Flow Faucet][flow-faucet]).
- Flow CLI or Playground: The Flow CLI or Flow Playground for deploying and testing contracts (install via [Flow Docs][flow-docs]).

## Overview

In this guide, we will explore how to use a commit-reveal scheme based on the Flow Random Beacon to achieve secure, non-revertible randomness. This mechanism mitigates post-selection attacks, where participants attempt to reject unfavorable random outcomes after they are revealed.

To illustrate this concept, we will build a Coin Toss game on Flow, demonstrating how smart contracts can leverage a commit-reveal scheme for fair, tamper-resistant results.

![Commit Reveal](commit-reveal.png)

### What is the Coin Toss Game?

The Coin Toss Game is a decentralized betting game that showcases the commit-reveal pattern. Players place bets without knowing the random outcome, ensuring fairness and resistance to manipulation.

The game consists of two distinct phases:

1. Commit Phase - The player places a bet by sending Flow tokens to the contract. The contract records the commitment to use a future random value from the Flow Random Beacon. The player receives a Receipt, which they will use to reveal the result later.
2. Reveal Phase - Once the random value becomes available in the `RandomBeaconHistory` contract, the player submits their Receipt to determine the outcome:
   - If the result is 0, the player wins and receives double their bet.
   - If the result is 1, the player loses, and their bet remains in the contract.

### Why Use a Commit-Reveal scheme?

Similarly to revertible randomness, Commit-Reveal inherits the security of Flow native randomness beacon:

- Ensures security - The Flow Random Beacon provides cryptographically unpredictable and non-biased randomness.
- Ensure fairness - The Flow Random Beacon uses a Verifiable Random Function (VRF) under the hood which allows any external client or user to verify that randoms were generated fairly.
- Reduces reliance on external oracles - The randomness is generated natively on-chain, avoiding additional complexity, third party risk and cost.

In addition, commit-reveal patterns solve the issue of revertible randoms:

- Prevents user manipulation - Players cannot selectively reveal results after seeing the random results.

## Building the Coin Toss Contract

In this section, we'll walk through constructing the `CoinToss.cdc` contract, which contains the core logic for the Coin Toss game. To function properly, the contract relies on supporting contracts and a proper deployment setup.

This tutorial will focus specifically on writing and understanding the `CoinToss.cdc` contract, while additional setup details can be found in the [original GitHub repo][github-repo].

### Step 1: Defining the `CoinToss.cdc` Contract

Let's define our `CoinToss.cdc` and bring the other supporting contracts.

```cadence
import "Burner"
import "FungibleToken"
import "FlowToken"

import "RandomConsumer"

access(all) contract CoinToss {
    /// The multiplier used to calculate the winnings of a successful coin toss
    access(all) let multiplier: UFix64
    /// The Vault used by the contract to store funds.
    access(self) let reserve: @FlowToken.Vault
    /// The RandomConsumer.Consumer resource used to request & fulfill randomness
    access(self) let consumer: @RandomConsumer.Consumer

    /* --- Events --- */
    access(all) event CoinFlipped(betAmount: UFix64, commitBlock: UInt64, receiptID: UInt64)
    access(all) event CoinRevealed(betAmount: UFix64, winningAmount: UFix64, commitBlock: UInt64, receiptID: UInt64)
}
```

### Step 2: Implementing the Commit Phase With `flipCoin`

Let's define the first step in our scheme; the commit phase. We do this through a `flipCoin` public function. In this method, the caller commits a bet. The contract takes note of a future block height and bet amount, returning a `Receipt` resource which is used by the former to reveal the coin toss result and determine their winnings.

```cadence
access(all) fun flipCoin(bet: @{FungibleToken.Vault}): @Receipt {
        let request <- self.consumer.requestRandomness()
        let receipt <- create Receipt(
                betAmount: bet.balance,
                request: <-request
            )
        self.reserve.deposit(from: <-bet)

        emit CoinFlipped(betAmount: receipt.betAmount, commitBlock: receipt.getRequestBlock()!, receiptID: receipt.uuid)

        return <- receipt
    }
```

### Step 3: Implementing the Reveal Phase With `revealCoin`

Now we implement the reveal phase with the `revealCoin` function. Here the caller provides the Receipt given to them at commitment. The contract then "flips a coin" with `_randomCoin()` providing the Receipt's contained Request. The reveal step is possible only when the protocol random source at the committed block height becomes available.
If result is 1, user loses, but if it's 0 the user doubles their bet. Note that the caller could condition the revealing transaction, but they've already provided their bet amount so there's no loss for the contract if they do.

```cadence
access(all) fun revealCoin(receipt: @Receipt): @{FungibleToken.Vault} {
        let betAmount = receipt.betAmount
        let commitBlock = receipt.getRequestBlock()!
        let receiptID = receipt.uuid

        let coin = self._randomCoin(request: <-receipt.popRequest())

        Burner.burn(<-receipt)

        // Deposit the reward into a reward vault if the coin toss was won
        let reward <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
        if coin == 0 {
            let winningsAmount = betAmount * self.multiplier
            let winnings <- self.reserve.withdraw(amount: winningsAmount)
            reward.deposit(
                from: <-winnings
            )
        }

        emit CoinRevealed(betAmount: betAmount, winningAmount: reward.balance, commitBlock: commitBlock, receiptID: receiptID)

        return <- reward
    }
```

The final version of `CoinToss.cdc` should look like [this contract code][coin-toss-contract-code].

## Testing CoinToss on Flow Testnet

To make things easy, we've already deployed the `CoinToss.cdx` contract for you at this address: [0xb6c99d7ff216a684][coin-toss-contract]. We'll walk through placing a bet and revealing the result using [run.dnz][run-dnz], a Flow-friendly tool similar to Ethereum's Remix.

### Placing a Bet with flipCoin

First, you'll submit a bet to the CoinToss contract by withdrawing Flow tokens and storing a receipt. Here's how to get started:

1. Open Your Dev Environment: Head to [run.dnz][run-dnz].
2. Enter the Transaction Code: Paste the following Cadence code into the editor:

```cadence
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import CoinToss from 0xb6c99d7ff216a684

/// Commits the defined amount of Flow as a bet to the CoinToss contract, saving the returned Receipt to storage
///
transaction(betAmount: UFix64) {

    prepare(signer: auth(BorrowValue, SaveValue) &Account) {
        // Withdraw my bet amount from my FlowToken vault
        let flowVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!
        let bet <- flowVault.withdraw(amount: betAmount)

        // Commit my bet and get a receipt
        let receipt <- CoinToss.flipCoin(bet: <-bet)

        // Check that I don't already have a receipt stored
        if signer.storage.type(at: CoinToss.ReceiptStoragePath) != nil {
            panic("Storage collision at path=".concat(CoinToss.ReceiptStoragePath.toString()).concat(" a Receipt is already stored!"))
        }

        // Save that receipt to my storage
        // Note: production systems would consider handling path collisions
        signer.storage.save(<-receipt, to: CoinToss.ReceiptStoragePath)
    }
}
```

3. Set Your Bet: A modal will pop up asking for the betAmount. Enter a value (e.g., 1.0 for 1 Flow token) and submit
4. Execute the Transaction: Click "Run," and a WalletConnect window will appear. Choose Blocto, sign in with your email, and hit "Approve" to send the transaction to Testnet.

![remix5-sc](./imgs/remix5.png)

5. Track it: You can take the transaction id to [FlowDiver][flow-diver][.io](https://testnet.flowdiver.io/tx/9c4f5436535d36a82d4ae35467b37fea8971fa0ab2409dd0d5f861f61e463d98) to have a full view of everything that's going on with this `FlipCoin` transaction.

### Revealing the Coin Toss Result

Let's reveal the outcome of your coin toss to see if you've won. This step uses the receipt from your bet, so ensure you're using the same account that placed the bet. Here's how to do it:

1. Return to your Dev Environment: Open [run.dnz][run-dnz] again.
2. Enter the Reveal Code: Paste the following Cadence transaction into the editor:

```cadence
import FlowToken from 0x7e60df042a9c0868
import CoinToss from 0xb6c99d7ff216a684

/// Retrieves the saved Receipt and redeems it to reveal the coin toss result, depositing winnings with any luck
///
transaction {

    prepare(signer: auth(BorrowValue, LoadValue) &Account) {
        // Load my receipt from storage
        let receipt <- signer.storage.load<@CoinToss.Receipt>(from: CoinToss.ReceiptStoragePath)
            ?? panic("No Receipt found in storage at path=".concat(CoinToss.ReceiptStoragePath.toString()))

        // Reveal by redeeming my receipt - fingers crossed!
        let winnings <- CoinToss.revealCoin(receipt: <-receipt)

        if winnings.balance > 0.0 {
            // Deposit winnings into my FlowToken Vault
            let flowVault = signer.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!
            flowVault.deposit(from: <-winnings)
        } else {
            destroy winnings
        }
    }
}
```

After running this transaction, we reveal the result of the coin flip and it's 1! Meaning we have won nothing this time, but keep trying!

You can find the full transaction used for this example, with its result and events, at [FlowDiver.io/tx/][flow-diver-tx].

## Conclusion

The commit-reveal scheme, implemented within the context of the Flow Randomness Beacon, provides a robust solution for generating secure and non-revertible randomness in decentralized applications. By leveraging this mechanism, developers can ensure that their applications are:

- Fair: Outcomes remain unbiased and unpredictable.
- Resistant to post-selection: Protects against trustless users who cannot reverse their commitments.

The CoinToss game serves as a practical example of these principles in action. By walking through its implementation, you've seen firsthand how straightforward yet effective this approach can be—balancing simplicity for developers with robust security for users. As blockchain technology advances, embracing such best practices is essential to creating a decentralized ecosystem that upholds fairness and integrity, empowering developers to innovate with confidence.

This tutorial has equipped you with hands-on experience and key skills:

- You deployed a Cadence smart contract on the Flow blockchain.
- You implemented commit-reveal to ensure fairness.
- You interacted with on-chain randomness features on Flow.
- You built and tested the Coin Toss game using the Flow Testnet.

By harnessing the built-in randomness capabilities on Flow, you can now focus on crafting engaging, user-centric experiences without grappling with the complexities or limitations of external systems. This knowledge empowers you to create secure, scalable, and fair decentralized applications.

[chainlink-vrf]: https://docs.chain.link/vrf
[flow-faucet]: https://faucet.flow.com/fund-account
[flow-docs]: https://developers.flow.com
[flow-diver]: https://testnet.flowdiver.io/
[github-repo]: https://github.com/onflow/random-coin-toss
[run-dnz]: https://run.dnz.dev/
[coin-toss-contract]: https://contractbrowser.com/A.b6c99d7ff216a684.CoinToss
[coin-toss-contract-code]: https://github.com/onflow/random-coin-toss/blob/main/contracts/CoinToss.cdc
[flow-diver-tx]: https://testnet.flowdiver.io/tx/a79fb2f947e7803eefe54e48398f6983db4e0d4d5e217d2ba94f8ebdec132957
