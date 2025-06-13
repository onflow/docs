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
          heading: 'Why Flow?',
          description:
            'Learn why Dieter Shirley, co-author of the ERC-721 NFT standard, led the development of a new L1.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          href: 'build/flow',
        },
        {
          heading: 'EVM Quickstart',
          description:
            'Deploy your Solidity contracts on Flow to get sub-cent transaction fees, sponsored gas, and the ability to scale to millions of users.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'evm-on-flow',
          variant: 'horizontal',
          href: 'evm/quickstart',
        },
        {
          heading: 'Build with AI',
          description:
            'Feel the vibes, or add new tools to your workflow by configuring Cursor to use the Flow and Cadence knowledge base.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'hello-world',
          variant: 'horizontal',
          href: 'tutorials/ai-plus-flow',
        },
      ],
    },
    {
      title: 'Learn Cadence',
      cards: [
        {
          heading: 'App Quickstart',
          description:
            'Build and deploy your first contract, connect to it from the frontend, and call your smart contract functions - all in less than 30 minutes.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'hello-world',
          variant: 'horizontal',
          href: 'build/getting-started/contract-interaction',
        },
        {
          heading: 'Cadence 101',
          description:
            'Cadence is a resource-oriented programming language that makes it easy to build secure, scalable, and composable applications.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          href: 'https://cadence-lang.org',
          target: '_blank',
        },
        {
          heading: 'Launch a Token',
          description:
            "Learn how to launch a fungible token that's stored in your users' vaults directly in their accounts.",
          iconColor: 'green',
          cardColor: 'black',
          icon: 'launch-a-token',
          variant: 'horizontal',
          href: 'build/guides/fungible-token',
        },
        {
          heading: 'Create an NFT Collection',
          description:
            "Create NFT collections that are stored directly in your users' accounts in a way that makes it nearly impossible to lose them.",
          iconColor: 'green',
          cardColor: 'black',
          icon: 'create-an-nft',
          variant: 'horizontal',
          href: 'build/guides/nft',
        },
        {
          heading: 'Build your App',
          description:
            'Build a modern frontend for your Flow Cadence app using React Hooks with `@onflow/kit`.  Easily and conveniently access user accounts, sign transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-client-library',
          variant: 'horizontal',
          href: 'tools/kit',
        },
      ],
    },
    {
      title: 'Supercharge Your App',
      cards: [
        {
          heading: 'Access Incredible IP',
          description:
            "Flow allows you to link wallets together, enabling your apps to use NFTs in a user's embedded wallet from another app.",
          iconColor: 'green',
          cardColor: 'black',
          icon: 'access-incredible-ip',
          variant: 'horizontal',
          href: 'build/guides/account-linking-with-dapper',
        },
        {
          heading: 'VRF - Cadence',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free. Learn how to use VRF in Cadence.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'vrf---cadence',
          variant: 'horizontal',
          href: 'build/advanced-concepts/randomness',
        },
        {
          heading: 'VRF - EVM',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free. Learn how to use VRF in EVM.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'vrf---evm',
          variant: 'horizontal',
          href: 'evm/guides/vrf',
        },
        {
          heading: 'Account Abstraction',
          description:
            'Learn how to create child accounts that are linked to a parent account, enabling walletless onboarding and much more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'account-abstraction',
          variant: 'horizontal',
          href: 'build/guides/account-linking/child-accounts',
        },
        {
          heading: 'Cadence + EVM Scaffold',
          description:
            'A scaffold for seamlessly integrating Cadence into your Wagmi/RainbowKit app to batch write contract calls, conditionally execute transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'batched-evm-transactions',
          variant: 'horizontal',
          href: 'https://github.com/jribbink/cross-vm-app',
          target: '_blank',
        },
        {
          heading: 'Token Interoperability',
          description:
            'Move established EVM tokens to Cadence for more powerful contracts, or move Cadence tokens to EVM to take advantage of established markets.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'cross-vm-bridge',
          variant: 'horizontal',
          href: 'evm/cadence/vm-bridge',
        },
      ],
    },
    {
      title: 'Tools',
      cards: [
        {
          heading: 'Dependency Manager',
          description:
            'Effortlessly import Flow Cadence contracts into your projects, including core contracts, ecosystem contracts, and your own published contracts.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          href: 'tools/flow-cli/dependency-manager',
        },
        {
          heading: 'Cadence Block Explorer',
          description:
            'Search for users, transactions, and contracts on the Flow Cadence blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          href: 'https://www.flowscan.io/',
        },
        {
          heading: 'EVM Block Explorer',
          description:
            'Search for users, transactions, and contracts on the Flow EVM blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'evm-on-flow',
          variant: 'horizontal',
          href: 'https://evm.flowscan.io/',
        },
        {
          heading: 'Flow Runner',
          description:
            'Run Flow Cadence scripts and transactions in the browser with Flow Runner.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'hello-world',
          variant: 'horizontal',
          href: 'https://run.dnz.dev/',
        },
      ],
    },
  ],
};
