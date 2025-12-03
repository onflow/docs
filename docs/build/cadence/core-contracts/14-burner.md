---
title: Flow Burner Contract Address
sidebar_position: 14
sidebar_label: Burner
description: Learn about Flow's Burner contract that enables custom destruction logic for resources. Understand how to implement the Burnable interface and safely destroy resources with custom callbacks.
keywords:
  - resource burning
  - Burner contract
  - resource destruction
  - burn callback
  - Burnable interface
  - resource management
  - Flow resources
  - custom destruction
  - safe burning
  - resource cleanup
  - Flow protocol
  - contract safety
  - resource lifecycle
  - destruction logic
  - burn operations
---

# Flow Burner Contract Address

The [Burner](https://github.com/onflow/flow-ft/blob/master/contracts/utility/Burner.cdc) contract provides a way for resources to define custom logic that is executed when the resource is destroyed. Resources that want to use this functionality should implement the `Burner.Burnable` interface which requires that they include a `burnCallback()` function that includes the custom logic.

We recommend that, regardless of the resource, all users and developers should use `Burner.burn()` when they destroy a resource instead of `destroy`.

| Network | Contract Address                                                               |
| ------- | ------------------------------------------------------------------------------ |
| Cadence Testing Framework | `0x0000000000000001` |
| Emulator | `0xee82856bf20e2aa6` |
| Testnet | [`0x294e44e1ec6993c6`] |
| Mainnet | [`0xd8a7e05a7ac670c0`] |

<!-- Reference-style links, will not render on page -->

[Burner]: https://github.com/onflow/flow-ft/blob/master/contracts/utility/Burner.cdc
[`0x294e44e1ec6993c6`]: https://contractbrowser.com/account/0x294e44e1ec6993c6
[`0xd8a7e05a7ac670c0`]: https://contractbrowser.com/account/0xd8a7e05a7ac670c0 