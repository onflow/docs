import React from 'react';
import { LinkGridImage } from './LinkGridImage';
import ReadDocs from '../../../../images/page/read-docs.svg';
import ArrowRight from '../../../../images/page/arrow-right.svg';

export interface GridLink {
  title: string;
  href: string;
}

export interface LinkGridSection {
  links: GridLink[];
  header: string;
  imageName: string;
  more: string;
}

export interface LinkGridProps {
  sections: LinkGridSection[];
}

const sections: LinkGridSection[] = [
  {
    header: 'Introduction',
    links: [
      {
        title: 'Hello World Tutorial',
        href: '/build/cadence/getting-started/contract-interaction',
      },
      {
        title: 'App Architecture',
        href: '/build/cadence/getting-started/app-architecture',
      },
      { title: 'EVM', href: '/evm/about' },
      { title: 'Flownaut', href: 'https://flownaut.ecdao.org/en' },
      { title: 'Playground', href: 'https://play.flow.com/' },
      {
        title: 'Mobile Quickstart',
        href: '/build/cadence/guides/mobile/overview',
      },
    ],
    imageName: 'docs-introduction',
    more: '/build/cadence/basics/blocks',
  },
  {
    header: 'Fundamentals',
    links: [
      {
        title: 'Wallets',
        href: '/ecosystem/wallets',
      },
      {
        title: 'Deployment',
        href: '/build/cadence/smart-contracts/deploying',
      },
      {
        title: 'Block Explorer',
        href: '/ecosystem/block-explorers',
      },
      {
        title: 'Accounts',
        href: '/build/cadence/basics/accounts',
      },
      {
        title: 'Faucets',
        href: '/ecosystem/faucets',
      },
      {
        title: 'Bridges',
        href: '/ecosystem/bridges',
      },
    ],
    imageName: 'docs-fundamentals',
    more: '/build/cadence/basics/blocks',
  },
  {
    header: 'The Stack',
    links: [
      {
        title: 'Flow Virtual Machine',
        href: 'https://flow.com/technical-paper',
      },
      {
        title: 'Cadence Smart Contracts',
        href: '/build/cadence/smart-contracts/overview',
      },
      {
        title: 'Cadence Smart Contract Testing',
        href: '/build/cadence/smart-contracts/testing',
      },
      { title: 'Flow CLI', href: '/tools/flow-cli' },
      {
        title: 'Node Operations',
        href: '/networks/node-ops',
      },
      {
        title: 'Network Architecture',
        href: '/networks/network-architecture',
      },
    ],
    imageName: 'docs-the-stack',
    more: 'https://flow.com/decentralization',
  },
  {
    header: 'Advanced',
    links: [
      {
        title: 'Account Abstraction',
        href: '/build/cadence/advanced-concepts/account-abstraction',
      },
      {
        title: 'Understanding Transaction Time',
        href: '/build/cadence/basics/transactions#transaction-time',
      },
      {
        title: 'FLIX',
        href: '/build/cadence/advanced-concepts/flix',
      },
      {
        title: 'Metadata Views',
        href: '/build/cadence/advanced-concepts/metadata-views',
      },
      {
        title: 'VRF',
        href: '/build/cadence/advanced-concepts/randomness',
      },
      {
        title: 'Sponsored Transactions',
        href: '/build/cadence/advanced-concepts/account-abstraction#sponsored-transactions',
      },
      {
        title: 'Multi-auth Transactions',
        href: '/build/cadence/advanced-concepts/account-abstraction#multi-sig-transactions',
      },
    ],
    imageName: 'docs-advanced',
    more: '/build/cadence/advanced-concepts/flix',
  },
];

const SectionCard = ({
  header,
  links,
  imageName,
  more,
}: LinkGridSection): React.ReactNode => {
  return (
    <div
      className={`h-full p-6 flex flex-col space-y-4 border-b border-b-1 border-t-0 border-r-0 border-l-0 border-gray-600 border-solid md:border-b-0 md:border-r md:border-r-1 md:last:border-r-0 md:border-r-1 lg:border-r-1 `}
    >
      <LinkGridImage imageName={imageName} />
      <h3 className="text-lg font-semibold">{header}</h3>
      <div className="h-full space-y-2 flex flex-col gap-1">
        {links.map((link, index) => (
          <span
            key={index}
            className="hover:underline hover:primary-green cursor-pointer"
          >
            <a
              className="text-primary-gray-300 hover:text-primary-green dark:hover:text-green-dark"
              href={link.href}
            >
              {link.title}
            </a>
          </span>
        ))}
      </div>
      <a
        href={more}
        className="border-none bg-transparent font-semibold hover:underline mt-auto py-5"
      >
        <span className="md:hidden">View All</span>
        <span className="hidden md:block text-primary-gray-300 hover:text-primary-green dark:hover:text-green-dark">
          More
        </span>
      </a>
    </div>
  );
};

export const LinkGrid = (): React.ReactNode => (
  <div className="container md:border md:border md:border-solid border-gray-600 rounded-lg p-0">
    <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between md:justify-center md:border-b border-t-0 border-r-0 border-l-0 md:border-solid border-gray-600">
      <div className="text-4xl px-6">Explore the Docs</div>
      <a
        href="/build/cadence/flow"
        className="hover:no-underline text-primary-gray-600 hover:text-primary-gray-600"
      >
        <div className="px-6 flex items-center gap-2 font-semibold hover:opacity-80 hover:cursor-pointer hover:no-underline text-primary-gray-300 ">
          Read Docs
          <ReadDocs className="hidden md:block stroke-current" />
          <ArrowRight className="md:hidden stroke-current" />
        </div>
      </a>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {sections.map((section, index) => (
        <SectionCard key={index} {...section} />
      ))}
    </div>
  </div>
);
