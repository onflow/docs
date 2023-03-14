import { ReactComponent as EcosystemIcon } from "~/ui/design-system/images/content/ecosystem"
import { ReactComponent as SDKIcon } from "~/ui/design-system/images/content/sdk"
import { ReactComponent as UseCaseIcon } from "~/ui/design-system/images/content/use-cases"
import { ContentNavigationListProps } from "~/ui/design-system/src/lib/Components/ContentNavigationList"
import { HomepageStartItemProps } from "~/ui/design-system/src/lib/Components/HomepageStartItem"
import { metadata } from "../metadata"

const homepageStartProjectData: HomepageStartItemProps[] = [
  {
    title: "Learn Flow",
    text: "Dive into Flow key concepts through tutorials, guides, and examples",
    link: "/learn/concepts",
    icon: "learn",
  },
  {
    title: "Flow Quickstarts",
    text: "Run your frist Flow dApp in just a few clicks",
    link: "/tools/fcl-js/tutorials/flow-app-quickstart",
    icon: "quickstart",
  },
  {
    title: "Documentation",
    text: "All the developer resources you need to build on Flow",
    link: "/cadence",
    icon: "documentation",
  },
]

const homepageThreeColumnData: any = [
  {
    title: "Quickstarts",
    description:
      "Quick ways to get started in the environments for development.",
    icon: <UseCaseIcon height="1.5em" width="1.5em" />,
    links: [
      {
        title: "Get started locally",
        href: "https://github.com/emerald-dao/0-hello-world",
        tags: ["emulator"],
      },
      {
        title: "Get started on testnet",
        href: "/tools/fcl-js/tutorials/flow-app-quickstart/",
        tags: ["javascript"],
      },
      {
        title: "Get started on the playground",
        href: "/cadence/tutorial/02-hello-world/",
        tags: ["playground"],
      },
      {
        title: "View all tools and services",
        href: "/tools",
      },
    ],
  },
  {
    title: "Guides & Tutorials",
    description: "A more in-depth look at how dapp development works.",
    icon: <EcosystemIcon height="1.5em" width="1.5em" />,
    links: [
      {
        title: "Anatomy of a Flow dapp",
        href: "/flow/dapp-development/flow-dapp-anatomy/",
        tags: ["overview"],
      },
      {
        title: "Flow key concepts",
        href: "/learn/concepts/accounts-and-keys/",
        tags: ["accounts", "signing"],
      },
      {
        title: "Launch a Fungible Token on Flow",
        href: "/flow/fungible-tokens",
        tags: ["overview", "guide"],
      },
      {
        title: "View more learning resources",
        href: "/learn",
      },
    ],
  },
  {
    title: "Smart Contracts",
    description:
      "Use Cadence to interact with and create smart contracts on chain.",
    icon: <SDKIcon height="1.5em" width="1.5em" />,
    links: [
      {
        title: "Why Cadence?",
        href: "https://medium.com/coinmonks/how-cadence-and-flow-will-revolutionize-smart-contract-programming-607bd05b49b",
        tags: ["blog"],
      },
      {
        title: "Resource oriented programming",
        href: "/cadence#intuiting-ownership-with-resources",
        tags: ["overview"],
      },
      {
        title: "Cadence cookbook",
        href: "https://open-cadence.onflow.org/",
        tags: ["samples", "playground"],
      },
      {
        title: "View all Cadence content",
        href: "/cadence/",
      },
    ],
  },
]

const contentNavigationListItems: ContentNavigationListProps = {
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

export {
  homepageThreeColumnData,
  homepageStartProjectData,
  contentNavigationListItems,
}

export const editPageUrl = `${metadata.githubRepoBaseUrl}/blob/main/app/data/pages/home.tsx`
