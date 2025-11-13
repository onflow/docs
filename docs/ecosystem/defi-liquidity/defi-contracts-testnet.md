---
id: defi-contracts-testnet
title: DeFi Contracts on Flow Testnet
description: Frequently used DeFi contracts and resources on Flow **Testnet**, covering Flow EVM and Flow Cadence with addresses, explorers, and faucets.
keywords:
  - Flow Testnet
  - Flow EVM Testnet
  - Flow Cadence Testnet
  - DeFi contracts
  - stablecoins
  - wrapped assets
  - AMMs
  - DEXs
  - oracles
  - EAS
sidebar_position: 2
sidebar_label: DeFi Contracts Testnet
---

import CopyButton from '@site/src/components/CopyButton';

Flow is a Layer 1 blockchain that supports EVM equivalency, offering two environments Flow EVM and Flow Cadence. Fungible and non-fungible tokens can seamlessly transfer between these environments via the native VM token bridge. As a result, many tokens have both a Flow EVM mainnet contract address and a Flow Cadence mainnet contract address, allowing developers to choose their preferred environment.

Below is a list of commonly used DeFi contracts on Flow Testnet:

[Switch to DeFi Contracts on Mainnet](./defi-contracts-mainnet.md)

## Stablecoins & Wrapped Assets

#### Flow EVM Testnet

| Token                     | EVM Testnet Address                          | How to Get  |
| ------------------------- | -------------------------------------------- | ----------- |
| FLOW (native, non-erc20)  | —                                            | [Faucet][1] |
| [WFLOW][2]                | `0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e` | [Swap][28]  |
| [MOET][3]                 | `0x51f5cc5f50afb81e8f23c926080fa38c3024b238` | [Swap][29]  |
| [MockUSDC][4]                 | `0xd431955D55a99EF69BEb96BA34718d0f9fBc91b1` | [Swap][30]  |
| [mUSDC][5]     | `0x4154d5B0E2931a0A1E5b733f19161aa7D2fc4b95` | [Swap][31]  |
| [USDf][6]          | `0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F` | [Swap][32]  |
| [USD Flow][7] | `0xf2E5A325f7D678DA511E66B1c0Ad7D5ba4dF93D3` | —           |
| [USDC.e][8]       | `0x9B7550D337bB449b89C6f9C926C3b976b6f4095b` | —           |
| [ankrFLOW][9]             | `0xe132751AB5A14ac0bD3Cb40571a9248Ee7a2a9EA` | —           |
| [ankrFLOWEVM][10]         | `0x8E3DC6E937B560ce6a1Aaa78AfC775228969D16c` | —           |
| [ETHf][11]                | `0x059A77239daFa770977DD9f1E98632C3E4559848` | [Mint][14]  |
| [BTCf][12]                | `0x208d09d2a6Dd176e3e95b3F0DE172A7471C5B2d6` | [Mint][15]  |
| [cbBTC][13]               | `0x30F44C64725727F2001E6C1eF6e6CE9c7aB91dC3` | [Mint][16]  |

#### Flow Cadence Testnet

| Token                | Cadence Testnet Address | Cadence Contract Name                                        |
| -------------------- | ----------------------- | ------------------------------------------------------------ |
| [FLOW][17]           | `0x7e60df042a9c0868`    | `FlowToken`                                                  |
| [MOET][18]           | `0xd27920b6384e2a78`    | `MOET`                                                       |
| [USDC][19]           | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_d431955d55a99ef69beb96ba34718d0f9fbc91b1` |
| [mUSDC][20]          | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_4154d5b0e2931a0a1e5b733f19161aa7d2fc4b95` |
| [USDF (Mock)][21]    | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_d7d43ab7b365f0d0789ae83f4385fa710ffdc98f` |
| [USDF (PYUSD)][22]   | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_f2e5a325f7d678da511e66b1c0ad7d5ba4df93d3` |
| [USDC.e (Celer)][23] | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_9b7550d337bb449b89c6f9c926c3b976b6f4095b` |
| [ankrFLOWEVM][24]    | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_8e3dc6e937b560ce6a1aaa78afc775228969d16c` |
| [WETH][25]           | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_059a77239dafa770977dd9f1e98632c3e4559848` |
| [WBTC][26]           | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_208d09d2a6dd176e3e95b3f0de172a7471c5b2d6` |
| [cbBTC][27]          | `0xdfc20aee650fcbdf`    | `EVMVMBridgedToken_30f44c64725727f2001e6c1ef6e6ce9c7ab91dc3` |

## Vaults

#### Flow EVM Testnet

| Contract             | Address                                      |
| -------------------- | -------------------------------------------- |
| [MockTauVault][69]   | `0x72104434BEc686B47a72bCa9b998624238BD2Ffb` |
| [MockYieldVault][70] | `0x217aAC9594EcB6d3f6667A214CF579dd29ce78dd` |

## AMMs & DEXs

#### Flow EVM Testnet

| Contract                                      | EVM Testnet Address                          |
| --------------------------------------------- | -------------------------------------------- |
| [UniswapV2Factory (FlowSwap)][33]                   | `0x7d726261FB76B264fc20eA1f19D900D760136566` |
| [UniswapV2Router02 (FlowSwap)][34]                    | `0x524E1291c109BE27FDE48De97cAf0B3c0F02A68f` |
| [UniswapV2Pair (FlowSwap)][35]             | `0x21E3aa01561d7D869785aAedB14130C5807C5A12` |
| [UniswapV3Factory (FlowSwap)][36]                   | `0x92657b195e22b69E4779BBD09Fa3CD46F0CF8e39` |
| [NonfungiblePositionManager (FlowSwap)][37]      | `0x8b9F96390EC35d5859937c7c5D68Ff6D5CFC312f` |
| [SwapRouter02 (FlowSwap)][38]               | `0x2Db6468229F6fB1a77d248Dbb1c386760C257804` |
| [QuoterV2 (FlowSwap)][39]         | `0xA1e0E4CCACA34a738f03cFB1EAbAb16331FA3E2c` |
| [V3Migrator (FlowSwap)][40]                  | `0x00a101726ff770cd8ed53E8376b9440Bad40CAd9` |
| [UniswapV3Staker (FlowSwap)][41]                    | `0x04400857ad69EaA7dd6fEF1C329E80E50BD30b76` |
| [TickLens (FlowSwap)][42]                 | `0x36D9bDCbA840F5bcb95EE7bD54a86808aef6581F` |
| [NFTDescriptor (FlowSwap)][43]        | `0x6982D5Cb80Cd7E2cb7C0d0B8452841471Bc84Bc2` |
| [v3_nft_position_descriptor (FlowSwap)][44]   | `0x61f4e983A72d9BD8429154982A3d9fCF3A1D98d0` |
| [TransparentUpgradeableProxy (FlowSwap)][45]          | `0xE0895150a7c84e8fB9fecCE72F4C80c130C80fDa` |
| [UniswapV3Pool (FlowSwap)][46]            | `0xa4Db57e3d3c6674FA02a2f3a667d3C22Fe17efF4` |
| [UniversalRouter (FlowSwap)][47]             | `0xB685ab04Dfef74c135A2ed4003441fF124AFF9a0` |
| [Permit2 (FlowSwap)][48]                      | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| [FusionXInterfaceMulticall (FlowSwap)][49]                   | `0x02b9B840CDCEe84510a02cc85f351CAaD41f46CE` |
| [proxy_admin (FlowSwap)][50]                  | `0xf4011F45A666dC7eC54445a710c3aae735F7E890` |
| [StableKittyFactoryNG (KittyPunch)][51]   | `0x0699C35C0104e478f510531F5Dfc3F9313ae49D1` |
| [TwoKittyFactory (KittyPunch)][52]        | `0xeaa5949471C7B31ae97D3a52483028aE595E8e83` |
| [TriKittyFactory (KittyPunch)][53]        | `0x62aC6e05Bac04702bF744106499F72f200297121` |
| [KittyRouterNgPoolsOnly (KittyPunch)][54] | `0x70e8C797f698De61787A7275628713077723694`  |
| [PunchSwapV2Router02 (KittyPunch)][55]    | `0xeD53235cC3E9d2d464E9c408B95948836648870B` |
| [PunchSwapV2Factory (KittyPunch)][56]     | `0x0f6C2EF40FA42B2F0E0a9f5987b2f3F8Af3C173f` |

#### Flow Cadence Testnet

| Contract                              | Cadence Testnet Address | [CLI](https://developers.flow.com/build/tools/flow-cli/dependency-manager)                                                      |
| ------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [StableSwapFactory (IncrementFi)][57] | `0x6ca93d49c45a249f`    | <CopyButton text="flow dependencies install testnet://0x6ca93d49c45a249f.StableSwapFactory" title="Copy (StableSwapFactory)" /> |
| [SwapFactory (IncrementFi)][58]       | `0x6ca93d49c45a249f`    | <CopyButton text="flow dependencies install testnet://0x6ca93d49c45a249f.SwapFactory" title="Copy (SwapFactory)" />             |
| [SwapPair (IncrementFi)][59]          | `0x7afd587a5d5e2efe`    | <CopyButton text="flow dependencies install testnet://0x7afd587a5d5e2efe.SwapPair" title="Copy (SwapPair)" />                   |
| [SwapConfig (IncrementFi)][60]        | `0x8d5b9dd833e176da`    | <CopyButton text="flow dependencies install testnet://0x8d5b9dd833e176da.SwapConfig" title="Copy (SwapConfig)" />               |
| [SwapError (IncrementFi)][61]         | `0x8d5b9dd833e176da`    | <CopyButton text="flow dependencies install testnet://0x8d5b9dd833e176da.SwapError" title="Copy (SwapError)" />                 |
| [SwapInterfaces (IncrementFi)][62]    | `0x8d5b9dd833e176da`    | <CopyButton text="flow dependencies install testnet://0x8d5b9dd833e176da.SwapInterfaces" title="Copy (SwapInterfaces)" />       |

## Bridges & Cross-Chain Messaging

| Bridge / Protocol             | Reference Docs    |
| ----------------------------- | ----------------- |
| PYUSD -> USDF (LayerZero OFT) | [GitHub Repo][63] |

## Omni Fungible Tokens (PYUSD → USDF)

#### Solana Devnet/Testnet

| Contract Name        | Contract Address                               |
| -------------------- | ---------------------------------------------- |
| PYUSD Program ID     | `D6RHLYN7x69Cb5Y7dFj9T9uJrJCVT9Bt1LT71xHf7QqK` |
| PYUSD Mint           | `CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM` |
| PYUSD Mint Authority | `A6v157j6XFJXwtT5VWXX7uLYTUrxcYGXB8R6rxrgr9hQ` |
| PYUSD Escrow         | `FKt7QuGTkFWHVt7RVgtEsh3rVRZMaeCdQBseyQ9Vf1PN` |
| PYUSD OFT Store      | `CFVgSccTEXbs3hN7gnCHx3FAa1L5j5StsKABTPuMaAYo` |

#### Sepolia Testnet

| Contract Name | Contract Address                             |
| ------------- | -------------------------------------------- |
| MyOFTAdapter  | `0x9D6e122780974a917952D70646dD50D2C4f906ae` |
| PYUSDLocker   | `0xb077Ef2833Fd7b426146839a86100708c37bfa65` |
| MyFungi       | `0x39dBc26413e6eEe40265E4a7ddc5abDC64849781` |

#### Arbitrum Sepolia Testnet

| Contract Name | Contract Address                             |
| ------------- | -------------------------------------------- |
| MyOFTAdapter  | `0xDD3BFfb358eF34C2964CB9ce29013D071d59094C` |
| PYUSDLocker   | `0x4e2dCCAfe86719B7BFfAc3b1041031dDd07aF5fF` |
| MyFungi       | `0x1605B1067Ce0D294786A09368f38063Df50C0e92` |

## Oracles

#### Flow EVM Testnet

| Contract                  | EVM Testnet Address                          |
| ------------------------- | -------------------------------------------- |
| [Pyth (ERC1967Proxy)][68] | `0x2880aB155794e7179c9eE2e38200202908C17B43` |

#### Flow Cadence Testnet

| Contract Name                             | Flow Cadence Testnet Address | [CLI](https://developers.flow.com/build/tools/flow-cli/dependency-manager)                                                            | Docs                    |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [PublicPriceOracle.cdc (IncrementFi)][66] | `0x8232ce4a3aff4e94`         | <CopyButton text="flow dependencies install testnet://0x8232ce4a3aff4e94.PublicPriceOracle" title="Copy install command (testnet)" /> | [Docs][incrementfi-doc] |
| [BandOracle.cdc (Band)][67]               | `0x9fb6606c300b5051`         | <CopyButton text="flow dependencies install testnet://0x9fb6606c300b5051.BandOracle" title="Copy install command (testnet)" />        | [Docs][band-oracle-doc] |

## Ethereum Attestation Service

More information can be found on the Credora docs site for [EAS on Flow](https://credora.gitbook.io/eas-for-flow).

Testnet EAS Explorer: [https://flow-testnet.easscan.credora.io](https://flow-testnet.easscan.credora.io)

| Contract Name                                           | Flow EVM Testnet Address                     |
| ------------------------------------------------------- | -------------------------------------------- |
| [SchemaRegistry.sol (Ethereum Attestation Service)][64] | `0x97900F59828Da4187607Cb8F84f49e3944199d18` |
| [EAS.sol (Ethereum Attestation Service)][65]            | `0xBCF2dA8f82fb032A2474c92Ec5b70C95A83fc0cc` |

[1]: https://faucet.flow.com/fund-account
[2]: https://evm-testnet.flowscan.io/address/0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e
[3]: https://evm-testnet.flowscan.io/address/0x51f5cc5f50afb81e8f23c926080fa38c3024b238
[4]: https://evm-testnet.flowscan.io/address/0xd431955D55a99EF69BEb96BA34718d0f9fBc91b1
[5]: https://evm-testnet.flowscan.io/address/0x4154d5B0E2931a0A1E5b733f19161aa7D2fc4b95
[6]: https://evm-testnet.flowscan.io/address/0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F
[7]: https://evm-testnet.flowscan.io/address/0xf2E5A325f7D678DA511E66B1c0Ad7D5ba4dF93D3
[8]: https://evm-testnet.flowscan.io/address/0x9B7550D337bB449b89C6f9C926C3b976b6f4095b
[9]: https://evm-testnet.flowscan.io/address/0xe132751AB5A14ac0bD3Cb40571a9248Ee7a2a9EA
[10]: https://evm-testnet.flowscan.io/address/0x8E3DC6E937B560ce6a1Aaa78AfC775228969D16c
[11]: https://evm-testnet.flowscan.io/address/0x059A77239daFa770977DD9f1E98632C3E4559848
[12]: https://evm-testnet.flowscan.io/address/0x208d09d2a6Dd176e3e95b3F0DE172A7471C5B2d6
[13]: https://evm-testnet.flowscan.io/address/0x30F44C64725727F2001E6C1eF6e6CE9c7aB91dC3
[14]: https://evm-testnet.flowscan.io/address/0x059A77239daFa770977DD9f1E98632C3E4559848?tab=read_write_contract#0x40c10f19
[15]: https://evm-testnet.flowscan.io/address/0x208d09d2a6Dd176e3e95b3F0DE172A7471C5B2d6?tab=read_write_contract#0x40c10f19
[16]: https://evm-testnet.flowscan.io/address/0x30F44C64725727F2001E6C1eF6e6CE9c7aB91dC3?tab=read_write_contract#0x40c10f19
[17]: https://testnet.flowscan.io/contract/A.7e60df042a9c0868.FlowToken?tab=deployments
[18]: https://testnet.flowscan.io/contract/A.d27920b6384e2a78.MOET?tab=deployments
[19]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_d431955d55a99ef69beb96ba34718d0f9fbc91b1?tab=deployments
[20]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_4154d5b0e2931a0a1e5b733f19161aa7d2fc4b95?tab=deployments
[21]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_d7d43ab7b365f0d0789ae83f4385fa710ffdc98f?tab=deployments
[22]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_f2e5a325f7d678da511e66b1c0ad7d5ba4df93d3?tab=deployments
[23]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_9b7550d337bb449b89c6f9c926c3b976b6f4095b?tab=deployments
[24]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_8e3dc6e937b560ce6a1aaa78afc775228969d16c?tab=deployments
[25]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_059a77239dafa770977dd9f1e98632c3e4559848?tab=deployments
[26]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_208d09d2a6dd176e3e95b3f0de172a7471c5b2d6?tab=deployments
[27]: https://testnet.flowscan.io/contract/A.dfc20aee650fcbdf.EVMVMBridgedToken_30f44c64725727f2001e6c1ef6e6ce9c7ab91dc3?tab=deployments
[28]: https://flowswap.io/swap?chain=flow-testnet&inputCurrency=NATIVE&outputCurrency=0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e
[29]: https://flowswap.io/swap?chain=flow-testnet&inputCurrency=NATIVE&outputCurrency=0x51F5cC5f50afB81e8F23C926080FA38C3024b238
[30]: https://flowswap.io/swap?chain=flow-testnet&inputCurrency=NATIVE&outputCurrency=0xd431955D55a99EF69BEb96BA34718d0f9fBc91b1
[31]: https://flowswap.io/swap?chain=flow-testnet&inputCurrency=NATIVE&outputCurrency=0x4154d5B0E2931a0A1E5b733f19161aa7D2fc4b95
[32]: https://flowswap.io/swap?chain=flow-testnet&inputCurrency=NATIVE&outputCurrency=0xd7d43ab7b365f0d0789aE83F4385fA710FfdC98F
[33]: https://testnet.flowscan.io/evm/contract/0x7d726261FB76B264fc20eA1f19D900D760136566
[34]: https://testnet.flowscan.io/evm/contract/0x524E1291c109BE27FDE48De97cAf0B3c0F02A68f
[35]: https://testnet.flowscan.io/evm/contract/0x21E3aa01561d7D869785aAedB14130C5807C5A12
[36]: https://testnet.flowscan.io/evm/contract/0x92657b195e22b69E4779BBD09Fa3CD46F0CF8e39
[37]: https://testnet.flowscan.io/evm/contract/0x8b9F96390EC35d5859937c7c5D68Ff6D5CFC312f
[38]: https://testnet.flowscan.io/evm/contract/0x2Db6468229F6fB1a77d248Dbb1c386760C257804
[39]: https://testnet.flowscan.io/evm/contract/0xA1e0E4CCACA34a738f03cFB1EAbAb16331FA3E2c
[40]: https://testnet.flowscan.io/evm/contract/0x00a101726ff770cd8ed53E8376b9440Bad40CAd9
[41]: https://testnet.flowscan.io/evm/contract/0x04400857ad69EaA7dd6fEF1C329E80E50BD30b76
[42]: https://testnet.flowscan.io/evm/contract/0x36D9bDCbA840F5bcb95EE7bD54a86808aef6581F
[43]: https://testnet.flowscan.io/evm/contract/0x6982D5Cb80Cd7E2cb7C0d0B8452841471Bc84Bc2
[44]: https://testnet.flowscan.io/evm/contract/0x61f4e983A72d9BD8429154982A3d9fCF3A1D98d0
[45]: https://testnet.flowscan.io/evm/contract/0xE0895150a7c84e8fB9fecCE72F4C80c130C80fDa
[46]: https://testnet.flowscan.io/evm/contract/0xa4Db57e3d3c6674FA02a2f3a667d3C22Fe17efF4
[47]: https://testnet.flowscan.io/evm/contract/0xB685ab04Dfef74c135A2ed4003441fF124AFF9a0
[48]: https://testnet.flowscan.io/evm/contract/0x000000000022D473030F116dDEE9F6B43aC78BA3
[49]: https://testnet.flowscan.io/evm/contract/0x02b9B840CDCEe84510a02cc85f351CAaD41f46CE
[50]: https://testnet.flowscan.io/evm/contract/0xf4011F45A666dC7eC54445a710c3aae735F7E890
[51]: https://evm-testnet.flowscan.io/address/0x0699C35C0104e478f510531F5Dfc3F9313ae49D1
[52]: https://evm-testnet.flowscan.io/address/0xeaa5949471C7B31ae97D3a52483028aE595E8e83
[53]: https://evm-testnet.flowscan.io/address/0x62aC6e05Bac04702bF744106499F72f200297121
[54]: https://evm-testnet.flowscan.io/address/0x70e8C797f698De61787A7275628713077723694
[55]: https://evm-testnet.flowscan.io/address/0xeD53235cC3E9d2d464E9c408B95948836648870B
[56]: https://evm-testnet.flowscan.io/address/0x0f6C2EF40FA42B2F0E0a9f5987b2f3F8Af3C173f
[57]: https://testnet.flowscan.io/contract/A.6ca93d49c45a249f.StableSwapFactory?tab=deployments
[58]: https://testnet.flowscan.io/contract/A.6ca93d49c45a249f.SwapFactory?tab=deployments
[59]: https://testnet.flowscan.io/contract/A.7afd587a5d5e2efe.SwapPair?tab=deployments
[60]: https://testnet.flowscan.io/contract/A.8d5b9dd833e176da.SwapConfig?tab=deployments
[61]: https://testnet.flowscan.io/contract/A.8d5b9dd833e176da.SwapError?tab=deployments
[62]: https://testnet.flowscan.io/contract/A.8d5b9dd833e176da.SwapInterfaces?tab=deployments
[63]: https://github.com/onflow/flow-bridge-app?tab=readme-ov-file#evm-testnets
[64]: https://evm-testnet.flowscan.io/address/0x97900F59828Da4187607Cb8F84f49e3944199d18?tab=contract
[65]: https://evm-testnet.flowscan.io/address/0xBCF2dA8f82fb032A2474c92Ec5b70C95A83fc0cc?tab=contract
[66]: https://flowscan.io/contract/A.ec67451f8a58216a.PublicPriceOracle
[67]: https://testnet.flowscan.io/contract/A.9fb6606c300b5051.BandOracle
[68]: https://evm-testnet.flowscan.io/address/0x2880aB155794e7179c9eE2e38200202908C17B43
[69]: https://evm-testnet.flowscan.io/address/0x72104434BEc686B47a72bCa9b998624238BD2Ffb
[70]: https://evm-testnet.flowscan.io/address/0x217aAC9594EcB6d3f6667A214CF579dd29ce78dd
[band-oracle-doc]: ./band-oracle
[incrementfi-doc]: https://docs.increment.fi/
