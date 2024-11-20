---
title: Running Cadence Tests
description: How to run Cadence tests from the CLI
sidebar_position: 11
---

The Flow CLI provides a straightforward command to execute Cadence tests, enabling developers to validate their scripts and smart contracts effectively.

```shell
flow test /path/to/test_script.cdc
```

⚠️ The `test` command requires a properly initialized configuration. If you haven’t set up your Flow project yet, refer to the [flow init](../flow.json/initialize-configuration.md) guide for assistance.

## Example Usage

Below is an example of a simple Cadence test script, `test_script.cdc`, which verifies the functionality of a Cadence script executed in the testing environment.

```cadence
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

You can run the test using the CLI as follows:

```shell
$ flow test test_script.cdc
```

The results will be displayed in the terminal:

```shell
Test results: "test_script.cdc"
- PASS: testSumOfTwo
```

To learn more about writing tests in Cadence, visit the [Cadence testing framework](../../../build/smart-contracts/testing.md) documentation.

## Flags

The flow test command supports several flags that provide additional functionality for managing test execution and coverage reporting.

### Coverage Report

- **Flag**: `--cover`
- **Default**: `false`

The `--cover` flag calculates the coverage of the code being tested, helping you identify untested parts of your script.

```shell
$ flow test --cover test_script.cdc

Test results: "test_script.cdc"
- PASS: testSumOfTwo
Coverage: 96.5% of statements

```

### Coverage Report Output File

- **Flag**: `--coverprofile`
- **Valid Inputs**: A valid filename with extension `.json` or `.lcov`
- **Default**: `"coverage.json"`

Use the -`-coverprofile` flag to specify the output file for the coverage report.

Example:

```shell
$ flow test --cover --coverprofile="coverage.lcov" test_script.cdc
```

This generated coverage file can then be inspected:

```shell
$ cat coverage.lcov
```

### Coverage Code Type

- **Flag**: `--covercode`
- **Valid Inputs**: `"all"` or `"contracts"`
- **Default**: `"all"`

The `--covercode` flag lets you limit the coverage report to specific types of code. Setting the value to `"contracts"` excludes scripts and transactions from the coverage analysis.

```shell
$ flow test --cover --covercode="contracts" test_script.cdc

Test results: "tests/test_script.cdc"
- PASS: testSumOfTwo
There are no statements to cover
```

> Note: In this example, the coverage report is empty because the `--covercode` flag is set to `"contracts"`, and the test script only contains a script.

