
# Introduction to Testing in Cadence

Testing is an essential part of smart contract development to ensure the correctness and reliability of your code. Cadence Testing Framework provides a convenient way to write tests for your programs, allowing you to verify the functionality and correctness of your smart contracts.

## Install Flow CLI

The [Flow CLI](../../tools/flow-cli/index.md) is the primary tool for developing, testing, and deploying smart contracts to the Flow network.

If you haven't installed the Flow CLI yet and have [homebrew](https://brew.sh/) installed, simply run `brew install flow-cli`. Alternatively, refer to the Flow CLI [installation instructions](../../tools/flow-cli/install.md).

## Create a new project

In your preferred code editor, create a new directory for your project and navigate to it in the terminal. Then 
initialize a new Flow project by running the command `flow init`. This will create a `flow.json` file that contains the [project configuration](../../tools/flow-cli/flow.json/configuration.md).

```bash
mkdir test-cadence
cd test-cadence
flow init
```

## Write a simple smart contract

In your code editor, create a new file called `calculator.cdc` and add the following code:

```cadence calculator.cdc
access(all) contract Calculator {
    access(all) fun add(a: Int, b: Int): Int {
        return a + b;
    }

    access(all) fun subtract(a: Int, b: Int): Int {
        return a - b;
    }
}
```

## Add the smart contract to the config

Run `flow config add contract` and add the created `calculator.cdc` contract to the config with the name as `Calculator`. This command adds your contract name and location under the `contracts` key in `flow.json`.

```
Enter name: Calculate
Enter contract file location: ./calculator.cdc
```

## Write unit test cases

In the same directory, create a new file called `calculator_test.cdc` and add the following code:

```cadence calculator_test.cdc
import Test
import "Calculator" // contract name from the previous step

access(all) let calculator = Calculator()

access(all) fun testAdd() {
  Test.assertEqual(5, calculator.add(a: 2, b: 3))
}

access(all) fun testSubtract() {
  Test.assertEqual(2, calculator.subtract(a: 5, b: 3))
}

```

This code
- imports the `Calculator` contract from the `calculator.cdc` file (according to `flow.json`); 
- creates an `calculator` instance of the smart-contract;
- defines two test functions: `testAdd()` and `testSubtract()`;
- calls `add()` and `subtract()` methods with different input values  respectively.

## Running the test cases

To run the test cases, use the following command in the terminal:

```bash
flow test ./calculator_test.cdc
```

This command uses the Flow CLI to run the test cases and display the output. You should see the following output:

```
Test results: "./calculator_test.cdc"
- PASS: testAdd
- PASS: testSubtract
```

This output indicates that both test cases ran successfully, and the smart contract is functioning as expected.

## Advanced Testing Techniques

The Cadence testing framework provides various features and techniques for writing comprehensive test cases. Some of these include:

- [**Code Coverage**](https://github.com/m-Peter/flow-code-coverage): You can use the `--cover` flag with the `flow test` command to view code coverage results when running your tests. This allows you to identify areas of your code that are not adequately covered by your test inputs;
- **Test Fixtures**: Test fixtures are reusable components that help you set up the initial state for your test cases. You can create test fixtures in Cadence by defining resource types and using them in your test functions;
- [**Assertions**](https://cadence-lang-docs-git-fix-links-versions-onflow.vercel.app/docs/0.42/testing-framework#assertions): The testing framework provides built-in assertion functions, such as `assertEqual`, `beNil`, `beEmpty`, `contain`, to help you verify the expected behavior of your smart contracts;
- **Test Suites**: You can organize your test cases into test suites to improve the readability and maintainability of your test code. Test suites allow you to group related test cases and set up common test fixtures for all the tests in the suite.
- [**Integration tests**](https://github.com/bjartek/overflow): You can use [Overflow tool](https://github.com/bjartek/overflow) to run integration tests against either an local emulator, testnet, mainnet or an in memory instance of the flow-emulator.

By leveraging these advanced testing techniques, you can write more robust and reliable smart contracts in Cadence. In this example, we set up a basic testing environment, wrote a simple smart contract in Cadence, and created a test case to verify its functionality. We then used the Flow CLI to run the test case and confirm that the smart contract is working correctly. 

This is a basic example, and there are many more advanced features and techniques you can explore when working with the Cadence Testing Framework. 

For more in-depth tutorials and documentation, refer to the official [Cadence language documentation](https://cadencelang.org/) and the [Flow CLI documentation](../../tools/flow-cli/index.md).

## References

- [Reference documentation for Cadence testing](https://cadence-lang-docs-git-fix-links-versions-onflow.vercel.app/docs/0.42/testing-framework)
- https://github.com/bjartek/overflow
