---
title: Building Walletless Applications Using Child Accounts
sidebar_position: 1
description: Learn how to implement progressive onboarding flows using Flow's Hybrid Custody model. Create walletless applications, manage child accounts, and enable account linking for seamless user experiences.
keywords:
  - child accounts
  - hybrid custody
  - account linking
  - walletless onboarding
  - progressive onboarding
  - Flow accounts
  - custody model
  - account delegation
  - blockchain onboarding
  - account capabilities
  - parent accounts
  - account management
  - Flow development
  - account security
  - user onboarding
---

In this doc, we'll dive into a progressive onboarding flow, including the Cadence scripts & transactions that go into
its implementation in your app. These components will enable any implementing app to create a custodial account, mediate
the user's onchain actions on their behalf, and later delegate access of that app-created account to the user's wallet.
We'll refer to this custodial pattern as the Hybrid Custody Model and the process of delegating control of the app
account as Account Linking.

## Objectives

- Create a [walletless onboarding](https://flow.com/post/flow-blockchain-mainstream-adoption-easy-onboarding-wallets)
  transaction
- Link an existing app account as a child to a newly authenticated parent account
- Get your app to recognize "parent" accounts along with any associated "child" accounts
- Put it all together to create a blockchain-native onboarding transaction
- View fungible and non-fungible Token metadata relating to assets across all of a user's associated accounts - their
  wallet-mediated "parent" account and any "child" accounts
- Facilitate transactions acting on assets in child accounts

## Point of Clarity

Before diving in, let's make a distinction between "account linking" and "linking accounts".

### Account Linking

:::info

Note that since account linking is a sensitive action, transactions where an account may be linked are designated by a
topline pragma `#allowAccountLinking`. This lets wallet providers inform users that their account may be linked in the
signed transaction.

:::

Very simply, account linking is a [feature in Cadence](https://github.com/onflow/flips/pull/53) that let's an
[Account](https://cadence-lang.org/docs/language/accounts#authaccount) create a
[Capability](https://cadence-lang.org/docs/language/capabilities) on itself.

Below is an example demonstrating how to issue an `&Account` Capability from a signing account

transaction:

```cadence link_account.cdc
#allowAccountLinking

transaction(linkPathSuffix: String) {
    prepare(signer: auth(IssueAccountCapabilityController) &Account) {
        // Issues a fully-entitled Account Capability
        let accountCapability = signer.capabilities
            .account
            .issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()
    }
}
```

From there, the signing account can retrieve the privately linked `&Account` Capability and delegate it to another
account, revoking the Capability if they wish to revoke delegated access.

Note that in order to link an account, a transaction must state the `#allowAccountLinking` pragma in the top line of the
transaction. This is an interim safety measure so that wallet providers can notify users they're about to sign a
transaction that may create a Capability on their `Account`.

### Linking Accounts

Linking accounts leverages this account link, otherwise known as an **`&Account` Capability**, and encapsulates it. The
[components and actions](https://github.com/onflow/flips/pull/72) involved in this process - what the Capability is
encapsulated in, the collection that holds those encapsulations, etc. is what we'll dive into in this doc.

## Terminology

**Parent-Child accounts** - For the moment, we'll call the account created by the app the "child" account and the
account receiving its `&Account` Capability the "parent" account. Existing methods of account access & delegation (i.e.
keys) still imply ownership over the account, but insofar as linked accounts are concerned, the account to which both
the user and the app share access via `&Account` Capability will be considered the "child" account.

**Walletless onboarding** - An onboarding flow whereby an app creates a custodial account for a user, onboarding them to
the app, obviating the need for user wallet authentication.

**Blockchain-native onboarding** - Similar to the already familiar Web3 onboarding flow where a user authenticates with
their existing wallet, an app onboards a user via wallet authentication while additionally creating a custodial app
account and linking it with the authenticated account, resulting in a "hybrid custody" model.

**Hybrid Custody Model** - A custodial pattern in which an app and a user maintain access to an app created account and
user access to that account has been mediated via account linking.

**Account Linking** - Technically speaking, account linking in our context consists of giving some other account an
`&Account` Capability from the granting account. This Capability is maintained in standardized resource called a
`HybridCustody.Manager`, providing its owning user access to any and all of their linked accounts.

**Progressive Onboarding** - An onboarding flow that walks a user up to self-custodial ownership, starting with
walletless onboarding and later linking the app account with the user's authenticated wallet once the user chooses to do
so.

**Restricted Child Account** - An account delegation where the access on the delegating account is restricted according
to rules set by the linking child account. The distinctions between this and the subsequent term ("owned" account) will
be expanding on later.

**Owned Account** - An account delegation where the delegatee has unrestricted access on the delegating child account,
thereby giving the delegatee presiding authority superseding any other "restricted" parent accounts.

## Account Linking

Linking an account is the process of delegating account access via `&Account` Capability. Of course, we want to do this
in a way that allows the receiving account to maintain that Capability and allows easy identification of the accounts on
either end of the linkage - the user's main "parent" account and the linked "child" account. This is accomplished in the
`HybridCustody` contract which we'll continue to use in this guidance.

### Prerequisites

Since account delegation is mediated by developer-defined rules, you should make sure to first configure the resources
that contain those rules. Contracts involved in defining and enforcing this ruleset are
[`CapabilityFilter`](https://github.com/onflow/hybrid-custody/blob/main/contracts/CapabilityFilter.cdc) and
[`CapabilityFactory`](https://github.com/onflow/hybrid-custody/blob/main/contracts/CapabilityFactory.cdc). The former
enumerates those types that are and are not accessible from a child account while the latter enables the access of those
allowable Capabilities such that the returned values can be properly typed - e.g. retrieving a Capability that can be
cast to `Capability<&NonFungibleToken.Collection>` for example.

Here's how you would configure an `AllowlistFilter` and add allowed types to it:

```cadence setup_allow_all_filter.cdc
import "CapabilityFilter"

transaction(identifiers: [String]) {
    prepare(acct: auth(BorrowValue, SaveValue, StorageCapabilities, PublishCapability, UnpublishCapability) &Account) {
        // Setup the AllowlistFilter
        if acct.storage.borrow<&AnyResource>(from: CapabilityFilter.StoragePath) == nil {
            acct.storage.save(
                <-CapabilityFilter.createFilter(Type<@CapabilityFilter.AllowlistFilter>()),
                to: CapabilityFilter.StoragePath)
        }

        // Ensure the AllowlistFilter is linked to the expected PublicPath
        acct.capabilities.unpublish(CapabilityFilter.PublicPath)
        acct.capabilities.publish(
            acct.capabilities.storage.issue<&{CapabilityFilter.Filter}>(CapabilityFilter.StoragePath),
            at: CapabilityFilter.PublicPath
        )

        // Get a reference to the filter
        let filter = acct.storage.borrow<auth(CapabilityFilter.Add) &CapabilityFilter.AllowlistFilter>(
                from: CapabilityFilter.StoragePath
            ) ?? panic("filter does not exist")

        // Add the given type identifiers to the AllowlistFilter
        // **Note:** the whole transaction fails if any of the given identifiers are malformed
        for identifier in identifiers {
            let c = CompositeType(identifier)!
            filter.addType(c)
        }
    }
}
```

And the following transaction configures a `CapabilityFactory.Manager`, adding NFT-related `Factory` objects:

:::info

Note that the Manager configured here enables retrieval of castable Capabilities. It's recommended that you implement
Factory resource definitions to support any NFT Collections related with the use of your application so that users can
retrieve Typed Capabilities from accounts linked from your app.

:::

```cadence setup_factory.cdc
import "NonFungibleToken"

import "CapabilityFactory"
import "NFTCollectionPublicFactory"
import "NFTProviderAndCollectionFactory"
import "NFTProviderFactory"
import "NFTCollectionFactory"

transaction {
    prepare(acct: auth(BorrowValue, SaveValue, StorageCapabilities, PublishCapability, UnpublishCapability) &Account) {
        // Check for a stored Manager, saving if not found
        if acct.storage.borrow<&AnyResource>(from: CapabilityFactory.StoragePath) == nil {
            let f <- CapabilityFactory.createFactoryManager()
            acct.storage.save(<-f, to: CapabilityFactory.StoragePath)
        }

        // Check for Capabilities where expected, linking if not found
        acct.capabilities.unpublish(CapabilityFactory.PublicPath)
        acct.capabilities.publish(
            acct.capabilities.storage.issue<&CapabilityFactory.Manager>(CapabilityFactory.StoragePath),
            at: CapabilityFactory.PublicPath
        )

        assert(
            acct.capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath).check(),
            message: "CapabilityFactory is not setup properly"
        )

        let manager = acct.storage.borrow<auth(CapabilityFactory.Add) &CapabilityFactory.Manager>(from: CapabilityFactory.StoragePath)
            ?? panic("manager not found")

        /// Add generic NFT-related Factory implementations to enable castable Capabilities from this Manager
        manager.updateFactory(Type<&{NonFungibleToken.CollectionPublic}>(), NFTCollectionPublicFactory.Factory())
        manager.updateFactory(Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(), NFTProviderAndCollectionFactory.Factory())
        manager.updateFactory(Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(), NFTProviderFactory.Factory())
        manager.updateFactory(Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(), NFTCollectionFactory.WithdrawFactory())
        manager.updateFactory(Type<&{NonFungibleToken.Collection}>(), NFTCollectionFactory.Factory())
    }
}
```

![resources/hybrid_custody_high_level](./resources/hybrid_custody_high_level.png)

_In this scenario, a user custodies a key for their main account which maintains access to a wrapped `Account`
Capability, providing the user restricted access on the app account. The app maintains custodial access to the account
and regulates the access restrictions to delegatee "parent" accounts._

Linking accounts can be done in one of two ways. Put simply, the child account needs to get the parent an `Account`
Capability, and the parent needs to save that Capability so they can retain access. This delegation must be done manner
that represents each side of the link while safeguarding the integrity of any access restrictions an application puts in
place on delegated access.

We can achieve issuance from the child account and claim from the parent account pattern by either:

1. Leveraging [Cadence's `Account.Inbox`](https://cadence-lang.org/docs/language/accounts#account-inbox) to publish the
   Capability from the child account & have the parent claim the Capability in a subsequent transaction.
2. Executing a multi-party signed transaction, signed by both the child and parent accounts.

Let's take a look at both.

:::info

You'll want to consider whether you would like the parent account to be configured with some app-specific resources or
Capabilities and compose you multisig or claim transactions to include such configurations.

For example, if your app deals with specific NFTs, you may want to configure the parent account with Collections for
those NFTs so the user can easily transfer them between their linked accounts.

:::

### Publish & Claim

#### Publish

Here, the account delegating access to itself links its `&Account` Capability, and publishes it to be claimed by the
designated parent account.

```cadence publish_to_parent.cdc
import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"
import "CapabilityDelegator"

transaction(parent: Address, factoryAddress: Address, filterAddress: Address) {
    prepare(acct: auth(BorrowValue) &Account) {
        // NOTE: The resources and Capabilities needed for this transaction are assumed to have be pre-configured

        // Borrow the OwnedAccount resource
        let owned = acct.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(
                from: HybridCustody.OwnedAccountStoragePath
            ) ?? panic("owned account not found")

        // Get a CapabilityFactory.Manager Capability
        let factory = getAccount(factoryAddress).capabilities
            .get<&CapabilityFactory.Manager>(
                CapabilityFactory.PublicPath
            )
        assert(factory.check(), message: "factory address is not configured properly")

        // Get a CapabilityFilter.Filter Capability
        let filter = getAccount(filterAddress).capabilities
            .get<&{CapabilityFilter.Filter}>(
                CapabilityFilter.PublicPath
            )
        assert(filter.check(), message: "capability filter is not configured properly")

        // Publish the OwnedAccount to the designated parent account
        owned.publishToParent(parentAddress: parent, factory: factory, filter: filter)
    }
}
```

#### Claim

On the other side, the receiving account claims the published `ChildAccount` Capability, adding it to the signer's
`HybridCustody.Manager.childAccounts` indexed on the child account's Address.

```cadence redeem_account.cdc
import "MetadataViews"
import "ViewResolver"

import "HybridCustody"
import "CapabilityFilter"

transaction(childAddress: Address, filterAddress: Address?, filterPath: PublicPath?) {
    prepare(acct: auth(Storage, Capabilities, Inbox) &Account) {
        // Get a Manager filter if a path is provided
        var filter: Capability<&{CapabilityFilter.Filter}>? = nil
        if filterAddress != nil && filterPath != nil {
            filter = getAccount(filterAddress!).capabilities
                .get<&{CapabilityFilter.Filter}>(
                    filterPath!
                )
        }

        // Configure a Manager if not already configured
        if acct.storage.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
            let m <- HybridCustody.createManager(filter: filter)
            acct.storage.save(<- m, to: HybridCustody.ManagerStoragePath)

            for c in acct.capabilities.storage.getControllers(forPath: HybridCustody.ManagerStoragePath) {
                c.delete()
            }

            acct.capabilities.unpublish(HybridCustody.ManagerPublicPath)

            acct.capabilities.publish(
                acct.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(
                    HybridCustody.ManagerStoragePath
                ),
                at: HybridCustody.ManagerPublicPath
            )

            acct.capabilities
                .storage
                .issue<auth(HybridCustody.Manage) &{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(
                    HybridCustody.ManagerStoragePath
                )
        }

        // Claim the published ChildAccount Capability
        let inboxName = HybridCustody.getChildAccountIdentifier(acct.address)
        let cap = acct.inbox.claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(inboxName, provider: childAddress)
            ?? panic("child account cap not found")

        // Get a reference to the Manager and add the account & add the child account
        let manager = acct.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("manager no found")
        manager.addAccount(cap: cap)
    }
}
```

### Multi-Signed Transaction

We can combine the two transactions in [Publish](#publish) and [Claim](#claim) into a single multi-signed transaction to
achieve Hybrid Custody in a single step.

:::info

Note that while the following code links both accounts in a single transaction, in practicality you may find it easier
to execute publish and claim transactions separately depending on your custodial infrastructure.

:::

```cadence setup_multi_sig.cdc
#allowAccountLinking

import "HybridCustody"

import "CapabilityFactory"
import "CapabilityDelegator"
import "CapabilityFilter"

import "MetadataViews"
import "ViewResolver"

transaction(parentFilterAddress: Address?, childAccountFactoryAddress: Address, childAccountFilterAddress: Address) {
    prepare(childAcct: auth(Storage, Capabilities) &Account, parentAcct: auth(Storage, Capabilities, Inbox) &Account) {
        // --------------------- Begin setup of child account ---------------------
        var optCap: Capability<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>? = nil
        let t = Type<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()
        for c in childAcct.capabilities.account.getControllers() {
            if c.borrowType.isSubtype(of: t) {
                optCap = c.capability as! Capability<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>
                break
            }
        }

        if optCap == nil {
            optCap = childAcct.capabilities.account.issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()
        }
        let acctCap = optCap ?? panic("failed to get account capability")

        if childAcct.storage.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
            let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
            childAcct.storage.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)
        }

        for c in childAcct.capabilities.storage.getControllers(forPath: HybridCustody.OwnedAccountStoragePath) {
            c.delete()
        }

        // configure capabilities
        childAcct.capabilities.storage.issue<&{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath)
        childAcct.capabilities.publish(
            childAcct.capabilities.storage.issue<&{HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath),
            at: HybridCustody.OwnedAccountPublicPath
        )

        // --------------------- End setup of child account ---------------------

        // --------------------- Begin setup of parent account ---------------------
        var filter: Capability<&{CapabilityFilter.Filter}>? = nil
        if parentFilterAddress != nil {
            filter = getAccount(parentFilterAddress!).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        }

        if parentAcct.storage.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
            let m <- HybridCustody.createManager(filter: filter)
            parentAcct.storage.save(<- m, to: HybridCustody.ManagerStoragePath)
        }

        for c in parentAcct.capabilities.storage.getControllers(forPath: HybridCustody.ManagerStoragePath) {
            c.delete()
        }

        parentAcct.capabilities.publish(
            parentAcct.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath),
            at: HybridCustody.ManagerPublicPath
        )
        parentAcct.capabilities.storage.issue<auth(HybridCustody.Manage) &{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath)

        // --------------------- End setup of parent account ---------------------

        // Publish account to parent
        let owned = childAcct.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
            ?? panic("owned account not found")

        let factory = getAccount(childAccountFactoryAddress).capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath)
        assert(factory.check(), message: "factory address is not configured properly")

        let filterForChild = getAccount(childAccountFilterAddress).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        assert(filterForChild.check(), message: "capability filter is not configured properly")

        owned.publishToParent(parentAddress: parentAcct.address, factory: factory, filter: filterForChild)

        // claim the account on the parent
        let inboxName = HybridCustody.getChildAccountIdentifier(parentAcct.address)
        let cap = parentAcct.inbox.claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(inboxName, provider: childAcct.address)
            ?? panic("child account cap not found")

        let manager = parentAcct.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("manager no found")

        manager.addAccount(cap: cap)
    }
}
```

## Onboarding Flows

Given the ability to establish an account and later delegate access to a user, apps are freed from the constraints of
dichotomous custodial & self-custodial paradigms. A developer can choose to onboard a user via traditional Web2 identity
and later delegate access to the user's wallet account. Alternatively, an app can enable wallet authentication at the
outset, creating an app-specific account & linking with the user's wallet account. As specified above, these two flows
are known as "walletless" and "blockchain-native" onboarding respectively. Developers can choose to implement one for
simplicity or both for maximum flexibility.

### Walletless Onboarding

The following transaction creates an account, funding creation via the signer and adding the provided public key. You'll
notice this transaction is pretty much your standard account creation. The magic for you will be how you custody the key
for this account (locally, KMS, wallet service, etc.) in a manner that allows your app to mediate onchain interactions
on behalf of your user.

```cadence walletless_onboarding
import "FungibleToken"
import "FlowToken"

transaction(pubKey: String, initialFundingAmt: UFix64) {

	prepare(signer: auth(BorrowValue) &Account) {

		/* --- Account Creation --- */
		// **NOTE:** your app may choose to separate creation depending on your custodial model)
		//
		// Create the child account, funding via the signer
		let newAccount = Account(payer: signer)
		// Create a public key for the new account from string value in the provided arg
		// **NOTE:** You may want to specify a different signature algo for your use case
		let key = PublicKey(
			publicKey: pubKey.decodeHex(),
			signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
		)
		// Add the key to the new account
		// **NOTE:** You may want to specify a different hash algo & weight best for your use case
		newAccount.keys.add(
			publicKey: key,
			hashAlgorithm: HashAlgorithm.SHA3_256,
			weight: 1000.0
		)

		/* --- (Optional) Additional Account Funding --- */
		//
		// Fund the new account if specified
		if initialFundingAmt > 0.0 {
			// Get a vault to fund the new account
			let fundingProvider = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
					from: /storage/flowTokenVault
				)!
			// Fund the new account with the initialFundingAmount specified
			let receiver = newAccount.capabilities.get<&FlowToken.Vault>(
                    /public/flowTokenReceiver
                ).borrow()!
			let fundingVault <-fundingProvider.withdraw(
					amount: initialFundingAmt
				)
            receiver.deposit(from: <-fundingVault)
		}

		/* --- Continue with use case specific setup --- */
		//
		// At this point, the newAccount can further be configured as suitable for
		// use in your app (e.g. Setup a Collection, Mint NFT, Configure Vault, etc.)
		// ...
	}
}
```

### Blockchain-Native Onboarding

This onboarding flow is really a single-transaction composition of the steps covered above. This is a testament to the
power of the complex transactions you can compose on Flow with Cadence!

:::info

Recall the [prerequisites](#prerequisites) needed to be satisfied before linking an account:

1. CapabilityFilter Filter saved and linked
2. CapabilityFactory Manager saved and linked as well as Factory implementations supporting the Capability Types you'll
   want accessible from linked child accounts as Typed Capabilities.

:::

#### Account Creation & Linking

Compared to walletless onboarding where a user does not have a Flow account, blockchain-native onboarding assumes a user
already has a wallet configured and immediately links it with a newly created app account. This enables the app to sign
transactions on the user's behalf via the new child account while immediately delegating control of that account to the
onboarding user's main account.

After this transaction, both the custodial party (presumably the client/app) and the signing parent account will have
access to the newly created account - the custodial party via key access and the parent account via their
`HybridCustody.Manager` maintaining the new account's `ChildAccount` Capability.

```cadence blockchain_native_onboarding.cdc
#allowAccountLinking

import "FungibleToken"
import "FlowToken"
import "MetadataViews"
import "ViewResolver"

import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"
import "CapabilityDelegator"

transaction(
    pubKey: String,
    initialFundingAmt: UFix64,
    factoryAddress: Address,
    filterAddress: Address
) {

    prepare(parent: auth(Storage, Capabilities, Inbox) &Account, app: auth(Storage, Capabilities) &Account) {
        /* --- Account Creation --- */
        //
        // Create the child account, funding via the signing app account
        let newAccount = Account(payer: app)
        // Create a public key for the child account from string value in the provided arg
        // **NOTE:** You may want to specify a different signature algo for your use case
        let key = PublicKey(
            publicKey: pubKey.decodeHex(),
            signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
        )
        // Add the key to the new account
        // **NOTE:** You may want to specify a different hash algo & weight best for your use case
        newAccount.keys.add(
            publicKey: key,
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 1000.0
        )

        /* --- (Optional) Additional Account Funding --- */
        //
        // Fund the new account if specified
        if initialFundingAmt > 0.0 {
            // Get a vault to fund the new account
            let fundingProvider = app.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
            // Fund the new account with the initialFundingAmount specified
            newAccount.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
                .borrow()!
                .deposit(
                    from: <-fundingProvider.withdraw(
                        amount: initialFundingAmt
                    )
                )
        }

        /* Continue with use case specific setup */
        //
        // At this point, the newAccount can further be configured as suitable for
        // use in your dapp (e.g. Setup a Collection, Mint NFT, Configure Vault, etc.)
        // ...

        /* --- Link the AuthAccount Capability --- */
        //
        let acctCap = newAccount.capabilities.account.issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()

        // Create a OwnedAccount & link Capabilities
        let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
        newAccount.storage.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)

        newAccount.capabilities.storage.issue<&{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath)
        newAccount.capabilities.publish(
            newAccount.capabilities.storage.issue<&{HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath),
            at: HybridCustody.OwnedAccountPublicPath
        )

        // Get a reference to the OwnedAccount resource
        let owned = newAccount.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)!

        // Get the CapabilityFactory.Manager Capability
        let factory = getAccount(factoryAddress).capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath)
        assert(factory.check(), message: "factory address is not configured properly")

        // Get the CapabilityFilter.Filter Capability
        let filter = getAccount(filterAddress).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        assert(filter.check(), message: "capability filter is not configured properly")

        // Configure access for the delegatee parent account
        owned.publishToParent(parentAddress: parent.address, factory: factory, filter: filter)

        /* --- Add delegation to parent account --- */
        //
        // Configure HybridCustody.Manager if needed
        if parent.storage.borrow<&AnyResource>(from: HybridCustody.ManagerStoragePath) == nil {
            let m <- HybridCustody.createManager(filter: filter)
            parent.storage.save(<- m, to: HybridCustody.ManagerStoragePath)

            for c in parent.capabilities.storage.getControllers(forPath: HybridCustody.ManagerStoragePath) { 
                c.delete()
            }

            // configure Capabilities
            parent.capabilities.storage.issue<&{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath)
            parent.capabilities.publish(
                parent.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath),
                at: HybridCustody.ManagerPublicPath
            )
        }

        
        // Claim the ChildAccount Capability
        let inboxName = HybridCustody.getChildAccountIdentifier(parent.address)
        let cap = parent
            .inbox
            .claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(
                inboxName,
                provider: newAccount.address
            ) ?? panic("child account cap not found")
        
        // Get a reference to the Manager and add the account
        let managerRef = parent.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("manager not found")
        managerRef.addAccount(cap: cap)
    }
}
```

## Funding & Custody Patterns

Aside from implementing onboarding flows & account linking, you'll want to also consider the account funding & custodial
pattern appropriate for the app you're building. The only pattern compatible with walletless onboarding (and therefore
the only one showcased above) is one in which the app custodies the child account's key and funds account creation.

In general, the funding pattern for account creation will determine to some extent the backend infrastructure needed to
support your app and the onboarding flow your app can support. For example, if you want to to create a service-less
client (a totally local app without backend infrastructure), you could forego walletless onboarding in favor of a
user-funded blockchain-native onboarding to achieve a hybrid custody model. Your app maintains the keys to the app
account locally to sign on behalf of the user, and the user funds the creation of the the account, linking to their main
account on account creation. This would be a **user-funded, app custodied** pattern.

Again, custody may deserve some regulatory insight depending on your jurisdiction. If building for production, you'll
likely want to consider these non-technical implications in your technical decision-making. Such is the nature of
building in crypto.

Here are the patterns you might consider:

### App-Funded, App-Custodied

If you want to implement walletless onboarding, you can stop here as this is the only compatible pattern. In this
scenario, a backend app account funds the creation of a new account and the app custodies the key for said account
either on the user's device or some backend KMS.

### App-Funded, User-Custodied

In this case, the backend app account funds account creation, but adds a key to the account which the user custodies. In
order for the app to act on the user's behalf, it has to be delegated access via `&Account` Capability which the backend
app account would maintain in a `HybridCustody.Manager`. This means that the new account would have two parent accounts
- the user's and the app.

While this pattern provides the user maximum ownership and authority over the child account, it may present unique
considerations and edge cases for you as a builder depending on your app's access to the child account. Also note that
this and the following patterns are incompatible with walletless onboarding in that the user must have a wallet
pre-configured before onboarding.

### User-Funded, App-Custodied

As mentioned above, this pattern unlocks totally service-less architectures - just a local client & smart contracts. An
authenticated user signs a transaction creating an account, adding the key provided by the client, and linking the
account as a child account. At the end of the transaction, hybrid custody is achieved and the app can sign with the
custodied key on the user's behalf using the newly created account.

### User-Funded, User-Custodied

While perhaps not useful for most apps, this pattern may be desirable for advanced users who wish to create a shared
access account themselves. The user funds account creation, adding keys they custody, and delegates secondary access to
some other account.