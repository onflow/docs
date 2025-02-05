import { ColorOption } from "@site/src/constants/colors";

export const fundGridData = {
  title: 'Fund',
  icon: 'Fund',
  iconColor: 'purple' as ColorOption,
  sections: [
    {
      cards: [
        {
          heading: 'VCs & Funds',
          description:
            'Connect with venture capital firms and investment funds actively supporting Flow projects.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'VCs & Funds',
          onClick: () => {
            window.location.href = '/ecosystem/vcs-and-funds';
          },
        },
        {
          heading: 'Grants',
          description:
            'Discover grant opportunities available to developers and teams building on Flow.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'Grants',
          onClick: () => {
            window.location.href = '/ecosystem/grants';
          },
        },
        {
          heading: 'Hackathons',
          description:
            'Participate in Flow hackathons to build innovative projects and win prizes.',
          iconColor: 'purple',
          cardColor: 'black',
          icon: 'Hackathons',
          onClick: () => {
            window.location.href = '/ecosystem/hackathons';
          },
        },
      ],
    },
  ],
};
