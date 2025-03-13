---
sidebar_position: 1
title: Secure Randomness with Commit-Reveal in Cadence
description: Guide on implementing secure randomness in Cadence using Flow’s commit-reveal scheme
---

# Secure Randomness with Commit-Reveal in Cadence

## Randomness Tradeoffs in Blockchain Applications

Randomness is a critical component in blockchain applications, enabling fair and unpredictable outcomes for use cases like gaming, lotteries, and cryptographic protocols. The most basic approach to generating a random number on EVM chains is to utilize block hashes, which combines the block hash with a user-provided seed and hashes them together. The resulting hash can be used as a pseudo-random number. However, this approach has limitations:

1. **Predictability**: Miners can potentially manipulate the block hash to influence the generated random number.
2. **Replay attacks**: In case of block reorganizations, the revealed answers will not be re-used again.

[Chainlink VRF](https://docs.chain.link/vrf) is a popular tool that improves on this by providing another approach for generating provably random values on Ethereum and other blockchains by relying on a decentralized oracle network to deliver cryptographically secure randomness from off-chain sources. However, this dependence on external oracles introduces several weaknesses, such as cost, latency, and scalability concerns.

In contrast, Flow offers a simpler and more integrated approach with its **Random Beacon contract**, which provides native on-chain randomness at the protocol level, eliminating reliance on external oracles and sidestepping their associated risks. Via a commit-and-reveal scheme, Flow's protocol-native secure randomness can be used within both Cadence and Solidity smart contracts. 


## Objectives

In this guide, we will explore how to use a **commit-reveal scheme** in conjunction with Flow’s **Random Beacon** to achieve secure, non-revertible randomness. This mechanism mitigates **post-selection attacks**, where participants attempt to manipulate or reject unfavorable random outcomes after they are revealed.

To illustrate this concept, we will build a **Coin Toss game** on Flow, demonstrating how smart contracts can leverage **commit-reveal randomness** for fair, tamper-resistant results.

### **What is the Coin Toss Game?**
The **Coin Toss Game** is a decentralized betting game that showcases Flow’s **commit-reveal randomness**. Players place bets without knowing the random outcome, ensuring fairness and resistance to manipulation.

The game consists of two distinct phases:

1. **Commit Phase** – The player places a bet by sending Flow tokens to the contract. The contract records the commitment and requests a **random value** from Flow’s **Random Beacon**. The player receives a **Receipt**, which they will use to reveal the result later.
   
2. **Reveal Phase** – Once the **random value** becomes available in `RandomBeaconHistory`, the player submits their **Receipt** to determine the outcome:
   - If the result is **0**, the player **wins** and receives **double their bet**.
   - If the result is **1**, the player **loses**, and their bet remains in the contract.

### **Why Use Commit-Reveal Randomness?**
- **Prevents manipulation** – Players cannot selectively reveal results after seeing the randomness.
- **Ensures fairness** – Flow’s **Random Beacon** provides cryptographically secure, verifiable randomness.
- **Reduces reliance on external oracles** – The randomness is generated **natively on-chain**, avoiding additional complexity, third party risk and cost.

### **What You Will Learn**
By the end of this guide, you will be able to:

✅ **Deploy a Cadence smart contract** on the Flow blockchain  
✅ **Implement commit-reveal randomness** to ensure fairness  
✅ **Interact with Flow’s on-chain randomness features**  
✅ **Build and test the Coin Toss game** using Flow’s Testnet  

## Prerequisites

You’ll need the following:

- **Flow Testnet Account**: An account on the Flow Testnet with test FLOW tokens for deploying contracts and executing transactions (e.g., via [Flow Faucet](https://testnet-faucet.onflow.org/)).
- **Flow CLI or Playground**: The Flow CLI or Flow Playground for deploying and testing contracts (install via [Flow Docs](https://docs.onflow.org/flow-cli/install/)).


## Building the Coin Toss Contract  

In this section, we’ll walk through constructing the `CoinToss.cdc` contract, which contains the core logic for the Coin Toss game. To function properly, the contract relies on **supporting contracts and a proper deployment setup**.  

This tutorial will focus specifically on writing and understanding the `CoinToss.cdc` contract, while additional setup details can be found in the [original GitHub repo](https://github.com/onflow/random-coin-toss).  


### Step 1. Defining the `CoinToss.cdc` Contract

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

### 2. Implementing the Commit Phase With `flipCoin` 

Let's define the first step in our scheme; the commit phase. We do this through a `flipCoin` public function. In this method, the caller commits a bet. The contract takes note of the block height and bet amount, returning a `Receipt` resource which is used by the former to reveal the coin toss result and determine their winnings.

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

### Step 3. Implementing the Reveal Phase With `revealCoin` 

Now we implement the reveal phase with the `revealCoin` function. Here the caller provides the Receipt given to them at commitment. The contract then "flips a coin" with `_randomCoin()` providing the Receipt's contained Request. If result is **1**, user loses, but if it's **0** the user doubles their bet. Note that the caller could condition the revealing transaction, but they've already provided their bet amount so there's **no loss** for the contract if they do.

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

The final version of `CoinToss.cdc` should look like this: [https://github.com/onflow/random-coin-toss/blob/main/contracts/CoinToss.cdc](https://github.com/onflow/random-coin-toss/blob/main/contracts/CoinToss.cdc).


<!-- 1. **[Xorshift128plus](https://github.com/onflow/random-coin-toss/blob/main/contracts/Xorshift128plus.cdc)**: A base contract that implements the Xorshift128+ pseudo-random number generator (PRG) algorithm.
2. **[RandomBeaconHistory](https://contractbrowser.com/A.e467b9dd11fa00df.RandomBeaconHistory)**: A base contract that stores the history of random sources generated by the Flow network. The defined `Heartbeat` resource is updated by the Flow Service Account at the end of every block with that block's source of randomness.
3. **[CadenceRandomConsumer](https://github.com/onflow/random-coin-toss/blob/main/contracts/RandomConsumer.cdc)**: A base contract for secure consumption of Flow's protocol-native randomness via the `RandomBeaconHistory` contract. Implementing contracts benefit from the commit-reveal scheme, ensuring that callers cannot revert on undesirable random results. -->

## Testing CoinToss on Flow Testnet

To make things easy, we’ve already deployed the `CoinToss.cdx` contract for you at this address: [0xb6c99d7ff216a684](https://contractbrowser.com/A.b6c99d7ff216a684.CoinToss). We’ll walk through placing a bet and revealing the result using [run.dnz](https://run.dnz.dev/), a Flow-friendly tool similar to Ethereum’s Remix.

### Placing a Bet with flipCoin

First, you’ll submit a bet to the CoinToss contract by withdrawing Flow tokens and storing a receipt. Here’s how to get started:

1. **Open Your Dev Environment:** Head to [run.dnz](https://run.dnz.dev/).
2. **Enter the Transaction Code:** Paste the following Cadence code into the editor:

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
3. **Set Your Bet:** A modal will pop up asking for the betAmount. Enter a value (e.g., 1.0 for 1 Flow token) and submit
4. **Execute the Transaction:** Click "Run," and a WalletConnect window will appear. Choose Blocto, sign in with your email, and hit "Approve" to send the transaction to Testnet.

![remix5-sc](./imgs/remix5.png)

5. **Track it:** You can take the transaction id to [FlowDiver](https://testnet.flowdiver.io/)[.io](https://testnet.flowdiver.io/tx/9c4f5436535d36a82d4ae35467b37fea8971fa0ab2409dd0d5f861f61e463d98) to have a full view of everything that's going on with this `FlipCoin` transaction. 



### Revealing the Coin Toss Result

Let's reveal the outcome of your coin toss to see if you’ve won. This step uses the receipt from your bet, so ensure you’re using the same account that placed the bet. Here’s how to do it:

1. **Return to your Dev Environment:** Open  [run.dnz](https://run.dnz.dev/) again.
2. **Enter the Reveal Code:** Paste the following Cadence transaction into the editor:

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

You can find the full transaction used for this example, with its result and events, at [FlowDiver.io/tx/](https://testnet.flowdiver.io/tx/a79fb2f947e7803eefe54e48398f6983db4e0d4d5e217d2ba94f8ebdec132957).


## Conclusion

The **commit-reveal scheme**, implemented within the context of Flow's *Random Beacon*, provides a **robust solution** for generating secure and non-revertible randomness in decentralized applications. By leveraging this mechanism, developers can ensure that their applications are:

- **Fair**: Outcomes remain unbiased and unpredictable.
- **Resistant to manipulation**: Protects against post-selection attacks.
- **Immune to replay attacks**: A common pitfall in traditional random number generation on other blockchains.

The example of the *CoinToss game* illustrates the practical implementation of these concepts, demonstrating how **simple yet effective** this approach can be. As blockchain technology continues to evolve, adopting such *best practices* is **crucial** for fostering a secure and trustworthy ecosystem. This encourages developers to innovate while adhering to the core principles of **decentralization** and **fairness**.

By utilizing Flow’s *native capabilities*, developers can focus more on creating **engaging user experiences** without the complexities and limitations often tied to *external oracles*.
