---
title: Getting Started with Cadence
description: Learn the fundamentals of Flow blockchain development with Cadence
sidebar_position: 1
keywords:
  - Flow development
  - Cadence programming
  - Smart contracts
  - Flow CLI
  - Flow emulator
  - Blockchain development
  - Counter contract
  - Testnet deployment
  - Mainnet deployment
  - Frontend development
  - Flow SDK
  - Production deployment
---

# Getting Started with Cadence

The Cadence is designed for the next generation of apps, games, and digital assets. This comprehensive tutorial series will guide you from setting up your development environment to deploying production-ready applications on Flow's mainnet while a complete Counter application that demonstrates all essential Flow development patterns.

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
  <iframe 
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    src="https://www.youtube.com/embed/Bagn8kGllCU?si=5FUZit9bSrBCVGPk" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
  ></iframe>
</div>

## What You'll Learn

In this tutorial series, you'll discover how to:

- Set up a complete Flow development environment with CLI tools and local emulator.
- Build and deploy smart contracts with Cadence.
- Integrate external dependencies and work with Flow's composable ecosystem.
- Create transactions and implement comprehensive testing strategies.
- Build interactive frontend applications with @onflow/react-sdk.
- Deploy applications to testnet and mainnet with production best practices.
- Implement monitoring, security, and maintenance for live blockchain applications.

## What You'll Build

Throughout these tutorials, you'll build a complete **Counter Application** that demonstrates the core aspects of Flow development:

- **Smart Contracts**: Counter contract with increment/decrement functionality.
- **External Dependencies**: Integration with NumberFormatter for enhanced display.
- **Frontend Interface**: React-based web application with wallet authentication.
- **Production Deployment**: Live application accessible on Flow's public networks.

By the end, you'll have a fully functional blockchain application and the skills to build your own Flow projects.

## Environment Setup

Learn how to set up your Flow development environment and deploy your first smart contract. This foundational tutorial covers CLI installation, project creation, contract deployment, and basic blockchain interaction patterns using the local Flow emulator.

Tutorial: [Cadence Environment Setup]

## Smart Contract Interaction

Gain advanced Flow development skills including dependency management, sophisticated transaction patterns, and comprehensive testing strategies. Learn to integrate external contracts, handle complex state changes, and implement test-driven development workflows.

Tutorial: [Smart Contract Interaction]

## Building a Frontend App

Create a `Next.js` frontend application that interacts with your Flow smart contracts using `@onflow/react-sdk`. Implement wallet authentication, real-time data queries, transaction submission, and status monitoring for a complete user experience.

Tutorial: [Building a Frontend App]

## Production Deployment

To take your application live, deploy to Flow's testnet and mainnet networks. Learn security best practices, production configuration, monitoring strategies, and maintenance practices you can use to manage live blockchain applications.

Tutorial: [Production Deployment]

## Next Steps

After you complete these tutorials, you'll have the fundamental skills needed for Flow development. Consider exploring our other tutorial series to expand your blockchain development expertise:

- [Cross-VM Apps] - Build applications that integrate Flow EVM and Cadence
- [Native VRF] - Implement verifiable random functions in your applications
- [Token Launch] - Create and launch tokens on Flow

<!-- Relative links -->

[Cadence Environment Setup]: ./cadence-environment-setup.md
[Smart Contract Interaction]: ./smart-contract-interaction.md
[Building a Frontend App]: ./building-a-frontend-app.md
[Production Deployment]: ./production-deployment.md
[Cross-VM Apps]: ../../cross-vm-apps/introduction.md
[Native VRF]: ../../native-vrf/index.md
[Token Launch]: ../../tokens/index.md
