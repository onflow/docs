import React from 'react';
import {
  HomepageStartItem,
  type HomepageStartItemProps,
} from '../HomepageStartItem';

const homepageData: Record<string, HomepageStartItemProps> = {
  'cadence-course': {
    link: 'https://developers.flow.com/evm/how-it-works',
    icon: 'cadence-course',
  },
  'beginner-dapp': {
    link: '/evm/using',
    icon: 'start-here',
  },
  'flow-quest': {
    link: '/evm/guides/integrating-metamask',
    icon: 'path-quest',
  },
  'lang-reference': {
    link: '/evm/accounts',
    icon: 'lang-reference',
  },
};

export function HomepageStartList(): React.ReactElement {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:w-1/2 md:block pb-9">
        <div className="text-h2 pb-5">Flow EVM</div>
        Unlock the ability to run EVM-compatible smart contracts on Flow.
        Leverage your existing Solidity skills and EVM tools to build on Flow's
        high-performance blockchain, combining familiar development experiences
        with Flow's scalability and efficiency.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 rounded-lg shadow p-2">
          <HomepageStartItem key={0} {...homepageData['cadence-course']} />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-lg shadow p-2">
          <HomepageStartItem key={1} {...homepageData['beginner-dapp']} />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-lg shadow p-2">
          <HomepageStartItem key={2} {...homepageData['flow-quest']} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-start-2 lg:col-span-2 rounded-lg shadow p-2">
          <HomepageStartItem key={3} {...homepageData['lang-reference']} />
        </div>
      </div>
    </div>
  );
}
