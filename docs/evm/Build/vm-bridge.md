---
title: VM Bridge
sidebar_label: VM Bridge
sidebar_position: 1
---

# VM Bridge

Flow maintains a VM bridge, which enables Cadence to interact with FlowEVM. The entrypoint to FlowEVM is always through this VM bridge. The VM bridge is responsible for creating cadence owned accounts on FlowEVM and their corresponding resources on Cadence (read more on cadence owned accounts [here](/accounts)). The VM bridge is also responsible for moving fungible tokens and non-fungible tokens between Cadence and FlowEVM. 

The Flow VM bridge outlines the architecture and implementation of the VM bridge. Read the FLIP [here](https://github.com/onflow/flips/pull/233).
