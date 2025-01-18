---
title: Setting up an EVM Gateway node
sidebar_label: EVM Gateway Setup
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide is for running the [EVM Gateway](https://github.com/onflow/flow-evm-gateway) node on Flow. The EVM Gateway implements the
[Ethereum JSON-RPC specification](https://ethereum.org/en/developers/docs/apis/json-rpc/) and is the only node type which accepts EVM 
client connections. 

The EVM Gateway consumes Flow protocol state from the configured Flow Access Node and persists the indexed EVM state locally to 
service EVM client requests. It submits EVM transactions it receives into the Flow network, wrapped in a Cadence transaction, and 
mutating EVM state when executed. Non-mutating RPC methods only query the local state index of the gateway and are never forwarded 
to Access Nodes. It does not participate in the block production process and requires no stake.

## Anyone can run EVM Gateway

The EVM Gateway can serve as a dedicated private RPC, a performance scaling solution, and a free gas provider offering similar capabilities 
to centralized middleware providers like Infura, Alchemy, etc at a fraction of the cost. EVM Gateway nodes connect directly to the Flow network 
with no middleware giving you full control.

Applications which generate high call volumes to the JSON-RPC and which may have hit rate limits on Flow public nodes may benefit from running their 
own gateway to remove rate limits. Self-hosted gateways connect directly to public Flow Access Nodes, which may also optionally be [run](../access-nodes/access-node-setup.md). 

:::info

Apps can use EVM gateway to subsidize user transaction fees for smoother onboarding

:::

## Hardware specifications

The EVM Gateway is a lightweight node which runs on commodity hardware and cloud VMs. It can be run on GCP **standard** and AWS **large** 
VM types for low to moderate volume app co-location use-cases. However, higher volume use cases may require larger instance types and more 
testing. An inactive node requires less than 200MB memory when run in Docker and data storage growth corresponds with Flow EVM transaction 
growth. Listed below are theoretical RPS maximums based on Flow mainnet CPU and memory resource utilization metrics and linear scaling assumptions. 

### Google Cloud Platform (GCP) VM Types

| VM Type   | vCPUs | Memory (GB) | Estimated Max Requests/s |
| --------- |-------|-------------|--------------------------|
| n2-standard-2	| 2	    | 8           | ~2,950                   |
| c4a-standard-1 | 1     | 4           | ~1,475                   |
| c4a-standard-2 | 2     | 8           | ~2,950                   |
| n2-highmem-4 | 4     | 32          | ~11,800                  |
| c3-standard-8 | 8     | 32          | ~29,500                  |

### Amazon Web Services (AWS) EC2 Instance Types
| Instance Type	| vCPUs	 | Memory (GB) | Estimated Max Requests/s | 
| --------- |--------|-------------|--------------------------|
| m6i.large	| 2	     | 8           | ~2,950                   | 
| c6i.large	| 2	     | 4	| ~3,687                   | 
| m6i.xlarge	| 4      | 	16 | 	~11,800                 |
| c6i.2xlarge	| 8      | 	16| 	~29,500                 | 
| t3.2xlarge	| 8	| 32	| ~17,700                  | 

# How To Run EVM Gateway

## Step 1 - Account Creation

The EVM Gateway's role in mediating EVM transactions over to Cadence is how it accrues fees from handling client transactions. Since
the gateway submits Cadence transactions wrapping EVM transaction payloads to the Flow Access Node the transaction fee for that must
be paid by the EVM Gateway.

The account used for funding gateway Cadence transactions must be a COA, not an EOA. `--coa-address` is configured with the Cadence address
of the COA account and the `--coa-key` must belong to the same account. The `--coinbase` account accrues EVM Gateway fees from EVM client
transactions and can be either an EVM EOA or COA address.

It is acceptable to create a single Cadence account for the COA and use the EVM address associated with that for the COINBASE address.

### Create Flow account to use for COA

If you don't already have a Flow account you will need to create one. 

<Tabs>
<TabItem value="mainnet" label="Mainnet">

   1. Install [Flow Wallet](https://wallet.flow.com/)
   2. Once installed you will be able to copy the wallet address, similar to _0x1844efeb3fef2242_
   3. Obtain account private key from
   <pre>Settings -> Account List -> Choose Main account -> Private Key -> [Password prompt]</pre>
   4. Ensure the wallet is funded from a CEX or other wallet

</TabItem>
<TabItem value="testnet" label="Testnet">

Install [Flow CLI](https://developers.flow.com/tools/flow-cli/install) if not already installed.

```bash
flow keys generate
```
This will output something similar to:
`
```bash
🔴️ Store private key safely and don't share with anyone!
Private Key 		 3cf8334d.....95c3c54a28e4ad1
Public Key 		 33a13ade6....85f1b49a197747
Mnemonic 		 often scare peanut ... boil corn change
Derivation Path 	 m/44'/539'/0'/0/0
Signature Algorithm 	 ECDSA_P256
```

Visit https://faucet.flow.com/, and use the generated `Public Key`, to create and fund your Flow testnet account.

</TabItem>
</Tabs>

## Step 2 - Build the gateway

To run EVM Gateway on bare metal or in a VM without the use of docker, select the '_Build from source_' tab otherwise refer to the 
'_Build using Docker_' tab. 

<Tabs>
<TabItem value="source-build" label="Build from source">

This will build the EVM gateway binary from source. 

```bash
git clone https://github.com/onflow/flow-evm-gateway.git

cd flow-evm-gateway
git checkout $(curl -s https://api.github.com/repos/onflow/flow-evm-gateway/releases/latest | jq -r .tag_name)
CGO_ENABLED=1 go build -o evm-gateway cmd/main/main.go
chmod a+x evm-gateway
mv evm-gateway /usr/bin
```

</TabItem>
<TabItem value="docker-build" label="Build using Docker">

```bash
git clone https://github.com/onflow/flow-evm-gateway.git

cd flow-evm-gateway
git checkout $(curl -s https://api.github.com/repos/onflow/flow-evm-gateway/releases/latest | jq -r .tag_name)
make docker-build
```

</TabItem>
<TabItem value="docker-install" label="Use Docker registry image">

Registry versions available for download can be found [here](https://console.cloud.google.com/artifacts/docker/dl-flow-devex-production/us-west1/development/flow-evm-gateway).
```bash
docker pull us-west1-docker.pkg.dev/dl-flow-devex-production/development/flow-evm-gateway:${VERSION}
```

</TabItem>
</Tabs>

## Step 3 - Start Your Node

Operators will need to refer to the gateway [configuration flags](https://github.com/onflow/flow-evm-gateway?tab=readme-ov-file#configuration-flags) and make adjustments that align with the desired 
deployment topology. 

### EVM Coinbase address

If this is your first time setting up the gateway we need to ensure that an EVM COA or EOA address is available to configure the `COINBASE`. This account
can be an account created using Metamask or other web3.js wallet, or otherwise can be the EVM address corresponding to the Flow Wallet COA account created above. 

If you haven't already got an EVM address and you have the COA account created by Flow Wallet above then follow the steps below:

* Click top left burger icon to show current profile
* Click 'Enable the path to EVM on Flow' button
* Your EVM account will now be available to use in the left nav account view
* When you switch to that account you can obtain its EVM address

### COA Address and Key

COA address and private key is configured for `--coa-address` & `--coa-key` configuration flags. If running multiple EVM Gateway hosts it is standard to
share the same COA address and key across _n_ hosts.

### Run the gateway

Ensure that the following ENV variables have been set. Add/update as required if your configuration differs from those listed.

```bash
# Set required environment variables
export ACCESS_NODE_GRPC_HOST="access.mainnet.nodes.onflow.org:9000" # or access.devnet.nodes.onflow.org:9000 for testnet
export FLOW_NETWORK_ID="flow-mainnet" # or flow-testnet
export INIT_CADENCE_HEIGHT="85981135" # 211176670 for testnet
export COINBASE="${EVM_ADDRESS_WITHOUT_0x}"
export COA_ADDRESS="${CADENCE_ACCOUNT_ADDRESS_WITHOUT_0x}"
export COA_KEY="${CADENCE_ACCOUNT_PRIVATE_KEY_WITHOUT_0x}"
export GAS_PRICE="100" # operators can set this to 0 for zero cost transactions. The linked COA account will pay for transactions on users behalf

# $\{ACCESS_NODE_SPORK_HOSTS\} are comma separated
# testnet: access-001.devnet51.nodes.onflow.org:9000
# mainnet: access-001.mainnet25.nodes.onflow.org:9000
```
ACCESS_NODE_SPORK_HOSTS is used by the gateway to track state across Flow sporks. These are generally infrequent with only one planned 
spork per year. A canonical list of required hosts can be found in the EVM Gateway [Makefile](https://github.com/onflow/flow-evm-gateway/blob/main/Makefile#L9).

<Tabs>
<TabItem value="source-build" label="Run from binary">

**Create EVM Gateway service**

```bash
sudo tee <<EOF >/dev/null /etc/systemd/system/gateway.service
[Unit]
Description=Gateway daemon
After=network-online.target

[Service]
User=$USER
ExecStart=/usr/bin/evm-gateway \
--access-node-grpc-host=$ACCESS_NODE_GRPC_HOST \
--access-node-spork-hosts=ACCESS_NODE_SPORK_HOSTS \
--flow-network-id=$FLOW_NETWORK_ID \
--init-cadence-height=$INIT_CADENCE_HEIGHT \
--ws-enabled=true \
--coinbase=$COINBASE \
--coa-address=$COA_ADDRESS \
--coa-key=$COA_KEY \
--rate-limit=9999999 \
--rpc-host=0.0.0.0 \
--gas-price=$GAS_PRICE \
--tx-state-validation=local-index
Restart=always
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF

cat /etc/systemd/system/gateway.service
sudo systemctl enable gateway
```

**Start all services**

```bash
sudo systemctl daemon-reload
sudo systemctl restart access-node
sudo systemctl restart gateway
```

**Check logs**

```bash
# change log settings to persistent if not already
sed -i 's/#Storage=auto/Storage=persistent/g' /etc/systemd/journald.conf
sudo systemctl restart systemd-journald

journalctl -u gateway.service -f -n 100
```

</TabItem>
<TabItem value="docker-build" label="Run with Docker">

It may be necessary to make local changes to the `docker-run` target to add params which are needed for your requirements. If you pulled a 
specific image from the gateway container registry ensure that the `$VERSION` environment variable is set to the same as the image version 
you pulled.

```bash
cd flow-evm-gateway
make docker-run
```
Additional options are available as follows

```bash
DOCKER_RUN_DETACHED=true 
DOCKER_HOST_MOUNT=[host mount directory] 
DOCKER_HOST_PORT=[desired port to expose on host]
DOCKER_HOST_METRICS_PORT=[desired port to expose on host for metrics]

# Example usage

make DOCKER_RUN_DETACHED=true DOCKER_HOST_PORT=1234 DOCKER_HOST_MOUNT=/my/host/dir docker-run
```

</TabItem>
</Tabs>

### Startup bootstrap indexing

Once your EVM Gateway is up and running you will see it indexing the Flow network which was configured. At the present time this
is a lengthy process (possibly 1-3 days, depending on CPU core count) during which time the gateway will not respond to queries. 
Once the data is fully indexed the gateway can serve requests to clients.

To speed up gateway setup we recommend backing up the `/${GATEWAY_HOME_DIR}/data` directory to use when creating additional nodes 
using the same release version. We are currently working on an export/import feature that will enable gateway operators to 
store state snapshots to bootstrap newly created nodes without the delay.

:::note

If you are upgrading the gateway from pre-v1.0.0 release versions the indexed data directory will need to be reindexed from genesis. 
You will not be able to re-use the DB data dir from the previous versions. 

:::

### Account and Key Management

EVM Gateway allows for Google and AWS Key Management Service (KMS) setup, which is the recommended way of setting up the gateway 
for live networks. We recommend creating multiple KMS keys for the same Flow account (ideally 10 or more), how many depends on 
the desired transaction throughput, since the keys are used in rotation when submitting the transactions. If too few keys 
are configured it may result in sequence number collisions if the same key is used concurrently by multiple EVM client requests. 

### KMS Configuration
```
--coa-cloud-kms-project-id=your-project-kms-id \
--coa-cloud-kms-location-id=global \
--coa-cloud-kms-key-ring-id=your-project-kms-key-ring-id \
--coa-cloud-kms-key=example-gcp-kms1@1,example-gcp-kms2@1 \
```

### Monitoring and Metrics

The EVM Gateway reports Prometheus metrics which are a way to monitor the gateway's availability and progress. The database folder 
size may also need to be monitored to prevent disk full issues. 

**Metric labels**
```bash
evm_gateway_api_errors_total # Total count of API errors for period
evm_gateway_api_request_duration_seconds_bucket # Histogram metric buckets for API request durations
evm_gateway_api_request_duration_seconds_count # Histogram metric API request count for period
evm_gateway_api_request_duration_seconds_sum # Histogram metric API request sum of values for period
evm_gateway_api_server_panics_total # Total count of server panics for period
evm_gateway_blocks_indexed_total  # Total count of EVM blocks indexed 
evm_gateway_cadence_block_height  # Cadence block height 
evm_gateway_evm_account_interactions_total # Count of unique accounts observed for period
evm_gateway_evm_block_height # EVM block height 
evm_gateway_operator_balance # Gateway node COA operator account balance
evm_gateway_trace_download_errors_total # Total count of trace download errors
evm_gateway_txs_indexed_total # Total count of indexed transactions
```

Alerts are recommended to be configured on server panics, low operator balance, and disk usage metrics.

**Metrics port**

```
--metrics-port 8080 \
```
### Node Status

For basic node status or keepalive monitoring we recommend automated checks on the following monotonically increasing counter:
```
curl -s -XPOST 'your-evm-gw-host:8545' --header 'Content-Type: application/json' --data-raw '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' | jq -r '.result' | xargs printf "%d\n"
10020239
```

## Troubleshooting

Join our [Discord](https://discord.com/invite/J6fFnh2xx6) and use the `#flow-evm` channel to ask any questions you may have about 
EVM Gateway.

### Database version inconsistency/corruption

If you see a similar message to this from an aborted startup the gateway database directory is not compatible with the schema versions of the runtime, or there may be corruption. In this instance we recommend that you delete the contents of the EVM GW data directory.

```bash
Jan 16 17:00:57 nodename docker[6552]: {"level":"error","error":"failed to open db for dir: /flow-evm-gateway/db, with: pebble: manifest file \"MANIFEST-018340\" for DB \"/flow-evm-gateway/db\": comparer name from file \"leveldb.BytewiseComparator\" != comparer name from Options \"flow.MVCCComparer\"","time":"2025-01-16T17:00:57Z","message":"Gateway runtime error"}
```

### State stream configuration

If you are running an Access Node on the same logical host as the EVM Gateway you may see ehe following log entries.

```bash
failure in event subscription at height ${INIT-CADENCE-HEIGHT}, with: recoverable: disconnected: error receiving event: rpc error: code = Unimplemented desc = unknown service flow.executiondata.ExecutionDataAPI”
```
```bash
component execution data indexer initialization failed: could not verify checkpoint file: could not find expected root hash e6d4f4c755666c21d7456441b4d33d3521e5e030b3eae391295577e9130fd715 in checkpoint file which contains: [e10d3c53608a1f195b7969fbc06763285281f64595be491630a1e1bdfbe69161]
```

To resolve this configure `--state-stream-addr` to use the same address/port combination which is set for Access Node `--rpc-addr`. 
This is required by the gateway to allow both the streaming and non-streaming APIs to query using the same connection.

### Access Node not fully synced

The following log entry will occur when the EVM Gateway attempts to sync with the Access Node but it has not yet synced up to latest block
```bash
failure in event subscription at height ${INIT-CADENCE-HEIGHT}, with: recoverable: disconnected: error receiving event: rpc error: code = FailedPrecondition desc = could not get start height: failed to get lowest indexed height: index not initialized
```