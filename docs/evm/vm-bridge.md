---
title: Cross-VM Bridge
sidebar_label: Cross-VM Bridge
sidebar_position: 7
---

# Cross-VM Bridge

Flow provides the [Cross-VM Bridge](https://www.github.com/onflow/flow-evm-bridge) which enables the movement of
fungible and non-fungible tokens between Cadence & EVM. The Cross-VM Bridge is a contract-based, trustless protocol
enabling the automated and atomic bridging of tokens from Cadence into EVM with their corresponding ERC-20 and ERC-721
token types. In the opposite direction, it supports bridging of arbitrary ERC-20 and ERC-721 tokens from EVM to Cadence
as their corresponding FT or NFT token types.

The Cross-VM Bridge internalizes the capabilities to deploy new token contracts in either VM state as needed, resolving
access to, and maintaining links between associated contracts. It additionally automates account and contract calls to
enforce source VM asset burn or lock, and target VM token mint or unlock.

Developers wishing to use the Cross-VM Bridge will be required to use a Cadence transaction as cross-VM bridging
functionality is currently not available natively in EVM. By extension, this means that the EVM account bridging from
EVM to Cadence must be a [`CadenceOwnedAccount` (COA)](../evm/cadence/interacting-with-coa.md) as this is the only EVM
account type that can be controlled from the Cadence runtime.

This [FLIP](https://github.com/onflow/flips/pull/233) outlines the architecture and implementation of the VM bridge.
This document will focus on how to use the Cross-VM Bridge and considerations for fungible and non-fungible token
projects deploying to either Cadence or EVM.

## Deployments

The core bridge contracts can be found at the following addresses:

|Contracts|Testnet|Mainnet|
|---|---|---|
|All Cadence Bridge contracts|[`0xdfc20aee650fcbdf`](https://contractbrowser.com/account/0xdfc20aee650fcbdf/contracts)|[`0x1e4aa0b87d10b141`](https://contractbrowser.com/account/0x1e4aa0b87d10b141/contracts)|
|[`FlowEVMBridgeFactory.sol`](./solidity/src/FlowBridgeFactory.sol)|[`0xf8146b4aef631853f0eb98dbe28706d029e52c52`](https://evm-testnet.flowscan.io/address/0xF8146B4aEF631853F0eB98DBE28706d029e52c52)|[`0x1c6dea788ee774cf15bcd3d7a07ede892ef0be40`](https://evm.flowscan.io/address/0x1C6dEa788Ee774CF15bCd3d7A07ede892ef0bE40)|
|[`FlowEVMBridgeDeploymentRegistry.sol`](./solidity/src/FlowEVMBridgeDeploymentRegistry.sol)|[`0x8781d15904d7e161f421400571dea24cc0db6938`](https://evm-testnet.flowscan.io/address/0x8781d15904d7e161f421400571dea24cc0db6938)|[`0x8fdec2058535a2cb25c2f8cec65e8e0d0691f7b0`](https://evm.flowscan.io/address/0x8FDEc2058535A2Cb25C2f8ceC65e8e0D0691f7B0)|
|[`FlowEVMBridgedERC20Deployer.sol`](./solidity/src/FlowEVMBridgedERC20Deployer.sol)|[`0x4d45CaD104A71D19991DE3489ddC5C7B284cf263`](https://evm-testnet.flowscan.io/address/0x4d45CaD104A71D19991DE3489ddC5C7B284cf263)|[`0x49631Eac7e67c417D036a4d114AD9359c93491e7`](https://evm.flowscan.io/address/0x49631Eac7e67c417D036a4d114AD9359c93491e7)|
|[`FlowEVMBridgedERC721Deployer.sol`](./solidity/src/FlowEVMBridgedERC721Deployer.sol)|[`0x1B852d242F9c4C4E9Bb91115276f659D1D1f7c56`](https://evm-testnet.flowscan.io/address/0x1B852d242F9c4C4E9Bb91115276f659D1D1f7c56)|[`0xe7c2B80a9de81340AE375B3a53940E9aeEAd79Df`](https://evm.flowscan.io/address/0xe7c2B80a9de81340AE375B3a53940E9aeEAd79Df)|

And below are the bridge escrow's EVM addresses. These addresses are COAs and are stored stored in the same Flow account
as you'll find the Cadence contracts (see above).

|Network|Address|
|---|---|
|Testnet|[`0x0000000000000000000000023f946ffbc8829bfd`](https://evm-testnet.flowscan.io/address/0x0000000000000000000000023f946FFbc8829BFD)|
|Mainnet|[`0x00000000000000000000000249250a5c27ecab3b`](https://evm.flowscan.io/address/0x00000000000000000000000249250a5C27Ecab3B)|

## Interacting With the Bridge


:::info

All bridging activity in either direction is orchestrated via Cadence on (COA) resources. This means that all bridging
activity must be initiated via a Cadence transaction, not an EVM transaction regardless of the directionality of the
bridge request. For more information on the interplay between Cadence and EVM, see [How EVM on Flow
Works](../evm/how-it-works.md)

:::

### Overview

The Flow EVM bridge allows both fungible and non-fungible tokens to move atomically between Cadence and EVM. In the
context of EVM, fungible tokens are defined as ERC20 tokens, and non-fungible tokens as ERC721 tokens. In Cadence,
fungible tokens are defined by contracts implementing FungibleToken and non-fungible tokens the NonFungibleToken
standard contract interfaces.

Like all operations on Flow, there are native fees associated with both computation and storage. To prevent spam and
sustain the bridge account's storage consumption, fees are charged for both onboarding assets and bridging assets. In
the case where storage consumption is expected, fees are charges based on the storage consumed at the current network

### Onboarding

Since a contract must define the asset in the target VM, an asset must be "onboarded" to the bridge before requests can
be fulfilled. Moving from Cadence to EVM, onboarding can occur on the fly, deploying a template contract in the same
transaction as the asset is bridged to EVM if the transaction so specifies. Moving from EVM to Cadence, however,
requires that onboarding occur in a separate transaction due to the fact that a Cadence contract is initialized at the
end of a transaction and isn't available in the runtime until after the transaction has executed.

Below are transactions relevant to onboarding assets:

<details>
<summary>onboard_by_type.cdc</summary>

```cadence title="onboard_by_type.cdc"
// source: https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/onboarding/onboard_by_type.cdc

import "FungibleToken"
import "FlowToken"

import "ScopedFTProviders"

import "EVM"

import "FlowEVMBridge"
import "FlowEVMBridgeConfig"

/// This transaction onboards the asset type to the bridge, configuring the bridge to move assets between environments
/// NOTE: This must be done before bridging a Cadence-native asset to EVM
///
/// @param type: The Cadence type of the bridgeable asset to onboard to the bridge
///
transaction(type: Type) {

    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    
    prepare(signer: auth(CopyValue, BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {

        /* --- Configure a ScopedFTProvider --- */
        //
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid Provider Capability found in storage.")
        let providerFilter = ScopedFTProviders.AllowanceFilter(FlowEVMBridgeConfig.onboardFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    execute {
        // Onboard the asset Type
        FlowEVMBridge.onboardByType(
            type,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        destroy self.scopedProvider
    }

    post {
        FlowEVMBridge.typeRequiresOnboarding(type) == false:
            "Asset ".concat(type.identifier).concat(" was not onboarded to the bridge.")
    }
}
```
</details>

<details>
<summary>onboard_by_evm_address.cdc</summary>

```
// source: https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/onboarding/onboard_by_evm_address.cdc

import "FungibleToken"
import "FlowToken"

import "ScopedFTProviders"

import "EVM"

import "FlowEVMBridge"
import "FlowEVMBridgeConfig"

/// This transaction onboards the NFT type to the bridge, configuring the bridge to move NFTs between environments
/// NOTE: This must be done before bridging a Cadence-native NFT to EVM
///
/// @param contractAddressHex: The EVM address of the contract defining the bridgeable asset to be onboarded
///
transaction(contractAddressHex: String) {

    let contractAddress: EVM.EVMAddress
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    
    prepare(signer: auth(CopyValue, BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {
        /* --- Construct EVMAddress from hex string (no leading `"0x"`) --- */
        //
        self.contractAddress = EVM.addressFromString(contractAddressHex)

        /* --- Configure a ScopedFTProvider --- */
        //
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid Provider Capability found in storage.")
        let providerFilter = ScopedFTProviders.AllowanceFilter(FlowEVMBridgeConfig.onboardFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    execute {
        // Onboard the EVM contract
        FlowEVMBridge.onboardByEVMAddress(
            self.contractAddress,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        destroy self.scopedProvider
    }
}
```
</details>

### Bridging

Once an asset has been onboarded, either by its Cadence type or EVM contract address, it can be bridged in either
direction referred to by its Cadence type. For Cadence-native assets, this is simply its native type. For EVM-native
assets, this is in most cases a templated Cadence contract deployed to the bridge account, the name of which is derived
from the EVM contract address. For instance, an ERC721 contract at address `0x1234` would be onboarded to the bridge as
`EVMVMBridgedNFT_0x1234`, making its type identifier `A.<BRIDGE_ADDRESS>.EVMVMBridgedNFT_0x1234.NFT`.

However, the derivation of these identifiers can be abstracted within transactions. For example, calling applications
can provide the defining contract address and name of the bridged asset (see
[`bridge_nft_to_evm.cdc`](https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/nft/bridge_nft_to_evm.cdc)).
Alternatively, the defining EVM contract could be provided, etc - this flexibility is thanks to Cadence's scripted
transactions.

#### NFTs

Any Cadence NFTs bridging to EVM are escrowed in the bridge account and either minted in a bridge-deployed ERC721
contract or transferred from escrow to the calling COA in EVM. On the return trip, NFTs are escrowed in EVM - owned by
the bridge's COA - and either unlocked from escrow if locked or minted from a bridge-owned NFT contract.

Below are transactions relevant to bridging NFTs:

<details>

<summary>bridge_nft_to_evm.cdc</summary>

```cadence title="bridge_nft_to_evm.cdc"
// source: https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/nft/bridge_nft_to_evm.cdc

import "FungibleToken"
import "NonFungibleToken"
import "ViewResolver"
import "MetadataViews"
import "FlowToken"

import "ScopedFTProviders"

import "EVM"

import "FlowEVMBridge"
import "FlowEVMBridgeConfig"
import "FlowEVMBridgeUtils"

/// Bridges an NFT from the signer's collection in Cadence to the signer's COA in FlowEVM
///
/// NOTE: This transaction also onboards the NFT to the bridge if necessary which may incur additional fees
///     than bridging an asset that has already been onboarded.
///
/// @param nftIdentifier: The Cadence type identifier of the NFT to bridge - e.g. nft.getType().identifier
/// @param id: The Cadence NFT.id of the NFT to bridge to EVM
///
transaction(nftIdentifier: String, id: UInt64) {
    
    let nft: @{NonFungibleToken.NFT}
    let coa: auth(EVM.Bridge) &EVM.CadenceOwnedAccount
    let requiresOnboarding: Bool
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    
    prepare(signer: auth(CopyValue, BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {
        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow COA from provided gateway address")
        
        /* --- Construct the NFT type --- */
        //
        // Construct the NFT type from the provided identifier
        let nftType = CompositeType(nftIdentifier)
            ?? panic("Could not construct NFT type from identifier: ".concat(nftIdentifier))
        // Parse the NFT identifier into its components
        let nftContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: nftType)
            ?? panic("Could not get contract address from identifier: ".concat(nftIdentifier))
        let nftContractName = FlowEVMBridgeUtils.getContractName(fromType: nftType)
            ?? panic("Could not get contract name from identifier: ".concat(nftIdentifier))

        /* --- Retrieve the NFT --- */
        //
        // Borrow a reference to the NFT collection, configuring if necessary
        let viewResolver = getAccount(nftContractAddress).contracts.borrow<&{ViewResolver}>(name: nftContractName)
            ?? panic("Could not borrow ViewResolver from NFT contract")
        let collectionData = viewResolver.resolveContractView(
                resourceType: nftType,
                viewType: Type<MetadataViews.NFTCollectionData>()
            ) as! MetadataViews.NFTCollectionData? ?? panic("Could not resolve NFTCollectionData view")
        let collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(
                from: collectionData.storagePath
            ) ?? panic("Could not access signer's NFT Collection")

        // Withdraw the requested NFT & calculate the approximate bridge fee based on NFT storage usage
        let currentStorageUsage = signer.storage.used
        self.nft <- collection.withdraw(withdrawID: id)
        let withdrawnStorageUsage = signer.storage.used
        var approxFee = FlowEVMBridgeUtils.calculateBridgeFee(
                bytes: currentStorageUsage - withdrawnStorageUsage
            ) * 1.10
        // Determine if the NFT requires onboarding - this impacts the fee required
        self.requiresOnboarding = FlowEVMBridge.typeRequiresOnboarding(self.nft.getType())
            ?? panic("Bridge does not support this asset type")
        if self.requiresOnboarding {
            approxFee = approxFee + FlowEVMBridgeConfig.onboardFee
        }

        /* --- Configure a ScopedFTProvider --- */
        //
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid Provider Capability found in storage.")
        let providerFilter = ScopedFTProviders.AllowanceFilter(approxFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    pre {
        self.nft.getType().identifier == nftIdentifier:
            "Attempting to send invalid nft type - requested: ".concat(nftIdentifier)
            .concat(", sending: ").concat(self.nft.getType().identifier)
    }

    execute {
        if self.requiresOnboarding {
            // Onboard the NFT to the bridge
            FlowEVMBridge.onboardByType(
                self.nft.getType(),
                feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
            )
        }
        // Execute the bridge
        self.coa.depositNFT(
            nft: <-self.nft,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        // Destroy the ScopedFTProvider
        destroy self.scopedProvider
    }
}
```
</details>

<details>

<summary>bridge_nft_from_evm.cdc</summary>

```cadence title="bridge_nft_from_evm.cdc"
// source: https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/nft/bridge_nft_from_evm.cdc

import "FungibleToken"
import "NonFungibleToken"
import "ViewResolver"
import "MetadataViews"
import "FlowToken"

import "ScopedFTProviders"

import "EVM"

import "FlowEVMBridge"
import "FlowEVMBridgeConfig"
import "FlowEVMBridgeUtils"

/// This transaction bridges an NFT from EVM to Cadence assuming it has already been onboarded to the FlowEVMBridge
/// NOTE: The ERC721 must have first been onboarded to the bridge. This can be checked via the method
///     FlowEVMBridge.evmAddressRequiresOnboarding(address: self.evmContractAddress)
///
/// @param nftIdentifier: The Cadence type identifier of the NFT to bridge - e.g. nft.getType().identifier
/// @param id: The ERC721 id of the NFT to bridge to Cadence from EVM
///
transaction(nftIdentifier: String, id: UInt256) {

    let nftType: Type
    let collection: &{NonFungibleToken.Collection}
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    let coa: auth(EVM.Bridge) &EVM.CadenceOwnedAccount
    
    prepare(signer: auth(BorrowValue, CopyValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow COA from provided gateway address")

        /* --- Construct the NFT type --- */
        //
        // Construct the NFT type from the provided identifier
        self.nftType = CompositeType(nftIdentifier)
            ?? panic("Could not construct NFT type from identifier: ".concat(nftIdentifier))
        // Parse the NFT identifier into its components
        let nftContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: self.nftType)
            ?? panic("Could not get contract address from identifier: ".concat(nftIdentifier))
        let nftContractName = FlowEVMBridgeUtils.getContractName(fromType: self.nftType)
            ?? panic("Could not get contract name from identifier: ".concat(nftIdentifier))

        /* --- Reference the signer's NFT Collection --- */
        //
        // Borrow a reference to the NFT collection, configuring if necessary
        let viewResolver = getAccount(nftContractAddress).contracts.borrow<&{ViewResolver}>(name: nftContractName)
            ?? panic("Could not borrow ViewResolver from NFT contract")
        let collectionData = viewResolver.resolveContractView(
                resourceType: self.nftType,
                viewType: Type<MetadataViews.NFTCollectionData>()
            ) as! MetadataViews.NFTCollectionData? ?? panic("Could not resolve NFTCollectionData view")
        if signer.storage.borrow<&{NonFungibleToken.Collection}>(from: collectionData.storagePath) == nil {
            signer.storage.save(<-collectionData.createEmptyCollection(), to: collectionData.storagePath)
            signer.capabilities.unpublish(collectionData.publicPath)
            let collectionCap = signer.capabilities.storage.issue<&{NonFungibleToken.Collection}>(collectionData.storagePath)
            signer.capabilities.publish(collectionCap, at: collectionData.publicPath)
        }
        self.collection = signer.storage.borrow<&{NonFungibleToken.Collection}>(from: collectionData.storagePath)
            ?? panic("Could not borrow collection from storage path")

        /* --- Configure a ScopedFTProvider --- */
        //
        // Calculate the bridge fee - bridging from EVM consumes no storage, so flat fee
        let approxFee = FlowEVMBridgeUtils.calculateBridgeFee(bytes: 0)
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid Provider Capability found in storage.")
        let providerFilter = ScopedFTProviders.AllowanceFilter(approxFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    execute {
        // Execute the bridge
        let nft: @{NonFungibleToken.NFT} <- self.coa.withdrawNFT(
            type: self.nftType,
            id: id,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        // Ensure the bridged nft is the correct type
        assert(
            nft.getType() == self.nftType,
            message: "Bridged nft type mismatch - requeswted: ".concat(self.nftType.identifier)
                .concat(", received: ").concat(nft.getType().identifier)
        )
        // Deposit the bridged NFT into the signer's collection
        self.collection.deposit(token: <-nft)
        // Destroy the ScopedFTProvider
        destroy self.scopedProvider
    }
}
```
</details>

#### Fungible Tokens

Any Cadence fungible tokens bridging to EVM are escrowed in the bridge account only if they are Cadence-native. If the
bridge defines the tokens, they are burned. On the return trip the pattern is similar, with the bridge burning
bridge-defined tokens or escrowing them if they are EVM-native. In all cases, if the bridge has authority to mint on one
side, it must escrow on the other as the native VM contract is owned by an external party.

With fungible tokens in particular, there may be some cases where the Cadence contract is not deployed to the bridge
account, but the bridge still follows a mint/burn pattern in Cadence. These cases are handled via
[`TokenHandler`](./cadence/contracts/bridge/interfaces/FlowEVMBridgeHandlerInterfaces.cdc) implementations. Also know
that moving $FLOW to EVM is built into the `EVMAddress` object so any requests bridging $FLOW to EVM will simply
leverage this interface; however, moving $FLOW from EVM to Cadence must be done through the COA resource.

Below are transactions relevant to bridging fungible tokens:

<details>

<summary>bridge_tokens_to_evm.cdc</summary>

```cadence title="bridge_tokens_to_evm.cdc"
// source: https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/tokens/bridge_tokens_to_evm.cdc

import "FungibleToken"
import "ViewResolver"
import "FungibleTokenMetadataViews"
import "FlowToken"

import "ScopedFTProviders"

import "EVM"

import "FlowEVMBridge"
import "FlowEVMBridgeConfig"
import "FlowEVMBridgeUtils"

/// Bridges a Vault from the signer's storage to the signer's COA in EVM.Account.
///
/// NOTE: This transaction also onboards the Vault to the bridge if necessary which may incur additional fees
///     than bridging an asset that has already been onboarded.
///
/// @param vaultIdentifier: The Cadence type identifier of the FungibleToken Vault to bridge
///     - e.g. vault.getType().identifier
/// @param amount: The amount of tokens to bridge from EVM
///
transaction(vaultIdentifier: String, amount: UFix64) {

    let sentVault: @{FungibleToken.Vault}
    let coa: auth(EVM.Bridge) &EVM.CadenceOwnedAccount
    let requiresOnboarding: Bool
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider

    prepare(signer: auth(CopyValue, BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {
        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow COA from provided gateway address")

        /* --- Construct the Vault type --- */
        //
        // Construct the Vault type from the provided identifier
        let vaultType = CompositeType(vaultIdentifier)
            ?? panic("Could not construct Vault type from identifier: ".concat(vaultIdentifier))
        // Parse the Vault identifier into its components
        let tokenContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: vaultType)
            ?? panic("Could not get contract address from identifier: ".concat(vaultIdentifier))
        let tokenContractName = FlowEVMBridgeUtils.getContractName(fromType: vaultType)
            ?? panic("Could not get contract name from identifier: ".concat(vaultIdentifier))

        /* --- Retrieve the funds --- */
        //
        // Borrow a reference to the FungibleToken Vault
        let viewResolver = getAccount(tokenContractAddress).contracts.borrow<&{ViewResolver}>(name: tokenContractName)
            ?? panic("Could not borrow ViewResolver from FungibleToken contract")
        let vaultData = viewResolver.resolveContractView(
                resourceType: vaultType,
                viewType: Type<FungibleTokenMetadataViews.FTVaultData>()
            ) as! FungibleTokenMetadataViews.FTVaultData? ?? panic("Could not resolve FTVaultData view")
        let vault = signer.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(
                from: vaultData.storagePath
            ) ?? panic("Could not access signer's FungibleToken Vault")

        // Withdraw the requested balance & calculate the approximate bridge fee based on storage usage
        let currentStorageUsage = signer.storage.used
        self.sentVault <- vault.withdraw(amount: amount)
        let withdrawnStorageUsage = signer.storage.used
        // Approximate the bridge fee based on the difference in storage usage with some buffer
        var approxFee = FlowEVMBridgeUtils.calculateBridgeFee(
                bytes: currentStorageUsage - withdrawnStorageUsage
            ) * 1.10
        // Determine if the Vault requires onboarding - this impacts the fee required
        self.requiresOnboarding = FlowEVMBridge.typeRequiresOnboarding(self.sentVault.getType())
            ?? panic("Bridge does not support this asset type")
        if self.requiresOnboarding {
            approxFee = approxFee + FlowEVMBridgeConfig.onboardFee
        }

        /* --- Configure a ScopedFTProvider --- */
        //
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid Provider Capability found in storage.")
        let providerFilter = ScopedFTProviders.AllowanceFilter(approxFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    pre {
        self.sentVault.getType().identifier == vaultIdentifier:
            "Attempting to send invalid vault type - requested: ".concat(vaultIdentifier)
            .concat(", sending: ").concat(self.sentVault.getType().identifier)
    }

    execute {
        if self.requiresOnboarding {
            // Onboard the Vault to the bridge
            FlowEVMBridge.onboardByType(
                self.sentVault.getType(),
                feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
            )
        }
        // Execute the bridge
        self.coa.depositTokens(
            vault: <-self.sentVault,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        // Destroy the ScopedFTProvider
        destroy self.scopedProvider
    }
}
```
</details>

<details>

<summary>bridge_tokens_from_evm.cdc</summary>

```cadence title="bridge_tokens_from_evm.cdc"
// source: https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/tokens/bridge_tokens_from_evm.cdc

import "FungibleToken"
import "FungibleTokenMetadataViews"
import "ViewResolver"
import "MetadataViews"
import "FlowToken"

import "ScopedFTProviders"

import "EVM"

import "FlowEVMBridge"
import "FlowEVMBridgeConfig"
import "FlowEVMBridgeUtils"

/// This transaction bridges fungible tokens from EVM to Cadence assuming it has already been onboarded to the
/// FlowEVMBridge.
///
/// NOTE: The ERC20 must have first been onboarded to the bridge. This can be checked via the method
///     FlowEVMBridge.evmAddressRequiresOnboarding(address: self.evmContractAddress)
///
/// @param vaultIdentifier: The Cadence type identifier of the FungibleToken Vault to bridge
///     - e.g. vault.getType().identifier
/// @param amount: The amount of tokens to bridge from EVM
///
transaction(vaultIdentifier: String, amount: UInt256) {

    let vaultType: Type
    let receiver: &{FungibleToken.Vault}
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    let coa: auth(EVM.Bridge) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue, CopyValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow COA from provided gateway address")

        /* --- Construct the Vault type --- */
        //
        // Construct the Vault type from the provided identifier
        self.vaultType = CompositeType(vaultIdentifier)
            ?? panic("Could not construct Vault type from identifier: ".concat(vaultIdentifier))
        // Parse the Vault identifier into its components
        let tokenContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: self.vaultType)
            ?? panic("Could not get contract address from identifier: ".concat(vaultIdentifier))
        let tokenContractName = FlowEVMBridgeUtils.getContractName(fromType: self.vaultType)
            ?? panic("Could not get contract name from identifier: ".concat(vaultIdentifier))

        /* --- Reference the signer's Vault --- */
        //
        // Borrow a reference to the FungibleToken Vault, configuring if necessary
        let viewResolver = getAccount(tokenContractAddress).contracts.borrow<&{ViewResolver}>(name: tokenContractName)
            ?? panic("Could not borrow ViewResolver from FungibleToken contract")
        let vaultData = viewResolver.resolveContractView(
                resourceType: self.vaultType,
                viewType: Type<FungibleTokenMetadataViews.FTVaultData>()
            ) as! FungibleTokenMetadataViews.FTVaultData? ?? panic("Could not resolve FTVaultData view")
        // If the vault does not exist, create it and publish according to the contract's defined configuration
        if signer.storage.borrow<&{FungibleToken.Vault}>(from: vaultData.storagePath) == nil {
            signer.storage.save(<-vaultData.createEmptyVault(), to: vaultData.storagePath)

            signer.capabilities.unpublish(vaultData.receiverPath)
            signer.capabilities.unpublish(vaultData.metadataPath)

            let receiverCap = signer.capabilities.storage.issue<&{FungibleToken.Vault}>(vaultData.storagePath)
            let metadataCap = signer.capabilities.storage.issue<&{FungibleToken.Vault}>(vaultData.storagePath)

            signer.capabilities.publish(receiverCap, at: vaultData.receiverPath)
            signer.capabilities.publish(metadataCap, at: vaultData.metadataPath)
        }
        self.receiver = signer.storage.borrow<&{FungibleToken.Vault}>(from: vaultData.storagePath)
            ?? panic("Could not borrow Vault from storage path")

        /* --- Configure a ScopedFTProvider --- */
        //
        // Calculate the bridge fee - bridging from EVM consumes no storage, so flat fee
        let approxFee = FlowEVMBridgeUtils.calculateBridgeFee(bytes: 0)
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid Provider Capability found in storage.")
        let providerFilter = ScopedFTProviders.AllowanceFilter(approxFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    execute {
        // Execute the bridge request
        let vault: @{FungibleToken.Vault} <- self.coa.withdrawTokens(
            type: self.vaultType,
            amount: amount,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        // Ensure the bridged vault is the correct type
        assert(vault.getType() == self.vaultType, message: "Bridged vault type mismatch")
        // Deposit the bridged token into the signer's vault
        self.receiver.deposit(from: <-vault)
        // Destroy the ScopedFTProvider
        destroy self.scopedProvider
    }
}
```
</details>

## Prep Your Assets for Bridging

### Context

To maximize utility to the ecosystem, this bridge is permissionless and open to any fungible or non-fungible token as
defined by the respective Cadence standards and limited to ERC20 and ERC721 Solidity standards. Ultimately, a project
does not have to do anything for users to be able to bridge their assets between VMs. However, there are some
considerations developers may take to enhance the representation of their assets in non-native VMs. These largely relate
to asset metadata and ensuring that bridging does not compromise critical user assumptions about asset ownership.

### EVMBridgedMetadata

Proposed in [@onflow/flow-nft/pull/203](https://github.com/onflow/flow-nft/pull/203), the `EVMBridgedMetadata` view
presents a mechanism to both represent metadata from bridged EVM assets as well as enable Cadence-native projects to
specify the representation of their assets in EVM. Implementing this view is not required for assets to be bridged, but
the bridge does default to it when available as a way to provide projects greater control over their EVM asset
definitions within the scope of ERC20 and ERC721 standards.

The interface for this view is as follows:

```cadence
access(all) struct URI: MetadataViews.File {
    /// The base URI prefix, if any. Not needed for all URIs, but helpful
    /// for some use cases For example, updating a whole NFT collection's
    /// image host easily
    access(all) let baseURI: String?
    /// The URI string value
    /// NOTE: this is set on init as a concatenation of the baseURI and the
    /// value if baseURI != nil
    access(self) let value: String

    access(all) view fun uri(): String
        
}

access(all) struct EVMBridgedMetadata {
    access(all) let name: String
    access(all) let symbol: String

    access(all) let uri: {MetadataViews.File}
}
```

This uri value could be a pointer to some offchain metadata if you expect your metadata to be static. Or you could
couple the `uri()` method with the utility contract below to serialize the onchain metadata on the fly.

### SerializeMetadata

The key consideration with respect to metadata is the distinct metadata storage patterns between ecosystem. It's
critical for NFT utility that the metadata be bridged in addition to the representation of the NFTs ownership. However,
it's commonplace for Cadence NFTs to store metadata onchain while EVM NFTs often store an onchain pointer to metadata
stored offchain. In order for Cadence NFTs to be properly represented in EVM platforms, the metadata must be bridged in
a format expected by those platforms and be done in a manner that also preserves the atomicity of bridge requests. The
path forward on this was decided to be a commitment of serialized Cadence NFT metadata into formats popular in the EVM
ecosystem.

For assets that do not implement `EVMBridgedMetadata`, the bridge will attempt to serialize the metadata of the asset as
a JSON data URL string. This is done via the [`SerializeMetadata`
contract](https://github.com/onflow/flow-evm-bridge/blob/main/cadence/contracts/utils/SerializeMetadata.cdc) which serializes metadata values into a JSON blob compatible
with the OpenSea metadata standard. The serialized metadata is then committed as the ERC721 `tokenURI` upon bridging
Cadence-native NFTs to EVM. Since Cadence NFTs can easily update onchain metadata either by field or by the ownership of
sub-NFTs, this serialization pattern enables token URI updates on subsequent bridge requests.

### Opting Out

It's also recognized that the logic of some use cases may actually be compromised by the act of bridging, particularly
in such a unique runtime environment. These would be cases that do not maintain ownership assumptions implicit to
ecosystem standards. For instance, an ERC721 implementation may reclaim a user's assets after a month of inactivity time
period. In such a case, bridging that ERC721 to Cadence would decouple the representation of ownership of the bridged
NFT from the actual ownership in the definining ERC721 contract after the token had been reclaimed - there would be no
NFT in escrow for the bridge to transfer on fulfillment of the NFT back to EVM. In such cases, projects may choose to
opt-out of bridging, but **importantly must do so before the asset has been onboarded to the bridge**.

For Solidity contracts, opting out is as simple as extending the [`BridgePermissions.sol` abstract
contract](./solidity/src/interfaces/BridgePermissions.sol) which defaults `allowsBridging()` to false. The bridge explicitly checks
for the implementation of `IBridgePermissions` and the value of `allowsBridging()` to validate that the contract has not
opted out of bridging.

Similarly, Cadence contracts can implement the [`IBridgePermissions.cdc` contract
interface](https://github.com/onflow/flow-evm-bridge/blob/main/cadence/contracts/bridge/interfaces/IBridgePermissions.cdc). This contract has a single method
`allowsBridging()` with a default implementation returning `false`. Again, the bridge explicitly checks for the
implementation of `IBridgePermissions` and the value of `allowsBridging()` to validate that the contract has not opted
out of bridging. Should you later choose to enable bridging, you can simply override the default implementation and
return true.

In both cases, `allowsBridging()` gates onboarding to the bridge. Once onboarded - **a permissionless operation anyone can
execute** - the value of `allowsBridging()` is irrelevant and assets can move between VMs permissionlessly.

## Under the Hood

For an in-depth look at the high-level architecture of the bridge, see [FLIP
#237](https://github.com/onflow/flips/blob/main/application/20231222-evm-vm-bridge.md)

### Additional Resources

For the current state of Flow EVM across various task paths, see the following resources:

- [Flow EVM Equivalence forum post](https://forum.flow.com/t/evm-equivalence-on-flow-proposal-and-path-forward/5478)
- [EVM Integration FLIP #223](https://github.com/onflow/flips/pull/225/files)
- [Gateway & JSON RPC FLIP #235](https://github.com/onflow/flips/pull/235)