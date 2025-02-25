import { ColorOption } from '@site/src/constants/colors';

export const growGridData = {
  title: 'Grow',
  icon: 'grow',
  iconColor: 'purple' as ColorOption,
  sections: [
    {
      cards: [
        {
          heading: 'Startup Support',
          description:
            'Get comprehensive support including technical guidance, marketing resources, and ecosystem connections.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'startup-support',
          variant: 'horizontal',
          href: '/growth',
        },
        {
          heading: 'Builder Credits',
          description:
            "Access Flow's Builder Credits program to get resources and support for your project development.",
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'builder-credits',
          variant: 'horizontal',
          href: 'https://github.com/orgs/onflow/discussions/1545',
        },
        {
          heading: 'Dev Office Hours',
          description:
            'Join our weekly developer office hours to get direct support from the Flow team and connect with other builders.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'dev-office-hours',
          variant: 'horizontal',
          href: 'https://calendar.google.com/calendar/u/0/embed?src=c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0@group.calendar.google.com',
        },
        {
          heading: 'VCs & Funds',
          description:
            'Connect with venture capital firms and investment funds actively supporting Flow projects.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'vcs-&-funds',
          variant: 'horizontal',
          href: '/ecosystem/vcs-and-funds',
        },
        {
          heading: 'Grants',
          description:
            'Discover grant opportunities available to developers and teams building on Flow.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'grants',
          variant: 'horizontal',
          href: '/ecosystem/grants',
        },
      ],
    },
  ],
};
