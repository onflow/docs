import { ColorOption } from '@site/src/constants/colors';
import { IconName } from '@site/src/types/icons';

export const buildGridData = {
  title: 'Build',
  icon: IconName.GETTING_STARTED,
  iconColor: 'green' as ColorOption,
  sections: [
    {
      cards: [
        {
          heading: 'Create revolutionary consumer DeFi experiences',
          description:
            'Build consumer DeFi apps using DEXs, lending platforms, stablecoin protocols, and liquidity solutions with ultra-low fees, fast finality, and capital-efficient execution, all without congestion or complex scaling layers.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.BUILDER_CREDITS,
          variant: 'horizontal',
          href: '/defi',
        },
        {
          heading: 'Create apps that evolve without a proxy contract',
          // Why should I pick Cadence?
          description:
            'Query state without indexers, write transactions as powerful as full contracts, and upgrade safely onchain so your app can continue to evolve after you launch it.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CADENCE,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/cadence/cadence-advantages',
        },
        {
          heading: 'Build faster with React components and hooks',
          description:
            'Build a modern frontend for your Flow Cadence app using React hooks and components with `@onflow/react-sdk`. Easily access user accounts, sign transactions, and more.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CLIENT_LIBRARY,
          variant: 'horizontal',
          href: '/build/tools/react-sdk',
        },
        {
          heading: 'Deploy Solidity apps on Flow without code changes',
          description:
            'Run your Solidity contracts unchanged on Flow EVM with lower fees, higher throughput, and MEV-resistance out of the box.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.EVM_ON_FLOW,
          variant: 'horizontal',
          href: '/build/evm/quickstart',
        },
      ],
    },
  ],
};
