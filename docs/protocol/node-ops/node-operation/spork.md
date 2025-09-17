---
title: Network Upgrade (Spork) Process
description: Steps to be carried out by node operators during a network upgrade.
sidebar_position: 15
---

## Overview

A spork is a coordinated network upgrade process where node operators upgrade their node software and
re-initialize with a consolidated representation of the previous spork's state. This enables rapid development
on the Flow Protocol and minimizes the impact of breaking changes.

The Flow network sporks approximately once every year.
Upcoming sporks are announced in advance on the `#flow-validators-announcements` [Discord channel](https://discord.gg/flow) and on the [status](https://status.flow.com/) page.
The `#flow-validators-announcements` channel is also used to coordinate during the spork process with all the node operators.

This guide is for existing operators participating in a spork. See [Node Bootstrap](./node-bootstrap.md)
for a guide to joining the network for the first time.

## Step 1 - Cleaning Up Previous Spork State

Once the spork start has been announced on, stop your node and clear your database. The node should stay stopped for the duration of the spork.

<Callout type="warning">
  You can skip this step if it is your first time running a node on Flow.
</Callout>

1. Stop your Flow node
2. Clear the contents of your `data` directory that you have previously created. The default location is `/var/flow/data`. The `data` directory contains the Flow chain state.

## Step 2 - Start Your Node

Once you receive an announcement that the spork process is complete (via [Discord server](https://discord.gg/flow)), you will need to fetch the genesis info, update your runtime configuration and then boot your Flow node up!

<Callout type="warning">

If you had set the [dynamic bootstrap arguments](https://developers.flow.com/protocol/node-ops/node-operation/protocol-state-bootstrap) command line arguments (`--dynamic-startup-access-address`, `--dynamic-startup-access-publickey`, `--dynamic-startup-epoch-phase`) please remove them.

</Callout>

1. Run the transit script to fetch the new genesis info:

   ```
   ./boot-tools/transit pull -b ./bootstrap -t ${PULL_TOKEN} -r ${YOUR_NODE_TYPE} --concurrency 10 --timeout 50m
   ```

- `PULL_TOKEN` will be provided by the Flow team.

  - For `collection`, `consensus`, `verification` node type it will generally be `testnet-x` or `mainnet-x` where x is the latest number of respective network upgrade. e.g. `testnet-53`, `mainnet-27`.
  - For `execution` node type it will generally be `testnet-x-execution` or `mainnet-x-execution`.
  - For `access` node:
    - It will generally be `testnet-x` or `mainnet-x` if execution data indexing is not enabled.
    - It will generally be `testnet-x-execution` or `mainnet-x-execution` if execution data indexing is enabled. See [here](../access-nodes/access-node-configuration-options.md) to enable execution date indexing.

- `YOUR_NODE_TYPE` should be one of `collection`, `consensus`, `execution`, `verification` based on the node(s) that you are running.
  - For access nodes however, if you have execution data index enabled use the role `execution` otherwise use `access`.

```shell Example
$ ./boot-tools/transit pull -b ./bootstrap -t mainnet-16  -r consensus
Transit script Commit: a9f6522855e119ad832a97f8b7bce555a163e490
2020/11/25 01:02:53 Running pull
2020/11/25 01:02:53 Downloading bootstrap/public-root-information/node-infos.pub.json
2020/11/25 01:02:54 Downloading bootstrap/public-root-information/root-protocol-snapshot.json
2020/11/25 01:02:54 Downloading bootstrap/random-beacon.priv.json.39fa54984b8eaa463e129919464f61c8cec3a4389478df79c44eb9bfbf30799a.enc
2020/11/25 01:02:54 SHA256 of the root block is: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

$ tree ./bootstrap/
  ./bootstrap/
  ├── private-root-information
  │   └── private-node-info_39fa54984b8eaa463e129919464f61c8cec3a4389478df79c44eb9bfbf30799a
  │       └── node-info.priv.json
  ├── public-root-information
  │   ├── node-id
  │   ├── node-info.pub.39fa54984b8eaa463e129919464f61c8cec3a4389478df79c44eb9bfbf30799a.json
  │   ├── node-infos.pub.json
  │   └── root-protocol-snapshot.json
  └── random-beacon.priv.json.39fa54984b8eaa463e129919464f61c8cec3a4389478df79c44eb9bfbf30799a
```

2. Start your Flow node via `docker` or `systemd`

See [Node Bootstrap](./node-bootstrap.md) for detailed information on Docker/Systemd configuration.

## Common Issues

### Error: cannot create connection

```shell
20T18:34:21Z","message":"could not create connection"}
{"level":"error","node_role":"consensus","node_id":"6d3fac8675a1df96f4bb7a27305ae531b6f4d0d2bc13a233e37bb07ab6b852dc","target":"QmVcSQaCdhmk1CMeMN7HTgGiUY1i2KqgVE2vvEmQXK4gAA","error":"failed to dial : all dials failed
  * [/ip4/155.138.151.101/tcp/3569] dial tcp4 155.138.151.101:3569: connect: connection refused","retry_attempt":2,"time":"2020-05-20T18:34:21Z","message":"could not create connection"}
```

This error is OK. Your fellow node operators have not turned on/joined the network yet. So no need to worry about it!
