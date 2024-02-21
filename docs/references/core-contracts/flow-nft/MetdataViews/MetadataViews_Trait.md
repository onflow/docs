# Struct `Trait`

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

### Initializer

```cadence
init(name: String, value: AnyStruct, displayType: String?, rarity: Rarity?)
```


