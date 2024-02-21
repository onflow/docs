# Struct `NFTView`

```cadence
access(all) struct NFTView {

    access(all) let id: UInt64

    access(all) let uuid: UInt64

    access(all) let display: Display?

    access(all) let externalURL: ExternalURL?

    access(all) let collectionData: NFTCollectionData?

    access(all) let collectionDisplay: NFTCollectionDisplay?

    access(all) let royalties: Royalties?

    access(all) let traits: Traits?
}
```

NFTView wraps all Core views along `id` and `uuid` fields, and is used
to give a complete picture of an NFT. Most NFTs should implement this
view.

### Initializer

```cadence
init(id: UInt64, uuid: UInt64, display: Display?, externalURL: ExternalURL?, collectionData: NFTCollectionData?, collectionDisplay: NFTCollectionDisplay?, royalties: Royalties?, traits: Traits?)
```


