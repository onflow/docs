---
title: Run Cadence tests
description: How to run Cadence tests from the command line
sidebar_position: 11
---

The Flow CLI provides a command to run Cadence tests. 

```shell
flow test /path/to/test_script.cdc
```

⚠️ The `test` command expects configuration to be initialized. See [flow init](../flow.json/initialize-configuration.md) command.

## Example Usage

A simple Cadence script `test_script.cdc`, which has a test case for running a cadence script on-chain:
```cadence
import Test

pub let blockchain = Test.newEmulatorBlockchain()

pub fun testSumOfTwo() {
    let scriptResult = blockchain.executeScript(
        "pub fun main(a: Int, b: Int): Int { return a + b }",
        [2, 3]
    )

    Test.expect(scriptResult, Test.beSucceeded())

    let sum = scriptResult.returnValue! as! Int
    Test.assertEqual(5, sum)
}
```
The above test-script can be run with the CLI as follows, and the test results will be printed on the console.
```shell
$ flow test test_script.cdc

Test results: "test_script.cdc"
- PASS: testSumOfTwo

```

To learn more about writing tests in Cadence, take a look at the [Cadence testing framework](../../../build/guides/smart-contracts/testing.md).

## Flags

### Coverage

- Flag: `--cover`
- Default: `false`

Use the `cover` flag to calculate coverage report for the code being tested.
```shell
$ flow test --cover test_script.cdc

Test results: "test_script.cdc"
- PASS: testSumOfTwo
Coverage: 96.5% of statements

```

### Coverage Report File

- Flag: `--coverprofile`
- Valid inputs: valid filename and extension
- Default: `"coverage.json"`

Use the `coverprofile` to specify the filename where the calculated coverage report is to be written. Supported filename extensions are `.json` and `.lcov`.
```shell
$ flow test --cover test_script.cdc

$ cat coverage.json

$ flow test --cover --coverprofile="coverage.lcov" test_script.cdc

$ cat coverage.lcov
```

### Coverage Code Type

- Flag: `--covercode`
- Valid inputs: `"all"`, `"contracts"`
- Default: `"all"`

Use the `covercode` flag to calculate coverage report only for certain types of code. A value of `"contracts"` will exclude scripts and transactions from the coverage report.
```shell
$ flow test --cover --covercode="contracts" test_script.cdc

Test results: "tests/test_script.cdc"
- PASS: testSumOfTwo
There are no statements to cover
```

Since we did not use any contracts in our sample test script, there is no coverage percentage to be reported.

