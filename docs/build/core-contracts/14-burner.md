---
title: Flow Burner Contract Address
sidebar_position: 14
sidebar_label: Burner
---

# Contract

The [Burner]() contract provides a way for resources to define
custom logic that is executed when the resource is destroyed.
Resources that want to utilize this functionality should implement
the `Burner.Burnable` interface which requires that they include
a `burnCallback()` function that includes the custom logic.

It is recommended that regardless of the resource, all users and developers
should use `Burner.burn()` when destroying a resource instead of `destroy`.

| Network | Contract Address                                                               |
| ------- | ------------------------------------------------------------------------------ |
| Cadence Testing Framework | `0x0000000000000001` |
| Emulator | `0xee82856bf20e2aa6` |
| Testnet | [`0x294e44e1ec6993c6`](https://contractbrowser.com/account/0x294e44e1ec6993c6) |
| Mainnet | [`0xd8a7e05a7ac670c0`](https://contractbrowser.com/account/0xd8a7e05a7ac670c0) |