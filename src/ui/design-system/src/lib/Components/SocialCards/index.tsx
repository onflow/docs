import React from 'react';
import { SocialCardItem } from './SocialCardItem';
import { IconName } from '@site/src/types/icons';

const socialCardData = [
  {
    icon: IconName.DISCORD,
    title: 'Discord',
    subText: 'Join Server',
    url: 'https://discord.gg/flow',
  },
  {
    icon: IconName.X_COM,
    title: 'X.com',
    subText: 'Follow @flow_blockchain',
    url: 'https://www.x.com/flow_blockchain',
  },
  {
    icon: IconName.GITHUB,
    title: 'GitHub',
    subText: 'Connect at @onflow',
    url: 'https://github.com/onflow',
  },
];

export const SocialCards = (): React.ReactElement => {
  return (
    <div className="container flex flex-col justify-center items-center w-full md:justify-start md:items-start">
      <div className="text-white text-4xl font-semibold">Get involved</div>
      <div className="text-white text-center md:text-start text-base py-4 md:w-1/2">
        There are tones of ways to get involved with Flow. If you have any
        questions or want to join the community, jump into our{' '}
        <a className="text-white underline" href="">
          Discord
        </a>{' '}
        server or join our weekly{' '}
        <a
          className="underline text-white"
          href="https://calendar.google.com/calendar/ical/c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0%40group.calendar.google.com/public/basic.ics"
        >
          Developer Office Hours
        </a>{' '}
        every Thursday! Or apply for Flow developer{' '}
        <a
          className="underline text-white"
          href="https://github.com/onflow/developer-grants"
        >
          grants
        </a>
        .
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex gap-4 w-full">
        <SocialCardItem {...socialCardData[0]} />
        <SocialCardItem {...socialCardData[1]} />
        <div className={'md:col-span-2'}>
          <SocialCardItem {...socialCardData[2]} />
        </div>
      </div>
    </div>
  );
};
