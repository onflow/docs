# Using Flow EVM

Flow EVM has two modes by which it can be used: natively with EVM tooling and/or other standard clients, or otherwise 
through Cadence. Flow enables the use of advanced features on EVM to augment applications by integrating EVM with Flow
using Cadence. Developers who wish to use Flow features will need to implement scripts or transactions (but not 
contracts) to integrate Flow features with Flow EVM. 

## Connecting Flow Reference Wallet

[Flow Reference Wallet](https://frw.gitbook.io/doc/) is the Flow Foundation's open-source, self-custodial wallet 
implementation which supports both Flow and Flow EVM together in the same interface. Using Flow Reference Wallet you can 
view assets held in both Flow and Flow EVM environments. It also uniquely provides the ability transfer fungible and 
non-fungible between Flow EVM and Flow environments by leveraging the cross-VM token bridge.

Flow Reference Wallet is available for [Android](https://play.google.com/store/apps/details?id=io.outblock.lilico&hl=en_US&gl=US), 
[iOS](https://apps.apple.com/ca/app/flow-core/id1644169603) and as a [Chrome-extension](https://chrome.google.com/webstore/detail/flow-core/hpclkefagolihohboafpheddmmgdffjm). 
All versions provide support for both Flow and Flow EVM environments by default. 

Complete the wallet setup once downloaded to get connected to Flow. Using your newly created Flow account you can now 
setup an EVM account using the following steps: 

### 1. Create a new [CadenceOwnedAccount](https://github.com/onflow/flow-evm-bridge/blob/proof-of-concept/cadence/transactions/evm/create_account.cdc) which represents a Flow EVM address
### 2. Fund the new EVM address some FLOW with this simple transaction
```
// Example of balance query 
import EVM from <ServiceAddress>

access(all)
fun main(bytes: [UInt8; 20]) {
let addr = EVM.EVMAddress(bytes: bytes)
let bal = addr.balance()
}
```

### 3. Check balance of the EVM address
```
// Example of balance query 
import EVM from <ServiceAddress>

access(all)
fun main(bytes: [UInt8; 20]) {
let addr = EVM.EVMAddress(bytes: bytes)
let bal = addr.balance()
}
```
## Connecting other Flow-compatible wallets

All Flow-compatible wallets support the running of Flow EVM transactions, when used through Cadence, without any changes. 
The main limitation of wallets other than Flow Reference Wallet are that they cannot show state of assets held in both
environments within the same UI as they will be limited to Flow assets only. Cross-VM bridging is possible but not 
natively supported in wallets other tha Flow Reference Wallet.

## Connecting an EVM-compatible wallet (eg. Metamask)

Flow EVM supports Metamask and other EVM-compatible wallets out-of-the-box. Flow EVM can be added as a custom network 
to any EVM-compatible wallet.

1. Open the EVM-compatible wallet and locate the Network configuration
2. Click to add a network
3. Save network settings
4. Switch to Flow EVM network

| Name            |           Value           |
|-----------------|:-------------------------:|
| Network Name    |     Flow EVM Mainnet      |
| Description     |    Flow public mainnet    |
| RPC Endpoint    |   https://evm.flow.com    |
| Chain ID        |           9999            |
| Currency symbol |           FLOW            |
| Block Explorer  | https://flowetherscan.org |

You should now be able to connect to Flow EVM by selecting it from the network list. 

Note: while EVM-compatible wallet usage is supported and remains unchanged, users cannot access Flow features using this
mode due to their lack of Flow-native support. Cross-VM bridging is also not supported for the same reason. When using 
this mode only Flow EVM tokens for the address represented by the wallet will be available to view.