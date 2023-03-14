import { Meta, Story } from "@storybook/react"
import ToolsAndConcepts, { ToolsAndConceptsProps } from "."

export default {
  component: ToolsAndConcepts,
  title: "Components/ToolsAndConcepts",
  parameters: {
    layout: "centered",
  },
} as Meta

const tutorialCard = {
  heading: "This is a title with a header in a two line sentence",
  tags: ["Tool"],
  description: "An online contest that lorem ipsum ipsums ipsum",
  lastUpdated: "23/3/2022",
  level: "Beginners",
  imageUri:
    "https://assets.website-files.com/5f6294c0c7a8cdf432b1c827/5f6294c0c7a8cda922b1c968_Flow%2520Wide%2520Design-p-3200.png",
  link: "/tutorials",
}

const Template: Story<ToolsAndConceptsProps> = (args) => {
  return <ToolsAndConcepts {...args} />
}

const tools = Array(6).fill({
  title: "Flow Port",
  authorIcon: "https://avatars.githubusercontent.com/u/62387156?s=64&v=4",
  authorName: "mini flow",
  tags: ["Tags"],
  link: "#",
  stars: 52,
  description:
    "Lorem ipsum text here can go a two liner sentence or a one liner",
})

const DefaultArgs: ToolsAndConceptsProps = {
  tools,
  concepts: Array(10).fill(tutorialCard),
  headerLink: "#",
}
export const Default = Template.bind({})
Default.args = DefaultArgs

export const ToolsOnly = Template.bind({})
ToolsOnly.args = {
  ...Default.args,
  concepts: undefined,
}

export const dark = Template.bind({})
dark.args = DefaultArgs
dark.parameters = {
  backgrounds: {
    default: "dark",
  },
}

export const mobile = Template.bind({})
mobile.args = DefaultArgs
mobile.parameters = {
  viewport: {
    defaultViewport: "xs",
  },
}
