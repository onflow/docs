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
          heading: 'Hackathons and Events',
          description:
            'Start building at a hackathon or meet us at an event. Join Flow community events and competitions.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: IconName.ACCESS_INCREDIBLE_IP,
          variant: 'horizontal',
          href: '/ecosystem/Hackathons%20and%20Events',
        },
      ],
    },
  ],
};
