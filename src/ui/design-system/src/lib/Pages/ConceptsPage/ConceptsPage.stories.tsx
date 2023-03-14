import { Meta, Story } from "@storybook/react"

import { data } from "./sample"
import { ConceptsPage, ConceptsPageProps } from "."

export default {
  component: ConceptsPage,
  title: "Pages/ConceptsPage",
} as Meta

const Template: Story<ConceptsPageProps> = (args) => <ConceptsPage {...args} />

const conceptsPageArgs = {
  landingHeaderItems: data.landingHeaderItems,
  featureLinkBlockItems: data.featureLinkBlockItems,
  toolCardItems: data.toolCardItems,
  contentNavigationListItems: data.contentNavigationListItems,
  eventCardItems: data.eventCardItems,
}
export const Default = Template.bind({})
Default.args = conceptsPageArgs

export const Mobile = Template.bind({})
Mobile.args = conceptsPageArgs
Mobile.parameters = {
  viewport: {
    defaultViewport: "xs",
  },
}
