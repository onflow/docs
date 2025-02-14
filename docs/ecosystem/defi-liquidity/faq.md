---
id: faq
title: Stablecoins & Bridges on Flow FAQ
description: Frequently asked questions about stablecoins, liquidity, and bridging on the Flow blockchain.
keywords:
  - stablecoins
  - bridges
  - Flow blockchain
  - USDC
  - USDT
  - USDF
  - decentralized exchanges
  - DEX
  - yield farming
  - liquidity
sidebar_position: 2
sidebar_label: Stablecoins & Bridges FAQ
---

import Details from '@theme/Details';

# DeFi & Liquidity FAQ

Below are common questions regarding stablecoins, liquidity, and bridging on Flow. Click on each question to expand and view the answer.

## Stablecoins on Flow

<Details summary="What stablecoins are available on Flow?">
USDC (USD Coin) - Issued by Circle

USDT (Tether USD) - Issued by Tether

USDF (USD Flow) - Backed by PYUSD (PayPal USD) issued by PayPal

</Details>

<Details summary="What are the smart contract addresses for the stablecoins and bridges on Flow?">
You can find all the contract addresses for the stablecoins and bridges on Flow here:  
[DeFi Contracts on Flow][0]  
</Details>

<Details summary="Where can I trade stablecoins on Flow?">
Stablecoins can be traded on major Flow-based decentralized exchanges (DEXs) like:

- KittyPunch, PunchSwap - [https://swap.kittypunch.xyz/][1]
- IncrementFi, IncrementSwap - [https://app.increment.fi/swap][2]
</Details>

<Details summary="How can I earn yield on stablecoins on Flow?">
You can earn yield through:

- Lending Platforms - Supply stablecoins on [IncrementFi][3] & [MoreMarkets][4] to earn interest.
- Liquidity Pools - Provide liquidity on [IncrementFi][5] or [KittyPunch][6] to earn trading fees and farm LP tokens.
- Yield Aggregators (Coming soon) - Use [KittyPunch][7] to automate stablecoin yield strategies.
</Details>

<Details summary="Is it safe to use stablecoins on Flow?">
Stablecoins on Flow are designed to be secure and efficient but as with any blockchain asset, there are risks to be aware of:

- Depegging - While rare, some stablecoins have lost their peg in the past due to liquidity issues or market crashes. Flow stablecoins like USDC and USDF are backed by trusted issuers to maintain stability.
- Smart Contract Risks - Bugs or exploits in DeFi platforms can lead to losses.
- Centralization Risks - USDC and USDT are controlled by centralized issuers who can freeze assets.
- Bridging Risks - Flow stablecoins (USDC, USDT, USDF) use LayerZero for bridging, a secure and widely adopted cross-chain solution. While all bridges carry some risk, LayerZero is built with advanced security measures to reduce vulnerabilities.
</Details>

<Details summary="How can I bridge stablecoins to and from Flow?">
You can bridge USDC, USDT, and USDF via [https://bridge.flow.com/][8] or [https://stargate.finance/bridge][9]

### Step-by-step example USDC to Flow

1. Go to any of the bridges (e.g. [https://stargate.finance/bridge][9])
2. Connect your wallet that holds USDC
3. Select the source chain (e.g. Ethereum, BNB Chain, Base)
4. Choose Flow as the destination chain
5. Enter the amount of USDC you want to bridge
6. Approve and confirm the transaction
7. Wait for the transfer to complete - It usually takes a few minutes
</Details>

<Details summary="What are the fees for using stablecoins on Flow?">
Flow’s transaction fees are extremely low (typically less than $0.000179 per transaction), making stablecoin transfers and trading much cheaper than on any other chain.

In many cases, Flow Wallet or Flow-based apps sponsor the gas fees, meaning users can transact stablecoins without paying any gas. This makes Flow an ideal chain for cost-efficient DeFi transactions.

</Details>

<Details summary="Can I use stablecoins for payments on Flow?">
Stablecoins can be used for payments on Flow with services like:

[Beezie][10], [Flowty][11], [Flowverse][12] and many other platforms.

</Details>

<Details summary="What are some upcoming innovations in stablecoins on Flow?">
- DeFi integrations with RWAs (Real World Assets).  
- Stay tuned on [Flow X account][13] or via the community [Flowverse][14]  
</Details>

## Stargate and LayerZero on Flow

<Details summary="What is LayerZero?">
LayerZero is an omnichain interoperability protocol that enables seamless cross-chain communication between different blockchains. It allows assets, messages, and data to move securely between chains without relying on traditional bridges.  
</Details>

<Details summary="What is Stargate?">
Stargate is a liquidity transfer protocol built on LayerZero that allows users to bridge assets across multiple blockchains with minimal slippage and deep liquidity.  
</Details>

<Details summary="How does Stargate support Flow?">
With Stargate now supporting Flow, users can bridge assets to and from Flow blockchain via [Stargate Finance][9]. This enables Flow to interact with other major chains like Ethereum, Base, Arbitrum One, and BNB Chain, unlocking global onchain liquidity for Flow-based apps and DeFi protocols.  
</Details>

<Details summary="What assets can be bridged to Flow via Stargate?">
Currently, Stargate supports bridging USDC, USDT, and ETH between Flow and other chains. Additional assets may be added in the future.  
</Details>

<Details summary="What are the fees for bridging USDC/USDT/ETH with Stargate?">
- Total fees: You pay gas fees + relayer fees, typically less than $1.5 per bridge transaction.  
- Gas fees vary depending on network congestion and gas prices.  
- Bridging from Ethereum costs around 0.0003868 ETH (~$1.04) in gas fees, plus LayerZero relayer fees of 0.00003536 ETH ($0.095).  
- Flow’s transaction fees are extremely low (typically less than $0.000179 per transaction), making stablecoin transfers and trading significantly cheaper than other chains.  
- In many cases, Flow Wallet or Flow-based apps sponsor gas fees, allowing users to bridge and transact stablecoins with zero cost on Flow.  
</Details>

<Details summary="How fast is bridging between Flow and other chains?">
- Most transactions settle within a few minutes (~3 mins).
- Congestion on the source chain can cause delays.
</Details>

<Details summary="Is bridging via Stargate safe?">
Stargate is built on LayerZero, a well-audited and widely used interoperability protocol.

- Secure & Trusted – Used by top DeFi ecosystems with rigorous security audits.
- Efficient & Cost-Effective – Fast transactions with low fees, especially on Flow.
- Reliable Bridged Assets – USDC, USDT, and ETH bridged via Stargate are fully supported in Flow’s DeFi ecosystem.

Tip: Always verify official links to ensure a safe bridging experience.

</Details>

<Details summary="What are the benefits of LayerZero on Flow?">
- Direct USDC transfers between Flow and other blockchains.
- Unlocks cross-chain DeFi use cases (e.g., lending, trading, staking).
- Low fees and high-speed transactions on Flow.
</Details>

<Details summary="Can I use Stargate to bridge NFTs or other tokens to Flow?">
Currently, Stargate only supports stablecoins like USDC and USDT, but NFT and asset bridging may be possible in the future via LayerZero-based messaging.
</Details>

<Details summary="What are some use cases for LayerZero on Flow?">
- **DeFi**: Seamless liquidity transfer between Flow and other ecosystems.
- **Gaming**: Cross-chain in-game assets & currency settlements.
- **Payments**: Fast and low-cost USDC/USDT/USDF transactions.
- **NFTs**: Future potential for cross-chain NFT bridging.
</Details>

<Details summary="What wallets support LayerZero bridging on Flow?">
You can use any EVM wallet such as Metamask, Coinbase Wallet, and Flow Wallet.
</Details>

<Details summary="What stablecoins are currently live on Flow EVM?">
You can see a full list of stablecoins here:  
[DeFi Contracts on Flow][0]

Trading pools for USDF and stgUSDC (USDC via Stargate) are already live and available for immediate use on Flow EVM and can be seamlessly transferred to any Flow Cadence address.

</Details>

<Details summary="Should Cadence applications switch to USDF or stgUSDC?">
Cadence applications can use USDC.e as the default, but they now also have the option to support USDF or stgUSDC based on their needs.

If you have questions you can join [Flow Discord][15] to get free technical support.

</Details>

## Support and Additional Resources

<Details summary="Where can I check the status of my bridge transaction?">
- Use [Stargate’s Explorer][9] to track your transfer.
- You can also check Flow transactions on [evm.flowscan.io][16]
- You can also visit [https://bridge.flow.com/][8] and connect your wallet to view activity.
</Details>

<Details summary="Where can I get support if I have issues with the bridge?">
- **Stargate Discord**: [https://discord.com/invite/9sFqx9U][17]
- **Flow Discord**: [https://discord.gg/flow][15]
</Details>

<Details summary="Where can I get updates or ask questions?">
- **Flow Twitter/X:** [https://x.com/flow_blockchain][13]
- **Flow Discord**: [https://discord.gg/flow][15]
</Details>

[0]: ./defi-contracts.md
[1]: https://swap.kittypunch.xyz/
[2]: https://app.increment.fi/swap?in=A.1654653399040a61.FlowToken&out=
[3]: https://app.increment.fi/dashboard
[4]: https://app.more.markets/
[5]: https://app.increment.fi/liquidity
[6]: https://www.kittypunch.xyz/
[7]: https://app.kittypunch.xyz/
[8]: https://bridge.flow.com/
[9]: https://stargate.finance/bridge
[10]: https://beezie.io/
[11]: https://www.flowty.io/
[12]: https://nft.flowverse.co/
[13]: https://x.com/flow_blockchain
[14]: https://x.com/flowverse_
[15]: https://discord.gg/flow
[16]: https://evm.flowscan.io
[17]: https://discord.com/invite/9sFqx9U
