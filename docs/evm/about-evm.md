# About EVM

Flow EVM is a secure, performant, highly scalable EVM-equivalent L1 which is natively integrated into the Flow 
blockchain. It inherits Flow's [decentralization](https://flow.com/decentralization) and its multi-node 
distributed consensus and transaction model. Specifically, Flow EVM benefits from Flow's
[horizontally scaled transaction linearization](https://flow.com/core-protocol-vision#scaling-transactions) design 
which has solved proposer builder separation, separation of compute, and settlement – all without sharding. 

## Works out-of-the-box

Flow EVM is designed to work out-of-the-box with EVM-compatible tooling and clients and will run existing Solidity 
contracts as-is without any changes. Builders then become able to leverage mainstream features like Account 
Linking for seamless web2-style onboarding when augmenting their EVM apps. While your Solidity contracts remain unchanged,
accessing Flow's powerful feature set is only possible by implementing some amount of Cadence, Flow's smart contract 
language, to bring things together. This is made easier by the fact that EVM transactions can be composed and executed 
within a Cadence transaction, enabling novel use-cases and patterns for integration. Native EVM transactions continue 
to be supported when using Metamask and other standard clients. Flow's existing storage model has been adapted as the 
storage state for Flow EVM, however, they are not commingled but exist distinctly.

## Best-in-class UX

Account Linking is built on Flow's account abstraction model and enables users to immediately dive into an app without 
wallet authentication. On-chain accounts can instead be created on-demand by the application with as little as a 
nickname. App custodial creation of new user accounts is handled through the Account Linking standard. At some later 
stage users may choose to link the app-custody account to their personal wallet which yields full custody of that 
account to the user. Flow EVM apps can leverage Account Linking to handle creation of EVM accounts and achieve the same
smooth onboarding UX. 

## Instant cross-VM token transfers

Flow EVM and Flow environments both use $FLOW token as the gas currency for transactions, drawing from a singular token 
supply shared across both. A single line of Cadence can transfer FLOW tokens in the Flow environment to Flow EVM, or 
vice versa. Other fungible and non-fungible tokens can also be seamlessly transferred between environments using the 
native cross-VM token bridge, instantly in a single atomic transaction

## Scalability, performance and low gas fees

Flow’s state space is extensible to the petabyte scale and is the reason why Cadence contracts have standardized on
storing application data on-chain. This benefit translates directly to Flow EVM allowing contracts to maintain a full 
working dataset - including metadata - together with contract logic, all at low gas rates. Furthermore, Flow EVM removes
the 24kb limit on Solidity contracts.

Flow's transaction throughput peaked to 2M daily transactions during 2023 - [TODO] figure framing and focus for performance

## MEV resilience

[TODO]

## Composability, innovation and experimentation
Experimentation and prototyping cross-chain use-cases has never been easier.

Flow EVM introduces a unique and powerful EVM+ builder paradigm unlike any other blockchain.

However, a high degree of composability between Flow EVM and Cadence environments has been facilitated through several 
means.


## FAQs

The genesis state of the "Flow EVM" is empty, thus there are no
accounts with non-zero balances.

with its own dedicated EVM chain-id for Testnet and Mainnet respectively

(reference implementation: Geth v1.13),
and Flow EVM will continue to integrate future software updates

Point to technical docs