import { ColorOption } from '@site/src/constants/colors';

export const buildGridData = {
  title: 'Build',
  icon: 'Getting Started',
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Getting Started',
      cards: [
        {
          heading: 'Why Flow?',
          description:
            'Learn what led Dieter Shirley, Chief Architect of Flow and co-author of the ERC-721 NFT standard to lead the development of a new L1 blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Why Flow',
          onClick: () => {
            window.location.href = 'build/flow';
          }
        },
        {
          heading: 'A Better Language',
          description:
            'Cadence is a resource-oriented programming language that makes it easy to build secure, scalable, and composable applications.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Flow Cadence',
          onClick: () => {
            window.open('https://cadence-lang.org', '_blank');
          }
        },
        {
          heading: 'EVM on Flow',
          description:
            'The future is here.  Deploy your Solidity contracts on Flow to get sub-cent transaction fees, sponsored gas, and the ability to scale to millions of users.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'EVM on Flow',
          onClick: () => {
            window.location.href = 'evm/about';
          }
        },
        {
          heading: 'Hello World',
          description:
            'Build and deploy your first contract, connect to it from the frontend, and call your smart contract functions - all in less than 30 minutes.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Hello World',
          onClick: () => {
            window.location.href = 'build/getting-started/contract-interaction';
          }
        },
        {
          heading: 'Launch a Token',
          description:
            'Learn how to launch a fungible token that\'s stored in your users\' vaults directly in their accounts.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Launch a Token',
          onClick: () => {
            window.location.href = 'build/guides/fungible-token';
          }
        },
        {
          heading: 'Create an NFT Collection',
          description:
            'Create NFT collections that are stored directly in your users\' accounts in a way that makes it nearly impossible to lose them.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Create an NFT',
          onClick: () => {
            window.location.href = 'build/guides/nft';
          }
        },
        // {
        //   heading: 'Chat with Other Devs',
        //   description:
        //     'Head over to Developer Chat on Discord to share what you\'re working on, get help, and chat with other developers.',
        //   iconColor: 'green',
        //   cardColor: 'black',
        //   onClick: () => {
        //     window.location.href = 'https://discord.com/channels/613813861610684416/1162086721471647874';
        //   }
        // },
      ],
    },
    {
      title: 'Supercharge Your App',
      cards: [
        {
          heading: 'Access Incredible IP',
          description:
            'Flow allows you to link wallets together, enabling your apps to use NFTs in a user\'s embedded wallet from another app.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Access Incredible IP',
          onClick: () => {
            window.location.href = 'build/guides/account-linking-with-dapper';
          }
        },
        {
          heading: 'VRF - Cadence',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free. Learn how to use VRF in Cadence.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'VRF - Cadence',
          onClick: () => {
            window.location.href = 'build/advanced-concepts/randomness';
          }
        },
        {
          heading: 'VRF - EVM',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free. Learn how to use VRF in EVM.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'VRF - EVM',
          onClick: () => {
            window.location.href = 'evm/guides/vrf';
          }
        },
        {
          heading: 'Account Abstraction',
          description:
            'Learn how to create child accounts that are linked to a parent account, enabling walletless onboarding and much more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Account Abstraction',
          onClick: () => {
            window.location.href = 'build/guides/account-linking/child-accounts';
          }
        },
        {
          heading: 'Batched EVM Transactions',
          description:
            'With Cadence + EVM, you can script EVM transactions to execute with one wallet signature, and even script conditional execution.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Batched EVM Transactions',
          onClick: () => {
            window.location.href = 'evm/cadence/batched-evm-transactions';
          }
        },
        {
          heading: 'Token Interoperability',
          description:
            'Move established EVM tokens to Cadence for more powerful contracts, or move Cadence tokens to EVM to take advantage of established markets.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Cross-VM Bridge',
          onClick: () => {
            window.location.href = 'evm/cadence/vm-bridge';
          }
        },
      ],
    },
    {
      title: 'Tools',
      cards: [
        {
          heading: 'Flow CLI',
          description:
            'The Flow Command Line Interface (CLI) is a powerful tool that enables developers to seamlessly interact with the Flow blockchain across various environments.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Flow CLI',
          onClick: () => {
            window.location.href = 'tools/flow-cli';
          }
        },
        {
          heading: 'Flow Emulator',
          description:
            'The Flow Emulator is a local blockchain environment that allows developers to test and develop their applications without the need to deploy to the mainnet or testnet.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Flow Emulator',
          onClick: () => {
            window.location.href = 'tools/emulator';
          }
        },
        {
          heading: 'Flow Client Library (FCL)',
          description:
            'The Flow Client Library (FCL) JS is a package used to interact with user wallets and the Flow blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Flow Client Library',
          onClick: () => {
            window.location.href = 'tools/clients/fcl-js';
          }
        },
        {
          heading: 'EVM Tools and Libraries',
          description:
            'Most of your favorite EVM tools and libraries are compatible with Flow.  Learn how to work with Hardhat, Foundry, Wagmi, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'EVM Tools',
          onClick: () => {
            window.location.href = 'evm/guides/wagmi';
          }
        },
        {
          heading: 'Other Clients',
          description:
            'Additional clients are available for interacting with the Flow blockchain using a number of popular languages, including Go, Python, Ruby, and JavaScript.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'Other Clients',
          onClick: () => {
            window.location.href = 'tools/clients';
          }
        }
      ],
    },
  ],
};