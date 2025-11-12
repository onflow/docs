---
title: Using Foundry with Flow
description: 'Using Foundry to deploy a Solidity contract to Flow EVM.'
sidebar_label: Foundry
sidebar_position: 5
---

# Using Foundry with Flow

Foundry is a suite of development tools that simplifies the process to develop and deploy Solidity contracts to EVM networks. This guide will walk you through thow to deploy a Solidity contract to Flow EVM with the Foundry development toolchain. You can check out the official Foundry docs [here](https://book.getfoundry.sh/).

In this guide, we'll deploy an ERC-20 token contract to Flow EVM using Foundry. We'll cover:

- How to develop and test a basic ERC-20 contract
- Deploy the contract to Flow EVM with Foundry tools
- How to query the Testnet state
- How to mutate Testnet state by sending transactions

## Overview

To use Flow across all Foundry tools you need to:

1. Provide the Flow EVM RPC URL to the command you are using:

   ```shell
   --rpc-url https://testnet.evm.nodes.onflow.org
   ```

2. Use the `--legacy` flag to turn off [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) style transactions. Flow will support EIP-1559 soon and this flag won't be needed.

As an example, we'll show you how to deploy a fungible token contract to Flow EVM with Foundry. You will see how the above flags are used in practice.

## Example: Deploying an ERC-20 Token Contract to Flow EVM

ERC-20 tokens are the most common type of tokens on Ethereum. We'll use [OpenZeppelin](https://www.openzeppelin.com/) starter templates with Foundry on Flow Testnet to deploy our own token called `MyToken`.

### Installation

The best way to install Foundry, is to use the `foundryup` CLI tool. You can get it with the following command:

```shell
curl -L https://foundry.paradigm.xyz | bash
```

Install the tools:

```shell
foundryup
```

This will install the Foundry tool suite: `forge`, `cast`, `anvil`, and `chisel`.

You may need to reload your shell after `foundryup` installation.

Check out the official [Installation](https://book.getfoundry.sh/getting-started/installation) guide for more information about different platforms or installing specific versions.

### Wallet setup

We first need to generate a key pair for our EVM account. We can do this using the `cast` tool:

```shell
cast wallet new
```

`cast` will print the private key and address of the new account. We can then paste the account address into the [Faucet](https://faucet.flow.com/fund-account) to fund it with some Testnet FLOW tokens.

You can verify the balance of the account after funding. Replace `$YOUR_ADDRESS` with the address of the account you funded:

```shell
cast balance --ether --rpc-url https://testnet.evm.nodes.onflow.org $YOUR_ADDRESS
```

### Project setup

First, create a new directory for your project:

```shell
mkdir mytoken
cd mytoken
```

We can use `init` to initialize a new project:

```shell
forge init
```

This will create a contract called `Counter` in the `contracts` directory with associated tests and deployment scripts. We can replace this with our own ERC-20 contract. To verify the initial setup, you can run the tests for `Counter`:

```shell
forge test
```

The tests should pass.

### Write the ERC-20 token contract

We'll use the OpenZeppelin ERC-20 contract template. To start, we'll add OpenZeppelin to our project:

```shell
forge install OpenZeppelin/openzeppelin-contracts
```

Rename `src/Counter.sol` to `src/MyToken.sol` and replace the contents with the following:

```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialMint_) ERC20("MyToken", "MyT") {
        _mint(msg.sender, initialMint_);
    }
}
```

The above is a basic ERC-20 token with the name `MyToken` and symbol `MyT`. It also mints the specified amount of tokens to the contract deployer. The amount is passed as a constructor argument during deployment.

Before we comnpile, we also need to update the test file.

### Testing

Rename `test/Counter.t.sol` to `test/MyToken.t.sol` and replace the contents with the following:

```solidity
pragma solidity ^0.8.20;

import {Test, console2, stdError} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    uint256 initialSupply = 420000;

    MyToken public token;
    address ownerAddress = makeAddr("owner");
    address randomUserAddress = makeAddr("user");

    function setUp() public {
        vm.prank(ownerAddress);
        token = new MyToken(initialSupply);
    }

    /*
        Test general ERC-20 token properties
    */
    function test_tokenProps() public view {
        assertEq(token.name(), "MyToken");
        assertEq(token.symbol(), "MyT");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), initialSupply);
        assertEq(token.balanceOf(address(0)), 0);
        assertEq(token.balanceOf(ownerAddress), initialSupply);
    }

    /*
        Test Revert transfer to sender with insufficient balance
    */
    function test_transferRevertInsufficientBalance() public {
        vm.prank(randomUserAddress);
        vm.expectRevert(abi.encodeWithSignature("ERC20InsufficientBalance(address,uint256,uint256)", randomUserAddress, 0, 42));
        token.transfer(ownerAddress, 42);
    }

    /*
        Test transfer
    */
    function test_transfer() public {
        vm.prank(ownerAddress);
        assertEq(token.transfer(randomUserAddress, 42), true);
        assertEq(token.balanceOf(randomUserAddress), 42);
        assertEq(token.balanceOf(ownerAddress), initialSupply - 42);
    }

    /*
        Test transferFrom with approval
    */
    function test_transferFrom() public {
        vm.prank(ownerAddress);
        token.approve(randomUserAddress, 69);

        uint256 initialRandomUserBalance = token.balanceOf(randomUserAddress);
        uint256 initialOwnerBalance = token.balanceOf(ownerAddress);

        vm.prank(randomUserAddress);
        assertEq(token.transferFrom(ownerAddress, randomUserAddress, 42), true);
        assertEq(token.balanceOf(randomUserAddress), initialRandomUserBalance + 42);
        assertEq(token.balanceOf(ownerAddress), initialOwnerBalance - 42);
        assertEq(token.allowance(ownerAddress, randomUserAddress), 69 - 42);
    }
}
```

To make sure everything is okay, compile the contracts:

```shell
forge compile
```

Run the tests:

```shell
forge test
```

They should all succeed.

### Deploy to Flow Testnet

We can now deploy `MyToken` with the `forge create` command. We need to provide the RPC URL, private key from a funded account with the faucet, and constructor arguments that is the initial mint amount in this case. We need to use the `--legacy` flag to turn off EIP-1559 style transactions. Replace `$DEPLOYER_PRIVATE_KEY` with the private key of the account you created earlier:

```shell
forge create --broadcast src/MyToken.sol:MyToken \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --constructor-args 42000000 \
    --legacy
```

The above will print the deployed contract address. We'll use it in the next section to interact with the contract.

### Verify a smart contract

After you deploy the contract, you can verify it so that others can see the source code and interact with it from Flow's block explorer. You can use the [`forge verify-contract`](https://book.getfoundry.sh/reference/forge/forge-verify-contract) command:

```shell
forge verify-contract --rpc-url https://testnet.evm.nodes.onflow.org/ \
    --verifier blockscout \
    --verifier-url https://evm-testnet.flowscan.io/api \
    $DEPLOYED_MYTOKEN_ADDRESS \
    src/MyToken.sol:MyToken
```

:::info

When you verify a Mainnet contract, be sure to use the Mainnet [RPC](../../../build/evm/networks.md) and block explorer URLs.

:::

### Query Testnet state

Based on the given constructor arguments, the deployer should own `42,000,000 MyT`. We can check the `MyToken` balance of the contract owner. Replace `$DEPLOYED_MYTOKEN_ADDRESS` with the address of the deployed contract and `$DEPLOYER_ADDRESS` with the address of the account you funded earlier:

```shell
cast balance \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    --erc20 $DEPLOYED_MYTOKEN_ADDRESS \
    $DEPLOYER_ADDRESS
```

This will return the amount specified during deployment. We can also call the associated function directly in the contract:

```shell
cast call $DEPLOYED_MYTOKEN_ADDRESS \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    "balanceOf(address)(uint256)" \
    $DEPLOYER_ADDRESS
```

We can query other data like the token symbol:

```shell
cast call $DEPLOYED_MYTOKEN_ADDRESS \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    "symbol()(string)"
```

### Sending Transactions

Let's create a second account and move some tokens with a transaction. You can use `cast wallet new` to create a new test account. You don't need to fund it to receive tokens. Replace `$NEW_ADDRESS` with the address of the new account:

```shell
cast send $DEPLOYED_MYTOKEN_ADDRESS \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --legacy \
    "transfer(address,uint256)(bool)" \
    $NEW_ADDRESS 42
```

We can check the balance of the new account:

```shell
cast balance \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    --erc20 $DEPLOYED_MYTOKEN_ADDRESS \
    $NEW_ADDRESS
```

The deployer will also own fewer tokens now:

```shell
cast balance \
    --rpc-url https://testnet.evm.nodes.onflow.org \
    --erc20 $DEPLOYED_MYTOKEN_ADDRESS \
    $DEPLOYER_ADDRESS
```
