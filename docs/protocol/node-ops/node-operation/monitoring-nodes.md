---
title: Monitoring Node Health
sidebar_label: Node Monitoring
sidebar_position: 7
---

A Flow node generates logs and publishes metrics as it runs. These logs and metrics can be used to gain insights into the health of the node.

## Logs

Logs are emitted to `stdout` as JSON formed strings. Where these logs are available on your system depends on how you launch your containers. On `systemd` systems for example, the logs will be sent to the system journal daemon `journald`. Other systems may log to `/var/log`.

## Metrics

Flow nodes produce health metrics in the form of [Prometheus](https://prometheus.io) metrics, exposed from the node software on `/metrics`.

If you wish to make use of these metrics, you'll need to set up a Prometheus server to scrape your Nodes. Alternatively, you can deploy the Prometheus Server on top of your current Flow node to see the metrics without creating an additional server.

> The flow-go application doesn't expose any metrics from the underlying host such as CPU, network, or disk usages. It is recommended you collect these metrics in addition to the ones provided by flow using a tool like node exporter (https://github.com/prometheus/node_exporter)

1. Copy the following Prometheus configuration into your current flow node

   ```yaml
      global:
        scrape_interval: 15s # By default, scrape targets every 15 seconds.

      scrape_configs:
        # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
        - job_name: 'prometheus'

        # Override the global default and scrape targets from this job every 5 seconds.
        scrape_interval: 5s

        static_configs:
          - targets: ['localhost:8080']
   ```

2. Start Prometheus server
   ```shell
      docker run \
      --network=host \
      -p 9090:9090 \
      -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
      prom/prometheus"
   ```
3. (optional) Port forward to the node if you are not able to access port 9090 directly via the browser
   `ssh -L 9090:127.0.0.1:9090 YOUR_NODE`

4. Open your browser and go to the URL `http://localhost:9090/graph` to load the Prometheus Dashboard

### Key Metric Overview

The following are some important metrics produced by the node.

| Metric Name                           | Description                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| go\_\*                                | Go runtime metrics                                                                                                      |
| consensus_compliance_finalized_height | Latest height finalized by this node; should increase at a constant rate.                                               |
| consensus_compliance_sealed_height    | Latest height sealed by this node; should increase at a constant rate.                                                  |
| consensus_hotstuff_cur_view           | Current view of the HotStuff consensus algorith; Consensus/Collection only; should increase at a constant rate.         |
| consensus_hotstuff_timeout_seconds    | How long it takes to timeout failed rounds; Consensus/Collection only; values consistently larger than 5s are abnormal. |

### Machine Account

Collection and consensus nodes use a machine account that must be kept funded. See [here](../../staking/11-machine-account.md) for details.

Nodes check their machine account's configuration and funding and produce metrics.

| Metric Name                           | Description                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| machine_account_balance                                | The current balance (FLOW) |
| machine_account_recommended_min_balance                | The recommended minimum balance (FLOW) |
| machine_account_is_misconfigured                       | 0 if the node is configured correctly; 1 if the node is misconfigured |

To be notified when your node's machine account needs to be refilled or has a configuration error, you can set up alerts.

When the machine account balance needs to be refilled:
```
machine_account_balance < machine_account_recommended_min_balance
```

When the machine account has a configuration error:
```
machine_account_is_misconfigured > 0
```

The metrics include the account address of the machine account (`acct_address` label) for convenience:
```
# HELP machine_account_balance the last observed balance of this node's machine account, in units of FLOW
# TYPE machine_account_balance gauge
machine_account_balance{acct_address="7b16b57ae0a3c6aa"} 9.99464935
```

