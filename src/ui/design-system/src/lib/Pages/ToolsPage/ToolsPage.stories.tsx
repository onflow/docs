import { Meta, Story } from "@storybook/react"
import React from "react"
import ToolsPage, { ToolsPageProps } from "."

export default {
  component: ToolsPage,
  title: "Pages/ToolsPage",
} as Meta

const Template: Story<ToolsPageProps> = (args) => <ToolsPage {...args} />

const args = {
  tools: Array(6).fill({
    title: "Flow Port",
    authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
    authorName: "mini flow",
    tags: ["Tags"],
    link: "#",
    type: "tool",
    stars: 52,
    iconSrc: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
    description:
      "Lorem ipsum text here can go a two liner sentence or a one liner",
  }),
  sdks: Array(6).fill({
    title: "Flow Port",
    authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
    authorName: "mini flow",
    tags: ["Tags"],
    link: "#",
    type: "sdk",
    stars: 52,
    iconSrc: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
    lastCommit: "2022-03-22",
    lastRelease: "207",
  }),
  contentNavigationListItems: {
    contentNavigationItems: [
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
      {
        title: "Concepts",
        text: "Lorem ipsum dolor sit amet proin gravida lorem ipsum",
        link: "#",
        icon: "concepts",
      },
    ],
  },
  apisAndServices: Array(6).fill({
    heading: "Such title, much heading",
    tags: ["Tool"],
    description: "An online contest that lorem ipsum ipsums ipsum",
    lastUpdated: "23/3/2022",
    level: "Beginners",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/2560px-A_black_image.jpg",
    link: "/tutorials",
  }),
  explorers: Array(6).fill({
    heading: "Such title, much heading",
    tags: ["Tool"],
    description: "An online contest that lorem ipsum ipsums ipsum",
    lastUpdated: "23/3/2022",
    level: "Beginners",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/2560px-A_black_image.jpg",
    link: "/tutorials",
  }),
} as ToolsPageProps

export const Default = Template.bind({})
Default.args = args

export const mobile = Template.bind({})
mobile.args = args
mobile.parameters = {
  viewport: {
    defaultViewport: "xs",
  },
}

export const dark = Template.bind({})
dark.args = args
dark.parameters = {
  backgrounds: {
    default: "dark",
  },
}
