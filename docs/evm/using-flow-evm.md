# Using Flow EVM

Flow EVM has two modes by which it can be used: natively with EVM tooling and/or other standard clients, or otherwise 
through Cadence. Flow enables the use of advanced features on EVM to augment applications by integrating EVM with Flow. 

## Connecting Flow Reference Wallet

[Flow Reference Wallet](https://frw.gitbook.io/doc/) is the Flow Foundation's open-source, self-custodial wallet 
implementation which supports both Flow and Flow EVM together in the same interface. Using Flow Reference Wallet you can 
view assets held in both Flow and Flow EVM environments. It also provides the ability transfer fungible and 
non-fungible between Flow EVM and Flow environments by leveraging the cross-VM token bridge.

Flow Reference Wallet is available for [Android](https://play.google.com/store/apps/details?id=io.outblock.lilico&hl=en_US&gl=US), 
[iOS](https://apps.apple.com/ca/app/flow-core/id1644169603) and as a [Chrome-extension](https://chrome.google.com/webstore/detail/flow-core/hpclkefagolihohboafpheddmmgdffjm). 
All versions provide support for both Flow and Flow EVM environments by default. 

Complete the wallet setup once downloaded to get connected to Flow. Using your newly created Flow account you can now 
setup an EVM account using the following steps: 

1. This [transaction](https://github.com/onflow/flow-evm-bridge/blob/proof-of-concept/cadence/transactions/evm/create_account.cdc) will create a CadenceOwnedAccount which represents the Flow EVM address


## Connecting other Flow-compatible wallets

All Flow-compatible wallets support the running of Flow EVM transactions, when used through Cadence, without any changes. 
The main limitation of wallets other than Flow Reference Wallet are that they cannot show state of assets held in both
environments within the same UI. They will be limited to Flow assets only.

## Connecting an EVM-compatible wallet (eg. Metamask)

Flow EVM supports Metamask and other EVM-compatible wallets out-of-the-box. Flow EVM can be added as a custom network 
to any EVm-compatible wallet

Note: while EVM-native usage is supported and remains unchanged, users cannot access Flow features using this mode
because of lack of Flow-native support on Metamask or other EVM wallets.

