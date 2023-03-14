import React from 'react'
import Layout from '@theme/Layout'
import {
  allTutorials,
  architectureTutorials,
  cadenceHref,
  cadenceTutorials,
  contentNavigationListItems,
  editPageUrl,
  nftTutorials,
  secondaryNavSections,
  videos,
  youtubeHref,
} from '../data/pages/learn'
import {
  LearnPage,
} from '../ui/design-system/src/lib/Pages/LearnPage'
import { getMetaTitle } from '../utils/seo.server'
import { externalLinks } from '../data/external-links'

const data = {
  allTutorials,
  architectureTutorials,
  discordUrl: externalLinks.discord,
  discourseUrl: externalLinks.discourse,
  cadenceHref,
  cadenceTutorials,
  contentNavigationListItems,
  editPageUrl,
  githubUrl: externalLinks.github,
  nftTutorials,
  secondaryNavSections,
  twitterUrl: externalLinks.twitter,
  videos,
  youtubeHref,
}

export default function Learn () {
  return (
    <Layout
      title={getMetaTitle('Tools')}
    >
      <main>
        <LearnPage
          allTutorials={data.allTutorials}
          architectureTutorials={data.architectureTutorials}
          cadenceHref={data.cadenceHref}
          cadenceTutorials={data.cadenceTutorials}
          contentNavigationListItems={data.contentNavigationListItems}
          discordUrl={data.discordUrl}
          discourseUrl={data.discourseUrl}
          editPageUrl={data.editPageUrl}
          githubUrl={data.githubUrl}
          nftTutorials={data.nftTutorials}
          twitterUrl={data.twitterUrl}
          videos={data.videos}
          youtubeHref={data.youtubeHref}
        />
      </main>
    </Layout>
  )
}
