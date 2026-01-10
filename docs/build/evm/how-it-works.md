---
title: How Flow EVM Works
sidebar_label: How it Works
sidebar_position: 3
---

# How Flow EVM Works

The Flow network uses [Cadence] as its main execution environment. Cadence offers a safe, efficient, and developer-friendly experience to build smart contracts and decentralized applications. Cadence extends EVM apps built in Solidity. It unlocks gasless experiences, new business models, and fine-tuned access control. Since Flow offers full EVM support, current applications and tools already deployed in the EVM ecosystem can simply onboard to the network with [no code changes].

Flow EVM is designed with these major goals in mind:

- Support EVM equivalency: Ensure that any tools and applications deployed to or run on Ethereum can also be deployed and run on Flow.
- Minimize breaking changes to the Cadence ecosystem, software and tools.
- Maximum composability across environments: Allowing atomic and smooth interaction between EVM and Cadence environments.

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/U4tR8abpclQ?si=dOGAJ1-QSDsscXKB" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
  ></iframe>
</div>

### EVM - a smart contract in Cadence

To satisfy the design goals and thanks to the extensibility properties of the Cadence runtime, Flow EVM is designed as a higher-level environment incorporated as a smart contract deployed to Cadence. This smart contract is not owned by anyone and has its own storage space, allows Cadence to query, and is updated through EVM transactions. EVM transactions can be wrapped inside Cadence transactions and passed to the EVM contract for execution. The artifacts of EVM transaction execution (such as receipts and logs) are emitted as special Cadence events (TransactionExecuted, BlockExecuted) and available to the upstream process (Flow transaction) to turn on atomic operations.

The EVM environment has its own concept of blocks, and every Flow block includes at most one EVM Block. The EVM block is formed at the end of Flow Block execution and includes all the transaction executed during the EVM block execution. Since EVM blocks are formed onchain and Flow provides fast finality, as long as the user of these events waits for Flow block finality, it doesn’t have to worry about EVM block forks, uncle chains, and other consensus-related challenges.

### No shared memory design

The interaction between two environments is through atomic calls and none of the environments has access to the raw memory of the other. This maintains the security properties of each environment. Cadence can submit transactions to the EVM environment and EVM transactions can make calls to a special precompiled contract called Cadence Arch. You can read more about this in the [Precompiled contracts] section.

### No new native token

Flow EVM uses the same native token as Cadence (FLOW token). No new token is minted at the genesis block of EVM and all the tokens have to be bridged over from the Cadence side into the EVM side. To facilitate this a native bridge is provided by the EVM contract.

### EVM Equivalency

Under the hood, Flow EVM uses [the standard EVM implementation] and regularly applies updates through Flow’s height-coordinated updates (such as execution layer changes planned for the Ethereum Prague update). This means anything that can run on Ethereum after the Pectra upgrade can run on Flow EVM. This means many useful EIPs such as [EIP-1014], [EIP-1559], [EIP-4844], [EIP-5656], [EIP-6780], are supported automatically.

Yet a small set of differences between Flow EVM and Ethereum might be seen (mostly of the nature of extension) for two reasons:

- A set of extensions has been added to ensure seamless and easy interaction between the two environments.
- Flow EVM is secured by the Flow network and benefits from its robust network properties, such as fast block production and finalization, which makes issues like handling uncle chains irrelevant.

## Gateways

As mentioned, Flow EVM runs on top of the Flow network and its consensus model. Flow EVM does not leverage `geth` or introduce new node types to the current architecture. Operators who want help secure the network stake tokens and run one of the Flow node types.

To support `web3.js` clients, the [EVM Gateway] honors the Ethereum [JSON-RPC specification]. The gateway integrates with Flow access nodes and can be run by anyone (unstaked). It serves two purposes:

### Gateway as a light client

The gateway follows Flow's block production to collect, verify, and index EVM-related events. The gateway provides the necessary endpoints and services all JSON-RPC requests for third-party dApps that interact with Flow EVM. EVM events include all information needed to reconstruct the EVM state since the genesis block (replayability). When the gateway re-executes transactions, it can collect traces and maintain a local and archival copy of the EVM state over time.

### Gateway as a sequencer

As mentioned, Flow EVM can be seen as a higher-level environment built on top of Cadence. Thus, all EVM transactions are ultimately handled with a Flow transaction (a wrapped call to the EVM). The gateway accepts EVM transactions, runs an internal mempool of transactions, wraps batches of EVM transactions in Flow transactions, and submits them.

The safety of transaction execution is not dependent on the gateway; they only relay the transaction. The safety measures of the EVM environment (for example, Nonce) ensure that each transaction is executed at most once. Since the gateways submit Flow transactions, they have to pay the related transaction fees. Part of these fees is associated with the computation fees of the EVM transaction.

To facilitate the repayment of fees, the `evm.run` function accepts a `coinbase` address, which collects gas fees from the transaction, and pays it to the address provided by the gateway node. Essentially, the transaction wrapper behaves similarly to a miner, receives the gas usage fees on an EVM address, and pays for the transaction fees. The gas price per unit of gas creates a marketplace for these third parties to compete over transactions.

**Censorship resistance and MEV protection**

Since Flow EVM runs on the Flow network, it benefits from Flow’s protections against censorship and MEV attacks. The Flow network natively provides censorship and MEV resistance, which it achieves by designating specific validators to build transaction bundles that are separated from the validators that propose blocks (proposer-builder separation). More details about this are available in Flow’s protocol [white papers].
For extra protection on the EVM side, the gateway software is designed to be fully configurable and as lightweight as possible. This allows anyone with an account on Flow (for example, any application) to run their own instances.

**Fee market change (EIP-1559)**

[EIP-1559] is supported by the Flow EVM and Gateway nodes can decide on the inclusion of the transactions based on the tips or gas fees. The parameters for the EIP 1559 are adjustable by the Flow network. Currently, the base fee is set to zero, as EVM transactions are wrapped by the Flow transactions.

## Block hash calculation difference

Developers who use the GoLang Ethereum client to integrate with Flow will find that the block hash calculated by the Flow EVM RPC endpoints `eth_getBlockByNumber` and `eth_getBlockByHash` differ from the hash calculated locally by `go-ethereum`. This is due to underlying differences in the `Block` implementation to support EVM on Flow. For more information, see [the issue in GitHub].

## Opcodes

Flow EVM supports opcodes listed [here], except for the following changes:

- **COINBASE** (`block.coinbase`)
  Similar to Ethereum, it returns the address of block’s beneficiary address. In the case of Flow EVM, it returns the address of the current sequencer's fee wallet (see the [Gateways] section for more details).

- **PREVRANDAO** (`block.prevrandao`)
  On Ethereum, this value provides access to beacon chain randomness (see [EIP-4399]), Since Flow uses a different approach in consensus and verifiable randomness generation, this value is filled with a random number provided by the Flow protocol. While Flow EVM provides such opcode, it is recommended not to rely on this value for security-sensitive applications, as it is the case on Ethereum. In order to benefit from the full power of secure randomness on Flow, we recommend that you use the [Cadence Arch precompiles].

## Precompiled contracts

Besides all the precompiled contracts supported by Ethereum (see here for [the list]), Flow EVM has augmented this with a unique precompiled contract, the Cadence Arch, that provides access to the Cadence world.

Cadence Arch is a multi-function smart contract (deployed at `0x0000000000000000000000010000000000000001`) that allows any smart contract on Flow EVM a limited set of interactions with the Cadence environment.

Functions currently available on the Cadence Arch smart contract are:

- `FlowBlockHeight() uint64` (signature: `0x53e87d66`) returns the current Flow block height. This could be used instead of Flow EVM block heights to trigger scheduled actions, given that it's more predictable when a block might be formed.
- `VerifyCOAOwnershipProof(bytes32 _hash, bytes memory _signature)(bool success)` returns true if the proof is valid. An ownership proof verifies that a Flow wallet controls a COA account (see the next section for more details on [COA]).
- `revertibleRandom() uint64` returns a safe pseudo-random value that is produced by the Flow VRF (via the Flow internal randomness beacon). The function invokes Cadence's `revertibleRandom<uint64>` described [here]. Although the random value is safe, a transaction may revert its results in the case of an unfavourable outcome. The function should only be used by trusted calls where there is no issue if the result reverts. `getRandomSource` must be used instead with untrusted calls.
- `getRandomSource(uint64) bytes32` should be used when you implement a [commit-reveal] scheme. It returns a secure random source from the Cadence randomness history contract. Learn more about the secure usage of randomness on Flow [here].

Here is a sample that demonstrates how to call the Cadence Arch.

```solidity
    address constant public cadenceArch = 0x0000000000000000000000010000000000000001;

    function flowBlockHeight() public view returns (uint64){
        (bool ok, bytes memory data) = cadenceArch.staticcall(abi.encodeWithSignature("flowBlockHeight()"));
        require(ok, "failed to fetch the flow block height through cadence arch");
        uint64 output = abi.decode(data, (uint64));
        return output;
    }
```

## Special addresses

### Native token bridge

Both Cadence and Flow EVM use the same token (FLOW) to run their operations. No new token is minted on the EVM side. The EVM smart contract natively supports easy FLOW token movement across two environments. Because the EVM have limited visibility into Cadence and to make tracking funds easier, every time Flow tokens are withdrawn from the Cadence side and deposited into an EVM address, the balance is added to a special address `0x0000000000000000000000010000000000000000` (native token bridge) and then transferred to the destination EVM address. The bridge address always maintains a balance of zero. Clearly, this EOA address is a network address and is not controlled by public key.

### Cadence-Owned Accounts (COAs)

COA is a natively supported EVM smart contract wallet type that allows a Cadence resource to own and control an EVM address. This native wallet provides the primitives needed to bridge or control assets across Flow EVM and Cadence. From the EVM perspective, COAs are smart contract wallets that accept native token transfers and support several ERCs including [ERC-165], [ERC-721], [ERC-777], [ERC-1155].

These smart contract wallets are only deployable through the Cadence environment and their address starts with the prefix `0x000000000000000000000002`. The address `0x0000000000000000000000020000000000000000` is reserved for COA factory, an address that deploys contracts for COA accounts.

A COA is not controlled by a key. Instead, every COA account has a unique resource accessible on the Cadence side, and anyone who owns that resource submits transactions on behalf of this address. These direct transactions have COA’s EVM address as the `tx.origin` and a new EVM transaction type (`TxType = 0xff`) is used to differentiate these transactions from other types of EVM transactions (for example, DynamicFeeTxType (`0x02`)). Currently, to make integration and tracking of these transactions byte EVM ecosystem tools, these types of transactions are encoded as legacy EVM transactions (hash computation is based on legacy tx rlp encoding).

Control via a resource makes a COA a powerful smart contract wallet. It makes the transfer of ownership of the EVM address super easy without the need to transfer all the assets that an EVM address owns. It also allows a Cadence smart contract to take ownership of an EVM address and makes fully decentralized exchange and bridges across environments possible.

To learn more about how to interact with a COA from the Cadence side, [see here].

## Proofs

**Inclusion proof of execution artifacts (logs and receipts)**

Similar to other EVM environments, proof can be constructed for artifacts such as receipts. As mentioned earlier, all the EVM execution artifacts are collected as part of a Cadence event. Cadence events are similar to EVM logs, and the root hash of all events (event commitment) of a block is included in Flow's block content. The Cadence event inclusion proof functionality allows you to construct proofs for any artifact. For example, if you want to construct an external proof for the inclusion of a specific EVM log or receipt, here are the steps:

- Flow block validation: Anyone who follows the Flow blocks can validate the Flow block headers.

- EVM block validation: Since each Flow block has the root hash of Cadence events emitted during block execution, it can construct and verify the inclusion of the specific Event. In this case, every time an EVM block is executed an `evm.BlockExecuted` event is emitted that contains the full EVM block information.

- Receipt inclusion: Each EVM block includes the root hash for the receipts generated during block execution. Similar to other EVM chains, a proof can be constructed to prove inclusion of a log or receipt.

**Inclusion proof of transactions**

Each Flow EVM block (TransactionHashRoot) includes the Merkle root hash of all the transaction hashes executed during this block. Despite similar functionality, this root is a bit different than TransactionRoot provided by Ethereum. It is a commitment over the list of transaction hashes instead of transactions, so each leaf node in the Merkle tree has the transaction hash as the value instead of full RLP encoding of transaction. So, proof verification requires an extra call to the hash function.

**Account proofs**

Another type of proof that EVM environments provide is proof for the state of accounts. These proofs depend on the trie structure of the execution environment. Flow EVM benefits from the advanced storage and proof system that makes Flow’s multi-role architecture possible.

Flow’s state system provides ways to construct inclusion and non-inclusion proofs and you can construct proofs for EVM account’s meta data (account balances, nonce, and so on). A less common proof type is proof over the storage state of an account (mostly used for smart contracts). The first release of Flow EVM won’t support these type of proofs.

<!-- Reference-style links, will not render on page. -->

[Cadence]: https://cadence-lang.org
[no code changes]: https://developers.flow.com/evm/about
[Precompiled contracts]: #precompiled-contracts
[the standard EVM implementation]: https://github.com/ethereum/go-ethereum
[EIP-1014]: https://eips.ethereum.org/EIPS/eip-1014 
[EIP-1559]: https://eips.ethereum.org/EIPS/eip-1559 
[EIP-4844]: https://eips.ethereum.org/EIPS/eip-4844
[EIP-5656]: https://eips.ethereum.org/EIPS/eip-5656
[EIP-6780]: https://eips.ethereum.org/EIPS/eip-6780
[EVM Gateway]: https://github.com/onflow/flow-evm-gateway 
[JSON-RPC specification]: https://ethereum.org/en/developers/docs/apis/json-rpc/
[white papers]: https://flow.com/technical-paper
[EIP-1559]: https://eips.ethereum.org/EIPS/eip-1559
[the issue in GitHub]: https://github.com/onflow/flow-evm-gateway/issues/719
[here]: https://www.evm.codes/?fork=cancun
[Gateways]: #gateways
[EIP-4399]: https://eips.ethereum.org/EIPS/eip-4399
[Cadence Arch precompiles]: https://github.com/onflow/docs/blob/main/docs/evm/how-it-works.md#precompiled-contracts
[here]: https://developers.flow.com/build/cadence/advanced-concepts/randomness
[commit-reveal]: https://developers.flow.com/build/cadence/advanced-concepts/randomness#commit-reveal-scheme
[COA]: #special-addresses
[ERC-165]: https://eips.ethereum.org/EIPS/eip-165)
[ERC-721]: https://eips.ethereum.org/EIPS/eip-721
[ERC-777]: https://eips.ethereum.org/EIPS/eip-777 
[ERC-1155]: https://eips.ethereum.org/EIPS/eip-1155 
[ERC-1271]: https://eips.ethereum.org/EIPS/eip-1271)
[see here]: ../../blockchain-development-tutorials/cross-vm-apps/interacting-with-coa.md