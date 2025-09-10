import { ColorOption } from '@site/src/constants/colors';
import { IconName } from '@site/src/types/icons';

export const toolsGridData = {
  title: 'Tools',
  icon: IconName.TOOLS,
  iconColor: 'green' as ColorOption,
  sections: [
    {
      title: 'Tools',
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
