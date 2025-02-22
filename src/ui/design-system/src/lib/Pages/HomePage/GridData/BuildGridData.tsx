import { ColorOption } from '@site/src/constants/colors';

export const buildGridData = {
  title: 'Build',
  icon: 'getting-started',
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Getting Started',
      cards: [
         {
          heading: 'Cadence',
          description:
            'Learn why Dieter Shirley, co-author of the ERC-721 NFT standard, led the development of a new L1.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          onClick: () => {
            window.location.href = 'build/flow';
          }
        },
        {
          heading: 'EVM',
          description:
            'Deploy your Solidity contracts on Flow to get sub-cent transaction fees, sponsored gas, and the ability to scale to millions of users.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'evm-on-flow',
          variant: 'horizontal',
          onClick: () => {
            window.location.href = 'evm/about';
          }
        },
      ],
    },
    {
      title: 'Learn Cadence',
      cards: [
        {
          heading: 'Hello World',
          description:
            'Build and deploy your first contract, connect to it from the frontend, and call your smart contract functions - all in less than 30 minutes.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'hello-world',
          variant: 'horizontal',
          onClick: () => {
            window.location.href = 'build/getting-started/contract-interaction';
          }
        },
        {
          heading: 'Cadence 101',
          description:
            'Cadence is a resource-oriented programming language that makes it easy to build secure, scalable, and composable applications.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          onClick: () => {
            window.open('https://cadence-lang.org', '_blank');
          }
        },
        {
          heading: 'Launch a Token',
          description:
            'Learn how to launch a fungible token that\'s stored in your users\' vaults directly in their accounts.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'launch-a-token',
          variant: 'horizontal',
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
          icon: 'create-an-nft',
          variant: 'horizontal',
          onClick: () => {
            window.location.href = 'build/guides/nft';
          }
        },
        {
          heading: 'Build your App',
          description:
            'The Flow Client Library (FCL) JS is a package used to interact with user wallets and the Flow blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-client-library',
          variant: 'horizontal',
          onClick: () => {
            window.location.href = 'tools/clients/fcl-js';
          }
        },
      ]
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
          icon: 'access-incredible-ip',
          variant: 'horizontal',
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
          icon: 'vrf---cadence',
          variant: 'horizontal',
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
          icon: 'vrf---evm',
          variant: 'horizontal',
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
          icon: 'account-abstraction',
          variant: 'horizontal',
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
          icon: 'batched-evm-transactions',
          variant: 'horizontal',
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
          icon: 'cross-vm-bridge',
          variant: 'horizontal',
          onClick: () => {
            window.location.href = 'evm/cadence/vm-bridge';
          }
        },
      ],
    },
  ],
};