import React from 'react';
import {
  contentNavigationListItems,
  editPageUrl,
  landingHeaderItems,
  linkCard2ColumnItems,
  recentArticleItems,
  recentToolItems,
  sdkCardItems,
} from '../data/pages/getting-started';
import { GettingStartedPage } from '../ui/design-system/src/lib/Pages/GettingStartedPage';
import {
  Icon1,
  Icon2,
  Icon3,
} from '../ui/design-system/src/lib/Pages/GettingStartedPage/GettingStartedPage.stories';
import { getMetaTitle } from '../utils/seo.server';
import { externalLinks } from '../data/external-links';
import Layout from '@theme/Layout';

const data = {
  contentNavigationListItems,
  discordUrl: externalLinks.discord,
  discourseUrl: externalLinks.discourse,
  editPageUrl,
  githubUrl: externalLinks.github,
  landingHeaderItems,
  linkCard2ColumnItems,
  meta: {
    title: getMetaTitle('Getting Started'),
  },
  recentArticleItems,
  recentToolItems,
  sdkCardItems,
  twitterUrl: externalLinks.twitter,
};

export default function GettingStarted(): JSX.Element {
  return (
    <Layout>
      <main>
        <GettingStartedPage
          contentNavigationListItems={data.contentNavigationListItems}
          discordUrl={data.discordUrl}
          discourseUrl={data.discourseUrl}
          editPageUrl={data.editPageUrl}
          githubUrl={data.githubUrl}
          landingHeaderItems={data.landingHeaderItems}
          linkCard2ColumnItems={data.linkCard2ColumnItems}
          linkCard3ColumnItems={{
            items: [
              {
                title: 'Try',
                description:
                  'Examples curated to get you up and running in minutes.',
                icon: <Icon1 />,
                links: [
                  {
                    title: 'Flow Playground Web IDE',
                    href: 'https://play.onflow.org',
                    tags: ['cadence', 'dev', 'all-levels'],
                  },
                  {
                    title: 'Javascript Quickstart',
                    href: '/tutorials/flow-app-quickstart/',
                    tags: ['tutorial', 'beginner'],
                  },
                  {
                    title: 'NFT Storefront & Marketplace',
                    href: '/tutorials/kitty-items/',
                    tags: ['example', 'intermediate'],
                  },
                  {
                    title: 'Cadence Cookbook',
                    href: 'https://open-cadence.onflow.org/',
                    tags: ['samples', 'playground'],
                  },
                  {
                    title: 'Flow Block Explorer',
                    href: 'https://flowscan.org/',
                  },
                ],
              },
              {
                title: 'Learn',
                description:
                  'Resources to help you understand how the Flow blockchain works.',
                icon: <Icon2 />,
                links: [
                  {
                    title: 'Flow technical papers',
                    href: 'https://www.onflow.org/technical-paper',
                    tags: ['protocol', 'overview'],
                  },
                  {
                    title: 'Youtube Tutorials',
                    href: 'https://www.youtube.com/playlist?list=PLvcQxi9WyGdGUx-a4rCsLWn_WKlA9YAXP',
                    tags: ['tutorial', 'beginner', 'video'],
                  },
                  {
                    title: 'Dapp architecture',
                    href: '/tutorials/dapp-development/DappArchitectures/',
                    tags: ['guide', 'overview'],
                  },
                  {
                    title: 'Beginner Cadence course',
                    href: 'https://github.com/emerald-dao/beginner-cadence-course',
                    tags: ['guide', 'beginner'],
                  },
                  {
                    title: 'View more learning resources',
                    href: '/learn',
                  },
                ],
              },
              {
                title: 'Build',
                description:
                  'First steps to start the development process on Flow.',
                icon: <Icon3 />,
                links: [
                  {
                    title: 'Get the Flow CLI',
                    href: '/tools/flow-cli/install/',
                    tags: ['install'],
                  },
                  {
                    title: 'Create a testnet account',
                    href: 'https://testnet-faucet.onflow.org/',
                    tags: ['faucet', 'create', 'fund'],
                  },
                  {
                    title: 'Core contracts & standards',
                    href: '/flow/core-contracts',
                    tags: ['nft', 'ft', 'metadata'],
                  },
                  {
                    title: 'Launch a simple NFT',
                    href: 'https://github.com/emerald-dao/1-simple-nft',
                    tags: ['tutorial', 'beginner'],
                  },
                  {
                    title: 'View all tools and services',
                    href: '/tools',
                  },
                ],
              },
            ],
          }}
          recentArticleItems={data.recentArticleItems}
          recentToolItems={data.recentToolItems}
          sdkCardItems={data.sdkCardItems}
          twitterUrl={data.twitterUrl}
        />
      </main>
    </Layout>
  );
}
