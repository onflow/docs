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
          heading: 'Build Composable DeFi Workflows and Onchain Automation',
          // Advanced builders building advanced DeFi more easily
          description:
            'Run complex DeFi operations through standardized interfaces and allow autonomous smart contract execution at specified times.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.WHY_FLOW,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/flow-actions',
        },
        {
          heading: 'Do More With Complex Transactions and Native Data Availability',
          // Why should I pick Cadence?
          description:
            'Execute multiple function calls atomically and use scripts to access any public data filtered and formatted as needed.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/cadence/reading-and-writing-onchain-data',
          target: '_blank',
        },
        {
          heading: 'Build Advanced Apps with Upgradable Smart Contracts, Account Linking, and Native VRF and Gas Sponsorship',
          // I know cadence and I want to do more
          description:
            'Support for upgrades with compatibility checks, account linking for flexible custody models, native VRF for instant randomness, gasless transactions for your users.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/cadence',
          target: '_blank',
        },
        // {
        //   heading: 'Upgrading Smart Contracts',
        //   description:
        //     'Cadence is a resource-oriented programming language that makes it easy to build secure, scalable, and composable applications.',
        //   iconColor: 'green',
        //   cardColor: 'black',
        //   icon: IconName.FLOW_CADENCE,
        //   variant: 'horizontal',
        //   href: 'https://cadence-lang.org',
        //   target: '_blank',
        // },
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
          href: '/build/evm/quickstart',
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
        // {
        //   heading: 'Onboard Users with Gasless Transactions',
        //   description:
        //     'Level up your app by integrating Cadence into your Wagmi/RainbowKit app to batch write contract calls, conditionally execute transactions, and more.',
        //   iconColor: 'green',
        //   cardColor: 'black',
        //   icon: IconName.BATCHED_EVM_TRANSACTIONS,
        //   variant: 'horizontal',
        //   href: '../blockchain-development-tutorials/cross-vm-apps',
        //   target: '_blank',
        // },
        {
          heading: 'Simplify User Experience with Batched Transactions',
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
  ],
};
