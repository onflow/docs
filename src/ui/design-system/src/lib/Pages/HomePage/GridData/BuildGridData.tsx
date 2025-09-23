import { ColorOption } from '@site/src/constants/colors';
import { IconName } from '@site/src/types/icons';

export const buildGridData = {
  title: 'Build',
  icon: IconName.GETTING_STARTED,
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Cadence',
      subtext: 'Building something new? Start with Cadence — built for apps, automation, and secure upgrades from day one.',
      cards: [
        {
          heading: 'Automate DeFi with actions and scheduled transactions',
          description:
            'Automate compounding, restaking, and governance directly onchain with protocol-agnostic Actions and Scheduled Transactions that make DeFi apps run themselves.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.WHY_FLOW,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/flow-actions',
        },
        {
          heading: 'Create apps that evolve without a proxy contract',
          // Why should I pick Cadence?
          description:
            'Query state without indexers, write transactions as powerful as full contracts, and upgrade safely onchain — so your app can keep evolving after launch.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/cadence/reading-and-writing-onchain-data',
        },
        {
          heading: 'Build faster with react components and hooks',
          description:
            'Build a modern frontend for your Flow Cadence app using React hooks and components with `@onflow/react-sdk`. Easily access user accounts, sign transactions, and more.',
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
      subtext: 'Already writing Solidity? Bring it over unchanged — then level it up with Flow\'s MEV-resistance, VRF, and cross-VM composability.',
      cards: [
              {
          heading: 'Deploy Solidity apps on Flow without code changes',
          description:
            'Run your Solidity contracts unchanged on Flow EVM — with lower fees, higher throughput, and MEV-resistance out of the box.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.EVM_ON_FLOW,
          variant: 'horizontal',
          href: '/build/evm/quickstart',
        },
        {
          heading: 'Add secure randomness with native VRF in 3 lines',
          description:
            'Generate verifiable randomness in three lines for loot boxes, fair drops, and battle mechanics, powered natively by Flow.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.RANDOM,
          variant: 'horizontal',
          href: '../blockchain-development-tutorials/native-vrf/vrf-in-solidity',
        },
        {
          heading: 'Simplify user experience with batched transactions',
          description:
            'Batch multiple writes and cross-VM calls into one approval, so users sign once while your app does the rest.',
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
