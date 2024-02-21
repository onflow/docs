# Contract Interface `NonFungibleToken`

```cadence
access(all) contract interface NonFungibleToken {

    access(all) var totalSupply: UInt64
}
```

The main NFT contract interface. Other NFT contracts will
import and implement this interface
## Interfaces
    
### `INFT`

```cadence
access(all) resource interface INFT {

    access(all) let id: UInt64
}
```
Interface that the NFTs have to conform to
The metadata views methods are included here temporarily
because enforcing the metadata interfaces in the standard
would break many contracts in an upgrade. Those breaking changes
are being saved for the stable cadence milestone

[More...](NonFungibleToken_INFT.md)

---
    
### `Provider`

```cadence
access(all) resource interface Provider {
}
```
Interface to mediate withdraws from the Collection

[More...](NonFungibleToken_Provider.md)

---
    
### `Receiver`

```cadence
access(all) resource interface Receiver {
}
```
Interface to mediate deposits to the Collection

[More...](NonFungibleToken_Receiver.md)

---
    
### `CollectionPublic`

```cadence
access(all) resource interface CollectionPublic {
}
```
Interface that an account would commonly
publish for their collection

[More...](NonFungibleToken_CollectionPublic.md)

---
## Structs & Resources

### `NFT`

```cadence
access(all) resource NFT {

    access(all) let id: UInt64
}
```
Requirement that all conforming NFT smart contracts have
to define a resource called NFT that conforms to INFT

[More...](NonFungibleToken_NFT.md)

---

### `Collection`

```cadence
access(all) resource Collection {

    access(all) var ownedNFTs: {UInt64: NFT}
}
```
Requirement for the concrete resource type
to be declared in the implementing contract

[More...](NonFungibleToken_Collection.md)

---
## Functions

### `createEmptyCollection()`

```cadence
fun createEmptyCollection(): Collection
```
Creates an empty Collection and returns it to the caller so that they can own NFTs

Returns: A new Collection resource

---
## Events

### `ContractInitialized`

```cadence
access(all) event ContractInitialized()
```
Event that emitted when the NFT contract is initialized

---

### `Withdraw`

```cadence
access(all) event Withdraw(id: UInt64, from: Address?)
```
Event that is emitted when a token is withdrawn,
indicating the owner of the collection that it was withdrawn from.

If the collection is not in an account's storage, `from` will be `nil`.

---

### `Deposit`

```cadence
access(all) event Deposit(id: UInt64, to: Address?)
```
Event that emitted when a token is deposited to a collection.

It indicates the owner of the collection that it was deposited to.

---
