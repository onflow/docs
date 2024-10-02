---
title: Cross-VM Bridge
sidebar_label: Cross-VM Bridge
sidebar_position: 7
---

# Cross-VM Bridge

Flow provides the cross-VM bridge which enables the movement of fungible and non-fungible tokens between Cadence & EVM.
The cross-VM bridge is a contract-based, trustless protocol enabling the automated and atomic bridging of tokens from
Cadence into EVM with their corresponding ERC-20 and ERC-721 token types. In the opposite direction, it supports
bridging of arbitrary ERC-20 and ERC-721 tokens from EVM to Cadence as their corresponding FT or NFT token types.

The cross-VM bridge internalizes the capabilities to deploy new token contracts in either VM state as needed, resolving
access to, and maintaining links between associated contracts. It additionally automates account and contract calls to
enforce source VM asset burn or lock, and target VM token mint or unlock.

Developers wishing to use the cross-VM bridge will be required to use a Cadence transaction as cross-VM bridging
functionality is currently not available natively in EVM. By extension, this means that the EVM account bridging from
EVM to Cadence must be a [`CadenceOwnedAccount` (COA)](../evm/cadence/interacting-with-coa.md) as this is the only EVM
account type that can be controlled from the Cadence runtime.

This [FLIP](https://github.com/onflow/flips/pull/233) outlines the architecture and implementation of the VM bridge.
