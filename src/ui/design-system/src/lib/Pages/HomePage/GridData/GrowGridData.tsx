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
          heading: 'Builder Perks',
          description:
            "Access thousands of dollars worth of Builder perks for building on Flow!",
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.BUILDER_CREDITS,
          variant: 'horizontal',
          href: '/ecosystem/builder-perks',
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
        },
        {
          heading: 'Grants',
          description:
            'Discover grant opportunities available to developers and teams building on Flow.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.GRANTS,
          variant: 'horizontal',
          href: '/ecosystem/grants',
        },
        {
          heading: 'Startup Support',
          description:
            'Get comprehensive support including technical guidance, marketing resources, and ecosystem connections.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.STARTUP_SUPPORT,
          variant: 'horizontal',
          href: '/growth',
        },
        {
          heading: 'VCs & Funds',
          description:
            'Connect with venture capital firms and investment funds actively supporting Flow projects.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.VCS_AND_FUNDS,
          variant: 'horizontal',
          href: '/ecosystem/vcs-and-funds',
        },

      ],
    },
  ],
};
