---
id: defi-contracts-mainnet
title: DeFi Contracts on Flow Mainnet
description: A reference table of frequently used DeFi contracts on Flow, including their addresses for both Flow EVM and Flow Cadence.
keywords:
  - DeFi contracts
  - Flow blockchain
  - Flow EVM
  - Flow Cadence
  - Flow EVM Mainnet
  - Flow Cadence Mainnet
  - stablecoins
  - wrapped assets
  - AMMs
  - DEXs
  - KittyPunch
  - PunchSwap
sidebar_position: 1
sidebar_label: DeFi Contracts Mainnet
---

import StablecoinsWrappedAssetsTable from '@site/src/components/defi-contracts/StablecoinsWrappedAssetsTable';
import CopyButton from '@site/src/components/CopyButton';

Flow is a Layer 1 blockchain that supports EVM equivalency, offering two environments Flow EVM and Flow Cadence. Fungible and non-fungible tokens can seamlessly transfer between these environments via the native VM token bridge. As a result, many tokens have both a Flow EVM mainnet contract address and a Flow Cadence mainnet contract address, allowing developers to choose their preferred environment.

Below is a list of commonly used DeFi contracts on Flow Mainnet:

[Switch to DeFi Contracts on Testnet](./defi-contracts-testnet.md)

## Stablecoins & Wrapped Assets

#### Flow EVM Mainnet

<StablecoinsWrappedAssetsTable environment="evm" />

#### Flow Cadence Mainnet

<StablecoinsWrappedAssetsTable environment="cadence" />

#### Flow Cadence Testnet

<StablecoinsWrappedAssetsTable environment="testnet" />

## AMMs & DEXs

#### Flow EVM Mainnet

| Contract Name                                | Flow EVM Mainnet Address                     | Docs                   |
| -------------------------------------------- | -------------------------------------------- | ---------------------- |
| [StableKittyFactoryNG.sol (KittyPunch)][1]   | `0x4412140D52C1F5834469a061927811Abb6026dB7` | [Docs][kittypunch-doc] |
| [TwoKittyFactory.sol (KittyPunch)][2]        | `0xf0E48dC92f66E246244dd9F33b02f57b0E69fBa9` | [Docs][kittypunch-doc] |
| [TriKittyFactory.sol (KittyPunch)][3]        | `0xebd098c60b1089f362AC9cfAd9134CBD29408226` | [Docs][kittypunch-doc] |
| [KittyRouterNgPoolsOnly.sol (KittyPunch)][4] | `0x87048a97526c4B66b71004927D24F61DEFcD6375` | [Docs][kittypunch-doc] |
| [PunchSwapV2Router02.sol (KittyPunch)][5]    | `0xf45AFe28fd5519d5f8C1d4787a4D5f724C0eFa4d` | [Docs][kittypunch-doc] |
| [PunchSwapV2Factory.sol (KittyPunch)][6]     | `0x29372c22459a4e373851798bFd6808e71EA34A71` | [Docs][kittypunch-doc] |
| [TrenchesTokensBuyer.sol (KittyPunch)][7]    | `0x6D0e081Acc28eA9ee6b7fD293eC03F97147b026d` | [Docs][kittypunch-doc] |

#### Flow Cadence Mainnet

| Contract Name                      | Flow Cadence Mainnet Address | [CLI](https://developers.flow.com/build/tools/flow-cli/dependency-manager)                                                         | Docs                    |
| ---------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [SwapFactory (IncrementFi)][22]    | `0xb063c16cac85dbd1`         | <CopyButton text="flow dependencies install mainnet://0xb063c16cac85dbd1.SwapFactory" title="Copy install command (mainnet)" />    | [Docs][incrementfi-doc] |
| [SwapPair (IncrementFi)][23]       | `0xecbda466e7f191c7`         | <CopyButton text="flow dependencies install mainnet://0xecbda466e7f191c7.SwapPair" title="Copy install command (mainnet)" />       | [Docs][incrementfi-doc] |
| [SwapError (IncrementFi)][24]      | `0xb78ef7afa52ff906`         | <CopyButton text="flow dependencies install mainnet://0xb78ef7afa52ff906.SwapError" title="Copy install command (mainnet)" />      | [Docs][incrementfi-doc] |
| [SwapInterfaces (IncrementFi)][25] | `0xb78ef7afa52ff906`         | <CopyButton text="flow dependencies install mainnet://0xb78ef7afa52ff906.SwapInterfaces" title="Copy install command (mainnet)" /> | [Docs][incrementfi-doc] |
| [SwapConfig (IncrementFi)][26]     | `0xb78ef7afa52ff906`         | <CopyButton text="flow dependencies install mainnet://0xb78ef7afa52ff906.SwapConfig" title="Copy install command (mainnet)" />     | [Docs][incrementfi-doc] |
| [SwapRouter (IncrementFi)][27]     | `0xa6850776a94e6551`         | <CopyButton text="flow dependencies install mainnet://0xa6850776a94e6551.SwapRouter" title="Copy install command (mainnet)" />     | [Docs][incrementfi-doc] |

## Bridges & Cross-Chain Messaging

| Bridge / Protocol                            | Reference Docs           |
| -------------------------------------------- | ------------------------ |
| Stargate Bridge ([stargate.finance][8])      | [Mainnet Contracts][9]   |
| Hyperlane Bridge ([trump.hyperlane.xyz][10]) | [Mainnet Contracts][11]  |
| Flow Bridge ([bridge.flow.com][12])          | [Superbridge Docs][13]   |
| Celer cBridge ([cbridge.celer.network][14])  | [Celer cBridge Docs][15] |
| DeBridge ([app.debridge.finance][34])        | [DeBridge Contracts][35] |
| Relay ([relay.link][36])                     | [Relay Contracts][37]    |
| LayerZero                                    | [Mainnet Contracts][16]  |
| Axelar                                       | [Axelar Docs][17]        |

## Omni Fungible Tokens (PYUSD → USDF)

#### Solana Mainnet

| Contract Name        | Contract Address                               |
| -------------------- | ---------------------------------------------- |
| PYUSD Program ID     | `28EyPNAi9BMTvGuCaQrptMXjpWUi7wx8SxAFVoSZxSXe` |
| PYUSD Mint           | `2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo` |
| PYUSD Mint Authority | `22mKJkKjGEQ3rampp5YKaSsaYZ52BUkcnUN6evXGsXzz` |
| PYUSD Escrow         | `6z3QyVS36nQ9fk2YvToxqJqXqtAFsSijqgHxpzKyG5xn` |
| PYUSD OFT Store      | `2KUb8dcZR9LyrSg4RdkQx91xX6mPQLpS1MEo6gwfvLZk` |

#### Ethereum Mainnet

| Contract Name | Contract Address                             |
| ------------- | -------------------------------------------- |
| PYUSD Token   | `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8` |
| PYUSD Locker  | `0xFA0e06B54986ad96DE87a8c56Fea76FBD8d493F8` |

## Oracles

#### Flow EVM Mainnet

| Contract Name                  | Flow EVM Mainnet Address                     |
| ------------------------------ | -------------------------------------------- |
| [ERC1967Proxy.sol (Pyth)][18]  | `0x2880aB155794e7179c9eE2e38200202908C17B43` |
| [ERC1967Proxy.sol (Stork)][28] | `0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62` |

#### Flow Cadence Mainnet

| Contract Name                             | Flow Cadence Mainnet Address | [CLI](https://developers.flow.com/build/tools/flow-cli/dependency-manager)                                                            | Docs                    |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [PublicPriceOracle.cdc (IncrementFi)][19] | `0xec67451f8a58216a`         | <CopyButton text="flow dependencies install mainnet://0xec67451f8a58216a.PublicPriceOracle" title="Copy install command (mainnet)" /> | [Docs][incrementfi-doc] |
| [BandOracle.cdc (Band) Protocol][33]      | `0x6801a6222ebf784a`         | <CopyButton text="flow dependencies install mainnet://0x6801a6222ebf784a.BandOracle" title="Copy install command (mainnet)" />        | [Docs][band-oracle-doc] |

## Ethereum Attestation Service

More information can be found on the Credora docs site for [EAS on Flow](https://credora.gitbook.io/eas-for-flow).

| Contract Name                                           | Flow EVM Mainnet Address                     |
| ------------------------------------------------------- | -------------------------------------------- |
| [SchemaRegistry.sol (Ethereum Attestation Service)][20] | `0xB0cF748a05AEA8D59e15834446CFC95bcFF510F0` |
| [EAS.sol (Ethereum Attestation Service)][21]            | `0xc6376222F6E009A705a34dbF1dF72fEf8efB3964` |

[1]: https://evm.flowscan.io/address/0x4412140D52C1F5834469a061927811Abb6026dB7?tab=contract
[2]: https://evm.flowscan.io/address/0xf0E48dC92f66E246244dd9F33b02f57b0E69fBa9?tab=contract
[3]: https://evm.flowscan.io/address/0xebd098c60b1089f362AC9cfAd9134CBD29408226?tab=contract
[4]: https://evm.flowscan.io/address/0x87048a97526c4B66b71004927D24F61DEFcD6375?tab=contract
[5]: https://evm.flowscan.io/address/0xf45AFe28fd5519d5f8C1d4787a4D5f724C0eFa4d?tab=contract
[6]: https://evm.flowscan.io/address/0x29372c22459a4e373851798bFd6808e71EA34A71?tab=contract
[7]: https://evm.flowscan.io/address/0x6D0e081Acc28eA9ee6b7fD293eC03F97147b026d?tab=contract
[8]: https://stargate.finance/bridge?srcChain=ethereum&srcToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&dstChain=flow&dstToken=0xF1815bd50389c46847f0Bda824eC8da914045D14
[9]: https://stargateprotocol.gitbook.io/stargate/v2-developer-docs/technical-reference/mainnet-contracts#flow
[10]: https://trump.hyperlane.xyz/
[11]: https://docs.hyperlane.xyz/docs/reference/addresses/mailbox-addresses
[12]: https://bridge.flow.com/
[13]: https://docs.superbridge.app/
[14]: https://cbridge.celer.network/1/747/USDC-intermediary
[15]: https://cbridge-docs.celer.network/tutorial/flow-cadence-bridging-guide
[16]: https://docs.layerzero.network/v1/developers/evm/technical-reference/deployed-contracts?chains=flow
[17]: https://docs.axelar.dev/validator/external-chains/flow/
[18]: https://evm.flowscan.io/address/0x2880aB155794e7179c9eE2e38200202908C17B43?tab=contract
[19]: https://flowscan.io/contract/A.ec67451f8a58216a.PublicPriceOracle
[20]: https://evm.flowscan.io/address/0xB0cF748a05AEA8D59e15834446CFC95bcFF510F0?tab=contract
[21]: https://evm.flowscan.io/address/0xc6376222F6E009A705a34dbF1dF72fEf8efB3964?tab=contract
[22]: https://flowscan.io/contract/A.b063c16cac85dbd1.SwapFactory
[23]: https://flowscan.io/contract/A.ecbda466e7f191c7.SwapPair
[24]: https://flowscan.io/contract/A.b78ef7afa52ff906.SwapError
[25]: https://flowscan.io/contract/A.b78ef7afa52ff906.SwapInterfaces
[26]: https://flowscan.io/contract/A.b78ef7afa52ff906.SwapConfig
[27]: https://flowscan.io/contract/A.a6850776a94e6551.SwapRouter
[28]: https://evm.flowscan.io/address/0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62?tab=contract
[29]: https://evm-testnet.flowscan.io/address/0x97900F59828Da4187607Cb8F84f49e3944199d18?tab=contract
[30]: https://evm-testnet.flowscan.io/address/0xBCF2dA8f82fb032A2474c92Ec5b70C95A83fc0cc?tab=contract
[31]: https://testnet.flowscan.io/contract/A.8232ce4a3aff4e94.PublicPriceOracle
[32]: https://testnet.flowscan.io/contract/A.9fb6606c300b5051.BandOracle
[33]: https://flowscan.io/contract/A.6801a6222ebf784a.BandOracle
[34]: https://app.debridge.finance/
[35]: https://docs.debridge.finance/dln-the-debridge-liquidity-network-protocol/deployed-contracts
[36]: https://relay.link/bridge
[37]: https://docs.relay.link/resources/contract-addresses
[band-oracle-doc]: ./band-oracle
[incrementfi-doc]: https://docs.increment.fi/
[kittypunch-doc]: https://kittypunch.gitbook.io/kittypunch-docs
