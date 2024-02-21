# Struct `Media`

```cadence
access(all) struct Media {

    access(all) let file: AnyStruct{File}

    access(all) let mediaType: String
}
```

View to represent, a file with an correspoiding mediaType.

### Initializer

```cadence
init(file: AnyStruct{File}, mediaType: String)
```


