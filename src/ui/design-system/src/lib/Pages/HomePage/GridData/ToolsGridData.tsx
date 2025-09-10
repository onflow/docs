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
          heading: 'Integrate great solutions',
          description:
            'Add popular blockchain infrastructure platforms to your Flow app to enhance user experience and reduce development complexity.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CLIENT_LIBRARY,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/integrations',
        },
        {
          heading: 'Build and ship with Flow CLI',  
          description:
            'Stop wrestling with setup and boilerplate. Flow CLI lets you initialize projects, manage accounts and contracts, send transactions, and query chain state from one simple tool. Test locally, deploy to testnet or mainnet, and keep dependencies in sync.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.TOOLS,
          variant: 'horizontal',
          href: '/build/tools/flow-cli',
        },
        {
          heading: 'Manage contract imports',
          description:
            'Skip the copy-paste. The Dependency Manager installs and updates core, ecosystem, and custom contracts automatically so your imports stay consistent and your projects scale without dependency headaches.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.TOOLS,
          variant: 'horizontal',
          href: '/build/tools/flow-cli/dependency-manager',
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
