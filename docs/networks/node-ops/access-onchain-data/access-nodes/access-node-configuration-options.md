---
title: Serving execution data
sidebar_label: Execution Data
sidebar_position: 3
---

Flow chain data comprises of two parts,
1. Protocol state data - This refers to the blocks, collection, transaction that are being continuously added to the chain.
2. Execution state data - This refers to what makes up the execution state and includes transaction events and account balances.

The access node by default syncs the protocol state data and has been now updated to also sync the execution state data.
This guide provides an overview of how to use the execution data sync feature of the Access node.


<aside>
⚠️ Nodes MUST be running `v0.32.10+` or newer to enable execution data indexing.

</aside>

## Setup node’s directory

The access node typically has the following directory structure:

```bash
$ tree flow_access
	flow_access/
	├── bootstrap
	│	├── private-root-information (with corresponding AN data)
	│	└── execution-state
	│	└── public-root-information
	│		├── node-id
	│		└── node-info.pub.NODE_ID.json
	│		└── root-protocol-state-snapshot.json (the genesis data)
	└── data (directory used by the node to store block data)
	│	└── execution-data
	│	└── execution-state

```

## Setup execution data indexing

First, your node needs to download and index the execution data. There are 3 steps:

1. Enable Execution Data Sync
2. Download the root checkpoint file
3. Configure the node to run the indexer

As of **`mainnet24`** / **`devnet49`**, Access nodes can be configured to index execution data to support local script execution, and serving all of the Access API endpoints using local data. There are different setup procedures depending on if you are enabling indexing immediately after a network upgrade, or at some point between upgrades.

# Enable Execution Data Sync

This is enabled by default, so as long as you didn’t explicitly disable it, the data should already be available.

1. Make sure that either `--execution-data-sync-enabled` is not set, or is set to `true`
2. Make sure that you have a path configured for `--execution-data-dir`, otherwise the data will be written to the running user’s home directory, which is most likely inside the container’s volume. For example, you can create a folder within the node’s data directory  `/data/execution-data/`.

There are some additional flags available, but you most likely do not need to change them.

## **Option 1: Enabling Indexing at the Beginning of a Spork**

### Download the root protocol state snapshot

The `root-protocol-state-snapshot.json` is generated for each [spork](https://developers.flow.com/networks/node-ops/node-operation/spork) and contains the genesis data for that spork. It is published and made available after each spork. The download location is specified [here](https://github.com/onflow/flow/blob/master/sporks.json) under [rootProtocolStateSnapshot](https://github.com/onflow/flow/blob/master/sporks.json#L16).

Store the **`root-protocol-state-snapshot.json`** into the **`/bootstrap/public-root-information/`** folder.

### Download the root checkpoint

The root checkpoint for the network is by Execution nodes (and now Access nodes), to bootstrap their local execution state database with a known trusted snapshot. The checkpoint contains 18 files that make up the merkle trie used to store the blockchain’s state.

The root checkpoint for each spork is hosted in GCP. You can find the link for the specific network in the [`sporks.json`](https://github.com/onflow/flow/blob/master/sporks.json) file. Here’s the URL for `mainnet24`:

[https://github.com/onflow/flow/blob/52ee94b830c2d413f0e86c1e346154f84c2643a4/sporks.json#L15](https://github.com/onflow/flow/blob/52ee94b830c2d413f0e86c1e346154f84c2643a4/sporks.json#L15)

The URL in that file will point to a file named `root.checkpoint`. This is the base file and is fairly small. There are 17 additional files that make up the actual data, named `root.checkpoint.000`, `root.checkpoint.001`, …, `root.checkpoint.016`. If you have `gsutil` installed, you can download them all easily with the following command.

```bash
gsutil -m cp "gs://flow-genesis-bootstrap/[network]-execution/public-root-information/root.checkpoint*" .
```

Once the files are downloaded, you can either move them to `/bootstrap/execution-state/` within the node’s bootstrap directory or put them in any mounted directory and reference the location with this cli flag: `--execution-state-checkpoint=/path/to/root.checkpoint`. The naming of files should be `root.checkpoint.*`.

## **Option 2: Enabling Indexing Mid-Spork**

### Download the root protocol state snapshot

You can download  `root-protocol-state-snapshot.json`  file by using the `GetProtocolStateSnapshotByHeight` call with the corresponding height. You will get a `base64` encoded snapshot which you will need to decode.

Store the **`root-protocol-state-snapshot.json`** into the **`/bootstrap/public-root-information/`** folder.

### Download the root checkpoint

You will need to download checkpoint files for the corresponding height which is the same as was for downloading the root protocol state snapshot. This is important cause in other cases you will get the error described in the Troubleshooting section.

Once the files are downloaded, you can either move them to `/bootstrap/execution-state/` within the node’s bootstrap directory or put them in any mounted directory and reference the location with this cli flag: `--execution-state-checkpoint=/path/to/root.checkpoint`. The naming of files should be `root.checkpoint.*`.

# Configure the node to run the indexer

Now you have the execution sync setup and the root checkpoint in place, it’s time to configure the node to index all of the data so it can be used for script execution.

There are 2 cli flags that you will need to add:

- `--execution-data-indexing-enabled=true` This will enable the indexer.
- `--execution-state-dir` This defines the path where the registers db will be stored. A good default is on the same drive as the protocol db. e.g. `/data/execution-state`

# Start your node

Now that all of the settings to enable indexing are in place, you can start your node.

At a minimum, you will need the following flags:

```
--execution-data-indexing-enabled=true
--execution-state-dir=/data/execution-state
--execution-data-sync-enabled=true
--execution-data-dir=/data/execution-data
```

For better visibility of the process, you can also add

`-p 8080:8080` - export port 8080 from your docker container, so you could inspect the metrics

`--loglevel=info` - for checking logs.

Notes on what to expect:

- On startup, the node will load the checkpoint into the `execution-state` db. For `devnet48`, this takes 20-30 min depending on the node’s specs. For `mainnet24`, it takes >45 min. The loading time will increase over time. You can follow along with the process by grepping your logs for `register_bootstrap`.
- After the checkpoint is loaded, the indexer will begin ingesting the downloaded execution data. This will take several hours to days depending on if the data was already downloaded and the hardware specs of the node.
- If your node already had all the data, it will index all of it as quickly as possible. This will likely cause the node to run with a high CPU.

When you restart the node for the first time with syncing enabled, it will sync execution data for all blocks from the network.

# Troubleshooting

- If the root checkpoint file is missing or invalid, the node will crash. It must be taken from the same block as the `root-protocol-state-snapshot.json` used to start your node.
- If you don’t set one the `--execution-data-dir` and `--execution-state-dir` flags, the data will be written to the home directory inside the container (likely `/root`). This may cause your container to run out of disk space and crash, or lose all data each time the container is restarted.
- If your node crashes or restarts before the checkpoint finishes loading, you will need to stop the node, delete the `execution-state` directory, and start it again. Resuming is currently not supported.
- If you see the following message then your `checkpoint` and `root-protocol-state-snapshot` are not for the same height.

```json
{
  "level":"error",
  ...
  "module":"execution_indexer",
  "sub_module":"job_queue",
  "error":"could not query processable jobs: could not read job at index 75792641, failed to get execution data for height 75792641: blob QmSZRu2SHN32d9SCkz9KXEtX3M3PozhzksMuYgNdMgmBwH not found",
  "message":"failed to check processables"
}
```

- You can check if the execution sync and index heights are increasing by querying the metrics endpoint:
    ```
    curl localhost:8080/metrics | grep highest_download_height
    curl -s localhost:8080/metrics | grep highest_indexed_height
    ```

# Execution Data Sync

The Execution Sync protocol is enabled by default on Access nodes, and uses the bitswap protocol developed by Protocol Labs to share data trustlessly over a peer-to-peer network. When enabled, nodes will download execution data for each block as it is sealed, and contribute to sharing the data with its peers. The data is also made available to systems within the node, such as the `ExecutionDataAPI`.

Below is a list of the available CLI flags to control the behavior of Execution Sync requester engine.

| Flag | Type | Description |
| --- | --- | --- |
| execution-data-sync-enabled | bool | Whether to enable the execution data sync protocol. Default is true |
| execution-data-dir | string | Directory to use for Execution Data database. Default is in the user’s home directory. |
| execution-data-start-height | uint64 | Height of first block to sync execution data from when starting with an empty Execution Data database. Default is the node’s root block. |
| execution-data-max-search-ahead | uint64 | Max number of heights to search ahead of the lowest outstanding execution data height. This limits the number non-consecutive objects that will be downloaded if an earlier block is unavailable. Default is 5000. |
| execution-data-fetch-timeout | duration | Initial timeout to use when fetching execution data from the network. timeout increases using an incremental backoff until execution-data-max-fetch-timeout. Default is 10m. |
| execution-data-max-fetch-timeout | duration | Maximum timeout to use when fetching execution data from the network. Default is 10s |
| execution-data-retry-delay | duration | Initial delay for exponential backoff when fetching execution data fails. Default is 1s |
| execution-data-max-retry-delay | duration | Maximum delay for exponential backoff when fetching execution data fails. Default is 5m |

<aside>
ℹ️ Note: By default, execution data is written to the home directory of the application user. If your node is running in docker, this is most likely in the container’s volume. Depending on how you configure your node, this may cause the node’s boot disk to fill up.

As a best practice, specify a path with `--execution-data-dir`. A sensible default is to put it within the same directory as `--datadir`. e.g. `--execution-data-dir=/data/execution_data`.

</aside>

# Execution Data Indexer

Below is a list of the available CLI flags to control the behavior of Execution Data Indexer.

| Flag | Type | Description |
| --- | --- | --- |
| execution-data-indexing-enabled  | bool | Whether to enable the execution data indexing. Default is false |
| execution-state-dir | string | Directory to use for execution-state database. Default is in the user’s home directory. |
| execution-state-checkpoint | string | Location of execution-state checkpoint (root.checkpoint.*) files.  |
| event-query-mode | string | Mode to use when querying events. one of [local-only, execution-nodes-only(default), failover] |
| tx-result-query-mode | string | Mode to use when querying transaction results. one of [local-only, execution-nodes-only(default), failover] |

Below is a list of the available CLI flags to control the behavior of Script Execution.

| Flag | Type | Description |
| --- | --- | --- |
| script-execution-mode  | string | Mode to use when executing scripts. one of [local-only, execution-nodes-only, failover, compare ] |
| script-execution-computation-limit | uint64 | Maximum number of computation units a locally executed script can use. Default: 100000 |
| script-execution-max-error-length | int | Maximum number characters to include in error message strings. additional characters are truncated. Default: 1000 |
| script-execution-log-time-threshold | duration | Emit a log for any scripts that take over this threshold. Default: 1s |
| script-execution-timeout | duration | The timeout value for locally executed scripts. Default: 10s |
| script-execution-min-height | uint64 | Lowest block height to allow for script execution. Default: no limit |
| script-execution-max-height | uint64 | Highest block height to allow for script execution. default: no limit |
| register-cache-type | string | Type of backend cache to use for registers [lru, arc, 2q] |
| register-cache-size | uint | Number of registers to cache for script execution. Default: 0 (no cache) |
| program-cache-size | uint | [experimental] number of blocks to cache for cadence programs. use 0 to disable cache. Default: 0. Note: this is an experimental feature and may cause nodes to become unstable under certain workloads. Use with caution. |

# Resources

FLIP: [https://github.com/onflow/flips/blob/main/protocol/20230309-accessnode-event-streaming-api.md](https://github.com/onflow/flips/blob/main/protocol/20230309-accessnode-event-streaming-api.md)

Protobuf: [https://github.com/onflow/flow/blob/master/protobuf/flow/executiondata/executiondata.proto](https://github.com/onflow/flow/blob/master/protobuf/flow/executiondata/executiondata.proto)