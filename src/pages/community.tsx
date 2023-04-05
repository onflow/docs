import React, { useEffect, useState } from 'react';
import { fetchLatestTopics } from '../utils/fetch-discourse-api';
// import { fetchFlips } from "~/cms/utils/fetch-flips"
import {
  contentNavigationListItems,
  editPageUrl,
  projects,
  secondaryNavSections,
  tools,
  upcomingEvents,
} from '../data/pages/community';
import CommunityPage from '../ui/design-system/src/lib/Pages/CommunityPage';
import { getMetaTitle } from '../utils/seo.server';
import { externalLinks } from '../data/external-links';
import Layout from '@theme/Layout';
import { type ForumCellProps } from '../ui/design-system/src/lib/Components/ForumCell';

// const { openFlips, goodPlacesToStartFlips } = await fetchFlips()
// const forumTopics = await fetchLatestTopics()

// await refreshTools(...tools)
const data = {
  contentNavigationListItems,
  discordUrl: externalLinks.discord,
  discourseUrl: externalLinks.discourse,
  editPageUrl,
  githubUrl: externalLinks.github,
  goodPlacesToStartFlips: [],
  meta: {
    title: getMetaTitle('Community'),
  },
  openFlips: [],
  projects,
  secondaryNavSections,
  tools,
  upcomingEvents,
};

export default function Page(): JSX.Element {
  const [forumTopics, setForumTopics] = useState<ForumCellProps[] | null>(null);
  useEffect(() => {
    fetchLatestTopics()
      .then((forumTopics) => {
        setForumTopics(forumTopics);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <Layout>
      <main>
        <CommunityPage
          contentNavigationListItems={data.contentNavigationListItems}
          discordUrl={data.discordUrl}
          discourseUrl={data.discourseUrl}
          editPageUrl={data.editPageUrl}
          forumTopics={forumTopics ?? []}
          githubUrl={data.githubUrl}
          goodPlacesToStartFlips={data.goodPlacesToStartFlips}
          openFlips={data.openFlips}
          projects={data.projects}
          secondaryNavSections={data.secondaryNavSections}
          tools={data.tools}
          upcomingEvents={data.upcomingEvents}
        />
      </main>
    </Layout>
  );
}
