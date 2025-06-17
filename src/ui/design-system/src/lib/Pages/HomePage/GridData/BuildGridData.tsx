import { ColorOption } from '@site/src/constants/colors';

export const buildGridData = {
  title: 'Build',
  icon: 'getting-started',
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Cadence',
      subtext: 'Resource-oriented smart contracts, making complex smart contracts easy.',
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
          heading: 'Learn Cadence',
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
          heading: 'Build with NBA Top Shots',
          description:
            "Flow allows you to link wallets together, enabling your apps to use NFTs in a user's embedded wallet from another app.",
          iconColor: 'green',
          cardColor: 'black',
          icon: 'access-incredible-ip',
          variant: 'horizontal',
          href: 'build/guides/account-linking-with-dapper',
        },
      ],
    },
    {
      title: 'Solidity',
      subtext: 'Seamless composability and interoperability with EVM equivalence',
      cards: [
        {
          heading: 'Easily add free VRF',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'hello-world',
          variant: 'horizontal',
          href: 'tutorials-native-vrf',
        },
        {
          heading: 'Supercharge your app',
          description:
            'Level up your app by integrating Cadence into your Wagmi/RainbowKit app to batch write contract calls, conditionally execute transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'batched-evm-transactions',
          variant: 'horizontal',
          href: 'tutorials/cross-vm-apps',
          target: '_blank',
        }
      ],
    },
    {
      title: 'Tools',
      subtext: 'Best in class tools powering best in class applications builders.',
      cards: [
        {
          heading: 'Build your app',
          description:
            'Build a modern frontend for your Flow Cadence app using React Hooks with `@onflow/kit`.  Easily and conveniently access user accounts, sign transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-client-library',
          variant: 'horizontal',
          href: 'tools/kit',
        },
        {
          heading: 'Import deployed contracts',
          description:
            'Effortlessly import Flow Cadence contracts into your projects, including core contracts, ecosystem contracts, and your own published contracts.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          href: 'tools/flow-cli/dependency-manager',
        },
        {
          heading: 'Explore the Cadence blockchain',
          description:
            'Search for users, transactions, and contracts on the Flow Cadence blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'flow-cadence',
          variant: 'horizontal',
          href: 'https://www.flowscan.io/',
        },
        {
          heading: 'Explore the EVM blockchain',
          description:
            'Search for users, transactions, and contracts on the Flow EVM blockchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: 'evm-on-flow',
          variant: 'horizontal',
          href: 'https://evm.flowscan.io/',
        },
        {
          heading: 'Run scripts and transactions',
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
