import React from "react"
import {
  Flips,
  LandingHeaderHome,
  HomepageStartList,
  UpcomingEvents,
} from "../../Components"
import {
  ContentNavigationList,
  type ContentNavigationListProps,
} from "../../Components/ContentNavigationList"
import {type SocialLinksSignupProps} from "../../Components/SocialLinksSignup"
import {type TutorialCardProps} from "../../Components/TutorialCard"
import {type UpcomingEventsProps} from "../../Components/UpcomingEvents"
import PageBackground from "../shared/PageBackground"
import PageSection from "../shared/PageSection"
import PageSections from "../shared/PageSections"

export type HomePageProps = SocialLinksSignupProps & {
  concepts?: TutorialCardProps[]
  contentNavigationListItems: ContentNavigationListProps
  upcomingEvents: UpcomingEventsProps
}

const Description = (): JSX.Element => (
  <>
    Dive into a rich collection of resources, tutorials, autonomous realms and vibrant communities that unlock the full potential of Web3. Whether a tinkerer or a seasoned developer, find everything you need to start and elevate your projects.
  </>
)

const HomePage = ({
  contentNavigationListItems,
  discordUrl,
  githubUrl,
  upcomingEvents,
}: HomePageProps): JSX.Element => {

  return (
    <PageBackground gradient='home'>
      <LandingHeaderHome
        description={<Description />}
        discordUrl={discordUrl}
        githubUrl={githubUrl}
        tag='onflow'
        title='Build with Flow'
      />
      <HomepageStartList />
      <PageSections>
        {upcomingEvents.events.length > 0 && (
          <PageSection sectionId='upcoming-events'>
            <UpcomingEvents {...upcomingEvents} headerLink='upcoming-events' />
          </PageSection>
        )}
        <PageSection sectionId='explore-more-content'>
          <ContentNavigationList
            header={contentNavigationListItems.header}
            contentNavigationItems={
              contentNavigationListItems.contentNavigationItems
            }
            headerLink='explore-more-content'
          />
        </PageSection>
      </PageSections>
    </PageBackground>
  )
}

export default HomePage
