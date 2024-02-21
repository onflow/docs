# Struct `Display`

```cadence
access(all) struct Display {

    access(all) let name: String

    access(all) let description: String

    access(all) let thumbnail: AnyStruct{File}
}
```

Display is a basic view that includes the name, description and
thumbnail for an object. Most objects should implement this view.

### Initializer

```cadence
init(name: String, description: String, thumbnail: AnyStruct{File})
```


