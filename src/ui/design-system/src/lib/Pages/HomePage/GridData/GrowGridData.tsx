import { ColorOption } from "@site/src/constants/colors";

export const growGridData = {
  title: 'Grow',
  icon: 'grow',
  iconColor: 'teal' as ColorOption,
  sections: [
    {
      cards: [
        {
          heading: 'Startup Support',
          description:
            'Get comprehensive support including technical guidance, marketing resources, and ecosystem connections.',
          iconColor: 'teal',
          cardColor: 'black',
          icon: 'startup-support',
          onClick: () => {
            window.location.href = '/growth';
          },
        },
        {
          heading: 'Builder Credits',
          description:
            "Access Flow's Builder Credits program to get resources and support for your project development.",
          iconColor: 'teal',
          cardColor: 'black',
          icon: 'builder-credits',
          onClick: () => {
            window.location.href =
              'https://github.com/orgs/onflow/discussions/1545';
          },
        },
        {
          heading: 'Dev Office Hours',
          description:
            'Join our weekly developer office hours to get direct support from the Flow team and connect with other builders.',
          iconColor: 'teal',
          cardColor: 'black',
          icon: 'dev-office-hours',
          onClick: () => {
            window.location.href =
              'https://calendar.google.com/calendar/u/0/embed?src=c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0@group.calendar.google.com';
          },
        },
      ],
    },
  ],
};
