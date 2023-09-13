import React from 'react';
import {
  Flips,
  LandingHeaderHome,
  HomepageStartList,
  ToolsAndConcepts,
  UpcomingEvents,
} from '../../Components';
import {
  ContentNavigationList,
  type ContentNavigationListProps,
} from '../../Components/ContentNavigationList';
import { type FlipsProps } from '../../Components/Flips';
import { type SocialLinksSignupProps } from '../../Components/SocialLinksSignup';
import { type ToolCardProps } from '../../Components/ToolCard';
import { type TutorialCardProps } from '../../Components/TutorialCard';
import { type UpcomingEventsProps } from '../../Components/UpcomingEvents';
import PageBackground from '../shared/PageBackground';
import PageSection from '../shared/PageSection';
import PageSections from '../shared/PageSections';
import { type HomepageStartItemProps } from '../../Components/HomepageStartItem';

export type HomePageProps = SocialLinksSignupProps & {
  concepts?: TutorialCardProps[];
  homepageStartProjectData: HomepageStartItemProps[];
  contentNavigationListItems: ContentNavigationListProps;
  editPageUrl?: string;
  flips: FlipsProps;
  tools: ToolCardProps[];
  upcomingEvents: UpcomingEventsProps;
};

const HomePage = ({
  concepts,
  homepageStartProjectData,
  contentNavigationListItems,
  discordUrl,
  editPageUrl,
  flips,
  githubUrl,
  tools,
  upcomingEvents,
}: HomePageProps): JSX.Element => {
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
        <PageSection sectionId="sdks-and-tools">
          <ToolsAndConcepts
            tools={tools}
            concepts={concepts}
            headerLink={'sdks-and-tools'}
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
    </PageBackground>
  );
};

export default HomePage;
