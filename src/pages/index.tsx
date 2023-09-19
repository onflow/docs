import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import { fetchFlips } from "~/cms/utils/fetch-flips"
import { allEvents } from '../data/events';
import HomePage from '../ui/design-system/src/lib/Pages/HomePage';
// import { refreshTools } from '../cms/tools.server'
import { externalLinks } from '../data/external-links';
import {
  contentNavigationListItems,
  homepageStartProjectData,
} from '../data/pages/home';

const data = {
  discordUrl: externalLinks.discord,
  discourseUrl: externalLinks.discourse,
  twitterUrl: externalLinks.twitter,
  contentNavigationListItems,
  homepageStartProjectData,
  flips: {
    // ...flips, temporary empty arrays
    goodPlacesToStartFlips: [],
    openFlips: [],
    githubUrl: externalLinks.github,
  },
  githubUrl: externalLinks.github,
  upcomingEvents: allEvents,
};

const Index = (): JSX.Element => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <main>
        <HomePage
          contentNavigationListItems={data.contentNavigationListItems}
          discordUrl={externalLinks.discord}
          discourseUrl={externalLinks.discourse}
          flips={data.flips}
          githubUrl={externalLinks.github}
          homepageStartProjectData={data.homepageStartProjectData}
          twitterUrl={externalLinks.twitter}
          upcomingEvents={data.upcomingEvents}
        />
      </main>
    </Layout>
  );
};

export default Index;
