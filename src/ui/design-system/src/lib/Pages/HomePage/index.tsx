import {
  Flips,
  LandingHeaderHome,
  HomepageStartList,
  SocialLinksSignup,
  ToolsAndConcepts,
  UpcomingEvents,
  HomepageBrowse,
} from "../../Components"
import {
  ContentNavigationList,
  ContentNavigationListProps,
} from "../../Components/ContentNavigationList"
import { FlipsProps } from "../../Components/Flips"
import { SocialLinksSignupProps } from "../../Components/SocialLinksSignup"
import { ToolCardProps } from "../../Components/ToolCard"
import { TutorialCardProps } from "../../Components/TutorialCard"
import { UpcomingEventsProps } from "../../Components/UpcomingEvents"
import PageBackground from "../shared/PageBackground"
import PageSection from "../shared/PageSection"
import PageSections from "../shared/PageSections"
import { HomepageStartItemProps } from "../../Components/HomepageStartItem"
import { HomepageBrowseItemProps } from "../../Components/HomepageBrowse"

export type HomePageProps = SocialLinksSignupProps & {
  concepts?: TutorialCardProps[]
  homepageStartProjectData: HomepageStartItemProps[]
  contentNavigationListItems: ContentNavigationListProps
  editPageUrl?: string
  flips: FlipsProps
  threeColumnItems: HomepageBrowseItemProps[]
  tools: ToolCardProps[]
  upcomingEvents: UpcomingEventsProps
}

const HomePage = ({
  concepts,
  homepageStartProjectData,
  contentNavigationListItems,
  discordUrl,
  discourseUrl,
  editPageUrl,
  flips,
  githubUrl,
  threeColumnItems,
  tools,
  twitterUrl,
  upcomingEvents,
}: HomePageProps) => {
  return (
    <PageBackground gradient="home">
      <LandingHeaderHome
        description="Discover the developer ecosystem and master the Flow blockchain"
        discordUrl={discordUrl}
        editPageUrl={editPageUrl}
        githubUrl={githubUrl}
        tag="onflow"
        title="Developer Portal"
      />
      <HomepageStartList items={homepageStartProjectData} />
      <PageSections>
        <PageSection sectionId="browse-by-topic">
          <HomepageBrowse items={threeColumnItems} topRounded={true} />
        </PageSection>
        <PageSection sectionId="sdks-and-tools">
          <ToolsAndConcepts
            tools={tools}
            concepts={concepts}
            headerLink={"sdks-and-tools"}
          />
        </PageSection>
        <PageSection sectionId="flips">
          <Flips {...flips} headerLink="flips" />
        </PageSection>
        {upcomingEvents.events.length > 0 && (
          <PageSection sectionId="upcoming-events">
            <UpcomingEvents {...upcomingEvents} headerLink="upcoming-events" />
          </PageSection>
        )}
        <PageSection sectionId="explore-more-content">
          <ContentNavigationList
            header={contentNavigationListItems.header}
            contentNavigationItems={
              contentNavigationListItems.contentNavigationItems
            }
            headerLink="explore-more-content"
          />
        </PageSection>
      </PageSections>
      <SocialLinksSignup
        discordUrl={discordUrl}
        discourseUrl={discourseUrl}
        githubUrl={githubUrl}
        twitterUrl={twitterUrl}
      />
    </PageBackground>
  )
}

export default HomePage
