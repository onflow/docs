import { Meta, Story } from "@storybook/react"
import CommunityPage, { CommunityPageProps } from "."
import { Default as DefaultCommunityMembers } from "../../Components/CommunityMembers/CommunityMembers.stories"
import { Default as DefaultContentNavigationItem } from "../../Components/ContentNavigation/ContentNavigation.stories"
import { Default as DefaultFeaturedArticles } from "../../Components/FeaturedArticleSlider/FeaturedArticleSlider.stories"
import { Default as DefaultFlips } from "../../Components/Flips/Flips.stories"
import { Default as DefaultProjects } from "../../Components/ProjectCards/ProjectCards.stories"
import { Default as DefaultTools } from "../../Components/ToolsAndConcepts/ToolsAndConcepts.stories"
import { Default as DefaultUpcomingEvents } from "../../Components/UpcomingEvents/UpcomingEvents.stories"
import { Default as DefaultForumCell } from "../../Components/ForumCell/ForumCell.stories"

export default {
  component: CommunityPage,
  title: "Pages/CommunityPage",
} as Meta
const Template: Story<CommunityPageProps> = (args) => (
  <CommunityPage {...args} />
)

export const Default = Template.bind({})
Default.args = {
  upcomingEvents: DefaultUpcomingEvents.args,
  openFlips: DefaultFlips.args.openFlips,
  goodPlacesToStartFlips: DefaultFlips.args.goodPlacesToStartFlips,
  communityMembers: DefaultCommunityMembers.args,
  projects: DefaultProjects.args.projects,
  articles: DefaultFeaturedArticles.args.articles,
  tools: DefaultTools.args.tools,
  contentNavigationListItems: {
    header: "Explore More Content",
    contentNavigationItems: [
      {
        ...DefaultContentNavigationItem.args,
        title: "Bug bounty",
        icon: "bug",
      },
      {
        ...DefaultContentNavigationItem.args,
        title: "Contribute",
        icon: "community",
      },
      {
        ...DefaultContentNavigationItem.args,
        title: "Get funding",
        icon: "funding",
      },
    ],
  },
  forumTopics: Array(3).fill(DefaultForumCell.args),
}

export const dark = Template.bind({})
dark.args = Default.args
dark.parameters = {
  backgrounds: {
    default: "dark",
  },
}

export const mobile = Template.bind({})
mobile.args = Default.args
mobile.parameters = {
  viewport: {
    defaultViewport: "xs",
  },
}
