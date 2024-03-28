import React from 'react';
import { ContentFeature, type ContentFeatureProps } from './ContentFeature';

const ContentFeatures: Record<string, ContentFeatureProps> = {
  'why-flow': {
    icon: 'feature-why-flow-icon',
    image: 'feature-why-flow-image',
    header: 'Why Flow',
    text: 'Introduction to the Network',
    headerLink: '',
  },
  'smart-accounts': {
    icon: 'feature-wand-icon',
    image: 'feature-wand-image',
    header: 'Smart Accounts',
    text: 'Enhance UX with a flexible Account structure and key management',
    headerLink: '',
  },
  transactions: {
    icon: 'feature-stacks-icon',
    image: 'feature-stacks-image',
    header: 'Bundle & Scripted Transactions',
    text: 'Introduction to gasless, scripted and bundled transactions',
    headerLink: '',
  },
  'code-scripts': {
    icon: 'feature-code-scripts-icon',
    image: 'feature-code-scripts-image',
    header: 'Scripted Queries',
    text: 'Introduction to Queries',
    headerLink: '',
  },
  'evm-compatibility': {
    icon: 'feature-evm-icon',
    image: 'feature-evm-image',
    header: 'EVM Compatibility',
    text: 'Coming in from EVM? Discover key similarities and differences to launch faster',
    headerLink: '',
  },
};

export function ContentFeatureList(): React.ReactElement {
  return (
    <div className="container">
      <div className="flex flex-col md:w-1/2 md:block pb-9">
        <div className="text-h2 pb-5">Key Features</div>
        Discover the unique features of Flow, unlocking innovative possibilities
        for your decentralized applications and smart contracts.
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
        <div className="md:col-span-1">
          <ContentFeature key={0} {...ContentFeatures['why-flow']} />
        </div>
        <div className="md:col-span-1">
          <ContentFeature key={1} {...ContentFeatures['smart-accounts']} />
        </div>
        <div className="md:col-span-1">
          <ContentFeature key={2} {...ContentFeatures.transactions} />
        </div>
        <div className="md:col-span-3">
          <div className="flex flex-col md:flex-row gap-4">
            <ContentFeature key={3} {...ContentFeatures['code-scripts']} />
            <ContentFeature key={4} {...ContentFeatures['evm-compatibility']} />
          </div>
        </div>
      </div>
    </div>
  );
}
