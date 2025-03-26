---
title: Cross-VM Bridge
sidebar_label: Cross-VM Bridge
sidebar_position: 7
---

# Cross-VM Bridge

Flow provides the [Cross-VM Bridge](https://www.github.com/onflow/flow-evm-bridge) which enables the movement of
fungible and non-fungible tokens between Cadence & EVM. The Cross-VM Bridge is a contract-based protocol enabling the
automated and atomic bridging of tokens from Cadence into EVM with their corresponding ERC-20 and ERC-721 token types.
In the opposite direction, it supports bridging of arbitrary ERC-20 and ERC-721 tokens from EVM to Cadence as their
corresponding FT or NFT token types.

The Cross-VM Bridge internalizes the capabilities to deploy new token contracts in either VM state as needed, resolving
access to, and maintaining links between associated contracts. It additionally automates account and contract calls to
enforce source VM asset burn or lock, and target VM token mint or unlock.

Developers wishing to use the Cross-VM Bridge will be required to use a Cadence transaction. Cross-VM bridging
functionality is not currently available natively in Flow EVM. By extension, this means that the EVM account bridging
from EVM to Cadence must be a [`CadenceOwnedAccount` (COA)](./interacting-with-coa.md) as this is the only EVM account
type that can be controlled from the Cadence runtime.

This [FLIP](https://github.com/onflow/flips/pull/233) outlines the architecture and implementation of the VM bridge.
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

### Overview

The Flow EVM bridge allows both fungible and non-fungible tokens to move atomically between Cadence and EVM. In the
context of EVM, fungible tokens are defined as ERC20 tokens, and non-fungible tokens as ERC721 tokens. In Cadence,
fungible tokens are defined by contracts implementing
[the `FungibleToken` interface](https://github.com/onflow/flow-ft/blob/master/contracts/FungibleToken.cdc)
and non-fungible tokens implement
[the `NonFungibleToken` interface](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc).

Like all operations on Flow, there are native fees associated with both computation and storage. To prevent spam and
sustain the bridge account's storage consumption, fees are charged for both onboarding assets and bridging assets. In
the case where storage consumption is expected, fees are charged based on the storage consumed at the current network
storage rate.

### Onboarding

Since a contract must define the asset in the target VM, an asset must be "onboarded" to the bridge before requests can
be fulfilled.

Moving from Cadence to EVM, onboarding can occur on the fly, deploying a template contract in the same transaction as
the asset is bridged to EVM if the transaction so specifies.

Moving from EVM to Cadence, however, requires that onboarding occur in a separate transaction due to the fact that a
Cadence contract is initialized at the end of a transaction and isn't available in the runtime until after the
transaction has executed.

Below are transactions relevant to onboarding assets:

<details>
<summary>onboard_by_type.cdc</summary>

```cadence onboard_by_type.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/onboarding/onboard_by_type.cdc
```

</details>

<details>
<summary>onboard_by_evm_address.cdc</summary>

```cadence onboard_by_evm_address.cdc
!from https://www.github.com/onflow/flow-evm-bridge/blob/main/cadence/transactions/bridge/onboarding/onboard_by_evm_address.cdc
```

</details>

### Bridging

Once an asset has been onboarded, either by its Cadence type or EVM contract address, it can be bridged in either
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
