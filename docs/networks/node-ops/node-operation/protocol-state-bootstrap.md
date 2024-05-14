---
title: Protocol State Bootstrapping
description: How to bootstrap a new or existing node
---

When a node joins the network, it bootstraps its local database using a trusted initialization file, called a `Root Snapshot`.
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
If its local database is not already bootstrapped, it will attempt to bootstrap using a `Root Snapshot`.

There are two sources for a non-bootstrapped node to obtain a `Root Snapshot`:
- Root Snapshot file in the `bootstrap` folder
- Dynamic Startup flags

## Using a Root Snapshot File

Using a `Root Snapshot` file is more flexible but more involved for operators compared to Dynamic Startup.

A file in `$BOOTSTRAP_DIR/public-root-information` named `root-protocol-state-snapshot.json` will be read and used as the `Root Snapshot` for bootstrapping the database.

### Instructions

1. Obtain a `Root Snapshot` file (see below for options)
2. Ensure your node is stopped and does not already have a bootstrapped database.
3. Place the `Root Snapshot` in `$BOOTDIR/public-root-information/root-protocol-state-snapshot.json`, where `$BOOTDIR` is the value passed to the `--bootstrapdir` flag.
4. Start your node. 

### Obtain Root Snapshot File using Flow CLI

[Flow CLI](../../../tools/flow-cli/index.md) supports downloading the most recently sealed `Root Snapshot` from an Access Node using the [`flow snapshot save`](../../../tools/flow-cli/utils/snapshot-save.md) command.

When using this method: 
- ensure you connect to an Access Node you operate or trust
- ensure you use the [`--network-key`](../../../tools/flow-cli/utils/snapshot-save#network-key) flag so the connection is encrypted

### Obtain Root Snapshot File from Protocol database

If you have an existing node actively participating in the network, you can obtain a `Root Snapshot` using its database.

1. Obtain a copy of the Flow `util` tool and ensure it is in your `$PATH`. This tool is distributed during sporks, or you can build a copy from [here](https://github.com/onflow/flow-go/tree/master/cmd/util).
2. Stop the existing node.
3. Construct a `Root Snapshot` using the `util` tool. The tool will print the JSON representation to STDOUT, so you can redirect the output to a file.

Replace `$DATADIR` with the value passed to the `--datadir` flag. You can specify the desired reference block for the snapshot.

Retrieve the snapshot for the latest finalized block:
```sh
util read-protocol-state snapshot -d $DATADIR --final > latest-finalized-snapshot.json
```

Retrieve the snapshot for a specific finalized block height:
```sh
util read-protocol-state snapshot -d $DATADIR --height 12345 > specific-height-snapshot.json
```

4. On the node you want to bootsrtap, place the `Root Snapshot` in `$BOOTDIR/public-root-information/root-protocol-state-snapshot.json`, where `$BOOTDIR` is the value passed to the `--bootstrapdir` flag.
5. Start your node. 

## Using Dynamic Startup



