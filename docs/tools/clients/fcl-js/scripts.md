# Scripts

Scripts let you run non-permanent Cadence scripts on the Flow blockchain. They can return data.

They always need to contain a `access(all) fun main()` function as an entry point to the script.

`fcl.query` is a function that sends Cadence scripts to the chain and receives back decoded responses.

The `cadence` key inside the object sent to the `query` function is a [JavaScript Tagged Template Literal](https://styled-components.com/docs/advanced#tagged-template-literals) that we can pass Cadence code into.

### Sending Your First Script

The following example demonstrates how to send a script to the Flow blockchain. This script adds two numbers and returns the result.

```javascript
import * as fcl from "@onflow/fcl"

const response = await fcl.query({
  cadence: `
    access(all) fun main(): Int {
      return 1 + 2
    }
  `
})

console.log(response) // 3
```

### A More Complex Script

[Resources](https://cadence-lang.org/docs/language/resources) and [Structs](https://cadence-lang.org/docs/language/composite-types#structures) are complex data types that are fairly common place in Cadence.

In the following code snippet, our script defines a struct called `Point`, it then returns a list of them.

The closest thing to a Structure in JavaScript is an object. In this case when we decode this response, we would be expecting to get back an array of objects, where the objects have an `x` and `y` value.

```javascript
import * as fcl from "@onflow/fcl"

const response = await fcl.query({
  cadence: `
    access(all) struct Point {
      access(all) var x: Int
      access(all) var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    access(all) fun main(): [Point] {
      return [Point(x: 1, y: 1), Point(x: 2, y: 2)]
    }
  `
})

console.log(response) // [{x:1, y:1}, {x:2, y:2}]
```

### Transforming Data with Custom Decoders

In our app, we probably have a way of representing these Cadence values internally. In the above example it might be a `Point` class.

FCL enables us to provide custom decoders that we can use to transform the data we receive from the Flow blockchain at the edge, before anything else in our dapp gets a chance to look at it.

We add these custom decoders by [Configuring FCL](./configure-fcl.md).
This lets us set it once when our dapp starts up and use our normalized data through out the rest of our dapp.

In the below example we will use the concept of a `Point` again, but this time, we will add a custom decoder, that enables `fcl.decode` to transform it into a custom JavaScript `Point` class.

```javascript
import * as fcl from "@onflow/fcl"

class Point {
  constructor({ x, y }) {
    this.x = x
    this.y = y
  }
}

fcl.config()
  .put("decoder.Point", point => new Point(point))

const response = await fcl.query({
  cadence: `
    access(all) struct Point {
      access(all) var x: Int
      access(all) var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    access(all) fun main(): [Point] {
      return [Point(x: 1, y: 1), Point(x: 2, y: 2)]
    }
  `
})

console.log(response) // [Point{x:1, y:1}, Point{x:2, y:2}]
```

To learn more about `query`, check out the [API documentation](./packages-docs/fcl/query.md).
