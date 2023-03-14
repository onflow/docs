import { Meta, Story } from "@storybook/react"
import { LearnPage, LearnPageProps } from "."
import { data } from "./sample"

export default {
  component: LearnPage,
  title: "Pages/LearnPage",
} as Meta

const Template: Story<LearnPageProps> = (args) => (
  <LearnPage {...data} {...args} />
)

export const Default = Template.bind({})

export const dark = Template.bind({})
dark.args = Default.args
dark.parameters = {
  backgrounds: {
    default: "dark",
  },
}

export const mobile = Template.bind({})
mobile.parameters = {
  viewport: {
    defaultViewport: "xs",
  },
}
