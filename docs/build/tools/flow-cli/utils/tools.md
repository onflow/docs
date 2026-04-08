---
title: Development Tools
description: How to start development tools using the Flow CLI
---

The Flow CLI integrates different development tools, which you can now easily start and manage from a single place. 

Currently, the CLI supports starting [Flow Development Wallet]


## Flow Development Wallet

The Flow Dev Wallet is a mock Flow wallet that simulates the protocols used by Flow CLient Library (FCL) to interact with the Flow blockchain on behalf of simulated user accounts.

**Be sure you started the emulator before you run this command**
_You can start it with the `flow emulator` command_.

```shell
flow dev-wallet
```
_⚠️ This project implements an FCL compatible interface, but should **not** be used as a reference to build a production grade wallet._

After you start dev-wallet, you can set your fcl config to use it like below:

```javascript
import * as fcl from "@onflow/fcl"

fcl.config()
  // Point App at Emulator
  .put("accessNode.api", "http://localhost:8080") 
  // Point FCL at dev-wallet (default port)
  .put("discovery.wallet", "http://localhost:8701/fcl/authn") 
```
You can read more about how to set up dev-wallet at [Flow Dev Wallet Project].

## Flags

### Port

- Flag: `--port`
- Valid inputs: Number
- Default: `8701`

Port on which the dev wallet server will listen.

### Emulator host

- Flag: `--emulator-host`
- Valid inputs: a hostname
- Default: `http://localhost:8080`

Specifies the host configuration for dev wallet.

### Configuration

- Flag: `--config-path`
- Short Flag: `-f`
- Valid inputs: valid filename

Specify a filename for the configuration files. To provide multiple configuration files, use the `-f` flag multiple times.

### Version check

- Flag: `--skip-version-check`
- Default: `false`

Skip version check during start up to speed up process for slow connections.

<!-- Reference-style links, will not render on page. -->

[Flow Development Wallet]: https://github.com/onflow/fcl-dev-wallet
[Flow Dev Wallet Project]: https://github.com/onflow/fcl-dev-wallet