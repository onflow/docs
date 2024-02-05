---
title: Cross-VM Bridge
sidebar_label: Cross-VM Bridge
sidebar_position: 1
---

# Cross-VM Bridge

Flow provides the cross-VM bridge which enables Cadence to interact with FlowEVM in order to bridge tokens, fungible and 
non-fungible, from one VM environment to the other. Specifically, the cross-VM bridge is contract-based, trustless 
protocol enabling the automated bridging of tokens from Cadence into FlowEVM into the corresponding ERC-20 and ERC-721 
token types. In the opposite direction, it supports bridging of arbitrary FlowEVM ERC-20 and ERC-721 tokens into 
the corresponding Cadence FT or NFT token types. The cross-VM bridge internalizes the capabilities to deploy new token 
contracts in either VM state as needed and resolves access to, and maintains links between, contracts. It additionally 
automates account and contract calls to enforce source VM asset burn or lock, and target VM token mint or unlock. 

Developers wishing to use the cross-VM bridge will be required a Cadence transaction. The cross-VM bridge functionality 
is currently not available natively in EVM. 

The Flow VM bridge outlines the architecture and implementation of the VM bridge. Read the FLIP 
[here](https://github.com/onflow/flips/pull/233).
