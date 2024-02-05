---
title: About FlowEVM
sidebar_label: About
sidebar_position: 1
---

# About FlowEVM

FlowEVM is a secure, performant, highly scalable EVM-equivalent L1 which is natively integrated into the Flow
blockchain. It inherits Flow's [decentralization](https://flow.com/decentralization) and its multi-node
distributed consensus and transaction model. Specifically, Flow EVM benefits from Flow's
[horizontally scaled transaction linearization](https://flow.com/core-protocol-vision#scaling-transactions) design
which has solved proposer builder separation, separation of compute, and settlement – all without sharding.

## Seamless Integration for Ethereum Developers

FlowEVM is designed to work out-of-the-box with the Ethereum toolchain or other clients and will run existing Solidity
contracts as-is without any changes. Developers can get their existing applications up and running on day one! With 
your core application running you can begin to explore how to leverage Flow's powerful feature set for your application.
To achieve this will require implementing a minimal transaction script in Cadence, Flow's smart contract language, to 
integrate Flow features to FlowEVM. This is made possible because EVM transactions are composed and executed within a 
Cadence transaction, enabling novel use-cases and patterns for integration. 

Native EVM transactions continue to be supported when using Metamask and other EVM-compatible clients. 

## Best-in-class UX

Account Linking is built on Flow's account abstraction model and enables users to immediately use an app without
wallet authentication. On-chain accounts can be created as needed by the application which custodies their use for an
anonymous user. At some later point these users may choose to link the custodied account to their self-custodial wallet 
taking full ownership of the account. FlowEVM apps can also leverage Account Linking to handle creation of EVM accounts 
and achieve a similarly smooth onboarding user experience.

## Instant cross-VM token transfers

FlowEVM and Flow environments both use $FLOW token as the gas currency for transactions, sharing a singular token
supply across both environments. A few lines Cadence can transfer FLOW tokens in the Flow environment to FlowEVM, 
or vice versa. Other fungible and non-fungible tokens can also be seamlessly transferred between environments using the
native cross-VM token bridge, taking place instantly in a single atomic transaction

## Scalability, performance and low gas fees

Flow’s state space is extensible to the petabyte scale and is the reason why Cadence contracts have standardized on
storing application data on-chain. This benefit translates directly to FlowEVM which allowing contracts to maintain a full
working dataset - including metadata - together with contract logic, all at low gas rates. Flow's state scalability sets
the foundations for significant throughput optimization yet to come.

Flow's transaction throughput peaked to 2M daily transactions during 2023 sustaining a similar average transaction 
volume as Ethereum. Unlike Ethereum, Flow has always operated well under its maximum throughput ceiling which is 
presently scalable to 5x more transactions with further performance optimizations to come when parallel execution is 
released. 

## MEV resilience

Since EVM on Flow transactions are composed and executed within a Cadence transaction block production is handled by 
Flow’s multi-role architecture. The heterogeneity between node roles ensures that visibility into block proposal, 
assembly, asserting block validity and other correctness checks during the block processing cycle expose only the
limited information that a given node type requires to perform its function. These differences in node and consensus 
design results in strong economic disincentives for collusion because no individual node has full visibility into the 
state of block processing for the chain. FlowEVM's robust MEV resilience is a significant difference from other EVMs 
and will help to ensure gas fees are reasonably priced at all times. The impracticality of frontrunning or other attacks 
improves the user experience by eliminating failed transactions and invisible fees.

# Key Advantages

- **Access New Markets**: Easily tap into Flow's user base and unique IPs without any implementation risk
- **Simplified Multi-Chain Experience**: Ideal for applications without a multi-chain approach or those wanting to ensure cross-chain compatibility
- **Leverage Flow’s Protocol**: Expand EVM capabilities and transcend EVM limitations using Cadence, which offers a powerful new account model, programmable resources, and hybrid ownership
- **No Miner Extractable Value (MEV)**: Leading to a more fair and secure environment for all participants and minimizing the risk of front running transactions
- **Enhanced Functionality**:
    - Compose assets and functionality spanning VM environments using [Cadence contracts](https://cadence-lang.org/)
    - Conduct multiple contract interactions atomically
    - Tap in to [Capabilities](https://cadence-lang.org/docs/tutorial/capabilities) for zero-transfer access ([Account Linking](https://developers.flow.com/build/advanced-concepts/account-linking))
- **Gas Fees**: Transactions are extremely low-cost and denominated in FLOW

# Learn More and Join the Conversation

Users and developers are welcome to chat with us in the FlowEVM [Discord](https://discord.com/channels/613813861610684416/1167476806333513800).

## Interested in Partnering or Co-marketing?

Are you interested in launching an EVM project on FlowEVM or partnering? Visit our weekly FlowEVM office hours for 
discussions on project development and other opportunities for collaboration.

## Further Reading and Discussions

- [Why EVM on Flow: Beyond Solidity](https://forum.flow.com/t/evm-on-flow-beyond-solidity/5260)
- [Path to EVM Equivalence on Flow](https://forum.flow.com/t/evm-equivalence-on-flow-proposal-and-path-forward/5478)

## Flow Improvement Proposals (FLIPs)

Those wishing to understand the technical specifics of how FLowEVM is integrated with Flow we recommend reviewing the 
following improvement proposals.

- Understanding [EVM Support on Flow](https://github.com/onflow/flips/pull/225)
- Exploring the [Flow VM Bridge](https://github.com/onflow/flips/pull/233/files/d5bc46c4b13f0b9b168a94f994c77a5a689f6b24..122e938b7acae7e774246b1b66aaf5979ca21444)
- Insights into the [Flow EVM Gateway](https://github.com/onflow/flips/pull/235/files)
- Integration of the [Cadence Interface](https://github.com/onflow/flips/blob/f646491ec895442dcccdb24d80080bab1c56188e/protocol/20231116-evm-support.md)
