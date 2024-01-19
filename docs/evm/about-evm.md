# About EVM

Flow EVM is a secure, performant, highly scalable EVM-equivalent L1 which is natively integrated into the Flow 
blockchain. It inherits Flow's [decentralization](https://flow.com/decentralization) and its multi-node 
distributed consensus and transaction model. Specifically, Flow EVM benefits from Flow's
[horizontally scaled transaction linearization](https://flow.com/core-protocol-vision#scaling-transactions) design 
which has solved proposer builder separation, separation of compute, and settlement – all without sharding. 

Flow EVM is designed to work out-of-the-box with EVM-compatible tooling and clients and will run existing Solidity 
contracts as-is without any changes. Builders then become able to leverage advanced mainstream features like Account 
Linking for seamless web2-style onboarding when augmenting their EVM apps. While your Solidity contracts remain unchanged,
accessing Flow's powerful feature set is only possible by implementing some amount of Cadence, Flow's smart contract 
language, to bring things together. This is made easier by the fact that EVM transactions can be composed and executed 
within a Cadence transaction, enabling novel use-cases and patterns for integration. Native EVM transactions through 
wallets such as Metamask also continue to be supported and remain unchanged. Flow EVM also has its own dedicated storage 
state, distinct from the Cadence environment which is authenticated and verified by the Flow network. 

Flow EVM and Flow environments both use $FLOW token as the gas currency for transactions, drawing from a singular token 
supply shared across both. A single line of Cadence can transfer $FLOW tokens in the Flow environment to Flow EVM, or 
vice versa. Other fungible and non-fungible tokens can also be natively transferred between environments using the 
native cross-VM token bridge, instantly in a single atomic transaction

Flow EVM introduces a unique and powerful EVM+ builder paradigm unlike any other blockchain. EVM apps can resolve 
UX and onboarding obstacles by using Flow's mainstream ready features. For their part, Flow apps can integrate well 
known EVM products and services into their applications and UX. NFT projects such as NBA Topshot can travel freely into 
the EVM ecosystem. Experimentation and prototyping cross-chain use-cases has never been easier. 

## Best-in-class UX

EVM applications can integrate Flow UX with account linking to onboard mainstream users with a seamless web2 login experience

## Scalability and low gas fees

## MEV resilience


Ethereum [JSON-RPC compliant API](https://ethereum.org/en/developers/docs/apis/json-rpc/) endpoint for EVM clients and a
cross-VM token bridge allowing applications to seamlessly bridge fungible and non-fungible tokens between environments.
Flow EVM has its own dedicated storage state, 
which is separate from the Cadence environment. This storage state is authenticated and verified by the Flow network. 
The separation of storage is necessary to prevent direct memory access and maintain advanced safety properties of 
Cadence.

Native token from Flow


However, a high degree of composability between Flow EVM and Cadence environments has been facilitated through several 
means. 

- Cadence calls to the Flow EVM: Cadence can send and receive data by making calls into the Flow EVM environment.
- “Flow EVM” extended precompiles: a set of smart contracts available on Flow EVM that can be used by other EVM smart 
contracts to access and interact with the Cadence world.
- Cadence-Owned-Account (COA): COA is a natively supported EVM smart contract wallet type that allows a Cadence resource 
- to own and control an EVM address. This native wallet provides the primitives needed to bridge or control assets 
- across Flow EVM and Cadence.




## FAQs

The genesis state of the "Flow EVM" is empty, thus there are no
accounts with non-zero balances.


with its own dedicated EVM chain-id for Testnet and Mainnet respectively

(reference implementation: Geth v1.13),
and Flow EVM will continue to integrate future software updates