---
title: Protocol State Bootstrapping
description: How to bootstrap a new or existing node
---

When a node joins the network, it bootstraps its local database using a trusted initialization file, called a Root Snapshot.
Most node operators will use the `Spork Root Snapshot` file distributed during the [spork process](./spork.md).
This page will explain how the bootstrapping process works and how to use it in general.

For guides covering specific bootstrapping workflows, see:
- [Node Bootstrap](./node-bootstrap.md) for bootstrapping a newly joined node.
- [Reclaim Disk](./reclaim-disk.md) for bootstrapping from a recent snapshot to recover disk space.

<Callout type="info">
   This page covers only Protocol State bootstrapping and applies to Access, Collection, Consensus, & Verification Nodes.
   Execution Nodes also need to bootstrap an Execution State database, which is not covered here.
</Callout>

## Node Startup

When a node starts up, it will first check its database status. 
If its local database is already bootstrapped, it will start up and begin operating.
If its local database is not already bootstrapped, it will attempt to bootstrap using a Root Snapshot.

There are two sources for a non-bootstrapped node to obtain a Root Snapshot:
1. Root Snapshot file in the `bootstrap` folder
2. Dynamic Startup flags, which will cause the node to download a Root Snapshot from a specified Access Node

The node software requires that only one of the above options is provided.

## Using a Root Snapshot File

<Callout type="info">
   If your node already has a bootstrapped database, the Root Snapshot file will be ignored. If both a Root Snapshot and Dynamic Startup flags are present, the node will not startup.
</Callout>

Using a Root Snapshot file is more flexible but more involved for operators compared to Dynamic Startup.

A file in `$BOOTDIR/public-root-information` named `root-protocol-state-snapshot.json` will be read and used as the Root Snapshot for bootstrapping the database.

### Instructions

1. Obtain a Root Snapshot file (see below for options)
2. Ensure your node is stopped and does not already have a bootstrapped database.
3. Move the Root Snapshot file to `$BOOTDIR/public-root-information/root-protocol-state-snapshot.json`, where `$BOOTDIR` is the value passed to the `--bootstrapdir` flag.
4. Start your node. 

### Obtain Root Snapshot File using Flow CLI

[Flow CLI](../../../tools/flow-cli/index.md) supports downloading the most recently sealed Root Snapshot from an Access Node using the [`flow snapshot save`](../../../tools/flow-cli/utils/snapshot-save.md) command.

When using this method: 
- ensure you connect to an Access Node you operate or trust
- ensure you use the [`--network-key`](../../../tools/flow-cli/utils/snapshot-save#network-key) flag so the connection is encrypted

### Obtain Root Snapshot File from Protocol database

If you have an existing node actively participating in the network, you can obtain a Root Snapshot using its database.

1. Obtain a copy of the Flow `util` tool and ensure it is in your `$PATH`. This tool is distributed during sporks, or you can build a copy from [here](https://github.com/onflow/flow-go/tree/master/cmd/util).
2. Stop the existing node.
3. Construct a Root Snapshot using the `util` tool. The tool will print the JSON representation to STDOUT, so you can redirect the output to a file.

Replace `$DATADIR` with the value passed to the `--datadir` flag. You can specify the desired reference block for the snapshot.

Retrieve the snapshot for the latest finalized block:
```sh
util read-protocol-state snapshot -d $DATADIR --final > latest-finalized-snapshot.json
```

Retrieve the snapshot for a specific finalized block height:
```sh
util read-protocol-state snapshot -d $DATADIR --height 12345 > specific-height-snapshot.json
```

## Using Dynamic Startup

Dynamic Startup is a startup configuration where your node will download a Root Snapshot and use it to bootstrap its local database.
Dynamic Startup is designed for nodes which are newly joining the network and need to [bootstrap from within a specific epoch phase](./node-bootstrap#timing), but can be used for other use-cases.

<Callout type="info">
   If your node already has a bootstrapped database, Dynamic Startup flags will be ignored. If both a Root Snapshot and Dynamic Startup flags are present, the node will not startup.
</Callout>

When using Dynamic Startup, we specify:
1. An Access Node to retrieve the snapshot from.
2. A target epoch counter and phase to wait for.

After startup, your node will periodically download a candidate Root Snapshot from the specified Access Node. 
If the Root Snapshot's reference block is either **within or after** the specified epoch phase, the node will bootstrap using that snapshot.
Otherwise the node will continue polling until it receives a valid Root Snapshot.

See the [Epochs Schedule](./../../staking/03-schedule.md) for additional context on epoch phases.

### Specifying an Access Node

Two flags are used to specify which Access Node to connect to:
- `--dynamic-startup-access-address` - the Access Node's secure GRPC server address
- `--dynamic-startup-access-publickey` - the Access Node's networking public key

Select an Access Node you operate or trust to provide the Root Snapshot, and populate these two flags.

For example, to use the Access Node maintained by the Flow Foundation for Dynamic Startup, specify the following flags:
```shell ExampleDynamicStartupFlags
  ... \
  --dynamic-startup-access-address=secure.mainnet.nodes.onflow.org:9001 \
  --dynamic-startup-access-publickey=28a0d9edd0de3f15866dfe4aea1560c4504fe313fc6ca3f63a63e4f98d0e295144692a58ebe7f7894349198613f65b2d960abf99ec2625e247b1c78ba5bf2eae
```

### Specifying an Epoch Phase

Two flags are used to specify when to bootstrap:
- `--dynamic-startup-epoch-phase` - the epoch phase to start up in (default `EpochPhaseSetup`)
- `--dynamic-startup-epoch` - the epoch counter to start up in (default `current`)

> You can check the current epoch phase of the network by running [this](https://github.com/onflow/flow-core-contracts/blob/master/transactions/epoch/scripts/get_epoch_phase.cdc) script. Alternatively, you can also check the current epoch phase [here](https://dashboard.flow.com/) under Epoch Phase.

#### Bootstrapping Immediately

If you would like to bootstrap immediately, using the first Root Snapshot you receive, then specify a past epoch counter:
```shell ExampleDynamicStartupFlags
  ... \
  --dynamic-startup-epoch-phase=1
```
You may omit the `--dynamic-startup-epoch-phase` flag.

### Instructions

#### Example 1
Use Dynamic Startup to bootstrap your node at the `Epoch Setup Phase` of the current epoch (desired behaviour for newly joining nodes):
1. Ensure your database is not already bootstrapped, and no Root Snapshot file is present in the `$BOOTSTRAPDIR` folder.
2. Add necessary flags to node startup command.
For example, using the Flow Foundation Access Node:
```sh
  ... \
  --dynamic-startup-access-address=secure.mainnet.nodes.onflow.org:9001 \
  --dynamic-startup-access-publickey=28a0d9edd0de3f15866dfe4aea1560c4504fe313fc6ca3f63a63e4f98d0e295144692a58ebe7f7894349198613f65b2d960abf99ec2625e247b1c78ba5bf2eae
```
3. Start your node.

#### Example 2
Use Dynamic Startup to bootstrap your node immediately, using the most recent Root Snapshot:
1. Ensure your database is not already bootstrapped, and no Root Snapshot file is present in the `$BOOTSTRAPDIR` folder.
2. Add necessary flags to node startup command.
For example, using the Flow Foundation Access Node:
```sh
  ... \
  --dynamic-startup-access-address=secure.mainnet.nodes.onflow.org:9001 \
  --dynamic-startup-access-publickey=28a0d9edd0de3f15866dfe4aea1560c4504fe313fc6ca3f63a63e4f98d0e295144692a58ebe7f7894349198613f65b2d960abf99ec2625e247b1c78ba5bf2eae \
  --dynamic-startup-epoch=1
```
3. Start your node.