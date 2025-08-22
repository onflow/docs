---
title: How Flow EVM Works
sidebar_label: How it Works
sidebar_position: 3
---

# How Flow EVM Works

## Introduction

The Flow network uses [Cadence](https://cadence-lang.org/) as its main execution environment. Cadence offers a safe, efficient, and developer-friendly experience for building smart contracts and decentralized applications. Cadence can be used to extend EVM apps built in solidity by unlocking gasless experiences, new business models and fine-tuned access control. With Flow offering full EVM support, existing applications and tools already deployed in the EVM ecosystem can simply onboard to the network with [no code changes](https://developers.flow.com/evm/about).

Flow EVM is designed with these major goals in mind:

- Supporting EVM equivalency: Ensure that any tools and applications deployed to or run on Ethereum can also be deployed and run on Flow.
- Minimizing breaking changes to the Cadence ecosystem, software and tools
- Maximum composability across environments: Allowing atomic and smooth interaction between EVM and Cadence environments.

### EVM - A Smart Contract In Cadence

To satisfy the design goals and thanks to the extensibility properties of the Cadence runtime, Flow EVM is designed as a higher-level environment incorporated as a smart contract deployed to Cadence. This smart contract is not owned by anyone and has its own storage space, allows Cadence to query, and is updated through EVM transactions. EVM transactions can be wrapped inside Cadence transactions and passed to the EVM contract for execution. The artifacts of EVM transaction execution (e.g. receipts and logs) are emitted as special Cadence events (TransactionExecuted, BlockExecuted) and available to the upstream process (Flow transaction) to enable atomic operations.

The EVM environment has its own concept of blocks, and every Flow block includes at most one EVM Block. The EVM block is formed at the end of Flow Block execution and includes all the transaction executed during the EVM block execution. Note that since EVM blocks are formed onchain and Flow provides fast finality, as long as the user of these events waits for Flow block finality, it doesn’t have to worry about EVM block forks, uncle chains, and other consensus-related challenges.

### No Shared Memory Design

The interaction between two environments is through atomic calls and none of the environments has access to the raw memory of the other. This maintains the security properties of each environment. Cadence can submit transactions to the EVM environment and EVM transactions can make calls to a special precompiled contract called Cadence Arch. You can read more about this in the Precompiled section.

### No New Native Token

Flow EVM uses the same native token as Cadence (FLOW token). No new token is minted at the genesis block of EVM and all the tokens have to be bridged over from the Cadence side into the EVM side. To facilitate this a native bridge is provided by the EVM contract.

### EVM Equivalency

Under the hood, Flow EVM uses [the standard EVM implementation](https://github.com/ethereum/go-ethereum) and regularly applies updates through Flow’s height-coordinated updates (e.g. Execution layer changes planned for the Ethereum Prague update). This means anything that can run on Ethereum after the Pectra upgrade can run on Flow EVM. This means many useful EIPs such as [EIP-1014](https://eips.ethereum.org/EIPS/eip-1014), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559), [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), [EIP-5656](https://eips.ethereum.org/EIPS/eip-5656), [EIP-6780](https://eips.ethereum.org/EIPS/eip-6780), … are supported automatically.

Yet a small set of differences between Flow EVM and Ethereum might be seen (mostly of the nature of extension) for two reasons:

- A set of extensions has been added to ensure seamless and easy interaction between the two environments.
- Flow EVM is secured by the Flow network and benefits from its robust network properties, such as fast block production and finalization, making issues like handling uncle chains irrelevant.

## Gateways

As mentioned, Flow EVM runs on top of the Flow network and its consensus model. Flow EVM does not leverage `geth` or introduce new node types to the existing architecture. Operators wishing to participate in securing the network stake tokens and run one of the Flow node types.

To support `web3.js` clients, the [EVM Gateway](https://github.com/onflow/flow-evm-gateway) honors the Ethereum [JSON-RPC specification](https://ethereum.org/en/developers/docs/apis/json-rpc/). The gateway integrates with Flow access nodes and can be run by anyone (unstaked). It serves two purposes:

### Gateway As A Light Client

The gateway follows Flow's block production, collecting, verifying and indexing EVM-related events. The gateway provides the necessary endpoints and services all JSON-RPC requests for third-party dapps interacting with Flow EVM. EVM events include all information needed to reconstruct the EVM state since the genesis block (replayability). By re-executing transactions, the gateway can collect traces and maintain a local and archival copy of the EVM state over time.

### Gateway As a Sequencer

As mentioned, Flow EVM can be seen as a higher-level environment built on top of Cadence. Thus, all EVM transactions are ultimately handled using a Flow transaction (a wrapped call to the EVM). The gateway accepts EVM transactions, runs an internal mempool of transactions, wraps batches of EVM transactions in Flow transactions, and submits them.

Note that the safety of transaction execution is not dependent on the gateway; they only relay the transaction. The safety measures of the EVM environment (e.g., Nonce, etc.) ensure that each transaction is executed at most once. Since gateways are submitting Flow transactions, they have to pay the related transaction fees. Part of these fees is associated with the computation fees of the EVM transaction.

To facilitate the repayment of fees, the `evm.run` function accepts a `coinbase` address, which collects gas fees from the transaction, and pays it to the address provided by the gateway node. Essentially, the transaction wrapper behaves similarly to a miner, receives the gas usage fees on an EVM address, and pays for the transaction fees. The gas price per unit of gas creates a marketplace for these 3rd parties to compete over transactions.

**Censorship Resistance and MEV Protection**

Since Flow EVM runs on the Flow network, it benefits from Flow’s protections against censorship and MEV attacks. The Flow network natively provides censorship & MEV resistance which is achieved by designating specific validators for building transaction bundles that are separated from the validators proposing blocks (proposer-builder separation). More details about this are available in Flow’s protocol [white papers](https://flow.com/technical-paper).
For extra protection on the EVM side, the gateway software is designed to be fully configurable and as lightweight as possible. This enables anyone with an account on Flow (e.g., any application) to run their own instances.

**Fee Market Change (EIP-1559)**

[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) is supported by the Flow EVM and Gateway nodes can decide on the inclusion of the transactions based on the tips or gas fees. The parameters for the EIP 1559 are adjustable by the Flow network. Currently, the base fee is set to zero, as EVM transactions are wrapped by the Flow transactions.

## Block hash calculation difference

Developers using the GoLang Ethereum client to integrate with Flow will find that the block hash calculated by the Flow EVM RPC endpoints `eth_getBlockByNumber` and `eth_getBlockByHash` differ from the hash calculated locally by `go-ethereum`. This is due to underlying
differences in the `Block` implementation to support EVM on Flow. For more information see https://github.com/onflow/flow-evm-gateway/issues/719.

## Opcodes

Flow EVM supports opcodes listed [here](https://www.evm.codes/?fork=cancun), except for the following changes.

- **COINBASE** (`block.coinbase`)
  Similar to Ethereum it returns the address of block’s beneficiary address. In the case of Flow EVM, it returns the address of the current sequencer's fee wallet (see Gateway section for more details).

- **PREVRANDAO** (`block.prevrandao`)
  On Ethereum, this value provides access to beacon chain randomness (see [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399)), Since Flow uses a different approach in consensus and verifiable randomness generation, this value is filled with a random number provided by the Flow protocol. While Flow EVM provides such opcode, it is recommended not to rely on this value for security-sensitive applications, as it is the case on Ethereum. In order to benefit from the full power of secure randomness on Flow, it's recommended to use the [Cadence Arch precompiles](https://github.com/onflow/docs/blob/main/docs/evm/how-it-works.md#precompiled-contracts).

## Precompiled Contracts

Besides all the precompiled contracts supported by Ethereum (see here for [the list](https://www.evm.codes/precompiled?fork=cancun)), Flow EVM has augmented this with a unique precompiled contract, the Cadence Arch, that provides access to the Cadence world.

Cadence Arch is a multi-function smart contract (deployed at `0x0000000000000000000000010000000000000001`) that allows any smart contract on Flow EVM a limited set of interactions with the Cadence environment.

Functions currently available on the Cadence Arch smart contract are:

- `FlowBlockHeight() uint64` (signature: `0x53e87d66`) returns the current Flow block height, this could be used instead of Flow EVM block heights to trigger scheduled actions given it's more predictable when a block might be formed.
- `VerifyCOAOwnershipProof(bytes32 _hash, bytes memory _signature)(bool success)` returns true if the proof is valid. An ownership proof verifies that a Flow wallet controls a COA account (see the next section for more details on COA).
- `revertibleRandom() uint64` returns a safe pseudo-random value that is produced by the Flow VRF (using Flow internal randomness beacon). The function invokes Cadence's `revertibleRandom<uint64>` described [here](https://developers.flow.com/build/cadence/advanced-concepts/randomness). Although the random value is safe, a transaction may revert its results in the case of an unfavourable outcome. The function should only be used by trusted calls where there is no issue with reverting the results. `getRandomSource` must be used instead with untrusted calls.
- `getRandomSource(uint64) bytes32` should be used when implementing a [commit-reveal](https://developers.flow.com/build/cadence/advanced-concepts/randomness#commit-reveal-scheme) scheme. It returns a secure random source from the Cadence randomness history contract. Learn more about the secure usage of randomness on Flow [here](https://developers.flow.com/build/cadence/advanced-concepts/randomness).

Here is a sample demonstrating how to call the Cadence Arch.

```solidity
    address constant public cadenceArch = 0x0000000000000000000000010000000000000001;

    function flowBlockHeight() public view returns (uint64){
        (bool ok, bytes memory data) = cadenceArch.staticcall(abi.encodeWithSignature("flowBlockHeight()"));
        require(ok, "failed to fetch the flow block height through cadence arch");
        uint64 output = abi.decode(data, (uint64));
        return output;
    }
```

## Special Addresses

### Native Token Bridge

Both Cadence and Flow EVM use the same token (FLOW) to run their operations. No new token is minted on the EVM side. Moving FLOW tokens easily across two environments has been supported natively by the EVM smart contract. Because the EVM have limited visibility into Cadence and to make tracking funds easier, every time Flow tokens are withdrawn from the Cadence side and deposited into an EVM address, the balance would be added to a special address `0x0000000000000000000000010000000000000000` (native token bridge) and then transferred to the destination EVM address. The bridge address always maintains a balance of zero. Clearly, this EOA address is a network address and is not controlled by public key.

### Cadence-Owned Accounts (COAs)

COA is a natively supported EVM smart contract wallet type that allows a Cadence resource to own and control an EVM address. This native wallet provides the primitives needed to bridge or control assets across Flow EVM and Cadence. From the EVM perspective, COAs are smart contract wallets that accept native token transfers and support several ERCs including [ERC-165](https://eips.ethereum.org/EIPS/eip-165), [ERC-721](https://eips.ethereum.org/EIPS/eip-721), [ERC-777](https://eips.ethereum.org/EIPS/eip-777), [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155), [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271).

These smart contract wallets are only deployable through the Cadence environment and their address starts with the prefix `0x000000000000000000000002`. The address `0x0000000000000000000000020000000000000000` is reserved for COA factory, an address that deploys contracts for COA accounts.

A COA is not controlled by a key. Instead, every COA account has a unique resource accessible on the Cadence side, and anyone who owns that resource submits transactions on behalf of this address. These direct transactions have COA’s EVM address as the `tx.origin` and a new EVM transaction type (`TxType = 0xff`) is used to differentiate these transactions from other types of EVM transactions (e.g, DynamicFeeTxType (`0x02`). Currently, to make integration and tracking of these transactions byte EVM ecosystem tools, these types of transactions are encoded as legacy EVM transactions (hash computation is based on legacy tx rlp encoding).
Controlling through a resource makes a COA a powerful smart contract wallet. It makes the transfer of ownership of the EVM address super easy without the need to transfer all the assets that an EVM address owns. It also allows a Cadence smart contract to take ownership of an EVM address and makes fully decentralized exchange and bridges across environments possible.

To learn more about how to interact with a COA from the Cadence side, [see here](../../blockchain-development-tutorials/cross-vm-apps/interacting-with-coa.md).

## Proofs

**Inclusion proof of execution artifacts (logs and receipts)**

Similar to other EVM environments, proof can be constructed for artifacts such as receipts. As mentioned earlier, all the EVM execution artifacts are collected as part of a Cadence event. Cadence events are similar to EVM logs, and the root hash of all events (event commitment) of a block is included in Flow's block content. The Cadence event inclusion proof functionality enables constructing proofs for any artifact. For example, if one wants to construct an external proof for the inclusion of a specific EVM log or receipt, here are the steps:

- Flow block validation: Anyone following the Flow blocks can validate the Flow block headers.

- EVM block validation: Since each Flow block has the root hash of Cadence events emitted during block execution. It can construct and verify the inclusion of the specific Event. In this case, every time an EVM block is executed an `evm.BlockExecuted` event is emitted that contains the full EVM block information.

- Receipt inclusion: Each EVM block includes the root hash for the receipts generated during block execution. Similar to other EVM chains, a proof can be constructed to prove inclusion of a log or receipt.

**Inclusion proof of transactions**

Each Flow EVM block (TransactionHashRoot) includes the Merkle root hash of all the transaction hashes executed during this block. Despite similar functionality, this root is a bit different than TransactionRoot provided by Ethereum, It is a commitment over the list of transaction hashes instead of transactions, so each leaf node in the Merkle tree has the transaction hash as the value instead of full RLP encoding of transaction. So verifying the proofs requires an extra calling to the hash function.

**Account proofs**

Another type of proof that EVM environments provide is proof for the state of accounts. These proofs depend on the trie structure of the execution environment. Flow EVM benefits from the advanced storage and proof system that makes Flow’s multi-role architecture possible.

Flow’s state system provides ways to construct inclusion and non-inclusion proofs and one can construct proofs for EVM account’s meta data (account balances, nonce, … ). A less common proof type is proof over the storage state of an account (mostly used for smart contracts). The first release of Flow EVM won’t support these type of proofs.
