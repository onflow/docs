---
title: NFT Metadata Views
sidebar_label: NFT Metadata Views
---

# NFT MetadataViews on Flow

`MetadataViews` on Flow offer a standardized way to represent metadata across different NFTs. Through its integration, developers can ensure that different platforms and marketplaces can interpret the NFT metadata in a unified manner. This means that when users visit different websites, wallets, and marketplaces, the NFT metadata will be presented in a consistent manner, ensuring a uniform experience across various platforms.

> If you'd like to follow along while we discuss the concepts below, you can do so by referring to the [ExampleNFT contract](https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc). Additionally, here is the source code for the [MetadataViews contract](https://github.com/onflow/flow-nft/blob/master/contracts/MetadataViews.cdc).

## Two Levels of Metadata: An Overview

Metadata in Cadence is structured at two distinct levels:

1. **Contract-Level Metadata**: This provides an overarching description of the entire NFT collection.
2. **NFT-Level Metadata**: Diving deeper, this metadata relates to individual NFTs. It provides context, describes rarity, and highlights other distinctive attributes that distinguish one NFT from another within the same collection.

## Understanding `ViewResolver` and `MetadataViews.Resolver`

In the context of Flow and its treatment of metadata for NFTs, there are two essential interfaces to grasp: `ViewResolver` and `MetadataViews.Resolver`. Interfaces are like blueprints that outline the necessary variables and methods your contract needs to implement for the interface to be considered implemented. This ensures that any contract claiming to adhere to these interfaces will have a consistent set of functionalities that other applications or contracts can rely on.

1. **`ViewResolver` for Contract-Level Metadata**:
    - This interface ensures that contracts, primarily those encapsulating NFT collections, adhere to the metadata views' standards.
    - By adopting this interface, contracts can provide dynamic metadata outputs that encapsulate the collection as a whole.
2. **`MetadataViews.Resolver` for NFT-Level Metadata**:
    - Used within individual NFT resources, this interface ensures each token adheres to a standardized metadata format.
    - It focuses on the unique aspects of an individual NFT, such as its unique ID, name, description, and other defining characteristics.

### Core Functions

Both the `ViewResolver` and `MetadataViews.Resolver` utilize the following core functions:

### `getViews` Function

This function offers a list of metadata view types supported either by the contract (for `ViewResolver`) or by an individual NFT (for `MetadataViews.Resolver`).

```cadence
pub fun getViews(): [Type] {
    return [
        Type<MetadataViews.Display>(),
        ...
    ]
}
```

### `resolveView` Function

Regardless of whether it's used at the contract or NFT level, this function's role is to deliver the actual metadata associated with a given view type.

```cadence
pub fun resolveView(_ view: Type): AnyStruct? {
    switch view {
        case Type<MetadataViews.Display>():
            ...
        ...
    }
    return nil
}
```

## NFT-Level Metadata Implementation

NFT-level metadata addresses the unique attributes of individual tokens within a collection. It provides structured information for each NFT, including its identifier, descriptive elements, royalties, and other associated metadata. Implementing this level of detail ensures consistency and standardization across individual NFTs, making them interoperable and recognizable across various platforms and marketplaces.

### Core Properties

Every NFT has core properties that define its basic attributes. For example, in the provided code, an NFT has properties like its unique ID, name, description, and more. When we add the `MetadataViews.Resolver` to our NFT resource, we are indicating that these variables will align with the specifications defined in the `MetadataViews` contract for each of these properties. This ensures interoperability within the Flow ecosystem and guarantees that the metadata of our NFT can be consistently accessed and understood by various platforms and services that interact with NFTs.

```cadence
pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    access(self) let royalties: [MetadataViews.Royalty]
    access(self) let metadata: {String: AnyStruct}
    ...
}
```

### Metadata Views for NFTs

`MetadataViews` types define how the NFT presents its data. When invoked, the system knows precisely which view to return, ensuring that the relevant information is presented consistently across various platforms:

### Display

This view provides basic information about the NFT suitable for listing or display purposes. When the `Display` type is invoked, it dynamically assembles the visual and descriptive information that is typically needed for showcasing the NFT in marketplaces or collections.

```cadence
case Type<MetadataViews.Display>():
    return MetadataViews.Display(
        name: self.name,
        description: self.description,
        thumbnail: MetadataViews.HTTPFile(
            url: self.thumbnail
        )
    )
```

### Editions

The `Editions` view provides intricate details regarding the particular release of an NFT. This can include information about the number of copies in an edition, the specific NFT's sequence number within that edition, or its inclusion in a limited series. When the `Editions` view is queried, it retrieves this data, providing collectors with the information they need to comprehend the rarity and exclusivity of the NFT they are interested in.

```cadence
case Type<MetadataViews.Editions>():
    let editionInfo = MetadataViews.Edition(
        name: "Example NFT Edition",
        number: self.id,
        max: nil
    )
    return MetadataViews.Editions([editionInfo])
```

### Serial Number Metadata

The `Serial` metadata provides the unique serial number of the NFT, akin to a serial number on a currency note or a VIN on a car. This serial number is a fundamental attribute that certifies the individuality of each NFT and is critical for identification and verification processes.

```cadence
case Type<MetadataViews.Serial>():
    return MetadataViews.Serial(self.id)
```

### Royalties Metadata

Royalty information is vital for the sustainable economics of the creators in the NFT space. The `Royalties` metadata view spells out the specifics of any royalty agreements in place, detailing the percentage of sales revenue that will go to the original creator or other stakeholders on secondary sales.

```cadence
case Type<MetadataViews.Royalties>():
    // Assuming each 'Royalty' in the 'royalties' array has 'cut' and 'description' fields
    let detailedRoyalties = self.royalties.map { royalty ->
        MetadataViews.Royalty(
            receiver: royalty.receiver,      // The beneficiary of the royalty
            cut: royalty.cut,                // The percentage cut of each sale
            description: royalty.description // A description of the royalty terms
        )
    }
    return MetadataViews.Royalties(detailedRoyalties)
```

### External URL Metadata

The ExternalURL view returns to an associated webpage URL, providing additional content or information about the NFT.

```cadence
case Type<MetadataViews.ExternalURL>():
    return MetadataViews.ExternalURL("<https://example-nft.onflow.org/>".concat(self.id.toString()))
```

### Traits Metadata

Traits view type encapsulates the unique attributes of an NFT, like any visual aspects or category-defining properties. These can be essential for marketplaces that need to sort or filter NFTs based on these characteristics.

The `dictToTraits` helper function in Cadence is designed to convert a dictionary of metadata into a standard array of `Trait` structures. This function helps in preparing the traits data for the `MetadataViews.Traits` view, which can be understood by platforms within the Flow ecosystem.

Here's a more detailed look at how you might implement the `dictToTraits` function and the `Traits` view:

```cadence
case Type<MetadataViews.Traits>():
    // Exclude certain traits from being displayed
    let excludedTraits = ["mintedTime", "foo"]

    // Convert the remaining metadata into an array of `Trait` objects
    let traitsArray = MetadataViews.dictToTraits(dict: self.metadata, excludedNames: excludedTraits)

    return traitsArray
```

## Contract-Level Metadata Implementation

Contract-level metadata provides a holistic view of an NFT collection, capturing overarching attributes and contextual information about the entire set, rather than specifics of individual tokens. These views describe attributes at the collection or series level rather than individual NFTs.

### NFTCollectionData

This view provides paths and types related to the NFT collection's storage and access within the smart contract.

```cadence
case Type<MetadataViews.NFTCollectionData>():
    return MetadataViews.NFTCollectionData(
        storagePath: ExampleNFT.CollectionStoragePath,
        publicPath: ExampleNFT.CollectionPublicPath,
        providerPath: /private/exampleNFTCollection,
        publicCollection: Type<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic}>(),
        publicLinkedType: Type<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
        providerLinkedType: Type<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
            return <-ExampleNFT.createEmptyCollection()
        })
    )
```

Here, `NFTCollectionData` is specifying several important elements related to how the collection is stored and accessed on the Flow blockchain. It provides information on storage paths and access control paths for both public and private data, as well as linked types that specify what capabilities are publicly available (like collection, receiver, or provider interfaces).

### NFTCollectionDisplay

This view describes the collection with visual elements and metadata that are useful for display purposes, such as in a marketplace or gallery.

```cadence
case Type<MetadataViews.NFTCollectionDisplay>():
    let media = MetadataViews.Media(
        file: MetadataViews.HTTPFile(
            url: "<https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg>"
        ),
        mediaType: "image/svg+xml"
    )
    return MetadataViews.NFTCollectionDisplay(
        name: "The Example Collection",
        description: "This collection is used as an example to help you develop your next Flow NFT.",
        externalURL: MetadataViews.ExternalURL("<https://example-nft.onflow.org>"),
        squareImage: media,
        bannerImage: media,
        socials: {
            "twitter": MetadataViews.ExternalURL("<https://twitter.com/flow_blockchain>")
        }
    )
```

In the example above, the `NFTCollectionDisplay` not only offers fundamental metadata like the collection's name and description but also provides image URLs for visual representations of the collection (`squareImage` and `bannerImage`) and external links, including social media profiles.

## More

Understanding `MetadataViews` and the core functions associated with it is crucial for developers aiming to deploy NFTs on Flow. With these views and functions, NFTs can maintain a consistent presentation across various platforms and marketplaces and foster interoperability between contracts and applications in the Flow ecosystem. To gain a deeper understanding of implementing the MetadataView standard, Check out our documentation on "How to Create an NFT Project on Flow". It provides an introduction to integrating these standards into your NFT contracts.

- See the [API reference for a complete list of Metadata functions](https://developers.flow.com/references/core-contracts/flow-nft/MetdataViews/MetadataViews)
- Check out [an Example NFT project](https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc) implementing `MetadataViews`
- Read [the NFT Guide](../../guides/nft.md) for an introduction to implementation