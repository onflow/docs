import { metadata } from '../data/metadata'

export function getSocialMetas({
  url,
  title = metadata.siteTitle,
  description = metadata.siteDescription,
  image = metadata.defaultPageImage,
  keywords = metadata.defaultKeywords,
}: {
  image?: string
  url: string
  title?: string
  description?: string
  keywords?: string
}) {
  return {
    title: getMetaTitle(title),
    description,
    keywords,
    image,
    'og:url': url,
    'og:title': title || metadata.openGraphDefaultTitle,
    'og:description': description,
    'og:image': image,
    'twitter:card': image ? 'summary_large_image' : 'summary',
    'twitter:creator': metadata.twitterTagContentCreatorUsername,
    'twitter:site': metadata.twitterTagSiteUsername,
    'twitter:title': title,
    'twitter:image': image,
    'twitter:description': description,
    'twitter:alt': title,
  }
}

export const getMetaTitle = (title?: string) =>
  [title, metadata.defaultPageTitle].filter(Boolean).join(' | ')
