import { ColorOption } from '@site/src/constants/colors';
import { IconName } from '@site/src/types/icons';

export const growGridData = {
  title: 'Grow',
  icon: IconName.GROW,
  iconColor: 'purple' as ColorOption,
  sections: [
    {
      title: 'Grow',
      cards: [
        {
          heading: 'Developer Support Hub',
          description:
            'Access builder perks, grants, and VCs and funds. Get comprehensive support including technical guidance, marketing resources, and ecosystem connections.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.VCS_AND_FUNDS,
          variant: 'horizontal',
          href: '/ecosystem/developer-support-hub',
        },
        {
          heading: 'Dev Office Hours',
          description:
            'Join our weekly developer office hours to get direct support from the Flow team and connect with other builders.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.DEV_OFFICE_HOURS,
          variant: 'horizontal',
          href: 'https://calendar.google.com/calendar/u/0/embed?src=c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0@group.calendar.google.com',
          target: '_blank',
        },
        {
          heading: 'Use your favorite platforms',
          description:
            'Connect with Thirdweb, Crossmint, Dynamic, Privy, and other popular blockchain infrastructure platforms to enhance user experience and reduce development complexity.',
          iconColor: 'green',
          cardColor: 'black',
          icon: IconName.FLOW_CLIENT_LIBRARY,
          variant: 'horizontal',
          href: '/blockchain-development-tutorials/integrations',
        },
      ],
    },
  ],
};
