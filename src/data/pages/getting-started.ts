import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';
import { type FeaturedArticleCardProps } from '../../ui/design-system/src/lib/Components/FeaturedArticleCard';
import { type LandingHeaderProps } from '../../ui/design-system/src/lib/Components/LandingHeader';
import { type LinkCard2ColumnProps } from '../../ui/design-system/src/lib/Components/LinkCard2Column';
import { type SDKCardProps } from '../../ui/design-system/src/lib/Components/SDKCard';
import { type ToolCardProps } from '../../ui/design-system/src/lib/Components/ToolCard';
import {
  getTheFlowDown,
  introToFlow,
  redSquirrelGetStartedArticle,
} from '../../data/articles';
import {
  eventIndexingTool,
  fclSDK,
  flowserTool,
  goSDK,
  httpSDK,
  jvmSDK,
  overflowTool,
  pythonSDK,
  swiftSDK,
  unitySDK,
} from '../../data/tools';
import { externalLinks } from '../external-links';
import { metadata } from '../metadata';

export const landingHeaderItems: LandingHeaderProps = {
  buttonText: 'View Course',
  buttonUrl: 'https://academy.ecdao.org/',
  callout: 'Cadence Bootcamps',
  description: `Learn everything about the Flow Blockchain and the Cadence smart contract programming language with Emerald Academy -
  a Flow partner for open source educational content.`,
  discordUrl: externalLinks.discord,
  githubUrl: externalLinks.github,
  imageSrc: 'https://academy.ecdao.org/ea-logo.png',
  title: 'Getting Started',
};

export const linkCard2ColumnItems: LinkCard2ColumnProps = {
  buttonText: 'View Concepts',
  buttonUrl: '/learn/concepts',
  description:
    'Learn the fundamental concepts that power the overall dapp experience on Flow.',
  title: 'Core Concepts',
  items: [
    {
      title: 'Cadence',
      description:
        'Cadence is a resource-oriented programming language that introduces new features to smart contract programming.',
      href: '/cadence/intro',
      iconType: 'cadence',
    },
    {
      title: 'Flow Client Library',
      description:
        'The Flow Client Library (FCL) JS is a package used to interact with user wallets, dapps, and the blockchain.',
      href: '/tools/clients/fcl-js',
      iconType: 'fcl',
    },
  ],
};

export const sdkCardItems: [
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
] = [httpSDK, fclSDK, goSDK, unitySDK, pythonSDK, swiftSDK, jvmSDK];

export const contentNavigationListItems: ContentNavigationListProps = {
  header: 'Explore More Content',
  contentNavigationItems: [
    {
      title: 'Learn',
      text: 'All the resources you need to learn and build.',
      link: 'https://academy.ecdao.org/en',
      icon: 'learn',
    },
    {
      title: 'Tools',
      text: 'Curated list of developer tools, services, SDKs.',
      link: '/tools',
      icon: 'tools',
    },
  ],
};

export const recentArticleItems: [
  FeaturedArticleCardProps,
  FeaturedArticleCardProps,
  FeaturedArticleCardProps,
] = [introToFlow, redSquirrelGetStartedArticle, getTheFlowDown];

export const recentToolItems: [ToolCardProps, ToolCardProps, ToolCardProps] = [
  overflowTool,
  flowserTool,
  eventIndexingTool,
];

export const editPageUrl = `${metadata.githubRepoBaseUrl}/blob/main/app/data/pages/getting-started.ts`;
