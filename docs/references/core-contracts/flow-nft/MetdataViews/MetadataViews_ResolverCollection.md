# Resource Interface `ResolverCollection`

```cadence
access(all) resource interface ResolverCollection {
}
```

A group of view resolvers indexed by ID.
## Functions

### `borrowViewResolver()`

```cadence
fun borrowViewResolver(id: UInt64): &{Resolver}
```

---

### `getIDs()`

```cadence
fun getIDs(): [UInt64]
```

---
