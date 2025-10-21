---
title: Client Tools
description: Comprehensive guide to Flow's client tools and SDKs, including FCL-JS, Go SDK, and various language-specific implementations for interacting with the Flow blockchain.
sidebar_position: 6
keywords:
  - FCL
  - Flow Client Library
  - SDKs
  - client tools
  - JavaScript
  - Go
  - Python
  - Ruby
  - JVM
  - Swift
  - .NET
  - Rust
  - PHP
  - Elixir
  - HTTP API
  - blockchain
  - development
  - integration
  - wallets
  - authentication
  - transactions
  - cross-vm
  - EVM
  - Cadence
---

# Client Tools

Flow provides a comprehensive suite of client tools and SDKs designed to help developers build applications that interact with the Flow blockchain. These tools support various programming languages and platforms, offering different levels of abstraction and functionality.

> Terminology note
>
> Anywhere an API or SDK accepts a Flow transaction ID, you may also provide a scheduled transaction ID:
> - Transaction ID: 256-bit hash represented as a 64-character hex string
> - Scheduled transaction ID: UInt64 represented as a decimal string
> 
> For REST endpoints like `/v1/transactions/{id}` and `/v1/transaction_results/{id}`, the server treats the `id` as a transaction ID if it parses as hex; otherwise, as a scheduled transaction ID if it parses as a decimal UInt64. Both return identical response schemas. See the Protocol docs for details (`docs/protocol/access-onchain-data/index.md`).

## JavaScript (FCL)

[Flow Client Library (FCL)] is the primary JavaScript/TypeScript client for Flow. It provides:

- Wallet integration and authentication
- Transaction and script execution
- Cross-VM functionality for EVM integration
- TypeScript support
- Built-in security features

## Go SDK

[Flow Go SDK] offers a robust set of packages for Go developers, including:

- High-performance blockchain interaction
- Transaction building and signing
- Account management
- Event subscription
- Comprehensive testing utilities

## Python SDK

[Flow Python SDK] provides Python developers with:

- Simple blockchain interaction
- Transaction management
- Account handling
- Event monitoring
- Easy integration with Python applications

## Ruby

[FlowClient] is a Ruby gRPC client that enables:

- Direct blockchain communication
- Transaction processing
- Account management
- Event handling
- Ruby-native blockchain integration

## JVM

[Flow JVM SDK] supports JVM-compatible languages (Java, Kotlin, Scala) with:

- Kotlin-first implementation
- Transaction management
- Account handling
- Event subscription
- Cross-platform compatibility

## Swift

[flow-swift] is designed for iOS development, offering:

- Native iOS integration
- Wallet connectivity
- Transaction management
- Account handling
- SwiftUI support

## .NET

[flow.net] provides .NET developers with:

- C# and .NET Core support
- Transaction management
- Account handling
- Event monitoring
- Cross-platform compatibility

## Rust

[Rust SDK] offers Rust developers:

- High-performance blockchain interaction
- Type-safe transaction handling
- Account management
- Event subscription
- Memory safety guarantees

## PHP

[PHP SDK] enables PHP developers to:

- Integrate blockchain functionality
- Handle transactions
- Manage accounts
- Monitor events
- Build web applications

## Elixir

[OnFlow] provides Elixir developers with:

- Functional blockchain interaction
- Transaction management
- Account handling
- Event subscription
- Comprehensive documentation

## HTTP API

[Flow OpenAPI] specification provides:

- RESTful API endpoints
- Standardized API documentation
- Language-agnostic integration
- Easy API testing
- Swagger/OpenAPI support

Each client tool is designed with specific use cases and developer needs in mind. Choose the one that best fits your development environment and requirements.

[Flow Client Library (FCL)]: ./fcl-js/index.md
[Flow Go SDK]: ./flow-go-sdk/index.md
[Flow Python SDK]: https://github.com/janezpodhostnik/flow-py-sdk
[FlowClient]: https://github.com/glucode/flow_client
[Flow JVM SDK]: https://github.com/onflow/flow-jvm-sdk
[flow-swift]: https://github.com/Outblock/flow-swift
[flow.net]: https://github.com/tyronbrand/flow.net
[Rust SDK]: https://github.com/fee1-dead/flow.rs
[PHP SDK]: https://github.com/mayvenstudios/flow-php-sdk
[OnFlow]: https://github.com/nkezhaya/on_flow
[Flow OpenAPI]: /http-api
