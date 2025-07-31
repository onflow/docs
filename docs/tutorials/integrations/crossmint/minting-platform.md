---
sidebar_position: 5
title: Minting Platform Integration
description: Create and distribute tokens at scale on Flow using Crossmint's no-code and API-based minting platform.
keywords:
  - minting
  - tokens
  - nft
  - flow
  - crossmint
  - smart contracts
  - airdrop
---

# Minting Platform Integration Guide

Deploy secure smart contracts and mint tokens at scale on Flow using Crossmint's comprehensive minting platform.

## Overview

Crossmint's minting platform provides no-code tools and powerful APIs to create, mint, update, burn, and airdrop tokens on Flow.

> **Key Benefits:**
> - Deploy secure smart contracts without coding
> - Mint, update, burn, and airdrop tokens at scale
> - Manage metadata and collections
> - Flow EVM and Cadence support

---

## Prerequisites

- Crossmint account with minting enabled
- Flow development environment
- Basic understanding of NFT standards

## Step 1: Deploy Smart Contract

### No-Code Contract Deployment

1. Go to Crossmint Console > **Collections**
2. Click **Create Collection**
3. Choose **Flow** blockchain and configure:
   - Contract type: ERC-721 or Cadence NFT
   - Collection metadata
   - Royalty settings
   - Access controls

### API Contract Deployment

```typescript
// Deploy contract via API
const contract = await crossmint.contracts.deploy({
  blockchain: "flow",
  type: "erc-721",
  name: "My Flow Collection",
  symbol: "MFC",
  metadata: {
    description: "Amazing NFTs on Flow",
    image: "https://example.com/collection.png"
  },
  royalty: {
    recipient: "0x...",
    percentage: 250 // 2.5%
  }
});
```

## Step 2: Mint NFTs

### Single NFT Minting

```typescript
const nft = await crossmint.nfts.mint({
  collectionId: "your-collection-id",
  recipient: "user-wallet-address",
  metadata: {
    name: "Amazing Flow NFT",
    description: "Unique digital art",
    image: "https://example.com/nft.png",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Network", value: "Flow" }
    ]
  }
});
```

### Batch Minting

```typescript
const batchMint = await crossmint.nfts.batchMint({
  collectionId: "your-collection-id",
  recipients: [
    { address: "0x...", metadata: { name: "NFT #1" } },
    { address: "0x...", metadata: { name: "NFT #2" } }
  ]
});
```


## Step 3: Airdrops

```typescript
const airdrop = await crossmint.airdrops.create({
  collectionId: "your-collection-id",
  recipients: ["0x...", "0x...", "0x..."],
  metadata: {
    name: "Flow Airdrop NFT",
    description: "Special airdrop for community"
  }
});
```
