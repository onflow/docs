---
title: Running Cadence Tests
description: How to run Cadence tests from the CLI
sidebar_position: 11
---

The Flow CLI provides a straightforward command to execute Cadence tests, enabling developers to validate their scripts and smart contracts effectively.

To run all tests in your project, simply use:

```shell
flow test
```

The `flow test` command automatically discovers and runs all test scripts in your project that end with `_test.cdc`.

> **Note:** The `test` command requires a properly initialized configuration. If you haven’t set up your Flow project yet, refer to the [flow init](../flow.json/initialize-configuration.md) guide for assistance.

---

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

To learn more about writing tests in Cadence, visit the [Cadence Testing Framework](../../../build/smart-contracts/testing.md) documentation.

---

### Running Specific Tests

If you wish to run a specific test script rather than all tests, you can provide the path to the test file:

```shell
flow test path/to/your/test_script_test.cdc
```

This will execute only the tests contained in the specified file.

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

```plaintext
Test results:
- PASS: test_script_test.cdc > testSumOfTwo
There are no statements to cover
```

> **Note:** In this example, the coverage report is empty because the `--covercode` flag is set to `"contracts"`, and the test script only contains scripts, not contracts.