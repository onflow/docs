import React from 'react';
import {
  HomepageStartItemCadence,
  type HomepageStartItemProps,
} from '../HomepageStartItemCadence';
import {
  HomepagePillItem,
  type HomepagePillItemsProps,
} from '../HomepageStartItemCadence/HomepagePillItem';
import { IconName } from '@site/src/types/icons';

const homepageData: Record<string, HomepageStartItemProps> = {
  'cadence-course': {
    link: 'https://academy.ecdao.org/en/catalog/courses/learn-cadence-beginner',
    icon: IconName.CADENCE_COURSE,
  },
  'beginner-dapp': {
    link: '/build/cadence/getting-started/contract-interaction',
    icon: IconName.START_HERE,
  },
  'flow-quest': {
    link: 'https://arcade.ecdao.org/',
    icon: IconName.PATH_QUEST,
  },
  'lang-reference': {
    link: 'https://cadence-lang.org/',
    icon: IconName.LANG_REFERENCE,
  },
};

const homepagePillData: Record<string, HomepagePillItemsProps> = {
  'dev-office-hours': {
    link: 'https://github.com/onflow/Flow-Working-Groups#Calendar',
    icon: IconName.DEV_OFFICE_HOURS,
    text: 'Working Groups',
    subText: 'Get involved',
  },
  'flow-assistant': {
    link: 'https://chatgpt.com/g/g-a1jOaEj1h-flow-assistant',
    icon: IconName.FLOW_ASSISTANT_GPT,
    text: 'Flow Assistant GPT',
    subText: 'Check it out',
  },
  'developer-chat': {
    link: 'https://discord.gg/flow',
    icon: IconName.DEVELOPER_CHAT,
    text: 'Developers Chat',
    subText: 'Chat with devs',
  },
  'network-upgrade': {
    link: 'https://cadence-lang.org/docs/cadence-migration-guide/',
    icon: IconName.NETWORK_UPGRADE,
    text: 'Network Upgrade',
    subText: 'View latest',
  },
};
export function HomepageStartListCadence(): React.ReactElement {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:w-1/2 md:block pb-9">
        <div className="text-h2 pb-5">Learn Cadence</div>
        Dive into Cadence, Flow's powerful and secure smart contract language. Access comprehensive tutorials and documentation to start building sophisticated decentralized applications with ease and confidence.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 rounded-lg shadow p-2">
          <HomepageStartItemCadence
            key={0}
            {...homepageData['cadence-course']}
          />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-lg shadow p-2">
          <HomepageStartItemCadence
            key={1}
            {...homepageData['beginner-dapp']}
          />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-lg shadow p-2">
          <HomepageStartItemCadence key={2} {...homepageData['flow-quest']} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-start-2 lg:col-span-2 rounded-lg shadow p-2">
          <HomepageStartItemCadence
            key={3}
            {...homepageData['lang-reference']}
          />
        </div>
      </div>
    </div>
  );
}
