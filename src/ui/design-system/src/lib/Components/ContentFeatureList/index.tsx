import React from 'react';
import { ContentFeature, type ContentFeatureProps } from './ContentFeature';
import {
  HomepagePillItem,
  type HomepagePillItemsProps,
} from '../HomepageStartItem/HomepagePillItem';
import { IconName } from '@site/src/types/icons';

const ContentFeatures: Record<string, ContentFeatureProps> = {
  'why-flow': {
    icon: IconName.FEATURE_WHY_FLOW_ICON,
    image: 'feature-why-flow-image',
    header: 'Why Flow',
    text: "Explore Flow's scalable and high-performance blockchain architecture",
    link: '/build/cadence/flow',
  },
  'smart-accounts': {
    icon: IconName.FEATURE_WAND_ICON,
    image: 'feature-wand-image',
    header: 'Smart Accounts',
    text: 'Benefit from flexible accounts with seamless key management for security and convenience',
    link: 'build/basics/accounts',
  },
  transactions: {
    icon: IconName.FEATURE_STACKS_ICON,
    image: 'feature-stacks-image',
    header: 'Bundle & Scripted Transactions',
    text: 'Streamline operations using gasless, scripted, and bundled transactions',
    link: '/build/cadence/basics/transactions',
  },
  'code-scripts': {
    icon: IconName.FEATURE_CODE_SCRIPTS_ICON,
    image: 'feature-code-scripts-image',
    header: 'Scripted Queries',
    text: 'Access and interact with onchain data efficiently using powerful scripting',
    link: '/build/cadence/basics/scripts',
  },
  evm: {
    icon: IconName.FEATURE_EVM_ICON,
    image: 'feature-evm-image',
    header: 'EVM Equivalency',
    text: 'Use Solidity contracts on Flow without code changes',
    link: '/build/evm/about',
  },
};

const homepagePillData: Record<
  string,
  HomepagePillItemsProps & {
    onClick?: () => void;
  }
> = {
  'dev-office-hours': {
    link: 'https://calendar.google.com/calendar/embed?src=c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0%40group.calendar.google.com',
    icon: IconName.DEV_OFFICE_HOURS,
    text: 'Dev Office Hours',
    subText: 'Join weekly calls',
  },
  'flow-assistant': {
    link: '#',
    icon: IconName.FLOW_ASSISTANT_GPT,
    text: 'Flow AI Assistant',
    subText: 'Chat with devs',
    onClick: () => {
      const el = document.querySelector('ask-cookbook') as HTMLElement & {
        shadowRoot?: ShadowRoot;
      };
      if (!el) {
        console.warn('ask-cookbook element not found');
        return;
      }

      const shadow = el.shadowRoot;
      if (!shadow) {
        console.warn('ask-cookbook has no shadowRoot');
        return;
      }

      const button = shadow.querySelector(
        '#ask-cookbook-button',
      ) as HTMLButtonElement;
      if (!button) {
        console.warn(
          'Internal #ask-cookbook-button not found in the shadow root',
        );
        return;
      }

      button.click();
    },
  },
  'developer-chat': {
    link: 'https://discord.gg/flow',
    icon: IconName.DEVELOPER_CHAT,
    text: 'Developers Discord',
    subText: 'Chat with devs',
  },
  forum: {
    link: 'https://flow.com/upgrade/crescendo',
    icon: IconName.FORUM,
    text: 'Forum',
    subText: 'Discuss & Learn',
  },
  github: {
    link: 'https://github.com/orgs/onflow/discussions',
    icon: IconName.NETWORK_UPGRADE,
    text: 'Github Discussions',
    subText: 'Share issues',
  },
};

export function ContentFeatureList(): React.ReactElement {
  return (
    <div className="container">
      <div className="flex flex-col md:w-1/2 md:block pb-9">
        <div className="text-h2 pb-5">Key Features</div>
        Discover the innovative features that make Flow the blockchain built for
        the next generation of apps, games, and digital assets. Learn about its
        scalable architecture, developer-friendly environment, and
        resource-oriented programming with Cadence.
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4`}>
        <div className="lg:col-span-2">
          <ContentFeature key={0} {...ContentFeatures['why-flow']} />
        </div>
        <div className="lg:col-span-2">
          <ContentFeature key={1} {...ContentFeatures['smart-accounts']} />
        </div>
        <div className="lg:col-span-2">
          <ContentFeature key={2} {...ContentFeatures.transactions} />
        </div>
        <div className="lg:col-span-3">
          <ContentFeature key={3} {...ContentFeatures['code-scripts']} />
        </div>
        {/* This div will span two columns at the 'md' breakpoint */}
        <div className="md:col-span-2 lg:col-span-3">
          <ContentFeature key={4} {...ContentFeatures.evm} />
        </div>
      </div>
      <div className="grid col-span-1 md:grid-cols-2 md:col-span-2 lg:grid-cols-4 lg:col-span-3 gap-4 mt-10">
        <HomepagePillItem key={4} {...homepagePillData['dev-office-hours']} />
        <HomepagePillItem key={5} {...homepagePillData['flow-assistant']} />
        <HomepagePillItem key={6} {...homepagePillData['developer-chat']} />
        <HomepagePillItem key={7} {...homepagePillData['github']} />
        {/* <HomepagePillItem key={8} {...homepagePillData['forum']} /> */}
      </div>
    </div>
  );
}
