---
title: Managing disk space
description: How to manage the node disk space
---

As the chain advances, nodes receive chain data and store it on disk.
Hence, the disk usage of a node keeps increasing gradually over time.

In addition to this, currently nodes also experience intermittent spikes in disk usage caused by the compaction process of the baddger database used by the node software.
These spikes can be as high as 75%.

> The spikes will be eliminated once the Badger database is replaced by the Pebble database in the future.


Hence, as a node operator, please make sure to do the following:

1. Provision enough disk space as per the node role (see: [node-provisioning](./node-provisioning.md))


2. Setup disk usage monitoring and ensure that the node has enough room to grow and to also accommodate those intermittent spikes.


3. If needed, please add more disk space to the node from time to time.

> It highly recommended to setup alerting around disk usage to facilitate timely action and avoid any downtime and subsequent reward slashing for the node.


## Reclaiming disk space

### Access, Collection, Consensus and Verification node

If you are running any node other than an execution node and the node is close to running out of disk space or has already exhausted all of its disk, you can do the following to reclaim disk space:

1. Stop the node.


2. Setup the node to use **dynamic bootstrapping** by specifying the dynamic startup flags described [here](./node-bootstrap.md#dynamic-startup).


3. Delete the `data` folder. The default location is `/var/flow/data` unless overridden by the `data-dir` parameter. Do **not** delete the bootstrap folder.


4. Start the node.


### Execution node

For an execution node, the chunk data directory is the one that takes up most of the space. To reclaim space on an execution, do the following:

1. Stop the Execution Node.


2. Remove the Chunk Data Pack Directory.


3. Delete chunk data pack directory. The default is `/var/flow/data/chunk_data_pack` unless overridden by the `chunk-data-pack-dir` parameter. Do **not** delete the bootstrap folder.


4. Start the Execution Node.

Upon restart, the chunk data pack directory will be automatically recreated.


> Note: Always exercise caution when performing system operations, and make sure you have a backup of important data before making any changes.