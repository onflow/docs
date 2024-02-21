# Struct `HTTPFile`

```cadence
access(all) struct HTTPFile {

    access(all) let url: String
}
```

View to expose a file that is accessible at an HTTP (or HTTPS) URL.

Implemented Interfaces:
  - `File`


### Initializer

```cadence
init(url: String)
```


## Functions

### `uri()`

```cadence
fun uri(): String
```

---
