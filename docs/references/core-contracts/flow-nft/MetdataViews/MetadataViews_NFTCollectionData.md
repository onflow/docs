# Struct `NFTCollectionData`

```cadence
access(all) struct NFTCollectionData {

    access(all) let storagePath: StoragePath

    access(all) let publicPath: PublicPath

    access(all) let providerPath: PrivatePath

    access(all) let publicCollection: Type

    access(all) let publicLinkedType: Type

    access(all) let providerLinkedType: Type

    access(all) let createEmptyCollection: ((): @NonFungibleToken.Collection)
}
```

View to expose the information needed store and retrieve an NFT.
This can be used by applications to setup a NFT collection with proper
storage and public capabilities.

### Initializer

```cadence
init(storagePath: StoragePath, publicPath: PublicPath, providerPath: PrivatePath, publicCollection: Type, publicLinkedType: Type, providerLinkedType: Type, createEmptyCollectionFunction: ((): @NonFungibleToken.Collection))
```


