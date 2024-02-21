# Struct `NFTCollectionDisplay`

```cadence
access(all) struct NFTCollectionDisplay {

    access(all) let name: String

    access(all) let description: String

    access(all) let externalURL: ExternalURL

    access(all) let squareImage: Media

    access(all) let bannerImage: Media

    access(all) let socials: {String: ExternalURL}
}
```

View to expose the information needed to showcase this NFT's
collection. This can be used by applications to give an overview and
graphics of the NFT collection this NFT belongs to.

### Initializer

```cadence
init(name: String, description: String, externalURL: ExternalURL, squareImage: Media, bannerImage: Media, socials: {String: ExternalURL})
```


