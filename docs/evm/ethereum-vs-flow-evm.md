---
title: Differences between EVM on Flow and Ethereum
sidebar_label: EVM on Flow vs. Ethereum
sidebar_position: 14
---

# Differences between EVM on Flow and Ethereum

## Introduction

The Flow network uses [Cadence](https://cadence-lang.org/) as its main execution environment. Cadence offers a safer, more efficient, and more developer-friendly experience for building smart contracts and decentralized applications. However, supporting EVM could make it easier for existing applications and tools already deployed for the EVM ecosystem to onboard to the Flow network ([more](https://developers.flow.com/evm/about) on this topic).

EVM on Flow is designed with these major goals in mind: 

- Supporting EVM equivalency: Ensure that any tools and applications deployed to or run on Ethereum can also be deployed and run on Flow.
- Minimizing breaking changes to the Cadence ecosystem, software and tools
- Maximum composability across environments: Allowing atomic and smooth interaction between EVM and Cadence environments.

Let's look at some aspects of design to gain a better understanding:

### EVM - a smart contract in Cadence

To satisfy the design goals and thanks to the extensibility properties of the Cadence runtime, EVM on Flow is designed as a higher-level environment incorporated as a smart contract deployed to Cadence. This smart contract is not owned by anyone and has its own storage space, allows Cadence to query, and is updated through EVM transactions. EVM transactions can be wrapped inside Cadence transactions and passed to the EVM contract for execution. The artifacts of EVM transaction execution (e.g. receipts and logs) are emitted as special Cadence events (TransactionExecuted, BlockExecuted) and available to the upstream process (Flow transaction) to enable atomic operations. 

The EVM environment has its own concept of blocks, and a single Flow block can include several EVM blocks (a one-to-many relationship). Note that since EVM blocks are formed on-chain and Flow provides fast finality, as long as the user of these events waits for Flow block finality, it doesn’t have to worry about EVM block forks, uncle chains, and other consensus-related problems on Ethereum. 

### No shared memory

The interaction between two environments is through atomic calls and none of the environments has access to the raw memory of the other. This maintains the security properties of each environment. Cadence can submit transactions to the EVM environment and EVM transactions can make calls to a special precompiled contract called Cadence Arch.  

### No new native token

EVM on Flow uses the same native token as Cadence (FLOW token). No new token is minted at the genesis block of EVM and all the tokens have to be bridged over from the Cadence side into the EVM side. To facilitate this a native bridge is provided by the EVM contract. 

### EVM equivalency

Under the hood, EVM on Flow uses [the standard EVM implementation](https://github.com/ethereum/go-ethereum) and regularly applies updates through Flow’s height-coordinated updates. This means anything that can run on Ethereum after the Shanghai fork can run on Flow EVM. This means many useful EIPs such as [EIP-1014](https://eips.ethereum.org/EIPS/eip-1014), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559), … are supported automatically.

Yet a small set of differences between EVM on Flow and Ethereum might be seen (mostly of the nature of extension) for two reasons: 

- A set of extensions has been added to ensure seamless and easy interaction between the two environments.
- EVM on Flow is secured by the Flow network and benefits from its nice properties. For example, Flow supports fast block production and finalization, making issues like handling uncle chains irrelevant.

### Gateways

As mentioned earlier EVM on Flow doesn’t have its own consensus and runs on top of the Flow network. There is no new node type for the EVM on Flow. Anyone who wants to run the network can stake tokens and participate as Flow nodes.

Gateway is a new software package provided by the Flow Foundation. It communicates with the Flow access nodes and can be run by anyone (unstaked). It serves two purposes:

**Gateway as a light client**

A *gateway* follows the Flow block productions and collects and verifies EVM-related events. Using this collected and indexed data, it accepts RPC requests and provides JSON-RPC endpoints for any third-party applications that want to interact directly with the Flow EVM (see [list of supported endpoints](https://github.com/onflow/flow-evm-gateway?tab=readme-ov-file#supported-namespaces-and-methods)). EVM events include all information needed to reconstruct the EVM state since the genesis block (replayability). By re-executing transactions, the gateway can collect traces and maintain a local and archival copy of the EVM state over time.

**Gateway as a sequencer**

As mentioned, EVM on Flow can be seen as a higher-level environment built on top of Cadence. Thus, all EVM transactions must be submitted through a Flow transaction (a wrapped call to the EVM). The gateway accepts EVM transactions, runs an internal mempool of transactions, wraps batches of EVM transactions in Flow transactions, and submits them.

Note that the safety of transaction execution is not dependent on the gateway; they only relay the transaction. The safety measures of the EVM environment (e.g., Nonce, etc.) ensure that each transaction is executed at most once. Since gateways are submitting Flow transactions, they have to pay the related transaction fees. Part of these fees is associated with the computation fees of the EVM transaction.

To facilitate the repayment of fees, the EVM run transaction function accepts a coinbase address, collects the gas fees from the transaction, and pays it to the address provided by the gateway node. Essentially, the transaction wrapper behaves similarly to a miner, receives the gas usage fees on an EVM address, and pays for the transaction fees. The gas price per unit of gas creates a marketplace for these 3rd parties to compete over transactions.

**Censorship resistance and MEV protection**

Since EVM on Flow runs on the Flow network, it benefits from Flow’s protections against censorship and MEV attacks. The Flow network natively provides censorship & MEV resistance which is achieved by designating specific validators for building transaction bundles that are separated from the validators proposing blocks (proposer-builder separation). You can read more about it on the Flow’s protocol white paper. 
For extra protection on the EVM side, the gateway software is designed to be fully configurable and as lightweight as possible. This enables anyone with an account on Flow (e.g., any application) to run this software.

**EIP-1559**

[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) is supported by the EVM on Flow and Gateway nodes can decide on the inclusion of the transactions based on the tips or gas fees. The parameters for the EIP 1559 are adjustable by the Flow network. Currently, the base fee is set to zero, as EVM transactions are wrapped by the Flow transactions.

### Proofs

**Inclusion/non-inclusion proof of execution artifacts (logs and receipts)**

Similar to other EVM environments, proof can be constructed for artifacts such as receipts. As mentioned earlier, all the EVM execution artifacts are collected as part of a Cadence event. Cadence events are similar to EVM logs, and the root hash of all events (event commitment) of a block is included in Flow's block content. The Cadence event inclusion proof functionality enables constructing proofs for any artifact. For example, if one wants to construct an external proof for the inclusion of a specific EVM log or receipt, here are the steps:

- Flow block validation: Anyone following the Flow blocks have can validates the Flow block headers.

- EVM block validation: Since each Flow block has the root hash of Cadence events emitted during block execution. It can construct and verify the inclusion of the specific Event. In this case, every time an EVM block is executed an `evm.BlockExecuted` event is emitted that contains the full EVM block information.

- Receipt inclusion** : Each EVM block includes the root hash for the receipts generated during block execution. Similar to other EVM chains, a proof can be constructed to prove inclusion of a log or receipt.

**Account proofs**

Another type of proof that EVM environments provide is proof for the state of accounts. These proofs depend on the trie structure of the execution environment. EVM on Flow benefits from the advanced storage and proof system that makes Flow’s multi-role architecture possible.

Flow’s state system provides ways to construct inclusion and non-inclusion proofs and one can construct proofs for EVM account’s meta data (account balances, nonce, … ). A less common proof type is proof over the storage state of an account (mostly used for smart contracts). The first release of EVM on Flow won’t support these type of proofs.

## Opcodes

EVM on Flow supports opcodes listed [here](https://www.evm.codes/?fork=shanghai), except for these changes. 

- **COINBASE**  (`block.coinbase`)
Similar to Ethereum it returns the address of block’s beneficiary address. In the case of EVM on Flow, it returns the address of the current sequencer's fee wallet (see Gateway section for more details).
- **PREVRANDAO** (`block.prevrandao`)
    On Ethereum, this value provides access to beacon chain randomness (see [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399)), Since Flow uses a different approach in consensus and verifiable randomness generation, this value is filled with a random number provided by the Flow protocol ([see here](https://developers.flow.com/build/advanced-concepts/randomness) for more details). While EVM on Flow provides such opcode, to benefit from the full power of randomness on Flow, it's recommended to use the Cadence Arch precompiled contract.
    
- **BLOCKHASH**
    Similar to Ethereum, this provides access to the block hash for the past blocks, except currently, EVM on Flow supports the last 16 blocks. Access the full list of last 256 blocks is currently under development and soon will be released. 
    

## Precompiled Contracts

Besides all the precompiled contracts supported by Ethereum (see here for [the list](https://www.evm.codes/precompiled?fork=shanghai)), EVM on Flow has augmented this with a unique precompiled contract, the Cadence Arch, that provides access to the Cadence world. 

Cadence Arch is a multi-function smart contract (deployed at `0x0000000000000000000000010000000000000001`) that allows any smart contract on Flow EVM to interact with the Cadence side.

Here is the list of some of the functions available on the Cadence Arch smart contract in the first release:

- `FlowBlockHeight() uint64` (signature: `0x53e87d66`) returns the current flow block height, this could be used instead of flow evm block heights to trigger scheduled actions given it's more predictable when a block might be formed.
- `VerifyCOAOwnershipProof(bytes32 _hash, bytes memory _signature)(bool success)` returns true if the proof is valid. An ownership proof verifies that a Flow wallet controls a COA account (see the next section for more details on COA).
- `getRandomSource(uint64) bytes32` returns a secure on-chain random source. This can be used for the creation of PRGs (learn more about [secure random on Flow here](https://developers.flow.com/build/advanced-concepts/randomness)).
- `revertibleRandom() uint64` returns a pseudo-random value that is produced by the Flow PRG and uses a secure on-chain random source with salt as the seed to the generator. Using this random value is safe, but it allows for a transaction to revert in case of an unfavourable outcome, so it must be used carefully and it's best to [follow safety guidelines](https://developers.flow.com/build/advanced-concepts/randomness).

## Special addresses

### Native Token Bridge

Both Cadence and EVM on Flow use the same token (FLOW) to run their operations. No new token is minted on the EVM side. Moving FLOW tokens easily across two environments has been supported natively by the EVM smart contract. Because the EVM have limited visibility into Cadence and to make tracking funds easier, every time Flow tokens are withdrawn from the Cadence side and deposited into an EVM address, the balance would be added to a special address `0x0000000000000000000000010000000000000000` (native token bridge) and then transferred to the destination EVM address. The bridge address always maintains a balance of zero. Clearly, this EOA address is a network address and is not controlled by public key.

### Cadence-Owned Accounts (COAs)

COA is a natively supported EVM smart contract wallet type that allows a Cadence resource to own and control an EVM address. This native wallet provides the primitives needed to bridge or control assets across Flow EVM and Cadence. From the EVM perspective, COAs are smart contract wallets that accept native token transfers and support several ERCs including [ERC-165](https://eips.ethereum.org/EIPS/eip-165), [ERC-721](https://eips.ethereum.org/EIPS/eip-721), [ERC-777](https://eips.ethereum.org/EIPS/eip-777), [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155), [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271). 

These smart contract wallets are only deployable through the Cadence environment and their address starts with the prefix `0x000000000000000000000002`. The address `0x0000000000000000000000020000000000000000` is reserved for COA factory, an address that deploys contracts for COA accounts.

A COA is **not** controlled by a key and instead every COA account has a unique resource accessible on the Cadence side, and anyone who owns that resource and submits transactions on behalf of this address. These direct transactions have COA’s EVM address as the `tx.origin` and a new EVM transaction type (`TxType = 0xff`) is used to differentiate these transactions from other types of EVM transactions (e.g, DynamicFeeTxType (`0x02`). Currently, to make integration and tracking of these transactions byte EVM ecosystem tools, these types of transactions are encoded as legacy EVM transactions (hash computation is based on legacy tx rlp encoding).
Controlling through a resource makes COA powerful smart contract wallets. It makes the transfer of ownership of the EVM address super easy without the need to transfer all the assets that an EVM address owns. It also allows a Cadence smart contract to take ownership of an EVM address and makes fully decentralized exchange and bridges across environments possible.  

To learn more about how to interact with a COA from the Cadence side, [see here](https://developers.flow.com/evm/cadence/interacting-with-coa).