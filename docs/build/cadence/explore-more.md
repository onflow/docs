---
title: Explore More
sidebar_label: Explore More
description: Discover additional tutorials, guides, and resources for building on Flow blockchain. Learn about NFTs, fungible tokens, dApp development, and core blockchain concepts.
sidebar_position: 999
keywords:
  - Flow tutorials
  - dApp development
  - NFT guide
  - fungible tokens
  - Flow CLI
  - FCL quickstart
  - web3 apps
  - Flow basics
  - blockchain tutorials
  - Emerald Academy
  - Flow guides
  - smart contracts
  - Flow development
  - learning resources
  - Flow ecosystem
---

import DocCardList from '@theme/DocCardList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMaximize, faCoins, faGem, faBook, faLandmark } from '@fortawesome/free-solid-svg-icons'

Below are some additional tutorials to help you get started with Flow:

<DocCardList items={[
{
type: 'link',
label: 'Flow App Quickstart',
href: '/build/cadence/getting-started/fcl-quickstart',
description: 'Simple walkthrough building a web3 app using the Flow Client Library (FCL)',
customProps: {
icon: <FontAwesomeIcon icon={faWindowMaximize} className="h-16" />,
author: {
name: 'Flow Blockchain',
profileImage:
'https://avatars.githubusercontent.com/u/62387156?s=200&v=4',
},
},
},
{
type: 'link',
label: 'Fungible Token Guide',
href: '/build/cadence/guides/fungible-token',
description: 'Steps to create, deploy, mint, and transfer fungible tokens on Flow',
customProps: {
icon: <FontAwesomeIcon icon={faCoins} className="h-16" />,
author: {
name: 'Flow Blockchain',
profileImage:
'https://avatars.githubusercontent.com/u/62387156?s=200&v=4',
},
},
},
{
type: 'link',
label: 'NFT Guide',
href: 'https://academy.ecdao.org/en/quickstarts/1-non-fungible-token-next',
description: 'A DApp that lets users create an empty collection, mint some pre-loaded NFTs, and transfer them to another account on Flow testnet.',
customProps: {
icon: <FontAwesomeIcon icon={faGem} className="h-16" />,
author: {
name: 'Emerald City DAO',
profileImage:
'https://pbs.twimg.com/profile_images/1687225095557632005/tUCmv8_P_400x400.jpg',
},
},
},
{
type: 'link',
label: 'Walkthrough Guides',
href: '/build/cadence/getting-started/fcl-quickstart',
description: 'Longer form guides to help you get started with Flow',
customProps: {
icon: <FontAwesomeIcon icon={faBook} className="h-16" />,
author: {
name: 'Flow Blockchain',
profileImage:
'https://avatars.githubusercontent.com/u/62387156?s=200&v=4',
},
},
},
{
type: 'link',
label: 'Emerald Academy',
href: 'https://academy.ecdao.org/en/quickstarts',
description: 'Quickstart Tutorials for Flow created by Emerald City Dao',
customProps: {
icon: '/images/logos/ea-logo.png',
author: {
name: 'Emerald City DAO',
profileImage:
'https://pbs.twimg.com/profile_images/1687225095557632005/tUCmv8_P_400x400.jpg',
},
},
},
{
type: 'link',
label: 'Basic Concepts',
href: '/build/cadence/basics/blocks',
description: 'Basic Concepts of Flow Blockchain',
customProps: {
icon: <FontAwesomeIcon icon={faLandmark} className="h-16" />,
author: {
name: 'Flow Blockchain',
profileImage:
'https://avatars.githubusercontent.com/u/62387156?s=200&v=4',
},
},
}
]} />
