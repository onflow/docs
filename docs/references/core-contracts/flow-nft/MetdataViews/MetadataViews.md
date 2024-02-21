# Contract `MetadataViews`

```cadence
access(all) contract MetadataViews {
}
```

This contract implements the metadata standard proposed
in FLIP-0636.

Ref: https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md

Structs and resources can implement one or more
metadata types, called views. Each view type represents
a different kind of metadata, such as a creator biography
or a JPEG image file.
## Interfaces
    
### `Resolver`

```cadence
access(all) resource interface Resolver {
}
```
Provides access to a set of metadata views. A struct or
resource (e.g. an NFT) can implement this interface to provide access to
the views that it supports.

[More...](MetadataViews_Resolver.md)

---
    
### `ResolverCollection`

```cadence
access(all) resource interface ResolverCollection {
}
```
A group of view resolvers indexed by ID.

[More...](MetadataViews_ResolverCollection.md)

---
    
### `File`

```cadence
access(all) struct interface File {
}
```
Generic interface that represents a file stored on or off chain. Files
can be used to references images, videos and other media.

[More...](MetadataViews_File.md)

---
## Structs & Resources

### `NFTView`

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

[More...](MetadataViews_NFTView.md)

---

### `Display`

```cadence
access(all) struct Display {

    access(all) let name: String

    access(all) let description: String

    access(all) let thumbnail: AnyStruct{File}
}
```
Display is a basic view that includes the name, description and
thumbnail for an object. Most objects should implement this view.

[More...](MetadataViews_Display.md)

---

### `HTTPFile`

```cadence
access(all) struct HTTPFile {

    access(all) let url: String
}
```
View to expose a file that is accessible at an HTTP (or HTTPS) URL.

[More...](MetadataViews_HTTPFile.md)

---

### `IPFSFile`

```cadence
access(all) struct IPFSFile {

    access(all) let cid: String

    access(all) let path: String?
}
```
View to expose a file stored on IPFS.
IPFS images are referenced by their content identifier (CID)
rather than a direct URI. A client application can use this CID
to find and load the image via an IPFS gateway.

[More...](MetadataViews_IPFSFile.md)

---

### `Edition`

```cadence
access(all) struct Edition {

    access(all) let name: String?

    access(all) let number: UInt64

    access(all) let max: UInt64?
}
```
Optional view for collections that issue multiple objects
with the same or similar metadata, for example an X of 100 set. This
information is useful for wallets and marketplaces.
An NFT might be part of multiple editions, which is why the edition
information is returned as an arbitrary sized array

[More...](MetadataViews_Edition.md)

---

### `Editions`

```cadence
access(all) struct Editions {

    access(all) let infoList: [Edition]
}
```
Wrapper view for multiple Edition views

[More...](MetadataViews_Editions.md)

---

### `Serial`

```cadence
access(all) struct Serial {

    access(all) let number: UInt64
}
```
View representing a project-defined serial number for a specific NFT
Projects have different definitions for what a serial number should be
Some may use the NFTs regular ID and some may use a different
classification system. The serial number is expected to be unique among
other NFTs within that project

[More...](MetadataViews_Serial.md)

---

### `Royalty`

```cadence
access(all) struct Royalty {

    access(all) let receiver: Capability<&AnyResource{FungibleToken.Receiver}>

    access(all) let cut: UFix64

    access(all) let description: String
}
```
View that defines the composable royalty standard that gives marketplaces a
unified interface to support NFT royalties.

[More...](MetadataViews_Royalty.md)

---

### `Royalties`

```cadence
access(all) struct Royalties {

    access(self) let cutInfos: [Royalty]
}
```
Wrapper view for multiple Royalty views.
Marketplaces can query this `Royalties` struct from NFTs
and are expected to pay royalties based on these specifications.

[More...](MetadataViews_Royalties.md)

---

### `Media`

```cadence
access(all) struct Media {

    access(all) let file: AnyStruct{File}

    access(all) let mediaType: String
}
```
View to represent, a file with an correspoiding mediaType.

[More...](MetadataViews_Media.md)

---

### `Medias`

```cadence
access(all) struct Medias {

    access(all) let items: [Media]
}
```
Wrapper view for multiple media views

[More...](MetadataViews_Medias.md)

---

### `License`

```cadence
access(all) struct License {

    access(all) let spdxIdentifier: String
}
```
View to represent a license according to https://spdx.org/licenses/
This view can be used if the content of an NFT is licensed.

[More...](MetadataViews_License.md)

---

### `ExternalURL`

```cadence
access(all) struct ExternalURL {

    access(all) let url: String
}
```
View to expose a URL to this item on an external site.
This can be used by applications like .find and Blocto to direct users
to the original link for an NFT.

[More...](MetadataViews_ExternalURL.md)

---

### `NFTCollectionData`

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

[More...](MetadataViews_NFTCollectionData.md)

---

### `NFTCollectionDisplay`

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

[More...](MetadataViews_NFTCollectionDisplay.md)

---

### `Rarity`

```cadence
access(all) struct Rarity {

    access(all) let score: UFix64?

    access(all) let max: UFix64?

    access(all) let description: String?
}
```
View to expose rarity information for a single rarity
Note that a rarity needs to have either score or description but it can
have both

[More...](MetadataViews_Rarity.md)

---

### `Trait`

```cadence
access(all) struct Trait {

    access(all) let name: String

    access(all) let value: AnyStruct

    access(all) let displayType: String?

    access(all) let rarity: Rarity?
}
```
View to represent a single field of metadata on an NFT.
This is used to get traits of individual key/value pairs along with some
contextualized data about the trait

[More...](MetadataViews_Trait.md)

---

### `Traits`

```cadence
access(all) struct Traits {

    access(all) let traits: [Trait]
}
```
Wrapper view to return all the traits on an NFT.
This is used to return traits as individual key/value pairs along with
some contextualized data about each trait.

[More...](MetadataViews_Traits.md)

---
## Functions

### `getNFTView()`

```cadence
fun getNFTView(id: UInt64, viewResolver: &{Resolver}): NFTView
```
Helper to get an NFT view

Parameters:
  - id : _The NFT id_
  - viewResolver : _A reference to the resolver resource_

Returns: A NFTView struct

---

### `getDisplay()`

```cadence
fun getDisplay(_: &{Resolver}): Display?
```
Helper to get Display in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: An optional Display struct

---

### `getEditions()`

```cadence
fun getEditions(_: &{Resolver}): Editions?
```
Helper to get Editions in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: An optional Editions struct

---

### `getSerial()`

```cadence
fun getSerial(_: &{Resolver}): Serial?
```
Helper to get Serial in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: An optional Serial struct

---

### `getRoyalties()`

```cadence
fun getRoyalties(_: &{Resolver}): Royalties?
```
Helper to get Royalties in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional Royalties struct

---

### `getRoyaltyReceiverPublicPath()`

```cadence
fun getRoyaltyReceiverPublicPath(): PublicPath
```
Get the path that should be used for receiving royalties
This is a path that will eventually be used for a generic switchboard receiver,
hence the name but will only be used for royalties for now.

Returns: The PublicPath for the generic FT receiver

---

### `getMedias()`

```cadence
fun getMedias(_: &{Resolver}): Medias?
```
Helper to get Medias in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional Medias struct

---

### `getLicense()`

```cadence
fun getLicense(_: &{Resolver}): License?
```
Helper to get License in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional License struct

---

### `getExternalURL()`

```cadence
fun getExternalURL(_: &{Resolver}): ExternalURL?
```
Helper to get ExternalURL in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional ExternalURL struct

---

### `getNFTCollectionData()`

```cadence
fun getNFTCollectionData(_: &{Resolver}): NFTCollectionData?
```
Helper to get NFTCollectionData in a way that will return an typed Optional

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional NFTCollectionData struct

---

### `getNFTCollectionDisplay()`

```cadence
fun getNFTCollectionDisplay(_: &{Resolver}): NFTCollectionDisplay?
```
Helper to get NFTCollectionDisplay in a way that will return a typed
Optional

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional NFTCollection struct

---

### `getRarity()`

```cadence
fun getRarity(_: &{Resolver}): Rarity?
```
Helper to get Rarity view in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional Rarity struct

---

### `getTraits()`

```cadence
fun getTraits(_: &{Resolver}): Traits?
```
Helper to get Traits view in a typesafe way

Parameters:
  - viewResolver : _A reference to the resolver resource_

Returns: A optional Traits struct

---

### `dictToTraits()`

```cadence
fun dictToTraits(dict: {String: AnyStruct}, excludedNames: [String]?): Traits
```
Helper function to easily convert a dictionary to traits. For NFT
collections that do not need either of the optional values of a Trait,
this method should suffice to give them an array of valid traits.

keys that are not wanted to become `Traits`

Parameters:
  - dict : _The dictionary to be converted to Traits_
  - excludedNames : _An optional String array specifying the `dict`_

Returns: The generated Traits view

---
