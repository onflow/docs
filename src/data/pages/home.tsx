import React from 'react';
import EcosystemIcon from '../../ui/design-system/images/content/ecosystem.svg';
import SDKIcon from '../../ui/design-system/images/content/sdk.svg';
import UseCaseIcon from '../../ui/design-system/images/content/use-cases.svg';
import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';
import { type HomepageStartItemProps } from '../../ui/design-system/src/lib/Components/HomepageStartItem';
import { metadata } from '../metadata';

const homepageStartProjectData: HomepageStartItemProps[] = [
  {
    title: 'Learn Flow',
    text: 'Dive into Flow key concepts through tutorials, guides, and examples',
    link: '/concepts/intro',
    icon: 'learn',
  },
  {
    title: 'Guides & Tutorials',
    text: 'Create your first Flow dApp in just a few minutes',
    link: '/tutorials/intro',
    icon: 'quickstart',
  },
  {
    title: 'References',
    text: 'All the developer resources you need to build on Flow',
    link: '/cadence/intro',
    icon: 'documentation',
  },
];

const homepageThreeColumnData: any = [
  {
    title: 'Quickstarts',
    description:
      'Quick ways to get started in the environments for development.',
    icon: <UseCaseIcon height="1.5em" width="1.5em" />,
    links: [
      {
        title: 'Get started locally',
        href: 'https://github.com/emerald-dao/0-hello-world',
        tags: ['emulator'],
      },
      {
        title: 'Get started on testnet',
        href: '/tutorials/flow-app-quickstart',
        tags: ['javascript'],
      },
      {
        title: 'Get started on the playground',
        href: '/cadence/tutorial/hello-world',
        tags: ['playground'],
      },
      {
        title: 'View all tools and services',
        href: '/tools',
      },
    ],
  },
  {
    title: 'Guides & Tutorials',
    description: 'A more in-depth look at how dapp development works.',
    icon: <EcosystemIcon height="1.5em" width="1.5em" />,
    links: [
      {
        title: 'Anatomy of a Flow dapp',
        href: '/tutorials/flow-dapp-anatomy/',
        tags: ['overview'],
      },
      {
        title: 'Flow key concepts',
        href: '/concepts/start-here/accounts-and-keys/',
        tags: ['accounts', 'signing'],
      },
      {
        title: 'Launch a Fungible Token on Flow',
        href: '/tutorials/fungible-tokens',
        tags: ['overview', 'guide'],
      },
      {
        title: 'View more learning resources',
        href: '/learn',
      },
    ],
  },
  {
    title: 'Smart Contracts',
    description:
      'Use Cadence to interact with and create smart contracts on chain.',
    icon: <SDKIcon height="1.5em" width="1.5em" />,
    links: [
      {
        title: 'Why Cadence?',
        href: 'https://medium.com/coinmonks/how-cadence-and-flow-will-revolutionize-smart-contract-programming-607bd05b49b',
        tags: ['blog'],
      },
      {
        title: 'Resource oriented programming',
        href: '/cadence#intuiting-ownership-with-resources',
        tags: ['overview'],
      },
      {
        title: 'Cadence cookbook',
        href: 'https://open-cadence.onflow.org/',
        tags: ['samples', 'playground'],
      },
      {
        title: 'View all Cadence content',
        href: '/cadence/',
      },
    ],
  },
];

const contentNavigationListItems: ContentNavigationListProps = {
  header: 'Explore More Content',
  contentNavigationItems: [
    {
      title: 'Learn',
      text: 'All the resources you need to learn and build.',
      link: '/learn',
      icon: 'learn',
    },
    {
      title: 'Tools',
      text: 'Curated list of developer tools, services, SDKs.',
      link: '/tools',
      icon: 'tools',
    },
    {
      title: 'Community',
      text: "Learn more about Flow's ecosystem and get involved.",
      link: '/community',
      icon: 'community',
    },
  ],
};

export {
  homepageThreeColumnData,
  homepageStartProjectData,
  contentNavigationListItems,
};

export const editPageUrl = `${metadata.githubRepoBaseUrl}/blob/main/app/data/pages/home.tsx`;
