import { ContentNavigationListProps } from "~/ui/design-system/src/lib/Components/ContentNavigationList"
import { FeaturedArticleCardProps } from "~/ui/design-system/src/lib/Components/FeaturedArticleCard"
import { LandingHeaderProps } from "~/ui/design-system/src/lib/Components/LandingHeader"
import { LinkCard2ColumnProps } from "~/ui/design-system/src/lib/Components/LinkCard2Column"
import { SDKCardProps } from "~/ui/design-system/src/lib/Components/SDKCard"
import { ToolCardProps } from "~/ui/design-system/src/lib/Components/ToolCard"
import {
  getTheFlowDown,
  introToFlow,
  redSquirrelGetStartedArticle,
} from "../../data/articles"
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
} from "../../data/tools"
import { externalLinks } from "../external-links"
import { metadata } from "../metadata"

export const landingHeaderItems: LandingHeaderProps = {
  buttonText: "View Course",
  buttonUrl: "https://academy.ecdao.org/",
  callout: "Cadence Bootcamps",
  description: `Learn everything about the Flow Blockchain and the Cadence smart contract programming language with Emerald Academy -
  a Flow partner for open source educational content.`,
  discordUrl: externalLinks.discord,
  githubUrl: externalLinks.github,
  imageSrc: "https://academy.ecdao.org/thumb-beginner-cadence.png",
  title: "Getting Started",
}

// const linkCard3ColumnItems: LinkCard3ColumnProps = {
//   items: [
//     {
//       title: "Try",
//       description: "Examples curated to get you up and running in minutes.",
//       icon: <Icon1 />,
//       links: [
//         {
//           title: "Hello, World on Flow!",
//           href: "/cadence/tutorial/02-hello-world/",
//           tags: ["cadence", "playground"],
//         },
//         {
//           title: "Javascript Quickstart",
//           href: "/tools/fcl-js/tutorials/flow-app-quickstart/",
//           tags: ["tutorial", "beginner"],
//         },
//         {
//           title: "NFT Storefront & Marketplace",
//           href: "/learn/kitty-items/",
//           tags: ["example", "intermediate"],
//         },
//         {
//           title: "Cadence Cookbook",
//           href: "https://open-cadence.onflow.org/",
//           tags: ["samples", "playground"],
//         },
//         {
//           title: "Flow Block Explorer",
//           href: "https://flowscan.org/",
//         },
//       ],
//     },
//     {
//       title: "Learn",
//       description:
//         "Resources to help you understand how the Flow blockchain works.",
//       icon: <Icon2 />,
//       links: [
//         {
//           title: "Flow technical papers",
//           href: "https://www.onflow.org/technical-paper",
//           tags: ["protocol", "overview"],
//         },
//         {
//           title: "Youtube Tutorials",
//           href: "https://www.youtube.com/playlist?list=PLvcQxi9WyGdGUx-a4rCsLWn_WKlA9YAXP",
//           tags: ["tutorial", "beginner", "video"],
//         },
//         {
//           title: "Dapp architecture",
//           href: "/flow/dapp-development/DappArchitectures/",
//           tags: ["guide", "overview"],
//         },
//         {
//           title: "Beginner Cadence course",
//           href: "https://github.com/emerald-dao/beginner-cadence-course",
//           tags: ["guide", "beginner"],
//         },
//         {
//           title: "View more learning resources",
//           href: "/learn",
//         },
//       ],
//     },
//     {
//       title: "Build",
//       description: "First steps to start the development process on Flow.",
//       icon: <Icon3 />,
//       links: [
//         {
//           title: "Get the Flow CLI",
//           href: "/tools/flow-cli/install/",
//           tags: ["install"],
//         },
//         {
//           title: "Create a testnet account",
//           href: "https://testnet-faucet.onflow.org/",
//           tags: ["faucet", "create", "fund"],
//         },
//         {
//           title: "Core contracts & standards",
//           href: "/flow/core-contracts",
//           tags: ["nft", "ft", "metadata"],
//         },
//         {
//           title: "Launch a simple NFT",
//           href: "https://github.com/emerald-dao/1-simple-nft",
//           tags: ["tutorial", "beginner"],
//         },
//         {
//           title: "View all tools and services",
//           href: "/tools",
//         },
//       ],
//     },
//   ],
// }

export const linkCard2ColumnItems: LinkCard2ColumnProps = {
  buttonText: "View Concepts",
  buttonUrl: "/learn/concepts",
  description: `Learn the fundamental concepts that power the overall dapp experience on Flow.`,
  title: "Core Concepts",
  items: [
    {
      title: "Cadence",
      description:
        "Cadence is a resource-oriented programming language that introduces new features to smart contract programming.",
      href: "/cadence",
      iconType: "cadence",
    },
    {
      title: "Flow Client Library",
      description:
        "The Flow Client Library (FCL) JS is a package used to interact with user wallets, dapps, and the blockchain.",
      href: "/tools/fcl-js",
      iconType: "fcl",
    },
  ],
}

export const sdkCardItems: [
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps,
  SDKCardProps
] = [httpSDK, fclSDK, goSDK, unitySDK, pythonSDK, swiftSDK, jvmSDK]

export const contentNavigationListItems: ContentNavigationListProps = {
  header: "Explore More Content",
  contentNavigationItems: [
    {
      title: "Learn",
      text: "All the resources you need to learn and build.",
      link: "/learn",
      icon: "learn",
    },
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

export const recentArticleItems: [
  FeaturedArticleCardProps,
  FeaturedArticleCardProps,
  FeaturedArticleCardProps
] = [introToFlow, redSquirrelGetStartedArticle, getTheFlowDown]

export const recentToolItems: [ToolCardProps, ToolCardProps, ToolCardProps] = [
  overflowTool,
  flowserTool,
  eventIndexingTool,
]

export const editPageUrl = `${metadata.githubRepoBaseUrl}/blob/main/app/data/pages/getting-started.ts`
