---
title: Cross-VM Bridge
sidebar_label: Cross-VM Bridge
sidebar_position: 7
---

# Cross-VM Bridge

Flow provides the [Cross-VM Bridge](https://www.github.com/onflow/flow-evm-bridge) which enables the movement of
fungible and non-fungible tokens between Flow-Cadence & Flow-EVM. The Cross-VM Bridge is a contract-based protocol enabling the
automated and atomic bridging of tokens from Cadence into EVM with their corresponding ERC-20 and ERC-721 token types.
In the opposite direction, it supports bridging of arbitrary ERC-20 and ERC-721 tokens from EVM to Cadence as their
corresponding FT or NFT token types.

By default, when a user onboards a new token to the bridge, 
the bridge will deploy a standard token contract in the other VM that only the core bridge 
protocol contracts retain limited control over. This bridge-deployed contract handles basic
minting and metadata operations that are required for usage in the needed environment.
If a developer wants to define and connect the NFT contracts on both sides of the bridge,
they can have each contract point to each other to indicate that they are associated and then
register that association with the bridge so the token moves between VMs as either definition.

The Cross-VM Bridge internalizes the capabilities to deploy new token contracts in either VM state as needed, resolving
access to, and maintaining links between associated contracts. It additionally automates account and contract calls to
enforce source VM asset burn or lock, and target VM token mint or unlock.

Developers wishing to use the Cross-VM Bridge will be required to use a Cadence transaction. Cross-VM bridging
functionality is not currently available natively in Flow EVM. By extension, this means that the EVM account bridging
from EVM to Cadence must be a [`CadenceOwnedAccount` (COA)](./interacting-with-coa.md) as this is the only EVM account
type that can be controlled from the Cadence runtime.

This [FLIP-233](https://github.com/onflow/flips/pull/233) outlines the architecture and implementation of the VM bridge.
An additional [FLIP-318](https://github.com/onflow/flips/blob/main/application/20250131-cross-vm-nft-support.md) describes how developers can create custom associations
between NFTs they define and control in each VM.
This document will focus on how to use the Cross-VM Bridge and considerations for fungible and non-fungible token
projects deploying to either Cadence or EVM.

## Deployments

The core bridge contracts can be found at the following addresses:

| Contracts                             | Testnet                                                                                                                            | Mainnet                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| All Cadence Bridge contracts          | [`0xdfc20aee650fcbdf`](https://contractbrowser.com/account/0xdfc20aee650fcbdf/contracts)                                           | [`0x1e4aa0b87d10b141`](https://contractbrowser.com/account/0x1e4aa0b87d10b141/contracts)                                   |
| `FlowEVMBridgeFactory.sol`            | [`0xf8146b4aef631853f0eb98dbe28706d029e52c52`](https://evm-testnet.flowscan.io/address/0xF8146B4aEF631853F0eB98DBE28706d029e52c52) | [`0x1c6dea788ee774cf15bcd3d7a07ede892ef0be40`](https://evm.flowscan.io/address/0x1C6dEa788Ee774CF15bCd3d7A07ede892ef0bE40) |
| `FlowEVMBridgeDeploymentRegistry.sol` | [`0x8781d15904d7e161f421400571dea24cc0db6938`](https://evm-testnet.flowscan.io/address/0x8781d15904d7e161f421400571dea24cc0db6938) | [`0x8fdec2058535a2cb25c2f8cec65e8e0d0691f7b0`](https://evm.flowscan.io/address/0x8FDEc2058535A2Cb25C2f8ceC65e8e0D0691f7B0) |
| `FlowEVMBridgedERC20Deployer.sol`     | [`0x4d45CaD104A71D19991DE3489ddC5C7B284cf263`](https://evm-testnet.flowscan.io/address/0x4d45CaD104A71D19991DE3489ddC5C7B284cf263) | [`0x49631Eac7e67c417D036a4d114AD9359c93491e7`](https://evm.flowscan.io/address/0x49631Eac7e67c417D036a4d114AD9359c93491e7) |
| `FlowEVMBridgedERC721Deployer.sol`    | [`0x1B852d242F9c4C4E9Bb91115276f659D1D1f7c56`](https://evm-testnet.flowscan.io/address/0x1B852d242F9c4C4E9Bb91115276f659D1D1f7c56) | [`0xe7c2B80a9de81340AE375B3a53940E9aeEAd79Df`](https://evm.flowscan.io/address/0xe7c2B80a9de81340AE375B3a53940E9aeEAd79Df) |

And below are the bridge escrow's EVM addresses. These addresses are COAs and are stored stored in the same Flow account
as you'll find the Cadence contracts (see above).

| Network | Address                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Testnet | [`0x0000000000000000000000023f946ffbc8829bfd`](https://evm-testnet.flowscan.io/address/0x0000000000000000000000023f946FFbc8829BFD) |
| Mainnet | [`0x00000000000000000000000249250a5c27ecab3b`](https://evm.flowscan.io/address/0x00000000000000000000000249250a5C27Ecab3B)         |

## Interacting With the Bridge

:::info

All bridging activity in either direction is orchestrated via Cadence on COA EVM accounts. This means that all bridging
activity must be initiated via a Cadence transaction, not an EVM transaction regardless of the directionality of the
bridge request. For more information on the interplay between Cadence and EVM, see [How Flow EVM
Works](../../evm/how-it-works.md).

:::

## Overview

The Flow EVM bridge allows both fungible and non-fungible tokens to move atomically between Cadence and EVM. In the
context of EVM, fungible tokens are defined as ERC20 tokens, and non-fungible tokens as ERC721 tokens. In Cadence,
fungible tokens are defined by contracts implementing
[the `FungibleToken` interface](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc)
and non-fungible tokens implement
[the `NonFungibleToken` interface](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc).

You can find full guides for creating these projects [here](../../build/guides/nft.md).

Like all operations on Flow, there are native fees associated with both computation and storage. To prevent spam and
sustain the bridge account's storage consumption, fees are charged for both onboarding assets and bridging assets. In
the case where storage consumption is expected, fees are charged based on the storage consumed at the current network
storage rate.

## Onboarding Your token to the Bridge

For the purpose of this guide, we are assuming that the developer has already deployed
a token smart contract to their preferred VM (Flow-Cadence or Flow-EVM) and wants
to bridge it to the other (target) VM.

In order for the developer's token to be usable in the target VM, there must be a contract
that defines the asset and how it behaves in the target VM that also enables the bridge to
fulfill the asset from Cadence to EVM and vice versa. This contract is separate from the 
contract in the native VM, but they are "associated" with each other by the mechanisms of
the Flow VM bridge.

To create this association, the asset must be "onboarded" to the bridge
before bridging operations can be fulfilled. This can happen in two ways:

### Option 1: Automatic Onboarding

Any user registers the native token contract with the bridge and the bridge deploys
a basic templated version of the contract in the target VM. This basic contract is automatically
associated with the native contract and is used for bridging. The developer has no direct control
over this bridge-deployed contract because it is controlled by the bridge.

This method is covered in the [Automatic Onboarding Section](#automatic-onboarding)

### Option 2: Custom Association Onboarding

With this option (available for only for NFTs) developers can deploy their own contract to the 
target VM and declare a custom association between it and the native contract. This allows 
them to have more control over both contracts, enabling them to include more sophisticated 
features and mechanisms in their bridged token contracts such as ERC-721C, unique metadata 
views, and more that aren't included in the default bridged template versions.

This method is covered in the [Custom Association Section](#custom-association-onboarding)

:::info

Before continuing with onboarding your token, you should review
the [Prep Your Assets for Bridging](#prep-your-assets-for-bridging) section of this document.
This describes some steps you should follow to make sure that your native asset and/or
bridged asset are properly set up for you to register them with the bridge.

:::

## Automatic Onboarding

Moving from a Cadence-native asset to EVM, automatic onboarding can occur on the fly,
deploying a template contract in the same transaction as
the asset is bridged to EVM if the transaction so specifies.

Moving from EVM to Cadence, however, requires that onboarding occur in a separate transaction due to the fact that a
Cadence contract is initialized at the end of a transaction and isn't available in the runtime until after the
transaction has executed.

Below are transactions relevant to automatically onboarding assets native to either VM:

**Automatically Onboard a Cadence-native asset:**
<details>
<summary>onboard_by_type.cdc</summary>

```cadence onboard_by_type.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/onboarding/onboard_by_type.cdc
```

</details>

**Automatically Onboard an EVM-native asset:**
<details>
<summary>onboard_by_evm_address.cdc</summary>

```cadence onboard_by_evm_address.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/onboarding/onboard_by_evm_address.cdc
```

</details>

## Custom Association Onboarding

With [Custom Associations](https://github.com/onflow/flips/blob/main/application/20250131-cross-vm-nft-support.md),
developers can deploy NFT contracts in both VMs and associate them with each other,
allowing them to retain control of the contracts in both VMs as well as implement custom 
use-case specific functionality.


In order to do this, each contract must implement a special interface
that tells the bridge what the associated contract is in the other VM.
The fact that both point to each other validates the intended association,
preventing spoofing. If the contracts do not point to each other this way,
they will not be able to be registered as a custom association.

Review the [Preparing Custom Associations](#preparing-custom-associations) section
to learn how to set up each of your contracts for a custom association.

Below is the transaction for onboarding NFTs for a custom association.
Remember that both the Cadence and the Solidity contract need to be deployed
and include the special interface conformances to point to each other before registration!

**Onboard an NFT Custom Association:**
<details>
<summary>register_cross_vm_nft.cdc</summary>

```cadence onboard_by_type.cdc
!from https://github.com/onflow/flow-evm-bridge/blob/flip-318/cadence/transactions/bridge/onboarding/register_cross_vm_nft.cdc
```
</details>


## Bridging

Once an asset has been onboarded, either by automatic or custom association, it can be bridged in either
direction, referred to by its Cadence type. For Cadence-native assets, this is simply its native type. For EVM-native
assets, this is in most cases a templated Cadence contract deployed to the bridge account, the name of which is derived
from the EVM contract address. For instance, an ERC721 contract at address `0x1234` would be onboarded to the bridge as
`EVMVMBridgedNFT_0x1234`, making its type identifier `A.<BRIDGE_ADDRESS>.EVMVMBridgedNFT_0x1234.NFT`.

To get the type identifier for a given NFT, you can use the following code:

```cadence
// Where `nft` is either a @{NonFungibleToken.NFT} or &{NonFungibleToken.NFT}
nft.getType().identifier
```

You may also retrieve the type associated with a given EVM contract address using the following script:

<details>

<summary>get_associated_type.cdc</summary>

```cadence get_associated_type.cdc
!from https://github.com/onflow/flow-evm-bridge/blob/main/cadence/scripts/bridge/get_associated_type.cdc
```

</details>

Alternatively, given some onboarded Cadence type, you can retrieve the associated EVM address using the following
script:

<details>

<summary>get_associated_address.cdc</summary>

```cadence get_associated_address.cdc
!from https://github.com/onflow/flow-evm-bridge/blob/main/cadence/scripts/bridge/get_associated_evm_address.cdc
```

</details>

#### NFTs

Any Cadence NFTs bridging to EVM are escrowed in the bridge account and either minted in a bridge-deployed ERC721
contract or transferred from escrow to the calling COA in EVM. On the return trip, NFTs are escrowed in EVM - owned by
the bridge's COA - and either unlocked from escrow if locked or minted from a bridge-owned NFT contract.

Below are transactions relevant to bridging NFTs:

<details>

<summary>bridge_nft_to_evm.cdc</summary>

```cadence bridge_nft_to_evm.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/nft/bridge_nft_to_evm.cdc
```

</details>

<details>

<summary>bridge_nft_from_evm.cdc</summary>

```cadence bridge_nft_from_evm.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/nft/bridge_nft_from_evm.cdc
```

</details>

#### Fungible Tokens

Any Cadence fungible tokens bridging to EVM are escrowed in the bridge account only if they are Cadence-native. If the
bridge defines the tokens, they are burned. On the return trip the pattern is similar, with the bridge burning
bridge-defined tokens or escrowing them if they are EVM-native. In all cases, if the bridge has authority to mint on one
side, it must escrow on the other as the native VM contract is owned by an external party.

With fungible tokens in particular, there may be some cases where the Cadence contract is not deployed to the bridge
account, but the bridge still follows a mint/burn pattern in Cadence. These cases are handled via
[`TokenHandler`](https://github.com/onflow/flow-evm-bridge/blob/main/cadence/contracts/bridge/interfaces/FlowEVMBridgeHandlerInterfaces.cdc)
implementations. Also know that moving $FLOW to EVM is built into the `EVMAddress` object so any requests bridging $FLOW
to EVM will simply leverage this interface; however, moving $FLOW from EVM to Cadence must be done through the COA
resource.

Below are transactions relevant to bridging fungible tokens:

<details>

<summary>bridge_tokens_to_evm.cdc</summary>

```cadence bridge_tokens_to_evm.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/tokens/bridge_tokens_to_evm.cdc
```

</details>

<details>

<summary>bridge_tokens_from_evm.cdc</summary>

```cadence bridge_tokens_from_evm.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/tokens/bridge_tokens_from_evm.cdc
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
couple the `uri()` method with the utility contract below to serialize the onchain metadata on the fly. Alternatively,
you may choose to host a metadata proxy which serves the requested token URI content.

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
contract](https://github.com/onflow/flow-evm-bridge/blob/main/cadence/contracts/utils/SerializeMetadata.cdc) which
serializes metadata values into a JSON blob compatible with the OpenSea metadata standard. The serialized metadata is
then committed as the ERC721 `tokenURI` upon bridging Cadence-native NFTs to EVM. Since Cadence NFTs can easily update
onchain metadata either by field or by the ownership of sub-NFTs, this serialization pattern enables token URI updates
on subsequent bridge requests.

### Preparing Custom Associations

If you are a developer who wants to deploy and manage NFT contracts in both VMs
and have tokens from each be exchangable for each other,
you'll have to add some code to your contracts so they point to each other,
indicating that they each represent the same token in their respective VMs.

For the purposes of these instructions, an NFT is native to a VM if that VM 
is the main source of truth for the contracts and where they are originally minted.

This feature is not available for Fungible Tokens at the moment, but may be in the future.

:::warning

Note that the bridge only supports a single custom association declaration. This
means that once you register an association between your Cadence NFT & EVM 
contract, the association cannot be updated. If you wish to retain some upgradeability
to your registered implementations, it's recommended that you both retain keys on 
your Cadence NFT contract account **and ** implement an upgradeable Solidity pattern 
when deploying your ERC721, then register the association between your Cadence NFT 
Type & ERC721 proxy (not the implementation address).

:::

#### Cadence

All Cadence NFT contracts implement [Metadata Views](../../build/advanced-concepts/metadata-views.md)
that return metadata about their NFTs in standard ways
via the `{Contract}.resolveContractView()` and `{NFT}.resolveView()` methods.

The following new view (`CrossVMMetadataViews.EVMPointer`) **must** be resolved at the contract level (`ViewResolver.resolveContractView()`) for a given Type
**and** at the NFT level (`ViewResolver.Resolver.resolveView()`)

```cadence
/// View resolved at contract & resource level pointing to the associated EVM implementation
access(all) struct EVMPointer {
    /// The associated Cadence Type
    access(all) let cadenceType: Type
    /// The defining Cadence contract address
    access(all) let cadenceContractAddress: Address
    /// The associated EVM contract address
    access(all) let evmContractAddress: EVM.EVMAddress
    /// Whether the asset is Cadence- or EVM-native
    access(all) let isCadenceNative: Bool
}
```

This view allows a Cadence contract to specify which Solidity contract it is associated with.

You can see an example of how this view is implemented in
[the `ExampleNFT` contract](https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc#L173-L195)
in the Flow Non-Fungible Token repo.

If your EVM contract expects metadata to be passed from Cadence at the time of 
bridging, you must implement the `CrossVMMetadataViews.EVMBytesMetadata`
view. You'll find this useful for Cadence-native NFTs with dynamic metadata.
 This view will be resolved by the bridge and passed to your EVM contract
when the `fulfillToEVM` method is called.

How you handle the bridged bytes in your ERC721 implementation will be a matter
of overriding  the `_beforeFulfillment` and/or `_afterFulfillment` hooks included in the 
`CrossVMBridgeERC721Fulfillment` base contract.


**Flow EVM-Native NFTs**

If the NFT being onboarded to the bridge is native to Flow-EVM, then the associated contract's
minter resource must implement the `FlowEVMBridgeCustomAssociationTypes.NFTFulfillmentMinter` interface:

```cadence
/// Resource interface used by EVM-native NFT collections allowing for the fulfillment of NFTs from EVM into Cadence
    ///
    access(all) resource interface NFTFulfillmentMinter {
        /// Getter for the type of NFT that's fulfilled by this implementation
        ///
        access(all) view fun getFulfilledType(): Type

        /// Called by the VM bridge when moving NFTs from EVM into Cadence if the NFT is not in escrow. Since such NFTs
        /// are EVM-native, they are distributed in EVM. On the Cadence side, those NFTs are handled by a mint & escrow
        /// pattern. On moving to EVM, the NFTs are minted if not in escrow at the time of bridging.
        ///
        /// @param id: The id of the token being fulfilled from EVM
        ///
        /// @return The NFT fulfilled from EVM as its Cadence implementation
        ///
        access(FulfillFromEVM)
        fun fulfillFromEVM(id: UInt256): @{NonFungibleToken.NFT} {
            pre {
                id <= UInt256(UInt64.max):
                "The requested ID \(id.toString()) exceeds the maximum assignable Cadence NFT ID \(UInt64.max.toString())"
            }
            post {
                UInt256(result.id) == id:
                "Resulting NFT ID \(result.id.toString()) does not match requested ID \(id.toString())"
                result.getType() == self.getFulfilledType():
                "Expected \(self.getFulfilledType().identifier) but fulfilled \(result.getType().identifier)"
            }
        }
    }
```

You can see an example of an implementation of this interface in
the [Flow EVM bridge repo ExampleNFT contract](https://github.com/onflow/flow-evm-bridge/blob/flip-318/cadence/contracts/example-assets/cross-vm-nfts/ExampleEVMNativeNFT.cdc#L352-L377).

A Capability with the `FulfillFromEVM` entitlement is required at the time of registration so the bridge
can fulfill NFTs bridged from EVM for the first time.

#### Solidity

For custom associations, the following interface **must** be implemented in the IERC721-conforming Solidity contract.

This provides functionality to point to the address and type
of the associated Cadence NFT.

```solidity
interface ICrossVM {
    /**
     * Returns the Cadence address defining the associated type
     */
    function getCadenceAddress() external view returns (string memory);
    /**
     * Returns the Cadence Type identifier associated with the EVM contract
     */
    function getCadenceIdentifier() external view returns (string memory);
}
```

As an example, [`ICrossVM` is already
implemented](https://github.com/onflow/flow-evm-bridge/blob/main/solidity/src/interfaces/ICrossVM.sol)
and in use in the bridged [ERC721](https://github.com/onflow/flow-evm-bridge/blob/flip-318/solidity/src/templates/FlowEVMBridgedERC721.sol#L37-L43)
and [ERC20](https://github.com/onflow/flow-evm-bridge/blob/flip-318/solidity/src/templates/FlowEVMBridgedERC20.sol#L13-L40) templates.



If you are registering a custom association for an NFT that is native to Cadence, meaning that your project distributes NFTs to users on the Cadence side,
then your ERC721 contract will need to implement the `CrossVMBridgeERC721Fulfillment` contract. This is
a required conformance that does three primary things:

1. Implements the mint/escrow pattern expected by the VM bridge
2. Allows for the passing of arbitrary abi-encodable metadata from the Cadence NFT at the time of bridging
3. Exposes two optional hooks enabling you to update the fulfilled token's URI with the provided metadata at the time of bridging

Here is the Solidity contract to implement:

```solidity
abstract contract CrossVMBridgeERC721Fulfillment is ICrossVMBridgeERC721Fulfillment, CrossVMBridgeCallable, ERC721 {

    /**
     * Initializes the bridge EVM address such that only the bridge COA can call privileged methods
     */
    constructor(address _vmBridgeAddress) CrossVMBridgeCallable(_vmBridgeAddress) {}

    /**
     * @dev Fulfills the bridge request, minting (if non-existent) or transferring (if escrowed) the
     * token with the given ID to the provided address. For dynamic metadata handling between
     * Cadence & EVM, implementations should override and assign metadata as encoded from Cadence
     * side. If overriding, be sure to preserve the mint/escrow pattern as shown in the default
     * implementation. See `_beforeFulfillment` and `_afterFulfillment` hooks to enable pre-and/or
     * post-processing without the need to override this function.
     * 
     * @param _to address of the token recipient
     * @param _id the id of the token being moved into EVM from Cadence
     * @param _data any encoded metadata passed by the corresponding Cadence NFT at the time of
     *      bridging into EVM
     */
    function fulfillToEVM(address _to, uint256 _id, bytes memory _data) external onlyVMBridge {
        _beforeFulfillment(_to, _id, _data); // hook allowing implementation to perform pre-fulfillment validation
        if (_ownerOf(_id) == address(0)) {
            _mint(_to, _id); // Doesn't exist, mint the token
        } else {
            // Should be escrowed under vm bridge - transfer from escrow to recipient
            _requireEscrowed(_id);
            safeTransferFrom(vmBridgeAddress(), _to, _id);
        }
        _afterFulfillment(_to, _id, _data); // hook allowing implementation to perform post-fulfillment processing
        emit FulfilledToEVM(_to, _id);
    }

    /**
     * @dev Returns whether the token is currently escrowed under custody of the designated VM bridge
     * 
     * @param _id the ID of the token in question
     */
    function isEscrowed(uint256 _id) public view returns (bool) {
        return _ownerOf(_id) == vmBridgeAddress();
    }

    /**
     * @dev Returns whether the token is exists or not defined positively by whether the owner of
     * the token is 0x0.
     * 
     * @param _id the ID of the token in question
     */
    function exists(uint256 _id) public view returns (bool) {
        return _ownerOf(_id) != address(0);
    }

    /**
     * @dev Allows a caller to determine the contract conforms to implemented interfaces
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(CrossVMBridgeCallable, ERC721, IERC165) returns (bool) {
        return interfaceId == type(ICrossVMBridgeERC721Fulfillment).interfaceId
            || interfaceId == type(ICrossVMBridgeCallable).interfaceId
            || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Internal method that reverts with FulfillmentFailedTokenNotEscrowed if the provided
     * token is not escrowed with the assigned vm bridge address as owner.
     * 
     * @param _id the token id that must be escrowed
     */
    function _requireEscrowed(uint256 _id) internal view {
        if (!isEscrowed(_id)) {
            revert FulfillmentFailedTokenNotEscrowed(_id, vmBridgeAddress());
        }
    }

    /**
     * @dev This internal method is included as a step implementations can override and have
     * executed in the default fullfillToEVM call.
     * 
     * @param _to address of the pending token recipient
     * @param _id the id of the token to be moved into EVM from Cadence
     * @param _data any encoded metadata passed by the corresponding Cadence NFT at the time of
     *      bridging into EVM
     */
    function _beforeFulfillment(address _to, uint256 _id, bytes memory _data) internal virtual {
        // No-op by default, meant to be overridden by implementations
    }

    /**
     * @dev This internal method is included as a step implementations can override and have
     * executed in the default fullfillToEVM call.
     * 
     * @param _to address of the pending token recipient
     * @param _id the id of the token to be moved into EVM from Cadence
     * @param _data any encoded metadata passed by the corresponding Cadence NFT at the time of
     *      bridging into EVM
     */
    function _afterFulfillment(address _to, uint256 _id, bytes memory _data) internal virtual {
        // No-op by default, meant to be overridden by implementations for things like processing
        // and setting metadata
    }
}
```

Note the `_beforeFulfillment()` and `_afterFulfillment()` hooks are `virtual`, allowing implementations
to optionally override the methods and handle the provided metadata passed from your NFT if 
`EVMBytesMetadata` is resolved at the time of bridging. Also, notice that the `fulfillToEVM` method
is `onlyVMBridge`, allowing on the VM bridge to call the method either minting the NFT if it does not 
exist or transferring the NFT from escrow in a manner consistent with the bridge's mint/escrow pattern.

### Opting Out

It's also recognized that the logic of some use cases may actually be compromised by the act of bridging, particularly
in such a unique partitioned runtime environment. Such cases might include those that do not maintain ownership
assumptions implicit to ecosystem standards.

For instance, an ERC721 implementation may reclaim a user's assets after a month of inactivity. In such a case, bridging
that ERC721 to Cadence would decouple the representation of ownership of the bridged NFT from the actual ownership in
the defining ERC721 contract after the token had been reclaimed - there would be no NFT in escrow for the bridge to
transfer on fulfillment of the NFT back to EVM. In such cases, projects may choose to opt-out of bridging, but
**importantly must do so before the asset has been onboarded to the bridge**.

For Solidity contracts, opting out is as simple as extending the [`BridgePermissions.sol` abstract
contract](https://github.com/onflow/flow-evm-bridge/blob/main/solidity/src/interfaces/BridgePermissions.sol) which
defaults `allowsBridging()` to `false`. The bridge explicitly checks for the implementation of `IBridgePermissions` and
the value of `allowsBridging()` to validate that the contract has not opted out of bridging.

Similarly, Cadence contracts can implement the [`IBridgePermissions.cdc` contract
interface](https://github.com/onflow/flow-evm-bridge/blob/main/cadence/contracts/bridge/interfaces/IBridgePermissions.cdc).
This contract has a single method `allowsBridging()` with a default implementation returning `false`. Again, the bridge
explicitly checks for the implementation of `IBridgePermissions` and the value of `allowsBridging()` to validate that
the contract has not opted out of bridging. Should you later choose to enable bridging, you can simply override the
default implementation and return `true`.

In both cases, `allowsBridging()` gates onboarding to the bridge. Once onboarded - **a permissionless operation anyone
can execute** - the value of `allowsBridging()` is irrelevant and assets can move between VMs permissionlessly.

## Under the Hood

For an in-depth look at the high-level architecture of the bridge, see [FLIP
#237](https://github.com/onflow/flips/blob/main/application/20231222-evm-vm-bridge.md)

### Additional Resources

For the current state of Flow EVM across various task paths, see the following resources:

- [Flow EVM Equivalence forum post](https://forum.flow.com/t/evm-equivalence-on-flow-proposal-and-path-forward/5478)
- [EVM Integration FLIP #223](https://github.com/onflow/flips/pull/225/files)
- [Gateway & JSON RPC FLIP #235](https://github.com/onflow/flips/pull/235)
