export const fundGridData = {
  title: 'Fund',
  sections: [
    {
      cards: [
        {
          heading: 'VCs & Funds',
          description:
            'Connect with venture capital firms and investment funds actively supporting Flow projects.',
          iconColor: 'purple',
          cardColor: 'black',
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
          onClick: () => {
            window.location.href = '/ecosystem/hackathons';
          },
        },
      ],
    },
  ],
};
