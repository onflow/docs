import React from 'react'
import { featuredArticle } from '../data/pages/network'
import NetworkPage from '../ui/design-system/src/lib/Pages/NetworkPage'
import { getMetaTitle } from '../utils/seo.server'
import { externalLinks } from '../data/external-links'
import { type Network } from '../data/networks'
import Layout from '@theme/Layout'
import { normalizeSporks } from '../utils/normalizeSporks'

const staticData = {
  discordUrl: externalLinks.discord,
  discourseUrl: externalLinks.discourse,
  featuredArticle,
  githubUrl: externalLinks.github,
  meta: {
    title: getMetaTitle('Network status'),
  },
  twitterUrl: externalLinks.twitter,
}

export default function Networks ({ networks, sporks }: { networks: Network[] }): JSX.Element {
  const pastSporks = normalizeSporks(sporks)
  const networksWithNameStatusLinks = networks.map(({ componentId, id, title, urlPath }) => ({
    lastSporkDate: pastSporks[id]?.[0]?.timestamp as string | undefined,
    id,
    name: title,
    link: `/network/${urlPath}`,
    // status: networkStatuses.find((status) => status.id === componentId)
    //   ?.status,
  }))
  const data = {
    ...staticData,
    networks: networksWithNameStatusLinks,
  }
  return (
    <Layout>
      <main>
        <NetworkPage
          // announcementCards={announcementCards}
          // discordNetworkCards={[]}
          discordUrl={data.discordUrl}
          discourseUrl={data.discourseUrl}
          featuredArticle={data.featuredArticle}
          githubUrl={data.githubUrl}
          networks={data.networks}
          twitterUrl={data.twitterUrl}
        />
      </main>
    </Layout>
  )
}
