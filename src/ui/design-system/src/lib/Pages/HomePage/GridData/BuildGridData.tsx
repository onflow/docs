import { ColorOption } from '@site/src/constants/colors';
import { IconName } from '@site/src/types/icons';

export const buildGridData = {
  title: 'Build',
  icon: IconName.GETTING_STARTED,
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Cadence',
      subtext: 'A purpose-build smart contract language for apps that do more than move tokens.',
      cards: [
        {
          heading: 'Get an edge with new features. Forte adds standardized DeFi actions and scheduled transactions',
          description:
            'Run complex DeFi operations with standardized interfaces and automate execution onchain.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.WHY_FLOW,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/flow-actions',
        },
        {
          heading: 'Build faster with upgradable contracts and add new transactions and views after deployment',
          // Why should I pick Cadence?
          description:
            'Evolve your contracts without redeploys - upgrade logic, introduce new transactions, and query any onchain data through flexible scripts.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/cadence/reading-and-writing-onchain-data',
        },
        {
          heading: 'Build apps quickly using hooks and frontend components with the React SDK',
          description:
            'Build a modern frontend for your Flow Cadence app using React Hooks and frontend components with `@onflow/react-sdk`. Easily and conveniently access user accounts, sign transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: '/build/tools/react-sdk',
        },
      ],
    },
    {
      title: 'Solidity',
      subtext: 'EVM equivalence with seamless composability and interoperability with Cadence.',
      cards: [
              {
          heading: 'Easily deploy on an MEV-resistant network without compromises - high security, low gas, and scalability',
          description:
            'Simply add Flow to your config to deploy and run your Solidity smart contracts on Flow EVM with EVM Equivalence.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.EVM_ON_FLOW,
          variant: 'horizontal',
          href: '/build/evm/quickstart',
        },
        {
          heading: 'Get random numbers in 3 lines for free with Native VRF',
          description:
            'VRF is built into Flow at the protocol level to provide secure, verifiable randomness, for free.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.RANDOM,
          variant: 'horizontal',
          href: '../blockchain-development-tutorials/native-vrf/vrf-in-solidity',
        },
        {
          heading: 'Simplify user experience with batched transaction writes to call many functions with one signature',
          description:
            'Level up your app by integrating Cadence into your Wagmi/RainbowKit app to batch write contract calls, conditionally execute transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.BATCHED_EVM_TRANSACTIONS,
          variant: 'horizontal',
          href: '../blockchain-development-tutorials/cross-vm-apps',
        },
      ],
    },
  ],
};
