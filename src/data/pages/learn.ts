import { ContentNavigationListProps } from "~/ui/design-system/src/lib/Components/ContentNavigationList"
import { TutorialCardProps } from "~/ui/design-system/src/lib/Components/TutorialCard"
import {
  accessControlCadence,
  cadenceAtAGlance,
  playgroundTutorials,
  FCLQuickstartNextJs,
  FCLQuickstartNuxtJs,
  FCLQuickstartSvelteKit,
  firstStepsWithCadence,
  flowMetaDataStandard,
  flowMultiNodeArchitecture,
  flowNFTPetStore,
  getTheFlowDown,
  guideToFlowForEthereumUsers,
  introToFlow,
  learnCadenceVideoSeries,
  NBATopShotExample,
  organizingCadenceTutorial,
  redSquirrelGetStartedArticle,
  revolutionizeSmartContractProgramming,
  zeroToJacobFlow,
} from "../../data/articles"
import { LearnPageProps } from "../../ui/design-system/src/lib/Pages/LearnPage"
import { externalLinks } from "../external-links"
import { metadata } from "../metadata"

export const cadenceTutorials: TutorialCardProps[] = [
  cadenceAtAGlance,
  playgroundTutorials,
  organizingCadenceTutorial,
  learnCadenceVideoSeries,
  zeroToJacobFlow,
  firstStepsWithCadence,
  FCLQuickstartNextJs,
  FCLQuickstartNuxtJs,
  FCLQuickstartSvelteKit,
]

export const nftTutorials: TutorialCardProps[] = [
  NBATopShotExample,
  redSquirrelGetStartedArticle,
  flowNFTPetStore,
  flowMetaDataStandard,
]

export const architectureTutorials: TutorialCardProps[] = [
  introToFlow,
  flowMultiNodeArchitecture,
  getTheFlowDown,
  guideToFlowForEthereumUsers,
  revolutionizeSmartContractProgramming,
  accessControlCadence,
]

export const videos: LearnPageProps["videos"] = {
  primary: {
    link: "https://www.youtube.com/watch?v=pRz7EzrWchs",
    title: "Learn Cadence - Hello World on Flow",
    length: 1396,
  },
  secondary: [
    {
      link: "https://www.youtube.com/watch?v=DInibYmxUsc",
      title: "Fungible Token Smart Contracts on Flow",
      length: 1993,
      tags: ["Guide"],
    },
    {
      link: "https://www.youtube.com/watch?v=uEoh9SnjqCk",
      title: "How to build a basic web3 app on Flow",
      length: 1878,
      tags: ["Guide"],
    },
  ],
}

export const allTutorials: TutorialCardProps[] = [
  ...nftTutorials,
  ...cadenceTutorials,
  ...architectureTutorials,
]

export const contentNavigationListItems: ContentNavigationListProps = {
  header: "Explore More Content",
  contentNavigationItems: [
    {
      title: "Tools",
      text: "Curated list of developer tools, services, SDKs.",
      link: "/tools",
      icon: "tools",
    },
    {
      title: "Community",
      text: "Learn more about Flow's ecosystem and get involved.",
      link: "/community",
      icon: "community",
    },
  ],
}

export const secondaryNavSections = [
  {
    title: "Cadence",
    elementId: "cadence",
  },
  {
    title: "NFTs",
    elementId: "nfts",
  },
  {
    title: "Architecture",
    elementId: "architecture",
  },
  {
    title: "Featured Videos",
    elementId: "featured-videos",
  },
  {
    title: "All Content",
    elementId: "all-content",
  },
]

export const youtubeHref = externalLinks.youtube
export const cadenceHref = "/cadence/"

export const editPageUrl = `${metadata.githubRepoBaseUrl}/blob/main/app/data/pages/learn.ts`
