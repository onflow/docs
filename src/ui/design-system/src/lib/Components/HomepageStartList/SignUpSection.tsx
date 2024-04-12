import React from 'react';
import { HomepageStartItem } from '../HomepageStartItem';
import { Button } from '../Button';
import { HomepageStartItemIcons } from '../HomepageStartItem/HomepageStartIcons';

const roadmapData = {
  link: 'https://flow.com/upgrade/crescendo/cadence-1#roadmap',
  icon: 'roadmap',
};

export function SignUpSection(): React.ReactElement {
  const signUp = () => {
    console.log('Sign up');
  };

  return (
    <div className="container md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <HomepageStartItem key={0} {...roadmapData} />
        <div className="flex flex-col gap-4 rounded-lg p-2">
          <HomepageStartItemIcons icon={'updates'} />
          <span className="text-3xl font-semibold">
            Flow Ecosystem Newsletter{' '}
          </span>
          <div className="text-primary-gray-300">
            Stay up to date with the latest changelog updates, educational
            resources, grants and announcements.
          </div>
          <input
            className="rounded-md p-4 border-0"
            type="text"
            placeholder="Enter your email"
          />
          <Button
            onClick={signUp}
            size={'sm'}
            variant="accent"
            className="p-4 border-0"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
