---
title: Using Wagmi
description: "Using Wagmi to interact with Solidity contract to EVM on Flow."
sidebar_label: Using Wagmi
sidebar_position: 1
---

:::info
Make sure to use viem version 2.9.6 or greater. This version contains flow EVM networks
:::

# Using Next.js and wagmi

This tutorial will guide you through creating a simple web application, connect to an EVM capable wallet and interact with the "HelloWorld" smart contract to get and set greetings.

## Prerequisites

- Node.js installed on your machine
- A code editor (e.g., Visual Studio Code)
- Basic knowledge of React and Next.js

## Step 1: Setting Up the Next.js Project

This tutorial will be following [wagmi getting-started tutorial](https://wagmi.sh/react/getting-started)
First, let's create a new Next.js application. project name `flow-evm-wagmi`. Select `next` for the type of web framework.

```bash
npm create wagmi@latest
```
 
 After wagmi automatic installation procedure. 

 ```bash
  cd flow-evm-wagmi
  npm install
  npm run dev
  ```

## Step 2: Configuring wagmi and Connecting the Wallet

This step relies on an already deployed HelloWorld contract. See [Using Remix](./deploy-contract/using-remix.md) to deploy a smart contract on flow evm blockchain.
Create or edit the _app.js file in the pages directory to set up wagmi and the Ethereum provider:

```javascript
import '../styles/globals.css'
import { WagmiConfig, createClient } from 'wagmi'
import { CoinbaseWalletConnector, MetaMaskConnector, WalletConnectConnector } from 'wagmi/connectors'
import { publicProvider } from 'wagmi/providers/public'

const ChainId = 646
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains: [{ id: ChainId, name: 'Ethereum', network: 'mainnet' }] }),
    new CoinbaseWalletConnector({ chains: [{ id: ChainId, name: 'Ethereum', network: 'mainnet' }] }),
    new WalletConnectConnector({ chains: [{ id: ChainId, name: 'Ethereum', network: 'mainnet' }] }),
  ],
  provider: publicProvider(),
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}

export default MyApp
```

This code configures wagmi to use MetaMask, Coinbase Wallet, and WalletConnect as wallet providers.

## Step 3: Creating the Interface for HelloWorld Contract
Now, let's create a component to interact with the HelloWorld contract. Assume your contract is already deployed, and you have its address and ABI.

- Create a new file, HelloWorld.ts, in the components directory.
- Use wagmi's hooks to read from and write to the smart contract:

```javascript
import { useState } from 'react'
import { useContractRead, useContractWrite, useAccount, useConnect } from 'wagmi'
import contractABI from '../contract/HelloWorldABI.json' // Import your contract's ABI

const contractAddress = 'YOUR_CONTRACT_ADDRESS'

const HelloWorld = () => {
  const [newGreeting, setNewGreeting] = useState('')
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  
  const { data: greeting } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    functionName: 'hello',
  })

  const { write: changeGreeting } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    functionName: 'changeGreeting',
    args: [newGreeting],
  })

  if (!isConnected) {
    return <button onClick={() => connect()}>Connect Wallet</button>
  }

  return (
    <div>
      <p>Current Greeting: {greeting}</p>
      <input
        value={newGreeting}
        onChange={(e) => setNewGreeting(e.target.value)}
        placeholder="New greeting"
      />
      <button onClick={() => changeGreeting()}>Update Greeting</button>
    </div>
  )
}

export default HelloWorld
```

Replace YOUR_CONTRACT_ADDRESS with the actual address of your deployed HelloWorld contract.

## Step 4: Integrating the HelloWorld Component
Finally, import and use the HelloWorld component in your pages/index.js:


```javascript
import HelloWorld from '../components/HelloWorld'

export default function Home() {
  return (
    <div>
      <HelloWorld />
    </div>
  )
}

```

Now, you have a functional dApp that can connect to an Ethereum wallet, display the current greeting from the "HelloWorld" smart contract, and allow the user to update the greeting.



