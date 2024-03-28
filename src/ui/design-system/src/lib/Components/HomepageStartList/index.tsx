import React from 'react';
import {
  HomepageStartItem,
  type HomepageStartItemProps,
} from '../HomepageStartItem';
import {
  HomepagePillItem,
  type HomepagePillItemsProps,
} from '../HomepageStartItem/HomepagePillItem';

const homepageData: Record<string, HomepageStartItemProps> = {
  'cadence-course': {
    link: '/build/getting-started/quickstarts/hello-world',
    icon: 'cadence-course',
  },
  'beginner-dapp': {
    link: '/build/guides/flow-app-quickstart',
    icon: 'start-here',
  },
  'flow-quest': {
    link: '/tools/flow-cli',
    icon: 'path-quest',
  },
  'lang-reference': {
    link: 'https://cadence-lang.org/',
    icon: 'lang-reference',
  },
};

const homepagePillData: Record<string, HomepagePillItemsProps> = {
  'dev-office-hours': {
    link: '/ecosystem', // TODO: need destination link describing Dev Office Hours
    icon: 'dev-office-hours',
    text: 'Dev Office Hours',
    subText: '',
  },
  'flow-assistant-gpt': {
    link: '/tools/flow-cli',
    icon: 'flow-assistant-gpt',
    text: 'Flow Assistant GPT',
    subText: '',
  },
  'developer-chat': {
    link: 'https://onflow.org/discord',
    icon: 'developer-chat',
    text: 'Developers Chat',
    subText: '',
  },
  'network-upgrade': {
    link: '/build/flow',
    icon: 'network-upgrade',
    text: 'Network Upgrade',
    subText: 'View latest notes',
  },
};
export function HomepageStartList(): React.ReactElement {
  return (
    <div className="container">
      <div
        className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-1"
        style={{ gridTemplateRows: 'auto auto min-content' }}
      >
        <div className="md:col-span-1 md:row-span-2 rounded-lg shadow p-2">
          <HomepageStartItem key={0} {...homepageData['cadence-course']} />
        </div>

        <div className="md:col-span-1 md:row-span-1 rounded-lg shadow p-2">
          <HomepageStartItem key={1} {...homepageData['beginner-dapp']} />
        </div>

        <div className="md:col-span-1 md:row-span-1 rounded-lg shadow p-2">
          <HomepageStartItem key={2} {...homepageData['flow-quest']} />
        </div>

        <div className="md:col-span-2 md:row-span-1 rounded-lg shadow p-2">
          <HomepageStartItem key={3} {...homepageData['lang-reference']} />
        </div>
        <div className="col-span-1 md:col-span-3 p-2">
          <div className="flex flex-col md:flex-row gap-4">
            <HomepagePillItem
              key={4}
              {...homepagePillData['dev-office-hours']}
            />
            <HomepagePillItem
              key={5}
              {...homepagePillData['flow-assistant-gpt']}
            />
            <HomepagePillItem key={6} {...homepagePillData['developer-chat']} />
            <HomepagePillItem
              key={7}
              {...homepagePillData['network-upgrade']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
