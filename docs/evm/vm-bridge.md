---
title: Cross-VM Bridge
sidebar_label: Cross-VM Bridge
sidebar_position: 7
---

# Cross-VM Bridge

Flow provides the cross-VM bridge which enables Cadence to interact with EVM on Flow in order to bridge tokens, fungible and non-fungible, from one VM environment to the other. The cross-VM bridge is a contract-based, trustless protocol enabling the automated bridging of tokens from Cadence into EVM with  the corresponding ERC-20 and ERC-721 token types. In the opposite direction, it supports bridging of arbitrary EVM ERC-20 and ERC-721 tokens into the corresponding Cadence FT or NFT token types. The cross-VM bridge internalizes the capabilities to deploy new token contracts in either VM state as needed, resolving access to, and maintaining links between , contracts. It additionally automates account and contract calls to enforce source VM asset burn or lock, and target VM token mint or unlock.

Developers wishing to use the cross-VM bridge will be required to use a Cadence transaction as cross-VM bridging functionality is currently not available natively in EVM.

This [FLIP](https://github.com/onflow/flips/pull/233) outlines the architecture and implementation of the VM bridge.
