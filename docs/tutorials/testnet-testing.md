---
title: Testnet Testing Guidelines
sidebar_label: Testnet Testing
sidebar_position: 4
---

Testing your applications and contracts thoroughly on the testnet is a critical step on the road to the mainnet. This process helps you create stable and robust applications using the Flow development stack.

## Testing Your Application

### Automated Testing of Contract Code

Ensure that all contracts have comprehensive test coverage for every contract function, accounting for both success and failure cases. These tests should be runnable in automated environments, such as Continuous Integration (CI). Utilize the [JavaScript testing framework](https://github.com/onflow/flow-js-testing) to create tests for your smart contract code.

### Stress Testing Live Applications Before Mainnet

After deploying your application to the testnet, it's essential to observe how it handles non-trivial amounts of traffic. This step ensures there are no issues when your application experiences real-world usage.

Familiarize yourself with the [Cadence anti-patterns](../build/smart-contracts//best-practices/anti-patterns.md) to prevent problematic or unintended behavior.
