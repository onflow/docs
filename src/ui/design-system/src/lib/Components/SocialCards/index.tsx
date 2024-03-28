import React from 'react';
import { SocialCardItem } from './SocialCardItem';

const socialCardData = [
  {
    icon: 'discord',
    title: 'Discord',
    subText: 'Join Server',
    url: 'https://onflow.org/discord',
  },
  {
    icon: 'x.com',
    title: 'X.com',
    subText: 'Follow @flow_blockchain',
    url: 'https://www.x.com/',
  },
  {
    icon: 'github',
    title: 'GitHub',
    subText: 'Connect at @flow_blockchain',
    url: 'https://github.com/onflow',
  },
];

export const SocialCards = (): React.ReactElement => {
  return (
    <div className="container flex flex-col justify-center items-center bg-showcase-gradient w-full md:justify-start md:items-start">
      <div className="text-4xl font-semibold">Get involved</div>
      <div className="text-center md:text-start text-base py-4 md:w-1/2">
        There are tones of ways to get involved with Flow. If you have any
        questions or want to join the community, jump into our{' '}
        <a className="text-primary underline" href="">
          Discord
        </a>{' '}
        server or join our weekly{' '}
        <a
          className="underline"
          href="https://calendar.google.com/calendar/ical/c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0%40group.calendar.google.com/public/basic.ics"
        >
          Developer Office Hours
        </a>{' '}
        every Thursday! Or apply for Flow developer{' '}
        <a
          className="underline"
          href="https://github.com/onflow/developer-grants"
        >
          grants
        </a>
        .
      </div>
      <div className="flex w-full flex-col md:flex-row justify-between gap-4">
        {socialCardData.map((data, index) => (
          <div key={index} className="md:col-span-1">
            <SocialCardItem {...data} />
          </div>
        ))}
      </div>
    </div>
  );
};
