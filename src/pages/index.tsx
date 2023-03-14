import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
// import { fetchFlips } from "~/cms/utils/fetch-flips"
import { allEvents } from '../data/events'
import HomePage from '../ui/design-system/src/lib/Pages/HomePage'
import { type ToolCardProps } from '../ui/design-system/src/lib/Components/ToolCard'
// import { refreshTools } from '../cms/tools.server'
import { externalLinks } from '../data/external-links'
import {
  contentNavigationListItems,
  editPageUrl,
  homepageStartProjectData,
  homepageThreeColumnData,
} from '../data/pages/home'
import {
  eventIndexingTool,
  fclSDK,
  flowserTool,
  goSDK,
  httpSDK,
  unitySDK,
} from '../data/tools'

const tools = [
  httpSDK,
  goSDK,
  fclSDK,
  unitySDK,
  eventIndexingTool,
  flowserTool,
] as ToolCardProps[]

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
  tools,
  upcomingEvents: allEvents,
  editPageUrl,
}

const Index = (): JSX.Element => {
  const { siteConfig } = useDocusaurusContext()
  return (

    <Layout
    title={`Hello from ${siteConfig.title}`}
    >
      <main>
    <HomePage
      contentNavigationListItems={data.contentNavigationListItems}
      discordUrl={externalLinks.discord}
      discourseUrl={externalLinks.discourse}
      editPageUrl={data.editPageUrl}
      flips={data.flips}
      githubUrl={externalLinks.github}
      homepageStartProjectData={data.homepageStartProjectData}
      threeColumnItems={homepageThreeColumnData}
      tools={data.tools}
      twitterUrl={externalLinks.twitter}
      upcomingEvents={data.upcomingEvents}
    />
    </main>
    </Layout>
  )
}

export default Index
