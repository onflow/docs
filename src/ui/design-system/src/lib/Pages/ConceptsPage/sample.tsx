import FclIconSrc from "../../../../images/tools/tool-fcl.svg"
import CadenceIconSrc from "../../../../images/tools/tool-cadence.svg"
import FlowPortIconSrc from "../../../../images/tools/tool-port.svg"
import EmulatorIconSrc from "../../../../images/tools/tool-emulator.svg"
import FLOWCLIIconSrc from "../../../../images/tools/tool-cli.svg"
import { ConceptsPageProps } from "."

export const data: ConceptsPageProps = {
  discordUrl: "https://onflow.org/discord",
  githubUrl: "https://github.com/onflow",
  landingHeaderItems: {
    buttonText: "Button Text",
    buttonUrl: "#changeme",
    callout: "Featured callout here two lines",
    description:
      "Lorem ipsum dolor sit amet proin gravida lorem ipsum dolor sit.",
    title: "Concepts",
    discordUrl: "https://onflow.org/discord",
    githubUrl: "https://github.com/onflow",
  },
  featureLinkBlockItems: [
    {
      ctaLink: "",
      ctaText: "Get started",
      description:
        "Everything you need to start building on Flow is lorem ipsum Everything",
      iconSrc: CadenceIconSrc,
      links: [
        {
          href: "#reference",
          title: "Cadence reference",
        },
        {
          href: "#tutorial",
          title: "Transactions",
        },
        {
          href: "#transactions",
          title: "Scripts",
        },
        {
          href: "https://www.onflow.org",
          title: "External",
        },
        {
          href: "#scripts",
          title: "Scripts",
        },
      ],
      title: "Cadence",
    },
    {
      ctaLink: "",
      ctaText: "Get started",
      description:
        "Everything you need to start building on Flow is lorem ipsum Everything",
      iconSrc: FclIconSrc,
      links: [
        {
          href: "#reference",
          title: "Flow client library reference",
        },
        {
          href: "#tutorial",
          title: "This is a tutorial",
        },
        {
          href: "#transactions",
          title: "Transactions",
        },
        {
          href: "https://www.onflow.org",
          title: "External",
        },
        {
          href: "#scripts",
          title: "Scripts",
        },
      ],
      title: "Flow Client Library",
    },
  ],
  toolCardItems: [
    {
      title: "Flow Port",
      authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
      authorName: "mini flow",
      tags: ["Tags"],
      link: "#",
      stars: 52,
      iconSrc: FlowPortIconSrc,
      description:
        "Lorem ipsum text here can go a two liner sentence or a one liner",
    },
    {
      title: "Flow CLI",
      authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
      authorName: "mini flow",
      tags: ["Tags"],
      link: "#",
      stars: 52,
      iconSrc: FLOWCLIIconSrc,
      description:
        "Lorem ipsum text here can go a two liner sentence or a one liner",
    },
    {
      title: "Flow Emulator",
      authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
      authorName: "mini flow",
      tags: ["Tags"],
      link: "#",
      stars: 52,
      iconSrc: EmulatorIconSrc,
      description:
        "Lorem ipsum text here can go a two liner sentence or a one liner",
    },
    {
      title: "Flow Port",
      authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
      authorName: "mini flow",
      tags: ["Tags"],
      link: "#",
      stars: 52,
      iconSrc: FlowPortIconSrc,
      description:
        "Lorem ipsum text here can go a two liner sentence or a one liner",
    },
    {
      title: "Flow CLI",
      authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
      authorName: "mini flow",
      tags: ["Tags"],
      link: "#",
      stars: 52,
      iconSrc: FLOWCLIIconSrc,
      description:
        "Lorem ipsum text here can go a two liner sentence or a one liner",
    },
    {
      title: "Flow Emulator",
      authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
      authorName: "mini flow",
      tags: ["Tags"],
      link: "#",
      stars: 52,
      iconSrc: EmulatorIconSrc,
      description:
        "Lorem ipsum text here can go a two liner sentence or a one liner",
    },
  ],
  contentNavigationListItems: {
    header: "Explore More Content",
    contentNavigationItems: [
      {
        title: "Get Started",
        text: "Lorem ipsum dolor sit amet proin gravida lorem ipsum",
        link: "#",
        icon: "get-started",
      },
      {
        title: "Learn",
        text: "Lorem ipsum dolor sit amet proin gravida lorem ipsum",
        link: "#",
        icon: "learn",
      },
      {
        title: "Tools",
        text: "Lorem ipsum dolor sit amet proin gravida lorem ipsum",
        link: "#",
        icon: "tools",
      },
    ],
  },
  eventCardItems: {
    ctaText: "CTA text",
    description:
      "Everything you need to start building on Flow verything you need to start building on Flow everything you need to start building on Flow",
    eventDate: "Mar 23",
    href: "#changeme",
    imageSrc:
      "https://assets.website-files.com/5f6294c0c7a8cdf432b1c827/61689102d3325e237fd44b76_unnamed%20(8).png",
    title: "Start Building",
  },
}
