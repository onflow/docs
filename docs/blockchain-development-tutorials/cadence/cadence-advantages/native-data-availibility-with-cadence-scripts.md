---
title: Native Data Availability With Cadence Scripts
sidebar: Data Availability
description: Learn why Cadence scripts are more powerful than Solidity views by incrementally building a post-1.0 Cadence script that lists a parent account's child accounts and returns their NBA Top Shot NFTs using the Flow CLI commands.
sidebar_position: 1
keywords:
  - Cadence scripts
  - Solidity views
  - data availability
  - blockchain indexers
  - Hybrid Custody
  - capabilities
  - entitlements
  - Flow CLI
  - commands
  - NonFungibleToken
  - MetadataViews
  - NBA Top Shot
  - Flow NFTs
  - account storage
  - read operations
---

# Native Data Availability With Cadence Scripts

In Solidity, you can only retrieve data from **view** functions that the contract author anticipated and included in the original contract. If the exact query you want is not exposed, teams typically rely on a _data availability service_ such as The Graph, Covalent, Alchemy Enhanced APIs, Reservoir, or NFTScan to compute and serve that view.

In Cadence, **scripts** are general-purpose read programs. They can traverse public account storage, read public capabilities, and compose types from multiple contracts to answer new questions without modifying those contracts. You are not limited to the pre-written surface area of a single contract's views.

:::info

In Cadence, a _script_ is a read-only program that can access public data across accounts and contracts in a strongly typed way. It does not require gas or user signatures.

:::

## Objectives

After completing this guide, you will be able to:

- Explain why Cadence **scripts** are more powerful than Solidity **view** functions
- Use the [Flow CLI Commands] to execute a Cadence script against mainnet
- Analyze an account for [NBA Top Shot] NFTs held by the account or its child accounts
- Build the script incrementally to:
  - Query a parent account for child accounts via [_Hybrid Custody_]
  - Inspect each child account's storage paths
  - Detect NFT collections the parent can control
  - List only NBA Top Shot NFTs with display metadata
  - Update the script to also list NFL All Day NFT metadata

## Prerequisites

- Basic familiarity with [Cadence] and [Flow accounts]
- Flow CLI installed and authenticated for mainnet (see [Flow CLI Commands])
- The target parent account uses _Hybrid Custody_ and controls at least one child account that holds NBA Top Shot NFTs
  - If you don't have an account that owns NBA Top Shots, you can use `0xfeb88a0fcc175a3d` for this tutorial

:::tip

If you are new to [_Hybrid Custody_], the high-level idea is that in Cadence, a parent account can manage one or more child accounts through managed capabilities. This guide uses those capabilities to enumerate NFT collections the parent can control.

:::

## Getting Started

Create a new Flow project and generate a script file:

```bash
# Create a new Flow project
flow init cadence-scripts-tutorial

# Navigate to the project directory
cd cadence-scripts-tutorial

# Generate a new script file
flow generate script TopShotQuery
```

This creates a proper Flow project structure with `flow.json` configuration and generates a script template at `cadence/scripts/TopShotQuery.cdc`.

We will **revise one script file** in four passes, running it after each step. This mirrors how you would build and verify a script from scratch.

---

## Querying the account to find child accounts

Start by writing a script to borrow the parent's _Hybrid Custody_ manager and return the child addresses it controls. This verifies that imports resolve and that the parent account is configured as expected.

First, you'll need to install the `HybridCustody` contract from mainnet.

:::info

In Cadence, you can import a file from a path as you'd expect. You can also **import an already deployed contract** into your project.

:::

Use the [dependency manager] to install the contract with:

```bash
flow dependencies install mainnet://0xd8a7e05a7ac670c0.HybridCustody
```

This will install the contract and its own dependencies. You don't need to deploy these contracts again, so pick `none` for the account to deploy. You also don't need an alias.

:::warning

Installing dependencies in this way is treated by the language server similar to installing packages in other platforms. You'll need to close and reopen the file or type something to trigger a refresh.

:::

Open `scripts/TopShotQuery.cdc` Replace the file contents with:

```cadence
import "HybridCustody"

// Return the child account addresses managed by the given parent.
access(all) fun main(addr: Address): [Address] {
  let parent = getAuthAccount<auth(Storage) &Account>(addr)

  let manager =
    parent.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(
      from: HybridCustody.ManagerStoragePath
    ) ?? panic("manager does not exist")

  return manager.getChildAddresses()
}
```

Run it:

```bash
flow scripts execute cadence/scripts/TopShotQuery.cdc --network mainnet 0xfeb88a0fcc175a3d
```

You should see a list of child addresses. If you do not, confirm the parent actually stores a manager at `HybridCustody.ManagerStoragePath`.

```bash
Result: [0xa16b948ba2c9a858]
```

---

## Listing the storage paths found in each child account

Next, for each child, enumerate storage paths. This helps us understand what each account stores before we try to detect NFTs.

:::info

In Cadence, data is stored in a users account in [storage paths].

:::

Update the query to iterate through the child addresses in the `manager` and collect their storage paths and return those paths:

```cadence
import "HybridCustody"

// Map child address -> array of storage path strings (e.g. "storage/SomePath").
access(all) fun main(addr: Address): {Address: [String]} {
  let parent = getAuthAccount<auth(Storage) &Account>(addr)

  let manager =
    parent.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(
      from: HybridCustody.ManagerStoragePath
    ) ?? panic("manager does not exist")

  var pathsByChild: {Address: [String]} = {}

  for child in manager.getChildAddresses() {
    let acct = getAuthAccount<auth(Storage) &Account>(child)
    var paths: [String] = []
    for sp in acct.storage.storagePaths {
      paths.append(sp.toString())
    }
    pathsByChild[child] = paths
  }

  return pathsByChild
}
```

Run it again:

```bash
flow scripts execute cadence/scripts/TopShotQuery.cdc --network mainnet 0xfeb88a0fcc175a3d
```

You should see a map from each child address to its storage paths. This tells us where to look for potential collections.

```bash
Result: {0xa16b948ba2c9a858: ["/storage/flowTokenVault", "/storage/PinnacleNFTCollectionProviderForNFTStorefront", "/storage/BackpackCollection", "/storage/PackNFTCollection", "/storage/HybridCustodyChild_0xd8a7e05a7ac670c0", "/storage/ChildAccount_0xfeb88a0fcc175a3d", "/storage/privateForwardingStorage", "/storage/PinnacleCollection", "/storage/AllDayNFTCollection", "/storage/NFTStorefrontV2", "/storage/PinnaclePackNFTCollection", "/storage/ChildAccount_0x0f566b3217c33c4a", "/storage/dapperUtilityCoinReceiver", "/storage/CapFilterParent0xfeb88a0fcc175a3d", "/storage/ChildCapabilityDelegator_0x0f566b3217c33c4a", "/storage/CapFilterParent0x0f566b3217c33c4a", "/storage/flowUtilityTokenReceiver", "/storage/MomentCollection", "/storage/ChildCapabilityDelegator_0xfeb88a0fcc175a3d", "/storage/NFTStorefrontV20x3cdbb3d569211ff3"]}
```

---

## Detecting NFT collections the parent can control

Now you can identify which stored items are NFT collections that the **parent** can act on. In Cadence, a [_capability_] exposes specific interfaces on a stored value. We look for a capability whose type includes [`{NonFungibleToken.Provider}`] and confirm the parent has access via _Hybrid Custody_.

Update the script to iterate through storage paths found in child accounts to search for providers of the `NonFungibleToken.Provider` type:

```cadence
import "HybridCustody"
import "NonFungibleToken"

// Map child address -> array of type identifiers for NFT collections
// that the parent can control (i.e. has a Provider capability for).
access(all) fun main(addr: Address): {Address: [String]} {
  let parent = getAuthAccount<auth(Storage) &Account>(addr)

  let manager =
    parent.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(
      from: HybridCustody.ManagerStoragePath
    ) ?? panic("manager does not exist")

  let providerType = Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>()
  var controllableTypes: {Address: [String]} = {}

  for child in manager.getChildAddresses() {
    let acct = getAuthAccount<auth(Storage, Capabilities) &Account>(child)
    let childAcct = manager.borrowAccount(addr: child) ?? panic("child account not found")
    var found: [String] = []

    // For each storage path, inspect its controllers (capability controllers).
    for sp in acct.storage.storagePaths {
      for ctrl in acct.capabilities.storage.getControllers(forPath: sp) {
        // If the controller's borrow type does not include Provider, skip.
        if !ctrl.borrowType.isSubtype(of: providerType) {
          continue
        }

        // Verify the parent has an accessible capability through Hybrid Custody.
        if let cap: Capability = childAcct.getCapability(
          controllerID: ctrl.capabilityID,
          type: providerType
        ) {
          let providerCap = cap as! Capability<&{NonFungibleToken.Provider}>
          if providerCap.check() {
            // Record the concrete type identifier behind this capability.
            let typeId = cap.borrow<&AnyResource>()!.getType().identifier
            found.append(typeId)
            // One confirmation per path is sufficient.
            break
          }
        }
      }
    }

    controllableTypes[child] = found
  }

  return controllableTypes
}
```

Run it:

```bash
flow scripts execute cadence/scripts/TopShotQuery.cdc --network mainnet 0xfeb88a0fcc175a3d
```

You should now see type identifiers such as `A.<address>.<Contract>.<Type>` for collections the parent can control. We will use these identifiers to filter for Top Shot.

```bash
Result: {0xa16b948ba2c9a858: ["A.807c3d470888cc48.Backpack.Collection", "A.e4cf4bdc1751c65d.AllDay.Collection", "A.0b2a3299cc857e29.TopShot.Collection"]}
```

---

## Filtering NFT collection to find and return Top Shots

Finally, for each detected collection, [borrow] the collection `{NonFungibleToken.CollectionPublic}`, iterate IDs, resolve `MetadataViews.Display`, and return only Top Shot items. We add a small `isTopShot` predicate that you can customize to your deployment.

:::info

The [borrow] function is how you use a published [_capability_] in your code. In this case, you're borrowing the **public** functionality of Cadence NFTs, which includes [`MetadataViews`] that return a view of the **fully-onchain metadata** for the NFT.

:::

Update the query to borrow a reference to each public collection and return metadata for those that are NBA Top Shots:

```cadence
import "HybridCustody"
import "NonFungibleToken"
import "MetadataViews"

// Map child address -> { tokenId : MetadataViews.Display } for Top Shot NFTs only.
access(all) fun main(addr: Address): {Address: {UInt64: MetadataViews.Display}} {
  let parent = getAuthAccount<auth(Storage) &Account>(addr)

  let manager =
    parent.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(
      from: HybridCustody.ManagerStoragePath
    ) ?? panic("manager does not exist")

  let providerType = Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>()
  let collectionIface: Type = Type<@{NonFungibleToken.CollectionPublic}>()

  // Customize this to match other collections found in the previous step!
  fun isTopShot(_ typeId: String): Bool {
    // Common pattern: typeId.contains("TopShot")
    return typeId.contains("TopShot")
  }

  var result: {Address: {UInt64: MetadataViews.Display}} = {}

  for child in manager.getChildAddresses() {
    let acct = getAuthAccount<auth(Storage, Capabilities) &Account>(child)
    let childAcct = manager.borrowAccount(addr: child) ?? panic("child account not found")

    // First, collect controllable type identifiers for this child.
    var typesWithProvider: [String] = []

    for sp in acct.storage.storagePaths {
      for ctrl in acct.capabilities.storage.getControllers(forPath: sp) {
        if !ctrl.borrowType.isSubtype(of: providerType) {
          continue
        }
        if let cap: Capability = childAcct.getCapability(
          controllerID: ctrl.capabilityID,
          type: providerType
        ) {
          let providerCap = cap as! Capability<&{NonFungibleToken.Provider}>
          if providerCap.check() {
            let typeId = cap.borrow<&AnyResource>()!.getType().identifier
            typesWithProvider.append(typeId)
            break
          }
        }
      }
    }

    var displays: {UInt64: MetadataViews.Display} = {}

    // Walk storage again to borrow the matching collections and read their items.
    acct.storage.forEachStored(fun (path: StoragePath, t: Type): Bool {
      // Only consider types we know are controllable and that match Top Shot.
      var match = false
      for tid in typesWithProvider {
        if tid == t.identifier && isTopShot(tid) {
          match = true
          break
        }
      }
      if !match {
        return true
      }

      // Skip the concrete resource type token; we want the collection interface.
      if t.isInstance(collectionIface) {
        return true
      }

      if let col = acct.storage.borrow<&{NonFungibleToken.CollectionPublic}>(from: path) {
        for id in col.getIDs() {
          let nft = col.borrowNFT(id)!
          if let display = nft.resolveView(Type<MetadataViews.Display>())! as? MetadataViews.Display {
            displays[id] = display
          }
        }
      }
      return true
    })

    result[child] = displays
  }

  return result
}
```

Run it:

```bash
flow scripts execute cadence/scripts/TopShotQuery.cdc --network mainnet 0xfeb88a0fcc175a3d
```

The output is a Cadence representation of:

```
{ Address: { UInt64: MetadataViews.Display } }
```

which maps each child account address to a map of NFT IDs to their display metadata (name, description, thumbnail).

```bash
Result: {0xa16b948ba2c9a858: {44311697: A.1d7e57aa55817448.MetadataViews.Display(name: "Immanuel Quickley 3 Pointer", description: "", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://assets.nbatopshot.com/media/44311697?width=256")), 44274843: A.1d7e57aa55817448.MetadataViews.Display(name: "Rudy Gobert Rim", description: "", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://assets.nbatopshot.com/media/44274843?width=256")), 44219960: A.1d7e57aa55817448.MetadataViews.Display(name: "Sasha Vezenkov 3 Pointer", description: "", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://assets.nbatopshot.com/media/44219960?width=256")), 44300175: A.1d7e57aa55817448.MetadataViews.Display(name: "Malik Monk Assist", description: "", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://assets.nbatopshot.com/media/44300175?width=256")), 43995280: A.1d7e57aa55817448.MetadataViews.Display(name: "Kelly Olynyk 3 Pointer", description: "Regardless of the stakes, regardless of the stage, Kelly Olynyk is calm and collected beyond the arc. Trailing in the fourth quarter of a tight contest, the Utah Jazz big gets to his spot in the corner and buries a triple to claw within one. After a defensive stop on the next possession Olynyk doubles down on the momentum and drains a transition three to give his team the lead. Olynyk finished with 15 points on 5 of 6 shooting in the October 27, 2023 matchup and the Jazz held on for the W at the hands of the LA Clippers.", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://assets.nbatopshot.com/media/43995280?width=256"))}}
```

---

## Extending the script to include AllDay NFTs

Now that you have a working script for Top Shot NFTs, let's extend it to also return NFL All Day NFTs. This demonstrates the flexibility of Cadence scripts - you can easily modify them to answer new questions without changing any contracts.

Update the `isTopShot` function to also include AllDay NFTs:

```cadence
// Customize this to match other collections found in the previous step!
fun isTopShot(_ typeId: String): Bool {
  // Include both TopShot and AllDay NFTs
  return typeId.contains("TopShot") || typeId.contains("AllDay")
}
```

Run the updated script:

```bash
flow scripts execute cadence/scripts/TopShotQuery.cdc --network mainnet 0xfeb88a0fcc175a3d
```

You should now see both Top Shot and AllDay NFTs in the results (truncated for space):

```bash
Result: {0xa16b948ba2c9a858: {44311697: A.1d7e57aa55817448.MetadataViews.Display(name: "Immanuel Quickley 3 Pointer", description: "", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://assets.nbatopshot.com/media/44311697?width=256")), 8220605: A.1d7e57aa55817448.MetadataViews.Display(name: "Zach Ertz Reception", description: "Normally used to overwhelming his NFC East foes in a different, midnight-green attire, Zach Ertz, in his most productive yardage-based game since 2022, showed in Week 2 that productivity remains well within reach. Challenged to a \u{201c}who wants it more\u{201d}-type battle during a corner route, Ertz adjusted to a floated ball, using both a 6-foot-5 frame and pure strength to rip away a potential interception, turning it into a 21-yard catch for himself. The 12-year veteran helped the Washington Commanders \u{2014}  whose seven field goals offset the New York Giants\u{2019} three touchdowns \u{2014} survive for a unique 21-18 win, with Ertz providing four catches (on four targets) and 62 yards on Sept. 15, 2024.", thumbnail: A.1d7e57aa55817448.MetadataViews.HTTPFile(url: "https://media.nflallday.com/editions/3304/media/image?format=jpeg&width=256"))}}
```

This demonstrates how Cadence scripts can be easily modified to answer different questions about the same data, unlike Solidity where you'd need to deploy new contracts or rely on external indexers.

---

## Troubleshooting

- If you see `manager does not exist`, confirm the parent address actually stores a `HybridCustody.Manager` at `HybridCustody.ManagerStoragePath`.
- If you see empty arrays in Step 3, the parent may not have _provider_ access to any collections in those child accounts.
- If you see empty results in Step 4, confirm `isTopShot` matches the identifiers you observed in Step 3.
- If you are not using _Hybrid Custody_, you can adapt Steps 2-4 to use `getAccount(child)` and scan **publicly exposed** `{NonFungibleToken.CollectionPublic}` capabilities, but you will not be able to assert provider access.

## How This Compares to Solidity

- **Solidity views are fixed**: You can only retrieve what the contract author exposed via `view` or `pure` functions. If you need a different aggregation or cross-contract traversal, you typically rely on a _data availability service_ or write a new contract to expose that view.
- **Cadence scripts are flexible**: You compose types across modules, traverse account storage, and read public capabilities at query time. You do not need to redeploy contracts to answer new questions.

Common _data availability service_ examples used in EVM ecosystems:

- The Graph (subgraphs)
- Covalent (unified API)
- Alchemy Enhanced APIs
- Reservoir (NFT market APIs)
- NFTScan (NFT inventory APIs)

## Conclusion

In this tutorial, you learned how to use Cadence scripts to query onchain data directly from Flow's state, without relying on external indexers or APIs. You built a script that can discover and query NFT collections across multiple child accounts using Hybrid Custody, and then extended it to include both NBA Top Shot and NFL All Day NFTs, demonstrating the power and flexibility of Cadence's native data availability.

Now that you have completed the tutorial, you should be able to:

- Query onchain data directly using Cadence scripts without external dependencies
- Use Hybrid Custody to access child account data from parent accounts
- Filter and process NFT collections to extract specific metadata
- Modify scripts to answer different questions about the same onchain data
- Compare Cadence's native data availability with Solidity's limitations
- Build applications that can access any onchain data in real-time

This approach gives you the freedom to build applications that can access any onchain data in real-time, making Flow's native data availability a powerful tool for developers building on Flow.

<!-- Reference links -->

[NBA Top Shot]: https://nbatopshot.com/
[account linking tutorial]: ../account-management/account-linking-with-dapper.md
[_Hybrid Custody_]: ../account-management/index.md
[dependency manager]: ../../../build/tools/flow-cli/dependency-manager.md
[Hybrid Custody]: ../account-management/index.md
[Flow accounts]: ../../../build/cadence/basics/accounts.md
[Cadence]: https://cadence-lang.org/docs/tutorial/first-steps
[Flow CLI Commands]: ../../../build/tools/flow-cli/commands.md
[storage paths]: https://cadence-lang.org/docs/tutorial/resources#storage-paths
[_capability_]: https://cadence-lang.org/docs/language/capabilities
[`{NonFungibleToken.Provider}`]: https://github.com/onflow/flow-nft/blob/21c5e18a0985528b53931dc14c55332b3b47939e/contracts/NonFungibleToken.cdc#L154
[borrow]: https://cadence-lang.org/docs/language/capabilities#borrowing-public-capabilities-with-borrow
[NFL All Day]: https://nflallday.com/
