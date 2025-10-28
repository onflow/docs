---
title: Running Cadence Tests
sidebar_label: Running Cadence Tests
description: How to run Cadence tests from the CLI
sidebar_position: 11
keywords:
  - flow test
  - Cadence tests
  - Flow CLI
  - test command
  - test flags
  - code coverage
  - fork testing
  - flow test --fork
  - fork-height
  - fork-host
  - mainnet fork
  - testnet fork
  - test discovery
  - test aliases
  - testing configuration
  - test selection
  - test by name
  - random testing
  - coverage reporting
  - test automation
  - integration testing
  - spork boundaries
---

The Flow CLI provides a straightforward command to execute Cadence tests, enabling developers to validate their scripts and smart contracts effectively.

To run all tests in your project, simply use:

```shell
flow test
```

The `flow test` command automatically discovers and runs all test scripts in your project that end with `_test.cdc`.

> **Note:** The `test` command requires a properly initialized configuration. If you haven’t set up your Flow project yet, refer to the [flow init](flow.json/initialize-configuration.md) guide for assistance.

## Prerequisites

Before running your tests, ensure that your contracts are properly configured in your `flow.json` file, including any necessary testing aliases.

### Setting Up Testing Aliases in Contracts

If your tests involve deploying or interacting with contracts, you need to add your contracts to the `contracts` section in the `flow.json` configuration file. Specifically, include the contract name, source location, and an address alias for the `testing` environment.

Example `flow.json` configuration:

```json
{
  "contracts": {
    "Counter": {
      "source": "cadence/contracts/Counter.cdc",
      "aliases": {
        "testing": "0x0000000000000007"
      }
    }
  },
  "networks": {
    // ... your network configurations
  },
  "accounts": {
    // ... your account configurations
  },
  "deployments": {
    // ... your deployment configurations
  }
}
```

For the `testing` alias, you can use one of the following addresses:

- `0x0000000000000005`
- `0x0000000000000006`
- `0x0000000000000007`
- `0x0000000000000008`
- `0x0000000000000009`
- `0x000000000000000A`
- `0x000000000000000B`
- `0x000000000000000C`
- `0x000000000000000D`
- `0x000000000000000E`

> **Note**: For more information on setting up contracts and aliases, refer to the [Flow CLI Configuration](flow.json/initialize-configuration.md) documentation.

## Example Usage

Assuming you have a test script named `test_script_test.cdc` in your project directory, which verifies the functionality of a Cadence script executed in the testing environment:

```cadence
// test_script_test.cdc
import Test

access(all) let blockchain = Test.newEmulatorBlockchain()

access(all) fun testSumOfTwo() {
    let scriptResult = blockchain.executeScript(
        "access(all) fun main(a: Int, b: Int): Int { return a + b }",
        [2, 3]
    )

    Test.expect(scriptResult, Test.beSucceeded())

    let sum = scriptResult.returnValue! as! Int
    Test.assertEqual(5, sum)
}
```

This script defines a single test case, `testSumOfTwo`, which checks if a Cadence script that adds two integers `(a + b)` works as expected. The test passes if the result matches the expected value of `5`.

You can run all tests in your project using the CLI:

```shell
$ flow test
```

The Flow CLI will discover all test scripts ending with `_test.cdc` and execute them. The results will be displayed in the terminal:

```shell
Test results:
- PASS: test_script_test.cdc > testSumOfTwo
```

To learn more about writing tests in Cadence, visit the [Cadence Testing Framework](../../cadence/smart-contracts/testing.md) documentation.

---

### Running Specific Tests and Files

Run specific test scripts or directories by providing their paths:

```shell
flow test path/to/your/test_script_test.cdc path/to/another_test.cdc tests/subsuite/
```

This executes only the tests contained in the specified files and directories.

---

## Flags

The `flow test` command supports several flags that provide additional functionality for managing test execution and coverage reporting.

### **Coverage Report**

- **Flag:** `--cover`
- **Default:** `false`

The `--cover` flag calculates the coverage of the code being tested, helping you identify untested parts of your scripts and contracts.

```shell
$ flow test --cover
```

Sample output:

```shell
Test results:
- PASS: test_script_test.cdc > testSumOfTwo
Coverage: 96.5% of statements
```

---

### Coverage Report Output File

- **Flag:** `--coverprofile`
- **Valid Inputs:** A valid filename with extension `.json` or `.lcov`
- **Default:** `"coverage.json"`

Use the `--coverprofile` flag to specify the output file for the coverage report.

Example:

```shell
$ flow test --cover --coverprofile="coverage.lcov"
```

The generated coverage file can then be inspected:

```shell
$ cat coverage.lcov
```

### Coverage Code Type

- **Flag:** `--covercode`
- **Valid Inputs:** `"all"` (default) or `"contracts"`
- **Default:** `"all"`

The `--covercode` flag lets you limit the coverage report to specific types of code. Setting the value to `"contracts"` excludes scripts and transactions from the coverage analysis.

```shell
$ flow test --cover --covercode="contracts"
```

Sample output when no contracts are present:

```shell
Test results:
- PASS: test_script_test.cdc > testSumOfTwo
There are no statements to cover
```

> **Note:** In this example, the coverage report is empty because the `--covercode` flag is set to `"contracts"`, and the test script only contains scripts, not contracts.

### Random Execution of Test Cases

- **Flag:** `--random`
- **Default:** `false`

Use the `--random` flag to execute test cases in a random order. This can help identify issues that may arise due to test dependencies or the order in which tests are run.

```shell
flow test --random
```

### Seed for Random Execution

- **Flag:** `--seed`
- **Default:** `0`

Use the `--seed` flag to specify a seed value for the random execution order of test cases. This allows you to reproduce a specific random order by using the same seed value, which is helpful for debugging flaky tests.

```shell
flow test --seed=12345
```

> **Note:** If both `--random` and `--seed` are provided, the `--random` flag will be ignored, and the seed value from `--seed` will be used for randomization.

---

### Run Specific Test by Name

- **Flag:** `--name`
- **Default:** `""` (empty string)

Use the `--name` flag to run only tests that match the given name. This is useful when you want to execute a specific test function within your test scripts.

```shell
flow test --name=testSumOfTwo
```

This command will run only the test function named `testSumOfTwo` across all test scripts that contain it.

To dive deeper into testing the functionality of your Cadence scripts and contracts, explore the [Cadence Testing Framework](https://cadence-lang.org/docs/testing-framework) documentation.

---

### Fork Testing Flags

Run tests against forked mainnet or testnet state. For a step-by-step tutorial, see: [Fork Testing with Cadence](../../../blockchain-development-tutorials/cadence/fork-testing/index.md). For background and best practices, see the guide: [Testing Strategy on Flow](../../cadence/smart-contracts/testing-strategy.md).

#### --fork

- Type: `string`
- Default: `""` (empty). If provided without a value, defaults to `mainnet`.

Fork tests from a network defined in `flow.json`. The CLI resolves the GRPC access host and chain ID from the selected network configuration.

```shell
flow test --fork          # Uses mainnet by default
flow test --fork testnet  # Uses testnet
flow test --fork mynet    # Uses a custom network defined in flow.json
```

Requirements:

- The network must exist in `flow.json`
- The network must have a valid `host` configured


#### --fork-host

- Type: `string`
- Default: `""`

Directly specify a GRPC access node host. This bypasses the `flow.json` network lookup.

```shell
flow test --fork-host access.mainnet.nodes.onflow.org:9000
```

See public access node URLs in [Flow Networks](../../../protocol/flow-networks/index.md).

#### --fork-height

- Type: `uint64`
- Default: `0`

Pin the fork to a specific block height for historical state testing. Only blocks from the current spork (since the most recent network upgrade) are available via public access nodes; earlier blocks are not accessible via public access nodes.

```shell
flow test --fork mainnet --fork-height 85432100
```

> Note: Historical data beyond spork boundaries is not available via standard access nodes. See the [Network Upgrade (Spork) Process](../../../protocol/node-ops/node-operation/network-upgrade.md).
