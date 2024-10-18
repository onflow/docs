import React from 'react';
import { ContentFeature, type ContentFeatureProps } from './ContentFeature';

const ContentFeatures: Record<string, ContentFeatureProps> = {
  'why-flow': {
    icon: 'feature-why-flow-icon',
    image: 'feature-why-flow-image',
    header: 'Why Flow',
    text: 'Explore Flow\'s scalable and high-performance blockchain architecture',
    link: '/build/flow',
  },
  'smart-accounts': {
    icon: 'feature-wand-icon',
    image: 'feature-wand-image',
    header: 'Smart Accounts',
    text: 'Benefit from flexible accounts with seamless key management for security and convenience',
    link: 'build/basics/accounts',
  },
  transactions: {
    icon: 'feature-stacks-icon',
    image: 'feature-stacks-image',
    header: 'Bundle & Scripted Transactions',
    text: 'Streamline operations using gasless, scripted, and bundled transactions',
    link: '/build/basics/transactions',
  },
  'code-scripts': {
    icon: 'feature-code-scripts-icon',
    image: 'feature-code-scripts-image',
    header: 'Scripted Queries',
    text: 'Access and interact with on-chain data efficiently using powerful scripting',
    link: '/build/basics/scripts',
  },
  evm: {
    icon: 'feature-evm-icon',
    image: 'feature-evm-image',
    header: 'EVM Equivalency',
    text: 'Use Solidity contracts on Flow without code changes',
    link: '/evm/about',
  },
};

export function ContentFeatureList(): React.ReactElement {
  return (
    <div className="container">
      <div className="flex flex-col md:w-1/2 md:block pb-9">
        <div className="text-h2 pb-5">Key Features</div>
        Discover the innovative features that make Flow the blockchain built for the next generation of apps, games, and digital assets. Learn about its scalable architecture, developer-friendly environment, and resource-oriented programming with Cadence.
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
    </div>
  );
}
