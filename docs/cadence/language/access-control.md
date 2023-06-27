---
title: Access control
sidebar_position: 13
---

Access control allows making certain parts of the program accessible/visible
and making other parts inaccessible/invisible.

In Flow and Cadence, there are two types of access control:

1. Access control on objects in account storage using capability security.

    Within Flow, a caller is not able to access an object
    unless it owns the object or has a specific reference to that object.
    This means that nothing is truly public by default.
    Other accounts can not read or write the objects in an account
    unless the owner of the account has granted them access
    by providing references to the objects.

2. Access control within contracts and objects
   using `access` keywords.

   For the explanations of the following keywords, we assume that
   the defining type is either a contract, where capability security
   doesn't apply, or that the caller would have valid access to the object
   governed by capability security.

The high-level reference-based security (point 1 above)
will be covered in a later section.

Top-level declarations
(variables, constants, functions, structures, resources, interfaces)
and fields (in structures, and resources) are always only able to be written
to and mutated (modified, such as by indexed assignment or methods like `append`)
in the scope where it is defined (self).

There are five levels of access control defined in the code that specify where
a declaration can be accessed or called.

- Public or **access(all)** means the declaration
  is accessible/visible in all scopes.

  This includes the current scope, inner scopes, and the outer scopes.

  For example, a public field in a type can be accessed using the access syntax
  on an instance of the type in an outer scope.
  This does not allow the declaration to be publicly writable though.

  An element is made publicly accessible / by any code
  by using the `access(all)` keyword.

- Entitled access means the declaration is only accessible/visible
  to the owner of the object, or to references that are authorized to the required entitlements.
  
  A reference is considered authorized to an entitlement if that entitlement appears in the `auth` portion of the reference type.

  For example, an `access(E, F)` field on a resource `R` can only be accessed by an owned (`@R`-typed) value, 
  or a reference to `R` that is authorized to the `E` and `F` entitlements (`auth(E, F) &R`). 

  An element is made accessible by code in the same containing type
  by using the `access(E)` syntax, described in more detail in the entitlements section below.

- **access(account)** means the declaration is only accessible/visible in the
  scope of the entire account where it is defined. This means that
  other contracts in the account are able to access it,

  An element is made accessible by code in the same account (e.g. other contracts)
  by using the `access(account)` keyword.

- **access(contract)** means the declaration is only accessible/visible in the
  scope of the contract that defined it. This means that other types
  and functions that are defined in the same contract can access it,
  but not other contracts in the same account.

  An element is made accessible by code in the same contract
  by using the `access(contract)` keyword.

- Private or **access(self)** means the declaration is only accessible/visible
  in the current and inner scopes.

  For example, an `access(self)` field can only be
  accessed by functions of the type is part of,
  not by code in an outer scope.

  An element is made accessible by code in the same containing type
  by using the `access(self)` keyword.

**Access level must be specified for each declaration**

To summarize the behavior for variable declarations, constant declarations, and fields:

| Declaration kind | Access modifier    | Read scope                                           | Write scope       | Mutate scope      |
|:-----------------|:-------------------|:-----------------------------------------------------|:------------------|:------------------|
| `let`            | `access(self)`     | Current and inner                                    | *None*            | Current and inner |
| `let`            | `access(contract)` | Current, inner, and containing contract              | *None*            | Current and inner |
| `let`            | `access(account)`  | Current, inner, and other contracts in same account  | *None*            | Current and inner |
| `let`            | `access(all)`      | **All**                                              | *None*            | Current and inner |
| `let`            | `access(E)`        | **All** with required entitlements                   | *None*            | Current and inner |
| `var`            | `access(self)`     | Current and inner                                    | Current and inner | Current and inner |
| `var`            | `access(contract)` | Current, inner, and containing contract              | Current and inner | Current and inner |
| `var`            | `access(account)`  | Current, inner, and other contracts in same account  | Current and inner | Current and inner |
| `var`            | `access(all)`      | **All**                                              | Current and inner | Current and inner |
| `var`            | `access(E)`        | **All** with required entitlements                   | Current and inner | Current and inner |

To summarize the behavior for functions:

| Access modifier    | Access scope                                        |
|:-------------------|:----------------------------------------------------|
| `access(self)`     | Current and inner                                   |
| `access(contract)` | Current, inner, and containing contract             |
| `access(account)`  | Current, inner, and other contracts in same account |
| `access(all)`      | **All**                                             |
| `access(E)`        | **All** with required entitlements                  |

Declarations of structures, resources, events, and [contracts](./contracts.mdx) can only be public.
However, even though the declarations/types are publicly visible,
resources can only be created from inside the contract they are declared in.

```cadence
// Declare a private constant, inaccessible/invisible in outer scope.
//
access(self) let a = 1

// Declare a public constant, accessible/visible in all scopes.
//
access(all) let b = 2
```

```cadence
// Declare a public struct, accessible/visible in all scopes.
//
access(all) struct SomeStruct {

    // Declare a private constant field which is only readable
    // in the current and inner scopes.
    //
    access(self) let a: Int

    // Declare a public constant field which is readable in all scopes.
    //
    access(all) let b: Int

    // Declare a private variable field which is only readable
    // and writable in the current and inner scopes.
    //
    access(self) var c: Int

    // Declare a public variable field which is not settable,
    // so it is only writable in the current and inner scopes,
    // and readable in all scopes.
    //
    access(all) var d: Int

    // Arrays and dictionaries declared without (set) cannot be
    // mutated in external scopes
    access(all) let arr: [Int]

    // The initializer is omitted for brevity.

    // Declare a private function which is only callable
    // in the current and inner scopes.
    //
    access(self) fun privateTest() {
        // ...
    }

    // Declare a public function which is callable in all scopes.
    //
    access(all) fun publicTest() {
        // ...
    }

    // The initializer is omitted for brevity.

}

let some = SomeStruct()

// Invalid: cannot read private constant field in outer scope.
//
some.a

// Invalid: cannot set private constant field in outer scope.
//
some.a = 1

// Valid: can read public constant field in outer scope.
//
some.b

// Invalid: cannot set public constant field in outer scope.
//
some.b = 2

// Invalid: cannot read private variable field in outer scope.
//
some.c

// Invalid: cannot set private variable field in outer scope.
//
some.c = 3

// Valid: can read public variable field in outer scope.
//
some.d

// Invalid: cannot set public variable field in outer scope.
//
some.d = 4

// Invalid: cannot mutate a public field in outer scope.
//
some.f.append(0)

// Invalid: cannot mutate a public field in outer scope.
//
some.f[3] = 1

// Valid: can call non-mutating methods on a public field in outer scope
some.f.contains(0)
```

## Entitlements

Entitlements are a unique feature of Cadence that provide granular access control to each member of a struct or resource. 
Entitlements can be declared using the following syntax:

```cadence
entitlement E
entitlement F
```

creates two entitlements called `E` and `F`. 
Entitlements can be imported from other contracts and used the same way as other types. 
If using entitlements defined in another contract, the same qualified name syntax is used as for other types:

```cadence
contract C {
  entitlement E
}
```

Outside of `C`, `E` is used with `C.E` syntax. 
Entitlements exist in the same namespace as types, so if your contract defines a resource called `R`,
it will not be possible to define an entitlement that is also called `R`. 

Entitlements can be used in access modifiers on struct and resource members to specify which references to those composites
are allowed to access those members. 
An access modifier can include more than one entitlement, joined with either an `|`, to indicate disjunction or "or", 
or a `,`, to indicate conjunction or "and". So, for example:

```cadence
access(all) resource SomeResource {
  
  // requires an `E` entitlement to read this field
  access(E) let a: Int

  // requires either an `E` or an `F` entitlement to read this field
  access(E | F) let b: Int

   // requires both an `E` and an `F` entitlement to read this field
  access(E, F) let b: Int

  // intializers omitted for brevity
  // ...
}
```

Given some values with the annotated types (details on how to create entitled references can be found [here](./references.mdx)):

```cadence

let r: @SomeResource = // ...
let refE: auth(E) &SomeResource = // ...
let refF: auth(F) &SomeResource = // ...
let refEF: auth(E, F) &SomeResource = // ...

// valid, because `r` is owned and thus is "fully entitled"
r.a
// valid, because `r` is owned and thus is "fully entitled"
r.b
// valid, because `r` is owned and thus is "fully entitled"
r.c

// valid, because `refE` has an `E` entitlement as required
refE.a
// valid, because `refE` has one of the two required entitlements
refE.b
// invalid, because `refE` only has one of the two required entitlements
refE.c

// invalid, because `refF` has an `E` entitlement, not an `F`
refF.a
// valid, because `refF` has one of the two required entitlements
refF.b
// invalid, because `refF` only has one of the two required entitlements
refF.c

// valid, because `refEF` has an `E` entitlement
refEF.a
// valid, because `refEF` has both of the two required entitlements
refEF.b
// valid, because `refEF` has both of the two required entitlements
refEF.c
```

### Entitlement Mappings

When objects have fields that are child objects, 
it can often be valuable to have different views of that reference depending on the entitlements one has on the reference to the parent object. 
Consider the following example:

```cadence
entitlement OuterEntitlement
entitlement SubEntitlement

resource SubResource {
    access(all) fun foo() { ... }
    access(SubEntitlement) fun bar() { ... }
}

resource OuterResource {
    access(self) let childResource: @SubResource
    access(all) fun getPubRef(): &SubResource {
        return &self.childResource as &SubResource
    }
    access(OuterEntitlement) fun getEntitledRef(): auth(SubEntitlement) &SubResource {
        return &self.childResource as auth(SubEntitlement) &SubResource
    }

    init(r: @SubResource) {
        self.childResource <- r 
    }
}
```

With this pattern, we can store a `SubResource` on an `OuterResource` value, 
and create different ways to access that nested resource depending on the entitlement one posseses. 
Somoneone with only an unauthorized reference to `OuterResource` can only call the `getPubRef` function, 
and thus can only get an unauthorized reference to `SubResource` that lets them call `foo`. 
However, someone with a `OuterEntitlement`-authorized refererence to the `OuterResource` can call the `getEntitledRef` function, 
giving them a `SubEntitlement`-authorized reference to `SubResource` that allows them to call `bar`.

This pattern is functional, but it is unfortunate that we are forced to "duplicate" the accessors to `SubResource`, 
duplicating the code and storing two functions on the object, 
essentially creating two different views to the same object that are stored as different functions. 
To avoid necessitating this duplication, we add support to the language for "entitlement mappings", 
a way to declare statically how entitlements are propagated from parents to child objects in a nesting hierarchy. 
So, the above example could be equivalently written as:

```cadence
entitlement OuterEntitlement
entitlement SubEntitlement

// specify a mapping for entitlements called `Map`, which defines a function
// from an input set of entitlements (called the domain) to an output set (called the range or the image)
entitlement mapping Map {
    OuterEntitlement -> SubEntitlement
}

resource SubResource {
    access(all) fun foo() { ... }
    access(SubEntitlement) fun bar() { ... }
}

resource OuterResource {
    access(self) let childResource: @SubResource
    // by referering to `Map` here, we declare that the entitlements we receive when accessing the `getRef` function on this resource
    // will depend on the entitlements we possess to the resource during the access. 
    access(Map) fun getRef(): auth(Map) &SubResource {
        return &self.childResource as auth(Map) &SubResource
    }

    init(r: @SubResource) {
        self.childResource = r
    }
}

// given some value `r` of type `@OuterResource`
let pubRef = &r as &OuterResource
let pubSubRef = pubRef.getRef() // has type `&SubResource`

let entitledRef = &r as auth(OuterEntitlement) &OuterResource
let entitledSubRef = entitledRef.getRef() // `OuterEntitlement` is defined to map to `SubEntitlement`, so this access yields a value of type `auth(SubEntitlement) &SubResource`
Entitlement

// `r` is an owned value, and is thus considered "fully-entitled" to `OuterResource`,
// so this access yields a value authorized to the entire image of `Map`, in this case `SubEntitlement`
let alsoEntitledSubRef = r.getRef() 
```

<!---- TODO: Update once mappings can be used on regular composite fields ---->
Entitlement mappings may be used either in accessor functions (as in the example above), or in fields whose types are references. Note that this latter
usage will necessarily make the type of the composite non-storage, since it will have a reference field. 

<!--- TODO: once the Account type refactor is complete and the documentation updated, let's link here to the Account type page as an example of more complex entitlement mappings --->
Entitlement mappings need not be 1:1; it is valid to define a mapping where multiple inputs map to the same output, or where one input maps to multiple outputs. 

Entitlement mappings preserve the "kind" of the set they are mapping; i.e. mapping an "and" set produces an "and" set, and mapping an "or" set produces an "or" set. 
Because "and" and "or" separators cannot be combined in the same set, attempting to map "or"-separated sets through certain complex mappings may result in a type error. For example:

```
entitlement mapping M {
  A -> B 
  A -> C
  D -> E
}
```

attempting to map `(A | D)` through `M` will fail, since `A` should map to `(B, C)` and `D` should map to `E`, but these two outputs cannot be combined into a disjunctive set. 