---
title: Managing disk space
description: How to manage the node disk space
---

As the chain advances, nodes receive chain data and store it on disk.
Hence, the disk usage of a node keeps increasing gradually over time.

In addition to this, currently nodes also experience an intermittent 30-35% spike in disk usage caused by the compaction process of the Badger database used by the node software.

> The spikes will be eliminated once the Badger database is replaced by the Pebble database in the future.


Hence, as a node operator, please make sure to do the following:

1. Provision enough disk space as per the node role (see: [node-provisioning](./node-provisioning.md))


2. Setup disk usage monitoring and ensure that the node has enough room to grow and to also accommodate those intermittent spikes.


3. If needed, please add more disk space to the node from time to time.

> It highly recommended to setup alerting around disk usage to facilitate timely action and avoid any downtime and subsequent reward slashing for the node.


## Reclaiming disk space

### Access, Collection, Consensus and Verification node

If you are running any node other than an execution node and the node is close to running out of disk space or has already exhausted all of its disk, you can re-bootstrap the node's database. This frees up disk space by discarding historical data past a certain threshold.

1. Stop the node.

2. Back up the data folder to a tmp folder in case it is required to revert this change. The default location of the data folder is `/var/flow/data` unless overridden by the `--datadir` flag.
```sh
mv /var/flow/data /var/flow/data_backup
```

3. Configure the node to bootstrap from a new, more recent Root Snapshot. You may use either of the two methods described [here](./protocol-state-bootstrap.md) to configure your node.

4. Start the node. The node should now recreate the data folder and start fetching blocks.

5. If the node is up and running OK, delete the `data_backup` folder created in step 2.
```sh
rm -rf /var/flow/data_backup
```

#### Limitation for Access Node

Re-bootstrapping allows the node to be restarted at a particular block height by deleting all the previous state.

For an **Access Node**, this results in the node not being able to serve any API request before the height at which the node was re-bootstrapped.

_Hence, if you require the access node to serve data from the start of the last network upgrade (spork), do not use this method of reclaiming disk space. Instead provision more disk for the node._

### Execution node

For an execution node, the chunk data directory is the one that takes up most of the space. To reclaim space on an execution, do the following:

1. Stop the Execution Node.


2. Remove the Chunk Data Pack Directory. The default is `/var/flow/data/chunk_data_pack` unless overridden by the `chunk-data-pack-dir` parameter. 

   Do **not** delete the bootstrap folder.

   ``` rm -rf /var/flow/data/chunk_data_pack```


3. Start the Execution Node.

Upon restart, the chunk data pack directory will be automatically recreated.


> Note: Always exercise caution when performing system operations, and make sure you have a backup of important data before making any changes.