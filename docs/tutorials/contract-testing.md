---
title: Smart Contract Testing Guidelines
sidebar_label: Smart Contract Testing
sidebar_position: 2
---

Ensuring comprehensive test coverage is crucial to validate the quality of code intended for deployment on the Flow blockchain.

Automated tests can be executed both locally in the Flow emulator and on the Flow testnet. These tests should encompass unit tests, which exercise each feature of a contract, and integration tests, which examine the behavior of different parts of the project as a whole.

Human-driven tests, where individual testers manually navigate through user stories via the project's user interface or custom transactions, can also be performed locally. Similar tests with groups of participants can be conducted on the testnet in a similar manner.

Finally, unstructured closed testing with a limited audience on testnet can provide valuable insights into performance and security by capturing usage data through more organic interaction with the project's smart contracts over days or weeks.

## Testing Requirements

It is recommended to follow the best practices outlined below:

- Every publicly exposed feature of a contract and its resources should have unit tests that verify both success with correct input and failure with incorrect input. These tests should be capable of running locally with the Flow emulator, requiring minimal additional resources or configuration, and with a single command.

- Each user story or workflow that involves the smart contracts should have an integration test ensuring that the series of steps required to complete it does so successfully with test data.

Ensure extensive testing of all contracts and their integration into your application before proceeding to the mainnet. Aim to replicate conditions as closely as possible to the usage patterns on the mainnet.

## Writing Tests

Official SDKs for Flow are available in both Go and JavaScript.

In both cases, the code will need to deploy the contracts, configure accounts to interact with them, and send transactions. It will then have to wait for the transactions to be sealed and check the results by catching exceptions, examining events, and querying state using scripts.

### Go Tests

Tests in Go can be authored using [flow-go-sdk](https://github.com/onflow/flow-go-sdk) and the `go test` command.

Examples of Go tests can be found in the following projects: [flow-core-contracts](https://github.com/onflow/flow-core-contracts/tree/master/lib/go/test), [flow-nft](https://github.com/onflow/flow-nft/tree/master/lib/go/test), [flow-ft](https://github.com/onflow/flow-ft/tree/master/lib/go/test).

> **Note**: These tests are currently tied to the emulator but can be refactored to run on the testnet.

### JavaScript Tests

Tests in JavaScript can be authored using [flow-js-testing](https://github.com/onflow/flow-js-testing).
