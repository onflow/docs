import Layout from '@theme/Layout'
import React from 'react'
import { useLocation } from '@docusaurus/router'
import NetworkDetailPage from '../ui/design-system/src/lib/Pages/NetworkDetailPage'
// import { fetchNetworkStatus } from '~/cms/utils/fetch-network-status'
// import { fetchSporks } from '~/cms/utils/fetch-sporks'
import { featuredArticle } from '../data/pages/network'
import { getMetaTitle } from '../utils/seo.server'
import { externalLinks } from '../data/external-links'
import { type Network } from '../data/networks'
import { normalizeSporks } from '../utils/normalizeSporks'

// export const loader = async ({ params }: LoaderArgs) => {
//   const { networkName } = params

//   if (!networkName) throw new Error('Missing network name')

//   const network = networks.find(({ urlPath }) => urlPath === networkName)

//   if (!network) throw json({ status: 'noPage' }, { status: 404 })

//   const networkStatuses = await fetchNetworkStatus()
//   const sporks = await fetchSporks()
//   const status = networkStatuses.find(({ id }) => id === network.componentId)
//   const pastSporks = sporks.pastSporks[network.id] || []

const staticData = {
  discordUrl: externalLinks.discord,
  discourseUrl: externalLinks.discourse,
  featuredArticle,
  githubUrl: externalLinks.github,
  status,
  twitterUrl: externalLinks.twitter,
}

export default function NetworkPage ({ networks, sporks }: { networks: Network[] }): JSX.Element | null {
  const { pathname } = useLocation()
  const pathnameArray = pathname.split('/')
  const networkPath = pathnameArray[pathnameArray.length - 1]
  const network = networks.find(({ urlPath }) => urlPath === networkPath)
  const pastSporks = normalizeSporks(sporks)

  if (network == null) {
    return null
  }
  const data = {
    ...staticData,

    urlPath: `/network/${network.urlPath}`,
    meta: {
      title: getMetaTitle(network.title),
    },
    networkName: network.title,
    networks: networks.map(({ title, urlPath }) => ({
      name: title,
      link: `/network/${network.urlPath}`,
    })),
    pastSporks,
  }

  return (
    <Layout>
      <main>
        <NetworkDetailPage
          discordUrl={data.discordUrl}
          discourseUrl={data.discourseUrl}
          featuredArticle={data.featuredArticle}
          githubUrl={data.githubUrl}
          networkName={data.networkName}
          networks={data.networks}
          pastSporks={data.pastSporks}
          status={data.status}
          twitterUrl={data.twitterUrl}
        />
      </main>
    </Layout>
  )
}
