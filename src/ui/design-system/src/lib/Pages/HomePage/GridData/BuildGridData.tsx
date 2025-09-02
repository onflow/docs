import { ColorOption } from '@site/src/constants/colors';
import { IconName } from '@site/src/types/icons';

export const buildGridData = {
  title: 'Build',
  icon: IconName.GETTING_STARTED,
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Cadence',
      subtext: 'A purpose-build smart contract language for apps that do more than token movement.',
      cards: [
        {
          heading: 'Why Flow?',
          description:
            'Learn why Dieter Shirley, co-author of the ERC-721 NFT standard, led the development of a new L1.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.WHY_FLOW,
          variant: 'horizontal',
          href: '/build/flow',
        },
        {
          heading: 'Query state and run transactions',
          description:
            'Run Flow Cadence scripts and transactions in the browser with Flow Runner.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.HELLO_WORLD,
          variant: 'horizontal',
          href: 'https://run.dnz.dev/',
        },
        {
          heading: 'Build quickly & securely with Cadence',
          description:
            'Cadence is a resource-oriented programming language that makes it easy to build secure, scalable, and composable applications.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: 'https://cadence-lang.org',
          target: '_blank',
        },
      ],
    },
    {
      title: 'Solidity',
      subtext: 'EVM equivalence with seamless composability and interoperability with Cadence.',
      cards: [
              {
          heading: 'Simply run with EVM equivalence',
          description:
            'Easily deploy and run your Solidity smart contracts on Flow EVM with EVM Equivalence.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.EVM_ON_FLOW,
          variant: 'horizontal',
          href: '/build/evm/about',
        },
        {
          heading: 'Integrate native VRF in 3 lines',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.RANDOM,
          variant: 'horizontal',
          href: '../blockchain-development-tutorials/native-vrf/vrf-in-solidity',
        },
        {
          heading: 'Native batched transactions',
          description:
            'Level up your app by integrating Cadence into your Wagmi/RainbowKit app to batch write contract calls, conditionally execute transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.BATCHED_EVM_TRANSACTIONS,
          variant: 'horizontal',
          href: '../blockchain-development-tutorials/cross-vm-apps',
          target: '_blank',
        },
      ],
    },
    {
      title: 'Tools',
      subtext: 'Best in class tools powering best in class applications builders.',
      cards: [
        {
          heading: 'Build apps fast',
          description:
            'Build a modern frontend for your Flow Cadence app using React Hooks with `@onflow/react-sdk`.  Easily and conveniently access user accounts, sign transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CLIENT_LIBRARY,
          variant: 'horizontal',
                      href: '/tools/react-sdk',
        },
        {
          heading: 'Import and compose with contracts',
          description:
            'Effortlessly import Flow Cadence contracts into your projects, including core contracts, ecosystem contracts, and your own published contracts.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.TOOLS,
          variant: 'horizontal',
          href: '/tools/flow-cli/dependency-manager',
        },
        {
          heading: 'Get 100k testnet $FLOW',
          description:
            'Other chains drip testnet tokens, Flow gives you 100k $FLOW to play with.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FAUCET,
          variant: 'horizontal',
          href: 'https://faucet.flow.com/fund-account',
        },
      ],
    },
  ],
};
