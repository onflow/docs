import React from 'react';
import { ToolsAndConcepts, UpcomingEvents } from '../../Components';
import { ButtonLink } from '../../Components/Button';
import CommunityImage from '../../../../images/page/community.png';
import { type CommunityMembersProps } from '../../Components/CommunityMembers';
import {
  ContentNavigationList,
  type ContentNavigationListProps,
} from '../../Components/ContentNavigationList';
import Flips, { type FlipsProps } from '../../Components/Flips';
import ForumCell, { type ForumCellProps } from '../../Components/ForumCell';
import { HeaderWithLink } from '../../Components/HeaderWithLink';
import { LandingHeader } from '../../Components/LandingHeader';
import {
  LandingPageSecondaryNav,
  type LandingPageSecondaryNavProps,
} from '../../Components/LandingPageSecondaryNav';
import ProjectCards, {
  type ProjectCardsProps,
} from '../../Components/ProjectCards';
import { type ToolsAndConceptsProps } from '../../Components/ToolsAndConcepts';
import { type UpcomingEventsProps } from '../../Components/UpcomingEvents';
import PageBackground from '../shared/PageBackground';
import PageSection from '../shared/PageSection';
import PageSections from '../shared/PageSections';
import { type Article } from '../../interfaces';

export type CommunityPageProps = FlipsProps &
  ProjectCardsProps &
  ToolsAndConceptsProps & {
    articles?: Article[];
    communityMembers?: CommunityMembersProps;
    contentNavigationListItems: ContentNavigationListProps;
    discordUrl: string;
    discourseUrl: string;
    editPageUrl?: string;
    forumTopics: ForumCellProps[];
    secondaryNavSections: LandingPageSecondaryNavProps['sections'];
    upcomingEvents: UpcomingEventsProps;
  };

export default function CommunityPage({
  // articles,
  // communityMembers,
  contentNavigationListItems,
  discordUrl,
  discourseUrl,
  editPageUrl,
  forumTopics,
  githubUrl,
  goodPlacesToStartFlips,
  openFlips,
  projects,
  secondaryNavSections,
  tools,
  upcomingEvents,
}: CommunityPageProps): JSX.Element {
  return (
    <PageBackground gradient="community">
      <LandingPageSecondaryNav sections={secondaryNavSections} />
      <PageSections>
        <PageSection className="pt-0 pb-0">
          <LandingHeader
            buttonText="More Information"
            buttonUrl="https://flow.com/ecosystemsupport"
            callout="The Flow Ecosystem Fund"
            description="Our $725 Million Flow Ecosystem Fund is designed to hypercharge innovation and growth across the Flow community."
            discordUrl={discordUrl}
            editPageUrl={editPageUrl}
            githubUrl={githubUrl}
            imageSrc={CommunityImage}
            title="Community"
          />
        </PageSection>
        {upcomingEvents.events.length > 0 && (
          <PageSection sectionId="upcoming-events">
            <UpcomingEvents {...upcomingEvents} headerLink="upcoming-events" />
          </PageSection>
        )}
        <PageSection sectionId="flips">
          <Flips
            githubUrl={githubUrl}
            goodPlacesToStartFlips={goodPlacesToStartFlips}
            headerLink="flips"
            openFlips={openFlips}
          />
        </PageSection>
        <PageSection sectionId="featured-initiatives">
          <ProjectCards projects={projects} headerLink="featured-initiatives" />
        </PageSection>
        <PageSection sectionId="tools">
          <ToolsAndConcepts tools={tools} headerLink="tools" />
        </PageSection>
        {/* <PageSection sectionId="featured-articles">
          <FeaturedArticleSlider
            articles={articles}
            headerLink="featured-articles"
          />
        </PageSection> */}
        <PageSection sectionId="from-the-forum">
          <div className="container mb-8">
            <div className="mb-10 flex items-center justify-between">
              <HeaderWithLink headerLink="from-the-forum" className="text-h2">
                From the forum
              </HeaderWithLink>
              <ButtonLink
                rightIcon="right"
                href={discourseUrl}
                variant="secondary"
                className="ml-4 hidden md:flex"
              >
                Go to Forum
              </ButtonLink>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {forumTopics.map((topic: ForumCellProps, index: number) => (
                <ForumCell {...topic} key={index} />
              ))}
            </div>
          </div>
        </PageSection>
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
}
