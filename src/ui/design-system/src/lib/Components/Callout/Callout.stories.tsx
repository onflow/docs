import { Meta, Story } from "@storybook/react"
import Callout, { CalloutProps } from "."

export default {
  component: Callout,
  title: "Components/Callout",
  parameters: {
    layout: "padded",
  },
} as Meta

const Template: Story<CalloutProps> = (args) => {
  return <Callout {...args} />
}

export const Default = Template.bind({})
Default.args = {
  heading: "Spork FAQ",
  description: "Lorem ipsum dolor sit amet proin gravida lorem ipsum",
  ctaText: "View FAQ",
  ctaLink: "https://google.com",
}

export const Mobile = Template.bind({})
Mobile.args = {
  heading: "Spork FAQ",
  description: "Lorem ipsum dolor sit amet proin gravida lorem ipsum",
  ctaText: "View FAQ",
  ctaLink: "https://google.com",
}
Mobile.parameters = {
  viewport: {
    defaultViewport: "xs",
  },
}
